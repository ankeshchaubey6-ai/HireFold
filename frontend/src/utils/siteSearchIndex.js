/**
 * SITE SEARCH INDEX
 * Comprehensive frontend-only search index for all site content.
 * Includes routes, pages, features, roles, skills, and domain keywords.
 */

export const SITE_SEARCH_INDEX = [
  // Core Pages & Routes
  { label: "Home", route: "/", keywords: ["home", "dashboard", "main"] },
  { label: "Jobs", route: "/jobs", keywords: ["jobs", "job", "job listings", "openings", "positions", "hiring"] },
  { label: "Interviews", route: "/interviews", keywords: ["interviews", "interview", "mock interviews", "practice", "preparation"] },
  { label: "Resume", route: "/resume", keywords: ["resume", "resumes", "resume builder", "cv", "profile", "document"] },
  { label: "About", route: "/about", keywords: ["about", "about us", "company", "information"] },

  // Recruiter Section
  { label: "Recruiter Dashboard", route: "/recruiter", keywords: ["recruiter", "recruiter dashboard", "hiring", "manage jobs", "talent"] },
  { label: "Post Job", route: "/recruiter/post-job", keywords: ["post job", "create job", "post opening", "job posting", "publish job"] },
  { label: "Applicants", route: "/recruiter/applicants", keywords: ["applicants", "candidates", "applications", "job applications", "submissions"] },
  { label: "Interviews", route: "/recruiter/interviews", keywords: ["interviews", "interview", "schedule interview", "interview rounds", "assessment"] },
  { label: "Notifications", route: "/recruiter/notifications", keywords: ["notifications", "alerts", "messages", "updates", "announcements"] },
  { label: "Reports", route: "/recruiter/reports", keywords: ["reports", "analytics", "insights", "statistics", "data", "metrics"] },
  { label: "Services", route: "/recruiter/services", keywords: ["services", "plans", "pricing", "features", "subscription"] },

  // Candidate Section
  { label: "Candidate Dashboard", route: "/candidate", keywords: ["candidate", "candidate dashboard", "my profile", "job seeker"] },
  { label: "Candidate Jobs", route: "/candidate/jobs", keywords: ["jobs", "job search", "job listings", "apply jobs", "find jobs"] },
  { label: "Resume Builder", route: "/candidate/resume", keywords: ["resume", "resume builder", "build resume", "create resume", "cv", "profile"] },
  { label: "Candidate Interviews", route: "/candidate/interviews", keywords: ["interviews", "interview", "scheduled interviews", "interview prep", "practice"] },
  { label: "Candidate Notifications", route: "/candidate/notifications", keywords: ["notifications", "alerts", "messages", "updates"] },

  // Job Titles & Roles
  { label: "Frontend Developer", route: "/jobs", keywords: ["frontend", "frontend developer", "react", "vue", "angular", "javascript", "ui"] },
  { label: "Backend Developer", route: "/jobs", keywords: ["backend", "backend developer", "node", "python", "java", "api", "server"] },
  { label: "Full Stack Developer", route: "/jobs", keywords: ["full stack", "full stack developer", "full-stack", "fullstack"] },
  { label: "Data Science", route: "/jobs", keywords: ["data science", "data scientist", "machine learning", "ml", "ai", "analytics"] },
  { label: "UI/UX Designer", route: "/jobs", keywords: ["ui", "ux", "designer", "ui ux", "ui designer", "design", "figma"] },
  { label: "Product Manager", route: "/jobs", keywords: ["product manager", "product", "pm", "product management"] },
  { label: "DevOps Engineer", route: "/jobs", keywords: ["devops", "devops engineer", "deployment", "docker", "kubernetes"] },

  // Skills & Technologies
  { label: "JavaScript", route: "/jobs", keywords: ["javascript", "js", "typescript", "ts"] },
  { label: "Python", route: "/jobs", keywords: ["python", "django", "flask", "fastapi"] },
  { label: "React", route: "/jobs", keywords: ["react", "reactjs", "react.js"] },
  { label: "Node.js", route: "/jobs", keywords: ["node", "nodejs", "node.js", "express"] },
  { label: "SQL", route: "/jobs", keywords: ["sql", "mysql", "postgresql", "database", "nosql", "mongodb"] },
  { label: "AWS", route: "/jobs", keywords: ["aws", "amazon", "cloud", "ec2", "s3"] },
  { label: "Docker", route: "/jobs", keywords: ["docker", "container", "containerization"] },

  // Features & Functionality
  { label: "Job Posting", route: "/recruiter/post-job", keywords: ["posting", "post", "create", "new"] },
  { label: "Application Tracking", route: "/recruiter/applicants", keywords: ["tracking", "ats", "application tracking system", "track", "manage"] },
  { label: "Interview Scheduling", route: "/recruiter/interviews", keywords: ["scheduling", "schedule", "calendar", "time slot"] },
  { label: "Resume Parsing", route: "/candidate/resume", keywords: ["parsing", "parse", "import", "upload"] },
  { label: "Job Search", route: "/jobs", keywords: ["search", "find", "discover", "browse", "explore"] },
  { label: "Mock Interview", route: "/interviews", keywords: ["mock", "practice", "rehearsal", "simulation"] },

  // General Features
  { label: "Search", route: "/jobs", keywords: ["search", "filter", "find", "look for"] },
  { label: "Filter", route: "/jobs", keywords: ["filter", "filters", "refine", "narrow down"] },
  { label: "Settings", route: "/", keywords: ["settings", "preferences", "configuration", "options"] },
  { label: "Profile", route: "/candidate", keywords: ["profile", "my profile", "user profile", "account"] },
  { label: "Login", route: "/login", keywords: ["login", "sign in", "signin", "log in", "authenticate"] },
  { label: "Register", route: "/register", keywords: ["register", "sign up", "signup", "create account", "join"] },
  { label: "Logout", route: "/", keywords: ["logout", "log out", "sign out", "signout"] },

  // Platform Keywords
  { label: "HireFold", route: "/", keywords: ["hirefold", "hire fold", "platform", "app", "service"] },
  { label: "Hiring", route: "/recruiter", keywords: ["hiring", "recruit", "recruiting", "hire", "employment"] },
  { label: "Job Market", route: "/jobs", keywords: ["market", "opportunities", "openings"] },
  { label: "Career", route: "/candidate", keywords: ["career", "careers", "professional", "work"] },
];

