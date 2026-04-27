import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

import api from "../services/api";
import resumeSchema from "../utils/resumeSchema";
import resumeSanitizer from "../utils/resumeSanitizer";

const ResumeContext = createContext(null);

export const ResumeProvider = ({ children }) => {
  const [activeResumeId, setActiveResumeId] = useState(null);
  const [resume, setResume] = useState(() => resumeSanitizer(resumeSchema));
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  const pollAttemptsRef = useRef(0);
  const pollTimeoutRef = useRef(null);

  /* =======================================================
     POLLING STOPS AFTER 80 ATTEMPTS (~160 seconds)
     OR IF ANALYSIS COMPLETES/FAILS
  ======================================================= */
  useEffect(() => {
    if (!activeResumeId) {
      setAnalysisLoading(false);
      return;
    }

    pollAttemptsRef.current = 0;
    setAnalysisLoading(true);
    setAnalysisError(null);

    let interval;
    let mounted = true;
    const MAX_ATTEMPTS = 80;
    const POLL_INTERVAL = 2000;
    const MAX_TIMEOUT = 180000; // 3 minutes total timeout

    const fetchResume = async () => {
      if (!mounted) return;

      pollAttemptsRef.current += 1;

      // Check hard timeout
      if (pollAttemptsRef.current >= MAX_ATTEMPTS) {
        if (mounted) {
          setAnalysisError("Analysis took too long. Please try again.");
          setAnalysisLoading(false);
        }
        clearInterval(interval);
        return;
      }

      try {
        const res = await api.get(`/resumes/${activeResumeId}`);
        const backendData = res?.data?.data;

        if (!backendData || !mounted) return;

        // Debug logging
        const analysisStatus = backendData.structuredData?.meta?.analysisStatus;
        const hasAtsData = !!backendData.ats;
        const hasSections = Array.isArray(backendData.ats?.sections) && backendData.ats.sections.length > 0;
        
        if (pollAttemptsRef.current % 5 === 0 || analysisStatus === "completed") {
          console.debug(`[ResumeContext-Poll] Attempt ${pollAttemptsRef.current}: status=${analysisStatus}, hasAts=${hasAtsData}, sections=${hasSections}, score=${backendData.atsScore}`);
        }

        const safe = resumeSanitizer(backendData.structuredData);

        safe.meta = {
          ...(safe.meta || {}),
          resumeId: backendData.resumeId,
          atsScore: backendData.atsScore ?? safe.meta?.atsScore ?? null,
          analysisStatus: backendData.structuredData?.meta?.analysisStatus || null,
          analysisError: backendData.structuredData?.meta?.analysisError || null,
        };
        safe.ats = backendData.ats || null;

        setResume(safe);

        // Check analysis status based on already-declared analysisStatus
        if (analysisStatus === "completed") {
          console.debug(`[ResumeContext-Poll] Analysis COMPLETED for ${activeResumeId}`);
          setAnalysisLoading(false);
          setAnalysisError(null);
          clearInterval(interval);
        } else if (analysisStatus === "ats_failed") {
          const errorMsg =
            backendData.structuredData?.meta?.analysisError ||
            "ATS analysis failed. Please try again.";
          console.error(`[ResumeContext-Poll] Analysis FAILED: ${errorMsg}`);
          setAnalysisError(errorMsg);
          setAnalysisLoading(false);
          clearInterval(interval);
        }
      } catch (error) {
        console.error("[ResumeContext-Poll] Error fetching resume:", error?.message);

        if (pollAttemptsRef.current >= 3) {
          if (mounted) {
            setAnalysisError(
              error?.response?.data?.message || "Failed to fetch resume analysis"
            );
            setAnalysisLoading(false);
          }
          clearInterval(interval);
        }
      }
    };

    // Initial fetch
    fetchResume();

    // Set up polling interval
    interval = setInterval(fetchResume, POLL_INTERVAL);

    // Set up hard timeout
    pollTimeoutRef.current = setTimeout(() => {
      if (mounted) {
        setAnalysisError("Analysis request timed out");
        setAnalysisLoading(false);
      }
      clearInterval(interval);
    }, MAX_TIMEOUT);

    return () => {
      mounted = false;
      clearInterval(interval);
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, [activeResumeId]);

  /* =======================================================
     SAFE SETTER
  ======================================================= */
  const safeSetResume = useCallback((updater) => {
    setResume((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (activeResumeId) {
        next.meta = { ...next.meta, resumeId: activeResumeId };
      }
      return resumeSanitizer(next);
    });
  }, [activeResumeId]);

  /* =======================================================
     FETCH AND LOAD
  ======================================================= */
  const fetchAndLoadResume = useCallback(async (resumeId) => {
    if (!resumeId) return;
    try {
      const res = await api.get(`/resumes/${resumeId}`);
      const backendData = res?.data?.data;
      if (!backendData) return;

      const safe = resumeSanitizer(backendData.structuredData);
      safe.meta = {
        ...(safe.meta || {}),
        resumeId,
        atsScore: backendData.atsScore ?? null,
      };
      safe.ats = backendData.ats || null;

      setActiveResumeId(resumeId);
      setResume(safe);
    } catch (error) {

    }
  }, []);

  /* =======================================================
     LOAD INTO CONTEXT (used by upload)
  ======================================================= */
  const loadResumeIntoContext = useCallback((loadedResume) => {
    if (!loadedResume) return;

    const safe = resumeSanitizer(loadedResume);
    const resumeId = safe.meta?.resumeId;

    if (!resumeId) {

      return;
    }

    safe.meta = {
      ...(safe.meta || {}),
      resumeId,
      atsScore: loadedResume?.meta?.atsScore ?? loadedResume?.atsScore ?? null,
    };
    safe.ats = loadedResume?.ats || null;

    setActiveResumeId(resumeId);
    setResume(safe);
  }, []);

  /* =======================================================
     CREATE NEW
  ======================================================= */
  const createNewResume = useCallback((resumeId) => {
    if (!resumeId) return;
    setActiveResumeId(resumeId);
    setResume(resumeSanitizer({
      ...resumeSchema,
      meta: { ...resumeSchema.meta, resumeId },
    }));
  }, []);

  /* =======================================================
     RESET
  ======================================================= */
  const resetResume = useCallback(() => {
    setResume(resumeSanitizer({
      ...resumeSchema,
      meta: {
        ...resumeSchema.meta,
        ...(activeResumeId ? { resumeId: activeResumeId } : {}),
      },
    }));
  }, [activeResumeId]);

  /* =======================================================
     HELPER FUNCTIONS FOR ARRAY OPERATIONS
  ======================================================= */
  const updateArrayItem = useCallback(
    (arrayName, index, fieldName, value) => {
      safeSetResume((prev) => {
        const array = [...(prev[arrayName] || [])];
        if (array[index]) {
          array[index] = { ...array[index], [fieldName]: value };
        }
        return { ...prev, [arrayName]: array };
      });
    },
    []
  );

  const addArrayItem = useCallback(
    (arrayName, initialValue = {}) => {
      safeSetResume((prev) => ({
        ...prev,
        [arrayName]: [...(prev[arrayName] || []), initialValue],
      }));
    },
    []
  );

  const removeArrayItem = useCallback(
    (arrayName, index) => {
      safeSetResume((prev) => {
        const array = [...(prev[arrayName] || [])];
        array.splice(index, 1);
        return { ...prev, [arrayName]: array };
      });
    },
    []
  );

  const setSkillsFromText = useCallback(
    (text) => {
      const skillsArray = text
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      safeSetResume((prev) => ({
        ...prev,
        skills: [
          {
            name: "Skills",
            items: skillsArray.map((name) => ({ name })),
          },
        ],
      }));
    },
    []
  );

  return (
    <ResumeContext.Provider value={{
      resume,
      activeResumeId,
      analysisLoading,
      analysisError,
      fetchAndLoadResume,
      createNewResume,
      loadResumeIntoContext,
      resetResume,
      setActiveResumeId,
      setResume: safeSetResume,
      updateArrayItem,
      addArrayItem,
      removeArrayItem,
      setSkillsFromText,
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used inside ResumeProvider");
  return ctx;
};






