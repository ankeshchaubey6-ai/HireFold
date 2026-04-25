import React, { useEffect, useMemo, useState } from "react";
import { useInterviews } from "./InterviewsContext";
import "./scheduleInterviewModal.css";

const ScheduleInterviewModal = ({
  job,
  applications = [],
  preselectedCandidateId = "",
  onClose,
}) => {
  const { scheduleInterview } = useInterviews();
  const [candidateId, setCandidateId] = useState(preselectedCandidateId);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const eligibleApplications = useMemo(
    () =>
      applications.filter(
        (application) =>
          application?.candidateId &&
          application?.status !== "Rejected" &&
          application?.status !== "Offer"
      ),
    [applications]
  );

  useEffect(() => {
    if (preselectedCandidateId) {
      setCandidateId(preselectedCandidateId);
      return;
    }

    if (!candidateId && eligibleApplications.length > 0) {
      setCandidateId(eligibleApplications[0].candidateId);
    }
  }, [candidateId, eligibleApplications, preselectedCandidateId]);

  const selectedApplication = useMemo(
    () =>
      eligibleApplications.find(
        (application) => String(application.candidateId) === String(candidateId)
      ) || null,
    [candidateId, eligibleApplications]
  );

  const handleSchedule = async () => {
    if (!selectedApplication?.id || !date || !time) {
      return;
    }

    try {
      setSubmitting(true);

      const scheduledAt = new Date(`${date}T${time}`).toISOString();

      await scheduleInterview({
        applicationId: selectedApplication.id,
        scheduledAt,
        jobId: job?.id || job?._id || null,
      });

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="hf-modal-overlay" onClick={onClose}>
      <div className="hf-modal" onClick={(event) => event.stopPropagation()}>
        <div className="hf-modal-header">
          <h3>Schedule Interview</h3>
          <p>{job?.title || "Selected role"}</p>
        </div>

        <div className="hf-modal-body">
          <div className="hf-modal-section">
            <h4>Candidate</h4>
            <select
              value={candidateId}
              onChange={(event) => setCandidateId(event.target.value)}
            >
              <option value="">Select candidate</option>
              {eligibleApplications.map((application) => (
                <option key={application.id} value={application.candidateId}>
                  {application.candidateName}
                </option>
              ))}
            </select>
          </div>

          <div className="hf-modal-section">
            <h4>Date</h4>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <div className="hf-modal-section">
            <h4>Time</h4>
            <input
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </div>
        </div>

        <div className="hf-modal-footer">
          <button className="hf-btn hf-btn-outline" onClick={onClose}>
            Cancel
          </button>

          <button
            className="hf-btn hf-btn-primary hf-premium"
            disabled={!candidateId || !date || !time || submitting}
            onClick={handleSchedule}
          >
            {submitting ? "Scheduling..." : "Schedule Interview"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
