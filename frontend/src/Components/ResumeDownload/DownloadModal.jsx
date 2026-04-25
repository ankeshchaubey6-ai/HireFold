import React from "react";

const DownloadModal = ({ onClose, onSelect, loading }) => {
  return (
    <>
      <div className="modal-header">
        <span className="modal-title">Download Resume</span>
        <button className="modal-close" onClick={onClose} aria-label="Close download dialog"></button>
      </div>
      <div className="modal-body">
        <div
          className="modal-option"
          onClick={() => onSelect("pdf")}
          tabIndex={0}
          role="button"
          aria-label="Download as PDF"
          style={{ cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
        >
          <span><strong>PDF</strong></span>
          <span>{loading ? "Preparing..." : "Recommended"}</span>
        </div>
        <div
          className="modal-option"
          onClick={() => onSelect("docx")}
          tabIndex={0}
          role="button"
          aria-label="Download as DOCX"
          style={{ cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
        >
          <span><strong>DOCX</strong></span>
          <span>{loading ? "Preparing..." : "Editable"}</span>
        </div>
        <button
          onClick={onClose}
          className="btn-outline"
          style={{ marginTop: "12px", width: "100%" }}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default DownloadModal;

