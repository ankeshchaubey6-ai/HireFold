import React from "react";
import { useResume } from "../../Context/ResumeContext";
import PreviewRenderer from "./PreviewRenderer";

const ResumePreview = () => {
  const { resume } = useResume();

  if (!resume) return null;

  return <PreviewRenderer resume={resume} />;
};

export default ResumePreview;
