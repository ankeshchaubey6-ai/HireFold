import React, { useEffect, useMemo, useState } from "react";
import "../../../Styles/analysisOverviewGrid.css";

const STATUS_META = {
  good: { label: "Good", color: "#22c55e" },
  needs_improvement: { label: "Needs Work", color: "#f59e0b" },
  missing: { label: "Missing", color: "#ef4444" },
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
  section:     section.section   || "Unknown",
  score:       clampScore(section.score),
  status:      section.status    || "missing",
  priority:    section.priority  || "medium",
  urgency:     section.urgency   || null,
  note:        section.note      || "",
  suggestions: Array.isArray(section.suggestions) ? section.suggestions : [],
  positives:   Array.isArray(section.positives)   ? section.positives   : [],
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
          const meta        = STATUS_META[s.status] || STATUS_META.needs_improvement;
          const urgencyMeta = s.urgency ? URGENCY_META[s.urgency] : null;

          return (
            <article key={s.section} className="analysis-overview-card">

              {/* ===== HEADER ===== */}
              <div className="overview-card-header">
                <h4>{s.section}</h4>
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

              {/* ===== URGENCY BADGE ===== */}
              {urgencyMeta && (
                <div className="overview-urgency-badge" style={{
                  background: urgencyMeta.bg,
                  color: urgencyMeta.color,
                  border: `1px solid ${urgencyMeta.color}33`,
                }}>
                  <span className="overview-urgency-dot" style={{
                    background: urgencyMeta.dot,
                  }} />
                  {s.urgency}
                </div>
              )}

              {/* ===== SCORE EXPLANATION NOTE ===== */}
              {s.note && (
                <p className="overview-note">{s.note}</p>
              )}

              {Array.isArray(s.details.keywords) && s.details.keywords.length > 0 && (
                <div className="overview-metrics">
                  <div>
                    <strong>Keywords:</strong> {s.details.keywords.slice(0, 6).join(", ")}
                  </div>
                </div>
              )}

              {/* ===== WHAT'S GOOD ===== */}
              {s.positives.length > 0 && (
                <div className="overview-positives">
                  <p className="overview-positives-label">
                     What's working
                  </p>
                  <ul className="overview-positives-list">
                    {s.positives.map((text, i) => (
                      <li key={i} className="overview-positive-item">
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ===== SUGGESTIONS / ISSUES ===== */}
              {s.suggestions.length > 0 && (
                <div className="overview-suggestions-wrap">
                  <p className="overview-suggestions-label">
                     Issues to fix
                  </p>
                  <ul className="overview-suggestions">
                    {s.suggestions.map((text, i) => (
                      <li key={i}>{text}</li>
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

              {/* ===== WORD COUNT (FORMATTING) ===== */}
              {s.details.wordCount !== undefined && (
                <div className="overview-metrics">
                  <div>
                    <strong>Word count:</strong>{" "}
                    {s.details.wordCount}
                    <span style={{
                      color: s.details.wordCount > 200 && s.details.wordCount < 2000
                        ? "#16a34a" : "#ef4444",
                      marginLeft: "6px",
                      fontSize: "0.75rem",
                    }}>
                      {s.details.wordCount < 200
                        ? "(too short)"
                        : s.details.wordCount > 2000
                        ? "(too long)"
                        : "(good range)"}
                    </span>
                  </div>
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
