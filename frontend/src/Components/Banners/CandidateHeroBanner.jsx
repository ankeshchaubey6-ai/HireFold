
import React from "react";
import { Link } from "react-router-dom";

import CandidateHeroImage from "../../Assets/CandidateHeroBanner.png";

import "../../Styles/animations.css";

const CandidateHeroBanner = () => {
  return (
    <section className="hero hero--candidate">
      <div className="hero__container">
        {/* ================= LEFT CONTENT ================= */}
        <div className="hero__content">
          <h1 className="hero__title">
            Grow Your Career with Smarter Opportunities
          </h1>

          <p className="hero__subtitle">
            Prepare better with mock interviews, resume insights, and get
            matched with roles that truly fit your skills and ambitions.
          </p>

          <div className="hero__actions">
            <Link to="/candidate/jobs" className="hero__btn hero__btn--primary">
              Find Jobs
            </Link>

            <Link to="/candidate/resume" className="hero__btn hero__btn--secondary">
              Improve Resume
            </Link>
          </div>
        </div>

        {/* ================= RIGHT IMAGE ================= */}
        <div className="hero__image-wrapper">
          <img
            src={CandidateHeroImage}
            alt="Candidate career growth illustration"
            className="hero__image"
          />
        </div>
      </div>
    </section>
  );
};

export default CandidateHeroBanner;
