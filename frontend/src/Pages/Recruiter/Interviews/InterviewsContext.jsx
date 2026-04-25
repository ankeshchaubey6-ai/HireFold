import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "@/services/api";
import { useAuth } from "@/Context/AuthContext";

const InterviewsContext = createContext();

export const INTERVIEW_TYPES = {
  SYSTEM: "SYSTEM",
  FINAL: "FINAL",
};

export const INTERVIEW_STATUSES = {
  SCHEDULED: "SCHEDULED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

const normalizeInterview = (interview) => {
  if (!interview) {
    return null;
  }

  return {
    id: interview._id || interview.id,
    jobId: interview.job?._id || interview.jobId || interview.job || null,
    candidateId:
      interview.candidate?._id ||
      interview.candidateId ||
      interview.candidate ||
      null,
    applicationId:
      interview.application?._id ||
      interview.applicationId ||
      interview.application ||
      null,
    recruiterId:
      interview.recruiter?._id ||
      interview.recruiterId ||
      interview.recruiter ||
      null,
    jobTitle: interview.job?.title || interview.jobTitle || "",
    candidateName: interview.candidate?.name || interview.candidateName || "",
    recruiterName: interview.recruiter?.name || interview.recruiterName || "",
    scheduledAt: interview.scheduledAt || null,
    status: interview.status || INTERVIEW_STATUSES.SCHEDULED,
    type: interview.type || INTERVIEW_TYPES.FINAL,
    mode: interview.mode || "ONLINE",
    notes: interview.notes || "",
    createdAt: interview.createdAt || null,
    updatedAt: interview.updatedAt || null,
  };
};

export const InterviewsProvider = ({ children }) => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInterviews = useCallback(async () => {
    if (!user) {
      setInterviews([]);
      return [];
    }

    const route =
      user.role === "RECRUITER"
        ? "/interviews/recruiter"
        : "/interviews/candidate";

    try {
      setLoading(true);
      const response = await api.get(route);
      const items = response?.data?.interviews || [];
      const normalized = items.map(normalizeInterview).filter(Boolean);
      setInterviews(normalized);
      return normalized;
    } catch {
      setInterviews([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const scheduleInterview = useCallback(
    async (payload) => {
      const response = await api.post("/interviews/schedule", payload);
      await fetchInterviews();
      return response.data;
    },
    [fetchInterviews]
  );

  useEffect(() => {
    if (user) {
      fetchInterviews();
      return;
    }

    setInterviews([]);
  }, [fetchInterviews, user]);

  return (
    <InterviewsContext.Provider
      value={{
        interviews,
        loading,
        isLoading: loading,
        scheduleInterview,
        fetchInterviews,
        INTERVIEW_TYPES,
        INTERVIEW_STATUSES,
      }}
    >
      {children}
    </InterviewsContext.Provider>
  );
};

export const useInterviews = () => useContext(InterviewsContext);
