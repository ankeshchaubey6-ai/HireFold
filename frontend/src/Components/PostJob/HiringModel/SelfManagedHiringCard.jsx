import React from "react";
import "@/Styles/postJob/postJobSections.css";

import SelfManagedHiring from "@/Assets/SelfManagedHiring.png";

const SelfManagedHiringCard = ({ onSelect }) => {
  return (
    <div
      className="action-card"
      onClick={() => onSelect("SELF_MANAGED")}
    >
      {/* Left image */}
      <img
        src={SelfManagedHiring}
        alt="Self Managed Hiring"
        className="action-card-image"
      />

      {/* Right content (REQUIRED WRAPPER) */}
      <div className="action-card-content">
        <h3>Self-Managed Hiring</h3>

        <p>
          You manage screening, interviews,
          and final hiring decisions yourself.
        </p>
      </div>
    </div>
  );
};

export default SelfManagedHiringCard;
