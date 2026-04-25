import { useJob } from "../../../../Context/JobContext";
import { useState, useEffect } from "react";

const SkillsRequirementsSection = () => {
  const { job, setJob } = useJob();

  // local text state (allows spaces naturally)
  const [skillsText, setSkillsText] = useState("");
  const [preferredSkillsText, setPreferredSkillsText] = useState("");

  /* ================= INIT FROM CONTEXT ================= */
  useEffect(() => {
    if (Array.isArray(job.skills)) {
      setSkillsText(job.skills.join(", "));
    }
    if (Array.isArray(job.preferredSkills)) {
      setPreferredSkillsText(job.preferredSkills.join(", "));
    }
  }, []);

  /* ================= SAVE TO CONTEXT (ON BLUR) ================= */
  const commitSkills = () => {
    setJob((prev) => ({
      ...prev,
      skills: skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }));
  };

  const commitPreferredSkills = () => {
    setJob((prev) => ({
      ...prev,
      preferredSkills: preferredSkillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }));
  };

  return (
    <section className="section-surface">
      <div className="form-section">
        <div className="form-section-header">
          <h3>Skills & Requirements</h3>
        </div>

        <div className="form-grid">
          {/* REQUIRED SKILLS */}
          <input
            placeholder="Required skills (e.g. React, JavaScript, REST APIs)"
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)} //  free typing
            onBlur={commitSkills} //  sanitize only on blur
          />

          {/* PREFERRED SKILLS */}
          <input
            placeholder="Preferred skills (nice to have)"
            value={preferredSkillsText}
            onChange={(e) =>
              setPreferredSkillsText(e.target.value)
            }
            onBlur={commitPreferredSkills}
          />
        </div>
      </div>
    </section>
  );
};

export default SkillsRequirementsSection;

