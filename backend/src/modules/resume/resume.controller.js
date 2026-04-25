import { ResumeService } from "./resume.service.js";



export const ResumeController = {
  async upsertResume(req, res, next) {
    try {
      const resume = await ResumeService.upsertResume(req.body);

      return res.status(200).json({
        success: true,
        data: resume,
      });
    } catch (error) {
      next(error);
    }
  },

  async uploadResume(req, res, next) {
    try {
      /* ================= FILE VALIDATION ================= */
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Resume file is required",
        });
      }

      const file = req.file;

      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Only PDF or DOCX resumes are allowed",
        });
      }

      const MAX_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        return res.status(400).json({
          success: false,
          message: "File too large. Max 10MB allowed",
        });
      }

      // Resume uploaded
      /* ================= SERVICE PIPELINE ================= */
      const savedResume =
        await ResumeService.uploadAndParseResume(file, req.user);

      return res.status(201).json({
        success: true,
        message: "Resume uploaded and parsed successfully",
        data: savedResume,
      });
    } catch (error) {
      /*  CLEAN PARSER ERRORS (NO HTML RESPONSE) */
      if (
        error.message?.includes("Parsing") ||
        error.message?.includes("valid resume") ||
        error.message?.includes("Multiple resumes") ||
        error.message?.includes("invalid")
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      next(error);
    }
  },

  /* =====================================================
     GET SINGLE RESUME (HYDRATION SAFE)
     GET /api/resumes/:resumeId
  ===================================================== */
  async getResumeById(req, res, next) {
    try {
      const { resumeId } = req.params;

      if (!resumeId) {
        return res.status(400).json({
          success: false,
          message: "resumeId is required",
        });
      }

      const resume = await ResumeService.getResumeById(resumeId);

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: "Resume not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: resume,
      });
    } catch (error) {
      next(error);
    }
  },

  /* =====================================================
     GET RESUMES BY USER
     GET /api/resumes/user/:userId
  ===================================================== */
  async getResumesByUser(req, res, next) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(200).json({
          success: true,
          resumes: [],
        });
      }

      const resumes = await ResumeService.getResumesByUser(userId);

      return res.status(200).json({
        success: true,
        resumes,
      });
    } catch (error) {
      next(error);
    }
  },

  /* =====================================================
     DELETE RESUME
  ===================================================== */
  async deleteResume(req, res, next) {
    try {
      const { resumeId } = req.params;

      if (!resumeId) {
        return res.status(400).json({
          success: false,
          message: "resumeId is required",
        });
      }

      const userId =
        req.user?.id ||
        req.user?._id ||
        req.user?.userId ||
        null;

      await ResumeService.deleteResume(resumeId, userId);

      return res.status(200).json({
        success: true,
        message: "Resume deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

