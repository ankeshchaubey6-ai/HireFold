import React, { useEffect, useState } from "react";

import "../../Styles/resumePage.css";
import "../../Styles/sectionSurface.css";

import ResumeHero from "../../Components/Banners/ResumeHero";
import ResumeFooterCTA from "../../Components/Banners/ResumeFooterCTA";

import ResumeActions from "../../Components/Sections/ResumeActions";
import ResumeTemplatesSection from "../../Components/Sections/ResumeTemplatesSection";
import ResumeImprovementSection from "../../Components/Sections/ResumeImprovementSection";

import ResumeForm from "./ResumeBuilder/ResumeForm";
import ResumePreviewSection from "../../Components/Sections/ResumePreviewSection";

import { useResume } from "../../Context/ResumeContext";
import { useAuth } from "../../Context/AuthContext";
import { ResumeStorageService } from "../../services/resumeStorage.service";
import { useResumeLoader } from "../../hooks/useResumeLoader";
import { useAutoSaveResume } from "../../hooks/useAutoSaveResume";

import UploadResumeModal from "../../Components/Common/UploadResumeModal";

const ACTIVE_RESUME_KEY = "hirefold_active_resume_id";

/* ================= UTILITY FUNCTIONS ================= */
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const Resume = () => {
  const [mode, setMode] = useState("home");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [hasDraft, setHasDraft] = useState(
    Boolean(localStorage.getItem(ACTIVE_RESUME_KEY))
  );

  const { user } = useAuth();
  const { resume, resetResume, loadResumeIntoContext, setActiveResumeId } =
    useResume();
  const { loadResume } = useResumeLoader();

  /* ================= AUTO SAVE ================= */
  useAutoSaveResume({
    resume: mode === "builder" ? resume : null,
    userId: user?.id,
    resumeId: mode === "builder" ? localStorage.getItem(ACTIVE_RESUME_KEY) : null,
    templateId: resume?.meta?.targetTemplate,
  });

 
  /* ================= CREATE RESUME ================= */
  const createResume = async () => {
    const resumeId = generateUUID();
    localStorage.setItem(ACTIVE_RESUME_KEY, resumeId);
    setHasDraft(true);
    resetResume();

    await ResumeStorageService.saveResume({
      resumeId,
      userId: user?.id ?? null,
      source: "builder",
      structuredData: resume,
      isDraft: true,
      title: "Untitled Resume",
    });

    setMode("builder");
    setActiveResumeId(resumeId);
  };

  /* ================= CONTINUE EDITING ================= */
  const continueEditing = async () => {
    const resumeId = localStorage.getItem(ACTIVE_RESUME_KEY);
    if (!resumeId) return;

    setMode("builder");
    setActiveResumeId(resumeId);

    try {
      await loadResume(resumeId, loadResumeIntoContext);
    } catch {
      
    }
  };

  /* ================= UPLOAD CLOSE HANDLER ================= */
  const handleUploadClose = () => {
    setShowUploadModal(false);
    // ResumeContext polling is automatic once activeResumeId is set
  };

  const goToHome = () => {
    setMode("home");
  };

  const getAtsScoreColor = (score) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <main className="resume-page">
      {/* Hero Section */}
      {mode === "home" && <ResumeHero />}

      {/* HOME MODE */}
      {mode === "home" && (
        <>
          {/* Resume Actions Section */}
          <div className="section-surface resume-actions-section">
            <ResumeActions
              onCreate={createResume}
              onContinue={continueEditing}
              onUpload={() => setShowUploadModal(true)}
              hasDraft={hasDraft}
            />
          </div>

          {/* Resume Templates Section */}
          <div className="section-surface resume-templates-section">
           <ResumeTemplatesSection onSelectTemplate={() => setMode("builder")} />
          </div>

          {/* Resume Improvement Section */}
          <div className="section-surface resume-improvement-section">
            <ResumeImprovementSection />
          </div>

          <ResumeFooterCTA />
        </>
      )}

      {/* BUILDER MODE */}
      {mode === "builder" && (
        <>
          {/* Top Bar */}
          <div className="builder-top-bar">
            <button className="btn-back" onClick={goToHome}>
               Back to Dashboard
            </button>

            {/* ATS Score Card */}
            <div className="ats-score-card">
              <div className="ats-score-label">
                <span className="ats-icon"></span>
                ATS Compatibility Score
              </div>
              <div
                className="ats-score-value"
                style={{
                  color: resume?.meta?.atsScore
                    ? getAtsScoreColor(resume.meta.atsScore)
                    : "#9ca3af",
                }}
              >
                {resume?.meta?.atsScore !== null &&
                resume?.meta?.atsScore !== undefined
                  ? `${resume.meta.atsScore}%`
                  : ""}
              </div>
              {resume?.meta?.atsScore && (
                <div className="ats-score-message">
                  {resume.meta.atsScore >= 80 &&
                    " Excellent! Ready for applications"}
                  {resume.meta.atsScore >= 60 &&
                    resume.meta.atsScore < 80 &&
                    " Good, but can be improved"}
                  {resume.meta.atsScore < 60 && " Needs improvement"}
                </div>
              )}
            </div>
          </div>

          {/* Builder Layout */}
          <div className="resume-builder-layout">
            <div className="resume-builder-left">
              <ResumeForm />
            </div>
            <div className="resume-builder-right">
              <ResumePreviewSection />
            </div>
          </div>
        </>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadResumeModal onClose={handleUploadClose} />
      )}
    </main>
  );
};
export default Resume;
