const EMPTY_BASICS = {
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  location: "",
};

const sanitizeText = (value = "") =>
  String(value || "")
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const cleanInlineText = (value = "") =>
  sanitizeText(value)
    .replace(/\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

const uniqueStrings = (items = []) =>
  [...new Set(items.map((item) => cleanInlineText(item)).filter(Boolean))];

const isNonEmptyObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length > 0;

const isNonEmptyValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (isNonEmptyObject(value)) return Object.keys(value).length > 0;
  return Boolean(cleanInlineText(value));
};

const pickFirst = (...values) => values.find((value) => isNonEmptyValue(value));

export function getEmptyStandardizedData() {
  return {
    basics: { ...EMPTY_BASICS },
    summary: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    rawText: "",
    parseQuality: "low",
    parser: "fallback",
    features: buildFeatures({
      basics: EMPTY_BASICS,
      summary: "",
      skills: [],
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      rawText: "",
    }),
    meta: {},
  };
}

export function normalizeResumeData(input = {}, overrides = {}) {
  const basicsSource = pickFirst(
    input.basics,
    input.contact,
    input.personalInfo,
    input.profile
  ) || {};
  const summarySource = pickFirst(
    input.summary,
    input.professionalSummary,
    input.objective,
    input.about
  );
  const skillsSource = pickFirst(
    input.skills,
    input.skillsArray,
    input.technicalSkills,
    input.extractedSkills
  );
  const experienceSource = pickFirst(
    input.experience,
    input.workExperience,
    input.jobs,
    input.employment
  );
  const educationSource = pickFirst(
    input.education,
    input.educationHistory,
    input.academicBackground
  );
  const projectsSource = pickFirst(input.projects, input.projectHistory);
  const certificationsSource = pickFirst(
    input.certifications,
    input.certificationHistory,
    input.licenses
  );
  const rawTextSource = pickFirst(input.rawText, input.text, input.content, input.extractedText) || "";

  const basics = {
    ...EMPTY_BASICS,
    ...(basicsSource || {}),
  };

  const rawText = sanitizeText(rawTextSource);
  const summary = cleanInlineText(summarySource || "");
  const skills = normalizeSkills(skillsSource);
  const experience = normalizeExperience(experienceSource);
  const education = normalizeEducation(educationSource);
  const projects = normalizeProjects(projectsSource);
  const certifications = normalizeCertifications(certificationsSource);
  const parser = overrides.parser || input.parser || input.meta?.parser || "fallback";
  const parseQuality =
    overrides.parseQuality ||
    input.parseQuality ||
    input.meta?.parseQuality ||
    inferParseQuality(rawText);

  return {
    basics: {
      fullName: cleanInlineText(basics.fullName),
      email: cleanInlineText(basics.email),
      phone: cleanInlineText(basics.phone),
      linkedin: cleanInlineText(basics.linkedin),
      github: cleanInlineText(basics.github),
      location: cleanInlineText(basics.location || basics.address),
    },
    summary,
    skills,
    experience,
    education,
    projects,
    certifications,
    rawText,
    parseQuality,
    parser,
    features: buildFeatures({
      basics,
      summary,
      skills,
      experience,
      education,
      projects,
      certifications,
      rawText,
    }),
    meta: {
      ...(input.meta || {}),
      ...overrides.meta,
      parser,
      parseQuality,
    },
  };
}

export function flattenSkillNames(skills = []) {
  return uniqueStrings(
    skills.flatMap((group) =>
      Array.isArray(group?.items)
        ? group.items.map((item) => (typeof item === "string" ? item : item?.name))
        : []
    )
  );
}

export function inferParseQuality(rawText = "") {
  const wordCount = cleanInlineText(rawText).split(/\s+/).filter(Boolean).length;
  if (wordCount >= 150) return "high";
  if (wordCount >= 50) return "medium";
  return "low";
}

export function buildFeatures({
  basics = EMPTY_BASICS,
  summary = "",
  skills = [],
  experience = [],
  education = [],
  projects = [],
  certifications = [],
  rawText = "",
} = {}) {
  const flattenedSkills = flattenSkillNames(skills);
  const wordCount = cleanInlineText(rawText).split(/\s+/).filter(Boolean).length;
  const experienceMonths = experience.reduce(
    (sum, item) => sum + (Number(item?.duration?.months) || 0),
    0
  );
  const sectionCount = [
    Object.values(basics || {}).some(Boolean),
    Boolean(summary),
    skills.length > 0,
    experience.length > 0,
    education.length > 0,
    projects.length > 0,
    certifications.length > 0,
  ].filter(Boolean).length;

  return {
    wordCount,
    totalSkills: flattenedSkills.length,
    experienceCount: experience.length,
    educationCount: education.length,
    projectCount: projects.length,
    certificationCount: certifications.length,
    totalExperienceMonths: experienceMonths,
    sectionCount,
    highestEducationLevel: getHighestEducationLevel(education),
    summaryWordCount: cleanInlineText(summary).split(/\s+/).filter(Boolean).length,
  };
}

