import React from "react";
import { useNavigate } from "react-router-dom";
import { useResume } from "../../Context/ResumeContext";

import ATSScoreCard from "../Cards/ATSScoreCard";
import ResumeTipsCard from "../Cards/ResumeTipsCard";

import "../../Styles/resumeImprovementSection.css";

const hasRenderableATS = (payload = {}) => {
  const score = Number(
    payload?.totalScore ??
      payload?.score ??
      payload?.atsScore ??
      payload?.overallScore ??
      0
  );

  return (
    (Number.isFinite(score) && score > 0) ||
    Object.keys(payload?.sectionScores || payload?.breakdown || {}).length > 0
  );
};

const ResumeImprovementSection = () => {
  const { resume } = useResume();
  const navigate = useNavigate();

  /**
   * ATS lives in:
   * resume.meta.atsScore
   * resume.meta.ats (optional full object)
   */
  const ats =
    (hasRenderableATS(resume?.ats) ? resume.ats : null) ||
    (hasRenderableATS(resume?.meta?.ats) ? resume.meta.ats : null) ||
    (resume?.meta?.atsScore !== null && resume?.meta?.atsScore !== undefined
      ? {
          score: resume.meta.atsScore,
          totalScore: resume.meta.atsScore,
          breakdown: resume.meta.ats?.breakdown,
        }
      : null);

  return (
    <>
      <div className="resume-improvement-header">
        <h2 className="section-title">
          Improve Your Resume
        </h2>
        <p className="section-subtitle">
          Optimize your resume to perform better with recruiters and ATS.
        </p>
      </div>

      <div className="resume-improvement-grid">
        <ATSScoreCard ats={ats} />
        <ResumeTipsCard ats={ats} />
      </div>

      {/*  NEW BUTTON */}
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <button
          className="btn-outline"
          onClick={() =>
            navigate("/candidate/resume/analysis")
          }
          disabled={!ats}
        >
          View Detailed Resume Analysis 
        </button>
      </div>
    </>
  );
};

export default ResumeImprovementSection;

