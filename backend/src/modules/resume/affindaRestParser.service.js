import axios from "axios";
import FormData from "form-data";
import { normalizeResumeData } from "./resumeStandardization.service.js";

const AFFINDA_ENDPOINT = "https://api.affinda.com/v3/documents";
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

export async function parseResumeWithAffindaBuffer(fileBuffer, fileName, options = {}) {
  const apiKey = process.env.AFFINDA_API_KEY;
  const workspace = process.env.AFFINDA_WORKSPACE_ID;

  if (!apiKey) {
    throw new Error("AFFINDA_API_KEY missing in environment variables");
  }

  if (!workspace) {
    throw new Error("AFFINDA_WORKSPACE_ID missing in environment variables");
  }

  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const form = new FormData();
      form.append("file", fileBuffer, fileName);
      form.append("workspace", workspace);
      form.append("wait", "true");
      form.append("language", options.language || "en");

      const response = await axios.post(AFFINDA_ENDPOINT, form, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          ...form.getHeaders(),
        },
        timeout: options.timeout || 60000,
        maxBodyLength: Infinity,
      });

      const payload = response?.data?.data;
      if (!payload) {
        throw new Error("Empty response from Affinda API");
      }

      const structuredData = normalizeResumeData(
        {
          basics: {
            fullName: payload.name?.raw || payload.name?.parsed || "",
            email: payload.emails?.[0] || payload.email || "",
            phone: payload.phoneNumbers?.[0] || payload.phoneNumber || "",
            linkedin: payload.linkedin?.url || "",
            github: payload.github?.url || "",
            location: payload.location?.raw || "",
          },
          summary: payload.professionalSummary || payload.summary || "",
          skills: mapAffindaSkills(payload.skills),
          experience: mapAffindaExperience(payload.workExperience),
          education: mapAffindaEducation(payload.education),
          projects: mapAffindaProjects(payload.projects),
          certifications: mapAffindaCertifications(payload.certifications),
          rawText: payload.text || "",
          meta: {
            source: "upload",
            extractionDate: Date.now(),
            affindaDocumentId: payload.identifier || null,
          },
        },
        {
          parser: "affinda",
          parseQuality: "high",
        }
      );

      return {
        rawText: structuredData.rawText,
        structuredData,
      };
    } catch (error) {
      lastError = error;
      console.error("[PARSER] Affinda error:", error?.response?.data || error?.message || error);
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * attempt));
      }
    }
  }

  throw new Error(`Affinda parsing failed after ${MAX_RETRIES} attempts: ${lastError?.message}`);
}

function mapAffindaSkills(skills = []) {
  if (!Array.isArray(skills)) return [];

  const categories = new Map();
  for (const skill of skills) {
    const category = skill?.category || "General";
    if (!categories.has(category)) {
      categories.set(category, []);
    }
    categories.get(category).push({
      name: skill?.name || skill?.raw || "",
    });
  }

  return [...categories.entries()].map(([category, items]) => ({
    category,
    items,
  }));
}

function mapAffindaExperience(experience = []) {
  if (!Array.isArray(experience)) return [];

  return experience.map((item) => ({
    role: item?.jobTitle || item?.title || "",
    company: item?.organization || item?.company || "",
    duration: {
      start: item?.startDate || null,
      end: item?.endDate || null,
      raw: `${item?.startDate || ""} - ${item?.endDate || "Present"}`.trim(),
    },
    description: item?.description || "",
    achievements: splitAchievements(item?.description || ""),
  }));
}

function mapAffindaEducation(education = []) {
  if (!Array.isArray(education)) return [];

  return education.map((item) => ({
    degree: item?.degree || item?.accreditation?.education || item?.qualification || "",
    institution: item?.organization || item?.institution || "",
    year: item?.completionDate || "",
    field: item?.fieldOfStudy || "",
  }));
}

function mapAffindaProjects(projects = []) {
  if (!Array.isArray(projects)) return [];

  return projects.map((item) => ({
    name: item?.name || "",
    description: item?.description || "",
    techStack: Array.isArray(item?.technologies) ? item.technologies : [],
  }));
}

function mapAffindaCertifications(certifications = []) {
  if (!Array.isArray(certifications)) return [];

  return certifications.map((item) => ({
    name: item?.name || "",
    issuer: item?.organization || "",
    year: item?.completionDate || "",
  }));
}

function splitAchievements(text = "") {
  return String(text || "")
    .split(/\n|[.?!]/)
    .map((item) => item.trim())
    .filter((item) => item && /(increased|reduced|improved|built|created|led|managed|\d+%|\d+x)/i.test(item));
}

