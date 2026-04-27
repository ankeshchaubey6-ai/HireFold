// src/Components/ResumeAnalysis/SectionBreakdown.jsx

import React from "react";
import PropTypes from "prop-types";

/* =========================================================
   SectionBreakdown
   ---------------------------------------------------------
   Compact, high-signal card used in the overview grid.
   - Displays section name
   - Score (0100)
   - Status + priority
   - Visual progress bar
========================================================= */

const STATUS_COLORS = {
  good: "#16a34a",
  average: "#f59e0b",
  poor: "#ef4444",
};

const PRIORITY_LABELS = {
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

const clamp = (v, min = 0, max = 100) =>
  Math.max(min, Math.min(max, v));

const SectionBreakdown = ({
  title,
  score,
  status,
  priority,
  onClick,
}) => {
  const safeScore = clamp(score);
  const color = STATUS_COLORS[status] || "#64748b";

  return (
    <div
      className={`section-breakdown-card status-${status}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* =========================
         HEADER
      ========================= */}
      <div className="section-breakdown-header">
        <h3 className="section-title">{title}</h3>

        <span
          className={`priority-badge priority-${priority}`}
          title={PRIORITY_LABELS[priority]}
        >
          {PRIORITY_LABELS[priority]}
        </span>
      </div>

      {/* =========================
         SCORE
      ========================= */}
      <div className="section-score">
        <span className="score-value">{safeScore}</span>
        <span className="score-max">/100</span>
      </div>

      {/* =========================
         PROGRESS BAR
      ========================= */}
      <div className="section-progress">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${safeScore}%`,
              backgroundColor: color,
            }}
          />
        </div>

        <span
          className={`status-label status-${status}`}
          style={{ color }}
        >
          {status.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

SectionBreakdown.propTypes = {
  title: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  status: PropTypes.oneOf(["good", "average", "poor"])
    .isRequired,
  priority: PropTypes.oneOf(["high", "medium", "low"])
    .isRequired,
  onClick: PropTypes.func,
};

export default SectionBreakdown;

