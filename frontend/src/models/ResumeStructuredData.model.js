// src/models/ResumeStructuredData.model.js

/**
 * Structured Resume Data Model
 * ----------------------------
 * Clean, normalized data extracted from resumes.
 * Used for:
 * - ATS scoring
 * - Resume ranking
 * - ML training (future)
 */

export function createResumeStructuredData({
  resumeId,
  basics = {},
  skills = [],
  experience = [],
  education = [],
  projects = [],
  certifications = [],
  keywords = [],
}) {
  if (!resumeId) {
    throw new Error("resumeId is required for structured data");
  }

  return {
    resumeId,
    basics,
    skills,
    experience,
    education,
    projects,
    certifications,
    keywords,
    createdAt: Date.now(),
  };
}
