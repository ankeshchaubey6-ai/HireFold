import React from "react";
import "../../Styles/jobs.css";

const JobPreviewCard = ({ job }) => {
  if (!job) return null;

  const companyName = job.companyName || job.company || "Your Company";
  const logoSrc = job.companyLogoUrl || job.companyLogoPreview || null;

  return (
    <div className="job-card" style={{ animation: "none", opacity: 1, cursor: "default" }}>

      {/* HEADER: logo */}
      <div className="job-card-header">
        <div className="job-card-logo">
          {logoSrc ? (
            <img src={logoSrc} alt={companyName} className="job-logo-img" />
          ) : (
            <span className="job-logo-fallback">{companyName.charAt(0)}</span>
          )}
        </div>
      </div>

      {/* ALL CONTENT inside job-card-content which has padding in your CSS */}
      <div className="job-card-content">

        <div className="job-company">{companyName}</div>

        <div className="job-title">
          <a>{job.title || "Job Title Preview"}</a>
        </div>

        {/* Meta Tags */}
        <div className="job-meta-tags">
          {job.location && <span className="job-tag">{job.location}</span>}
          {job.workMode && <span className="job-tag">{job.workMode}</span>}
          {job.employmentType && <span className="job-tag">{job.employmentType}</span>}
          {job.experienceLevel && <span className="job-tag">{job.experienceLevel}</span>}
          {job.department && <span className="job-tag">{job.department}</span>}
        </div>

        {/* Description */}
        {job.description && (
          <p className="job-description">{job.description}</p>
        )}

        {/* Required Skills */}
        {job.requiredSkills?.length > 0 && (
          <div className="job-skills">
            {job.requiredSkills.slice(0, 5).map((skill, i) => (
              <span key={i} className="job-skill-tag">{skill}</span>
            ))}
            {job.requiredSkills.length > 5 && (
              <span className="job-skill-tag-more">+{job.requiredSkills.length - 5} more</span>
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
    </div>
  );
};

export default JobPreviewCard;
