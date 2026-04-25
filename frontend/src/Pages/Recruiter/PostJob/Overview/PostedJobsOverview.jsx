import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useJobsFeed } from "@/Context/JobsFeedContext";
import "@/Styles/sectionSurface.css";
import "@/Styles/postJob/jobOverview.css";

const DAYS_RECENT = 14;

const PostedJobsOverview = () => {
  const navigate = useNavigate();
  const { jobs } = useJobsFeed();

  const { recentCount, pastCount } = useMemo(() => {
    if (!Array.isArray(jobs)) {
      return { recentCount: 0, pastCount: 0 };
    }

    const now = Date.now();

    
    const validJobs = jobs.filter((job) => {
      // Ignore corrupted jobs
      if (!job) return false;

      // Ignore jobs without date (safety)
      if (!job.createdAt) return false;

      // Optional: if backend has status
      const status = job.status || "OPEN";
      return status !== "CLOSED"; // don't count closed as active recent
    });

    let recent = 0;
    let past = 0;

    validJobs.forEach((job) => {
      //  FIX 1: Convert createdAt STRING  timestamp (INDUSTRY FIX)
      const createdTime = new Date(job.createdAt).getTime();

      // Safety fallback
      if (isNaN(createdTime)) {
        past++;
        return;
      }

      const daysOld =
        (now - createdTime) / (1000 * 60 * 60 * 24);

      //  FIX 2: Correct classification logic
      if (daysOld <= DAYS_RECENT) {
        recent++;
      } else {
        past++;
      }
    });

    return {
      recentCount: recent,
      pastCount: past,
    };
  }, [jobs]);

  return (
    <section className="section-surface">
      <h3 style={{ marginBottom: 20 }}>Your Job Posts</h3>

      <div className="posted-jobs-cards">
        {/* RECENT JOBS */}
        <div className="posted-job-card">
          <div className="posted-job-card-header">
            <span className="posted-job-icon"></span>
            <h4>Recent Job Posts</h4>
          </div>

          <p className="posted-job-desc">
            Jobs posted in the last {DAYS_RECENT} days
          </p>

          <div className="posted-job-count">
            {recentCount} active job{recentCount !== 1 ? "s" : ""}
          </div>

          <button
            className="btn-primary hf-premium"
            onClick={() => navigate("/recruiter/jobs/recent")}
          >
            View Recent Jobs
          </button>
        </div>

        {/* PAST JOBS */}
        <div className="posted-job-card">
          <div className="posted-job-card-header">
            <span className="posted-job-icon"></span>
            <h4>Past Job Posts</h4>
          </div>

          <p className="posted-job-desc">
            Older job postings and history
          </p>

          <div className="posted-job-count">
            {pastCount} archived job{pastCount !== 1 ? "s" : ""}
          </div>

          <button
            className="btn-primary hf-premium"
            onClick={() => navigate("/recruiter/jobs/past")}
          >
            View Past Jobs
          </button>
        </div>
      </div>
    </section>
  );
};

export default PostedJobsOverview;

