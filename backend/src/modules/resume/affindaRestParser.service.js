import axios from "axios";
import FormData from "form-data";

const AFFINDA_ENDPOINT = "https://api.affinda.com/v3/documents";

/**
 * =========================================================
 * HIREFOLD AFFINDA INTEGRATION v2.0
 * =========================================================
 * Enhanced with better error handling and fallback
 * Features:
 *  Configurable retries
 *  Timeout handling
 *  Response validation
 *  Structured data mapping
 * =========================================================
 */

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

/**
 * Parse resume using Affinda AI
 * @param {Buffer} fileBuffer - Resume file buffer
 * @param {string} fileName - Original file name
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Parsed resume data
 */
export async function parseResumeWithAffindaBuffer(
  fileBuffer, 
  fileName, 
  options = {}
) {
  const apiKey = process.env.AFFINDA_API_KEY;
  const workspace = process.env.AFFINDA_WORKSPACE_ID;
  
  if (!apiKey) {
    throw new Error("AFFINDA_API_KEY missing in environment variables");
  }
  
  if (!workspace) {
    throw new Error("AFFINDA_WORKSPACE_ID missing in environment variables");
  }
  
  
  let lastError = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const form = new FormData();
      form.append("file", fileBuffer, fileName);
      form.append("workspace", workspace);
      form.append("wait", "true");
      form.append("language", options.language || "en");
      
      if (options.expandSkills) {
        form.append("expandSkills", "true");
      }
      
      const response = await axios.post(AFFINDA_ENDPOINT, form, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          ...form.getHeaders()
        },
        maxBodyLength: Infinity,
        timeout: options.timeout || 60000,
        validateStatus: (status) => status < 500 // Accept 4xx but not 5xx
      });
      
      // Check response status
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Affinda API error: ${response.status} - ${JSON.stringify(response.data)}`);
      }
      
      const data = response?.data?.data;
      
      if (!data) {
        throw new Error("Empty response from Affinda API");
      }

      // Extract and map structured data
      const structuredData = {
        meta: {
          parser: "affinda-ai",
          parseQuality: "ai-high",
          analysisStatus: "parsed",
          needsOCR: false,
          extractionDate: Date.now(),
          confidence: data.confidence || null
        },
        basics: {
          fullName: data.name?.raw || data.name?.parsed || "",
          email: data.emails?.[0] || data.email || "",
          phone: data.phoneNumbers?.[0] || data.phoneNumber || "",
          location: data.location?.raw || "",
          linkedin: data.linkedin?.url || "",
          github: data.github?.url || ""
        },
        summary: data.professionalSummary || data.summary || "",
        skills: mapAffindaSkills(data.skills),
        experience: mapAffindaExperience(data.workExperience),
        education: mapAffindaEducation(data.education),
        projects: mapAffindaProjects(data.projects),
        certifications: mapAffindaCertifications(data.certifications),
        rawText: data.text || ""
      };
      
      // Add additional fields if available
      if (data.languages) {
        structuredData.languages = data.languages.map(l => l.name);
      }
      
      if (data.publications) {
        structuredData.publications = data.publications;
      }

      if (data.location?.raw) {
        structuredData.location = data.location.raw;
      }
      
      return {
        rawText: data.text || "",
        structuredData
      };
      
    } catch (error) {
      lastError = error;
      
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY * attempt;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Affinda parsing failed after ${MAX_RETRIES} attempts: ${lastError?.message}`);
}

/**
 * Map Affinda skills to our skill structure
 */
function mapAffindaSkills(affindaSkills) {
  if (!affindaSkills || !Array.isArray(affindaSkills)) {
    return [];
  }
  
  const skillsByCategory = {};
  
  for (const skill of affindaSkills) {
    const category = skill.category || "other";
    
    if (!skillsByCategory[category]) {
      skillsByCategory[category] = {
        category,
        count: 0,
        items: []
      };
    }
    
    skillsByCategory[category].items.push({
      name: skill.name,
      confidence: skill.confidence || 0.8
    });
    skillsByCategory[category].count++;
  }
  
  return Object.values(skillsByCategory);
}

/**
 * Map Affinda experience to our structure
 */
