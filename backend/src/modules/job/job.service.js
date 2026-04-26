import Job from "./job.model.js";

/* =========================================================
   CREATE JOB
========================================================= */
export const createJobService = async (data, recruiterId) => {
  const {
    title,
    description,
    location,
    experienceLevel,
    requiredSkills,
    hiringModel,
    companyName,
    employmentType,
    department,
    workMode,
    preferredSkills,
    hiringPreferences,
    compensation,
    applicationLastDate,
  } = data;

  if (!title || !description || !experienceLevel || !hiringModel) {
    throw new Error("Missing required job fields");
  }

  const normalizedHiringModel = hiringModel.toUpperCase();

  if (!["SELF_MANAGED", "ASSISTED"].includes(normalizedHiringModel)) {
    throw new Error("Invalid hiring model");
  }

 return await Job.create({
  title,
  description,
  location,
  experienceLevel, // now matches ENUM: ENTRY/MID/SENIOR
  requiredSkills: requiredSkills || [],
  hiringModel: normalizedHiringModel,
  recruiter: recruiterId,
  status: "OPEN",
  companyLogo: data.companyLogo || null,
  companyName: companyName || "",
  employmentType: employmentType || "",
  department: department || "",
  workMode: workMode || "Onsite",
  preferredSkills: preferredSkills || [],
  hiringPreferences: hiringPreferences || "",
  compensation: compensation || {},
  applicationLastDate: applicationLastDate || null,
});

};

/* =========================================================
   GET ALL JOBS BY RECRUITER
========================================================= */
export const getRecruiterJobsService = async (recruiterId) => {
  return await Job.find({ recruiter: recruiterId })
    .sort({ createdAt: -1 });
};

/* =========================================================
   GET SINGLE JOB
========================================================= */
export const getSingleJobService = async (jobId) => {
  return await Job.findById(jobId)
    .populate("recruiter", "name email role");
};

/* =========================================================
   UPDATE JOB
========================================================= */
export const updateJobService = async (jobId, recruiterId, data) => {
  return await Job.findOneAndUpdate(
    { _id: jobId, recruiter: recruiterId },
    data,
    { new: true }
  );
};

/* =========================================================
   CLOSE JOB
========================================================= */
export const closeJobService = async (jobId, recruiterId) => {
  return await Job.findOneAndUpdate(
    { _id: jobId, recruiter: recruiterId },
    { status: "CLOSED" },
    { new: true }
  );
};