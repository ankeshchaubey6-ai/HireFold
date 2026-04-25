import React from "react";

/* =========================================================
   SectionScoreChart (VISUAL SUMMARY GRAPH)
   - Pure visual storytelling
   - No theory text
   - Light/Dark safe
========================================================= */

const getStatusColor = (score) => {
  if (score >= 75) return "var(--accent)"; // good
  if (score >= 50) return "#f59e0b"; // average
  return "#ef4444"; // needs work
};

const clamp = (v, min = 0, max = 100) =>
  Math.max(min, Math.min(max, v));

const SectionScoreChart = ({ title, score }) => {
  const safeScore = clamp(score);
  const color = getStatusColor(safeScore);

  return (
    <div className="section-summary-row">
      {/* LEFT: LABEL */}
      <div className="section-summary-label">
        <span className="dot" style={{ background: color }} />
        <span className="title">{title}</span>
      </div>

      {/* CENTER: BAR */}
      <div className="section-summary-bar">
        <div className="bar-track">
          <div
            className="bar-fill"
            style={{
              width: `${safeScore}%`,
              background: color,
            }}
          />
        </div>
      </div>

      {/* RIGHT: SCORE */}
      <div className="section-summary-score">
        {safeScore}/100
      </div>
    </div>
  );
};

export default SectionScoreChart;
