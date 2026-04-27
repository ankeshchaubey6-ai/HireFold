import { ATSService } from "./ats.service.js";
import { ResumeService } from "../resume/resume.service.js";

export const ATSController = {
  /**
   * =====================================================
   * ANALYZE RESUME AI
   * GET /api/ats/analyze/:resumeId
   * Used by: ResumeAnalysis Page (Frontend)
   * =====================================================
   */
  async analyzeResume(req, res, next) {
    try {
      const { resumeId } = req.params;

      if (!resumeId) {
        return res.status(400).json({
          success: false,
          message: "resumeId is required",
        });
      }

      const result = await ATSService.analyzeResume(resumeId);
      await ResumeService.updateResumeAnalysis(resumeId, result);

      return res.status(200).json({
        success: true,
        message: "ATS analysis completed",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
