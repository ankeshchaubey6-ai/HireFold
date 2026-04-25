import React, { useState } from "react";

import "../../Styles/jobs.css";
import "../../Styles/sectionSurface.css";

const JobCard = ({ job, mode = "candidate" }) => {
  const [expanded, setExpanded] = useState(false);

  const isPublic = mode === "public";

  return (
    <div className={`job-card ${expanded ? "expanded" : ""}`}>
      {/* ================= HEADER ================= */}
      <div className="job-card-header">
        <div className="job-card-logo">
          {job.company?.charAt(0) || "H"}
        </div>

        <div className="job-card-title">
          <h3>{job.title}</h3>
          <p className="company">{job.company}</p>
        </div>

        <button
          className="btn-ghost"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Collapse" : "View Details"}
        </button>
      </div>

      {/* ================= META ================= */}
      <div className="job-card-meta">
        <span>{job.location}</span>
        <span>{job.experienceLevel}</span>
        <span>{job.employmentType}</span>
        <span>{job.workMode}</span>
      </div>

      {/* ================= EXPANDED ================= */}
      {expanded && (
        <div className="job-card-expanded">
          <p className="job-description">{job.description}</p>

          {job.salary && (
            <div className="job-salary">
              <strong>Salary:</strong> {job.salary}
            </div>
          )}

          {job.skills?.length > 0 && (
            <div className="job-skills">
              <strong>Skills:</strong>
              <div className="skill-tags">
                {job.skills.map((skill, i) => (
                  <span key={i} className="skill-tag">
                    {skill}
                  </span>
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
                <button className="btn-primary hf-premium">Apply Now</button>
                <button className="btn-outline hf-premium">Save Job</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
