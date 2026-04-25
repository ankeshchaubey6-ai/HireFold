import express from "express";
import multer from "multer";
import { ResumeController } from "./resume.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();


const uploadMiddleware = (req, res, next) => {
  const handler = upload.single("file"); // MUST match FormData key

  handler(req, res, (err) => {
    if (err instanceof multer.MulterError) {

      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File too large. Max 10MB allowed",
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message || "File upload error",
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Invalid file upload",
      });
    }

    next();
  });
};



/* =====================================================
    UPLOAD + PARSE RESUME (MAIN PIPELINE)
   POST /api/resumes/upload
   Flow:
   Frontend  Multer Buffer  Parser  Mongo  ATS later
===================================================== */
router.post(
  "/upload",
  protect,
  uploadMiddleware, //  FIXED (was upload.single)
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

