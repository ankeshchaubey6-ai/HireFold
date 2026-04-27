import crypto from "crypto";
import { ResumeModel } from "./resume.model.js";
import { parseResumeBuffer } from "./resumeParser.service.js";
import { normalizeResumeData } from "./resumeStandardization.service.js";
import ATSService from "../ats/ats.service.js";
import { enqueueResumeAnalysis, isResumeQueueConfigured } from "../../queues/resumeAnalysis.queue.js";

function hasMeaningfulResumeContent(structuredData = {}) {
  return Boolean(
    String(structuredData?.rawText || "").trim().length > 100 ||
      String(structuredData?.summary || "").trim() ||
      structuredData?.skills?.length ||
      structuredData?.experience?.length ||
      structuredData?.education?.length ||
      structuredData?.projects?.length ||
      structuredData?.certifications?.length ||
      structuredData?.basics?.fullName ||
      structuredData?.basics?.email
  );
}

function shouldRefreshAnalysis(resume = {}) {
  if (!resume || !hasMeaningfulResumeContent(resume.structuredData)) {
    return false;
  }

  const score = Number(resume.atsScore);
  const hasStoredSections =
    resume?.ats?.sectionScores &&
    Object.keys(resume.ats.sectionScores).length > 0;

  return !Number.isFinite(score) || score <= 0 || !hasStoredSections;
}

