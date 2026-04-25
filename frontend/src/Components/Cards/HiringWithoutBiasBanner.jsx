import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/hiringWithoutBias.css";


import BiasFreeHiring from "../../Assets/BiasFreeHiring.png";

const HiringWithoutBiasBanner = () => {
  return (
    <section className="hero hero--bias">
      <div className="hero__container">
        <div className="hero__content">
          <h2 className="hero__title">Hiring Without Bias</h2>

          <p className="hero__subtitle">
            Skill-first evaluations and transparent hiring powered by fair
            assessments.
          </p>

          <div className="hero__actions">
            <Link to="/login/candidate" className="hero__btn hero__btn--primary">
              Find Jobs
            </Link>

            <Link to="/login/recruiter" className="hero__btn hero__btn--secondary">
              Start Hiring
            </Link>
          </div>
        </div>

        <div className="hero__image-wrapper">
          <img
            src={BiasFreeHiring}
            alt="Bias Free Hiring"
            className="hero__image"
          />
        </div>
      </div>
    </section>
  );
};

export default HiringWithoutBiasBanner;
