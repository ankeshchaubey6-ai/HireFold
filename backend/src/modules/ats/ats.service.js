import { ResumeModel } from "../resume/resume.model.js";

class ATSServiceImpl {
  async analyzeResume(resumeOrId, jobRole = "default") {
    const resume =
      typeof resumeOrId === "string"
        ? await ResumeModel.findOne({ resumeId: resumeOrId }).lean()
        : resumeOrId;

    if (!resume) {
      throw new Error("Resume not found");
    }

    const structuredData = resume.structuredData || {};
    const basics = structuredData.basics || {};
    const summary = structuredData.summary || "";
    const skills = Array.isArray(structuredData.skills) ? structuredData.skills : [];
    const experience = Array.isArray(structuredData.experience) ? structuredData.experience : [];
    const education = Array.isArray(structuredData.education) ? structuredData.education : [];
    const projects = Array.isArray(structuredData.projects) ? structuredData.projects : [];
    const certifications = Array.isArray(structuredData.certifications)
      ? structuredData.certifications
      : [];
    const features = structuredData.features || {};
    const rawText = structuredData.rawText || "";

    const requiredSkills = this.getRequiredSkillsForRole(jobRole);

    const skillScore = this.calculateSkillScore(skills, requiredSkills);
    const experienceScore = this.calculateExperienceScore(experience, features);
    const educationScore = this.calculateEducationScore(education, features);
    const projectScore = this.calculateProjectScore(projects, features);
    const certificationScore = this.calculateCertificationScore(certifications, []);
    const textQualityScore = this.calculateTextQualityScore(rawText, features);
    const basicsScore = this.calculateBasicsScore(basics);
    const summaryScore = this.calculateSummaryScore(summary, rawText);
    const missingSkills = this.getMissingSkills(skills, requiredSkills);

    const weightedScore =
      skillScore * 0.25 +
      experienceScore * 0.2 +
      educationScore * 0.12 +
      projectScore * 0.1 +
      certificationScore * 0.08 +
      textQualityScore * 0.1 +
      basicsScore * 0.08 +
      summaryScore * 0.07;

    const score = Math.round(weightedScore * 100);

    const metrics = {
      basicsScore,
      summaryScore,
      skillScore,
      experienceScore,
      educationScore,
      projectScore,
      certificationScore,
      textQualityScore,
      missingSkills,
      requiredSkills,
    };

    const sections = this.buildSectionAnalysis({
      basics,
      summary,
      skills,
      experience,
      education,
      projects,
      certifications,
      features,
      rawText,
      metrics,
    });

    const recommendations = this.generateRecommendations(metrics, sections);
    const improvementPlan = this.buildImprovementPlan(score, sections, recommendations);
    const keywordGap = this.buildKeywordGap(requiredSkills, missingSkills, skills);
    const verdict = this.getVerdict(score);

    const ats = {
      score,
      engine: "hirefold-ats-v2.1",
      jobRole,
      evaluatedAt: Date.now(),
      verdict,
      recommendations,
      sections,
      sectionSummary: sections,
      keywordGap,
      improvementPlan,
      breakdown: {
        basics: Math.round(basicsScore * 100),
        summary: Math.round(summaryScore * 100),
        skills: Math.round(skillScore * 100),
        experience: Math.round(experienceScore * 100),
        education: Math.round(educationScore * 100),
        projects: Math.round(projectScore * 100),
        certifications: Math.round(certificationScore * 100),
        textQuality: Math.round(textQualityScore * 100),
        machineSignals: {
          keywordMatch: this.roundSignal(1 - keywordGap.missingKeywords.length / Math.max(1, requiredSkills.length)),
          skillsCoverage: this.roundSignal(skillScore),
          experienceRelevance: this.roundSignal(experienceScore),
        },
        humanSignals: {
          signalClarity: this.roundSignal(textQualityScore),
          authenticitySignal: this.roundSignal(this.calculateAuthenticitySignal(experience, rawText)),
          structureCompleteness: this.roundSignal(this.calculateStructureCompleteness(features, sections)),
        },
      },
      rawMetrics: {
        ...metrics,
        matchedSkills: keywordGap.matchedKeywords,
      },
    };

    return {
      resumeId: resume.resumeId,
      structuredData,
      score,
      verdict,
      recommendations,
      sections,
      sectionSummary: sections,
      keywordGap,
      improvementPlan,
      ats,
    };
  }

