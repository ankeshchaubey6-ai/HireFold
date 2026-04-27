import React from "react";
import "../../Styles/resumePaper.css";

const ResumePaper = ({
  children,
  mode = "full",
  accentColor = "#111827",
}) => {
  return (
    <div
      className={`resume-paper ${mode}`}
      id="resume-print-root"
      style={{
        /*  FORCE GLOBAL THEME PROPAGATION */
        "--accent-color": accentColor,
        "--resume-accent": accentColor,
        "--resume-accent-light": `${accentColor}20`,
        "--resume-accent-border": `${accentColor}55`,
      }}
    >
      <div className="resume-paper__content">{children}</div>
    </div>
  );
};

export default ResumePaper;

