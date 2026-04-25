import React from "react";
import { useResume } from "@/Context/ResumeContext";
import "@/Styles/resumeTopBar.css";

const COLORS = [
  { name: "Blue", value: "#2563eb" },
  { name: "Green", value: "#16a34a" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Red", value: "#dc2626" },
  { name: "Teal", value: "#0d9488" },
];

const ResumeTopBar = ({ step, totalSteps }) => {
  const { resume, setTemplate, updateMeta } = useResume();

  const handleColorChange = (color) => {
    updateMeta("themeColor", color); //  LIVE CV COLOR CHANGE
  };

  return (
    <div className="resume-topbar">
      {/* LEFT: Step Info */}
      <div className="topbar-left">
        <h2>Resume Builder</h2>
        <span className="step-indicator">
          Step {step + 1} / {totalSteps}
        </span>
      </div>

      {/* CENTER: TEMPLATE FILTER */}
      <div className="topbar-center">
        <label>Template:</label>
        <select
          value={resume.meta.targetTemplate}
          onChange={(e) => setTemplate(e.target.value)}
        >
          <option value="Modern01">Modern</option>
          <option value="Minimal01">Minimal</option>
          <option value="ATS01">ATS</option>
          <option value="Creative01">Creative</option>
          <option value="Executive01">Executive</option>
        </select>
      </div>

      {/* RIGHT: COLOR SWITCHER */}
      <div className="topbar-right">
        <span className="color-label">Theme:</span>
        <div className="color-palette">
          {COLORS.map((c) => (
            <button
              key={c.value}
              className="color-dot"
              style={{ background: c.value }}
              onClick={() => handleColorChange(c.value)}
              title={c.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeTopBar;