function mapAffindaExperience(affindaExperience) {
  if (!affindaExperience || !Array.isArray(affindaExperience)) {
    return [];
  }
  
  return affindaExperience.map(exp => ({
    role: exp.jobTitle || exp.title || "",
    company: exp.organization || exp.company || "",
    duration: {
      start: exp.startDate ? new Date(exp.startDate).getFullYear() : null,
      end: exp.endDate ? new Date(exp.endDate).getFullYear() : null,
      months: calculateMonths(exp.startDate, exp.endDate),
      raw: `${exp.startDate || ""} - ${exp.endDate || "present"}`
    },
    description: exp.description ? [exp.description] : [],
    achievements: extractAchievements(exp.description)
  }));
}

/**
 * Map Affinda education to our structure
 */
function mapAffindaEducation(affindaEducation) {
  if (!affindaEducation || !Array.isArray(affindaEducation)) {
    return [];
  }
  
  return affindaEducation.map(edu => ({
    degree: edu.degree || edu.qualification || "",
    field: edu.fieldOfStudy || "",
    institution: edu.organization || edu.institution || "",
    year: edu.completionDate ? new Date(edu.completionDate).getFullYear() : null,
    level: getEducationLevel(edu.degree),
    raw: `${edu.degree} in ${edu.fieldOfStudy} from ${edu.organization}`
  }));
}

/**
 * Map Affinda projects to our structure
 */
function mapAffindaProjects(affindaProjects) {
  if (!affindaProjects || !Array.isArray(affindaProjects)) {
    return [];
  }
  
  return affindaProjects.map(proj => ({
    name: proj.name || "",
    techStack: proj.technologies || [],
    complexity: estimateComplexity(proj.description, proj.technologies),
    description: proj.description || "",
    impact: proj.achievements || "",
    duration: proj.durationMonths || null
  }));
}

/**
 * Map Affinda certifications to our structure
 */
function mapAffindaCertifications(affindaCertifications) {
  if (!affindaCertifications || !Array.isArray(affindaCertifications)) {
    return [];
  }
  
  return affindaCertifications.map(cert => ({
    name: cert.name || "",
    issuer: cert.organization || "",
    year: cert.completionDate ? new Date(cert.completionDate).getFullYear() : null
  }));
}

/**
 * Helper: Calculate months between dates
 */
function calculateMonths(startDate, endDate) {
  if (!startDate) return 0;
  
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const months = (end.getFullYear() - start.getFullYear()) * 12 +
                 (end.getMonth() - start.getMonth());
  
  return Math.max(0, months);
}

/**
 * Helper: Extract achievements from description
 */
function extractAchievements(description) {
  if (!description) return [];
  
  const achievementPatterns = [
    /(?:achieved|increased|reduced|improved|developed|implemented|created|designed|built|led|managed)[^.!?]*[.!?]/gi,
    /\d+%|\d+x/gi
  ];
  
  const achievements = [];
  
  for (const pattern of achievementPatterns) {
    const matches = description.match(pattern);
    if (matches) {
      achievements.push(...matches);
    }
  }
  
  return [...new Set(achievements)]; // Deduplicate
}

/**
 * Helper: Determine education level from degree
 */
function getEducationLevel(degree) {
  if (!degree) return 3;
  
  const lowerDegree = degree.toLowerCase();
  
  if (lowerDegree.includes("phd") || lowerDegree.includes("doctorate")) return 5;
  if (lowerDegree.includes("master") || lowerDegree.includes("m.tech") || lowerDegree.includes("mba")) return 4;
  if (lowerDegree.includes("bachelor") || lowerDegree.includes("b.tech") || lowerDegree.includes("b.e")) return 3;
  if (lowerDegree.includes("associate") || lowerDegree.includes("diploma")) return 2;
  if (lowerDegree.includes("certificate")) return 1;
  
  return 3;
}

/**
 * Helper: Estimate project complexity
 */
function estimateComplexity(description, technologies) {
  if (!description) return "low";
  
  const techCount = technologies?.length || 0;
  const length = description.length;
  
  if (techCount > 3 || length > 200) return "high";
  if (techCount > 1 || length > 100) return "medium";
  
  return "low";
}

