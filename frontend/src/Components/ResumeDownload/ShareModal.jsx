import React from "react";
import {
  FaLink,
  FaEnvelope,
  FaLinkedin,
  FaWhatsapp,
  FaFilePdf
} from "react-icons/fa";

const ShareModal = ({
  onClose,
  onCopyLink,
  onEmail,
  onLinkedIn,
  onWhatsApp,
  onDownload,
  copied
}) => {
  return (
    <>
      <div className="modal-header">
        <span className="modal-title">Share Resume</span>
        <button className="modal-close" onClick={onClose} aria-label="Close share dialog"></button>
      </div>
      <div className="modal-body">
        <div className="modal-option" onClick={onCopyLink} tabIndex={0} role="button" aria-label="Copy public resume link">
          <FaLink style={{ marginRight: 10 }} />
          <span>{copied ? "Copied!" : "Copy public resume link"}</span>
        </div>
        <div className="modal-option" onClick={onEmail} tabIndex={0} role="button" aria-label="Email resume">
          <FaEnvelope style={{ marginRight: 10 }} /> Email resume
        </div>
        <div className="modal-option" onClick={onLinkedIn} tabIndex={0} role="button" aria-label="Share on LinkedIn">
          <FaLinkedin style={{ marginRight: 10 }} /> Share on LinkedIn
        </div>
        <div className="modal-option" onClick={onWhatsApp} tabIndex={0} role="button" aria-label="Share via WhatsApp">
          <FaWhatsapp style={{ marginRight: 10 }} /> Share via WhatsApp
        </div>
        <div className="modal-option" onClick={onDownload} tabIndex={0} role="button" aria-label="Download PDF">
          <FaFilePdf style={{ marginRight: 10 }} /> Download PDF
        </div>
      </div>
    </>
  );
};

export default ShareModal;

