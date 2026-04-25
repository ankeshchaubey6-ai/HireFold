import { useJob } from "../../../../Context/JobContext";
import { useState } from "react";

const JobDescriptionSection = () => {
  const { job, setJob } = useJob(); //  use setJob
  const [analyzing, setAnalyzing] = useState(false);

  return (
    <section className="section-surface">
      <div className="form-section">
        <div className="form-section-header">
          <h3>Job Description</h3>
          <p>Clear, ATS-friendly role description</p>
        </div>

        <textarea
          rows={6}
          placeholder="Describe responsibilities, expectations, growth..."
          value={job.description || ""}
          onChange={(e) =>
            setJob((prev) => ({
              ...prev,
              description: e.target.value, //  string stays string
            }))
          }
        />

        <div className="form-actions-row">
          <button type="button" className="btn-outline hf-premium">
            View Suggestions
          </button>

          <button
            type="button"
            className="btn-primary hf-premium"
            disabled={analyzing}
          >
            {analyzing ? <span className="spinner" /> : "Re-run Analysis"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default JobDescriptionSection;

