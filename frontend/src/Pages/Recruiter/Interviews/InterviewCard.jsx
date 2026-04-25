// InterviewCard.jsx - Optimized with smaller size and fixed overlap
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useInterviews } from "./InterviewsContext";
import "./interviews.page.css";

dayjs.extend(relativeTime);

const InterviewCard = ({ interview, readOnly = false }) => {
  const { INTERVIEW_STATUSES, INTERVIEW_TYPES } = useInterviews();

  if (!interview) return null;

  const {
    id,
    type,
    status,
    scheduledAt,
    recruiterName,
    mode,
    candidateName,
    jobTitle,
  } = interview;

  const isCompleted = status === INTERVIEW_STATUSES.COMPLETED;
  const isScheduled = status === INTERVIEW_STATUSES.SCHEDULED;
  const isSystem = type === INTERVIEW_TYPES.SYSTEM;

  const getStatusClass = () => {
    switch (status) {
      case INTERVIEW_STATUSES.COMPLETED:
        return "status-badge completed";
      case INTERVIEW_STATUSES.SCHEDULED:
        return "status-badge scheduled";
      case INTERVIEW_STATUSES.CANCELLED:
        return "status-badge cancelled";
      default:
        return "status-badge";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case INTERVIEW_STATUSES.COMPLETED:
        return "";
      case INTERVIEW_STATUSES.SCHEDULED:
        return "";
      case INTERVIEW_STATUSES.CANCELLED:
        return "";
      default:
        return "";
    }
  };

  return (
    <div className={`interview-card-compact ${isSystem ? "system" : "final"}`}>
      <div className="card-accent-bar"></div>

      {}
      {jobTitle && (
        <div className="card-job">
          <span className="job-icon"></span>
          <span className="job-text">{jobTitle}</span>
        </div>
      )}

      {/* Schedule Info - Fixed overlap */}
      <div className="card-schedule">
        {scheduledAt ? (
          <>
            <div className="schedule-date">
              <span className="schedule-icon"></span>
              <span className="schedule-text">
                {dayjs(scheduledAt).format("DD MMM YYYY")}
              </span>
            </div>
            <div className="schedule-time">
              <span className="schedule-icon"></span>
              <span className="schedule-text">
                {dayjs(scheduledAt).format("hh:mm A")}
              </span>
            </div>
            <div className="schedule-relative">
              <span className="schedule-icon"></span>
              <span className="schedule-text">
                {dayjs(scheduledAt).fromNow()}
              </span>
            </div>
          </>
        ) : (
          <div className="schedule-unscheduled">
            <span className="schedule-icon"></span>
            <span className="schedule-text">Time not scheduled</span>
          </div>
        )}
      </div>

      {/* Recruiter Info */}
      {recruiterName && (
        <div className="card-recruiter">
          <span className="recruiter-icon"></span>
          <span className="recruiter-name">{recruiterName}</span>
        </div>
      )}

      {/* Footer Actions */}
      {!readOnly && (
        <div className="card-footer-actions">
          {isScheduled && (
            <button className="btn-sm btn-outline-sm">
              <span></span> Reschedule
            </button>
          )}
          <button className="btn-sm btn-primary-sm">
            <span></span> Details
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewCard;
