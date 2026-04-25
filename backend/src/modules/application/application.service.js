import mongoose from "mongoose";
import Application from "./application.model.js";
import Job from "../job/job.model.js";
import { ResumeModel } from "../resume/resume.model.js";

const validateObjectId = (value, message) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(message);
  }
};

export const applyToJobService = async (jobId, candidateId, payload = {}) => {
  validateObjectId(jobId, "Invalid job ID");

  const job = await Job.findById(jobId);
  if (!job) {
    throw new Error("Job not found");
  }

  const existingApplication = await Application.findOne({
    job: jobId,
    candidate: candidateId,
  });

  if (existingApplication) {
    throw new Error("You have already applied to this job");
  }

  const application = await Application.create({
    job: jobId,
    candidate: candidateId,
    resumeId: payload.resumeId || null,
  });

  return application.populate([
    { path: "job", select: "title recruiter status hiringModel" },
    { path: "candidate", select: "name email" },
  ]);
};

export const getApplicantsService = async (jobId, recruiterId) => {
  validateObjectId(jobId, "Invalid job ID");

  const job = await Job.findById(jobId).select(
    "title recruiter hiringModel status description location experienceLevel"
  );

  if (!job) {
    throw new Error("Job not found");
  }

  if (job.recruiter.toString() !== recruiterId.toString()) {
    throw new Error("Not authorized");
  }

  const applications = await Application.find({ job: jobId })
    .populate("candidate", "name email")
    .populate("job", "title hiringModel")
    .sort({ createdAt: -1 })
    .lean();

  const enrichedApplications = await Promise.all(
    applications.map(async (application) => {
      if (!application.resumeId) {
        return application;
      }

      try {
        const resume = await ResumeModel.findOne({
          resumeId: application.resumeId,
        })
          .select("ats atsScore")
          .lean();

        return {
          ...application,
          ats: resume?.ats || application.ats || null,
          atsScore: resume?.atsScore ?? application.atsScore ?? null,
        };
      } catch {
        return application;
      }
    })
  );

  return enrichedApplications.sort(
    (left, right) => (right.atsScore || 0) - (left.atsScore || 0)
  );
};

export const updateApplicationStatusService = async (
  applicationId,
  recruiterId,
  status
) => {
  validateObjectId(applicationId, "Invalid application ID");

  const application = await Application.findById(applicationId).populate("job");

  if (!application) {
    throw new Error("Application not found");
  }

  if (!application.job) {
    throw new Error("Job not found for this application");
  }

  if (application.job.recruiter.toString() !== recruiterId.toString()) {
    throw new Error("Not authorized");
  }

  application.status = status;
  await application.save();

  return application;
};

export const getMyApplicationsService = async (candidateId) => {
  return Application.find({ candidate: candidateId })
    .populate("job", "title recruiter status hiringModel")
    .populate("candidate", "name email")
    .sort({ createdAt: -1 });
};
