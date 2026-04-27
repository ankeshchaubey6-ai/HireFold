import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import api from "../../services/api";
import { useResume } from "../../Context/ResumeContext";

const UploadResumeModal = ({ onClose }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const { loadResumeIntoContext } = useResume();

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF or DOCX resume.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setFileName(file.name);

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const savedResume = response?.data?.data;
      if (!savedResume?.resumeId) {
        throw new Error("Resume upload did not return a valid record");
      }

      localStorage.setItem("hirefold_active_resume_id", savedResume.resumeId);

      loadResumeIntoContext({
        ...(savedResume.structuredData || {}),
        meta: {
          ...(savedResume.structuredData?.meta || {}),
          resumeId: savedResume.resumeId,
          source: "upload",
          isEditable: false,
          atsScore: savedResume.atsScore ?? null,
        },
        ats: savedResume.ats ?? null,
      });

      onClose();
    } catch (uploadError) {
      setError(
        uploadError?.response?.data?.message ||
          uploadError?.message ||
          "Resume upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  return createPortal(
    <div className="upload-modal-overlay" onClick={onClose}>
      <div className="upload-modal" onClick={(event) => event.stopPropagation()}>
        <div className="upload-modal-header">
          <h3>Upload Resume</h3>
          <button className="close-btn" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <div className="upload-modal-body">
          <p>Upload your latest resume to analyze it and continue editing in HireFold.</p>

          <button
            className="primary-upload-btn"
            onClick={handlePickFile}
            disabled={uploading}
            type="button"
          >
            {uploading ? "Uploading..." : "Choose Resume"}
          </button>

          {fileName ? <p className="file-name">Selected: {fileName}</p> : null}
          {error ? <p className="error-message">{error}</p> : null}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            hidden
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UploadResumeModal;
