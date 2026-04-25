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
    employmentType: "",
    department: "",
    experienceLevel: "",
    location: "",
    workMode: "Onsite",
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
  },

  visibility: {
    linkedin: true,
    indeed: false,
    glassdoor: false,
  },
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
        employmentType: jobData.basics?.employmentType || "",
        department: jobData.basics?.department || "",
        experienceLevel: jobData.basics?.experienceLevel || "",
        location: jobData.basics?.location || "",
        workMode: jobData.basics?.workMode || "Onsite",
      },

      description: jobData.description || "",
      skills: Array.isArray(jobData.skills) ? jobData.skills : [],
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
      },

      visibility: {
        linkedin: jobData.visibility?.linkedin ?? true,
        indeed: jobData.visibility?.indeed ?? false,
        glassdoor: jobData.visibility?.glassdoor ?? false,
      },
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

