import express from "express";
import {
  createJob,
  getRecruiterJobs,
  getSingleJob,
  updateJob,
  closeJob,
} from "./job.controller.js";

import Job from "./job.model.js";
import { protect } from "../../middleware/auth.middleware.js";
import { uploadLogo } from "./logoUpload.middleware.js"; //  NEW

const router = express.Router();

/* =========================================================
   PUBLIC - GET ALL OPEN JOBS (CANDIDATE FEED)
========================================================= */
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({ status: "OPEN" })
      .populate("recruiter", "name company email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================================================
   RECRUITER PROTECTED ROUTES
========================================================= */

/*  CREATE JOB WITH LOGO UPLOAD */
router.post("/", protect, uploadLogo, createJob); //  FIXED

/* GET MY JOBS */
router.get("/my-jobs", protect, getRecruiterJobs);

/* UPDATE JOB */
router.put("/:id", protect, uploadLogo, updateJob);

/* CLOSE JOB */
router.patch("/:id/close", protect, closeJob);

/* =========================================================
   DELETE JOB
========================================================= */
router.delete("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "RECRUITER") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can delete jobs",
      });
    }

    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      recruiter: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or not authorized",
      });
    }

    res.json({
      success: true,
      message: "Job deleted permanently",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================================================
   GET SINGLE JOB (PUBLIC)
========================================================= */
router.get("/:id", getSingleJob);

export default router;
