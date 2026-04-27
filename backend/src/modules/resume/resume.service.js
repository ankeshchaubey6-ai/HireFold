import crypto from "crypto";
import { ResumeModel } from "./resume.model.js";
import { parseResumeBuffer } from "./resumeParser.service.js";
import { normalizeResumeData } from "./resumeStandardization.service.js";
import ATSService from "../ats/ats.service.js";
import { enqueueResumeAnalysis, isResumeQueueConfigured } from "../../queues/resumeAnalysis.queue.js";

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

    const parseResult = await parseResumeBuffer(file.buffer, file.mimetype, file.originalname);
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

    if (!isResumeQueueConfigured()) {
      const analysis = await ATSService.analyzeResume(entity.toObject());
      await this.updateResumeAnalysis(resumeId, analysis);
      return ResumeModel.findOne({ resumeId }).lean();
    }

    try {
      await enqueueResumeAnalysis({
        resumeId,
        jobRole: "default",
      });

      await ResumeModel.updateOne(
        { resumeId },
        {
          $set: {
            "structuredData.meta.analysisStatus": "queued",
            updatedAt: Date.now(),
          },
        }
      );
    } catch (error) {
      console.error("[QUEUE] Falling back to synchronous analysis:", error?.message || error);
      const analysis = await ATSService.analyzeResume(entity.toObject());
      await this.updateResumeAnalysis(resumeId, analysis);
    }

    return ResumeModel.findOne({ resumeId }).lean();
  },

  async getResumeById(resumeId) {
    if (!resumeId) return null;
    try {
      return await ResumeModel.findOne({ resumeId }).lean();
    } catch {
      return null;
    }
  },

  async getResumesByUser(userId) {
    if (!userId) return [];
    try {
      return await ResumeModel.find({ userId }).sort({ updatedAt: -1 }).lean();
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
    const result = await ResumeModel.updateOne(
      { resumeId },
      {
        $set: {
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
        },
      }
    );

    console.log("[DB] ATS result saved for resumeId:", resumeId);
    return result;
  },
};
