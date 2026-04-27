import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import IORedis from "ioredis";
import { ResumeModel } from "../modules/resume/resume.model.js";
import { extractStructuredDataFromText } from "../modules/resume/resumeStructureExtractor.service.js";
import ATSService from "../modules/ats/ats.service.js";

const queueName = "resume-analysis-queue";

const createConnection = () =>
  new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    tls: {},
    keepAlive: 30000,
    connectTimeout: 20000,
  });

let connection = null;
let worker = null;

if (process.env.REDIS_URL) {
  connection = createConnection();

  worker = new Worker(
    queueName,
    async (job) => {
      let resumeId = null;

      try {
        const { resumeId: jobResumeId, jobRole = "default" } = job.data || {};
        resumeId = jobResumeId;

        if (!resumeId) {
          throw new Error("resumeId is required in job data");
        }

        const resume = await ResumeModel.findOne({ resumeId });
        if (!resume) {
          throw new Error(`Resume not found: ${resumeId}`);
        }

        const currentStructuredData = resume.structuredData || {};
        const rawText = currentStructuredData.rawText || "";

        // Extract structured data if raw text exists
        let structuredData = currentStructuredData;
        if (rawText) {
          try {
            const extracted = extractStructuredDataFromText(rawText);
            structuredData = {
              ...currentStructuredData,
              ...extracted,
              meta: {
                ...(currentStructuredData.meta || {}),
                ...(extracted.meta || {}),
                analysisStatus: "parsed",
                extractionTimestamp: Date.now(),
              },
            };
          } catch (parseError) {
            console.error(`Error parsing resume ${resumeId}:`, parseError.message);
            // Continue with unparsed data
          }
        }

        resume.structuredData = structuredData;

        // Perform ATS analysis
        let analysis;
        try {
          analysis = await ATSService.analyzeResume(
            {
              ...resume.toObject(),
              structuredData,
            },
            jobRole
          );
        } catch (atsError) {
          console.error(`ATS analysis failed for ${resumeId}:`, atsError.message);
          throw new Error(`ATS analysis failed: ${atsError.message}`);
        }

        if (!analysis || typeof analysis.score !== "number") {
          throw new Error("Invalid ATS analysis result");
        }

        // Update resume with analysis results
        resume.atsScore = analysis.score;
        resume.ats = analysis.ats || {};
        resume.structuredData = {
          ...structuredData,
          meta: {
            ...(structuredData.meta || {}),
            analysisStatus: "completed",
            evaluatedAt: Date.now(),
            atsEngine: "hirefold-ats-v2.0",
          },
        };
        resume.updatedAt = Date.now();

        await resume.save();

        return {
          success: true,
          resumeId,
          score: analysis.score,
          sectionsCount: (analysis.sections || []).length,
          verdict: analysis.verdict?.level,
        };
      } catch (error) {
        console.error(
          `Worker error processing resume ${resumeId}:`,
          error.message
        );

        // Try to set failure state on resume
        if (resumeId) {
          try {
            const resume = await ResumeModel.findOne({ resumeId });
            if (resume) {
              resume.structuredData = {
                ...resume.structuredData,
                meta: {
                  ...(resume.structuredData?.meta || {}),
                  analysisStatus: "ats_failed",
                  analysisError: error.message,
                  failedAt: Date.now(),
                },
              };
              resume.updatedAt = Date.now();
              await resume.save();
            }
          } catch (saveError) {
            console.error(`Failed to save error state:`, saveError.message);
          }
        }

        throw error;
      }
    },
    { connection }
  );

  const shutdown = async () => {
    await worker?.close();
    await connection?.quit();
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

export default worker;
