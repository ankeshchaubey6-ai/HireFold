import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useResume } from "../../Context/ResumeContext";
import PreviewRenderer from "../../Components/ResumePreview/PreviewRenderer";
import ResumePaper from "../../Components/ResumePreview/ResumePaper";
import dummyResume from "../../utils/dummyResume";

import "../../Styles/resumePage.css";

const TemplateViewer = () => {
  const { templateId } = useParams();
  const location = useLocation();
  const { resume } = useResume();

  

  const isDummy = location.state?.source === "dummy";

  const baseData = isDummy ? dummyResume : resume;

  const resumeData = {
    ...baseData,
    meta: {
      
      ...(baseData?.meta || {}),
      targetTemplate: templateId,
      //  ENSURE COLOR ENGINE NEVER BREAKS
      accentColor:
        baseData?.meta?.accentColor ||
        "#111827",
    },
  };

  return (
    <div className="resume-view-page">
      <ResumePaper mode="full">
        <PreviewRenderer
          resumeOverride={resumeData}
          mode="full"
        />
      </ResumePaper>
    </div>
  );
};

export default TemplateViewer;

