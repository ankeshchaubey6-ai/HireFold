import { useMemo } from "react";
import { generateResumeImprovements } from "../services/resumeImprovement.service";

export function useResumeImprovement(resume) {
  return useMemo(() => {
    if (!resume?.structuredData || !resume?.ats) {
      return null;
    }

    return generateResumeImprovements({
      structuredData: resume.structuredData,
      ats: resume.ats,
    });
  }, [resume]);
}
