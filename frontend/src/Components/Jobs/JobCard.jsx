import React, { useState } from "react";

import "../../Styles/jobs.css";
import "../../Styles/sectionSurface.css";

const JobCard = ({
  job,
  mode = "candidate",
  isSaved = false,
  isApplied = false,
  onSave = null,
  onApply = null,
  style = {},
}) => {
  const [expanded, setExpanded] = useState(false);

  const isPublic = mode === "public";
  const companyName = job.companyName || job.company || "";
  const status = (job.status || "OPEN").toUpperCase();

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
    // Check if salary should be shown publicly
    if (job.compensation?.showPublicly === false) {
      return null;
    }
    
    if (job.salary) return `$${job.salary.toLocaleString()}/year`;
    if (job.salaryRange) return `${job.salaryRange.min} - ${job.salaryRange.max}`;
    if (job.compensation?.min || job.compensation?.max) {
      const min = job.compensation.min || "";
      const max = job.compensation.max ? ` - ${job.compensation.max}` : "";
      return `${job.compensation.currency || "USD"} ${min}${max}`;
    }
    return null;
  };

  const getTimeAgo = (date) => {
    if (!date) return "Recently";
    const now = new Date();
    const posted = new Date(date);
    const diffDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const skills = job.requiredSkills || job.skills || [];
  const salaryDisplay = getSalaryDisplay();
  const isClosed = status === "CLOSED";
  const statusClass = isClosed ? "closed" : job.featured ? "featured" : "open";
  const statusText = isClosed ? "Closed" : job.featured ? "Featured" : "Open";
  const metaPills = [
    job.location,
    job.experienceLevel,
    job.employmentType,
    job.workMode,
    job.department,
  ].filter(Boolean);
  const detailItems = [
    { label: "Company", value: companyName },
    { label: "Location", value: job.location },
    { label: "Type", value: job.employmentType },
    { label: "Experience", value: job.experienceLevel },
    { label: "Work Mode", value: job.workMode },
    { label: "Department", value: job.department },
    {
      label: "Apply By",
      value: job.applicationLastDate
        ? new Date(job.applicationLastDate).toLocaleDateString()
        : "",
    },
  ].filter((item) => item.value);

  return (
    <div className="job-card" style={style}>
      <div className="job-card-accent" />

      <div className="job-card-body">
        <span className={`job-card-status ${statusClass}`}>{statusText}</span>

        {!isPublic && (
          <button
            type="button"
            className={`job-card-save ${isSaved ? "saved" : ""}`}
            onClick={() => onSave && onSave(job)}
            title={isSaved ? "Remove saved job" : "Save job"}
            aria-label={isSaved ? "Remove saved job" : "Save job"}
          >
            {isSaved ? "*" : "+"}
          </button>
        )}

        <div className="job-card-header">
          <div className="job-card-logo">
            {logoSrc ? (
              <img src={logoSrc} alt={companyName} className="job-logo-img" />
            ) : (
              <span className="job-logo-fallback">
                {(companyName || job.title || "?").charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="job-card-title-block">
            {companyName && <div className="job-company-name">{companyName}</div>}
            <h3 className="job-title">{job.title}</h3>
          </div>
        </div>

        {metaPills.length > 0 && (
          <div className="job-meta-pills">
            {metaPills.map((pill) => (
              <span key={pill} className="meta-pill">{pill}</span>
            ))}
          </div>
        )}

        {job.description && (
          <div className="job-description-preview">
            {job.description.length > 120
              ? `${job.description.substring(0, 120)}...`
              : job.description}
          </div>
        )}

        {skills.length > 0 && (
          <div className="job-skills-row">
            {skills.slice(0, 5).map((skill, i) => (
              <span key={i} className="skill-tag">
                {skill}
              </span>
            ))}
            {skills.length > 5 && (
              <span className="skill-tag-more">+{skills.length - 5} more</span>
            )}
          </div>
        )}

        {salaryDisplay && (
          <div className="job-salary-banner">
            <span className="salary-banner-label">Salary</span>
            <span className="salary-banner-amount">{salaryDisplay}</span>
            {job.compensation?.frequency && (
              <span className="salary-banner-period">/ {job.compensation.frequency}</span>
            )}
          </div>
        )}

        <div className="job-card-divider" />

        <div className="job-card-footer">
          <div className="job-card-footer-left">
            <span className="job-time-ago">Posted {getTimeAgo(job.createdAt)}</span>
          </div>
          <div className="job-card-actions">
            <button
              type="button"
              className="btn-outline"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Hide Details" : "View Details"}
            </button>

            {isPublic ? (
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  window.location.href = "/login/candidate";
                }}
              >
                Login to Apply
              </button>
            ) : (
              <button
                type="button"
                className={`btn-primary ${isApplied ? "applied" : ""}`}
                onClick={() => !isApplied && onApply && onApply(job)}
                disabled={isApplied || isClosed}
                title={isApplied ? "You have already applied to this job" : "Apply for this job"}
              >
                {isApplied ? "Applied" : isClosed ? "Closed" : "Apply Now"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`job-card-expanded ${expanded ? "open" : ""}`}>
        <div className="job-card-expanded-inner">
          <div>
            <div className="expanded-section-label">Description</div>
            <div className="expanded-section-text">
              {job.description}
            </div>
          </div>

          {detailItems.length > 0 && (
            <div className="job-details-grid">
              {detailItems.map((item) => (
                <div key={item.label} className="job-detail-item">
                  <span className="job-detail-label">{item.label}</span>
                  <span className="job-detail-value">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {job.benefits?.length > 0 && (
            <div>
              <div className="expanded-section-label">Benefits</div>
              <div className="benefits-list">
                {job.benefits.slice(0, 4).map((benefit, i) => (
                  <span key={i} className="benefit-tag">{benefit}</span>
                ))}
              </div>
            </div>
          )}

          {job.hiringPreferences && (
            <div>
              <div className="expanded-section-label">Hiring Preferences</div>
              <div className="expanded-section-text">{job.hiringPreferences}</div>
            </div>
          )}

          {isPublic && (
            <div className="job-expanded-actions">
              <span className="login-hint">Login required to apply for this job.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
