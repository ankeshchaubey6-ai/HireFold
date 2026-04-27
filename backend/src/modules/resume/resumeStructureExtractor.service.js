/* =========================================================
   HIREFOLD PRODUCTION RESUME PARSER v2.0
   Fixed to always return arrays for experience, skills, etc.
========================================================= */

const SECTION_HEADERS = {
  skills: [
    "skills", "technical skills", "technologies", "tech stack", 
    "core competencies", "expertise", "programming languages",
    "tools & technologies", "languages and frameworks"
  ],
  experience: [
    "experience", "work experience", "employment", "work history",
    "professional experience", "career history", "employment history"
  ],
  education: [
    "education", "academics", "educational background", "qualifications",
    "academic background", "degrees", "certifications"
  ],
  projects: [
    "projects", "personal projects", "side projects", "portfolio",
    "key projects", "academic projects", "project experience"
  ],
  summary: [
    "summary", "profile", "about", "professional summary",
    "objective", "career objective", "personal statement"
  ],
  certifications: [
    "certifications", "certificates", "professional certifications",
    "licenses", "credentials"
  ],
  achievements: [
    "achievements", "awards", "honors", "recognition"
  ]
};

// Predefined skill categories with comprehensive skill lists
const SKILL_CATEGORIES = {
  frontend: [
    "react", "react.js", "angular", "vue", "vue.js", "javascript", 
    "typescript", "html", "css", "sass", "less", "tailwind", 
    "bootstrap", "jquery", "next.js", "nuxt.js", "webpack"
  ],
  backend: [
    "node", "node.js", "express", "django", "flask", "spring", 
    "spring boot", "laravel", "asp.net", "go", "golang", "rust",
    "php", "ruby on rails", "fastapi", "graphql", "rest api"
  ],
  databases: [
    "mongodb", "mysql", "postgresql", "postgres", "oracle", 
    "sql server", "redis", "elasticsearch", "cassandra", 
    "dynamodb", "firebase", "sqlite", "mariadb"
  ],
  cloud_devops: [
    "aws", "amazon web services", "azure", "google cloud", "gcp",
    "docker", "kubernetes", "jenkins", "gitlab ci", "github actions",
    "terraform", "ansible", "prometheus", "grafana", "cloudformation"
  ],
  languages: [
    "python", "java", "javascript", "typescript", "c++", "c#", 
    "ruby", "php", "swift", "kotlin", "go", "rust", "scala",
    "perl", "bash", "shell", "sql"
  ],
  tools: [
    "git", "github", "gitlab", "bitbucket", "jira", "confluence",
    "vscode", "intellij", "eclipse", "postman", "swagger", 
    "figma", "adobe xd", "slack", "trello", "notion"
  ],
  data_science: [
    "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch",
    "keras", "matplotlib", "seaborn", "jupyter", "spark",
    "hadoop", "airflow", "tableau", "power bi"
  ]
};

// Education level mapping for normalization
const EDUCATION_LEVELS = {
  "phd": 5,
  "doctorate": 5,
  "master": 4,
  "masters": 4,
  "m.tech": 4,
  "m.sc": 4,
  "mba": 4,
  "bachelor": 3,
  "b.tech": 3,
  "b.e": 3,
  "b.sc": 3,
  "b.a": 3,
  "associate": 2,
  "diploma": 2,
  "certificate": 1,
  "high school": 0
};

/* ================= MAIN EXPORT FUNCTION ================= */

export function extractStructuredDataFromText(rawText = "") {
  if (!rawText || typeof rawText !== 'string') {
    return getEmptyStructure();
  }

  const text = normalizeText(rawText);
  const sections = detectSections(text);
  
  // Extract entities first (name, email, phone)
  const entities = extractEntities(text);
  
  // Parse sections with enhanced extraction - ALWAYS RETURN ARRAYS
  const skills = parseSkillsEnhanced(sections.skills || sections.experience || text);
  const experience = parseExperienceEnhanced(sections.experience || text);
  const education = parseEducationEnhanced(sections.education || text);
  const projects = parseProjectsEnhanced(sections.projects || text);
  const certifications = parseCertifications(sections.certifications || text);
  const summary = extractSummary(sections.summary || text);
  
  // Build ML-ready features
  const features = buildFeatureVector({
    text,
    skills,
    experience,
    education,
    projects,
    certifications
  });
  
  return {
    rawText: text,
    basics: entities.basics,
    summary,
    skills: skills, // Already array
    experience: experience, // Already array
    education: education, // Already array
    projects: projects, // Already array
    certifications: certifications, // Already array
    features,
    meta: {
      parser: "hirefold-ner-v2",
      version: "2.0.0",
      sectionDetected: Object.keys(sections).filter(k => sections[k] && sections[k].length > 0),
      extractionDate: Date.now()
    }
  };
}

