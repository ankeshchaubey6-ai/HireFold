import React, { useState } from "react";
import "../../Styles/jobs.css";

const JobPreviewCard = ({ 
  job, 
  onApply,
  expandedJobId,
  setExpandedJobId,
  mode = "preview",
  onMouseMove,
  cardRef
}) => {
  if (!job) return null;

  const id = job._id || job.id;
  const isExpanded = mode === "preview" ? false : (expandedJobId === id);
  const companyName = job.companyName || job.company || "Your Company";
  
  // Handle logo URL resolution (with backend origin handling)
  let logoSrc = null;
  if (job.companyLogo) {
    if (job.companyLogo.startsWith("http")) {
      logoSrc = job.companyLogo;
    } else if (job.companyLogo.startsWith("http")) {
      logoSrc = job.companyLogo;
    } else {
      // Assume it's a relative path
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");
      logoSrc = `${BACKEND_ORIGIN}${job.companyLogo}`;
    }
  }
  if (!logoSrc && (job.companyLogoUrl || job.companyLogoPreview)) {
    logoSrc = job.companyLogoUrl || job.companyLogoPreview;
  }

  const handleToggleExpand = () => {
    if (mode !== "preview" && setExpandedJobId) {
      setExpandedJobId(isExpanded ? null : id);
    }
  };

  const handleMouseMoveWrapper = (e) => {
    if (onMouseMove && mode !== "preview") {
      onMouseMove(e, id);
    }
  };

  // Helper to get time ago
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

  return (
    <div 
      className={`job-card ${isExpanded ? "expanded" : ""}`}
      ref={cardRef}
      onMouseMove={handleMouseMoveWrapper}
      style={mode === "preview" ? { animation: "none", opacity: 1, cursor: "default" } : {}}
    >
      {/* Featured Badge */}
      {job.featured && (
        <div className="job-card-featured-badge">Featured</div>
      )}

      {/* HEADER: logo and status */}
      <div className="job-card-header">
        <div className="job-card-logo">
          {logoSrc ? (
            <img src={logoSrc} alt={companyName} className="job-logo-img" />
          ) : (
            <span className="job-logo-fallback">{companyName.charAt(0).toUpperCase()}</span>
          )}
        </div>

        {/* Status Badge - only show in public/candidate mode */}
        {mode !== "preview" && (
          <div className="job-header-status">
            <span className={`status-badge ${job.status || "Published"}`}>
              {job.status === "Closed" ? "Closed" : "Open"}
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="job-card-content">
        {/* Company name with time ago */}
        <div className="job-company">
          {companyName}
          {mode !== "preview" && job.createdAt && (
            <span className="job-time-ago">{getTimeAgo(job.createdAt)}</span>
          )}
        </div>

        {/* Title */}
        <div className="job-title">
          <a>{job.title || "Job Title"}</a>
        </div>

        {/* Meta Tags */}
        <div className="job-meta-tags">
          {job.location && <span className="job-tag">{job.location}</span>}
          {job.workMode && <span className="job-tag">{job.workMode}</span>}
          {job.employmentType && <span className="job-tag">{job.employmentType}</span>}
          {job.experienceLevel && <span className="job-tag">{job.experienceLevel}</span>}
          {job.department && <span className="job-tag">{job.department}</span>}
        </div>

        {/* Description - truncated in non-expanded view */}
        {mode === "preview" ? (
          job.description && (
            <p className="job-description">{job.description}</p>
          )
        ) : (
          job.description && (
            <p className="job-description">
              {job.description?.length > 120
                ? `${job.description.substring(0, 120)}...`
                : job.description}
            </p>
          )
        )}

        {/* Required Skills */}
        {job.requiredSkills?.length > 0 && (
          <div className="job-skills">
            {job.requiredSkills.slice(0, mode === "preview" ? 5 : 4).map((skill, i) => (
              <span key={i} className="job-skill-tag">{skill}</span>
            ))}
            {job.requiredSkills.length > (mode === "preview" ? 5 : 4) && (
              <span className="job-skill-tag-more">
                +{job.requiredSkills.length - (mode === "preview" ? 5 : 4)}
              </span>
            )}
          </div>
        )}

        {/* Preferred Skills */}
        {job.preferredSkills?.length > 0 && (
          <div className="job-skills" style={{ marginTop: "0.5rem" }}>
            {job.preferredSkills.slice(0, 3).map((skill, i) => (
              <span key={i} className="job-skill-tag" style={{ opacity: 0.65 }}>{skill}</span>
            ))}
            {job.preferredSkills.length > 3 && (
              <span className="job-skill-tag-more">+{job.preferredSkills.length - 3} preferred</span>
            )}
          </div>
        )}

        {/* Compensation */}
        {job.compensation?.showPublicly &&
          (job.compensation?.min || job.compensation?.max) && (
          <div className="job-salary-section">
            <span className="job-salary">
              {job.compensation.currency || "USD"}{" "}
              {job.compensation.min}
              {job.compensation.max ? ` - ${job.compensation.max}` : ""}
            </span>
            <span className="job-salary-period">
              / {job.compensation.frequency || "Yearly"}
            </span>
            {job.compensation.hasEquity && (
              <span className="job-tag" style={{ marginLeft: "0.5rem" }}>+ Equity</span>
            )}
          </div>
        )}

        {job.compensation?.bonus && (
          <p style={{ fontSize: "0.8rem", marginTop: "0.4rem", opacity: 0.7 }}>
            Bonus: {job.compensation.bonus}
          </p>
        )}

        {/* Hiring Preferences */}
        {job.hiringPreferences && (
          <div style={{ marginTop: "1rem", fontSize: "0.85rem", lineHeight: 1.6, whiteSpace: "pre-line", opacity: 0.8 }}>
            <strong>Hiring Preferences:</strong>{"\n"}{job.hiringPreferences}
          </div>
        )}
      </div>

      {/* EXPANDED DETAILS - only in public/candidate mode */}
      {mode !== "preview" && isExpanded && (
        <div className="job-expanded">
          <div className="job-details-grid">
            <div className="job-detail-item">
              <span className="job-detail-label">Full Description</span>
              <span className="job-detail-value">{job.description}</span>
            </div>
            {job.requirements && (
              <div className="job-detail-item">
                <span className="job-detail-label">Requirements</span>
                <ul className="job-detail-value">
                  {job.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            {job.benefits && (
              <div className="job-detail-item">
                <span className="job-detail-label">Benefits</span>
                <ul className="job-detail-value">
                  {job.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER WITH ACTIONS - only in public/candidate mode */}
      {mode !== "preview" && (
        <div className="job-card-footer">
          <div className="job-actions">
            <button
              className="btn-outline"
              onClick={handleToggleExpand}
            >
              {isExpanded ? "Hide Details" : "View Details"}
            </button>
            {onApply && (
              <button
                className="btn-primary"
                onClick={() => onApply(job)}
              >
                {mode === "public" ? "Login to Apply" : "Apply Now"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPreviewCard;
