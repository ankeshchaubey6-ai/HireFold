import React from "react";
import "../../Styles/animations.css";

import FairAndSecureImage from "../../Assets/Fairandsecure.png";

const FairAndSecureBanner = () => {
  return (
    <section className="section-surface">
      <div className="banner-surface banner-surface--recruiter">
        <div className="hero__container hero__container--banner">

          {/* LEFT CONTENT */}
          <div className="hero__content hero__content--rich">

            <span className="hero__eyebrow">
              Trust  Security  Fairness
            </span>

            <h2 className="hero__title hero__title--recruiter">
              Fairandsecure Hiring
            </h2>

            <p className="hero__subtitle hero__subtitle--compact">
              Build confidence in every hiring decision with transparent,
              bias-free evaluations and secure interview workflows designed
              for modern recruitment teams.
            </p>

            {/* TRUST GRID */}
            <div className="trust-grid">
              <div className="trust-item">
                <strong>No Proxy Interviews</strong>
                <span>Identity-verified candidates only</span>
              </div>

              <div className="trust-item">
                <strong>Anti-Cheating Assessments</strong>
                <span>Real-time monitoring & integrity checks</span>
              </div>

              <div className="trust-item">
                <strong>Transparent Reports</strong>
                <span>Clear scoring and decision rationale</span>
              </div>

              <div className="trust-item">
                <strong>Bias-Free Evaluation</strong>
                <span>Consistent and fair candidate comparison</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="hero__actions hero__actions--banner">
              <button className="hero__btn hero__btn--primary">
                Explore Security Features
              </button>

              <button className="hero__btn hero__btn--secondary">
                Learn How It Works
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hero__image-wrapper hero__image-wrapper--banner">
            <img
              src={FairAndSecureImage}
              alt="Fair and secure hiring illustration"
              className="hero__image"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default FairAndSecureBanner;

