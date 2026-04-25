import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import {
  scheduleInterview,
  getRecruiterInterviews,
  getCandidateInterviews,
} from "./interview.controller.js";

const router = express.Router();

router.post("/schedule", protect, scheduleInterview);
router.get("/recruiter", protect, getRecruiterInterviews);
router.get("/candidate", protect, getCandidateInterviews);

export default router;