/**
 * Get all unique keywords from the search index
 */
export const getAllSearchKeywords = () => {
  const keywords = new Set();
  SITE_SEARCH_INDEX.forEach((item) => {
    item.keywords.forEach((keyword) => keywords.add(keyword));
  });
  return Array.from(keywords);
};

/**
 * Search the index by query
 * Returns deduplicated results ranked by relevance
 */
export const searchSiteIndex = (query) => {
  if (!query || query.trim() === "") return [];

  const lowerQuery = query.toLowerCase().trim();
  const results = new Map(); // Use map to deduplicate by route

  SITE_SEARCH_INDEX.forEach((item) => {
    let score = 0;

    // Check each keyword
    item.keywords.forEach((keyword) => {
      const lowerKeyword = keyword.toLowerCase();

      // Exact match at start: highest priority
      if (lowerKeyword.startsWith(lowerQuery)) {
        score = Math.max(score, 100);
      }
      // Substring match: medium priority
      else if (lowerKeyword.includes(lowerQuery)) {
        score = Math.max(score, 50);
      }
    });

    // If this item matched, add to results (or update if lower score exists)
    if (score > 0) {
      const existing = results.get(item.route);
      if (!existing || existing.score < score) {
        results.set(item.route, {
          label: item.label,
          route: item.route,
          score,
        });
      }
    }
  });

  // Convert map to array and sort by score (descending)
  return Array.from(results.values()).sort((a, b) => b.score - a.score);
};