/* ================= TEXT NORMALIZATION ================= */

function normalizeText(text) {
  return text
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[^\x00-\x7F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ================= SECTION DETECTION ================= */

function detectSections(text) {
  const lines = text.split("\n");
  const sections = {};
  let currentSection = "other";
  let sectionContent = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();
    
    // Check if line is a section header
    let foundSection = null;
    for (const [section, headers] of Object.entries(SECTION_HEADERS)) {
      if (headers.some(header => lowerLine.includes(header) && line.length < 50)) {
        foundSection = section;
        break;
      }
    }
    
    if (foundSection) {
      // Save previous section
      if (currentSection !== "other" && sectionContent.length > 0) {
        sections[currentSection] = sectionContent.join("\n").trim();
      }
      
      // Start new section
      currentSection = foundSection;
      sectionContent = [];
    } else if (currentSection !== "other") {
      sectionContent.push(line);
    } else {
      // Accumulate other content (could be summary)
      if (!sections.other) sections.other = [];
      sections.other.push(line);
    }
  }
  
  // Save last section
  if (currentSection !== "other" && sectionContent.length > 0) {
    sections[currentSection] = sectionContent.join("\n").trim();
  }
  
  // If no summary section detected, use first 500 chars as summary
  if (!sections.summary && sections.other) {
    sections.summary = sections.other.slice(0, 10).join("\n").substring(0, 500);
  }
  
  return sections;
}

/* ================= ENTITY EXTRACTION (NER) ================= */

function extractEntities(text) {
  const basics = {
    fullName: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    location: extractLocation(text),
    linkedin: extractLinkedIn(text),
    github: extractGitHub(text)
  };
  
  return { basics };
}

function extractName(text) {
  const firstLines = text.split("\n").slice(0, 5);
  
  for (const line of firstLines) {
    const trimmed = line.trim();
    if (trimmed && trimmed.length < 50 && trimmed.split(" ").length >= 2) {
      const words = trimmed.split(" ");
      const allCapsOrTitle = words.every(w => 
        w[0] === w[0].toUpperCase() || w === w.toUpperCase()
      );
      
      if (allCapsOrTitle && !words.some(w => w.includes("@") || w.match(/\d/))) {
        return trimmed;
      }
    }
  }
  
  return "";
}

function extractEmail(text) {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const matches = text.match(emailRegex);
  return matches && matches.length > 0 ? matches[0] : "";
}

function extractPhone(text) {
  const phoneRegexes = [
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    /\b\d{10}\b/g,
    /\+\d{1,3}\s?\d{3}\s?\d{3}\s?\d{4}\b/g
  ];
  
  for (const regex of phoneRegexes) {
    const matches = text.match(regex);
    if (matches && matches.length > 0) {
      return matches[0];
    }
  }
  
  return "";
}

function extractLocation(text) {
  const locationRegex = /\b[A-Z][a-z]+,\s*[A-Z]{2}\b|\b[A-Z][a-z]+\s*,\s*[A-Z][a-z]+\b/g;
  const matches = text.match(locationRegex);
  return matches && matches.length > 0 ? matches[0] : "";
}

function extractLinkedIn(text) {
  const linkedinRegex = /linkedin\.com\/in\/[\w-]+/gi;
  const matches = text.match(linkedinRegex);
  return matches && matches.length > 0 ? matches[0] : "";
}

function extractGitHub(text) {
  const githubRegex = /github\.com\/[\w-]+/gi;
  const matches = text.match(githubRegex);
  return matches && matches.length > 0 ? matches[0] : "";
}

/* ================= SKILLS PARSING (Categorized) ================= */

function parseSkillsEnhanced(text = "") {
  if (!text) return [];
  
  const lowerText = text.toLowerCase();
  const skillsByCategory = [];
  
  for (const [category, skillList] of Object.entries(SKILL_CATEGORIES)) {
    const foundSkills = [];
    
    for (const skill of skillList) {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lowerText)) {
        foundSkills.push({
          name: skill,
          confidence: 0.9
        });
      }
    }
    
    if (foundSkills.length > 0) {
      skillsByCategory.push({
        category,
        count: foundSkills.length,
        items: foundSkills
      });
    }
  }
  
  return skillsByCategory;
}

