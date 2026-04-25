import React from "react";
import sanitizeResume from "../../../../utils/resumeSanitizer";


const BaseTemplateWrapper = ({ resume, children }) => {
  const safeResume = sanitizeResume(resume);

  return children(safeResume);
};

export default BaseTemplateWrapper;
