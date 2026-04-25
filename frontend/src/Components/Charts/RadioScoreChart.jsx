import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

/* =========================================================
   HIREFOLD ATS RADIAL SCORE CHART (PRODUCTION FIXED)
   - Removes rendering blockers (HatGuard)
   - Strict numeric handling
   - Smooth animation
========================================================= */

const getColorByScore = (score) => {
  if (score >= 85) return "#16a34a";
  if (score >= 70) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
};

const clamp = (v, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Number(v) || 0));

const ATSScoreRadialChart = ({
  score = 0,
  size = 160,
  strokeWidth = 12,
}) => {
  //  HARD PROTECTION AGAINST STRING / NULL / UNDEFINED
  const safeScore = clamp(score);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset + animate (prevents stuck circle)
    setProgress(0);
    const t = setTimeout(() => {
      setProgress(safeScore);
    }, 120);

    return () => clearTimeout(t);
  }, [safeScore]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (progress / 100) * circumference;

  const color = getColorByScore(safeScore);

  return (
    <div
      className="ats-radial-chart"
      style={{
        width: size,
        height: size,
        position: "relative",
      }}
    >
      <svg width={size} height={size}>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />

        {/* Animated Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition:
              "stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </svg>

      {/* CENTER SCORE TEXT (PRODUCTION UX) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          fontWeight: "700",
          color,
        }}
      >
        {Math.round(safeScore)}
      </div>
    </div>
  );
};

ATSScoreRadialChart.propTypes = {
  score: PropTypes.number,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
};

export default ATSScoreRadialChart;
