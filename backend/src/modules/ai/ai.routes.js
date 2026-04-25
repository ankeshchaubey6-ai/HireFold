import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { AIController } from "./ai.controller.js";

const router = express.Router();

/**
 * POST /api/ai/shortlist/:jobId
 * Used by: Recruiter Applicants (Assisted Hiring)
 */
router.post(
  "/shortlist/:jobId",
  protect,
  AIController.shortlistApplicants
);

export default router;