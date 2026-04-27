import { ResumeStorageService } from "../services/resumeStorage.service";
import resumeSchema from "../utils/resumeSchema";
import resumeSanitizer from "../utils/resumeSanitizer";



export function useResumeLoader() {
  const loadResume = async (resumeId, loadIntoContext) => {
    if (!resumeId) {
      throw new Error("resumeId required");
    }

    

    const entity = await ResumeStorageService.getResumeById(resumeId);

    

    if (!entity) {
      throw new Error("Resume not found");
    }

    
    const structuredData = entity.structuredData || {};

    /* =====================================================
        HYDRATION STRATEGY (INDUSTRY STANDARD)
       - Merge schema defaults
       - Inject DB data
       - Preserve meta + ATS
       - Prevent missing fields crash
    ===================================================== */
    const hydratedResume = resumeSanitizer({
      ...resumeSchema, // base schema (guarantees all fields)
      ...structuredData, // actual resume content

      //  ROOT ATS (used by analysis + UI)
      ats: entity.ats ?? null,

      
      meta: {
        ...(structuredData.meta || {}),

        // Identity (MANDATORY)
        resumeId: entity.resumeId,

        // Source tracking
        source: entity.source || "builder",

        // Template binding (for preview renderer)
        targetTemplate:
          entity.templateId ||
          structuredData.meta?.targetTemplate ||
          "Modern01",

        // ATS mirror (lightweight UI usage)
        atsScore: entity.atsScore ?? null,
        ats: entity.ats ?? null,

        // Timestamps
        createdAt:
          entity.createdAt ||
          structuredData.meta?.createdAt ||
          Date.now(),

        updatedAt:
          entity.updatedAt ||
          structuredData.meta?.updatedAt ||
          Date.now(),
      },
    });

    

    /* =====================================================
        LOAD INTO GLOBAL CONTEXT (AUTO-FILL FORM)
    ===================================================== */
    loadIntoContext(hydratedResume);

    return entity;
  };

  return { loadResume };
}
