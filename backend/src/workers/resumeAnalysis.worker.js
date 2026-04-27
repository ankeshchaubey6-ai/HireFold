import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import IORedis from "ioredis";
import ATSService from "../modules/ats/ats.service.js";
import { ResumeService } from "../modules/resume/resume.service.js";

let worker = null;

if (process.env.REDIS_URL) {
  const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    tls: {},
    keepAlive: 30000,
    connectTimeout: 15000,
  });

  connection.on("error", (error) => {
    console.error("[QUEUE] Worker Redis error:", error?.message || error);
  });

  worker = new Worker(
    "resume-analysis-queue",
    async (job) => {
      const { resumeId, jobRole = "default" } = job.data || {};
      const analysis = await ATSService.analyzeResume(resumeId, jobRole);
      await ResumeService.updateResumeAnalysis(resumeId, analysis);

      return {
        success: true,
        resumeId,
        score: analysis.score,
      };
    },
    { connection }
  );
}

export default worker;

