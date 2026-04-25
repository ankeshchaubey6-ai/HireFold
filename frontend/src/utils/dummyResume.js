import resumeSchema from "./resumeSchema";
import dummyPhoto from "../Assets/dummyphoto.jpeg";

const dummyResume = {
  ...resumeSchema,

  /* ======================================================
   META (FIXED COLOR ENGINE)
====================================================== */
meta: {
  ...resumeSchema.meta,
  id: "dummy-001",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  targetTemplate: "Modern01",
  accentColor: "#111827", // industry neutral (NOT BLUE)

  layoutHints: {
    fontFamily: "Inter",
    fontSize: "medium",
  },
},


  /* ======================================================
     BASICS
  ====================================================== */
  basics: {
    fullName: "Ankesh Chaubey",
    preferredName: "Ankesh",
    label: "Frontend Engineer",
    photo: dummyPhoto,

    email: "ankesh.chaubey@example.com",
    phone: "+91 98765 43210",
    address: "Bengaluru, India",

    website: "https://ankesh.dev",
    linkedin: "linkedin.com/in/ankesh-chaubey",
    github: "github.com/ankesh-chaubey",
    twitter: "twitter.com/ankeshcodes",
    portfolio: "https://portfolio.ankesh.dev",
  },

  /* ======================================================
     SUMMARY
  ====================================================== */
  summary:
    "Frontend Engineer with 3+ years of experience building scalable, accessible, and ATS-optimized web applications. Strong expertise in React, UI architecture, and design systems. Proven ability to translate complex requirements into clean, production-ready interfaces used by thousands of users.",

  /* ======================================================
     SKILLS
  ====================================================== */
  skills: [
    {
      category: "Frontend",
      items: [
        { name: "React", level: 5, keywords: ["react", "hooks", "jsx"] },
        { name: "JavaScript (ES6+)", level: 5 },
        { name: "TypeScript", level: 4 },
        { name: "HTML5", level: 5 },
        { name: "CSS3 / Flexbox / Grid", level: 5 },
      ],
    },
    {
      category: "UI & Design Systems",
      items: [
        { name: "Tailwind CSS" },
        { name: "CSS Modules" },
        { name: "Figma" },
        { name: "Design Tokens" },
        { name: "Responsive Design" },
      ],
    },
    {
      category: "Tools",
      items: [
        { name: "Git & GitHub" },
        { name: "Vite" },
        { name: "Webpack" },
        { name: "Jira" },
        { name: "Postman" },
      ],
    },
  ],

  /* ======================================================
     EXPERIENCE
  ====================================================== */
  experience: [
    {
      id: "exp-1",
      company: "HireFold",
      role: "Frontend Engineer",
      location: "Remote",

      startDate: "Jan 2024",
      endDate: "",
      currentlyWorking: true,
      durationText: "Jan 2024  Present",

      industry: "HR Tech",
      employmentType: "Full-time",
      seniority: "Mid-level",

      responsibilities: [
        "Designed and implemented resume builder UI architecture",
        "Collaborated with backend engineers on schema-driven rendering",
      ],

      achievements: [
        "Built a fully dynamic resume builder supporting 20+ templates",
        "Implemented live preview system with real-time scaling",
        "Improved resume ATS score simulation accuracy by 30%",
      ],

      highlights: [
        "Component-driven architecture",
        "Production-grade CSS systems",
      ],

      techStack: ["React", "CSS Grid", "Context API", "Vite"],
    },
    {
      id: "exp-2",
      company: "TechNova Solutions",
      role: "Frontend Developer",
      location: "Delhi, India",

      startDate: "Aug 2022",
      endDate: "Dec 2023",
      currentlyWorking: false,

      employmentType: "Full-time",
      seniority: "Junior",

      achievements: [
        "Developed reusable UI components used across 5 products",
        "Optimized page load performance by 40%",
      ],

      techStack: ["React", "JavaScript", "REST APIs"],
    },
  ],

  /* ======================================================
     EDUCATION
  ====================================================== */
  education: [
    {
      id: "edu-1",
      institute: "ABC Institute of Technology",
      degree: "Bachelor of Technology",
      fieldOfStudy: "Computer Science & Engineering",

      startDate: "2019",
      endDate: "2023",
      grade: "8.2 CGPA",

      relevantCourses: [
        "Data Structures",
        "Web Technologies",
        "Operating Systems",
      ],
      honors: "Deans List (2022)",
    },
  ],

  /* ======================================================
     PROJECTS
  ====================================================== */
  projects: [
    {
      id: "proj-1",
      title: "HireFold Resume Builder",
      role: "Frontend Lead",

      startDate: "2024",
      endDate: "2024",

      description:
        "A schema-driven resume builder supporting ATS-friendly resumes, live previews, and multi-template rendering.",

      contributions: [
        "Designed preview scaling logic",
        "Created reusable resume templates",
      ],

      techStack: ["React", "CSS", "Context API"],

      url: "https://hirefold.com",
      repo: "https://github.com/ankesh-chaubey/hirefold",
    },
    {
      id: "proj-2",
      title: "Job Tracker Dashboard",
      role: "Frontend Developer",

      description:
        "A personal job application tracker with analytics and status visualization.",

      techStack: ["React", "Chart.js"],
    },
  ],

  /* ======================================================
     CERTIFICATIONS
  ====================================================== */
  certifications: [
    {
      title: "Frontend Development with React",
      issuer: "Coursera",
      issueDate: "2023",
      expirationDate: "",
      credentialId: "CR-123456",
      credentialUrl: "https://coursera.org/verify/CR-123456",
    },
  ],

  /* ======================================================
     PUBLICATIONS
  ====================================================== */
  publications: [
    {
      title: "Designing ATS-Friendly Resumes",
      publisher: "Medium",
      date: "2024",
      url: "https://medium.com/@ankesh",
      description: "Guide on modern resume systems and ATS parsing.",
    },
  ],

  /* ======================================================
     COURSES
  ====================================================== */
  courses: [
    {
      title: "Advanced React Patterns",
      provider: "Frontend Masters",
      date: "2023",
    },
  ],

  /* ======================================================
     LANGUAGES
  ====================================================== */
  languages: [
    { name: "English", level: "Professional" },
    { name: "Hindi", level: "Native" },
  ],

  /* ======================================================
     VOLUNTEER
  ====================================================== */
  volunteer: [
    {
      organization: "Open Source Community",
      role: "Contributor",
      startDate: "2022",
      endDate: "2023",
      description: "Contributed UI fixes and documentation.",
    },
  ],

  /* ======================================================
     AWARDS
  ====================================================== */
  awards: [
    {
      title: "Best UI Contributor",
      issuer: "TechNova",
      date: "2023",
      description: "Awarded for outstanding frontend contributions.",
    },
  ],

  /* ======================================================
     REFERENCES
  ====================================================== */
  references: [
    {
      name: "Rahul Sharma",
      role: "Engineering Manager",
      company: "HireFold",
      email: "rahul.sharma@hirefold.com",
      phone: "+91 90000 11111",
    },
  ],

  /* ======================================================
     HOBBIES
  ====================================================== */
  hobbies: ["UI Design", "Tech Blogging", "Photography"],

  /* ======================================================
     JOB TARGET
  ====================================================== */
  jobTarget: {
    targetTitle: "Frontend Engineer",
    targetLocations: ["Remote", "Bangalore"],
    experienceYears: "3+",
    employmentTypes: ["Full-time"],
    desiredSalary: "1218 LPA",
  },

  /* ======================================================
     ATTACHMENTS
  ====================================================== */
  attachments: [
    {
      name: "Portfolio.pdf",
      url: "/files/portfolio.pdf",
      type: "pdf",
    },
  ],

  /* ======================================================
     TEMPLATE CONFIG
  ====================================================== */
  templateConfig: {
    maxBulletsPerExperience: 6,
    maxExperiencesToShow: 6,
    showProjectSection: true,
    showCertifications: true,
    showSkillsAsTags: true,
    showSkillsAsColumns: false,
  },
};

export default dummyResume;

