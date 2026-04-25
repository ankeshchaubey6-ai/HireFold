import React, { useMemo } from "react";
import PropTypes from "prop-types";



const PRIORITY_ORDER = ["high", "medium", "low"];

const PRIORITY_META = {
  high: {
    label: "High Priority",
    color: "#dc2626",
  },
  medium: {
    label: "Medium Priority",
    color: "#d97706",
  },
  low: {
    label: "Low Priority",
    color: "#16a34a",
  },
};

const FixSuggestionsTimeline = ({ plan = [], summary }) => {
  const grouped = useMemo(() => {
    const g = { high: [], medium: [], low: [] };
    plan.forEach((item) => {
      if (g[item.priority]) g[item.priority].push(item);
    });
    return g;
  }, [plan]);

  if (!plan.length) {
    return (
      <div className="fix-board">
        <h3>Improvement Plan</h3>
        <p className="muted">
          No critical fixes detected. Your resume is in good shape.
        </p>
      </div>
    );
  }

  return (
    <div className="fix-board">
      {/* HEADER */}
      <header className="fix-board-header">
        <h3>Improvement Plan</h3>
        {summary && (
          <p className="fix-board-summary">{summary}</p>
        )}
      </header>

      {/* PRIORITY GROUPS */}
      <div className="fix-board-grid">
        {PRIORITY_ORDER.map((priority) => {
          const items = grouped[priority];
          if (!items.length) return null;

          const meta = PRIORITY_META[priority];

          return (
            <div key={priority} className="fix-column">
              {/* GROUP TITLE */}
              <div
                className="fix-column-title"
                style={{ color: meta.color }}
              >
                {meta.label}
              </div>

              {/* CARDS */}
              {items.map((item, i) => (
                <div
                  key={`${item.section}-${i}`}
                  className="fix-card"
                >
                  {/* HEADER */}
                  <div className="fix-card-header">
                    <span className="fix-section">
                      {item.section}
                    </span>

                    <span
                      className="fix-priority-pill"
                      style={{
                        background: `${meta.color}22`,
                        color: meta.color,
                      }}
                    >
                      {meta.label}
                    </span>
                  </div>

                  {/* MAIN TEXT */}
                  <p className="fix-card-text">
                    {item.detail}
                  </p>

                  {/* META */}
                  <div className="fix-card-meta">
                    <span className="fix-eta">
                       {item.estMinutes} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

FixSuggestionsTimeline.propTypes = {
  plan: PropTypes.array,
  summary: PropTypes.string,
};

export default FixSuggestionsTimeline;

