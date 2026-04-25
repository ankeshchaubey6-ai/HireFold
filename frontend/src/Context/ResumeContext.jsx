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

  const pollAttemptsRef = useRef(0);

  /* =======================================================
     POLLING  STOPS AFTER 80 ATTEMPTS (~160 seconds)
     STOPS WHEN: analysisStatus === "completed"
  ======================================================= */
  useEffect(() => {
    if (!activeResumeId) return;

    pollAttemptsRef.current = 0; // reset on new resume
    let interval;
    const MAX_ATTEMPTS = 80; // ~160 seconds at 2s interval (enough for OCR)

    const fetchResume = async () => {
      pollAttemptsRef.current += 1;

      if (pollAttemptsRef.current >= MAX_ATTEMPTS) {
        clearInterval(interval);

        return;
      }

      try {
        const res = await api.get(`/resumes/${activeResumeId}`);
        const backendData = res?.data?.data;
        if (!backendData) return;

        const safe = resumeSanitizer(backendData.structuredData);

        safe.meta = {
          ...(safe.meta || {}),
          resumeId: backendData.resumeId,
          atsScore: backendData.atsScore ?? safe.meta?.atsScore ?? null,
        };
        safe.ats = backendData.ats || null;

        setResume(safe);

        //  CORRECT STOP CONDITION: Check analysisStatus
        const analysisStatus = backendData.structuredData?.meta?.analysisStatus;
        if (analysisStatus === "completed" || analysisStatus === "ats_failed") {
          clearInterval(interval);

        }

      } catch (error) {

        if (pollAttemptsRef.current >= 3) clearInterval(interval);
      }
    };

    fetchResume();
    interval = setInterval(fetchResume, 2000);

    return () => clearInterval(interval);
  }, [activeResumeId]); // only re-runs when resume ID changes

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






