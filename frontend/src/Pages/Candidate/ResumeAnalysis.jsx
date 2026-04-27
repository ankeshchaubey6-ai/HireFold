import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useResume } from "../../Context/ResumeContext";
import RadioScoreChart from "../../Components/Charts/RadioScoreChart";
import SectionSummaryGraph from "../../Components/Charts/SectionSummaryGraph";
import AnalysisOverviewGrid from "../../Components/ResumeAnalysis/Overview/AnalysisOverviewGrid";
import KeywordGapPanel from "../../Components/ResumeAnalysis/KeywordGap/KeywordGapPanel";
import FixSuggestionsTimeline from "../../Components/ResumeAnalysis/FixTimeline/FixSuggestionsTimeline";
import StatusBadge from "../../Components/ResumeAnalysis/Header/StatusBadge";
import ResumeAnalysisActions from "../../Components/ResumeAnalysis/ActionBar/ResumeAnalysisActions";
import { generateResumeImprovements } from "../../services/resumeImprovement.service";
import "../../Styles/resumeAnalysis.css";

const ResumeAnalysis = ({ embedded = false, resumeData = null, atsOverride = null }) => {
  const navigate = useNavigate();
  const { resume, analysisLoading, analysisError } = useResume();

  const activeStructuredData = resumeData || resume || null;
  const analysis = atsOverride || activeStructuredData?.ats || null;

  const safeScore = Number(
    analysis?.score ??
      analysis?.atsScore ??
      analysis?.overallScore ??
      activeStructuredData?.meta?.atsScore ??
      0
  );

  // Properly extract sections from analysis
  const sections = useMemo(() => {
    if (!analysis) return [];

    // Sections come from backend generated sections array
    if (Array.isArray(analysis?.sections) && analysis.sections.length > 0) {
      return analysis.sections.map((section) => ({
        name: section.name || "Unknown",
        score: section.score || 0,
        status: section.status || "unknown",
        feedback: section.feedback || "",
      }));
    }

    // Legacy fallback to sectionSummary
    if (Array.isArray(analysis?.sectionSummary) && analysis.sectionSummary.length > 0) {
      return analysis.sectionSummary;
    }

    // Legacy fallback to breakdown
    if (analysis?.breakdown && typeof analysis.breakdown === "object") {
      return Object.entries(analysis.breakdown).map(([key, score]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        score: score || 0,
        status: score >= 75 ? "strong" : score >= 50 ? "moderate" : "weak",
        feedback: `${key} section scored ${score}/100`,
      }));
    }

    return [];
  }, [analysis]);

  const keywordGap = analysis?.keywordGap || {
    missingKeywords: [],
    suggestedKeywords: [],
    confidence: 0,
  };

  const improvementPlan =
    analysis?.improvementPlan ||
    generateResumeImprovements({
      structuredData: activeStructuredData,
      ats: analysis,
    });

  // Loading state
  if (analysisLoading && !analysis) {
    return (
      <main className="page resume-analysis-page page-surface">
        <section className="section-surface analysis-top-wrapper">
          <h1 className="analysis-top-title">Resume Analysis</h1>
          <p className="analysis-top-subtitle">Analyzing your resume...</p>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Running ATS analysis and generating feedback...</p>
          </div>
        </section>
      </main>
    );
  }

  // Error state
  if (analysisError && !analysis) {
    return (
      <main className="page resume-analysis-page page-surface">
        <section className="section-surface analysis-top-wrapper">
          <h1 className="analysis-top-title">Resume Analysis</h1>
          <p className="analysis-top-subtitle">Analysis Error</p>
          <div className="error-container">
            <div className="error-message">
              <strong>Error:</strong> {analysisError}
            </div>
            <p>Please try uploading your resume again.</p>
            {!embedded ? (
              <button
                className="btn-outline"
                onClick={() => navigate("/candidate/resume")}
                type="button"
              >
                Go to Resume
              </button>
            ) : null}
          </div>
        </section>
      </main>
    );
  }

  // No data state
  if (!activeStructuredData || !analysis) {
    return (
      <main className="page resume-analysis-page page-surface">
        <section className="section-surface analysis-top-wrapper">
          <h1 className="analysis-top-title">Resume Analysis</h1>
          <p className="analysis-top-subtitle">Upload or build a resume to see ATS analysis.</p>
          {!embedded ? (
            <button className="btn-outline" onClick={() => navigate("/candidate/resume")} type="button">
              Go to Resume Builder
            </button>
          ) : null}
        </section>
      </main>
    );
  }

  // Analysis complete - render results
  return (
    <main className={`page resume-analysis-page page-surface ${embedded ? "embedded" : ""}`}>
      <section className="section-surface analysis-top-wrapper">
        <div className="analysis-top-header">
          <h1 className="analysis-top-title">Resume Analysis</h1>
          <p className="analysis-top-subtitle">ATS score and section-by-section improvement guidance</p>
        </div>

        <div className="analysis-top-row">
          <div className="analysis-card">
            <RadioScoreChart score={safeScore} />
            <StatusBadge score={safeScore} showScore />
          </div>

          <div className="analysis-card analysis-card-wide">
            {sections.length > 0 ? (
              <SectionSummaryGraph sections={sections} />
            ) : (
              <div className="no-data-placeholder">
                <p>Section analysis data not yet available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {sections.length > 0 && (
        <section className="section-surface">
          <AnalysisOverviewGrid sections={sections} />
        </section>
      )}

      {keywordGap?.missingKeywords?.length > 0 && (
        <section className="section-surface">
          <KeywordGapPanel keywordGap={keywordGap} />
        </section>
      )}

      {improvementPlan?.plan && improvementPlan.plan.length > 0 && (
        <section className="section-surface">
          <FixSuggestionsTimeline
            plan={improvementPlan.plan}
            summary={improvementPlan.summary}
          />
        </section>
      )}

      {!embedded ? (
        <ResumeAnalysisActions resume={activeStructuredData} analysis={analysis} />
      ) : null}
    </main>
  );
};

export default ResumeAnalysis;
