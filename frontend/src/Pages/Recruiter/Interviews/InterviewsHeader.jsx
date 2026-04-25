// InterviewsHeader.jsx - Updated with modern design
import React from "react";
import "./interviews.page.css";

const InterviewsHeader = ({
  job,
  jobs,
  selectedJobId,
  onJobChange,
  hiringModel,
  onSchedule,
}) => {
  const isAssisted = hiringModel === "ASSISTED";

  return (
    <div className="interviews-header">
      <div className="interviews-header-left">
        <div className="jobs-hero">
          <div className="jobs-hero-badge">Interview Management</div>
          <h1 className="jobs-hero-title">
            Interview <span className="gradient-text">Pipeline</span>
          </h1>
          <p className="jobs-hero-subtitle">
            Manage and track all interviews for your hiring process
          </p>
        </div>

        <div className="job-switcher">
          <select
            value={selectedJobId}
            onChange={(e) => onJobChange(e.target.value)}
            disabled={!jobs.length}
            className="filter-group select"
          >
            {jobs.length === 0 && (
              <option>No jobs found</option>
            )}
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title || job.basics?.title || "Untitled Job"}
              </option>
            ))}
          </select>

          {job && (
            <span
              className={`hiring-model-pill ${
                isAssisted ? "assisted" : "self"
              }`}
            >
              {isAssisted ? " Assisted Hiring" : " Self Managed"}
            </span>
          )}
        </div>
      </div>

      <div className="interviews-header-right">
        <button
          className={`btn-primary ${isAssisted ? "assisted" : ""}`}
          disabled={!job}
          onClick={onSchedule}
        >
          {isAssisted ? " Schedule Final Interview" : " Schedule Interview"}
        </button>
      </div>
    </div>
  );
};

export default InterviewsHeader;
