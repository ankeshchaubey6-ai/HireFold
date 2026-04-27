import {
  normalizeResumeData,
  buildFeatures,
  getEmptyStandardizedData,
} from "./resumeStandardization.service.js";

const SECTION_HEADERS = {
  summary: ["summary", "profile", "objective", "professional summary", "about"],
  skills: ["skills", "technical skills", "technologies", "core competencies"],
  experience: ["experience", "work experience", "employment", "professional experience"],
  education: ["education", "academics", "qualifications"],
  projects: ["projects", "personal projects", "key projects"],
  certifications: ["certifications", "licenses", "credentials"],
};

const SKILL_DICTIONARY = {
  Frontend: [
    "react",
    "next.js",
    "vue",
    "angular",
    "javascript",
    "typescript",
    "html",
    "css",
    "tailwind",
    "redux",
  ],
  Backend: [
    "node.js",
    "express",
    "python",
    "java",
    "spring",
    "django",
    "flask",
    "fastapi",
    "graphql",
    "rest",
  ],
  Data: ["sql", "mongodb", "postgresql", "mysql", "redis", "spark", "pandas", "numpy"],
  Cloud: ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins", "github actions"],
  Tools: ["git", "jira", "postman", "figma", "power bi", "tableau"],
};

export function extractStructuredDataFromText(rawText = "") {
  if (!rawText || typeof rawText !== "string") {
    return getEmptyStandardizedData();
  }

  const text = normalizeText(rawText);
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const sections = splitSections(lines);
  const basics = extractBasics(lines, text);

  const summary = extractSummary(sections.summary, lines);
  const skills = extractSkills(sections.skills || text);
  const experience = extractExperience(sections.experience);
  const education = extractEducation(sections.education);
  const projects = extractProjects(sections.projects);
  const certifications = extractCertifications(sections.certifications);

  const normalized = normalizeResumeData({
    basics,
    summary,
    skills,
    experience,
    education,
    projects,
    certifications,
    rawText: text,
    parser: "fallback",
    parseQuality: "medium",
    meta: {
      sectionDetected: Object.keys(sections).filter((key) => sections[key]),
      extractionDate: Date.now(),
    },
  });

  normalized.features = buildFeatures(normalized);
  return normalized;
}

function normalizeText(text = "") {
  return String(text || "")
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitSections(lines = []) {
  const sections = {};
  let current = "header";
  const buffer = { header: [] };

  for (const line of lines) {
    const sectionName = getSectionName(line);
    if (sectionName) {
      current = sectionName;
      if (!buffer[current]) buffer[current] = [];
      continue;
    }

    if (!buffer[current]) buffer[current] = [];
    buffer[current].push(line);
  }

  for (const [key, values] of Object.entries(buffer)) {
    const text = values.join("\n").trim();
    if (text) sections[key] = text;
  }

  return sections;
}

function getSectionName(line = "") {
  const normalized = line.toLowerCase().replace(/[:|]/g, "").trim();
  if (!normalized || normalized.length > 40) return null;

  for (const [section, headers] of Object.entries(SECTION_HEADERS)) {
    if (headers.some((header) => normalized === header || normalized.startsWith(`${header} `))) {
      return section;
    }
  }

  return null;
}

function extractBasics(lines = [], text = "") {
  return {
    fullName: extractName(lines),
    email: extractEmail(text),
    phone: extractPhone(text),
    linkedin: extractLinkedIn(text),
    github: extractGitHub(text),
    location: extractLocation(text),
  };
}

function extractName(lines = []) {
  const candidates = lines.slice(0, 6);
  for (const line of candidates) {
    if (!line || line.length > 60) continue;
    if (/@|linkedin|github|\d/.test(line.toLowerCase())) continue;
    const words = line.split(/\s+/).filter(Boolean);
    if (words.length < 2 || words.length > 5) continue;
    if (words.every((word) => /^[A-Z][a-zA-Z.'-]+$/.test(word))) {
      return line;
    }
  }
  return "";
}

function extractEmail(text = "") {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
}

function extractPhone(text = "") {
  return (
    text.match(/(\+\d{1,3}[\s-]?)?(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/)?.[0] || ""
  );
}

function extractLinkedIn(text = "") {
  return text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9-_%/]+/i)?.[0] || "";
}

function extractGitHub(text = "") {
  return text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9-_%/]+/i)?.[0] || "";
}

