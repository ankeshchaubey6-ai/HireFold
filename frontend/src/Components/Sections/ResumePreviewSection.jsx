import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { exportResumePDF } from "../../utils/exportPdf";
import { useResume } from "../../Context/ResumeContext";
import { useAuth } from "../../Context/AuthContext";
import { ResumeStorageService } from "../../services/resumeStorage.service";
import PreviewRenderer from "../ResumePreview/PreviewRenderer";
import ResumePaper from "../ResumePreview/ResumePaper";
import "../../Styles/resumePreviewSection.css";

const ResumePreviewSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { resume, activeResumeId } = useResume();
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);

  const activeTemplate = resume?.meta?.targetTemplate || "Modern01";

  const handleSave = async () => {
    if (!activeResumeId) {
      return;
    }

    try {
      setSaving(true);
      await ResumeStorageService.saveResume({
        resumeId: activeResumeId,
        userId: user?.id || user?._id || null,
        title: resume?.basics?.fullName || "Untitled Resume",
        source: resume?.meta?.source || "builder",
        templateId: activeTemplate,
        structuredData: resume,
        isDraft: true,
      });
      setLastSavedAt(new Date().toISOString());
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    await exportResumePDF(document.getElementById("resume-preview-root"));
  };

  return (
    <aside className="resume-preview-section">
      <div className="resume-preview-toolbar">
        <div className="toolbar-left">
          <span className="template-name">{activeTemplate}</span>
          {lastSavedAt ? <span className="save-status">Saved</span> : null}
        </div>

        <div className="toolbar-actions">
          <button
            className="btn-outline"
            onClick={() => navigate(`/candidate/resume/templates/${activeTemplate}`)}
            type="button"
          >
            View
          </button>

          <button className="btn-primary" onClick={handleSave} disabled={saving} type="button">
            {saving ? "Saving..." : "Save"}
          </button>

          <button className="btn-outline" onClick={handleDownload} type="button">
            Download
          </button>
        </div>
      </div>

      <div id="resume-preview-root" className="resume-preview-canvas" data-resume-paper="true">
        <ResumePaper mode="preview">
          <PreviewRenderer mode="preview" />
        </ResumePaper>
      </div>
    </aside>
  );
};

export default ResumePreviewSection;
