import { AIShortlistingService } from "./aiShortlisting.service.js";

export const AIController = {
  async shortlistApplicants(req, res, next) {
    try {
      if (req.user.role !== "RECRUITER") {
        return res.status(403).json({
          success: false,
          message: "Only recruiters can use AI shortlisting",
        });
      }

      const { jobId } = req.params;

      const result =
        await AIShortlistingService.shortlistForJob(
          jobId,
          req.user._id
        );

      res.json({
        success: true,
        message: "AI shortlisting completed",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
