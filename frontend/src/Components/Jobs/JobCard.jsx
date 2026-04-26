import React, { useState } from "react";

import "../../Styles/jobs.css";
import "../../Styles/sectionSurface.css";

const JobCard = ({ 
  job, 
  mode = "candidate",
  isSaved = false,
  isApplied = false,
  onSave = null,
  onApply = null 
}) => {
  const [expanded, setExpanded] = useState(false);

  const isPublic = mode === "public";
  const companyName = job.companyName || job.company || "Company";
  
  // Handle logo URL resolution
  let logoSrc = null;
  if (job.companyLogo) {
    if (job.companyLogo.startsWith("http")) {
      logoSrc = job.companyLogo;
    } else {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");
      logoSrc = `${BACKEND_ORIGIN}${job.companyLogo}`;
    }
  }
  if (!logoSrc && (job.companyLogoUrl || job.companyLogoPreview)) {
    logoSrc = job.companyLogoUrl || job.companyLogoPreview;
  }

  const getSalaryDisplay = () => {
    if (job.salary) {
      return `$${job.salary.toLocaleString()}/year`;
    }
    if (job.salaryRange) {
      return `${job.salaryRange.min} - ${job.salaryRange.max}`;
    }
    if (job.compensation?.min || job.compensation?.max) {
      const min = job.compensation.min || "";
      const max = job.compensation.max ? ` - ${job.compensation.max}` : "";
      return `${job.compensation.currency || "USD"} ${min}${max}`;
    }
    return null;
  };

  const getSkillsList = () => {
    return job.requiredSkills || job.skills || [];
  };

  const salaryDisplay = getSalaryDisplay();

  return (
    <div className={`job-card ${expanded ? "expanded" : ""}`}>
      {/* ================= HEADER ================= */}
      <div className="job-card-header">
        <div className="job-card-logo">
          {logoSrc ? (
            <img src={logoSrc} alt={companyName} className="job-logo-img" />
          ) : (
            <span className="job-logo-fallback">{companyName.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div className="job-card-title-section">
          <div className="job-card-title">
            <h3>{job.title}</h3>
            <p className="company">{companyName}</p>
          </div>
        </div>

        <div className="job-card-header-actions">
          {!isPublic && (
            <button
              className={`btn-save ${isSaved ? "saved" : ""}`}
              onClick={() => onSave && onSave(job)}
              title={isSaved ? "Remove saved job" : "Save job"}
            >
              {isSaved ? "★" : "☆"}
            </button>
          )}

          <button
            className="btn-ghost"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Hide" : "Details"}
          </button>
        </div>
      </div>

      {/* ================= META ================= */}
      <div className="job-card-meta">
        {job.location && <span className="meta-item">{job.location}</span>}
        {job.experienceLevel && <span className="meta-item">{job.experienceLevel}</span>}
        {job.employmentType && <span className="meta-item">{job.employmentType}</span>}
        {job.workMode && <span className="meta-item">{job.workMode}</span>}
      </div>

      {/* ================= SALARY (VISIBLE IN COLLAPSED VIEW) ================= */}
      {salaryDisplay && (
        <div className="job-card-salary-banner">
          <span className="salary-label">Salary:</span>
          <span className="salary-value">{salaryDisplay}</span>
        </div>
      )}

      {/* ================= DESCRIPTION PREVIEW ================= */}
      {!expanded && job.description && (
        <div className="job-description-preview">
          {job.description?.length > 100
            ? `${job.description.substring(0, 100)}...`
            : job.description}
        </div>
      )}

      {/* ================= EXPANDED ================= */}
      {expanded && (
        <div className="job-card-expanded">
          {job.description && (
            <div className="job-description-section">
              <strong>Description</strong>
              <p>{job.description}</p>
            </div>
          )}

          {getSkillsList().length > 0 && (
            <div className="job-skills">
              <strong>Required Skills</strong>
              <div className="skill-tags">
                {getSkillsList().slice(0, 6).map((skill, i) => (
                  <span key={i} className="skill-tag">
                    {skill}
                  </span>
                ))}
                {getSkillsList().length > 6 && (
                  <span className="skill-tag-more">+{getSkillsList().length - 6} more</span>
                )}
              </div>
            </div>
          )}

          {job.benefits?.length > 0 && (
            <div className="job-benefits">
              <strong>Benefits</strong>
              <div className="benefits-list">
                {job.benefits.slice(0, 4).map((benefit, i) => (
                  <span key={i} className="benefit-tag">✓ {benefit}</span>
                ))}
              </div>
            </div>
          )}

          {/* ================= ACTIONS ================= */}
          <div className="job-card-actions">
            {isPublic ? (
              <>
                <button
                  className="btn-primary hf-premium"
                  onClick={() =>
                    (window.location.href = "/login/candidate")
                  }
                >
                  Login to Apply
                </button>

                <p className="login-hint">
                  Login required to view full job details
                </p>
              </>
            ) : (
              <>
                <button 
                  className={`btn-primary hf-premium ${isApplied ? "applied" : ""}`}
                  onClick={() => !isApplied && onApply && onApply(job)}
                  disabled={isApplied}
                  title={isApplied ? "You have already applied to this job" : "Apply for this job"}
                >
                  {isApplied ? "✓ Applied" : "Apply Now"}
                </button>
                <button 
                  className={`btn-outline hf-premium ${isSaved ? "saved" : ""}`}
                  onClick={() => onSave && onSave(job)}
                >
                  {isSaved ? "★ Saved" : "☆ Save Job"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
