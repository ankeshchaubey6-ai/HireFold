import React, { useEffect, useMemo, useState } from "react";
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
import { ResumeStorageService } from "../../services/resumeStorage.service";
import "../../Styles/resumeAnalysis.css";

const ACTIVE_RESUME_KEY = "hirefold_active_resume_id";

const normalizeSections = (analysis) => {
  if (Array.isArray(analysis?.sections) && analysis.sections.length) {
    return analysis.sections;
  }

  const scores = analysis?.sectionScores;
  const feedback = analysis?.sectionFeedback;

  if (!scores || !feedback) {
    return [];
  }

  return Object.keys(scores).map((key) => ({
    section: key.charAt(0).toUpperCase() + key.slice(1),
    score: Number(scores[key]) || 0,
    status: feedback[key]?.status || "missing",
    priority:
      feedback[key]?.status === "missing"
        ? "high"
        : feedback[key]?.status === "needs_improvement"
        ? "medium"
        : "low",
    urgency:
      feedback[key]?.status === "missing"
        ? "high"
        : feedback[key]?.status === "needs_improvement"
        ? "medium"
        : "low",
    note: feedback[key]?.feedback || "",
    suggestions: Array.isArray(feedback[key]?.suggestions)
      ? feedback[key].suggestions
      : [],
    positives:
      feedback[key]?.status === "good" && feedback[key]?.feedback
        ? [feedback[key].feedback]
        : [],
    details: {
      keywords: feedback[key]?.keywords || [],
    },
  }));
};

const ResumeAnalysis = ({ embedded = false, resumeData = null, atsOverride = null }) => {
  const navigate = useNavigate();
  const { resume, loadResumeIntoContext } = useResume();
  const [loadedResume, setLoadedResume] = useState(null);
  const [loadedAnalysis, setLoadedAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  const activeResumeId =
    resumeData?.meta?.resumeId ||
    resume?.meta?.resumeId ||
    localStorage.getItem(ACTIVE_RESUME_KEY) ||
    null;

  const baseStructuredData = loadedResume || resumeData || resume || null;
  const analysis =
    atsOverride ||
    loadedAnalysis ||
    loadedResume?.ats ||
    baseStructuredData?.ats ||
    null;

  useEffect(() => {
    let cancelled = false;

    const ensureAnalysis = async () => {
      if (embedded || !activeResumeId) {
        return;
      }

      const existingSections = normalizeSections(analysis);
      if (Array.isArray(existingSections) && existingSections.length > 0 && baseStructuredData) {
        return;
      }

      try {
        setLoadingAnalysis(true);
        setAnalysisError("");

        let fetchedResume = baseStructuredData;

        if (!fetchedResume || fetchedResume?.meta?.resumeId !== activeResumeId) {
          const entity = await ResumeStorageService.getResumeById(activeResumeId);
          if (cancelled) return;

          if (entity?.structuredData) {
            fetchedResume = {
              ...(entity.structuredData || {}),
              ats: entity.ats ?? null,
              meta: {
                ...(entity.structuredData?.meta || {}),
                resumeId: entity.resumeId,
                source: entity.source || entity.structuredData?.meta?.source || "upload",
                atsScore: entity.atsScore ?? null,
                ats: entity.ats ?? null,
              },
            };

            setLoadedResume(fetchedResume);
            loadResumeIntoContext?.(fetchedResume);
          }
        }

        const storedSections = normalizeSections(fetchedResume?.ats);

        if (Array.isArray(storedSections) && storedSections.length > 0) {
          return;
        }

        const latestAnalysis = await ResumeStorageService.getResumeAnalysis(activeResumeId);
        if (cancelled) return;

        if (latestAnalysis) {
          console.log("[FRONTEND] Normalized ATS analysis payload:", latestAnalysis);
          setLoadedAnalysis(latestAnalysis.ats || latestAnalysis);

          if (fetchedResume) {
            const mergedResume = {
              ...fetchedResume,
              ats: latestAnalysis.ats || latestAnalysis,
              meta: {
                ...(fetchedResume.meta || {}),
                atsScore:
                  latestAnalysis.score ??
                  latestAnalysis.ats?.score ??
                  fetchedResume.meta?.atsScore ??
                  null,
                ats: latestAnalysis.ats || latestAnalysis,
              },
            };
            setLoadedResume(mergedResume);
            loadResumeIntoContext?.(mergedResume);
          }
        }
      } catch (error) {
        if (!cancelled) {
          setAnalysisError("We could not load the latest section-wise analysis right now.");
        }
      } finally {
        if (!cancelled) {
          setLoadingAnalysis(false);
        }
      }
    };

    ensureAnalysis();

    return () => {
      cancelled = true;
    };
  }, [embedded, activeResumeId, analysis, baseStructuredData, loadResumeIntoContext]);

  const activeStructuredData = loadedResume || resumeData || resume || null;

  const safeScore = Number(
    analysis?.totalScore ??
      analysis?.score ??
      analysis?.atsScore ??
      analysis?.overallScore ??
      analysis?.ats?.totalScore ??
      analysis?.ats?.score ??
      activeStructuredData?.meta?.atsScore ??
      0
  );

  const sections = useMemo(() => normalizeSections(analysis), [analysis]);

  const keywordGap = analysis?.keywordGap || {
    foundKeywords: analysis?.keywords?.found || [],
    missingKeywords: analysis?.keywords?.missing || [],
    suggestedKeywords: analysis?.keywords?.missing || [],
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
          {analysisError ? <p className="analysis-error">{analysisError}</p> : null}
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
            {loadingAnalysis ? <p className="analysis-loading">Loading latest analysis...</p> : null}
            {analysisError ? <p className="analysis-error">{analysisError}</p> : null}
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
