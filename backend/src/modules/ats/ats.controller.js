import { ATSService } from "./ats.service.js";

export const ATSController = {
  /**
   * =====================================================
   * ANALYZE RESUME AI
   * GET /api/ats/analyze/:resumeId
   * Used by: ResumeAnalysis Page (Frontend)
   * =====================================================
   */
  async analyzeResume(req, res, next) {
    const { resumeId } = req.params;

    if (!resumeId || typeof resumeId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid resumeId is required",
        error: "INVALID_RESUME_ID",
      });
    }

    try {
      const result = await ATSService.analyzeResume(resumeId);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Resume not found or analysis failed",
          error: "RESUME_NOT_FOUND",
        });
      }

      return res.status(200).json({
        success: true,
        message: "ATS analysis completed successfully",
        data: result,
      });
    } catch (error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({
          success: false,
          message: "Resume not found",
          error: "RESUME_NOT_FOUND",
        });
      }

      next(error);
    }
  },
};
