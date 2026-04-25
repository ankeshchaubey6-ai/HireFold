import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import ScheduleInterviewModal from "@/Pages/Recruiter/Interviews/ScheduleInterviewModal";
import { useJobsFeed } from "@/Context/JobsFeedContext";
import { useApplications } from "@/Context/ApplicationsContext";

import ApplicantDrawer from "./ApplicantDrawer";
import VirtualList from "@/Components/Common/VirtualList";

import "@/Styles/sectionSurface.css";
import "@/Styles/recruiterApplications.css";

const Applicants = () => {
  const navigate = useNavigate();

  /* ================= CONTEXT ================= */
  const { jobs = [] } = useJobsFeed();
  const {
    applications = [],
    fetchApplicantsForJobs,
    loading,
  } = useApplications();

  /* ================= STATE ================= */
  const [activeApplicant, setActiveApplicant] = useState(null);
  const [scheduleContext, setScheduleContext] = useState(null);

  /* ================= FETCH REAL DB APPLICANTS ================= */
  useEffect(() => {
    if (jobs && jobs.length > 0) {
      fetchApplicantsForJobs(jobs);
    }
  }, [jobs, fetchApplicantsForJobs]);

  /* ================= FILTER STATE ================= */
  const [modelView, setModelView] = useState("ASSISTED");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [atsFilter, setAtsFilter] = useState("");
  const [recencyFilter, setRecencyFilter] = useState("");

  /* ================= FILTER LOGIC ================= */
  const filteredApplicants = useMemo(() => {
    const now = Date.now();

    return applications.filter((app) => {
      if (!app) return false;

      const job = jobs.find(
        (j) => String(j._id || j.id) === String(app.jobId)
      );

      const appModel = app.hiringModel || job?.hiringModel || "SELF_MANAGED";

      if (appModel !== modelView) return false;

      if (selectedJobId && String(app.jobId) !== String(selectedJobId))
        return false;

      if (statusFilter && app.status !== statusFilter) return false;

      if (modelView === "ASSISTED" && atsFilter) {
        const score = app.ats?.score;
        if (score == null) return false;

        if (atsFilter === "HIGH" && score < 75) return false;
        if (atsFilter === "MID" && (score < 60 || score >= 75)) return false;
        if (atsFilter === "LOW" && score >= 60) return false;
      }

      if (recencyFilter) {
        if (!app.updatedAt) return false;

        const days = recencyFilter === "7" ? 7 : recencyFilter === "14" ? 14 : 30;

        if (now - new Date(app.updatedAt).getTime() > days * 86400000)
          return false;
      }

      return true;
    });
  }, [applications, jobs, modelView, selectedJobId, statusFilter, atsFilter, recencyFilter]);

  /* ================= ROW RENDER ================= */
  const getMatchColor = (score) => {
    if (score >= 75) return "linear-gradient(90deg, #10b981, #059669)";
    if (score >= 60) return "linear-gradient(90deg, #f59e0b, #d97706)";
    return "linear-gradient(90deg, #ef4444, #dc2626)";
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case "Applied": return "status-badge applied";
      case "Screening": return "status-badge screening";
      case "Interview": return "status-badge interview";
      case "Offer": return "status-badge offer";
      case "Rejected": return "status-badge rejected";
      default: return "status-badge";
    }
  };

  const renderAssistedRow = useCallback(
    (app) => (
      <div 
        key={app.id} 
        className="applicant-row"
        onClick={() => setActiveApplicant(app)}
      >
        {/* Candidate */}
        <div className="applicant-cell candidate-cell">
          <div className="candidate-avatar">
            {app.candidateName?.charAt(0) || "?"}
          </div>
          <div className="candidate-info">
            <span className="candidate-name">{app.candidateName || ""}</span>
            <span className="candidate-email">{app.candidateEmail || ""}</span>
          </div>
        </div>
        
        {/* Job */}
        <div className="applicant-cell job-cell">
          <span className="job-title">{app.jobTitle || ""}</span>
          {app.department && (
            <span className="job-department">{app.department}</span>
          )}
        </div>

        {/* Match */}
        <div className="applicant-cell match-cell">
          <div className="match-indicator">
            <div className="match-bar-container">
              <div 
                className="match-bar" 
                style={{ 
                  width: `${app.ats?.score || 0}%`,
                  background: getMatchColor(app.ats?.score || 0)
                }}
              />
            </div>
            <span className="match-percent">
              {app.ats?.score != null ? `${app.ats.score}%` : ""}
            </span>
          </div>
        </div>

        {/* Confidence */}
        <div className="applicant-cell confidence-cell">
          <span className={`confidence-badge ${app.ats?.score >= 75 ? "high" : app.ats?.score >= 60 ? "mid" : "low"}`}>
            {app.ats?.score >= 75 ? "Strong" : app.ats?.score >= 60 ? "Moderate" : "Low"}
          </span>
        </div>

        {/* Status */}
        <div className="applicant-cell status-cell">
          <span className={getStatusBadgeClass(app.status)}>
            {app.status || "Applied"}
          </span>
        </div>

        {/* Actions */}
        <div className="applicant-cell action-cell">
          <button
            className="action-btn"
            onClick={(e) => {
              e.stopPropagation();
              setActiveApplicant(app);
            }}
            title="View Intelligence"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          <button
            className="action-btn schedule"
            onClick={(e) => {
              e.stopPropagation();
              setScheduleContext({
                applicant: app,
                jobId: app.jobId,
                hiringModel: app.hiringModel,
              });
            }}
            title="Schedule Interview"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </button>
        </div>
      </div>
    ),
    []
  );

  if (loading) {
    return (
      <div className="applicants-loading">
        <div className="loading-spinner" />
        <p>Loading applicants...</p>
      </div>
    );
  }

  return (
    <div className="applicants-container">
      {/* ================= HEADER ================= */}
      <div className="applicants-header">
        <div className="applicants-header-left">
          <div className="header-badge">Candidate Management</div>
          <h1 className="header-title">
            Applicants <span className="gradient-text">Pipeline</span>
          </h1>
          <p className="header-subtitle">
            {modelView === "ASSISTED"
              ? "AI-ranked candidates with intelligent screening and match scores"
              : "Manually evaluate and progress candidates through your hiring pipeline"}
          </p>
        </div>

        <div className="applicants-header-right">
          <div className="hiring-model-toggle">
            <button
              className={`toggle-btn ${modelView === "ASSISTED" ? "active assisted" : ""}`}
              onClick={() => setModelView("ASSISTED")}
            >
              <span className="toggle-icon"></span>
              Assisted
            </button>
            <button
              className={`toggle-btn ${modelView === "SELF_MANAGED" ? "active" : ""}`}
              onClick={() => setModelView("SELF_MANAGED")}
            >
              <span className="toggle-icon"></span>
              Self Managed
            </button>
          </div>
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="applicants-filters">
        <div className="filters-grid">
          <select
            className="filter-select"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
          >
            <option value="">All Jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title || "Untitled Job"}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Screening">Screening</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>

          {modelView === "ASSISTED" && (
            <select
              className="filter-select"
              value={atsFilter}
              onChange={(e) => setAtsFilter(e.target.value)}
            >
              <option value="">All Match Levels</option>
              <option value="HIGH">High Match (75%+)</option>
              <option value="MID">Mid Match (6074%)</option>
              <option value="LOW">Low Match (&lt;60%)</option>
            </select>
          )}

          <select
            className="filter-select"
            value={recencyFilter}
            onChange={(e) => setRecencyFilter(e.target.value)}
          >
            <option value="">Any Time</option>
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
          </select>
        </div>

        {modelView === "ASSISTED" && (
          <button
            className="ai-shortlist-btn"
            onClick={() => navigate("/recruiter/ai-shortlisting")}
          >
            <span className="ai-icon"></span>
            AI Shortlist Resumes
          </button>
        )}
      </div>

      {/* ================= TABLE ================= */}
      <div className="applicants-table-wrapper">
        <div className="applicants-table-header">
          <div className="header-cell">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Candidate
          </div>
          <div className="header-cell">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            Job
          </div>
          <div className="header-cell">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12 L7 12 L10 7 L14 17 L17 12 L22 12"/>
            </svg>
            Match %
          </div>
          <div className="header-cell">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2 L15 8 L22 9 L17 14 L18 21 L12 17 L6 21 L7 14 L2 9 L9 8 Z"/>
            </svg>
            Confidence
          </div>
          <div className="header-cell">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4l3 3"/>
            </svg>
            Status
          </div>
          <div className="header-cell">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Actions
          </div>
        </div>

        <div className="applicants-table-body">
          {filteredApplicants.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"></div>
              <h3>No applicants found</h3>
              <p>Try adjusting your filters or check back later</p>
            </div>
          ) : (
            <VirtualList
              items={filteredApplicants}
              itemHeight={80}
              overscan={5}
              renderItem={renderAssistedRow}
            />
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}
      {activeApplicant && (
        <ApplicantDrawer
          applicant={activeApplicant}
          onClose={() => setActiveApplicant(null)}
          onSchedule={(applicant) => {
            setActiveApplicant(null);
            setScheduleContext({
              applicant,
              jobId: applicant.jobId,
              hiringModel: applicant.hiringModel,
            });
          }}
        />
      )}

      {scheduleContext && (
        <ScheduleInterviewModal
          job={{
            id: scheduleContext.jobId,
            hiringModel: scheduleContext.hiringModel,
          }}
          applications={applications.filter(
            (a) => String(a.jobId) === String(scheduleContext.jobId)
          )}
          preselectedCandidateId={scheduleContext.applicant.candidateId}
          onClose={() => setScheduleContext(null)}
        />
      )}
    </div>
  );
};

export default Applicants;
