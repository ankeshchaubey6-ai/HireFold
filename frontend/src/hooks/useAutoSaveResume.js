import { useEffect, useRef } from "react";
import { ResumeStorageService } from "../services/resumeStorage.service";

const isMeaningfullyFilled = (resume) => {
  if (!resume) {
    return false;
  }

  return Boolean(
    resume?.basics?.fullName ||
      resume?.summary ||
      resume?.experience?.length ||
      resume?.education?.length ||
      resume?.projects?.length ||
      resume?.skills?.some((group) => group?.items?.length)
  );
};

const buildMeaningfulSignature = (resume) =>
  JSON.stringify({
    basics: resume?.basics || {},
    summary: resume?.summary || "",
    skills: resume?.skills || [],
    experience: resume?.experience || [],
    education: resume?.education || [],
    projects: resume?.projects || [],
    meta: {
      targetTemplate: resume?.meta?.targetTemplate || "Modern01",
      accentColor: resume?.meta?.accentColor || "",
    },
  });

export function useAutoSaveResume({
  resume,
  userId = null,
  resumeId,
  source = "builder",
  templateId,
  delay = 1000,
}) {
  const timerRef = useRef(null);
  const isFirstRenderRef = useRef(true);
  const isSavingRef = useRef(false);
  const lastSavedSignatureRef = useRef("");

  useEffect(() => {
    if (!resume || !resumeId) {
      return undefined;
    }

    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return undefined;
    }

    if (!isMeaningfullyFilled(resume)) {
      return undefined;
    }

    const signature = buildMeaningfulSignature(resume);
    if (signature === lastSavedSignatureRef.current) {
      return undefined;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      if (isSavingRef.current) {
        return;
      }

      try {
        isSavingRef.current = true;

        const normalizedResume = {
          ...resume,
          meta: {
            ...(resume.meta || {}),
            resumeId,
            targetTemplate: templateId ?? resume?.meta?.targetTemplate ?? "Modern01",
            updatedAt: Date.now(),
          },
        };

        await ResumeStorageService.saveResume({
          resumeId,
          userId,
          source,
          templateId: normalizedResume.meta?.targetTemplate ?? null,
          title: normalizedResume.basics?.fullName || "Untitled Resume",
          structuredData: normalizedResume,
          isDraft: true,
        });

        lastSavedSignatureRef.current = signature;
      } finally {
        isSavingRef.current = false;
        timerRef.current = null;
      }
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [resume, userId, resumeId, source, templateId, delay]);
}
