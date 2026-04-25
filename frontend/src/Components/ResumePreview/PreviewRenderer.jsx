import React from "react";
import { useResume } from "../../Context/ResumeContext";
import { TEMPLATE_LIST } from "../../Pages/Candidate/ResumeBuilder/templates";

const TEMPLATE_DEFAULT_COLORS = {
  Modern01: "#0f172a",
  Modern02: "#1d4ed8",
  Modern03: "#0f766e",
  Modern04: "#7c3aed",
  ATS01: "#111827",
  ATS02: "#1f2937",
  ATS03: "#334155",
  Minimal01: "#1f2937",
  Minimal02: "#374151",
  Minimal03: "#475569",
  Creative01: "#be185d",
  Creative02: "#7c2d12",
  Executive01: "#0f172a",
  Executive02: "#1e293b",
  Simple01: "#0f172a",
  Simple02: "#1f2937",
  Simple03: "#334155",
  Simple04: "#475569",
};

const PreviewRenderer = ({ resumeOverride = null, mode = "preview" }) => {
  const { resume } = useResume();
  const finalResume = resumeOverride || resume;

  if (!finalResume) {
    return null;
  }

  const templateKey = finalResume?.meta?.targetTemplate || "Modern01";
  const templateEntry =
    TEMPLATE_LIST.find((template) => template.id === templateKey) || TEMPLATE_LIST[0];
  const TemplateComponent = templateEntry?.component;

  if (!TemplateComponent) {
    return null;
  }

  const userColor = finalResume?.meta?.accentColor;
  const defaultColor = TEMPLATE_DEFAULT_COLORS[templateKey] || "#111827";
  const accentColor = userColor && userColor.trim() ? userColor : defaultColor;

  return (
    <div
      className="resume-theme-wrapper"
      style={{
        "--accent": accentColor,
        "--accent-color": accentColor,
        "--resume-accent": accentColor,
        "--resume-accent-light": `${accentColor}20`,
        "--resume-accent-border": `${accentColor}55`,
      }}
    >
      <TemplateComponent resume={finalResume} mode={mode} accentColor={accentColor} />
    </div>
  );
};

export default PreviewRenderer;
