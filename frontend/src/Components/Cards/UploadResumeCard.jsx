import React from "react";
import "../../Styles/resumeActionCard.css";

const UploadResumeCard = ({ onUpload }) => {
  return (
    <div className="action-card action-card--upload">
      <h3>Upload Resume</h3>

      <p>
        Upload your existing resume and get instant
        improvement suggestions.
      </p>

      {/*  SAME WRAPPER AS CREATE CARD */}
      <div className="action-buttons">
        <button
          className="btn btn-secondary hf-premium"
          onClick={onUpload}
        >
          Upload Resume
        </button>
      </div>
    </div>
  );
};

export default UploadResumeCard;