  getRequiredSkillsForRole(jobRole = "default") {
    const roleSkillMap = {
      frontend: ["javascript", "react", "html", "css", "typescript", "responsive design"],
      backend: ["node", "javascript", "api", "database", "sql", "rest"],
      fullstack: ["javascript", "react", "node", "database", "api", "html", "css"],
      data: ["python", "sql", "analysis", "machine learning", "statistics"],
      default: ["communication", "problem solving", "teamwork"],
    };

    return roleSkillMap[jobRole.toLowerCase()] || roleSkillMap.default;
  }

  calculateSkillScore(resumeSkills, requiredSkills) {
    if (!resumeSkills || !requiredSkills || requiredSkills.length === 0) {
      return 0;
    }

    const allResumeSkills = [];
    for (const category of resumeSkills) {
      if (category.items && Array.isArray(category.items)) {
        allResumeSkills.push(
          ...category.items
            .map((item) => item?.name)
            .filter(Boolean)
            .map((name) => name.toLowerCase())
        );
      }
    }

    const requiredSkillsLower = requiredSkills.map((skill) => skill.toLowerCase());
    const matchedSkills = requiredSkillsLower.filter((skill) =>
      allResumeSkills.some(
        (resumeSkill) => resumeSkill.includes(skill) || skill.includes(resumeSkill)
      )
    );

    const baseScore = matchedSkills.length / requiredSkills.length;
    const uniqueCategories = new Set(
      resumeSkills.map((category) => category.category).filter(Boolean)
    );
    const diversityBonus = Math.min(0.2, uniqueCategories.size / 10);

    const criticalSkills = ["javascript", "python", "java", "react", "node"];
    const missingCritical = criticalSkills.filter(
      (skill) => requiredSkillsLower.includes(skill) && !matchedSkills.includes(skill)
    ).length;
    const criticalPenalty = missingCritical * 0.1;

    return Math.max(0, Math.min(1, baseScore + diversityBonus - criticalPenalty));
  }

  calculateExperienceScore(experience, features) {
    if (!experience || experience.length === 0) {
      return 0;
    }

    const totalMonths =
      features?.totalExperienceMonths ||
      experience.reduce((sum, item) => sum + (item.duration?.months || 0), 0);
    const achievements = experience.reduce(
      (sum, item) => sum + (Array.isArray(item.achievements) ? item.achievements.length : 0),
      0
    );

    const durationScore = Math.min(1, totalMonths / 60);
    const achievementBonus = Math.min(0.2, achievements / 10);

    return Math.min(1, durationScore + achievementBonus);
  }

  calculateEducationScore(education, features) {
    if (!education || education.length === 0) {
      return 0;
    }

    const highestLevel =
      features?.highestEducationLevel ||
      Math.max(...education.map((item) => item.level || 0), 0);

    return Math.min(1, highestLevel / 5);
  }

  calculateProjectScore(projects, features) {
    if (!projects || projects.length === 0) {
      return 0;
    }

    const highComplexProjects =
      features?.highComplexProjects ||
      projects.filter((project) => project.complexity === "high").length;
    const projectCount = features?.projectCount || projects.length;

    return Math.min(1, projectCount / 4 + highComplexProjects * 0.1);
  }

  calculateCertificationScore(certifications, preferredCertifications) {
    if (!certifications || certifications.length === 0) {
      return 0;
    }

    let score = Math.min(0.5, certifications.length / 10);

    if (preferredCertifications && preferredCertifications.length > 0) {
      const certNames = certifications.map(
        (certification) =>
          certification.name?.toLowerCase() || certification.title?.toLowerCase() || ""
      );
      const matchedPreferred = preferredCertifications.filter((preferred) =>
        certNames.some((certification) => certification.includes(preferred.toLowerCase()))
      ).length;

      const preferredBonus = (matchedPreferred / preferredCertifications.length) * 0.5;
      score += preferredBonus;
    }

    return Math.min(1, score);
  }

