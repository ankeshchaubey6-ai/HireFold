import React from "react";
import ResumeAnalysis from "@/Pages/Candidate/ResumeAnalysis";

import "@/Styles/applicantDrawer.css";

const AIResumeAnalysisDrawer = ({ resume, ats, onClose }) => {
  if (!resume) return null;

  return (
    <div
      className="applicant-drawer-overlay"
      onClick={onClose}
    >
      <div
        className="applicant-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="drawer-header">
          <h3>Resume Analysis</h3>
          <button className="drawer-close" onClick={onClose}>
            
          </button>
        </div>

        {/* CONTENT */}
        <div className="drawer-content">
          <ResumeAnalysis
            embedded
            resumeData={resume}
            atsOverride={ats}
          />
        </div>
      </div>
    </div>
  );
};

export default AIResumeAnalysisDrawer;

