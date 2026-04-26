import React, { useMemo, useState, useEffect, useRef } from "react";
import { useJobsFeed } from "../../Context/JobsFeedContext";
import { useApplications } from "@/Context/ApplicationsContext";
import JobPreviewCard from "@/Components/Jobs/JobPreviewCard";
import ApplyModal from "@/Components/Jobs/ApplyModal";

import "../../Styles/jobs.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

const CandidateJobs = () => {
  const { jobs } = useJobsFeed();
  const { applications, applyToJob } = useApplications();

  const [savedJobs, setSavedJobs] = useState([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    savedCount: 0,
    appliedCount: 0,
    recommendedCount: 0
  });

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    experience: "",
    employmentType: "",
    workMode: "",
    skills: "",
    salaryRange: ""
  });

  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
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

  /* ================= HELPERS ================= */
  const getId = (job) => job._id || job.id;

  const hasApplied = (jobId) =>
    applications.some((a) => a.jobId === jobId);

  const toggleSave = (id) => {
    setSavedJobs((prev) =>
      prev.includes(id)
        ? prev.filter((j) => j !== id)
        : [...prev, id]
    );
  };

  /* ================= UPDATE STATS ================= */
  useEffect(() => {
    setStats({
      totalJobs: jobs.length,
      savedCount: savedJobs.length,
      appliedCount: applications.length,
      recommendedCount: Math.floor(jobs.length * 0.3)
    });
  }, [jobs, savedJobs, applications]);

  /* ================= FILTER ================= */
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const id = getId(job);

      if (showSavedOnly && !savedJobs.includes(id)) return false;

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
  }, [jobs, filters, savedJobs, showSavedOnly]);

  /* ================= GET SALARY DISPLAY - REMOVED COMPETITIVE LOGIC ================= */
  const getSalaryDisplay = (job) => {
    if (job.salary) {
      return `$${job.salary.toLocaleString()}/year`;
    }
    if (job.salaryRange) {
      return `${job.salaryRange.min} - ${job.salaryRange.max}`;
    }
    // Return empty string or hide salary section when no salary data
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
          <span className="jobs-hero-badge"> Find Your Dream Job</span>
          <h1 className="jobs-hero-title">
            Discover <span className="gradient-text">Opportunities</span> That Match Your Skills
          </h1>
          <p className="jobs-hero-subtitle">
            Browse through thousands of job listings from top companies. Find the perfect role that aligns with your career goals.
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
          <div className="jobs-stat-number">{stats.savedCount}</div>
          <div className="jobs-stat-label">Saved Jobs</div>
        </div>
        <div className="jobs-stat-card">
          <div className="jobs-stat-icon"></div>
          <div className="jobs-stat-number">{stats.appliedCount}</div>
          <div className="jobs-stat-label">Applications</div>
        </div>
        <div className="jobs-stat-card">
          <div className="jobs-stat-icon"></div>
          <div className="jobs-stat-number">{stats.recommendedCount}</div>
          <div className="jobs-stat-label">Recommended</div>
        </div>
      </div>

      {/* ================= FILTERS SECTION ================= */}
      <div className="jobs-filters-container">
        <div className="filters-header">
          <div className="filters-title-section">
            <h2>
              Find Your <span>Perfect Match</span>
            </h2>
            <p>{filteredJobs.length} jobs found</p>
          </div>
          <div className="filters-actions">
            <button
              className="filters-toggle-btn"
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            >
              {isFiltersExpanded ? " Simple Filters" : " Advanced Filters"}
            </button>
            <button
              className={`saved-toggle-btn ${showSavedOnly ? "active" : ""}`}
              onClick={() => setShowSavedOnly((v) => !v)}
            >
              {showSavedOnly ? "Saved Jobs" : "View Saved"}
            </button>
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
      {filteredJobs.length === 0 ? (
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
          {filteredJobs.map((job, index) => {
            const id = getId(job);
            return (
              <div 
                key={id}
                style={{ animationDelay: `${index * 0.05}s` }}
                ref={(el) => (cardRefs.current[id] = el)}
              >
                <JobPreviewCard
                  job={job}
                  mode="candidate"
                  expandedJobId={expandedJobId}
                  setExpandedJobId={setExpandedJobId}
                  onMouseMove={handleMouseMove}
                  cardRef={(el) => (cardRefs.current[id] = el)}
                  onApply={() => setApplyJob(job)}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* ================= LOAD MORE / PAGINATION ================= */}
      {filteredJobs.length > 0 && filteredJobs.length < jobs.length && (
        <div className="load-more-container">
          <button className="btn-load-more">
            Load More Opportunities
          </button>
        </div>
      )}

      {/* ================= APPLY MODAL ================= */}
      {applyJob && (
        <ApplyModal
          job={applyJob}
          onClose={() => setApplyJob(null)}
          onApply={({ method, resumeFile }) => {
            applyToJob({
              job: applyJob,
              candidate: { id: "cand-001", name: "Demo Candidate" },
              resume: {
                method,
                fileName: resumeFile?.name || null,
              },
            });

            setApplyJob(null);
          }}
        />
      )}
    </main>
  );
};

export default CandidateJobs;
