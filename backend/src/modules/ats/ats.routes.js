import express from "express";
import { ATSController } from "./ats.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

/* =========================================================
   ATS ROUTES (AI + ANALYSIS)
   Base: /api/ats
========================================================= */

/**
 *  MAIN AI ANALYSIS ROUTE
 * GET /api/ats/analyze/:resumeId
 */
router.get(
  "/analyze/:resumeId",
  protect, // keep secure (same as resumes)
  ATSController.analyzeResume
);

export default router;