/* ================= EXPERIENCE PARSING (ALWAYS RETURNS ARRAY) ================= */

function parseExperienceEnhanced(text = "") {
  if (!text) return [];
  
  const experiences = [];
  const lines = text.split("\n");
  
  // Extract lines that look like experience entries
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Check for date patterns (Jul 2025 - Aug 2025)
    const dateMatch = line.match(/(\w+\s+\d{4})\s*[-]\s*(\w+\s+\d{4}|\bpresent\b)/i);
    if (dateMatch) {
      const experience = {
        role: "",
        company: "",
        duration: {
          start: null,
          end: null,
          months: 0,
          raw: dateMatch[0]
        },
        description: [],
        achievements: []
      };
      
      // Extract role (text before date)
      const beforeDate = line.substring(0, dateMatch.index).trim();
      if (beforeDate) {
        experience.role = beforeDate;
      }
      
      // Check if company is on previous line
      if (i > 0 && lines[i-1].trim() && !lines[i-1].match(/(\w+\s+\d{4})/)) {
        experience.company = lines[i-1].trim();
      }
      
      // Collect description (next 2-3 lines)
      let descLines = [];
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        const descLine = lines[j].trim();
        if (descLine && !descLine.match(/(\w+\s+\d{4})/)) {
          descLines.push(descLine);
        }
      }
      experience.description = descLines;
      
      // Extract achievements
      const achievementPatterns = [
        /(achieved|increased|reduced|improved|developed|implemented|created|designed|built|led|managed)/i,
        /\d+%|\d+x/i
      ];
      
      experience.achievements = descLines.filter(line => 
        achievementPatterns.some(p => p.test(line))
      );
      
      experiences.push(experience);
    }
  }
  
  // If no structured experiences found, try to extract from raw text
  if (experiences.length === 0) {
    const experienceText = text;
    const expPattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+([A-Z][a-z]+\s+\d{4})\s*[-]\s*([A-Z][a-z]+\s+\d{4}|\bpresent\b)/gi;
    let match;
    while ((match = expPattern.exec(experienceText)) !== null) {
      experiences.push({
        role: match[1] || "",
        company: "",
        duration: {
          start: null,
          end: null,
          months: 0,
          raw: `${match[2]} - ${match[3]}`
        },
        description: [],
        achievements: []
      });
    }
  }
  
  return experiences;
}

/* ================= EDUCATION PARSING (Enhanced) ================= */

function parseEducationEnhanced(text = "") {
  if (!text) return [];
  
  const education = [];
  const lines = text.split("\n");
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    if (/(b\.?tech|m\.?tech|bachelor|master|phd|diploma|degree|university|college)/i.test(line)) {
      const edu = {
        degree: "",
        field: "",
        institution: "",
        year: null,
        level: null,
        raw: line
      };
      
      const degreeMatch = line.match(/(b\.?tech|m\.?tech|bachelor|master|phd|diploma|b\.?sc|m\.?sc|mba)/i);
      if (degreeMatch) {
        edu.degree = degreeMatch[0];
        
        const levelKey = Object.keys(EDUCATION_LEVELS).find(key => 
          edu.degree.toLowerCase().includes(key)
        );
        edu.level = levelKey ? EDUCATION_LEVELS[levelKey] : 3;
      }
      
      const yearMatch = line.match(/\b(19|20)\d{2}\b/);
      if (yearMatch) {
        edu.year = parseInt(yearMatch[0]);
      }
      
      const institutionMatch = line.match(/(?:from|at|in)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
      if (institutionMatch) {
        edu.institution = institutionMatch[1];
      }
      
      education.push(edu);
    }
  }
  
  return education;
}

/* ================= PROJECTS PARSING (Enhanced) ================= */

