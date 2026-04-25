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
      const { resumeId, jobRole = "default" } = job.data || {};

      if (!resumeId) {
        return { success: false, message: "resumeId is required" };
      }

      const resume = await ResumeModel.findOne({ resumeId });
      if (!resume) {
        return { success: false, message: "Resume not found" };
      }

      const currentStructuredData = resume.structuredData || {};
      const rawText = currentStructuredData.rawText || "";

      let structuredData = currentStructuredData;
      if (rawText) {
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
      }

      resume.structuredData = structuredData;

      const analysis = await ATSService.analyzeResume(
        {
          ...resume.toObject(),
          structuredData,
        },
        jobRole
      );

      resume.atsScore = analysis.score;
      resume.ats = analysis.ats;
      resume.structuredData = {
        ...structuredData,
        meta: {
          ...(structuredData.meta || {}),
          analysisStatus: "completed",
          evaluatedAt: Date.now(),
        },
      };
      resume.updatedAt = Date.now();

      await resume.save();

      return {
        success: true,
        resumeId,
        score: analysis.score,
      };
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
