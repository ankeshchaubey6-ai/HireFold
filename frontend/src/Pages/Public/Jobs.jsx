// =====================================================
// PUBLIC JOBS  ENHANCED PREMIUM VERSION
// =====================================================

import React, { useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useJobsFeed } from "../../Context/JobsFeedContext";

import "../../Styles/jobs.css";

const PUBLIC_JOBS_LIMIT = 6;

const PublicJobs = () => {
  const { jobs } = useJobsFeed();

  const [expandedJobId, setExpandedJobId] = useState(null);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    experience: "",
    employmentType: "",
    workMode: "",
    skills: "",
    salaryRange: ""
  });

  const cardRefs = useRef({});

  const handleMouseMove = (e, id) => {
    const card = cardRefs.current[id];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  };

  /* ================= STATS ================= */
  const stats = useMemo(() => ({
    totalJobs: jobs.length,
    featuredJobs: jobs.filter(j => j.featured).length,
    remoteJobs: jobs.filter(j => j.workMode === "Remote").length,
    newToday: jobs.filter(j => {
      const posted = new Date(j.createdAt);
      const now = new Date();
      const diffDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
      return diffDays < 1;
    }).length
  }), [jobs]);

  /* ================= FILTER ================= */
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const skillsMatch =
        !filters.skills ||
        job.skills?.some((s) =>
          s.toLowerCase().includes(filters.skills.toLowerCase())
        );

      const salaryMatch = !filters.salaryRange || (() => {
        const salary = job.salary || 0;
        if (filters.salaryRange === "0-50k") return salary < 50000;
        if (filters.salaryRange === "50k-100k") return salary >= 50000 && salary <= 100000;
        if (filters.salaryRange === "100k-150k") return salary > 100000 && salary <= 150000;
        if (filters.salaryRange === "150k+") return salary > 150000;
        return true;
      })();

      return (
        (!filters.search ||
          job.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
          job.companyName?.toLowerCase().includes(filters.search.toLowerCase())) &&
        (!filters.location ||
          job.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
        (!filters.experience ||
          job.experienceLevel === filters.experience) &&
        (!filters.employmentType ||
          job.employmentType === filters.employmentType) &&
        (!filters.workMode || job.workMode === filters.workMode) &&
        skillsMatch &&
        salaryMatch
      );
    });
  }, [jobs, filters]);

  const visibleJobs = filteredJobs.slice(0, PUBLIC_JOBS_LIMIT);

  /* ================= GET SALARY DISPLAY - REMOVED COMPETITIVE LOGIC ================= */
  const getSalaryDisplay = (job) => {
    if (job.salary) {
      return `$${job.salary.toLocaleString()}/year`;
    }
    if (job.salaryRange) {
      return `${job.salaryRange.min} - ${job.salaryRange.max}`;
    }
    // Return null to hide salary section when no salary data
    return null;
  };

  /* ================= GET TIME AGO ================= */
  const getTimeAgo = (date) => {
    if (!date) return "Recently";
    const now = new Date();
    const posted = new Date(date);
    const diffDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  /* ================= RESET FILTERS ================= */
  const resetFilters = () => {
    setFilters({
      search: "",
      location: "",
      experience: "",
      employmentType: "",
      workMode: "",
      skills: "",
      salaryRange: ""
    });
  };

  return (
    <main className="jobs-page">
      {/* ================= HERO SECTION ================= */}
      <div className="jobs-hero">
        <div className="jobs-hero-content">
          <span className="jobs-hero-badge"> Explore Opportunities</span>
          <h1 className="jobs-hero-title">
            Discover Your <span className="gradient-text">Next Career</span> Move
          </h1>
          <p className="jobs-hero-subtitle">
            Browse thousands of jobs from top companies. Find the perfect role that matches your skills and ambitions.
          </p>
        </div>
      </div>

      {/* ================= STATS SECTION ================= */}
      <div className="jobs-stats-grid">
        <div className="jobs-stat-card">
          <div className="jobs-stat-icon"></div>
          <div className="jobs-stat-number">{stats.totalJobs}</div>
          <div className="jobs-stat-label">Total Jobs</div>
        </div>
        <div className="jobs-stat-card">
          <div className="jobs-stat-icon"></div>
          <div className="jobs-stat-number">{stats.featuredJobs}</div>
          <div className="jobs-stat-label">Featured</div>
        </div>
        <div className="jobs-stat-card">
          <div className="jobs-stat-icon"></div>
          <div className="jobs-stat-number">{stats.remoteJobs}</div>
          <div className="jobs-stat-label">Remote</div>
        </div>
        <div className="jobs-stat-card">
          <div className="jobs-stat-icon"></div>
          <div className="jobs-stat-number">{stats.newToday}</div>
          <div className="jobs-stat-label">New Today</div>
        </div>
      </div>

      {/* ================= FILTERS SECTION ================= */}
      <div className="jobs-filters-container">
        <div className="filters-header">
          <div className="filters-title-section">
            <h2>
              Find Your <span>Perfect Match</span>
            </h2>
            <p>{filteredJobs.length} jobs available</p>
          </div>
          <div className="filters-actions">
            <button
              className="filters-toggle-btn"
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            >
              {isFiltersExpanded ? " Simple Filters" : " Advanced Filters"}
            </button>
            <Link to="/login/candidate" className="btn-signup">
              Sign in to Apply 
            </Link>
          </div>
        </div>

        <div className={`filters-grid ${isFiltersExpanded ? "expanded" : ""}`}>
          <div className="filter-group">
            <label> Job Title / Company</label>
            <input
              placeholder="e.g. Software Engineer, Google"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label> Location</label>
            <input
              placeholder="City, country or remote"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label> Experience Level</label>
            <select
              value={filters.experience}
              onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
            >
              <option value="">All Levels</option>
              <option value="Entry">Entry Level</option>
              <option value="Mid">Mid Level</option>
              <option value="Senior">Senior Level</option>
              <option value="Lead">Lead / Manager</option>
            </select>
          </div>

          <div className="filter-group">
            <label> Employment Type</label>
            <select
              value={filters.employmentType}
              onChange={(e) => setFilters({ ...filters, employmentType: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>

          <div className="filter-group">
            <label> Work Mode</label>
            <select
              value={filters.workMode}
              onChange={(e) => setFilters({ ...filters, workMode: e.target.value })}
            >
              <option value="">All Modes</option>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div className="filter-group">
            <label> Skills</label>
            <input
              placeholder="React, Python, AWS..."
              value={filters.skills}
              onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label> Salary Range</label>
            <select
              value={filters.salaryRange}
              onChange={(e) => setFilters({ ...filters, salaryRange: e.target.value })}
            >
              <option value="">Any Salary</option>
              <option value="0-50k">$0 - $50,000</option>
              <option value="50k-100k">$50,000 - $100,000</option>
              <option value="100k-150k">$100,000 - $150,000</option>
              <option value="150k+">$150,000+</option>
            </select>
          </div>

          <div className="filter-actions">
            <button className="btn-reset-filters" onClick={resetFilters}>
              Reset All
            </button>
          </div>
        </div>
      </div>

      {/* ================= JOB LIST ================= */}
      {visibleJobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"></div>
          <h3 className="empty-state-title">No jobs found</h3>
          <p className="empty-state-description">
            Try adjusting your filters or search terms to find more opportunities.
          </p>
          <button className="btn-primary" onClick={resetFilters}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="jobs-list">
          {visibleJobs.map((job, index) => {
            const id = job._id || job.id;
            const companyName = job.companyName || "Company";
            const logoSrc = job.companyLogo
              ? job.companyLogo.startsWith("http")
                ? job.companyLogo
                : `http://localhost:5000${job.companyLogo}`
              : null;
            const salaryDisplay = getSalaryDisplay(job);

            return (
              <div
                key={id}
                className="job-card"
                ref={(el) => (cardRefs.current[id] = el)}
                onMouseMove={(e) => handleMouseMove(e, id)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Premium Corner Badge */}
                {job.featured && (
                  <div className="job-card-featured-badge">Featured</div>
                )}
                
                <div className="job-card-header">
                  {/* LOGO */}
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

                  {/* STATUS BADGE */}
                  <div className="job-header-status">
                    <span className={`status-badge ${job.status || "Published"}`}>
                      {job.status === "Closed" ? "Closed" : "Open"}
                    </span>
                  </div>
                </div>

                <div className="job-card-content">
                  <div className="job-company">
                    {companyName}
                    <span className="job-time-ago">{getTimeAgo(job.createdAt)}</span>
                  </div>
                  <h3 className="job-title">
                    {job.title}
                  </h3>
                  <p className="job-description">
                    {job.description?.length > 120
                      ? `${job.description.substring(0, 120)}...`
                      : job.description || "No description available"}
                  </p>

                  {/* TAGS */}
                  <div className="job-meta-tags">
                    <span className="job-tag"> {job.location || "Remote"}</span>
                    <span className="job-tag"> {job.employmentType || "Full-time"}</span>
                    <span className="job-tag"> {job.workMode || "Flexible"}</span>
                    <span className="job-tag"> {job.experienceLevel || "All Levels"}</span>
                  </div>

                  {/* SKILLS */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="job-skills">
                      {job.skills.slice(0, 4).map((skill, i) => (
                        <span key={i} className="job-skill-tag">
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="job-skill-tag-more">+{job.skills.length - 4}</span>
                      )}
                    </div>
                  )}

                  {/* SALARY SECTION - Only show if salary data exists */}
                  {salaryDisplay && (
                    <div className="job-salary-section">
                      <span className="job-salary">{salaryDisplay}</span>
                      {job.salary && (
                        <span className="job-salary-period">/ year</span>
                      )}
                    </div>
                  )}
                </div>

                {/* EXPANDED DETAILS */}
                {expandedJobId === id && (
                  <div className="job-expanded">
                    <div className="job-details-grid">
                      <div className="job-detail-item">
                        <span className="job-detail-label"> Full Description</span>
                        <span className="job-detail-value">{job.description}</span>
                      </div>
                      {job.requirements && (
                        <div className="job-detail-item">
                          <span className="job-detail-label"> Requirements</span>
                          <ul className="job-detail-value">
                            {job.requirements.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {job.benefits && (
                        <div className="job-detail-item">
                          <span className="job-detail-label"> Benefits</span>
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
                    <Link to="/login/candidate" className="btn-primary">
                      Apply Now 
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= CTA ================= */}
      {filteredJobs.length > PUBLIC_JOBS_LIMIT && (
        <div className="jobs-login-cta">
          <p>
            Showing {PUBLIC_JOBS_LIMIT} of {filteredJobs.length} jobs
          </p>
          <Link to="/login/candidate" className="btn-primary">
            Login to view all jobs 
          </Link>
        </div>
      )}
    </main>
  );
};

export default PublicJobs;
