import express from "express";
import { ResumeController } from "./resume.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { uploadResumeMiddleware } from "./resume.upload.js";

const router = express.Router();

/* =====================================================
   UPLOAD + PARSE RESUME (MAIN PIPELINE)
   POST /api/resumes/upload
===================================================== */
router.post(
  "/upload",
  protect,
  uploadResumeMiddleware,
  ResumeController.uploadResume
);

/* =====================================================
   UPSERT RESUME (AUTOSAVE + BUILDER SAVE)
===================================================== */
router.post(
  "/upsert",
  protect,
  ResumeController.upsertResume
);

/* =====================================================
   GET SINGLE RESUME (HYDRATION / CONTINUE EDITING)
===================================================== */
router.get(
  "/:resumeId",
  ResumeController.getResumeById
);

/* =====================================================
   GET RESUMES BY USER (MY RESUMES PAGE)
===================================================== */
router.get(
  "/user/:userId",
  protect,
  ResumeController.getResumesByUser
);

/* =====================================================
   DELETE RESUME
===================================================== */
router.delete(
  "/:resumeId",
  protect,
  ResumeController.deleteResume
);

export default router;