function parseProjectsEnhanced(text = "") {
  if (!text) return [];
  
  const projects = [];
  const lines = text.split("\n");
  
  for (const line of lines) {
    if (line.trim() && line.length < 200 && !line.match(/(education|experience|skills)/i)) {
      const project = {
        name: line.trim().substring(0, 100),
        techStack: [],
        complexity: "low",
        description: "",
        impact: "",
        duration: null
      };
      
      // Extract technologies
      for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
        const foundTechs = skills.filter(skill => 
          line.toLowerCase().includes(skill.toLowerCase())
        );
        if (foundTechs.length > 0) {
          project.techStack.push(...foundTechs);
        }
      }
      
      // Determine complexity
      if (project.techStack.length > 3 || line.length > 150) {
        project.complexity = "high";
      } else if (project.techStack.length > 1 || line.length > 75) {
        project.complexity = "medium";
      }
      
      projects.push(project);
    }
  }
  
  return projects.slice(0, 10);
}

/* ================= CERTIFICATIONS PARSING ================= */

function parseCertifications(text = "") {
  if (!text) return [];
  
  const certifications = [];
  const lines = text.split("\n");
  
  const certKeywords = [
    "certified", "certification", "certificate", "aws", "azure", 
    "google cloud", "scrum", "agile", "pmp", "itil"
  ];
  
  for (const line of lines) {
    if (certKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
      certifications.push({
        name: line.trim(),
        issuer: "",
        year: line.match(/\b(19|20)\d{2}\b/)?.[0] || null
      });
    }
  }
  
  return certifications;
}

/* ================= SUMMARY EXTRACTION ================= */

function extractSummary(text = "") {
  if (!text) return "";
  
  const paragraphs = text.split("\n\n");
  if (paragraphs.length > 0) {
    return paragraphs[0].substring(0, 500);
  }
  
  return text.substring(0, 500);
}

/* ================= FEATURE ENGINEERING (ML-Ready) ================= */

function buildFeatureVector({ text, skills, experience, education, projects, certifications }) {
  const skillCounts = {};
  let totalSkills = 0;
  
  for (const category of skills) {
    skillCounts[category.category] = category.count;
    totalSkills += category.count;
  }
  
  let totalExperienceMonths = 0;
  for (const exp of experience) {
    if (exp.duration && exp.duration.months) {
      totalExperienceMonths += exp.duration.months;
    }
  }
  
  const highComplexProjects = projects.filter(p => p.complexity === "high").length;
  
  let highestEducationLevel = 0;
  for (const edu of education) {
    if (edu.level && edu.level > highestEducationLevel) {
      highestEducationLevel = edu.level;
    }
  }
  
  const wordCount = text.split(/\s+/).length;
  
  return {
    totalSkills,
    skillCounts,
    skillDiversity: totalSkills > 0 ? Object.keys(skillCounts).length / 7 : 0,
    experienceCount: experience.length,
    totalExperienceMonths,
    averageExperienceMonths: experience.length > 0 ? totalExperienceMonths / experience.length : 0,
    educationCount: education.length,
    highestEducationLevel,
    hasAdvancedDegree: highestEducationLevel >= 4,
    projectCount: projects.length,
    highComplexProjects,
    projectTechDiversity: projects.reduce((sum, p) => sum + p.techStack.length, 0),
    certificationCount: certifications.length,
    wordCount,
    sectionCount: 6,
    textComplexity: wordCount > 1000 ? "high" : wordCount > 500 ? "medium" : "low",
    normalized: {
      skillsNorm: Math.min(1, totalSkills / 50),
      experienceNorm: Math.min(1, totalExperienceMonths / 120),
      educationNorm: highestEducationLevel / 5,
      projectsNorm: Math.min(1, highComplexProjects / 5)
    }
  };
}

/* ================= EMPTY STRUCTURE ================= */

function getEmptyStructure() {
  return {
    rawText: "",
    basics: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: ""
    },
    summary: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    features: {
      totalSkills: 0,
      skillCounts: {},
      skillDiversity: 0,
      experienceCount: 0,
      totalExperienceMonths: 0,
      averageExperienceMonths: 0,
      educationCount: 0,
      highestEducationLevel: 0,
      hasAdvancedDegree: false,
      projectCount: 0,
      highComplexProjects: 0,
      projectTechDiversity: 0,
      certificationCount: 0,
      wordCount: 0,
      sectionCount: 0,
      textComplexity: "low",
      normalized: {
        skillsNorm: 0,
        experienceNorm: 0,
        educationNorm: 0,
        projectsNorm: 0
      }
    },
    meta: {
      parser: "hirefold-ner-v2",
      version: "2.0.0",
      sectionDetected: [],
      extractionDate: Date.now()
    }
  };
}
