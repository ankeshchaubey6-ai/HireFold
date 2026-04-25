import React from "react";
import { useApplications } from "@/Context/ApplicationsContext";

/**
 * InterviewEvaluation
 * -------------------
 * This component handles the OLD flow:
 * - System / partner interview already conducted
 * - Recruiter approves or rejects based on interviewId
 *
 * It is intentionally simple and isolated.
 */
const InterviewEvaluation = ({ interviewState }) => {
  const { updateApplicationStatus } = useApplications();

  if (!interviewState?.interviewId) {
    return <p>No interview selected.</p>;
  }

  const { interviewId, candidateId } = interviewState;

  return (
    <div className="section-surface">
      <h2>Interview Evaluation</h2>

      <p style={{ marginBottom: 16 }}>
        Interview ID: <strong>{interviewId}</strong>
      </p>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          className="btn-primary hf-premium"
          onClick={() =>
            updateApplicationStatus(candidateId, "Offer")
          }
        >
          Approve
        </button>

        <button
          className="btn-outline hf-premium"
          onClick={() =>
            updateApplicationStatus(candidateId, "Rejected")
          }
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default InterviewEvaluation;
