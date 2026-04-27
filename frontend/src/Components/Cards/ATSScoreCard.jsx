import React from "react";
import "../../Styles/atsScoreCard.css";

const ATSScoreCard = ({ ats }) => {
  if (!ats) {
    return (
      <div className="resume-improve-card">
        <h3>ATS Compatibility Score</h3>
        <p>No ATS data available yet.</p>
        <p style={{ opacity: 0.7 }}>
          Upload or analyze a resume to see your score.
        </p>
      </div>
    );
  }

  const score = ats.score;

  let label = "Poor";
  if (score >= 80) label = "Excellent";
  else if (score >= 60) label = "Good";
  else if (score >= 40) label = "Average";

  return (
    <div className="resume-improve-card">
      <h3>ATS Compatibility Score</h3>

      <div className="ats-score">
        <span className="score">{score}%</span>
        <span className="label">{label}</span>
      </div>

      <p>
        ATS evaluation based on resume structure,
        keywords, and relevance.
      </p>
    </div>
  );
};

export default ATSScoreCard;
