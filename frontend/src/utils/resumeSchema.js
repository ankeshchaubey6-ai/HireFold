

const resumeSchema = {
  
  meta: {
    resumeId: null,              //  SINGLE SOURCE OF TRUTH
    userId: null,
    source: "builder",           // builder | upload
    createdAt: null,
    updatedAt: null,

    targetTemplate: "Modern01",
    accentColor: "#0ea5e9",      //  PRIMARY COLOR (used by color picker)

    layoutHints: {
      includePhoto: true,
      showBorders: false,
      fontFamily: "Inter",
      fontSize: 11,
      pageMargins: "18mm",
    },
  },

  /* ======================================================
     BASIC PROFILE
  ====================================================== */
  basics: {
    fullName: "",
    preferredName: "",
    label: "",
    photo: null,

    email: "",
    phone: "",
    address: "",
    website: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },

  /* ======================================================
     SUMMARY
  ====================================================== */
  summary: "",

  /* ======================================================
     SKILLS
  ====================================================== */
  skills: [
    {
      category: "Skills",
      items: [],
    },
  ],

  /* ======================================================
     EXPERIENCE
  ====================================================== */
  experience: [
    {
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      achievements: [],
      techStack: [],
    },
  ],

  /* ======================================================
     EDUCATION
  ====================================================== */
  education: [
    {
      institute: "",
      degree: "",
      fieldOfStudy: "",
      grade: "",
    },
  ],

  /* ======================================================
     PROJECTS
  ====================================================== */
  projects: [
    {
      title: "",
      description: "",
      url: "",
      techStack: [],
    },
  ],

  /* ======================================================
     CERTIFICATIONS
  ====================================================== */
  certifications: [
    {
      title: "",
      issuer: "",
      issueDate: "",
      credentialUrl: "",
    },
  ],

  /* ======================================================
     COURSES
  ====================================================== */
  courses: [
    {
      title: "",
      provider: "",
    },
  ],

  /* ======================================================
     PUBLICATIONS
  ====================================================== */
  publications: [
    {
      title: "",
      publisher: "",
      url: "",
    },
  ],

  /* ======================================================
     LANGUAGES
  ====================================================== */
  languages: [
    {
      name: "",
      level: "",
    },
  ],

  /* ======================================================
     AWARDS
  ====================================================== */
  awards: [
    {
      title: "",
      issuer: "",
      description: "",
    },
  ],

  /* ======================================================
     REFERENCES
  ====================================================== */
  references: [
    {
      name: "",
      role: "",
      company: "",
      email: "",
    },
  ],

  /* ======================================================
     ATTACHMENTS
  ====================================================== */
  attachments: [],
};

export default resumeSchema;

