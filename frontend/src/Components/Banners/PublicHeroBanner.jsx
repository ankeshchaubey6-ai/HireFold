
import React from "react";
import { Link } from "react-router-dom";

import PublicHeroImage from "../../Assets/PublicHeroBanner.png";

import "../../Styles/animations.css";

const PublicHeroBanner = () => {
  return (
    <section className="hero hero--public">
      <div className="hero__container">
        {/* ================= LEFT CONTENT ================= */}
        <div className="hero__content">
          <h1 className="hero__title">
            Discover Jobs with Fair & Transparent Hiring
          </h1>

          <p className="hero__subtitle">
            Explore opportunities from trusted companies and experience a
            bias-free hiring process powered by modern assessments and
            interviews.
          </p>

          <div className="hero__actions">
            <Link to="/jobs" className="hero__btn hero__btn--primary">
              Explore Jobs
            </Link>

            <Link to="/register/candidate" className="hero__btn hero__btn--secondary">
              Get Started
            </Link>
          </div>
        </div>

        {/* ================= RIGHT IMAGE ================= */}
        <div className="hero__image-wrapper">
          <img
            src={PublicHeroImage}
            alt="Public hiring platform illustration"
            className="hero__image"
          />
        </div>
      </div>
    </section>
  );
};

export default PublicHeroBanner;
