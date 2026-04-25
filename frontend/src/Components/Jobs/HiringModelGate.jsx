import React, { useEffect, useState } from "react";
import Modal from "../Common/Modal";
import "./hiringModelGate.css";

const HiringModelGate = ({ isOpen, onClose, onSelect }) => {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setSelected(null);
    }
  }, [isOpen]);

  const handleContinue = () => {
    if (!selected) return;
    onSelect(selected);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="hiring-gate-container">
        {/* HEADER */}
        <div className="hiring-gate-header">
          <div className="hiring-gate-badge">Choose Model</div>
          <h2 className="hiring-gate-title">
            Pick Your <span className="gradient-text">Hiring Path</span>
          </h2>
          <button className="hiring-gate-close" onClick={onClose}></button>
        </div>

        {/* BODY */}
        <div className="hiring-gate-body">
          <div className="hiring-gate-grid">
            {/* SELF MANAGED */}
            <div
              className={`hiring-gate-card ${selected === "self" ? "active" : ""}`}
              onClick={() => setSelected("self")}
              role="button"
              tabIndex={0}
            >
              <div className="hiring-gate-card-glow" />
              <div className="hiring-gate-card-corner" />
              
              <div className="hiring-gate-card-badge self">Self-Managed</div>
              
              <h3 className="hiring-gate-card-title">You Control It</h3>
              
              <ul className="hiring-gate-card-features">
                <li> Screen resumes</li>
                <li> Conduct interviews</li>
                <li> Use evaluation tools</li>
              </ul>

              <div className="hiring-gate-card-footer">
                Best if you have a process
              </div>
            </div>

            {/* ASSISTED */}
            <div
              className={`hiring-gate-card assisted ${selected === "assisted" ? "active" : ""}`}
              onClick={() => setSelected("assisted")}
              role="button"
              tabIndex={0}
            >
              <div className="hiring-gate-card-glow" />
              <div className="hiring-gate-card-corner" />
              
              <div className="hiring-gate-card-badge assisted">Assisted</div>
              
              <h3 className="hiring-gate-card-title">We Handle It</h3>
              
              <ul className="hiring-gate-card-features">
                <li> Resume screening</li>
                <li> Structured interviews</li>
                <li> Curated shortlist</li>
              </ul>

              <div className="hiring-gate-card-footer">
                Best for faster hiring
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="hiring-gate-actions">
            <button className="hiring-gate-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className={`hiring-gate-btn-primary ${!selected ? "disabled" : ""}`}
              disabled={!selected}
              onClick={handleContinue}
            >
              Continue 
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default HiringModelGate;
