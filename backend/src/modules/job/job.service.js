import Job from "./job.model.js";

const normalizeStringArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeCompensation = (value = {}) => ({
  min:
    value?.min === "" || value?.min === undefined || value?.min === null
      ? null
      : Number(value.min),
  max:
    value?.max === "" || value?.max === undefined || value?.max === null
      ? null
      : Number(value.max),
  currency: value?.currency || "USD",
  frequency: value?.frequency || "Yearly",
  showPublicly: value?.showPublicly ?? true,
  bonus: value?.bonus || "",
  hasEquity: value?.hasEquity ?? false,
  equityRange: value?.equityRange || "",
  vestingPeriod: value?.vestingPeriod || "",
});

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
    experienceLevel,
    requiredSkills: normalizeStringArray(requiredSkills),
    hiringModel: normalizedHiringModel,
    recruiter: recruiterId,
    status: "OPEN",
    companyLogo: data.companyLogo || null,
    companyName: companyName || "",
    employmentType: employmentType || "",
    department: department || "",
    workMode: workMode || "Onsite",
    preferredSkills: normalizeStringArray(preferredSkills),
    hiringPreferences: hiringPreferences || "",
    compensation: normalizeCompensation(compensation),
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
  const normalizedData = { ...data };

  if ("requiredSkills" in normalizedData) {
    normalizedData.requiredSkills = normalizeStringArray(normalizedData.requiredSkills);
  }

  if ("preferredSkills" in normalizedData) {
    normalizedData.preferredSkills = normalizeStringArray(normalizedData.preferredSkills);
  }

  if ("compensation" in normalizedData) {
    normalizedData.compensation = normalizeCompensation(normalizedData.compensation);
  }

  return await Job.findOneAndUpdate(
    { _id: jobId, recruiter: recruiterId },
    normalizedData,
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
