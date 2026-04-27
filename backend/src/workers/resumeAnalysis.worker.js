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
      let retryCount = 0;
      const MAX_RETRIES = 5; // Retry up to 5 times for OCR

      try {
        const { resumeId: jobResumeId, jobRole = "default" } = job.data || {};
        resumeId = jobResumeId;

        if (!resumeId) {
          throw new Error("resumeId is required in job data");
        }

        let resume = await ResumeModel.findOne({ resumeId });
        if (!resume) {
          throw new Error(`Resume not found: ${resumeId}`);
        }

        let currentStructuredData = resume.structuredData || {};
        
        // Check if this is an image-based resume waiting for OCR
        const needsOCR = currentStructuredData?.meta?.needsOCR || false;
        const hasEmptyData =
          !currentStructuredData?.rawText &&
          (!currentStructuredData?.skills || currentStructuredData.skills.length === 0) &&
          (!currentStructuredData?.experience || currentStructuredData.experience.length === 0);

        // If image-based PDF and data is still empty, retry with backoff (OCR might still be processing)
        if ((needsOCR || hasEmptyData) && retryCount < MAX_RETRIES) {
          // Fetch fresh copy to check if OCR has completed
          resume = await ResumeModel.findOne({ resumeId });
          currentStructuredData = resume?.structuredData || {};

          // Still empty after OCR should have completed?
          const stillEmpty =
            !currentStructuredData?.rawText &&
            (!currentStructuredData?.skills || currentStructuredData.skills.length === 0) &&
            (!currentStructuredData?.experience || currentStructuredData.experience.length === 0);

          if (stillEmpty && retryCount < MAX_RETRIES) {
            retryCount++;
            // Throw to trigger job retry with exponential backoff
            throw new Error(
              `Resume data not ready (retry ${retryCount}/${MAX_RETRIES}). OCR may still be processing.`
            );
          }
        }

        // Extract structured data if raw text exists
        let structuredData = currentStructuredData;
        const rawText = currentStructuredData?.rawText || "";

        if (rawText && rawText.length > 100) {
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
            // Continue with unparsed data (canvas/builder resumes often have no rawText)
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
            ocrCompleted: !needsOCR || !!rawText,
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
          hasRawText: !!rawText,
          sourceType: structuredData?.meta?.source || "unknown",
        };
      } catch (error) {
        console.error(
          `Worker error processing resume ${resumeId} (attempt: ${retryCount}):`,
          error.message
        );

        // If this is a retry-able error and we haven't exceeded max retries, throw to trigger job retry
        if (error.message.includes("retry") && retryCount < MAX_RETRIES) {
          throw error; // BullMQ will retry
        }

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
