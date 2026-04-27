import { Queue } from "bullmq";
import IORedis from "ioredis";

let redisConnection = null;
let resumeAnalysisQueue = null;

function createRedisConnection() {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!redisConnection) {
    redisConnection = new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      tls: {},
      keepAlive: 30000,
      connectTimeout: 15000,
    });

    redisConnection.on("error", (error) => {
      console.error("[QUEUE] Redis connection error:", error?.message || error);
    });
  }

  return redisConnection;
}

export function isResumeQueueConfigured() {
  return Boolean(process.env.REDIS_URL);
}

export function getResumeAnalysisQueue() {
  if (!isResumeQueueConfigured()) {
    return null;
  }

  if (!resumeAnalysisQueue) {
    const connection = createRedisConnection();
    if (!connection) return null;

    resumeAnalysisQueue = new Queue("resume-analysis-queue", {
      connection,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      },
    });

    resumeAnalysisQueue.on("error", (error) => {
      console.error("[QUEUE] Queue error:", error?.message || error);
    });
  }

  return resumeAnalysisQueue;
}

export async function enqueueResumeAnalysis(payload) {
  const queue = getResumeAnalysisQueue();
  if (!queue) {
    throw new Error("Redis queue unavailable");
  }

  return queue.add("analyze-resume", payload, {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: false,
    backoff: { type: "exponential", delay: 5000 },
  });
}

export default getResumeAnalysisQueue;

