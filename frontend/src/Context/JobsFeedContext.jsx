import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import { useAuth } from "@/Context/AuthContext";

const JobsFeedContext = createContext();

const formatExperienceLevel = (value = "") => {
  const normalizedValue = String(value).toUpperCase();

  if (normalizedValue === "ENTRY") return "Entry";
  if (normalizedValue === "MID") return "Mid";
  if (normalizedValue === "SENIOR") return "Senior";
  return value || "";
};

const normalizeCompensation = (compensation = {}) => ({
  min: compensation?.min ?? null,
  max: compensation?.max ?? null,
  currency: compensation?.currency || "USD",
  frequency: compensation?.frequency || "Yearly",
  showPublicly: compensation?.showPublicly ?? true,
  bonus: compensation?.bonus || "",
  hasEquity: compensation?.hasEquity ?? false,
  equityRange: compensation?.equityRange || "",
  vestingPeriod: compensation?.vestingPeriod || "",
});

const normalizeJob = (job) => {
  const normalizedId = job._id || job.id;

  return {
    _id: normalizedId,
    id: normalizedId,
    title: job.title || "",
    companyName: job.companyName || job.company || "",
    location: job.location || "",
    experienceLevel: formatExperienceLevel(job.experienceLevel),
    experienceLevelCode: job.experienceLevel || "",
    description: job.description || "",
    requiredSkills: job.requiredSkills || job.skills || [],
    skills: job.requiredSkills || job.skills || [],
    preferredSkills: job.preferredSkills || [],
    hiringModel: job.hiringModel || "SELF_MANAGED",
    status: job.status || "OPEN",
    createdAt: job.createdAt,
    companyLogo:
      job.companyLogo ||
      job.companyLogoUrl ||
      job.companyLogoPreview ||
      job.logo ||
      null,
    applicationsCount: job.applicationsCount || 0,
    employmentType: job.employmentType || job.basics?.employmentType || "",
    department: job.department || job.basics?.department || "",
    workMode: job.workMode || job.basics?.workMode || "",
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    benefits: Array.isArray(job.benefits) ? job.benefits : [],
    salary:
      job.salary ??
      job.compensation?.max ??
      job.compensation?.min ??
      null,
    salaryRange:
      job.salaryRange ||
      (job.compensation?.min || job.compensation?.max
        ? {
            min: job.compensation?.min ?? null,
            max: job.compensation?.max ?? null,
          }
        : null),
    compensation: normalizeCompensation(job.compensation),
    hiringPreferences: job.hiringPreferences || "",
    applicationLastDate: job.applicationLastDate || null,
    basics: {
      title: job.title || "",
      companyName: job.companyName || job.company || "",
      employmentType: job.employmentType || job.basics?.employmentType || "",
      department: job.department || job.basics?.department || "",
      experienceLevel: formatExperienceLevel(job.experienceLevel),
      location: job.location || "",
      workMode: job.workMode || job.basics?.workMode || "",
      companyLogoPreview:
        job.companyLogo ||
        job.companyLogoUrl ||
        job.companyLogoPreview ||
        job.logo ||
        null,
    },
  };
};

export const JobsFeedProvider = ({ children }) => {
  const { user } = useAuth();

  const [publicJobs, setPublicJobs] = useState([]);
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs");
      const jobs = res?.data?.jobs || [];
      setPublicJobs(jobs.map(normalizeJob));
    } catch {
      setPublicJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecruiterJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs/my-jobs");
      const jobs = res?.data?.jobs || [];
      setRecruiterJobs(jobs.map(normalizeJob));
    } catch {
      setRecruiterJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (jobId, nextStatus) => {
    if (!jobId || nextStatus !== "CLOSED") {
      return false;
    }

    try {
      setLoading(true);
      const response = await api.patch(`/jobs/${jobId}/close`);
      const updatedJob = response?.data?.job;

      if (!updatedJob) {
        return false;
      }

      const normalizedJob = normalizeJob(updatedJob);

      setRecruiterJobs((currentJobs) =>
        currentJobs.map((job) => (job.id === normalizedJob.id ? normalizedJob : job))
      );
      setPublicJobs((currentJobs) =>
        currentJobs.map((job) => (job.id === normalizedJob.id ? normalizedJob : job))
      );

      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteJob = useCallback(async (jobId) => {
    if (!jobId) {
      return false;
    }

    try {
      setLoading(true);
      await api.delete(`/jobs/${jobId}`);

      setRecruiterJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobId));
      setPublicJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobId));

      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    if (user?.role === "RECRUITER") {
      fetchRecruiterJobs();
    }
  }, [fetchRecruiterJobs, user?.role]);

  return (
    <JobsFeedContext.Provider
      value={{
        jobs: publicJobs,
        publicJobs,
        recruiterJobs,
        loading,
        fetchJobs,
        fetchRecruiterJobs,
        updateStatus,
        deleteJob,
      }}
    >
      {children}
    </JobsFeedContext.Provider>
  );
};

export const useJobsFeed = () => useContext(JobsFeedContext);
