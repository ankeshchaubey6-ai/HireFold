import { ResumeModel } from "../resume/resume.model.js";
import {
  flattenSkillNames,
  getEducationLevelFromDegree,
  normalizeResumeData,
} from "../resume/resumeStandardization.service.js";

const SECTION_ORDER = ["contact", "summary", "skills", "experience", "education", "projects"];
const ROLE_SKILLS = {
  frontend: ["react", "javascript", "typescript", "html", "css"],
  backend: ["node.js", "express", "sql", "api", "mongodb"],
  fullstack: ["react", "node.js", "typescript", "sql", "api"],
  data: ["python", "sql", "pandas", "analysis", "machine learning"],
  default: [],
};

class ATSServiceImpl {
  async analyzeResume(resumeOrId, jobRole = "default") {
    const resume =
      typeof resumeOrId === "string"
        ? await ResumeModel.findOne({ resumeId: resumeOrId }).lean()
        : resumeOrId;

    if (!resume) {
      throw new Error("Resume not found");
    }

    const rawStructuredData = resume.structuredData || {};
    console.log("[ATS] analyzeResume called with:", JSON.stringify(rawStructuredData).slice(0, 500));

    const structuredData = normalizeResumeData(rawStructuredData);
    const { basics, summary, skills, experience, education, projects, rawText } = structuredData;

    console.log(
      "[SCORER] Input data: skills=",
      skills.length,
      "experience=",
      experience.length,
      "education=",
      education.length
    );

    const skillNames = flattenSkillNames(skills);
    const sectionScores = {};

    console.log("[ATS] Calculating contact score");
    sectionScores.contact = this.calculateContactScore(basics);
    console.log("[ATS] contact score:", sectionScores.contact);

    console.log("[ATS] Calculating summary score");
    sectionScores.summary = this.calculateSummaryScore(summary);
    console.log("[ATS] summary score:", sectionScores.summary);

    console.log("[ATS] Calculating skills score");
    sectionScores.skills = this.calculateSkillsScore(skillNames);
    console.log("[ATS] skills score:", sectionScores.skills);

    console.log("[ATS] Calculating experience score");
    sectionScores.experience = this.calculateExperienceScore(experience);
    console.log("[ATS] experience score:", sectionScores.experience);

    console.log("[ATS] Calculating education score");
    sectionScores.education = this.calculateEducationScore(education);
    console.log("[ATS] education score:", sectionScores.education);

    console.log("[ATS] Calculating projects score");
    sectionScores.projects = this.calculateProjectsScore(projects);
    console.log("[ATS] projects score:", sectionScores.projects);

    console.log("[SCORER] Section scores:", JSON.stringify(sectionScores));

    let totalScore = Math.round(
      sectionScores.contact * 0.1 +
        sectionScores.summary * 0.15 +
        sectionScores.skills * 0.25 +
        sectionScores.experience * 0.3 +
        sectionScores.education * 0.15 +
        sectionScores.projects * 0.05
    );

    const hasResumeContent = Boolean(
      String(rawText || "").length > 100 ||
        String(summary || "").trim() ||
        skills.length ||
        experience.length ||
        education.length ||
        projects.length ||
        basics?.fullName ||
        basics?.email
    );

    if (hasResumeContent && totalScore < 15) {
      totalScore = 15;
    }

    if ((!Number.isFinite(totalScore) || totalScore === 0) && hasResumeContent) {
      totalScore = 20;
      for (const key of SECTION_ORDER) {
        if (!Number.isFinite(sectionScores[key]) || sectionScores[key] <= 0) {
          sectionScores[key] = 10;
        }
      }
      console.log("[ATS] Applied safety net score - raw scorer returned 0 but resume has content");
    }

    console.log("[SCORER] Final score:", totalScore);
    console.log("[ATS] Final scores:", JSON.stringify(sectionScores), "Total:", totalScore);

    const requiredKeywords = ROLE_SKILLS[jobRole?.toLowerCase()] || ROLE_SKILLS.default;
    const foundKeywords = requiredKeywords.filter((keyword) =>
      skillNames.some((skill) => skill.toLowerCase().includes(keyword.toLowerCase()))
    );
    const missingKeywords = requiredKeywords.filter(
      (keyword) => !foundKeywords.some((found) => found.toLowerCase() === keyword.toLowerCase())
    );

    const sectionFeedback = {
      contact: this.buildContactFeedback(basics, sectionScores.contact),
      summary: this.buildSummaryFeedback(summary, sectionScores.summary),
      skills: this.buildSkillsFeedback(skillNames, sectionScores.skills, missingKeywords),
      experience: this.buildExperienceFeedback(experience, sectionScores.experience),
      education: this.buildEducationFeedback(education, sectionScores.education),
      projects: this.buildProjectsFeedback(projects, sectionScores.projects),
    };

    const sections = SECTION_ORDER.map((key) => ({
      section: this.toTitleCase(key),
      score: sectionScores[key],
      status: sectionFeedback[key].status,
      priority: sectionFeedback[key].status === "good" ? "low" : sectionFeedback[key].status === "missing" ? "high" : "medium",
      urgency: sectionFeedback[key].status === "good" ? "low" : sectionFeedback[key].status === "missing" ? "high" : "medium",
      note: sectionFeedback[key].feedback,
      suggestions: sectionFeedback[key].suggestions,
      positives:
        sectionFeedback[key].status === "good"
          ? [sectionFeedback[key].feedback]
          : [],
      details: {
        keywords: sectionFeedback[key].keywords,
      },
    }));

    const plan = SECTION_ORDER.flatMap((key) =>
      sectionFeedback[key].suggestions.map((detail) => ({
        section: this.toTitleCase(key),
        priority:
          sectionFeedback[key].status === "missing"
            ? "high"
            : sectionFeedback[key].status === "needs_improvement"
            ? "medium"
            : "low",
        detail,
        estMinutes:
          sectionFeedback[key].status === "missing"
            ? 20
            : sectionFeedback[key].status === "needs_improvement"
            ? 12
            : 8,
      }))
    );

    const verdict = this.getVerdict(totalScore);

    const ats = {
      totalScore,
      score: totalScore,
      sectionScores,
      sectionFeedback,
      keywords: {
        found: foundKeywords,
        missing: missingKeywords,
      },
      parseQuality: structuredData.parseQuality,
      parserUsed: structuredData.parser,
      resumeId: resume.resumeId,
      userId: resume.userId,
      analyzedAt: Date.now(),
      engine: "hirefold-ats-v3",
      verdict,
      sections,
      sectionSummary: sections,
      keywordGap: {
        foundKeywords,
        missingKeywords,
        suggestedKeywords: missingKeywords,
        confidence:
          requiredKeywords.length > 0 ? Number((foundKeywords.length / requiredKeywords.length).toFixed(2)) : 1,
      },
      improvementPlan: {
        summary: `Your resume scored ${totalScore}/100.`,
        plan,
      },
      breakdown: sectionScores,
    };

    return {
      resumeId: resume.resumeId,
      userId: resume.userId,
      structuredData,
      score: totalScore,
      totalScore,
      sectionScores,
      sectionFeedback,
      keywords: ats.keywords,
      parseQuality: ats.parseQuality,
      parserUsed: ats.parserUsed,
      analyzedAt: ats.analyzedAt,
      verdict,
      sections,
      keywordGap: ats.keywordGap,
      improvementPlan: ats.improvementPlan,
      ats,
    };
  }

