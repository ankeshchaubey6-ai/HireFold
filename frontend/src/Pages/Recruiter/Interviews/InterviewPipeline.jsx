// InterviewPipeline.jsx - Updated with modern design
import React from "react";
import InterviewCard from "./InterviewCard";
import "./interviews.page.css";

const InterviewPipeline = ({
  title,
  description,
  interviews = [],
  readOnly = false,
}) => {
  if (!interviews?.length) {
    return (
      <div className="interview-pipeline">
        <div className="pipeline-header">
          <div>
            <h3>{title}</h3>
            {description && (
              <p className="muted-text">{description}</p>
            )}
          </div>
          <div className="pipeline-stats">
            <span className="pipeline-count">0</span>
            <span className="pipeline-label">Interviews</span>
          </div>
        </div>
        
        <div className="empty-state">
          <div className="empty-state-icon"></div>
          <h4 className="empty-state-title">No interviews yet</h4>
          <p className="empty-state-description">
            {description || "Interviews will appear here once scheduled"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-pipeline">
      {/* Header with stats */}
      <div className="pipeline-header">
        <div className="pipeline-header-info">
          <div className="pipeline-title-wrapper">
            <h3>{title}</h3>
            {description && (
              <p className="muted-text">{description}</p>
            )}
          </div>
        </div>
        
        <div className="pipeline-stats">
          <span className="pipeline-count">{interviews.length}</span>
          <span className="pipeline-label">
            {interviews.length === 1 ? "Interview" : "Interviews"}
          </span>
        </div>
      </div>

      {/* Grid layout */}
      <div className="jobs-list">
        {interviews.map((interview) => (
          <InterviewCard
            key={interview.id}
            interview={interview}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
};

export default InterviewPipeline;
