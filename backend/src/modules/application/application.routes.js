import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import {
  applyToJob,
  getApplicants,
  updateApplicationStatus,
  getMyApplications, //  NEW
} from "./application.controller.js";

const router = express.Router();

/* =========================================================
   CANDIDATE ROUTES
========================================================= */


router.get("/me", protect, getMyApplications);

// Apply to job
router.post("/jobs/:jobId/apply", protect, applyToJob);

/* =========================================================
   RECRUITER ROUTES
========================================================= */

// Get applicants for a job
router.get("/jobs/:jobId/applicants", protect, getApplicants);

// Update application status
router.patch("/:applicationId/status", protect, updateApplicationStatus);

export default router;

