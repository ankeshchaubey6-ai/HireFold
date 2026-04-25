import React from "react";
import { Link } from "react-router-dom";

import "../../Styles/dashboardBottomBanners.css";

import NextStop from "../../Assets/NextStop.png";
import Evaluation from "../../Assets/Evaluation.png";

const DashboardBottomBanners = () => {
  return (
    <section>
      <div className="dashboard-banners-grid">

        {/* ================= LEFT BANNER ================= */}
        <div className="dashboard-banner banner-trust">
          <h3 className="banner-title">
            Why Employers Trust Our Evaluation
          </h3>

          {/* IMAGE */}
          <div className="evaluation-image-wrapper">
            <img
              src={Evaluation}
              alt="Trusted evaluation process"
              className="evaluation-image"
            />
          </div>

          <ul className="banner-points">
            <li>Skill-based, unbiased assessments</li>
            <li>Real-world interview simulations</li>
            <li>AI-assisted candidate insights</li>
            <li>Verified performance metrics</li>
            <li>Consistent & fair evaluation process</li>
          </ul>
        </div>

        {/* ================= RIGHT BANNER ================= */}
        <div className="dashboard-banner banner-cta">
          <h3 className="banner-title">
            Take the Next Step
          </h3>

          {/* IMAGE */}
          <div className="next-stop-image-wrapper">
            <img
              src={NextStop}
              alt="Apply to more jobs and update resume"
              className="next-stop-image"
            />
          </div>

          <p className="banner-desc">
            Apply to more opportunities and keep your resume updated
            to improve your hiring success.
          </p>

          <div className="banner-actions">
            <Link to="/jobs" className="btn-primary hf-premium">
              Apply to More Jobs
            </Link>

            <Link to="/resume" className="btn-outline hf-premium">
              Update Resume
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DashboardBottomBanners;
