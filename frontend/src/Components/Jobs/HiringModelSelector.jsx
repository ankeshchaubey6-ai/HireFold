import React from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/hiringModelSelector.css";
import SelfImg from "../../Assets/SelfManagedHiring.png";
import AssistedImg from "../../Assets/AssistedHiring.png";

const HiringModelSelector = () => {
  const navigate = useNavigate();

  return (
    <section className="section-surface">
      <div className="hiring-grid">
        <div className="hiring-card">
          <div className="card-top">
            <span className="card-logo">HF</span>
          </div>
          <img src={SelfImg} alt="Self-managed hiring" />
          <h3>Self-managed hiring</h3>
          <p>Manage screening, interviews, and decisions directly from your dashboard.</p>
        </div>

        <div className="hiring-card assisted">
          <div className="card-top">
            <span className="card-logo">HF</span>
            <span className="premium-badge">Premium</span>
          </div>
          <img src={AssistedImg} alt="Assisted hiring" />
          <h3>Assisted hiring</h3>
          <p>Use AI-assisted screening and structured ranking to move faster on top candidates.</p>
        </div>
      </div>

      <div className="hiring-action">
        <button
          className="primary-btn hf-premium"
          onClick={() => navigate("/recruiter/post-job")}
          type="button"
        >
          Post Job
        </button>
      </div>
    </section>
  );
};

export default HiringModelSelector;
