// src/Components/ResumeAnalysis/Header/StatusBadge.jsx

import React from "react";
import PropTypes from "prop-types";

/* =========================================================
   StatusBadge
   ---------------------------------------------------------
   Converts numeric ATS / overall score into
   - Label
   - Color
   - Severity class
========================================================= */

function getStatus(score) {
  if (score >= 85) {
    return {
      label: "Excellent",
      className: "status-excellent",
      color: "#16a34a",
    };
  }

  if (score >= 70) {
    return {
      label: "Good",
      className: "status-good",
      color: "#22c55e",
    };
  }

  if (score >= 50) {
    return {
      label: "Average",
      className: "status-average",
      color: "#f59e0b",
    };
  }

  return {
    label: "Needs Improvement",
    className: "status-poor",
    color: "#ef4444",
  };
}

const clamp = (v, min = 0, max = 100) =>
  Math.max(min, Math.min(max, v));

const StatusBadge = ({ score, showScore }) => {
  const safeScore = clamp(score);
  const status = getStatus(safeScore);

  return (
    <div
      className={`status-badge ${status.className}`}
      style={{ borderColor: status.color }}
      title={`Overall ATS Score: ${safeScore}`}
    >
      <span
        className="status-indicator"
        style={{ backgroundColor: status.color }}
      />

      <span className="status-label">
        {status.label}
      </span>

      {showScore && (
        <span className="status-score">
          {safeScore}/100
        </span>
      )}
    </div>
  );
};

StatusBadge.propTypes = {
  score: PropTypes.number.isRequired,
  showScore: PropTypes.bool,
};

StatusBadge.defaultProps = {
  showScore: false,
};

export default StatusBadge;
