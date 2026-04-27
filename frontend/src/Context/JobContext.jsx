import { createContext, useContext, useState } from "react";

const JobContext = createContext();

/* ===========================
   INITIAL JOB STATE
=========================== */
const initialJobState = {
  id: null, 
  hiringModel: null, // SELF_MANAGED | ASSISTED

  basics: {
    title: "",
    companyName: "",
    employmentType: "",
    department: "",
    experienceLevel: "",
    location: "",
    workMode: "Onsite",
    companyLogoFile: null,
    companyLogoPreview: null,
  },

  description: "",
  skills: [],
  preferredSkills: [],
  hiringPreferences: "",

  compensation: {
    min: "",
    max: "",
    currency: "USD",
    frequency: "Yearly",
    showPublicly: true,
    bonus: "",
    hasEquity: false,
    equityRange: "",
    vestingPeriod: "",
  },

  visibility: {
    linkedin: true,
    indeed: false,
    glassdoor: false,
  },

  applicationLastDate: "",
};

const getExperienceLevelLabel = (value = "") => {
  const normalizedValue = String(value).toUpperCase();

  if (normalizedValue === "ENTRY") return "Entry";
  if (normalizedValue === "MID") return "Mid";
  if (normalizedValue === "SENIOR") return "Senior";
  return value || "";
};

export const JobProvider = ({ children }) => {
  const [job, setJob] = useState(initialJobState);

  /* ===========================
     SET HIRING MODEL
  =========================== */
  const setHiringModel = (model) => {
    setJob((prev) => ({
      ...prev,
      hiringModel: model,
    }));
  };

  /* ===========================
     UPDATE A SECTION (SAFE)
  =========================== */
  const updateSection = (section, data) => {
    setJob((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  /* ===========================
     LOAD JOB FOR EDIT
     (FROM JOBS FEED)
  =========================== */
  const loadJobForEdit = (jobData) => {
    setJob({
      id: jobData.id,

      hiringModel: jobData.hiringModel || null,

      basics: {
        title: jobData.basics?.title || jobData.title || "",
        companyName: jobData.basics?.companyName || jobData.companyName || "",
        employmentType: jobData.basics?.employmentType || jobData.employmentType || "",
        department: jobData.basics?.department || jobData.department || "",
        experienceLevel:
          getExperienceLevelLabel(jobData.basics?.experienceLevel || jobData.experienceLevel),
        location: jobData.basics?.location || jobData.location || "",
        workMode: jobData.basics?.workMode || jobData.workMode || "Onsite",
        companyLogoFile: null,
        companyLogoPreview:
          jobData.basics?.companyLogoPreview ||
          jobData.companyLogoPreview ||
          jobData.companyLogo ||
          null,
      },

      description: jobData.description || "",
      skills: Array.isArray(jobData.requiredSkills)
        ? jobData.requiredSkills
        : Array.isArray(jobData.skills)
        ? jobData.skills
        : [],
      preferredSkills: Array.isArray(jobData.preferredSkills)
        ? jobData.preferredSkills
        : [],
      hiringPreferences: jobData.hiringPreferences || "",

      compensation: {
        min: jobData.compensation?.min || "",
        max: jobData.compensation?.max || "",
        currency: jobData.compensation?.currency || "USD",
        frequency: jobData.compensation?.frequency || "Yearly",
        showPublicly:
          jobData.compensation?.showPublicly ?? true,
        bonus: jobData.compensation?.bonus || "",
        hasEquity: jobData.compensation?.hasEquity ?? false,
        equityRange: jobData.compensation?.equityRange || "",
        vestingPeriod: jobData.compensation?.vestingPeriod || "",
      },

      visibility: {
        linkedin: jobData.visibility?.linkedin ?? true,
        indeed: jobData.visibility?.indeed ?? false,
        glassdoor: jobData.visibility?.glassdoor ?? false,
      },

      applicationLastDate: jobData.applicationLastDate
        ? String(jobData.applicationLastDate).slice(0, 10)
        : "",
    });
  };

  /* ===========================
     RESET JOB (AFTER PUBLISH)
  =========================== */
  const resetJob = () => {
    setJob(initialJobState);
  };

  return (
    <JobContext.Provider
      value={{
        job,
        setJob,
        setHiringModel,
        updateSection,
        loadJobForEdit,
        resetJob,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJob = () => useContext(JobContext);

