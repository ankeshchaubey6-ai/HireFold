import resumeSchema from "./resumeSchema";
import resumeSanitizer from "./resumeSanitizer";

const hasContent = (value) => {
  if (Array.isArray(value)) {
    return value.some(hasContent);
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (value && typeof value === "object") {
    return Object.entries(value).some(
      ([key, nestedValue]) => key !== "id" && hasContent(nestedValue)
    );
  }

  return value != null;
};

const trimStringFields = (item) => {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    return item;
  }

  return Object.fromEntries(
    Object.entries(item).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value,
    ])
  );
};

const filterFilledItems = (items = []) =>
  items.map(trimStringFields).filter(hasContent);

export default function prepareResumeForPreview(input) {
  const safeResume = resumeSanitizer(input || resumeSchema);

  return {
    ...safeResume,
    skills: (safeResume.skills || [])
      .map((group) => ({
        ...group,
        items: filterFilledItems(group?.items || []),
      }))
      .filter((group) => group.items.length > 0),
    experience: filterFilledItems(safeResume.experience),
    education: filterFilledItems(safeResume.education),
    projects: filterFilledItems(safeResume.projects),
    certifications: filterFilledItems(safeResume.certifications),
    courses: filterFilledItems(safeResume.courses),
    publications: filterFilledItems(safeResume.publications),
    languages: filterFilledItems(safeResume.languages),
    awards: filterFilledItems(safeResume.awards),
    volunteer: filterFilledItems(safeResume.volunteer),
    references: filterFilledItems(safeResume.references),
    attachments: filterFilledItems(safeResume.attachments),
  };
}
