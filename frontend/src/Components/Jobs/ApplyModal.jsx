import React, { useMemo, useState } from "react";
import Modal from "@/Components/Common/Modal";
import "@/Styles/postJob/applyModal.css";
import { useApplications } from "@/Context/ApplicationsContext";
import { useAuth } from "@/Context/AuthContext";

const ApplyModal = ({ job, onClose, onApply }) => {
  const [method, setMethod] = useState("builder");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { applyToJob, hasApplied } = useApplications();
  const { user } = useAuth();

  const jobId = job?._id || job?.id;

  const alreadyApplied = useMemo(() => {
    if (!jobId || !user?._id) {
      return false;
    }
    return hasApplied(jobId, user._id);
  }, [hasApplied, jobId, user?._id]);

  const handleSubmit = async () => {
    if (alreadyApplied || !jobId) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        method,
        resumeFile: file,
      };

      if (typeof onApply === "function") {
        await onApply(payload);
      } else {
        await applyToJob({
          job,
          resume: {
            method,
            fileName: file?.name || null,
          },
        });
      }

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="apply-modal">
        <div className="apply-modal-header">
          <h2>Apply to {job?.title || "this role"}</h2>
          <button type="button" className="btn-outline" onClick={onClose}>
            Close
          </button>
        </div>

        {alreadyApplied ? (
          <div className="apply-options">
            <div className="apply-option-card active">
              <h3>Application submitted</h3>
              <p>Your application is already in the recruiter pipeline.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="apply-options">
              <button
                type="button"
                className={`apply-option-card ${method === "builder" ? "active" : ""}`}
                onClick={() => setMethod("builder")}
              >
                <h3>Use Resume Builder</h3>
                <p>Apply using your HireFold resume.</p>
              </button>

              <button
                type="button"
                className={`apply-option-card ${method === "upload" ? "active" : ""}`}
                onClick={() => setMethod("upload")}
              >
                <h3>Upload Resume</h3>
                <p>Choose a resume file for this application.</p>
              </button>
            </div>

            {method === "upload" ? (
              <div className="apply-upload-field">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                />
                {file ? <p className="file-name">Selected: {file.name}</p> : null}
              </div>
            ) : null}

            <div className="apply-modal-actions">
              <button className="btn-outline" onClick={onClose} type="button">
                Cancel
              </button>
              <button
                className="btn-primary hf-premium"
                disabled={loading || (method === "upload" && !file)}
                onClick={handleSubmit}
                type="button"
              >
                {loading ? "Applying..." : "Submit Application"}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ApplyModal;
