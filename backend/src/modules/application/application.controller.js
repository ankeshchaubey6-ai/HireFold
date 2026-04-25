import {
  applyToJobService,
  getApplicantsService,
  updateApplicationStatusService,
  getMyApplicationsService,
} from "./application.service.js";

export const applyToJob = async (req, res, next) => {
  try {
    if (req.user.role !== "CANDIDATE") {
      return res.status(403).json({
        success: false,
        message: "Only candidates can apply to jobs",
      });
    }

    const application = await applyToJobService(
      req.params.jobId,
      req.user._id,
      req.body
    );

    return res.status(201).json({
      success: true,
      application,
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicants = async (req, res, next) => {
  try {
    if (req.user.role !== "RECRUITER") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can view applicants",
      });
    }

    const applicants = await getApplicantsService(req.params.jobId, req.user._id);

    return res.json({
      success: true,
      applications: applicants || [],
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    if (req.user.role !== "RECRUITER") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can update status",
      });
    }

    const { status } = req.body;

    const updated = await updateApplicationStatusService(
      req.params.applicationId,
      req.user._id,
      status
    );

    return res.json({
      success: true,
      application: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    if (req.user.role !== "CANDIDATE") {
      return res.status(403).json({
        success: false,
        message: "Only candidates can view their applications",
      });
    }

    const applications = await getMyApplicationsService(req.user._id);

    return res.json({
      success: true,
      applications: applications || [],
    });
  } catch (error) {
    next(error);
  }
};
