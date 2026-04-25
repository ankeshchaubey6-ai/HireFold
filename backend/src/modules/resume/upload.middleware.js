import multer from "multer";
import path from "path";

/**
 * =========================================================
 * HIREFOLD RESUME UPLOAD MIDDLEWARE (PRODUCTION)
 * =========================================================
 * - Memory storage (required for cloud upload)
 * - 10MB file limit (as configured)
 * - PDF + DOCX only (ATS standard)
 * - Secure file validation
 */

const MAX_FILE_SIZE_MB = process.env.MAX_RESUME_SIZE_MB || 10;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

/* =========================================================
   MULTER STORAGE (MEMORY - CLOUD READY)
========================================================= */
const storage = multer.memoryStorage();

/* =========================================================
   FILE FILTER (STRICT ATS VALIDATION)
========================================================= */
const fileFilter = (req, file, cb) => {
  if (!file) {
    return cb(new Error("No file provided"), false);
  }

  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  const allowedExtensions = [".pdf", ".docx"];

  if (
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.includes(ext)
  ) {
    return cb(null, true);
  }

  return cb(
    new Error("Only PDF and DOCX resumes are allowed"),
    false
  );
};

/* =========================================================
   MULTER INSTANCE (ENTERPRISE SAFE)
========================================================= */
export const uploadResumeMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE, // 10MB limit
  },
}).single("resume"); 

/* =========================================================
   ERROR HANDLER (MULTER SAFE WRAPPER)
========================================================= */
export const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: `File too large. Max allowed size is ${MAX_FILE_SIZE_MB}MB`,
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "File upload failed",
    });
  }

  next();
};

