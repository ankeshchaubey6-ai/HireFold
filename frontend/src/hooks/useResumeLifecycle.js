import { useCallback } from "react";
import api from "@/services/api";

export const useResumeLifecycle = (user) => {

  /* ================= SAVE RESUME ================= */
  const saveResume = useCallback(async ({
    resumeId,
    structuredData,
    source = "builder",
    templateId,
    consentGiven,
  }) => {
    if (!user) throw new Error("User not authenticated");

    if (!resumeId) throw new Error("Missing resume ID");

    const payload = {
      resumeId,
      data: structuredData,
      source,
      templateId,
      consentGiven,
    };

    

    const res = await api.post(`/resumes/${resumeId}/save`, payload);

    return res.data;
  }, [user]);

  return {
    saveResume,
  };
};
