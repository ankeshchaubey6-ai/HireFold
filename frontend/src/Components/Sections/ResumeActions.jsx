import React from "react";
import CreateResumeCard from "../Cards/CreateResumeCard";
import UploadResumeCard from "../Cards/UploadResumeCard";
import "../../Styles/resumeActions.css";

const ResumeActions = ({
  onCreate,
  onContinue,
  onUpload,
  hasDraft,
}) => {
  return (
    <>
      <h2 className="section-title">Start Your Resume</h2>

      <div className="resume-actions-grid">
        <CreateResumeCard
          onCreate={onCreate}
          onContinue={onContinue}
          hasDraft={hasDraft}
        />

        <UploadResumeCard onUpload={onUpload} />
      </div>
    </>
  );
};

export default ResumeActions;
