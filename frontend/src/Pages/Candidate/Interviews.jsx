// CandidateInterviews.jsx - Fixed with working tabs
import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useJobsFeed } from "@/Context/JobsFeedContext";
import { useApplications } from "@/Context/ApplicationsContext";
import {
  useInterviews,
  INTERVIEW_STATUSES,
  INTERVIEW_TYPES,
} from "@/Pages/Recruiter/Interviews/InterviewsContext";

import "../../Styles/interviewsPage.css";
import "../../Styles/sectionSurface.css";

import InterviewGuidelinesImg from "../../Assets/InterviewGuidelines.png";

dayjs.extend(relativeTime);

/**
 * Candidate Interviews Page
 * -------------------------
 * Shows interviews scheduled by recruiters or system,
 * derived via ApplicationsContext (source of truth).
 */
const CandidateInterviews = () => {
  const { jobs } = useJobsFeed();
  const { applications } = useApplications();
  const { interviews } = useInterviews();
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming"); // Track active tab

  /* ================= DERIVE CANDIDATE INTERVIEWS ================= */
  const candidateInterviews = useMemo(() => {
    if (!interviews?.length) {
      return [];
    }
    return interviews;
  }, [interviews]);

  /* ================= ENRICH WITH JOB DATA ================= */
  const enrichedInterviews = useMemo(() => {
    return candidateInterviews.map((interview) => {
      const job = jobs?.find(j => j.id === interview.jobId);
      return {
        ...interview,
        role: interview.jobTitle || job?.title || "Unknown Role",
        company: job?.company || "Company",
      };
    });
  }, [candidateInterviews, jobs]);

  /* ================= SPLIT STATES ================= */
  const upcomingInterviews = enrichedInterviews.filter(
    (i) => i.status === INTERVIEW_STATUSES.SCHEDULED
  );

  const pastInterviews = enrichedInterviews.filter(
    (i) => i.status === INTERVIEW_STATUSES.COMPLETED ||
           i.status === INTERVIEW_STATUSES.CANCELLED
  );

  const getStatusConfig = (status) => {
    switch (status) {
      case INTERVIEW_STATUSES.COMPLETED:
        return { icon: "", color: "#10b981", label: "Completed" };
      case INTERVIEW_STATUSES.SCHEDULED:
        return { icon: "", color: "#f59e0b", label: "Scheduled" };
      case INTERVIEW_STATUSES.CANCELLED:
        return { icon: "", color: "#ef4444", label: "Cancelled" };
      default:
        return { icon: "", color: "#6b7280", label: "Pending" };
    }
  };

  const toggleExpand = (id) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  return (
    <main className="page candidate-interviews-page">
      {/* Hero Section - Kept as original */}
      <div className="candidate-hero">
        <div className="candidate-hero-badge">Candidate Portal</div>
        <h1 className="candidate-hero-title">
          My <span className="gradient-text">Interviews</span>
        </h1>
        <p className="candidate-hero-subtitle">
          Track and manage all your scheduled interviews in one place
        </p>
      </div>

      {/* Stats Overview - Kept as original */}
      <div className="candidate-stats-grid">
        <div className="candidate-stat-card">
          <span className="stat-icon"></span>
          <div className="stat-number">{upcomingInterviews.length}</div>
          <div className="stat-label">Upcoming</div>
        </div>
        <div className="candidate-stat-card">
          <span className="stat-icon"></span>
          <div className="stat-number">{pastInterviews.length}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="candidate-stat-card">
          <span className="stat-icon"></span>
          <div className="stat-number">
            {pastInterviews.filter(i => i.feedback).length}
          </div>
          <div className="stat-label">With Feedback</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-container-candidate">
        <button 
          className={`tab-btn-candidate ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Interviews
          {upcomingInterviews.length > 0 && (
            <span className="tab-badge-candidate">{upcomingInterviews.length}</span>
          )}
        </button>
        <button 
          className={`tab-btn-candidate ${activeTab === "past" ? "active" : ""}`}
          onClick={() => setActiveTab("past")}
        >
          Past Interviews
          {pastInterviews.length > 0 && (
            <span className="tab-badge-candidate">{pastInterviews.length}</span>
          )}
        </button>
      </div>

      {/* Upcoming Interviews Section */}
      {activeTab === "upcoming" && (
        <section className="candidate-section">
          <div className="candidate-interviews-grid">
            {upcomingInterviews.length === 0 ? (
              <div className="empty-state-card">
                <div className="empty-state-icon"></div>
                <h4>No upcoming interviews</h4>
                <p className="empty-state-text">You don't have any scheduled interviews at the moment</p>
              </div>
            ) : (
              upcomingInterviews.map((interview) => (
                <InterviewCardModern
                  key={interview.id}
                  interview={interview}
                  type="upcoming"
                  expanded={expandedCardId === interview.id}
                  onToggle={() => toggleExpand(interview.id)}
                />
              ))
            )}
          </div>
        </section>
      )}

      {/* Past Interviews Section */}
      {activeTab === "past" && (
        <section className="candidate-section">
          <div className="candidate-interviews-grid">
            {pastInterviews.length === 0 ? (
              <div className="empty-state-card">
                <div className="empty-state-icon"></div>
                <h4>No past interviews</h4>
                <p className="empty-state-text">Your completed interviews will appear here</p>
              </div>
            ) : (
              pastInterviews.map((interview) => (
                <InterviewCardModern
                  key={interview.id}
                  interview={interview}
                  type="past"
                  expanded={expandedCardId === interview.id}
                  onToggle={() => toggleExpand(interview.id)}
                />
              ))
            )}
          </div>
        </section>
      )}

      {/* Guidelines Section - Collapsible to save space */}
      <details className="guidelines-collapsible-candidate">
        <summary className="guidelines-summary-candidate">
          <span className="summary-icon"></span>
          Interview Guidelines
          <span className="summary-arrow"></span>
        </summary>
        <div className="guidelines-content-wrapper">
          <div className="guidelines-container-candidate">
            <div className="guidelines-image-wrapper">
              <img src={InterviewGuidelinesImg} alt="Interview Guidelines" />
            </div>
            <div className="guidelines-content-candidate">
              <ul className="guidelines-list-candidate">
                <li>
                  <span className="guideline-icon"></span>
                  Ensure a stable internet connection
                </li>
                <li>
                  <span className="guideline-icon"></span>
                  Join at least 10 minutes before the scheduled time
                </li>
                <li>
                  <span className="guideline-icon"></span>
                  Do not switch tabs during interviews
                </li>
                <li>
                  <span className="guideline-icon"></span>
                  All interviews are monitored for fairness
                </li>
                <li>
                  <span className="guideline-icon"></span>
                  Technical issues can be reported instantly
                </li>
              </ul>
            </div>
          </div>
        </div>
      </details>
    </main>
  );
};

// Modern Interview Card Component - Preserved original design
const InterviewCardModern = ({ interview, type, expanded, onToggle }) => {
  const { INTERVIEW_STATUSES, INTERVIEW_TYPES } = useInterviews();
  
  const isSystem = interview.type === INTERVIEW_TYPES.SYSTEM;
  const statusConfig = getStatusConfig(interview.status);
  
  const formattedDate = interview.scheduledAt 
    ? dayjs(interview.scheduledAt).format("DD MMM YYYY")
    : "TBD";
  const formattedTime = interview.scheduledAt
    ? dayjs(interview.scheduledAt).format("hh:mm A")
    : "TBD";
  const timeFromNow = interview.scheduledAt
    ? dayjs(interview.scheduledAt).fromNow()
    : "";

  return (
    <div className={`candidate-interview-card ${type} ${expanded ? "expanded" : ""}`}>
      <div className="card-accent"></div>
      
      <div className="card-header">
        <div className="card-avatar">
          <span className="avatar-text">
            {interview.candidateName?.charAt(0) || "C"}
          </span>
          {isSystem && <span className="avatar-badge"></span>}
        </div>
        
        <div className="card-info">
          <h3 className="card-title">{interview.role}</h3>
          <div className="card-meta">
            <span className="company-name">{interview.company}</span>
            <span className="meta-dot"></span>
            <span className="interview-type-badge">
              {isSystem ? "System" : "Final"} Interview
            </span>
          </div>
        </div>
        
        <div className={`status-badge-candidate ${interview.status?.toLowerCase()}`}>
          <span>{statusConfig.icon}</span>
          <span>{statusConfig.label}</span>
        </div>
      </div>

      <div className="card-details">
        <div className="schedule-info">
          <div className="schedule-item">
            <span className="schedule-icon"></span>
            <div>
              <div className="schedule-label">Date</div>
              <div className="schedule-value">{formattedDate}</div>
            </div>
          </div>
          <div className="schedule-item">
            <span className="schedule-icon"></span>
            <div>
              <div className="schedule-label">Time</div>
              <div className="schedule-value">{formattedTime}</div>
            </div>
          </div>
          {timeFromNow && (
            <div className="schedule-item">
              <span className="schedule-icon"></span>
              <div>
                <div className="schedule-label">When</div>
                <div className="schedule-value">{timeFromNow}</div>
              </div>
            </div>
          )}
        </div>

        {interview.recruiterName && (
          <div className="recruiter-info">
            <span className="recruiter-icon"></span>
            <div>
              <div className="recruiter-label">Interviewer</div>
              <div className="recruiter-name">{interview.recruiterName}</div>
            </div>
          </div>
        )}
      </div>

      {expanded && interview.feedback && (
        <div className="expanded-feedback">
          <div className="feedback-header">
            <span className="feedback-icon"></span>
            <span>Interview Feedback</span>
          </div>
          <p className="feedback-text">{interview.feedback}</p>
          {interview.rating && (
            <div className="rating-section">
              <span className="rating-label">Rating:</span>
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < interview.rating ? "star filled" : "star"}>
                    
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card-footer">
        <button className="expand-btn" onClick={onToggle}>
          <span>{expanded ? "" : ""}</span>
          <span>{expanded ? "Show less" : "Show details"}</span>
        </button>
        
        {type === "upcoming" && interview.status === INTERVIEW_STATUSES.SCHEDULED && (
          <button className="join-btn">
            <span></span>
            Join Interview
          </button>
        )}
        
        {type === "past" && interview.feedback && (
          <button className="feedback-btn">
            <span></span>
            View Feedback
          </button>
        )}
      </div>
    </div>
  );
};

const getStatusConfig = (status) => {
  switch (status) {
    case "COMPLETED":
      return { icon: "", color: "#10b981", label: "Completed" };
    case "SCHEDULED":
      return { icon: "", color: "#f59e0b", label: "Scheduled" };
    case "CANCELLED":
      return { icon: "", color: "#ef4444", label: "Cancelled" };
    default:
      return { icon: "", color: "#6b7280", label: "Pending" };
  }
};

export default CandidateInterviews;






