
import express from "express";
import multer from "multer";
import { ResumeController } from "./resume.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOCX allowed"), false);
    }
  }
}).single("resume");

const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

router.post("/upload", protect, uploadMiddleware, ResumeController.uploadResume);
router.post("/upsert", protect, ResumeController.upsertResume);
router.get("/:resumeId", ResumeController.getResumeById);
router.get("/user/:userId", protect, ResumeController.getResumesByUser);
router.delete("/:resumeId", protect, ResumeController.deleteResume);

export default router;