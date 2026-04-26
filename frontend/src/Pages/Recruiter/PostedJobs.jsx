import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

import { useJobsFeed } from "../../Context/JobsFeedContext";
import { useJob } from "../../Context/JobContext";

import "../../Styles/jobs.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

const PostedJobs = () => {
  const {
    recruiterJobs,
    deleteJob,
    updateStatus,
    fetchRecruiterJobs,
  } = useJobsFeed();

  const { loadJobForEdit } = useJob();
  const navigate = useNavigate();
  const { type } = useParams();

  const [expandedJobId, setExpandedJobId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRecruiterJobs();
  }, [fetchRecruiterJobs]);

  const stats = useMemo(() => {
    const open = recruiterJobs.filter((job) => (job.status || "OPEN").toUpperCase() === "OPEN").length;
    const closed = recruiterJobs.filter((job) => (job.status || "OPEN").toUpperCase() === "CLOSED").length;
    const drafts = recruiterJobs.filter((job) => (job.status || "OPEN").toUpperCase() === "DRAFT").length;
    const totalApplications = recruiterJobs.reduce((sum, job) => sum + (job.applicationsCount || 0), 0);

    return { open, closed, drafts, totalApplications };
  }, [recruiterJobs]);

  const filteredJobs = useMemo(() => {
    return recruiterJobs.filter((job) => {
      const status = (job.status || "OPEN").toUpperCase();

      let typeMatch = true;
      if (type === "past") typeMatch = status === "CLOSED";
      else if (type === "drafts") typeMatch = status === "DRAFT";
      else typeMatch = status === "OPEN";

      const searchMatch =
        !searchTerm ||
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase());

      return typeMatch && searchMatch;
    });
  }, [recruiterJobs, type, searchTerm]);

  const getSalaryDisplay = (job) => {
    if (job.salary) {
      return `$${job.salary.toLocaleString()}/year`;
    }
    if (job.salaryRange) {
      return `${job.salaryRange.min} - ${job.salaryRange.max}`;
    }
    return null;
  };

  const getStatusStyle = (status) => {
    const upperStatus = (status || "OPEN").toUpperCase();
    if (upperStatus === "OPEN") return "status-open";
    if (upperStatus === "CLOSED") return "status-closed";
    return "status-draft";
  };

  const getStatusText = (status) => {
    const upperStatus = (status || "OPEN").toUpperCase();
    if (upperStatus === "OPEN") return "Active";
    if (upperStatus === "CLOSED") return "Closed";
    return "Draft";
  };

  return (
    <main className="jobs-page">
      <div className="jobs-hero">
        <div className="jobs-hero-content">
          <span className="jobs-hero-badge"> Job Dashboard</span>
          <h1 className="jobs-hero-title">
            Manage Your <span className="gradient-text">Job Listings</span>
          </h1>
          <p className="jobs-hero-subtitle">
            Track applications, update job status, and manage all your postings from one place.
          </p>
        </div>
      </div>

      <div className="jobs-stats-grid">
        <div className="jobs-stat-card">
          <div className="jobs-stat-icon"></div>
          <div className="jobs-stat-number">{stats.open}</div>
          <div className="jobs-stat-label">Active Jobs</div>
        </div>
        <div className="jobs-stat-card">
          <div className="jobs-stat-icon"></div>
          <div className="jobs-stat-number">{stats.closed}</div>
          <div className="jobs-stat-label">Closed</div>
        </div>
        <div className="jobs-stat-card">
          <div className="jobs-stat-icon"></div>
          <div className="jobs-stat-number">{stats.drafts}</div>
          <div className="jobs-stat-label">Drafts</div>
        </div>
        <div className="jobs-stat-card">
          <div className="jobs-stat-icon"></div>
          <div className="jobs-stat-number">{stats.totalApplications}</div>
          <div className="jobs-stat-label">Total Applications</div>
        </div>
      </div>

      <div className="posted-jobs-header">
        <div className="posted-jobs-title-section">
          <h2>
            {type === "drafts"
              ? "Draft Jobs"
              : type === "past"
              ? "Past Jobs"
              : "Active Jobs"}
          </h2>
          <p>{filteredJobs.length} jobs in this category</p>
        </div>
        <div className="posted-jobs-actions">
          <input
            type="text"
            placeholder="Search jobs..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="btn-primary"
            onClick={() => navigate("/recruiter/post-job")}
          >
            Post New Job
          </button>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"></div>
          <h3 className="empty-state-title">No jobs found</h3>
          <p className="empty-state-description">
            {searchTerm
              ? "No jobs match your search criteria."
              : type === "drafts"
              ? "You haven't created any draft jobs yet."
              : type === "past"
              ? "No closed jobs to show."
              : "You haven't posted any active jobs yet."}
          </p>
          {!searchTerm && (
            <button
              className="btn-primary"
              onClick={() => navigate("/recruiter/post-job")}
            >
              Post Your First Job
            </button>
          )}
        </div>
      ) : (
        <div className="jobs-list">
          {filteredJobs.map((job, index) => {
            const id = job._id || job.id;
            const status = (job.status || "OPEN").toUpperCase();
            const companyName = job.companyName || "HireFold";
            const logoSrc = job.companyLogo
              ? job.companyLogo.startsWith("http")
                ? job.companyLogo
                : `${BACKEND_ORIGIN}${job.companyLogo}`
              : null;
            const salaryDisplay = getSalaryDisplay(job);

            return (
              <div
                key={id}
                className="job-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="job-card-header">
                  <div className="job-card-logo">
                    {logoSrc ? (
                      <img
                        src={logoSrc}
                        alt={companyName}
                        className="job-logo-img"
                      />
                    ) : (
                      <span className="job-logo-fallback">
                        {companyName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="job-header-status">
                    <span className={`status-badge ${getStatusStyle(status)}`}>
                      {getStatusText(status)}
                    </span>
                  </div>
                </div>

                <div className="job-card-content">
                  <div className="job-company">
                    {companyName}
                    <span className="job-time-ago">
                      Posted {dayjs(job.createdAt).format("DD MMM YYYY")}
                    </span>
                  </div>
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-description">
                    {job.description?.length > 120
                      ? `${job.description.substring(0, 120)}...`
                      : job.description || "No description provided"}
                  </p>

                  <div className="job-meta-tags">
                    <span className="job-tag">{job.location || "Remote"}</span>
                    <span className="job-tag">{job.employmentType || "Full-time"}</span>
                    <span className="job-tag">{job.workMode || "Flexible"}</span>
                    <span className="job-tag">{job.experienceLevel || "All Levels"}</span>
                  </div>

                  <div className="job-applications-count">
                    <span className="applications-icon">Apps</span>
                    <span className="applications-number">{job.applicationsCount || 0}</span>
                    <span className="applications-text">applications received</span>
                  </div>

                  {salaryDisplay && (
                    <div className="job-salary-section">
                      <span className="job-salary">{salaryDisplay}</span>
                      {job.salary && (
                        <span className="job-salary-period">/ year</span>
                      )}
                    </div>
                  )}
                </div>

                {expandedJobId === id && (
                  <div className="job-expanded">
                    <div className="job-details-grid">
                      <div className="job-detail-item">
                        <span className="job-detail-label">Full Description</span>
                        <span className="job-detail-value">{job.description}</span>
                      </div>
                      {Array.isArray(job.requirements) && job.requirements.length > 0 && (
                        <div className="job-detail-item">
                          <span className="job-detail-label">Requirements</span>
                          <ul className="job-detail-value">
                            {job.requirements.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {Array.isArray(job.benefits) && job.benefits.length > 0 && (
                        <div className="job-detail-item">
                          <span className="job-detail-label">Benefits</span>
                          <ul className="job-detail-value">
                            {job.benefits.map((benefit, i) => (
                              <li key={i}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="job-card-footer">
                  <div className="job-actions">
                    <button
                      className="btn-outline"
                      onClick={() =>
                        setExpandedJobId(expandedJobId === id ? null : id)
                      }
                    >
                      {expandedJobId === id ? "Hide Details" : "View Details"}
                    </button>

                    {status === "OPEN" && (
                      <>
                        <button
                          className="btn-outline"
                          onClick={() => {
                            loadJobForEdit(job);
                            navigate("/recruiter/post-job");
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="btn-outline"
                          onClick={() => updateStatus(id, "CLOSED")}
                        >
                          Close
                        </button>
                      </>
                    )}

                    <button
                      className="btn-danger"
                      onClick={() => {
                        if (window.confirm("Delete this job permanently? This action cannot be undone.")) {
                          deleteJob(id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default PostedJobs;
