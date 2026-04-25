import React from "react";
import { useResume } from "../../Context/ResumeContext";

const TemplateSelect = () => {
  const { resume, setResume } = useResume();

  return (
    <select
      value={resume.meta.targetTemplate}   //  READ VALUE
      onChange={(e) => {
        setResume(prev => ({
          ...prev,
          meta: {
            ...prev.meta,
            targetTemplate: e.target.value,
          },
        }));
      }} //  UPDATE VALUE
    >
      {/* ===== MODERN ===== */}
      <option value="Modern01">Modern 01</option>
      <option value="Modern02">Modern 02</option>
      <option value="Modern03">Modern 03</option>

      {/* ===== MINIMAL ===== */}
      <option value="Minimal01">Minimal 01</option>
      <option value="Minimal02">Minimal 02</option>
      <option value="Minimal03">Minimal 03</option>
      <option value="Minimal04">Minimal 04</option>

      {/* ===== ATS ===== */}
      <option value="ATS01">ATS 01</option>
      <option value="ATS02">ATS 02</option>
      <option value="ATS03">ATS 03</option>

      {/* ===== CREATIVE ===== */}
      <option value="Creative01">Creative 01</option>
      <option value="Creative02">Creative 02</option>

      {/* ===== EXECUTIVE ===== */}
      <option value="Executive01">Executive 01</option>
      <option value="Executive02">Executive 02</option>

      {/* ===== SIMPLE ===== */}
      <option value="Simple01">Simple 01</option>
      <option value="Simple02">Simple 02</option>
      <option value="Simple03">Simple 03</option>
      <option value="Simple04">Simple 04</option>
    </select>
  );
};

export default TemplateSelect;

