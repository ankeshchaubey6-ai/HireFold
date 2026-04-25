import React from "react";
import "../../Styles/resumeActionCard.css";

const CreateResumeCard = ({ onCreate, onContinue, hasDraft }) => {
  return (
    <div className="action-card action-card--create">
      <h3>Create Resume</h3>

      <p>
        Build a professional, ATS-friendly resume
        from scratch using HireFold templates.
      </p>

      <div className="action-buttons">
        <button className="btn-primary hf-premium" onClick={onCreate}>
          Create Now
        </button>

        {hasDraft && (
          <button className="btn-outline hf-premium" onClick={onContinue}>
            Continue Editing
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateResumeCard;
