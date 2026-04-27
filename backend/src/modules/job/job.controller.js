import {
  createJobService,
  getRecruiterJobsService,
  getSingleJobService,
  updateJobService,
  closeJobService,
} from "./job.service.js";

import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

/* =========================================================
   CLOUDINARY UPLOAD HELPER
========================================================= */
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "hirefold/jobs",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

const parseJsonField = (value, fallback) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const normalizeIncomingJobData = (rawData) => {
  const jobData = { ...rawData };

  jobData.requiredSkills = parseJsonField(jobData.requiredSkills, jobData.requiredSkills);
  jobData.preferredSkills = parseJsonField(jobData.preferredSkills, jobData.preferredSkills);
  jobData.compensation = parseJsonField(jobData.compensation, {});

  if (typeof jobData.requiredSkills === "string") {
    jobData.requiredSkills = jobData.requiredSkills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof jobData.preferredSkills === "string") {
    jobData.preferredSkills = jobData.preferredSkills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (jobData.experienceLevel) {
    jobData.experienceLevel = jobData.experienceLevel.toUpperCase();
  }

  if (jobData.hiringModel) {
    jobData.hiringModel = jobData.hiringModel.toUpperCase();
  }

  return jobData;
};

/* =========================================================
   CREATE JOB (RECRUITER ONLY)
========================================================= */
export const createJob = async (req, res) => {
  try {
    if (req.user.role !== "RECRUITER") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can create jobs",
      });
    }

    /* ================= BUILD DATA ================= */
    const jobData = normalizeIncomingJobData(req.body);

    /* ================= CLOUDINARY LOGO UPLOAD ================= */
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      jobData.companyLogo = result.secure_url; //  CLOUD URL
    }

    /* ================= DEBUG ================= */

    /* ================= SAVE ================= */
    const job = await createJobService(
      jobData,
      req.user._id
    );

    res.status(201).json({
      success: true,
      job,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   GET RECRUITER JOBS
========================================================= */
export const getRecruiterJobs = async (req, res) => {
  try {
    if (req.user.role !== "RECRUITER") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const jobs = await getRecruiterJobsService(req.user._id);

    res.json({
      success: true,
      jobs,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   GET SINGLE JOB
========================================================= */
export const getSingleJob = async (req, res) => {
  try {
    const job = await getSingleJobService(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      job,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   UPDATE JOB
========================================================= */
export const updateJob = async (req, res) => {
  try {
    if (req.user.role !== "RECRUITER") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can update jobs",
      });
    }

    const updatedData = normalizeIncomingJobData(req.body);

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updatedData.companyLogo = result.secure_url;
    }

    const job = await updateJobService(
      req.params.id,
      req.user._id,
      updatedData
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or not authorized",
      });
    }

    res.json({
      success: true,
      job,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   CLOSE JOB
========================================================= */
export const closeJob = async (req, res) => {
  try {
    if (req.user.role !== "RECRUITER") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can close jobs",
      });
    }

    const job = await closeJobService(
      req.params.id,
      req.user._id
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or not authorized",
      });
    }

    res.json({
      success: true,
      job,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