  calculateTextQualityScore(text, features) {
    if (!text) {
      return 0;
    }

    let score = 0;
    const wordCount = features?.wordCount || text.split(/\s+/).length;

    if (wordCount > 2000) {
      score += 0.3;
    } else if (wordCount > 1000) {
      score += 0.5;
    } else if (wordCount > 500) {
      score += 0.7;
    } else if (wordCount > 250) {
      score += 0.4;
    } else {
      score += 0.2;
    }

    const sectionCount = features?.sectionCount || 0;
    score += Math.min(0.3, sectionCount / 10);

    const hasMetrics = /(\d+%|\d+x|increased|reduced|improved|achieved)/i.test(text);
    if (hasMetrics) {
      score += 0.2;
    }

    return Math.min(1, score);
  }

  calculateBasicsScore(basics) {
    const requiredFields = [
      basics?.fullName,
      basics?.email,
      basics?.phone,
      basics?.location,
      basics?.linkedin,
      basics?.github,
    ];

    const presentCount = requiredFields.filter((field) => String(field || "").trim()).length;
    return presentCount / requiredFields.length;
  }

  calculateSummaryScore(summary, rawText) {
    const summaryText = String(summary || "").trim();
    if (!summaryText) {
      return 0;
    }

    const lengthScore = Math.min(1, summaryText.split(/\s+/).length / 80);
    const keywordBonus = /(\d+%|\d+x|experienced|specialist|engineer|developer|manager)/i.test(
      summaryText || rawText
    )
      ? 0.2
      : 0;

    return Math.min(1, lengthScore + keywordBonus);
  }

  calculateAuthenticitySignal(experience, rawText) {
    const achievementCount = experience.reduce(
      (sum, item) => sum + (Array.isArray(item.achievements) ? item.achievements.length : 0),
      0
    );
    const hasMetrics = /(\d+%|\d+x|increased|reduced|improved|achieved)/i.test(rawText || "");

    return Math.min(1, achievementCount / 6 + (hasMetrics ? 0.2 : 0));
  }

  calculateStructureCompleteness(features, sections) {
    const sectionCount = features?.sectionCount || sections.length;
    return Math.min(1, sectionCount / 7);
  }

  getMissingSkills(resumeSkills, requiredSkills) {
    if (!resumeSkills || !requiredSkills) {
      return requiredSkills || [];
    }

    const allResumeSkills = [];
    for (const category of resumeSkills) {
      if (category.items && Array.isArray(category.items)) {
        allResumeSkills.push(
          ...category.items
            .map((item) => item?.name)
            .filter(Boolean)
            .map((name) => name.toLowerCase())
        );
      }
    }

    return requiredSkills.filter(
      (skill) =>
        !allResumeSkills.some((resumeSkill) => resumeSkill.includes(skill.toLowerCase()))
    );
  }

  getVerdict(score) {
    if (score >= 85) {
      return {
        level: "excellent",
        text: "Excellent match! Strong candidate with exceptional qualifications.",
        color: "#10b981",
        action: "Highly Recommended - Proceed to interview",
      };
    }

    if (score >= 70) {
      return {
        level: "good",
        text: "Good match. Candidate meets most requirements with solid experience.",
        color: "#3b82f6",
        action: "Recommended - Schedule interview",
      };
    }

    if (score >= 55) {
      return {
        level: "average",
        text: "Average match. Candidate has some relevant skills but lacks in key areas.",
        color: "#f59e0b",
        action: "Consider - May need additional training",
      };
    }

    if (score >= 40) {
      return {
        level: "below_average",
        text: "Below average match. Limited relevant experience and skills.",
        color: "#ef4444",
        action: "Review - Not recommended for senior roles",
      };
    }

    return {
      level: "poor",
      text: "Poor match. Significant gaps in required qualifications.",
      color: "#6b7280",
      action: "Reject - Not suitable for current role",
    };
  }

