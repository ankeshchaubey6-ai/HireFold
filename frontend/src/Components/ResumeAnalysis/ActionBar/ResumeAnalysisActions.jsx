import React from "react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   ResumeAnalysisActions
   - Centered action bar
   - Visual style aligned with analysis cards
========================================================= */

const ResumeAnalysisActions = ({ resume, analysis }) => {
  const navigate = useNavigate();

  const handleImprove = () => {
    navigate("/candidate/resume", {
      state: {
        mode: "edit",
        resumeId: resume?.meta?.resumeId,
      },
    });
  };

  const handleDownload = () => {
    navigate("/candidate/resume/download", {
      state: {
        resumeId: resume?.meta?.resumeId,
      },
    });
  };

  return (
    <div className="analysis-actions-wrapper">
      <div className="analysis-actions-card">
        <button
          className="analysis-action-btn primary hf-premium"
          onClick={handleImprove}
        >
          Improve Resume
        </button>

        <button
          className="analysis-action-btn secondary"
          onClick={handleDownload}
        >
          Download Resume
        </button>

        <button
          className="analysis-action-btn ghost"
          disabled
          title="Re-analysis will be enabled automatically on resume updates"
        >
          Re-run Analysis
        </button>
      </div>
    </div>
  );
};

export default ResumeAnalysisActions;
