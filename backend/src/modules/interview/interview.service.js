import Interview from "./interview.model.js";
import Application from "../application/application.model.js";

export const scheduleInterviewService = async (
  applicationId,
  recruiterId,
  scheduledAt
) => {
  const application = await Application.findById(applicationId).populate("job");

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.job.recruiter.toString() !== recruiterId.toString()) {
    throw new Error("Not authorized");
  }

  const interview = await Interview.create({
    application: applicationId,
    job: application.job._id,
    candidate: application.candidate,
    recruiter: recruiterId,
    scheduledAt,
  });

  /* Auto move pipeline */
  application.status = "INTERVIEW";
  await application.save();

  /*  Return fully populated interview */
  return await interview.populate([
    { path: "application" },
    { path: "job", select: "title" },
    { path: "candidate", select: "name email" },
  ]);
};

export const getRecruiterInterviewsService = async (recruiterId) => {
  return await Interview.find({ recruiter: recruiterId })
    .populate("application")
    .populate("candidate", "name email")
    .populate("job", "title")
    .sort({ scheduledAt: 1 });
};

/*  NEW: Get candidate interviews with full data */
export const getCandidateInterviewsService = async (candidateId) => {
  return await Interview.find({ candidate: candidateId })
    .populate("application")
    .populate("job", "title")
    .populate("recruiter", "name email")
    .sort({ scheduledAt: -1 });
};

