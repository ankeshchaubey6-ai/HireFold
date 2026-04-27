import React, { useEffect, useMemo, useState } from "react";
import "../../../Styles/analysisOverviewGrid.css";

const STATUS_META = {
  strong: { label: "Strong", color: "#16a34a" },
  good: { label: "Good", color: "#22c55e" },
  average: { label: "Average", color: "#f59e0b" },
  weak: { label: "Needs Work", color: "#ef4444" },
};

const URGENCY_META = {
  high: { bg: "#fee2e2", color: "#b91c1c", dot: "#ef4444" },
  medium: { bg: "#fef3c7", color: "#b45309", dot: "#f59e0b" },
  low: { bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
};

const formatScore = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  return Math.round(n).toString();
};

const clampScore = (v) =>
  Math.min(100, Math.max(0, Number(v) || 0));

/* =========================================================
   ANIMATED PROGRESS BAR
========================================================= */

const AnimatedProgress = ({ value, color }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const timeout = setTimeout(() => {
      setProgress(clampScore(value));
    }, 250);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="overview-progress-track">
      <div
        className="overview-progress-fill"
        style={{
          width: `${progress}%`,
          background: color,
          transition: "width 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
};

/* =========================================================
   SECTION NORMALIZER
   Safely reads both old and new service fields
========================================================= */

const normalizeSection = (section) => ({
  name:            section.name     || section.section   || "Unknown",
  score:           clampScore(section.score),
  status:          section.status    || "average",
  priority:        section.priority  || "medium",
  urgency:         section.urgency   || null,
  note:            section.note      || section.feedback || "",
  feedback:        section.feedback  || "",
  suggestions:     Array.isArray(section.suggestions) ? section.suggestions : Array.isArray(section.recommendations) ? section.recommendations : [],
  recommendations: Array.isArray(section.recommendations) ? section.recommendations : [],
  positives:       Array.isArray(section.positives)   ? section.positives   : [],
  estimatedTime:   section.estimatedTime || "",
  details:
    typeof section.details === "object" && section.details !== null
      ? section.details
      : {},
});

/* =========================================================
   ANALYSIS OVERVIEW GRID
========================================================= */

const AnalysisOverviewGrid = ({ sections }) => {
  if (!Array.isArray(sections)) return null;

  const normalizedSections = useMemo(
    () => sections.map(normalizeSection),
    [sections]
  );

  return (
    <section className="analysis-overview">
      <h3 className="analysis-overview-title">
        Section Performance Overview
      </h3>

      <div className="analysis-overview-grid">
        {normalizedSections.map((s) => {
          const meta        = STATUS_META[s.status] || STATUS_META.average;
          const urgencyMeta = s.urgency ? URGENCY_META[s.urgency] : null;

          return (
            <article key={s.name} className="analysis-overview-card">

              {/* ===== HEADER ===== */}
              <div className="overview-card-header">
                <h4>{s.name}</h4>
                <span
                  className="overview-status"
                  style={{ color: meta.color }}
                >
                  {meta.label}
                </span>
              </div>

              {/* ===== SCORE ===== */}
              <div className="overview-score">
                {formatScore(s.score)}
                <span>/100</span>
              </div>

              {/* ===== PROGRESS BAR ===== */}
              <AnimatedProgress value={s.score} color={meta.color} />

              {/* ===== PRIORITY BADGE ===== */}
              {s.priority && (
                <div className="overview-priority-badge" style={{
                  background: URGENCY_META[s.priority]?.bg || "#f3f4f6",
                  color: URGENCY_META[s.priority]?.color || "#666",
                  border: `1px solid ${URGENCY_META[s.priority]?.color}33`,
                }}>
                  <span className="overview-priority-dot" style={{
                    background: URGENCY_META[s.priority]?.dot || "#999",
                  }} />
                  Priority: {s.priority}
                </div>
              )}

              {/* ===== ESTIMATED TIME ===== */}
              {s.estimatedTime && (
                <div className="overview-estimate-time">
                  <strong>⏱️ Time to fix:</strong> {s.estimatedTime}
                </div>
              )}

              {/* ===== MAIN FEEDBACK ===== */}
              {s.feedback && (
                <p className="overview-feedback">{s.feedback}</p>
              )}

              {/* ===== RECOMMENDATIONS / ISSUES ===== */}
              {(s.recommendations.length > 0 || s.suggestions.length > 0) && (
                <div className="overview-recommendations">
                  <p className="overview-recommendations-label">
                    ✅ What to do
                  </p>
                  <ul className="overview-recommendations-list">
                    {s.recommendations.map((text, i) => (
                      <li key={i}>{text}</li>
                    ))}
                    {s.suggestions.map((text, i) => (
                      <li key={`sug-${i}`}>{text}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ===== EXPERIENCE METRICS ===== */}
              {(s.details.roles !== undefined ||
                s.details.achievements !== undefined) && (
                <div className="overview-metrics">
                  {s.details.roles !== undefined && (
                    <div>
                      <strong>Roles:</strong> {s.details.roles}
                    </div>
                  )}
                  {s.details.achievements !== undefined && (
                    <div>
                      <strong>Achievements:</strong>{" "}
                      {s.details.achievements}
                    </div>
                  )}
                  {s.details.hasMetrics !== undefined && (
                    <div>
                      <strong>Quantified impact:</strong>{" "}
                      {s.details.hasMetrics ? "Yes " : "Not found"}
                    </div>
                  )}
                </div>
              )}

              {/* ===== SKILLS METRICS ===== */}
              {s.details.skillsCount !== undefined && (
                <div className="overview-metrics">
                  <div>
                    <strong>Skills found:</strong>{" "}
                    {s.details.skillsCount}
                  </div>
                  {s.details.skillCategories !== undefined && (
                    <div>
                      <strong>Categories:</strong>{" "}
                      {s.details.skillCategories}
                    </div>
                  )}
                </div>
              )}

              {/* ===== PROJECTS METRICS ===== */}
              {s.details.projectsCount !== undefined && (
                <div className="overview-metrics">
                  <div>
                    <strong>Projects:</strong>{" "}
                    {s.details.projectsCount}
                  </div>
                  {s.details.highComplexProjects > 0 && (
                    <div>
                      <strong>High complexity:</strong>{" "}
                      {s.details.highComplexProjects}
                    </div>
                  )}
                </div>
              )}

            </article>
          );
        })}
      </div>
    </section>
  );
};

export default AnalysisOverviewGrid;
