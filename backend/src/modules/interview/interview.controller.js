import Interview from "./interview.model.js";
import {
  scheduleInterviewService,
  getRecruiterInterviewsService,
  getCandidateInterviewsService,
} from "./interview.service.js";

/* ================= SCHEDULE ================= */
export const scheduleInterview = async (req, res, next) => {
  try {
    if (req.user.role !== "RECRUITER") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can schedule interviews",
      });
    }

    const { applicationId, scheduledAt } = req.body;

    if (!applicationId || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "applicationId and scheduledAt are required",
      });
    }

    const interview = await scheduleInterviewService(
      applicationId,
      req.user._id,
      scheduledAt
    );

    res.status(201).json({
      success: true,
      interview,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= RECRUITER ================= */
export const getRecruiterInterviews = async (req, res, next) => {
  try {
    if (req.user.role !== "RECRUITER") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const interviews = await getRecruiterInterviewsService(
      req.user._id
    );

    res.json({
      success: true,
      interviews,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= CANDIDATE ================= */
export const getCandidateInterviews = async (req, res, next) => {
  try {
    const interviews = await getCandidateInterviewsService(
      req.user._id
    );

    res.json({
      success: true,
      interviews,
    });
  } catch (err) {
    next(err);
  }
};