import { Queue } from "bullmq";
import IORedis from "ioredis";

/**
 * =========================================================
 * HIREFOLD REDIS QUEUE SINGLETON (UPSTASH SAFE)
 * =========================================================
 * FIXES:
 * Stable TLS connection (Upstash required)
 * Prevent ECONNRESET loops
 * Singleton connection (no memory leaks)
 * Queue + Worker safe
 * =========================================================
 */

/**
 * =========================================================
 * REDIS SINGLETON CONNECTION
 * =========================================================
 */
let redisConnection = null;

function getRedisConnection() {
  if (redisConnection) {
    return redisConnection;
  }

  redisConnection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,

    // Upstash TLS requirement
    tls: {},

    // Prevent aggressive reconnect loops
    retryStrategy(times) {
      const delay = Math.min(times * 100, 3000);
      return delay;
    },

    // Stability improvements
    keepAlive: 30000,
    connectTimeout: 20000,
  });

  /**
   * =========================================================
   * CONNECTION EVENTS
   * =========================================================
   */

  redisConnection.on("connect", () => {
    // Connection established
  });

  redisConnection.on("ready", () => {
    // Ready to accept commands
  });

  redisConnection.on("error", (err) => {
    // Handle connection error
  });

  redisConnection.on("close", () => {
    // Connection closed
  });

  redisConnection.on("reconnecting", () => {
    // Attempting to reconnect
  });

  return redisConnection;
}

/**
 * =========================================================
 * HIREFOLD RESUME ANALYSIS QUEUE
 * =========================================================
 */

export const resumeAnalysisQueue = new Queue("resume-analysis-queue", {
  connection: getRedisConnection(),

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

/**
 * =========================================================
 * QUEUE EVENTS
 * =========================================================
 */

resumeAnalysisQueue.on("error", (err) => {
  // Queue error handler
});

resumeAnalysisQueue.on("completed", (job) => {
  // Job completed successfully
});

resumeAnalysisQueue.on("failed", (job, err) => {
  // Job failed handler
});

export default resumeAnalysisQueue;