  calculateContactScore(basics = {}) {
    let score = 0;
    if (basics.fullName) score += 25;
    if (basics.email) score += 25;
    if (basics.phone) score += 25;
    if (basics.linkedin || basics.github) score += 25;
    return score;
  }

  calculateSummaryScore(summary = "") {
    const words = String(summary || "").trim().split(/\s+/).filter(Boolean).length;
    if (!words) return 0;
    if (words <= 50) return 40;
    if (words <= 100) return 70;
    return 100;
  }

  calculateSkillsScore(skillNames = []) {
    const count = skillNames.length;
    if (count === 0) return 0;
    if (count <= 3) return 30;
    if (count <= 7) return 60;
    if (count <= 15) return 80;
    return 100;
  }

  calculateExperienceScore(experience = []) {
    if (!experience.length) return 0;
    let score = 0;
    if (experience.length === 1) score = 50;
    else if (experience.length === 2) score = 70;
    else score = 85;

    const withDescription = experience.filter(
      (item) => String(item?.description || "").trim() || (item?.achievements || []).length
    ).length;

    return Math.min(100, score + withDescription * 5);
  }

  calculateEducationScore(education = []) {
    if (!education.length) return 0;
    const highestLevel = Math.max(
      ...education.map((item) => Number(item?.level) || getEducationLevelFromDegree(item?.degree))
    );
    if (highestLevel >= 4) return 100;
    if (highestLevel >= 2) return 75;
    return 50;
  }

