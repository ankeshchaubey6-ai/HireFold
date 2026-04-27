import React from "react";
import "../../Styles/jobs.css";

const JobPreviewCard = ({
  job,
  onApply,
  expandedJobId,
  setExpandedJobId,
  mode = "preview",
  onMouseMove,
  cardRef,
}) => {
  if (!job) return null;

  const id = job._id || job.id;
  const isPreview = mode === "preview";
  const isExpanded = !isPreview && expandedJobId === id;
  const companyName = job.companyName || job.company || "";

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

  const handleToggleExpand = () => {
    if (!isPreview && setExpandedJobId) {
      setExpandedJobId(isExpanded ? null : id);
    }
  };

  const handleMouseMoveWrapper = (e) => {
    if (onMouseMove && !isPreview) onMouseMove(e, id);
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
  const status = (job.status || "OPEN").toUpperCase();
  const statusClass = status === "CLOSED" ? "closed" : job.featured ? "featured" : "open";
  const statusText = status === "CLOSED" ? "Closed" : job.featured ? "Featured" : "Open";
  const showCompensation =
    job.compensation?.showPublicly && (job.compensation?.min || job.compensation?.max);
  const metaPills = [
    job.location,
    job.workMode,
    job.employmentType,
    job.experienceLevel,
    job.department,
  ].filter(Boolean);
  const detailItems = [
    { label: "Requirements", value: job.requirements?.join(", ") || "" },
    { label: "Hiring Preferences", value: job.hiringPreferences || "" },
    {
      label: "Apply By",
      value: job.applicationLastDate
        ? new Date(job.applicationLastDate).toLocaleDateString()
        : "",
    },
  ].filter((item) => item.value);

  return (
    <div
      className="job-card"
      ref={cardRef}
      onMouseMove={handleMouseMoveWrapper}
      style={isPreview ? { animation: "none", opacity: 1, cursor: "default" } : {}}
    >
      <div className="job-card-accent" />

      <div className="job-card-body">
        {!isPreview && (
          <span className={`job-card-status ${statusClass}`}>{statusText}</span>
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
            <h3 className="job-title">
              <a>{job.title}</a>
            </h3>
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
            {isPreview || job.description.length <= 120
              ? job.description
              : `${job.description.substring(0, 120)}...`}
          </div>
        )}

        {skills.length > 0 && (
          <div className="job-skills-row">
            {skills.slice(0, isPreview ? 5 : 4).map((skill, i) => (
              <span key={i} className="skill-tag">{skill}</span>
            ))}
            {skills.length > (isPreview ? 5 : 4) && (
              <span className="skill-tag-more">
                +{skills.length - (isPreview ? 5 : 4)} more
              </span>
            )}
          </div>
        )}

        {showCompensation && (
          <div className="job-salary-banner">
            <span className="salary-banner-label">Salary</span>
            <span className="salary-banner-amount">
              {job.compensation.currency || "USD"} {job.compensation.min}
              {job.compensation.max ? ` - ${job.compensation.max}` : ""}
            </span>
            <span className="salary-banner-period">
              / {job.compensation.frequency || "Yearly"}
            </span>
          </div>
        )}

        {!isPreview && (
          <>
            <div className="job-card-divider" />
            <div className="job-card-footer">
              <div className="job-card-footer-left">
                <span className="job-time-ago">Posted {getTimeAgo(job.createdAt)}</span>
              </div>
              <div className="job-card-actions">
                <button type="button" className="btn-outline" onClick={handleToggleExpand}>
                  {isExpanded ? "Hide Details" : "View Details"}
                </button>
                {onApply && (
                  <button type="button" className="btn-primary" onClick={() => onApply(job)}>
                    {mode === "public" ? "Login to Apply" : "Apply Now"}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {!isPreview && (
        <div className={`job-card-expanded ${isExpanded ? "open" : ""}`}>
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
                  {job.benefits.map((benefit, i) => (
                    <span key={i} className="benefit-tag">{benefit}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPreviewCard;
