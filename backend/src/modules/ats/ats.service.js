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
    const missingSkills = this.getMissingSkills(skills, requiredSkills);

    const weightedScore =
      skillScore * 0.35 +
      experienceScore * 0.25 +
      educationScore * 0.15 +
      projectScore * 0.1 +
      certificationScore * 0.05 +
      textQualityScore * 0.1;

    const score = Math.round(weightedScore * 100);

    const metrics = {
      skillScore,
      experienceScore,
      educationScore,
      projectScore,
      certificationScore,
      textQualityScore,
      missingSkills,
    };

    // Generate section-wise breakdown with feedback
    const sections = this.generateSectionFeedback({
      metrics,
      score,
      skills,
      experience,
      education,
      projects,
      certifications,
      requiredSkills,
      missingSkills,
      rawText,
    });

    return {
      resumeId: resume.resumeId,
      score,
      verdict: this.getVerdict(score),
      recommendations: this.generateRecommendations(metrics),
      sections,
      ats: {
        score,
        engine: "hirefold-ats-v2.0",
        jobRole,
        evaluatedAt: Date.now(),
        breakdown: {
          skills: Math.round(skillScore * 100),
          experience: Math.round(experienceScore * 100),
          education: Math.round(educationScore * 100),
          projects: Math.round(projectScore * 100),
          certifications: Math.round(certificationScore * 100),
          textQuality: Math.round(textQualityScore * 100),
        },
        sections,
        rawMetrics: metrics,
      },
    };
  }

  generateSectionFeedback(data) {
    const {
      metrics,
      score,
      skills,
      experience,
      education,
      projects,
      certifications,
      requiredSkills,
      missingSkills,
      rawText,
    } = data;

    const sections = [];

    // Skills Section
    const skillScore = Math.round(metrics.skillScore * 100);
    sections.push({
      name: "Skills",
      score: skillScore,
      status: skillScore >= 75 ? "strong" : skillScore >= 50 ? "moderate" : "weak",
      feedback:
        skillScore >= 75
          ? `Strong skill set with ${skills.length} categories. ${missingSkills.length > 0 ? `Consider adding: ${missingSkills.slice(0, 3).join(", ")}` : "No critical gaps detected."}`
          : skillScore >= 50
            ? `Moderate skill coverage. Missing critical skills: ${missingSkills.slice(0, 3).join(", ")}. Prioritize these for your role.`
            : `Weak skill alignment. Add these key skills: ${missingSkills.slice(0, 5).join(", ")}`,
    });

    // Experience Section
    const expScore = Math.round(metrics.experienceScore * 100);
    sections.push({
      name: "Experience",
      score: expScore,
      status: expScore >= 75 ? "strong" : expScore >= 50 ? "moderate" : "weak",
      feedback:
        expScore >= 75
          ? `${experience.length} relevant work experiences with strong achievement metrics.`
          : expScore >= 50
            ? `${experience.length} work experiences listed. Add more specific achievements and quantifiable results.`
            : "Limited or missing work experience. Add details about past roles and accomplishments.",
    });

    // Education Section
    const eduScore = Math.round(metrics.educationScore * 100);
    sections.push({
      name: "Education",
      score: eduScore,
      status: eduScore >= 75 ? "strong" : eduScore >= 50 ? "moderate" : "weak",
      feedback:
        eduScore >= 75
          ? "Strong educational background. Consider adding relevant certifications."
          : eduScore >= 50
            ? `${education.length} degrees listed. Consider adding certifications or relevant coursework.`
            : "Limited education details. Add degree information and relevant coursework.",
    });

    // Projects Section
    const projScore = Math.round(metrics.projectScore * 100);
    sections.push({
      name: "Projects",
      score: projScore,
      status: projScore >= 75 ? "strong" : projScore >= 50 ? "moderate" : "weak",
      feedback:
        projScore >= 75
          ? `Strong project portfolio with ${projects.length} detailed projects demonstrating technical ability.`
          : projScore >= 50
            ? `${projects.length} projects included. Enhance descriptions with technologies and business impact.`
            : projects.length > 0
              ? "Limited project details. Add 2-3 detailed projects with tech stack and outcomes."
              : "No projects listed. Add project portfolio to demonstrate practical skills.",
    });

    // Certifications Section
    const certScore = Math.round(metrics.certificationScore * 100);
    sections.push({
      name: "Certifications",
      score: certScore,
      status: certScore >= 75 ? "strong" : certScore >= 50 ? "moderate" : "weak",
      feedback:
        certScore >= 75
          ? `${certifications.length} relevant certifications. Excellent credential coverage.`
          : certScore >= 50
            ? `${certifications.length} certifications listed. Consider adding industry-standard certifications.`
            : certifications.length > 0
              ? "Limited certifications. Add AWS, GCP, Azure, or other industry certifications."
              : "No certifications listed. Pursue industry certifications to strengthen your profile.",
    });

    // Content Quality Section
    const textScore = Math.round(metrics.textQualityScore * 100);
    sections.push({
      name: "Content Quality",
      score: textScore,
      status: textScore >= 75 ? "strong" : textScore >= 50 ? "moderate" : "weak",
      feedback:
        textScore >= 75
          ? "Well-structured resume with quantifiable metrics and clear descriptions."
          : textScore >= 50
            ? "Good content structure. Include more metrics (percentages, numbers) for impact."
            : "Resume lacks detail and metrics. Add quantifiable achievements and specific outcomes.",
    });

    return sections;
  }
    const roleSkillMap = {
      frontend: ["javascript", "react", "html", "css"],
      backend: ["node", "javascript", "api", "database"],
      fullstack: ["javascript", "react", "node", "database"],
      data: ["python", "sql", "analysis", "machine learning"],
      default: ["communication", "problem solving"],
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
        allResumeSkills.push(...category.items.map((item) => item.name.toLowerCase()));
      }
    }

    const requiredSkillsLower = requiredSkills.map((skill) => skill.toLowerCase());
    const matchedSkills = requiredSkillsLower.filter((skill) =>
      allResumeSkills.some(
        (resumeSkill) => resumeSkill.includes(skill) || skill.includes(resumeSkill)
      )
    );

    const baseScore = matchedSkills.length / requiredSkills.length;
    const uniqueCategories = new Set(resumeSkills.map((category) => category.category));
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
      const certNames = certifications.map((certification) => certification.name?.toLowerCase() || "");
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

  getMissingSkills(resumeSkills, requiredSkills) {
    if (!resumeSkills || !requiredSkills) {
      return requiredSkills || [];
    }

    const allResumeSkills = [];
    for (const category of resumeSkills) {
      if (category.items && Array.isArray(category.items)) {
        allResumeSkills.push(...category.items.map((item) => item.name.toLowerCase()));
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

  generateRecommendations(metrics) {
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

    return recommendations;
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
