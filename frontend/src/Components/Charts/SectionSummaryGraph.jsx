import React, { useEffect, useState } from "react";

const STATUS_COLOR = {
  good: "#16a34a",
  needs_improvement: "#f59e0b",
  missing: "#ef4444",
};

const formatScore = (v) =>
  Number.isFinite(v) ? v.toFixed(2) : "0.00";

const SectionSummaryGraph = ({ sections }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // trigger animation AFTER mount
    const t = setTimeout(() => setAnimate(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="section-summary-graph">
      {sections.map((s, index) => {
        const color =
          STATUS_COLOR[s.status] || STATUS_COLOR.needs_improvement;

        const score = Number(s.score) || 0;

        return (
          <div
            key={s.section}
            className={`section-line-row ${
              animate ? "animate" : ""
            }`}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* LABEL */}
            <span className="section-name">
              {s.section}
            </span>

            {/* LINE */}
            <div className="section-line-track">
              <div
                className="section-line-fill"
                style={{
                  width: animate ? `${score}%` : "0%",
                  background: color,
                }}
              />
              <div
                className="section-line-dot"
                style={{
                  left: animate ? `${score}%` : "0%",
                  background: color,
                  boxShadow: `0 0 10px ${color}66`,
                }}
              />
            </div>

            {/* SCORE */}
            <span className="section-score">
              {formatScore(score)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SectionSummaryGraph;