function extractLocation(text = "") {
  return (
    text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2}\b/)?.[0] ||
    text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z][a-z]+\b/)?.[0] ||
    ""
  );
}

function extractSummary(summarySection = "", lines = []) {
  if (summarySection) {
    return summarySection.split("\n").slice(0, 4).join(" ");
  }

  const intro = [];
  for (const line of lines.slice(0, 12)) {
    if (getSectionName(line)) break;
    if (!/@|linkedin|github|^\+?\d/.test(line.toLowerCase())) {
      intro.push(line);
    }
  }

  return intro.join(" ").slice(0, 600).trim();
}

function extractSkills(skillsSection = "") {
  const lower = skillsSection.toLowerCase();
  const found = [];

  for (const [category, items] of Object.entries(SKILL_DICTIONARY)) {
    const matched = items.filter((item) => {
      const pattern = new RegExp(`(^|[^a-z])${escapeRegex(item)}([^a-z]|$)`, "i");
      return pattern.test(lower);
    });

    if (matched.length) {
      found.push({
        category,
        items: matched.map((name) => ({ name })),
      });
    }
  }

  if (found.length) return found;

  const fallbackItems = skillsSection
    .split(/\n|,|\||•|·/)
    .map((item) => item.trim())
    .filter((item) => item && item.length <= 40)
    .slice(0, 20)
    .map((name) => ({ name }));

  return fallbackItems.length
    ? [
        {
          category: "General",
          items: fallbackItems,
        },
      ]
    : [];
}

function extractExperience(section = "") {
  if (!section) return [];
  const chunks = splitEntries(section);

  return chunks
    .map((chunk) => {
      const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
      if (!lines.length) return null;

      const headline = lines[0];
      const secondary = lines[1] || "";
      const durationRaw =
        lines.find((line) => /\b(19|20)\d{2}\b/.test(line) || /present/i.test(line)) || "";

      const roleCompany = parseRoleCompany(headline, secondary);
      const descriptionLines = lines
        .filter((line) => line !== headline && line !== secondary && line !== durationRaw)
        .map((line) => line.replace(/^[-*•]\s*/, "").trim())
        .filter(Boolean);

      return {
        role: roleCompany.role,
        company: roleCompany.company,
        duration: {
          raw: durationRaw,
        },
        description: descriptionLines.join(" "),
        achievements: descriptionLines,
      };
    })
    .filter(Boolean);
}

function parseRoleCompany(headline = "", secondary = "") {
  if (headline.includes(" at ")) {
    const [role, company] = headline.split(/\s+at\s+/i);
    return { role: role.trim(), company: company?.trim() || "" };
  }

  if (headline.includes("|")) {
    const [role, company] = headline.split("|");
    return { role: role.trim(), company: company?.trim() || secondary };
  }

  if (headline.includes(",")) {
    const [role, company] = headline.split(",");
    return { role: role.trim(), company: company?.trim() || secondary };
  }

  return {
    role: headline.trim(),
    company: secondary && !/\b(19|20)\d{2}\b/.test(secondary) ? secondary.trim() : "",
  };
}

function extractEducation(section = "") {
  if (!section) return [];

  return splitEntries(section)
    .map((chunk) => {
      const line = chunk.split("\n").find(Boolean) || "";
      const year = line.match(/\b(19|20)\d{2}\b/)?.[0] || "";
      return {
        degree: line,
        institution: chunk.split("\n")[1] || "",
        year,
      };
    })
    .filter((item) => item.degree || item.institution || item.year);
}

function extractProjects(section = "") {
  if (!section) return [];

  return splitEntries(section)
    .map((chunk) => {
      const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
      const [name = "", ...rest] = lines;
      const description = rest.join(" ");
      const techStack = Object.values(SKILL_DICTIONARY)
        .flat()
        .filter((skill) => new RegExp(`(^|[^a-z])${escapeRegex(skill)}([^a-z]|$)`, "i").test(chunk));

      return {
        name,
        description,
        techStack,
      };
    })
    .filter((item) => item.name || item.description);
}

function extractCertifications(section = "") {
  if (!section) return [];

  return section
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({
      name: line,
      issuer: "",
      year: line.match(/\b(19|20)\d{2}\b/)?.[0] || "",
    }));
}

function splitEntries(section = "") {
  return section
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

function escapeRegex(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