function normalizeSkills(skills = []) {
  if (!Array.isArray(skills)) {
    if (typeof skills === "string") {
      return normalizeSkills([
        {
          category: "General",
          items: skills.split(/,|\n|\|/).map((item) => ({ name: item.trim() })),
        },
      ]);
    }

    if (isNonEmptyObject(skills)) {
      return normalizeSkills(
        Object.entries(skills).map(([category, items]) => ({
          category,
          items: Array.isArray(items)
            ? items.map((item) => (typeof item === "string" ? { name: item } : item))
            : [],
        }))
      );
    }

    return [];
  }

  return skills
    .map((group) => {
      const category = cleanInlineText(group?.category || group?.name || "General");
      const items = uniqueStrings(
        Array.isArray(group?.items)
          ? group.items.map((item) => (typeof item === "string" ? item : item?.name || item?.skill))
          : typeof group === "string"
          ? [group]
          : typeof group?.name === "string" && !group?.items
          ? [group.name]
          : []
      ).map((name) => ({ name }));

      if (!items.length) return null;

      return {
        category,
        count: items.length,
        items,
      };
    })
    .filter(Boolean);
}

function normalizeExperience(experience = []) {
  if (!Array.isArray(experience)) {
    if (isNonEmptyObject(experience)) {
      return normalizeExperience(Object.values(experience));
    }
    return [];
  }

  return experience
    .map((item) => {
      const start = normalizeYear(item?.duration?.start ?? item?.startDate);
      const endRaw = item?.duration?.end ?? item?.endDate;
      const end = normalizeYear(endRaw);
      const months =
        Number(item?.duration?.months) ||
        estimateDurationMonths(item?.duration?.raw, start, end, endRaw);
      const achievements = uniqueStrings(item?.achievements || []);
      const description = Array.isArray(item?.description)
        ? cleanInlineText(item.description.join(" "))
        : cleanInlineText(item?.description || "");

      return {
        role: cleanInlineText(item?.role || item?.title || item?.jobTitle || item?.position),
        company: cleanInlineText(item?.company || item?.organization || item?.employer),
        duration: {
          start,
          end,
          months,
          raw: cleanInlineText(item?.duration?.raw || buildDurationRaw(start, endRaw)),
        },
        description,
        achievements,
        startDate: start ? String(start) : "",
        endDate:
          endRaw === "Present" || endRaw === "present"
            ? "Present"
            : end
            ? String(end)
            : "",
      };
    })
    .filter((item) => item.role || item.company || item.description || item.achievements.length);
}

function normalizeEducation(education = []) {
  if (!Array.isArray(education)) {
    if (isNonEmptyObject(education)) {
      return normalizeEducation(Object.values(education));
    }
    return [];
  }

  return education
    .map((item) => {
      const degree = cleanInlineText(item?.degree);
      const institution = cleanInlineText(item?.institution || item?.institute);
      const year = normalizeYear(item?.year);
      const field = cleanInlineText(item?.field || item?.fieldOfStudy);

      return {
        degree,
        institution,
        institute: institution,
        year,
        field,
        fieldOfStudy: field,
        level: item?.level ?? getEducationLevelFromDegree(degree),
      };
    })
    .filter((item) => item.degree || item.institution || item.year);
}

function normalizeProjects(projects = []) {
  if (!Array.isArray(projects)) {
    if (isNonEmptyObject(projects)) {
      return normalizeProjects(Object.values(projects));
    }
    return [];
  }

  return projects
    .map((item) => {
      const name = cleanInlineText(item?.name || item?.title);
      const description = cleanInlineText(item?.description);
      const techStack = uniqueStrings(item?.techStack || []);

      return {
        name,
        title: name,
        description,
        techStack,
        url: cleanInlineText(item?.url),
      };
    })
    .filter((item) => item.name || item.description || item.techStack.length);
}

function normalizeCertifications(certifications = []) {
  if (!Array.isArray(certifications)) {
    if (isNonEmptyObject(certifications)) {
      return normalizeCertifications(Object.values(certifications));
    }
    return [];
  }

  return certifications
    .map((item) => {
      const name = cleanInlineText(item?.name || item?.title);
      return {
        name,
        title: name,
        issuer: cleanInlineText(item?.issuer),
        year: normalizeYear(item?.year || item?.issueDate),
      };
    })
    .filter((item) => item.name || item.issuer || item.year);
}

function normalizeYear(value) {
  if (value === null || value === undefined || value === "") return null;
  const match = String(value).match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : null;
}

function buildDurationRaw(start, endRaw) {
  if (!start && !endRaw) return "";
  return `${start || ""} - ${endRaw || "Present"}`.trim();
}

function estimateDurationMonths(raw, start, end, endRaw) {
  const text = cleanInlineText(raw || "");
  const matches = [...text.matchAll(/\b(19|20)\d{2}\b/g)].map((match) => Number(match[0]));

  const safeStart = start || matches[0] || null;
  const safeEnd =
    end ||
    matches[1] ||
    (/present/i.test(String(endRaw || raw || "")) ? new Date().getFullYear() : null);

  if (!safeStart || !safeEnd) return 0;
  return Math.max(0, (safeEnd - safeStart) * 12);
}

function getHighestEducationLevel(education = []) {
  return education.reduce(
    (highest, item) => Math.max(highest, Number(item?.level) || getEducationLevelFromDegree(item?.degree)),
    0
  );
}

export function getEducationLevelFromDegree(degree = "") {
  const value = cleanInlineText(degree).toLowerCase();
  if (/(phd|doctor|doctorate)/i.test(value)) return 4;
  if (/(master|mba|m\.?tech|m\.?s|m\.?sc)/i.test(value)) return 3;
  if (/(bachelor|b\.?tech|b\.?e|b\.?s|b\.?sc|b\.?a)/i.test(value)) return 2;
  if (/(certificate|certification|diploma|associate)/i.test(value)) return 1;
  return 0;
}