  calculateProjectsScore(projects = []) {
    if (!projects.length) return 0;
    if (projects.length === 1) return 60;
    return 100;
  }

  buildContactFeedback(basics, score) {
    const missing = [];
    const found = [];

    if (basics.fullName) found.push("fullName");
    else missing.push("fullName");
    if (basics.email) found.push("email");
    else missing.push("email");
    if (basics.phone) found.push("phone");
    else missing.push("phone");
    if (basics.linkedin || basics.github) found.push(basics.linkedin ? "linkedin" : "github");
    else missing.push("linkedin or github");

    return this.buildSectionFeedback({
      score,
      missingCount: missing.length,
      feedback:
        missing.length === 0
          ? "All essential contact details are present."
          : `Missing contact details: ${missing.join(", ")}.`,
      suggestions: missing.length
        ? [`Add ${missing.join(", ")} to the resume header.`]
        : [],
      keywords: found,
    });
  }

  buildSummaryFeedback(summary, score) {
    const words = String(summary || "").trim().split(/\s+/).filter(Boolean).length;
    return this.buildSectionFeedback({
      score,
      missingCount: words ? 0 : 1,
      feedback:
        words === 0
          ? "No professional summary was detected."
          : `Summary length is ${words} words.`,
      suggestions:
        words === 0
          ? ["Add a professional summary tailored to your target role."]
          : words <= 50
          ? ["Expand the summary with role-specific strengths and measurable impact."]
          : [],
      keywords: words ? [summary.split(/\s+/).slice(0, 8).join(" ")] : [],
    });
  }

  buildSkillsFeedback(skillNames, score, missingKeywords) {
    return this.buildSectionFeedback({
      score,
      missingCount: skillNames.length ? 0 : 1,
      feedback:
        skillNames.length === 0
          ? "No skills were extracted from the resume."
          : `${skillNames.length} skills were detected.`,
      suggestions:
        skillNames.length === 0
          ? ["Add a dedicated skills section with relevant tools and technologies."]
          : missingKeywords.length
          ? [`Add missing role keywords: ${missingKeywords.slice(0, 5).join(", ")}.`]
          : [],
      keywords: skillNames.slice(0, 20),
    });
  }

  buildExperienceFeedback(experience, score) {
    const descriptions = experience.filter((item) => item.description || item.achievements?.length).length;
    return this.buildSectionFeedback({
      score,
      missingCount: experience.length ? 0 : 1,
      feedback:
        experience.length === 0
          ? "No work experience entries were detected."
          : `${experience.length} experience entries found, ${descriptions} with supporting detail.`,
      suggestions:
        experience.length === 0
          ? ["Add work experience with role, company, and impact-focused bullets."]
          : descriptions < experience.length
          ? ["Add descriptions or achievement bullets for each role."]
          : [],
      keywords: experience.map((item) => item.role || item.company).filter(Boolean),
    });
  }

  buildEducationFeedback(education, score) {
    return this.buildSectionFeedback({
      score,
      missingCount: education.length ? 0 : 1,
      feedback:
        education.length === 0
          ? "No education details were detected."
          : `${education.length} education entries were detected.`,
      suggestions:
        education.length === 0
          ? ["Add your degree, institution, and graduation year."]
          : education.some((item) => !item.institution || !item.year)
          ? ["Complete education entries with institution names and years."]
          : [],
      keywords: education.map((item) => item.degree).filter(Boolean),
    });
  }

  buildProjectsFeedback(projects, score) {
    return this.buildSectionFeedback({
      score,
      missingCount: projects.length ? 0 : 1,
      feedback:
        projects.length === 0
          ? "No projects were detected."
          : `${projects.length} projects were detected.`,
      suggestions:
        projects.length === 0
          ? ["Add at least one project with description and tech stack."]
          : projects.some((item) => !item.description)
          ? ["Add descriptions and technologies for each project."]
          : [],
      keywords: projects.map((item) => item.name).filter(Boolean),
    });
  }

  buildSectionFeedback({ score, missingCount, feedback, suggestions, keywords }) {
    let status = "good";
    if (missingCount > 0 && score === 0) {
      status = "missing";
    } else if (score < 80) {
      status = "needs_improvement";
    }

    return {
      score,
      feedback,
      suggestions,
      keywords,
      status,
    };
  }

  getVerdict(score) {
    if (score >= 85) return "excellent";
    if (score >= 70) return "good";
    if (score >= 50) return "average";
    return "needs_improvement";
  }

  toTitleCase(value = "") {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}

export const ATSService = new ATSServiceImpl();
export default ATSService;
