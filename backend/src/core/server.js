
import dotenv from "dotenv";
dotenv.config();

/**
GLOBAL CRASH GUARD (PREVENTS ERR_CONNECTION_RESET)
*/
process.on("uncaughtException", (err) => {
  // Global exception handler
});

process.on("unhandledRejection", (reason) => {
  // Global rejection handler
});

/* =========================================================
   CORE IMPORTS (AFTER ENV LOAD)
========================================================= */
import app from "./app.js";
import { connectDB } from "./db.js";

/**
START BACKGROUND WORKER (QUEUE + ATS)
MUST be imported AFTER dotenv.config()
*/
import "../workers/resumeAnalysis.worker.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      // Server is running
    });
  } catch (error) {
    throw error;
  }
};

startServer();
