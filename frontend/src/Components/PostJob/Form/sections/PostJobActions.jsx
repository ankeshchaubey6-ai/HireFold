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

    try {
      const payload = buildPayload();

      if (job?.id) {
        await api.put(`/jobs/${job.id}`, payload);
      } else {
        await api.post("/jobs", payload);
      }

      resetJob();
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
  );
};

export default PostJobActions;
