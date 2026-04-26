import { useState } from "react";
import dayjs from "dayjs";

import { useJob } from "../../../../Context/JobContext";
import api from "@/services/api";

import "@/Styles/postJob/jobFooter.css";

const normalizeExperienceLevel = (value) => {
  const mapping = {
    Entry: "ENTRY",
    Mid: "MID",
    Senior: "SENIOR",
    Lead: "SENIOR",
  };

  return mapping[value] || value?.toUpperCase() || "";
};

const PostJobActions = () => {
  const { job, setJob, resetJob } = useJob();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleDateChange = (event) => {
    const { value } = event.target;
    setJob((currentJob) => ({
      ...currentJob,
      applicationLastDate: value,
    }));
  };

  const buildPayload = () => ({
    title: job?.basics?.title || "",
    description: job?.description || "",
    location: job?.basics?.location || "",
    experienceLevel: normalizeExperienceLevel(job?.basics?.experienceLevel),
    requiredSkills: Array.isArray(job?.skills) ? job.skills : [],
    hiringModel: job?.hiringModel || "",
    employmentType: job?.basics?.employmentType || "",
    department: job?.basics?.department || "",
    workMode: job?.basics?.workMode || "",
    companyName: job?.basics?.companyName || "",
    preferredSkills: Array.isArray(job?.preferredSkills) ? job.preferredSkills : [],
    hiringPreferences: job?.hiringPreferences || "",
    compensation: job?.compensation || {},
    applicationLastDate: job?.applicationLastDate || "",
    companyLogo: job?.basics?.companyLogoPreview || null,
  });

  const submitJob = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const payload = buildPayload();

      if (job?.id) {
        await api.put(`/jobs/${job.id}`, payload);
      } else {
        await api.post("/jobs", payload);
      }

      setSuccess(true);
      resetJob();
      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to post job";
      setError(errorMessage);
      console.error("Job posting error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("hirefold-post-job-draft", JSON.stringify(job));
    }
  };

  const handlePublish = async () => {
    await submitJob();
  };

  return (
    <div className="postjob-form-footer">
      <div className="footer-left">
        <label className="footer-label">
          Application Last Date
        </label>

        <input
          type="date"
          className="hf-date-input"
          value={job?.applicationLastDate || ""}
          onChange={handleDateChange}
          min={dayjs().format("YYYY-MM-DD")}
        />
      </div>

      <div className="footer-actions">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end", flex: 1 }}>
          {error && (
            <div style={{ 
              color: "#d32f2f", 
              fontSize: "13px", 
              padding: "8px 12px", 
              backgroundColor: "#ffebee", 
              borderRadius: "4px",
              width: "100%"
            }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{ 
              color: "#388e3c", 
              fontSize: "13px", 
              padding: "8px 12px", 
              backgroundColor: "#e8f5e9", 
              borderRadius: "4px",
              width: "100%"
            }}>
              ✓ Job posted successfully!
            </div>
          )}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              className="btn-outline"
              onClick={handleSaveDraft}
              disabled={loading}
            >
              Save Draft
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={handlePublish}
              disabled={loading}
            >
              {loading ? "Posting..." : "Publish Job"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobActions;
