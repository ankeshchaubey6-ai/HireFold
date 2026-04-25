// InterviewsPage.jsx - Compact hero with inline stats
import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";

import { useJobsFeed } from "@/Context/JobsFeedContext";
import { useApplications } from "@/Context/ApplicationsContext";
import {
  useInterviews,
  INTERVIEW_TYPES,
} from "./InterviewsContext";

import InterviewsHeader from "./InterviewsHeader";
import InterviewPipeline from "./InterviewPipeline";
import ScheduleInterviewModal from "./ScheduleInterviewModal";

import "@/Styles/sectionSurface.css";
import "./interviews.page.css";

const InterviewsPage = () => {
  const { recruiterJobs, isLoading: jobsLoading } = useJobsFeed();
  const { applications, fetchApplicantsForJobs, isLoading: appsLoading } = useApplications();
  const { interviews, fetchInterviews, isLoading: interviewsLoading } = useInterviews();

  const [selectedJobId, setSelectedJobId] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const initialLoadRef = useRef(false);

  // Single initialization effect
  useEffect(() => {
    const initializeData = async () => {
      if (initialLoadRef.current) return;

      if (recruiterJobs.length > 0 && !initialLoadRef.current) {
        initialLoadRef.current = true;
        try {
          await Promise.all([
            fetchApplicantsForJobs(recruiterJobs),
            fetchInterviews()
          ]);
        } catch (error) {
          
        } finally {
          setIsInitialized(true);
        }
      }
    };

    initializeData();
  }, [recruiterJobs, fetchApplicantsForJobs, fetchInterviews]);

  // Auto select first job
  useEffect(() => {
    if (recruiterJobs.length > 0 && !selectedJobId && isInitialized) {
      setSelectedJobId(recruiterJobs[0].id);
    }
  }, [recruiterJobs, selectedJobId, isInitialized]);

  const selectedJob = useMemo(
    () => recruiterJobs.find((j) => j.id === selectedJobId),
    [recruiterJobs, selectedJobId]
  );

  const jobApplications = useMemo(
    () => applications.filter((app) => String(app.jobId) === String(selectedJobId)),
    [applications, selectedJobId]
  );

  const jobInterviews = useMemo(
    () => interviews.filter((i) => String(i.jobId) === String(selectedJobId)),
    [interviews, selectedJobId]
  );

  const hiringModel = selectedJob?.hiringModel;
  const isAssisted = hiringModel === "ASSISTED";

  const systemInterviews = useMemo(
    () => jobInterviews.filter((i) => i.type === INTERVIEW_TYPES.SYSTEM),
    [jobInterviews]
  );

  const finalInterviews = useMemo(
    () => jobInterviews.filter((i) => i.type === INTERVIEW_TYPES.FINAL),
    [jobInterviews]
  );

  const isLoading = !isInitialized || jobsLoading || appsLoading || interviewsLoading;

  if (isLoading) {
    return (
      <div className="candidate-jobs-container">
        <div className="interviews-loading-state">
          <div className="loading-skeleton">
            <div className="skeleton-header"></div>
            <div className="skeleton-stats">
              <div className="skeleton-stat-card"></div>
              <div className="skeleton-stat-card"></div>
              <div className="skeleton-stat-card"></div>
              <div className="skeleton-stat-card"></div>
            </div>
            <div className="skeleton-pipeline">
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recruiterJobs.length) {
    return (
      <div className="candidate-jobs-container">
        <div className="empty-state">
          <div className="empty-state-icon"></div>
          <h4 className="empty-state-title">No Jobs Found</h4>
          <p className="empty-state-description">
            You don't have any jobs yet. Create your first job to start scheduling interviews.
          </p>
          <button className="btn-primary" onClick={() => window.location.href = "/jobs/create"}>
            Create a Job
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-jobs-container">

      {}
      {hiringModel === "SELF_MANAGED" && (
        <InterviewPipeline
          title="Scheduled Interviews"
          description="All scheduled interviews for this position"
          interviews={jobInterviews}
        />
      )}

      {isAssisted && (
        <>
          <InterviewPipeline
            title="System Interviews"
            description="Automated screening interviews"
            interviews={systemInterviews}
            readOnly
          />
          <InterviewPipeline
            title="Final Interviews"
            description="Final round interviews with hiring team"
            interviews={finalInterviews}
          />
        </>
      )}

      {showScheduleModal && selectedJob && (
        <ScheduleInterviewModal
          job={selectedJob}
          applications={jobApplications}
          onClose={() => setShowScheduleModal(false)}
        />
      )}
    </div>
  );
};

export default InterviewsPage;
