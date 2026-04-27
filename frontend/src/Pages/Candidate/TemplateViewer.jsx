import React from "react";
import { useParams } from "react-router-dom";
import { useResume } from "../../Context/ResumeContext";
import PreviewRenderer from "../../Components/ResumePreview/PreviewRenderer";
import ResumePaper from "../../Components/ResumePreview/ResumePaper";
import prepareResumeForPreview from "../../utils/prepareResumeForPreview";

import "../../Styles/resumePage.css";

const TemplateViewer = () => {
  const { templateId } = useParams();
  const { resume } = useResume();

  const resumeData = prepareResumeForPreview({
    ...resume,
    meta: {
      ...(resume?.meta || {}),
      targetTemplate: templateId,
      accentColor: resume?.meta?.accentColor || "#111827",
    },
  });

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