  generateRecommendations(metrics, sections = []) {
    const recommendations = [];

    if (metrics.skillScore < 0.6 && metrics.missingSkills?.length > 0) {
      recommendations.push({
        category: "skills",
        priority: "high",
        message: `Add missing key skills: ${metrics.missingSkills.slice(0, 5).join(", ")}`,
        action: "Update skills section with these technologies",
      });
    }

    if (metrics.experienceScore < 0.5) {
      recommendations.push({
        category: "experience",
        priority: "high",
        message: "Highlight more relevant work experience with specific achievements",
        action: "Add quantifiable achievements such as performance or impact metrics",
      });
    }

    if (metrics.educationScore < 0.6) {
      recommendations.push({
        category: "education",
        priority: "medium",
        message: "Include relevant coursework or certifications to strengthen education section",
        action: "Add relevant courses, bootcamps, or certifications",
      });
    }

    if (metrics.projectScore < 0.5) {
      recommendations.push({
        category: "projects",
        priority: "medium",
        message: "Add more detailed project descriptions with tech stack and impact",
        action: "Include 2-3 detailed projects with technologies used and outcomes",
      });
    }

    if (metrics.certificationScore < 0.3) {
      recommendations.push({
        category: "certifications",
        priority: "low",
        message: "Consider adding relevant certifications to validate skills",
        action: "Pursue industry certifications such as AWS, Azure, or Scrum",
      });
    }

    for (const section of sections) {
      if (section.priority === "high" && section.suggestions?.length) {
        recommendations.push({
          category: section.section.toLowerCase(),
          priority: "high",
          message: section.suggestions[0],
          action: section.note,
        });
      }
    }

    return recommendations;
  }

