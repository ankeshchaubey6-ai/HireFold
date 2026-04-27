import api from "./api";

const resolveATSScore = (record = {}) =>
  record?.atsScore ??
  record?.totalScore ??
  record?.score ??
  record?.ats?.totalScore ??
  record?.ats?.score ??
  null;

export const ResumeStorageService = {
  async saveResume(payload) {
    const response = await api.post("/resumes/upsert", payload);
    return response?.data?.data || response?.data || null;
  },

  
  async getResumeById(resumeId) {
    if (!resumeId) return null;

    try {
      const response = await api.get(
        `/resumes/${resumeId}`
      );

      const record = response.data?.data;

      if (!record) return null;

      
      return {
        resumeId: record.resumeId,
        userId: record.userId,
        title: record.title,
        source: record.source || "builder",
        templateId: record.templateId || null,

        //  MUST stay nested (loader expects this)
        structuredData: record.structuredData || {},

        ats: record.ats ?? null,
        atsScore: resolveATSScore(record),

        isEditable: record.isEditable,
        isDraft: record.isDraft,

        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      };
    } catch (error) {
      return null;
    }
  },

  /* ======================================================
     READ BY USER (FOR SAVED RESUMES PAGE)
  ====================================================== */
  async getResumesByUser(userId) {
    if (!userId) return [];

    try {
      const response = await api.get(
        `/resumes/user/${userId}`
      );

      const data = response.data;

      // Normalize all backend shapes (production safe)
      if (Array.isArray(data?.resumes)) {
        return data.resumes.map((resume) => ({
          ...resume,
          atsScore: resolveATSScore(resume),
        }));
      }

      if (Array.isArray(data?.data)) {
        return data.data.map((resume) => ({
          ...resume,
          atsScore: resolveATSScore(resume),
        }));
      }

      if (Array.isArray(data)) {
        return data.map((resume) => ({
          ...resume,
          atsScore: resolveATSScore(resume),
        }));
      }

      return [];
    } catch (error) {
      return [];
    }
  },

  /* ======================================================
     DELETE RESUME (PRODUCTION READY)
  ====================================================== */
  async deleteResume(resumeId) {
    if (!resumeId) return;

    try {
      await api.delete(`/resumes/${resumeId}`);
    } catch (error) {
    }
  },
};


