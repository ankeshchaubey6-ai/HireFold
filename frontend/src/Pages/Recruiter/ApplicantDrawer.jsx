import React from "react";
import dayjs from "dayjs";
import { useApplications } from "@/Context/ApplicationsContext";
import "@/Styles/applicantDrawer.css";

const ApplicantDrawer = ({ applicant, onClose, onSchedule }) => {
  const { updateApplicationStatus } = useApplications();

  if (!applicant) {
    return null;
  }

  const isAssisted = applicant.hiringModel === "ASSISTED";

  const handleStatusUpdate = async (status) => {
    await updateApplicationStatus(applicant.id, status);
    onClose();
  };

  return (
    <div className="applicant-drawer-overlay" onClick={onClose}>
      <aside className="applicant-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <h3>{applicant.candidateName}</h3>
          <button className="drawer-close" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <div className="drawer-content">
          <div className="drawer-section">
            <h4>Application Details</h4>
            <p>{applicant.candidateEmail || "No email provided"}</p>
            <p>{applicant.jobTitle || "Untitled Job"}</p>
            <p>Status: {applicant.status || "Applied"}</p>
            <p>
              Last updated:{" "}
              {applicant.updatedAt ? dayjs(applicant.updatedAt).format("DD MMM YYYY, hh:mm A") : "Not available"}
            </p>
          </div>

          {isAssisted ? (
            <div className="drawer-section">
              <h4>ATS Summary</h4>
              <p>Score: {applicant.ats?.score ?? applicant.atsScore ?? "Not available"}</p>
            </div>
          ) : (
            <div className="drawer-section">
              <h4>Recruiter Actions</h4>
              <div className="status-actions">
                <button className="status-btn hf-premium" onClick={() => handleStatusUpdate("Screening")} type="button">
                  Shortlist
                </button>
                <button className="status-btn hf-premium" onClick={() => onSchedule?.(applicant)} type="button">
                  Schedule Interview
                </button>
                <button className="status-btn danger" onClick={() => handleStatusUpdate("Rejected")} type="button">
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default ApplicantDrawer;
