import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import { useAuth } from "@/Context/AuthContext";

const JobsFeedContext = createContext();

const normalizeJob = (job) => ({
  _id: job._id,
  id: job._id,
  title: job.title || "",
  companyName: job.companyName || job.company || "",
  location: job.location || "",
  experienceLevel: job.experienceLevel || "",
  description: job.description || "",
  skills: job.requiredSkills || job.skills || [],
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
  workMode: job.workMode || job.basics?.workMode || "",
  requirements: Array.isArray(job.requirements) ? job.requirements : [],
  benefits: Array.isArray(job.benefits) ? job.benefits : [],
  salary: job.salary,
  salaryRange: job.salaryRange,
  compensation: job.compensation,
});

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
