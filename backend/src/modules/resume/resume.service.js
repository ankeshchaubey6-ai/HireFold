import crypto from "crypto";
import { ResumeModel } from "./resume.model.js";
import { parseResumeBuffer } from "./resumeParser.service.js";

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

    const resume = await ResumeModel.findOneAndUpdate(
      { resumeId },
      {
        $set: {
          resumeId,
          userId,
          title,
          source,
          templateId,
          structuredData,
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

    // Queue ATS analysis for resumes with substantial structured data
    // Works for both draft (auto-save) and final resumes
    const hasSkills = structuredData?.skills?.length > 0;
    const hasExperience = structuredData?.experience?.length > 0;
    const hasEducation = structuredData?.education?.length > 0;
    const hasSomething = hasSkills || hasExperience || hasEducation;

    if (hasSomething) {
      try {
        const { resumeAnalysisQueue } = await import("../../queues/resumeAnalysis.queue.js");
        
        // Check if already queued/analyzed
        const currentResume = await ResumeModel.findOne({ resumeId });
        const analysisStatus = currentResume?.structuredData?.meta?.analysisStatus;
        
        // Only queue if not already queued/completed
        if (!analysisStatus || analysisStatus === "processing") {
          try {
            await resumeAnalysisQueue.add(
              "analyze-resume",
              {
                resumeId,
                jobRole: "default",
                source: source || "builder"
              },
              {
                attempts: 3,
                removeOnComplete: true,
                removeOnFail: false,
                backoff: { type: "exponential", delay: 5000 },
              }
            );

            // Update status to queued
            await ResumeModel.updateOne(
              { resumeId },
              {
                $set: {
                  "structuredData.meta.analysisStatus": "queued",
                  updatedAt: Date.now(),
                },
              }
            );
          } catch (queueErr) {
            // Queue failed - run analysis synchronously as fallback
            console.warn(`Queue failed, running ATS synchronously: ${queueErr.message}`);
            try {
              const ATSService = (await import("../ats/ats.service.js")).default;
              const freshResume = await ResumeModel.findOne({ resumeId });
              const analysis = await ATSService.analyzeResume(freshResume, "default");
              
              await ResumeModel.updateOne(
                { resumeId },
                {
                  $set: {
                    atsScore: analysis.score,
                    ats: analysis.ats,
                    "structuredData.meta.analysisStatus": "completed",
                    "structuredData.meta.evaluatedAt": Date.now(),
                    updatedAt: Date.now(),
                  },
                }
              );
            } catch (analysisErr) {
              console.error(`Synchronous ATS analysis failed: ${analysisErr.message}`);
              // Mark as failed
              await ResumeModel.updateOne(
                { resumeId },
                {
                  $set: {
                    "structuredData.meta.analysisStatus": "ats_failed",
                    "structuredData.meta.analysisError": analysisErr.message,
                    updatedAt: Date.now(),
                  },
                }
              );
            }
          }
        }
      } catch (err) {
        console.error(`Failed to process ATS for ${resumeId}:`, err.message);
        // Don't throw - save should succeed even if ATS fails
      }
    }

    return resume;
  },

  async uploadAndParseResume(file, user) {
    if (!file) throw new Error("Resume file is required");

    const userId =
      user?.id ||
      user?._id ||
      user?.userId ||
      "anonymous";

    const resumeId = crypto.randomUUID();

    /* ================= FAST PARSE ================= */

    let structuredData = {
      meta: {
        source: "upload",
        parser: "pdfjs-fast",
        parseQuality: "unknown",
        analysisStatus: "processing",
        needsOCR: true,
      },
      basics: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: ""
      },
      summary: "Resume uploaded. AI analysis in progress.",
      skills: [],
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      features: {
        totalSkills: 0,
        experienceCount: 0,
        educationCount: 0,
        projectCount: 0,
        wordCount: 0,
        totalExperienceMonths: 0,
        highestEducationLevel: 0,
        hasAdvancedDegree: false,
        highComplexProjects: 0,
        skillCounts: {},
        skillDiversity: 0,
        averageExperienceMonths: 0,
        projectTechDiversity: 0,
        certificationCount: 0,
        sectionCount: 0,
        textComplexity: "low",
        normalized: {
          skillsNorm: 0,
          experienceNorm: 0,
          educationNorm: 0,
          projectsNorm: 0
        }
      },
      rawText: "",
    };

    try {
      const parseResult = await parseResumeBuffer(
        file.buffer,
        file.mimetype,
        file.originalname
      );

      if (parseResult?.structuredData) {
        // Merge the parsed data with our structure
        structuredData = {
          ...structuredData,
          ...parseResult.structuredData,
          // Ensure all required fields exist
          basics: {
            ...structuredData.basics,
            ...(parseResult.structuredData.basics || {})
          },
          features: {
            ...structuredData.features,
            ...(parseResult.structuredData.features || {})
          },
          skills: parseResult.structuredData.skills || [],
          experience: parseResult.structuredData.experience || [],
          education: parseResult.structuredData.education || [],
          projects: parseResult.structuredData.projects || [],
          certifications: parseResult.structuredData.certifications || [],
        };
      }
    } catch (err) {
      void err;
    }

    structuredData.meta = {
      ...(structuredData.meta || {}),
      resumeId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      analysisStatus: "processing",
    };

    /* ================= CREATE RESUME ENTITY ================= */
    // Ensure all required fields have proper defaults
    const entity = {
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
      structuredData: structuredData
    };

    /* ================= SAVE TO DATABASE ================= */
    try {
      const savedResume = await ResumeModel.create(entity);
      
      /* ================= QUEUE FOR DEEP ANALYSIS ================= */
      try {
        const { resumeAnalysisQueue } = await import("../../queues/resumeAnalysis.queue.js");
        
        await resumeAnalysisQueue.add(
          "analyze-resume",
          {
            resumeId,
            buffer: file.buffer.toString("base64"),
            mimeType: file.mimetype,
            fileName: file.originalname,
            jobRole: "default"
          },
          {
            attempts: 3,
            removeOnComplete: true,
            removeOnFail: false,
            backoff: { type: "exponential", delay: 5000 },
          }
        );

        // Update status to queued
        await ResumeModel.updateOne(
          { resumeId },
          {
            $set: {
              "structuredData.meta.analysisStatus": "queued",
              updatedAt: Date.now(),
            },
          }
        );
      } catch (queueErr) {
        // Queue failed - run analysis synchronously as fallback
        console.warn(`Queue failed during upload, running ATS synchronously: ${queueErr.message}`);
        try {
          const ATSService = (await import("../ats/ats.service.js")).default;
          const freshResume = await ResumeModel.findOne({ resumeId });
          const analysis = await ATSService.analyzeResume(freshResume, "default");
          
          await ResumeModel.updateOne(
            { resumeId },
            {
              $set: {
                atsScore: analysis.score,
                ats: analysis.ats,
                "structuredData.meta.analysisStatus": "completed",
                "structuredData.meta.evaluatedAt": Date.now(),
                updatedAt: Date.now(),
              },
            }
          );
        } catch (analysisErr) {
          console.error(`Synchronous ATS analysis failed after upload: ${analysisErr.message}`);
          // Mark as failed
          await ResumeModel.updateOne(
            { resumeId },
            {
              $set: {
                "structuredData.meta.analysisStatus": "ats_failed",
                "structuredData.meta.analysisError": analysisErr.message,
                updatedAt: Date.now(),
              },
            }
          );
        }
      }

      const finalResume = await ResumeModel.findOne({ resumeId }).lean();

      return finalResume;
    } catch (dbError) {
      throw new Error(`Failed to save resume: ${dbError.message}`);
    }
  },

  async getResumeById(resumeId) {
    if (!resumeId) return null;
    try {
      return await ResumeModel.findOne({ resumeId }).lean();
    } catch (error) {
      return null;
    }
  },

  async getResumesByUser(userId) {
    if (!userId) return [];
    try {
      return await ResumeModel.find({ userId })
        .sort({ updatedAt: -1 })
        .lean();
    } catch (error) {
      return [];
    }
  },

  async deleteResume(resumeId, userId = null) {
    try {
      const query = { resumeId };
      if (userId) query.userId = userId;
      const result = await ResumeModel.deleteOne(query);
      return result;
    } catch (error) {
      throw error;
    }
  },
  
  async updateResumeAnalysis(resumeId, analysisData) {
    try {
      const update = {
        $set: {
          atsScore: analysisData.score,
          ats: analysisData.ats,
          "structuredData.meta.analysisStatus": "completed",
          "structuredData.meta.atsEvaluatedAt": Date.now(),
          updatedAt: Date.now()
        }
      };
      
      // If we have enhanced structured data from AI, update it
      if (analysisData.structuredData) {
        update.$set["structuredData"] = {
          ...analysisData.structuredData,
          meta: {
            ...analysisData.structuredData.meta,
            analysisStatus: "completed"
          }
        };
      }
      
      const result = await ResumeModel.updateOne({ resumeId }, update);
      return result;
    } catch (error) {
      throw error;
    }
  }
};
