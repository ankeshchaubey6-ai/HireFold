import React from "react";
import { Link } from "react-router-dom";

import RecruiterHeroImage from "../../Assets/RecruiterHeroBanner.png";

import "../../Styles/animations.css";

const RecruiterHeroBanner = () => {
  return (
    <section className="hero hero--recruiter">
      <div className="hero__container">
        {/* ================= LEFT CONTENT ================= */}
        <div className="hero__content">
          <h1 className="hero__title">
            Hire the Right Talent Faster & Fairer
          </h1>

          <p className="hero__subtitle">
            Post jobs, screen candidates objectively, and conduct structured
            interviews using a modern, assessment-driven hiring workflow.
          </p>

          <div className="hero__actions">
            <Link to="/recruiter/post-job" className="hero__btn hero__btn--primary">
              Post a Job
            </Link>

            <Link
              to="/recruiter/applicants"
              className="hero__btn hero__btn--secondary"
            >
              View Applications
            </Link>
          </div>
        </div>

        {/* ================= RIGHT IMAGE ================= */}
        <div className="hero__image-wrapper">
          <img
            src={RecruiterHeroImage}
            alt="Recruiter hiring dashboard illustration"
            className="hero__image"
          />
        </div>
      </div>
    </section>
  );
};

export default RecruiterHeroBanner;
