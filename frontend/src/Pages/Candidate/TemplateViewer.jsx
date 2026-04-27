import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { useResume } from "../../Context/ResumeContext";
import PreviewRenderer from "../../Components/ResumePreview/PreviewRenderer";
import ResumePaper from "../../Components/ResumePreview/ResumePaper";
import prepareResumeForPreview from "../../utils/prepareResumeForPreview";
import dummyResume from "../../utils/dummyResume";

import "../../Styles/resumePage.css";

const TemplateViewer = () => {
  const { templateId } = useParams();
  const location = useLocation();
  const { resume } = useResume();
  const isDummyPreview = location.state?.source === "dummy";
  const baseResume = isDummyPreview ? dummyResume : resume;

  const resumeData = prepareResumeForPreview({
    ...baseResume,
    meta: {
      ...(baseResume?.meta || {}),
      targetTemplate: templateId,
      accentColor: baseResume?.meta?.accentColor || "#111827",
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

