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
    if (job.compensation?.showPublicly === false) return null;
    if (job.salary) return `$${job.salary.toLocaleString()}/year`;
    if (job.salaryRange?.min || job.salaryRange?.max) {
      return `${job.salaryRange.min ?? ""}${job.salaryRange.max ? ` - ${job.salaryRange.max}` : ""}`;
    }
    if (job.compensation?.min || job.compensation?.max) {
      return `${job.compensation.currency || "USD"} ${job.compensation.min ?? ""}${
        job.compensation?.max ? ` - ${job.compensation.max}` : ""
      }`;
    }
    return null;
  };

  const getStatusClass = (status) => {
    const upperStatus = (status || "OPEN").toUpperCase();
    if (upperStatus === "CLOSED") return "closed";
    if (upperStatus === "DRAFT") return "featured";
    return "open";
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
        <div className="jobs-hero-left">
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
          <div className="jobs-stat-label">Total Applicants</div>
        </div>
      </div>

      <div className="jobs-filters-container">
        <div className="filters-header">
          <div className="filters-title-section">
            <h2>
              {type === "drafts"
                ? "Draft Jobs"
                : type === "past"
                ? "Past Jobs"
                : "Active Jobs"}
            </h2>
            <p>{filteredJobs.length} jobs in this category</p>
          </div>
          <div className="filters-actions">
            <button
              className="btn-primary"
              onClick={() => navigate("/recruiter/post-job")}
            >
              Post New Job
            </button>
          </div>
        </div>

        <div className="filters-grid expanded">
          <div className="filter-group">
            <label>Search Jobs</label>
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
            const companyName = job.companyName || "";
            const logoSrc = job.companyLogo
              ? job.companyLogo.startsWith("http")
                ? job.companyLogo
                : `${BACKEND_ORIGIN}${job.companyLogo}`
              : null;
            const salaryDisplay = getSalaryDisplay(job);
            const metaPills = [
              job.location,
              job.employmentType,
              job.workMode,
              job.experienceLevel,
              `${job.applicationsCount || 0} applicants`,
            ].filter(Boolean);
            const detailItems = [
              {
                label: "Applicants",
                value: String(job.applicationsCount || 0),
              },
              {
                label: "Department",
                value: job.department || "",
              },
              {
                label: "Preferred Skills",
                value: Array.isArray(job.preferredSkills) ? job.preferredSkills.join(", ") : "",
              },
              {
                label: "Apply By",
                value: job.applicationLastDate
                  ? new Date(job.applicationLastDate).toLocaleDateString()
                  : "",
              },
            ].filter((item) => item.value);

            return (
              <div key={id} className="job-card" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="job-card-accent" />

                <div className="job-card-body">
                  <span className={`job-card-status ${getStatusClass(status)}`}>
                    {getStatusText(status)}
                  </span>

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
                          {(companyName || job.title || "?").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="job-card-title-block">
                      {companyName && <div className="job-company-name">{companyName}</div>}
                      <h3 className="job-title">{job.title}</h3>
                    </div>
                  </div>

                  {metaPills.length > 0 && (
                    <div className="job-meta-pills">
                      {metaPills.map((pill) => (
                        <span key={pill} className="meta-pill">{pill}</span>
                      ))}
                    </div>
                  )}

                  <div className="job-description-preview">
                    {job.description?.length > 120
                      ? `${job.description.substring(0, 120)}...`
                      : job.description || "No description provided"}
                  </div>

                  {salaryDisplay && (
                    <div className="job-salary-banner">
                      <span className="salary-banner-label">Salary</span>
                      <span className="salary-banner-amount">{salaryDisplay}</span>
                    </div>
                  )}

                  <div className="job-card-divider" />

                  <div className="job-card-footer">
                    <div className="job-card-footer-left">
                      <span className="job-time-ago">
                        Posted {dayjs(job.createdAt).format("DD MMM YYYY")}
                      </span>
                    </div>
                    <div className="job-card-actions">
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
                        className="btn-ghost"
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

                <div className={`job-card-expanded ${expandedJobId === id ? "open" : ""}`}>
                  <div className="job-card-expanded-inner">
                    <div>
                      <div className="expanded-section-label">Full Description</div>
                      <div className="expanded-section-text">
                        {job.description}
                      </div>
                    </div>

                    {detailItems.length > 0 && (
                      <div className="job-details-grid">
                        {detailItems.map((item) => (
                          <div key={item.label} className="job-detail-item">
                            <span className="job-detail-label">{item.label}</span>
                            <span className="job-detail-value">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {job.hiringPreferences && (
                      <div>
                        <div className="expanded-section-label">Hiring Preferences</div>
                        <div className="expanded-section-text">{job.hiringPreferences}</div>
                      </div>
                    )}

                    {Array.isArray(job.benefits) && job.benefits.length > 0 && (
                      <div>
                        <div className="expanded-section-label">Benefits</div>
                        <div className="benefits-list">
                          {job.benefits.map((benefit, i) => (
                            <span key={i} className="benefit-tag">{benefit}</span>
                          ))}
                        </div>
                      </div>
                    )}
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