  buildSectionAnalysis({
    basics,
    summary,
    skills,
    experience,
    education,
    projects,
    certifications,
    features,
    rawText,
    metrics,
  }) {
    const allSkillItems = skills.flatMap((group) =>
      Array.isArray(group?.items) ? group.items.filter((item) => item?.name) : []
    );
    const basicsFields = [
      ["Name", basics?.fullName],
      ["Email", basics?.email],
      ["Phone", basics?.phone],
      ["Location", basics?.location],
      ["LinkedIn", basics?.linkedin],
      ["GitHub", basics?.github],
    ];
    const missingBasics = basicsFields
      .filter(([, value]) => !String(value || "").trim())
      .map(([label]) => label);
    const experienceAchievements = experience.reduce(
      (sum, item) => sum + (Array.isArray(item.achievements) ? item.achievements.length : 0),
      0
    );
    const hasMetrics = /(\d+%|\d+x|increased|reduced|improved|achieved)/i.test(rawText || "");

    return [
      this.createSectionResult({
        section: "Basics",
        score: Math.round(metrics.basicsScore * 100),
        suggestions: missingBasics.length
          ? [`Add missing contact details: ${missingBasics.join(", ")}.`]
          : [],
        positives: missingBasics.length === 0 ? ["Core contact details are present and easy to scan."] : [],
        note:
          missingBasics.length === 0
            ? "Recruiters and ATS can identify your profile quickly."
            : "A few key contact details are missing from the resume header.",
        details: {
          presentFields: basicsFields.length - missingBasics.length,
          totalFields: basicsFields.length,
          missing: missingBasics,
        },
      }),
      this.createSectionResult({
        section: "Summary",
        score: Math.round(metrics.summaryScore * 100),
        suggestions: summary
          ? summary.split(/\s+/).length < 40
            ? ["Expand the summary with role-specific strengths, tools, and measurable impact."]
            : []
          : ["Add a concise professional summary tailored to the role."],
        positives: summary
          ? ["A summary section is present, which helps ATS and recruiters quickly understand your profile."]
          : [],
        note: summary
          ? "Summary quality is based on completeness and relevance signals."
          : "No summary was detected in the resume.",
        details: {
          wordCount: String(summary || "").trim().split(/\s+/).filter(Boolean).length,
        },
      }),
      this.createSectionResult({
        section: "Skills",
        score: Math.round(metrics.skillScore * 100),
        suggestions: metrics.missingSkills.length
          ? [`Add or strengthen these keywords: ${metrics.missingSkills.slice(0, 5).join(", ")}.`]
          : [],
        positives: allSkillItems.length
          ? [`${allSkillItems.length} skill keywords were detected across the resume.`]
          : [],
        note:
          metrics.missingSkills.length > 0
            ? "Some target-role keywords are still missing from the skills profile."
            : "Skills coverage aligns well with the target role baseline.",
        details: {
          skillsCount: allSkillItems.length,
          skillCategories: skills.length,
          matchedKeywords: metrics.requiredSkills.length - metrics.missingSkills.length,
          missingKeywords: metrics.missingSkills.length,
        },
      }),
      this.createSectionResult({
        section: "Experience",
        score: Math.round(metrics.experienceScore * 100),
        suggestions:
          experience.length === 0
            ? ["Add work experience entries with role, company, and measurable achievements."]
            : !hasMetrics
            ? ["Use quantified impact in bullet points, such as percentages, growth, or delivery metrics."]
            : experienceAchievements < Math.max(2, experience.length)
            ? ["Add stronger achievement bullets to show impact in each role."]
            : [],
        positives: experience.length
          ? [`${experience.length} experience entries were detected.`]
          : [],
        note:
          experience.length === 0
            ? "No structured work experience was detected."
            : "Experience quality is measured using duration, achievements, and evidence of impact.",
        details: {
          roles: experience.length,
          achievements: experienceAchievements,
          hasMetrics,
          totalMonths: features?.totalExperienceMonths || 0,
        },
      }),
      this.createSectionResult({
        section: "Education",
        score: Math.round(metrics.educationScore * 100),
        suggestions:
          education.length === 0
            ? ["Add your highest education credential, institution, and graduation year."]
            : metrics.educationScore < 0.6
            ? ["Include degree details, institution, and relevant coursework or certifications."]
            : [],
        positives: education.length ? ["Education history is present in the resume."] : [],
        note:
          education.length === 0
            ? "No education section was detected."
            : "Education score is based on level of study and completeness.",
        details: {
          educationCount: education.length,
          highestEducationLevel: features?.highestEducationLevel || 0,
        },
      }),
      this.createSectionResult({
        section: "Projects",
        score: Math.round(metrics.projectScore * 100),
        suggestions:
          projects.length === 0
            ? ["Add 1-3 projects with technologies used and measurable outcomes."]
            : features?.highComplexProjects > 0
            ? []
            : ["Describe project scope, tech stack, and the outcome more explicitly."],
        positives: projects.length ? [`${projects.length} projects were detected.`] : [],
        note:
          projects.length === 0
            ? "No project section was detected."
            : "Projects help ATS understand practical, hands-on experience.",
        details: {
          projectsCount: projects.length,
          highComplexProjects: features?.highComplexProjects || 0,
        },
      }),
      this.createSectionResult({
        section: "Certifications",
        score: Math.round(metrics.certificationScore * 100),
        suggestions:
          certifications.length === 0
            ? ["Add relevant certifications if they support your target role."]
            : [],
        positives: certifications.length
          ? [`${certifications.length} certification entries were detected.`]
          : [],
        note:
          certifications.length === 0
            ? "Certifications are optional but can strengthen specific role matches."
            : "Certifications reinforce domain credibility when relevant.",
        details: {
          certificationsCount: certifications.length,
        },
      }),
      this.createSectionResult({
        section: "Formatting",
        score: Math.round(metrics.textQualityScore * 100),
        suggestions:
          features?.wordCount < 250
            ? ["Add more detail so the resume has enough substance for ATS scoring."]
            : features?.wordCount > 2000
            ? ["Trim low-signal content to keep the resume focused and scannable."]
            : features?.sectionCount < 5
            ? ["Use clearer section headings to improve structure and ATS parsing."]
            : [],
        positives:
          features?.sectionCount >= 5
            ? ["The resume uses recognizable section structure."]
            : [],
        note: "Formatting is evaluated using content length, structure, and measurable signals.",
        details: {
          wordCount: features?.wordCount || 0,
          sectionCount: features?.sectionCount || 0,
        },
      }),
    ];
  }

