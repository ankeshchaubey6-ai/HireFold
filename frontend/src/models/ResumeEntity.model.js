/**
 * ResumeEntity.model.js
 *
 * This is the SINGLE canonical resume model used everywhere.
 * Uploads, Builder, ATS, Storage, Backend sync all depend on this.
 */

export function createResumeEntity({
  resumeId,
  userId,
  source, // "upload" | "builder"
  templateId = null,
  structuredData,
  snapshotHtml = "",
  atsScore = null,
  originalFileMeta = null, // for uploads
}) {
  if (!resumeId || !userId || !source || !structuredData) {
    throw new Error("Invalid ResumeEntity creation");
  }

  return {
    resumeId,
    userId,

    source,
    templateId,

    structuredData, // sanitized resume schema
    snapshotHtml,   // rendered HTML snapshot (layout preserved)

    ats: {
      score: atsScore,
      lastEvaluatedAt: atsScore !== null ? Date.now() : null,
      engine: "hirefold-ats-v2",
    },

    originalFileMeta, // { name, type, size } for uploads

    version: 1,
    isEditable: source === "builder",

    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
