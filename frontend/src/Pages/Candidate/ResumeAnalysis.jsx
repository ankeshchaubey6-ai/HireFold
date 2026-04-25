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
  const { resume } = useResume();

  const activeStructuredData = resumeData || resume || null;
  const analysis = atsOverride || activeStructuredData?.ats || null;

  const safeScore = Number(
    analysis?.score ??
      analysis?.atsScore ??
      analysis?.overallScore ??
      activeStructuredData?.meta?.atsScore ??
      0
  );

  const sections = useMemo(() => {
    if (Array.isArray(analysis?.sections)) {
      return analysis.sections;
    }
    if (Array.isArray(analysis?.sectionSummary)) {
      return analysis.sectionSummary;
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

  if (!activeStructuredData) {
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
            <SectionSummaryGraph sections={sections} />
          </div>
        </div>
      </section>

      <section className="section-surface">
        <AnalysisOverviewGrid sections={sections} />
      </section>

      <section className="section-surface">
        <KeywordGapPanel keywordGap={keywordGap} />
      </section>

      <section className="section-surface">
        <FixSuggestionsTimeline
          plan={improvementPlan?.plan || []}
          summary={improvementPlan?.summary}
        />
      </section>

      {!embedded ? (
        <ResumeAnalysisActions resume={activeStructuredData} analysis={analysis} />
      ) : null}
    </main>
  );
};

export default ResumeAnalysis;
