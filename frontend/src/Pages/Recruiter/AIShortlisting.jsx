import React, { useEffect, useMemo, useState } from "react";
import { useJobsFeed } from "@/Context/JobsFeedContext";
import { useApplications } from "@/Context/ApplicationsContext";
import AIResumeAnalysisDrawer from "./AIResumeAnalysisDrawer";
import "@/Styles/sectionSurface.css";
import "@/Styles/aiShortlisting.css";

const AIShortlisting = () => {
  const { recruiterJobs } = useJobsFeed();
  const { applications, fetchApplicantsForJobs, loading } = useApplications();
  const [selectedJobId, setSelectedJobId] = useState("");
  const [activeResume, setActiveResume] = useState(null);

  useEffect(() => {
    if (recruiterJobs.length) {
      fetchApplicantsForJobs(recruiterJobs);
    }
  }, [fetchApplicantsForJobs, recruiterJobs]);

  useEffect(() => {
    if (!selectedJobId && recruiterJobs.length) {
      setSelectedJobId(recruiterJobs[0].id);
    }
  }, [recruiterJobs, selectedJobId]);

  const rankedApplications = useMemo(() => {
    return applications
      .filter((application) => String(application.jobId) === String(selectedJobId))
      .sort((left, right) => (right.atsScore || 0) - (left.atsScore || 0))
      .map((application, index, list) => {
        const score = application.ats?.score ?? application.atsScore ?? 0;
        const threshold = Math.ceil(list.length * 0.3);
        const verdict = index < threshold ? "Shortlist" : score >= 60 ? "Review" : "Reject";

        return {
          ...application,
          rank: index + 1,
          score,
          verdict,
        };
      });
  }, [applications, selectedJobId]);

  const summary = useMemo(
    () =>
      rankedApplications.reduce(
        (accumulator, application) => {
          if (application.verdict === "Shortlist") accumulator.shortlist += 1;
          else if (application.verdict === "Review") accumulator.review += 1;
          else accumulator.reject += 1;
          return accumulator;
        },
        { shortlist: 0, review: 0, reject: 0 }
      ),
    [rankedApplications]
  );

  return (
    <>
      <div className="recruiter-page-header">
        <h1>AI Resume Shortlisting</h1>
        <p className="muted-text">
          Rank applicants for assisted roles using their current ATS results.
        </p>
      </div>

      <section>
        <div className="section-surface ai-shortlisting">
          <div className="ai-action-bar">
            <select value={selectedJobId} onChange={(event) => setSelectedJobId(event.target.value)}>
              <option value="">Select Job</option>
              {recruiterJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div className="ai-summary">
            <div>{summary.shortlist} Shortlisted</div>
            <div>{summary.review} Review</div>
            <div>{summary.reject} Rejected</div>
          </div>

          {loading ? (
            <p className="muted-text">Loading applicants...</p>
          ) : rankedApplications.length === 0 ? (
            <p className="muted-text">No applicants with ATS data are available for this role yet.</p>
          ) : (
            <div className="ai-results">
              {rankedApplications.map((application) => (
                <div key={application.id} className="ai-row">
                  <div>{application.rank}</div>
                  <div className="file">{application.candidateName}</div>
                  <div className="score">{application.score}%</div>
                  <div className={`verdict ${application.verdict.toLowerCase()}`}>
                    {application.verdict}
                  </div>
                  <div>
                    <button
                      className="secondary-btn hf-premium"
                      onClick={() =>
                        setActiveResume({
                          structuredData:
                            application.resume || {
                              basics: { fullName: application.candidateName },
                              meta: {},
                            },
                          ats: application.ats || null,
                        })
                      }
                      type="button"
                    >
                      View Analysis
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {activeResume ? (
        <AIResumeAnalysisDrawer
          resume={activeResume.structuredData}
          ats={activeResume.ats}
          onClose={() => setActiveResume(null)}
        />
      ) : null}
    </>
  );
};

export default AIShortlisting;
