import React, { useEffect, useState, useCallback } from "react";
import "../../Styles/sectionSurface.css";
import "../../Styles/resumePage.css";
import "../../Styles/myResumes.css";

import { useAuth } from "../../Context/AuthContext";
import { useResume } from "../../Context/ResumeContext";
import { ResumeStorageService } from "../../services/resumeStorage.service";

const ACTIVE_RESUME_KEY = "hirefold_active_resume_id";


const MyResumes = () => {
  const { user } = useAuth();
  const { loadResumeIntoContext } = useResume();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  
  const fetchResumes = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response =
        await ResumeStorageService.getResumesByUser(user.id);

      let all = [];

      if (Array.isArray(response)) all = response;
      else if (Array.isArray(response?.data)) all = response.data;
      else if (Array.isArray(response?.resumes)) all = response.resumes;
      else if (Array.isArray(response?.data?.resumes)) all = response.data.resumes;

      
      const hydrated = await Promise.all(
        (all || []).map(async (r) => {
          try {
            if (r?.atsScore !== null && r?.atsScore !== undefined) {
              return r;
            }

            // fetch latest ATS from backend
            const full = await ResumeStorageService.getResumeById(r.resumeId);
            return full || r;
          } catch {
            return r;
          }
        })
      );

      const filtered = hydrated.filter(
        (r) =>
          r &&
          r.resumeId &&
          (r.source === "builder" || r.source === "upload")
      );

      filtered.sort(
        (a, b) =>
          (b.updatedAt || b.createdAt || 0) -
          (a.updatedAt || a.createdAt || 0)
      );

      setResumes(filtered);
    } catch (error) {
      
      setResumes([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  
  return (
    <main className="page page-surface my-resumes-page">
      <section className="section-surface">

        <div className="my-resumes-header">
          <h1 className="section-title">My Saved Resumes</h1>
          <div className="resume-count-badge">
            {resumes.length}
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="resume-grid">
            {resumes.map((r) => {
              const score = r.atsScore ?? null;
              const scoreMeta = getScoreMeta(score);

              return (
                <div
                  key={r.resumeId}
                  className="resume-card-pro"
                  onClick={() => openResume(r.resumeId)}
                >
                  <button
                    onClick={(e) => deleteResume(e, r.resumeId)}
                  >
                    
                  </button>

                  <h3>{r.title}</h3>

                  {}
                  <div>
                    ATS Score:
                    <b>
                      {score !== null && score !== undefined
                        ? score
                        : ""}
                    </b>
                  </div>

                  <div style={{ color: scoreMeta.color }}>
                    {scoreMeta.label}
                  </div>

                  <div>
                    {formatDate(r.updatedAt)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default MyResumes;