export const ResumeService = {
  async upsertResume(payload) {
    const {
      resumeId,
      userId = "anonymous",
      title = "Untitled Resume",
      source = "builder",
      templateId = null,
      structuredData = {},
      isEditable = true,
      isDraft = true,
      snapshotHtml = null,
      snapshotCss = null,
      originalFileMeta = null,
    } = payload;

    if (!resumeId) throw new Error("resumeId is required");

    const normalizedStructuredData =
      source === "upload"
        ? normalizeResumeData(structuredData, {
            parser: structuredData?.parser || "fallback",
            parseQuality: structuredData?.parseQuality || "low",
            meta: structuredData?.meta || {},
          })
        : structuredData;

    return ResumeModel.findOneAndUpdate(
      { resumeId },
      {
        $set: {
          resumeId,
          userId,
          title,
          source,
          templateId,
          structuredData: normalizedStructuredData,
          isEditable,
          isDraft,
          snapshotHtml,
          snapshotCss,
          originalFileMeta,
          updatedAt: Date.now(),
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    ).lean();
  },

  async uploadAndParseResume(file, user) {
    if (!file) throw new Error("Resume file is required");

    console.log(
      "[PIPELINE] Resume received:",
      file.originalname,
      "size:",
      file.size,
      "type:",
      file.mimetype
    );

    const userId = user?.id || user?._id || user?.userId || "anonymous";
    const resumeId = crypto.randomUUID();

    let parseResult;
    try {
      parseResult = await parseResumeBuffer(file.buffer, file.mimetype, file.originalname);
    } catch (error) {
      console.error("[PIPELINE] parseResumeBuffer failed:", error);
      throw error;
    }

    console.log("[PIPELINE] Raw parsed data received from parser:", JSON.stringify(parseResult));

    const structuredData = normalizeResumeData(parseResult.structuredData, {
      parser: parseResult.structuredData?.parser,
      parseQuality: parseResult.structuredData?.parseQuality,
      meta: {
        ...(parseResult.structuredData?.meta || {}),
        resumeId,
        source: "upload",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        analysisStatus: "processing",
      },
    });

    console.log("[PIPELINE] basics:", JSON.stringify(structuredData.basics));
    console.log("[PIPELINE] summary:", structuredData.summary);
    console.log("[PIPELINE] skills:", JSON.stringify(structuredData.skills));
    console.log("[PIPELINE] experience:", JSON.stringify(structuredData.experience));
    console.log("[PIPELINE] education:", JSON.stringify(structuredData.education));
    console.log("[PIPELINE] projects:", JSON.stringify(structuredData.projects));

    const entity = await ResumeModel.create({
      resumeId,
      userId,
      title: file.originalname?.replace(/\.[^/.]+$/, "") || "Uploaded Resume",
      source: "upload",
      templateId: null,
      isEditable: false,
      isDraft: false,
      atsScore: null,
      ats: null,
      snapshotHtml: null,
      snapshotCss: null,
      originalFileMeta: {
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        cloudUrl: null,
        cloudPublicId: null,
        uploadedAt: Date.now(),
      },
      meta: {
        schema: "resume-entity-v4",
        createdFrom: "upload",
        isAnonymous: userId === "anonymous",
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      structuredData,
    });

    let analysis;
    try {
      analysis = await ATSService.analyzeResume(entity.toObject());
    } catch (error) {
      console.error("[PIPELINE] ATSService.analyzeResume failed:", error);
      throw error;
    }

    console.log("[PIPELINE] ATS contact score:", analysis?.sectionScores?.contact);
    console.log("[PIPELINE] ATS summary score:", analysis?.sectionScores?.summary);
    console.log("[PIPELINE] ATS skills score:", analysis?.sectionScores?.skills);
    console.log("[PIPELINE] ATS experience score:", analysis?.sectionScores?.experience);
    console.log("[PIPELINE] ATS education score:", analysis?.sectionScores?.education);
    console.log("[PIPELINE] ATS projects score:", analysis?.sectionScores?.projects);
    console.log("[PIPELINE] ATS final total score before saving:", analysis?.totalScore ?? analysis?.score);

    await this.updateResumeAnalysis(resumeId, analysis);

    if (isResumeQueueConfigured()) {
      try {
        await enqueueResumeAnalysis({
          resumeId,
          jobRole: "default",
        });
      } catch (error) {
        console.error("[QUEUE] Background queue skipped:", error?.message || error);
      }
    }

    return ResumeModel.findOne({ resumeId }).lean();
  },

  async getResumeById(resumeId) {
    if (!resumeId) return null;
    try {
      let resume = await ResumeModel.findOne({ resumeId }).lean();
      if (shouldRefreshAnalysis(resume)) {
        try {
          const analysis = await ATSService.analyzeResume(resume);
          await this.updateResumeAnalysis(resumeId, analysis);
        } catch (error) {
          console.error("[PIPELINE] getResumeById refresh analysis failed:", error);
        }
        resume = await ResumeModel.findOne({ resumeId }).lean();
      }

      return resume;
    } catch {
      return null;
    }
  },

  async getResumesByUser(userId) {
    if (!userId) return [];
    try {
      const resumes = await ResumeModel.find({ userId }).sort({ updatedAt: -1 }).lean();

      const refreshed = await Promise.all(
        resumes.map(async (resume) => {
          if (!shouldRefreshAnalysis(resume)) {
            return resume;
          }

          try {
            const analysis = await ATSService.analyzeResume(resume);
            await this.updateResumeAnalysis(resume.resumeId, analysis);
            return {
              ...resume,
              atsScore: analysis.totalScore ?? analysis.score,
              ats: analysis.ats,
              structuredData: analysis.structuredData,
            };
          } catch (error) {
            console.error("[PIPELINE] getResumesByUser refresh analysis failed:", error);
            return resume;
          }
        })
      );

      return refreshed;
    } catch {
      return [];
    }
  },

  async deleteResume(resumeId, userId = null) {
    const query = { resumeId };
    if (userId) query.userId = userId;
    return ResumeModel.deleteOne(query);
  },

  async updateResumeAnalysis(resumeId, analysisData) {
    const atsResult = {
      atsScore: analysisData.totalScore ?? analysisData.score,
      ats: analysisData.ats,
      structuredData: {
        ...analysisData.structuredData,
        meta: {
          ...(analysisData.structuredData?.meta || {}),
          analysisStatus: "completed",
          atsEvaluatedAt: Date.now(),
        },
      },
      updatedAt: Date.now(),
    };

    console.log("[DB SAVE] Saving ATS result:", JSON.stringify(atsResult));

    const result = await ResumeModel.updateOne(
      { resumeId },
      {
        $set: atsResult,
      }
    );

    const savedResume = await ResumeModel.findOne({ resumeId })
      .select("resumeId atsScore ats")
      .lean();

    console.log("[DB SAVE] Saved resume ATS snapshot:", JSON.stringify(savedResume));

    console.log("[DB] ATS result saved for resumeId:", resumeId);
    return result;
  },
};
