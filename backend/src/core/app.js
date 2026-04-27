import path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import jobRoutes from "../modules/job/job.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import applicationRoutes from "../modules/application/application.routes.js";
import interviewRoutes from "../modules/interview/interview.routes.js";
import resumeRoutes from "../modules/resume/resume.routes.js";
import atsRoutes from "../modules/ats/ats.routes.js";
import aiRoutes from "../modules/ai/ai.routes.js";

const app = express();

/* =========================================================
   CORS (COOKIES + FRONTEND VITE)
========================================================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://hire-fold.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =========================================================
   MIDDLEWARE
========================================================= */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =========================================================
   API ROUTES (MODULAR - PRODUCTION STRUCTURE)
========================================================= */
app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ats", atsRoutes); //  THIS ALREADY HANDLES /api/ats/analyze/:id
app.use("/api/ai", aiRoutes);

/* =========================================================
   HEALTH CHECK (DEV + PROD MONITORING)
========================================================= */
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend Running",
  });
});

export default app;
