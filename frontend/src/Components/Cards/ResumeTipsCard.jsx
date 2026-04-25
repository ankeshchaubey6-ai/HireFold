import React from "react";
import "../../Styles/resumeTipsCard.css";

const ResumeTipsCard = ({ ats }) => {
  if (!ats) {
    return (
      <div className="resume-improve-card">
        <h3>Resume Improvement Tips</h3>
        <p>
          Upload or analyze a resume to get personalized tips.
        </p>
      </div>
    );
  }

  const machine = ats.breakdown?.machineSignals || {};
  const human = ats.breakdown?.humanSignals || {};

  const tips = [];

  /* ===============================
     MACHINE SIGNALBASED TIPS
  =============================== */

  if ((machine.keywordMatch ?? 0) < 0.5) {
    tips.push(
      "Add more role-specific keywords from the job description."
    );
  }

  if ((machine.skillsCoverage ?? 0) < 0.5) {
    tips.push(
      "Expand your skills section with relevant technical skills."
    );
  }

  if ((machine.experienceRelevance ?? 0) < 0.5) {
    tips.push(
      "Align your experience more closely with the target role."
    );
  }

  /* ===============================
     HUMAN SIGNALBASED TIPS
  =============================== */

  if ((human.signalClarity ?? 1) < 0.8) {
    tips.push(
      "Improve clarity by simplifying sentences and bullet points."
    );
  }

  if ((human.authenticitySignal ?? 1) < 0.8) {
    tips.push(
      "Reduce buzzwords and focus on real, measurable achievements."
    );
  }

  /* ===============================
     FALLBACK (SHOULD RARELY HIT)
  =============================== */

  if (tips.length === 0) {
    tips.push(
      "Your resume is solid. Consider fine-tuning keywords for specific roles."
    );
  }

  return (
    <div className="resume-improve-card">
      <h3>Resume Improvement Tips</h3>

      <ul className="resume-tips-list">
        {tips.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>
    </div>
  );
};

export default ResumeTipsCard;

