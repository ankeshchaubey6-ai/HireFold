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
      features,
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
      features = {},
    } = data;

    const sections = [];

    // Skills Section
    const skillScore = Math.round(metrics.skillScore * 100);
    const skillStatus = skillScore >= 75 ? "strong" : skillScore >= 50 ? "moderate" : "weak";
    const skillRecommendations = [];
    
    if (missingSkills.length > 0) {
      skillRecommendations.push(`Add missing critical skills: ${missingSkills.slice(0, 5).join(", ")}`);
    }
    if (skills.length < 5) {
      skillRecommendations.push(`Expand skill set (currently ${skills.length}, target: 8-12 relevant skills)`);
    }
    if (skills.length > 0 && !skills.some(s => s.toLowerCase().includes("leadership"))) {
      skillRecommendations.push("Include soft skills: Leadership, Communication, Problem-solving");
    }
    
    sections.push({
      name: "Skills",
      score: skillScore,
      status: skillStatus,
      feedback: 
        skillScore >= 75 
          ? `Excellent! ${skills.length} skills identified. ${missingSkills.length > 0 ? `Consider adding: ${missingSkills.slice(0, 2).join(", ")}` : "Great skill-job alignment."}`
          : `${skills.length} skills found (target: 8-12). ${skillRecommendations[0] || "Add more technical and soft skills."}`,
      recommendations: skillRecommendations,
      priority: skillScore < 50 ? "high" : "medium",
      estimatedTime: "15-20 min",
    });

    // Experience Section
    const expScore = Math.round(metrics.experienceScore * 100);
    const expStatus = expScore >= 75 ? "strong" : expScore >= 50 ? "moderate" : "weak";
    const expRecommendations = [];
    const totalExpMonths = features.totalExperienceMonths || 0;
    const avgExpMonths = experience.length > 0 ? totalExpMonths / experience.length : 0;
    
    if (experience.length === 0) {
      expRecommendations.push("Add your work experience history with clear job titles and company names");
      expRecommendations.push("For each role: include dates, key responsibilities, and quantifiable achievements");
    } else if (experience.length < 3) {
      expRecommendations.push(`Expand experience history (currently ${experience.length} roles, target: 3-5 recent roles)`);
    }
    
    // Check if experiences have metrics
    const expHasMetrics = experience.some(e => /(\d+%|increased|grew|reduced|saved|\$\d+)/i.test(e.description || ""));
    if (!expHasMetrics) {
      expRecommendations.push("Add quantifiable achievements: 'increased X by 25%', 'saved $50K annually', etc.");
    }
    
    sections.push({
      name: "Experience",
      score: expScore,
      status: expStatus,
      feedback:
        expScore >= 75
          ? `Strong! ${experience.length} experiences with ${Math.round(totalExpMonths / 12)} years total. Include more metric-driven achievements.`
          : `${experience.length} experiences listed (${Math.round(totalExpMonths / 12)} years). ${expRecommendations[0] || "Strengthen with achievements and metrics."}`,
      recommendations: expRecommendations,
      priority: expScore < 50 ? "high" : "medium",
      estimatedTime: "20-30 min",
    });

    // Education Section
    const eduScore = Math.round(metrics.educationScore * 100);
    const eduStatus = eduScore >= 75 ? "strong" : eduScore >= 50 ? "moderate" : "weak";
    const eduRecommendations = [];
    
    if (education.length === 0) {
      eduRecommendations.push("Add your degree(s): university name, field of study, graduation date");
    } else if (education.length < 1) {
      eduRecommendations.push("Include graduation dates and field of study for each degree");
    }
    
    if (certifications.length === 0) {
      eduRecommendations.push("Add relevant certifications: AWS, Google Cloud, Azure, Scrum Master, etc.");
    }
    
    if (education.some(e => (e.coursework || "").length === 0)) {
      eduRecommendations.push("For degrees: list relevant coursework, GPA (if 3.5+), honors, or achievements");
    }
    
    sections.push({
      name: "Education",
      score: eduScore,
      status: eduStatus,
      feedback:
        eduScore >= 75
          ? `Excellent education profile! ${education.length} degree(s) listed. ${certifications.length > 0 ? "Strong certification coverage." : "Consider adding relevant certifications."}`
          : `${education.length} education entries. ${eduRecommendations[0] || "Add details and relevant certifications."}`,
      recommendations: eduRecommendations,
      priority: eduScore < 50 ? "medium" : "low",
      estimatedTime: "10-15 min",
    });

    // Projects Section
    const projScore = Math.round(metrics.projectScore * 100);
    const projStatus = projScore >= 75 ? "strong" : projScore >= 50 ? "moderate" : "weak";
    const projRecommendations = [];
    
    if (projects.length === 0) {
      projRecommendations.push("Add 2-3 portfolio projects with technologies, brief description, and link");
      projRecommendations.push("Include personal projects, freelance work, or open-source contributions");
    } else if (projects.length < 2) {
      projRecommendations.push(`Expand project portfolio (currently ${projects.length}, target: 3-5 strong projects)`);
    }
    
    const hasProjectLinks = projects.some(p => /github|gitlab|demo|link/i.test(p.description || ""));
    if (!hasProjectLinks) {
      projRecommendations.push("Add GitHub links or live demos for each project");
    }
    
    const hasProjectTech = projects.some(p => /javascript|python|react|node|aws/i.test(p.description || ""));
    if (!hasProjectTech) {
      projRecommendations.push("Highlight technologies used: React, Node.js, AWS, etc.");
    }
    
    sections.push({
      name: "Projects",
      score: projScore,
      status: projStatus,
      feedback:
        projScore >= 75
          ? `Excellent! ${projects.length} projects with solid descriptions. Consider adding more complex projects.`
          : `${projects.length} project(s) listed. ${projRecommendations[0] || "Add project portfolio to demonstrate technical skills."}`,
      recommendations: projRecommendations,
      priority: projScore < 50 ? "high" : "medium",
      estimatedTime: "25-35 min",
    });

    // Certifications Section
    const certScore = Math.round(metrics.certificationScore * 100);
    const certStatus = certScore >= 75 ? "strong" : certScore >= 50 ? "moderate" : "weak";
    const certRecommendations = [];
    
    if (certifications.length === 0) {
      certRecommendations.push("Add industry certifications: AWS Solutions Architect, Google Cloud Associate, Azure Fundamentals");
      certRecommendations.push("Include Agile/Scrum certifications (CSM, PSM), Security (CISSP, CEH), or role-specific certs");
    } else if (certifications.length < 2) {
      certRecommendations.push(`Build certification portfolio (currently ${certifications.length}, target: 2-4 relevant certs)`);
    }
    
    const hasIssueDates = certifications.some(c => /date|issue|valid|expir/i.test(c.name || ""));
    if (!hasIssueDates) {
      certRecommendations.push("Include issue dates for certifications (month/year format)");
    }
    
    sections.push({
      name: "Certifications",
      score: certScore,
      status: certStatus,
      feedback:
        certScore >= 75
          ? `Strong! ${certifications.length} certifications. Keep them current and add emerging tech certifications.`
          : `${certifications.length} certification(s). ${certRecommendations[0] || "Add industry-recognized certifications to boost credibility."}`,
      recommendations: certRecommendations,
      priority: certScore < 50 ? "medium" : "low",
      estimatedTime: "Variable (depends on certification pursuit)",
    });

    // Content Quality Section
    const textScore = Math.round(metrics.textQualityScore * 100);
    const textStatus = textScore >= 75 ? "strong" : textScore >= 50 ? "moderate" : "weak";
    const textRecommendations = [];
    const wordCount = (rawText || "").split(/\s+/).length;
    
    if (wordCount < 300) {
      textRecommendations.push(`Resume is too brief (${wordCount} words, target: 400-600). Expand with achievements and details.`);
    } else if (wordCount > 800) {
      textRecommendations.push(`Resume is lengthy (${wordCount} words, target: 400-600). Remove redundancy and focus on impact.`);
    }
    
    const textHasMetrics = /(\d+%|increased|grew|reduced|saved|\$\d+)/i.test(rawText || "");
    if (!textHasMetrics) {
      textRecommendations.push("Use quantifiable metrics: percentages, dollar amounts, time saved, growth achieved");
    }
    
    const hasActionVerbs = /managed|led|increased|improved|designed|developed|implemented/i.test(rawText || "");
    if (!hasActionVerbs) {
      textRecommendations.push("Start bullet points with action verbs: Led, Designed, Implemented, Optimized, etc.");
    }
    
    const hasSpellingIssues = /teh|recieved|occured|seperate/i.test(rawText || "");
    if (hasSpellingIssues) {
      textRecommendations.push("Fix spelling/grammar errors. Use spell checker before submitting.");
    }
    
    sections.push({
      name: "Content Quality",
      score: textScore,
      status: textStatus,
      feedback:
        textScore >= 75
          ? `Excellent writing! Clear structure, quantified achievements, and strong language. Minor refinements possible.`
          : `Content quality needs work (${wordCount} words). ${textRecommendations[0] || "Improve formatting, metrics, and action verbs."}`,
      recommendations: textRecommendations,
      priority: textScore < 50 ? "high" : "low",
      estimatedTime: "10-15 min",
    });

    return sections;
  }

  getRequiredSkillsForRole(jobRole = "default") {
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
