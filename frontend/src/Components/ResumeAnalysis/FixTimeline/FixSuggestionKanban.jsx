// src/Components/ResumeAnalysis/FixTimeline/FixSuggestionsKanban.jsx

import React, { useMemo } from "react";
import PropTypes from "prop-types";

const PRIORITY_ORDER = ["high", "medium", "low"];

const PRIORITY_LABEL = {
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

const FixSuggestionsKanban = ({ plan = [], summary }) => {
  const grouped = useMemo(() => {
    const map = { high: [], medium: [], low: [] };

    plan.forEach((item) => {
      if (map[item.priority]) {
        map[item.priority].push(item);
      }
    });

    return map;
  }, [plan]);

  return (
    <section className="fix-kanban-wrapper">
      {/* HEADER */}
      <header className="fix-kanban-header">
        <h3>Improvement Plan</h3>
        {summary && (
          <p className="fix-kanban-subtitle">{summary}</p>
        )}
      </header>

      {/* KANBAN GRID */}
      <div className="fix-kanban-grid">
        {PRIORITY_ORDER.map((priority) => {
          const items = grouped[priority];
          if (!items.length) return null; //  auto-hide empty columns

          return (
            <div key={priority} className="fix-column">
              <div className={`fix-column-title ${priority}`}>
                {PRIORITY_LABEL[priority]}
              </div>

              <div className="fix-column-cards">
                {items.map((item, i) => (
                  <div key={i} className="fix-card">
                    <div className="fix-card-header">
                      <span className="fix-section">
                        {item.section}
                      </span>
                      <span className="fix-time">
                        {item.estMinutes} min
                      </span>
                    </div>

                    <p className="fix-detail">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

FixSuggestionsKanban.propTypes = {
  plan: PropTypes.array,
  summary: PropTypes.string,
};

export default FixSuggestionsKanban;

