import React from "react";
import "@/Styles/postJob/postJobSections.css";

import AssistedHiring from "@/Assets/AssistedHiring.png";

const AssistedHiringCard = ({ onSelect }) => {
  return (
    <div
      className="action-card action-card--assisted"
      onClick={() => onSelect("ASSISTED")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSelect("ASSISTED");
      }}
    >
      {/* LEFT: Image */}
      <img
        src={AssistedHiring}
        alt="Assisted Hiring"
        className="action-card-image"
      />

      {/* RIGHT: Content */}
      <div className="action-card-content">
        {/* Header row */}
        <div className="action-card-header">
          <h3>Assisted Hiring</h3>

          <span className="verified-badge">
             Verified
          </span>
        </div>

        {/* Description */}
        <p>
          HireFold experts handle resume screening,
          structured interviews, and deliver a
          curated shortlist of top candidates.
        </p>

        {/* Premium badge (non-click-through) */}
        <button
          type="button"
          className="premium-badge"
          onClick={(e) => e.stopPropagation()}
          aria-label="Premium feature"
        >
          Premium
        </button>
      </div>
    </div>
  );
};

export default AssistedHiringCard;

