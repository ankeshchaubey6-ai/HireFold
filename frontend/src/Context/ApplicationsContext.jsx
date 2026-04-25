import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "@/services/api";
import { useAuth } from "@/Context/AuthContext";

const ApplicationsContext = createContext();

const STATUS_LABELS = {
  APPLIED: "Applied",
  SHORTLISTED: "Screening",
  INTERVIEW: "Interview",
  REJECTED: "Rejected",
  HIRED: "Offer",
};

const mapBackendStatus = (status) => STATUS_LABELS[status] || "Applied";

const mapFrontendStatusToBackend = (status) => {
  const entry = Object.entries(STATUS_LABELS).find(([, label]) => label === status);
  return entry?.[0] || "APPLIED";
};

const normalizeApplication = (application) => ({
  id: application._id || application.id,
  jobId: application.job?._id || application.jobId || application.job || null,
  jobTitle: application.job?.title || application.jobTitle || "Untitled Job",
  candidateId:
    application.candidate?._id ||
    application.candidateId ||
    application.candidate ||
    null,
  candidateName: application.candidate?.name || application.candidateName || "Candidate",
  candidateEmail: application.candidate?.email || application.candidateEmail || "",
  status: mapBackendStatus(application.status),
  updatedAt: application.updatedAt || application.createdAt || null,
  createdAt: application.createdAt || null,
  resumeId: application.resumeId || null,
  ats:
    application.ats ||
    (application.atsScore != null ? { score: application.atsScore } : null),
  atsScore: application.atsScore ?? application.ats?.score ?? null,
  hiringModel:
    application.job?.hiringModel || application.hiringModel || "SELF_MANAGED",
  department: application.department || application.job?.department || "",
});

export const ApplicationsProvider = ({ children }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchApplicantsForJobs = useCallback(async (jobs = []) => {
    if (!user || user.role !== "RECRUITER" || jobs.length === 0) {
      setApplications((current) =>
        user?.role === "RECRUITER" ? current : []
      );
      return [];
    }

    try {
      setLoading(true);

      const responses = await Promise.all(
        jobs.map(async (job) => {
          const jobId = job._id || job.id;
          if (!jobId) {
            return [];
          }

          const response = await api.get(`/applications/jobs/${jobId}/applicants`);
          const items = response?.data?.applications || [];

          return items.map((application) =>
            normalizeApplication({
              ...application,
              job: application.job || {
                _id: jobId,
                title: job.title,
                hiringModel: job.hiringModel,
              },
              department: job.department || "",
              hiringModel: job.hiringModel,
            })
          );
        })
      );

      const merged = responses.flat();
      setApplications(merged);
      return merged;
    } catch {
      setApplications([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchMyApplications = useCallback(async () => {
    if (!user || user.role !== "CANDIDATE") {
      setApplications((current) =>
        user?.role === "CANDIDATE" ? current : []
      );
      return [];
    }

    try {
      setLoading(true);
      const response = await api.get("/applications/me");
      const backendApplications = response?.data?.applications || [];
      const normalized = backendApplications.map(normalizeApplication);
      setApplications(normalized);
      return normalized;
    } catch {
      setApplications([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const applyToJob = useCallback(
    async ({ job, resume }) => {
      const jobId = job?._id || job?.id;
      if (!jobId) {
        return { success: false, message: "Invalid job ID" };
      }

      const alreadyApplied = applications.some(
        (application) =>
          String(application.jobId) === String(jobId) &&
          String(application.candidateId) === String(user?._id)
      );

      if (alreadyApplied) {
        return {
          success: false,
          message: "You have already applied to this job.",
        };
      }

      try {
        const response = await api.post(`/applications/jobs/${jobId}/apply`, {
          resumeId: resume?.resumeId || null,
          resumeMethod: resume?.method || "UPLOAD",
          fileName: resume?.fileName || null,
        });

        const createdApplication = normalizeApplication({
          ...response?.data?.application,
          job: response?.data?.application?.job || {
            _id: jobId,
            title: job?.title,
            hiringModel: job?.hiringModel,
          },
          candidate: response?.data?.application?.candidate || {
            _id: user?._id,
            name: user?.name,
            email: user?.email,
          },
        });

        setApplications((current) => [createdApplication, ...current]);
        return { success: true, application: createdApplication };
      } catch (error) {
        return {
          success: false,
          message: error?.response?.data?.message || "Application failed",
        };
      }
    },
    [applications, user]
  );

  const updateApplicationStatus = useCallback(async (applicationId, status) => {
    if (!applicationId || !status) {
      return null;
    }

    const response = await api.patch(`/applications/${applicationId}/status`, {
      status: mapFrontendStatusToBackend(status),
    });

    const updatedApplication = normalizeApplication(response?.data?.application || {});

    setApplications((current) =>
      current.map((application) =>
        application.id === updatedApplication.id
          ? {
              ...application,
              ...updatedApplication,
              ats: updatedApplication.ats || application.ats,
              atsScore: updatedApplication.atsScore ?? application.atsScore,
            }
          : application
      )
    );

    return updatedApplication;
  }, []);

  const hasApplied = useCallback(
    (jobId, candidateId) => {
      if (!jobId || !candidateId) {
        return false;
      }

      return applications.some(
        (application) =>
          String(application.jobId) === String(jobId) &&
          String(application.candidateId) === String(candidateId)
      );
    },
    [applications]
  );

  useEffect(() => {
    if (user?.role === "CANDIDATE") {
      fetchMyApplications();
      return;
    }

    if (!user) {
      setApplications([]);
    }
  }, [fetchMyApplications, user]);

  return (
    <ApplicationsContext.Provider
      value={{
        applications,
        loading,
        isLoading: loading,
        fetchApplicantsForJobs,
        fetchMyApplications,
        applyToJob,
        updateApplicationStatus,
        hasApplied,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
};

export const useApplications = () => useContext(ApplicationsContext);
