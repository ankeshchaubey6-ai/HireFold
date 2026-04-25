export function createResumeModel({
  resumeId,
  userId = null,
  source = "builder",
  title = "Untitled Resume",
  structuredData = {},
  meta = {},
}) {
  return {
    resumeId,
    userId,
    source,
    title,
    structuredData,
    meta: {
      schema: "resume-entity-v3",
      createdFrom: source,
      isAnonymous: !userId,
      ...meta,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
