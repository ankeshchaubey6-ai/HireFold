import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJob } from "@/Context/JobContext";

import SelfManagedHiringCard from "./SelfManagedHiringCard";
import AssistedHiringCard from "./AssistedHiringCard";
import HiringModelCTA from "./HiringModelCTA";
import HiringModelGate from "@/Components/Jobs/HiringModelGate";

import "@/Styles/postJob/postJobSections.css";

const HiringModelCards = () => {
  const { setHiringModel, resetJob } = useJob();
  const navigate = useNavigate();
  const [isGateOpen, setIsGateOpen] = useState(false);

  //  MOCK  replace later with AuthContext / API
  const hasAssistedHiringPlan = false;

  const handleHiringModelSelect = (model) => {
    if (model === "assisted" && !hasAssistedHiringPlan) {
      navigate("/recruiter/services-plans");
      return;
    }

    setHiringModel(model === "self" ? "SELF_MANAGED" : "ASSISTED");
    navigate("/recruiter/post-job");
  };

  return (
    <>
      {/* HEADER - Matches interview page design */}
      <div className="postjob-header-row">
        <div className="postjob-header-left">
          <div className="postjob-header-badge">Job Posting</div>
          <h1 className="postjob-header-title">
            Post a <span className="gradient-text">New Job</span>
          </h1>
          <p className="postjob-header-subtitle">
            Create a job listing and start receiving matched candidates
          </p>
        </div>

        <div className="postjob-header-actions">
          <button
            className="btn-outline-modern"
            onClick={() => navigate("/recruiter/jobs/drafts")}
          >
            <span></span>
            Drafts
          </button>

          <button
            className="btn-primary-modern"
            onClick={() => {
              resetJob();
              setIsGateOpen(true);
            }}
          >
            <span></span>
            Post Job
          </button>
        </div>
      </div>

      {/* MODEL CARDS */}
      <div className="postjob-actions-grid">
        <SelfManagedHiringCard onSelect={() => handleHiringModelSelect("self")} />
        <AssistedHiringCard onSelect={() => handleHiringModelSelect("assisted")} />
      </div>

      <HiringModelCTA />

      {/* HIRING MODEL GATE */}
      <HiringModelGate
        isOpen={isGateOpen}
        onClose={() => setIsGateOpen(false)}
        onSelect={handleHiringModelSelect}
      />
    </>
  );
};

export default HiringModelCards;
