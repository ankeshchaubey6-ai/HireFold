// Job form step wizard with live preview
import React, { useState } from "react";

import BasicJobInfoSection from "./sections/BasicJobInfoSection";
import JobDescriptionSection from "./sections/JobDescriptionSection";
import SkillsRequirementsSection from "./sections/SkillsRequirementsSection";
import CompensationSection from "./sections/CompensationSection";
import HiringPreferencesSection from "./sections/HiringPreferencesSection";
import PostJobActions from "./sections/PostJobActions";

import JobPreviewCard from "@/Components/Jobs/JobPreviewCard";
import { useJob } from "@/Context/JobContext";

import "@/Styles/postJob/jobForm.css";

const STEPS = [
  { id: "basic", component: BasicJobInfoSection },
  { id: "description", component: JobDescriptionSection },
  { id: "skills", component: SkillsRequirementsSection },
  { id: "compensation", component: CompensationSection },
  { id: "preferences", component: HiringPreferencesSection },
  { id: "preview", component: "PREVIEW" },
];

const JobForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { job } = useJob();

  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  const StepComponent = STEPS[currentStep].component;

  const handleNext = () => {
    if (!isLast) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const previewJob = {
  title:            job?.basics?.title || "",
  companyName:      job?.basics?.companyName || "",
  location:         job?.basics?.location || "",
  workMode:         job?.basics?.workMode || "",
  employmentType:   job?.basics?.employmentType || "",
  experienceLevel:  job?.basics?.experienceLevel || "",
  department:       job?.basics?.department || "",
  description:      job?.description || "",
  requiredSkills:   job?.skills || [],
  preferredSkills:  job?.preferredSkills || [],
  compensation:     job?.compensation || {},
  hiringPreferences: job?.hiringPreferences || "",
  companyLogo: job?.basics?.companyLogoPreview || null,
};

  return (
    <div className="job-form-wizard">
      {StepComponent !== "PREVIEW" && StepComponent && (
        <div className="job-form-step">
          <StepComponent />
        </div>
      )}

      {StepComponent === "PREVIEW" && (
        <div className="job-preview-live">
          <div className="section-surface">
            <div className="form-section-header">
              <h3>Preview (Candidate View)</h3>
              <p style={{ opacity: 0.7, fontSize: "13px", marginTop: 4 }}>
                This updates live based on the job form you filled
              </p>
            </div>
            <JobPreviewCard job={previewJob} mode="preview" />
          </div>
        </div>
      )}

      <div className="job-form-navigation">
        <div className="job-form-nav-left">
          {!isFirst && (
            <button type="button" className="btn-outline" onClick={handleBack}>
               Back
            </button>
          )}
        </div>

        <div className="job-form-nav-right">
          {!isLast ? (
            <button type="button" className="btn-primary" onClick={handleNext}>
              Next 
            </button>
          ) : (
            <PostJobActions />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobForm;