  createSectionResult({ section, score, suggestions = [], positives = [], note = "", details = {} }) {
    const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
    const status = safeScore >= 80 ? "strong" : safeScore >= 65 ? "good" : safeScore >= 45 ? "average" : "weak";
    const priority = safeScore < 50 ? "high" : safeScore < 70 ? "medium" : "low";
    const urgency = priority;

    return {
      section,
      score: safeScore,
      status,
      priority,
      urgency,
      note,
      suggestions,
      positives,
      details,
    };
  }

  buildKeywordGap(requiredSkills, missingSkills, skills) {
    const resumeKeywords = skills.flatMap((group) =>
      Array.isArray(group?.items)
        ? group.items.map((item) => item?.name).filter(Boolean)
        : []
    );
    const matchedKeywords = requiredSkills.filter(
      (required) =>
        !missingSkills.some((missing) => missing.toLowerCase() === required.toLowerCase())
    );
    const suggestedKeywords = requiredSkills.filter(
      (required) =>
        !resumeKeywords.some((keyword) => keyword.toLowerCase().includes(required.toLowerCase()))
    );

    return {
      missingKeywords: missingSkills.slice(0, 8),
      suggestedKeywords: suggestedKeywords.slice(0, 8),
      matchedKeywords,
      confidence: this.roundSignal(
        matchedKeywords.length / Math.max(1, requiredSkills.length)
      ),
    };
  }

  buildImprovementPlan(score, sections, recommendations) {
    const plan = [];

    for (const section of sections) {
      for (const suggestion of section.suggestions || []) {
        plan.push({
          section: section.section,
          priority: section.priority,
          detail: suggestion,
          estMinutes: section.priority === "high" ? 20 : section.priority === "medium" ? 12 : 8,
        });
      }
    }

    for (const recommendation of recommendations) {
      if (
        !plan.some(
          (item) =>
            item.section.toLowerCase() === recommendation.category &&
            item.detail === recommendation.action
        )
      ) {
        plan.push({
          section: this.toTitleCase(recommendation.category),
          priority: recommendation.priority,
          detail: recommendation.action,
          estMinutes: recommendation.priority === "high" ? 18 : 10,
        });
      }
    }

    plan.sort((left, right) => this.priorityWeight(left.priority) - this.priorityWeight(right.priority));

    const verdict =
      score >= 80
        ? "Your resume is in strong shape."
        : score >= 60
        ? "Your resume is competitive but still has a few clear upgrade opportunities."
        : "Your resume needs several targeted fixes to improve ATS performance.";

    return {
      summary: `Your resume scored ${score}/100. ${verdict}`,
      plan,
    };
  }

  priorityWeight(priority) {
    if (priority === "high") return 0;
    if (priority === "medium") return 1;
    return 2;
  }

  toTitleCase(value = "") {
    return value
      .split(/[\s_-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  roundSignal(value) {
    const safe = Math.max(0, Math.min(1, Number(value) || 0));
    return Number(safe.toFixed(2));
  }

  async batchAnalyze(resumes, jobRole = "default") {
    const results = [];

    for (const resume of resumes) {
      try {
        const result = await this.analyzeResume(resume, jobRole);
        results.push({
          resumeId: resume.resumeId,
          ...result,
        });
      } catch (error) {
        results.push({
          resumeId: resume.resumeId,
          error: error.message,
        });
      }
    }

    results.sort((a, b) => (b.score || 0) - (a.score || 0));
    return results;
  }
}

export const ATSService = new ATSServiceImpl();

export default ATSService;
