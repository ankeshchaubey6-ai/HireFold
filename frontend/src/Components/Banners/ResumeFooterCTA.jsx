import React from "react";
import { Link } from "react-router-dom";

import "../../Styles/resumeFooterCTA.css";

const ResumeFooterCTA = () => {
  return (
    <section className="resume-footer-cta">
      <h2>Ready to Apply?</h2>
      <p>
        Use your optimized resume to apply to jobs
        and move closer to your next opportunity.
      </p>

      <div className="resume-footer-actions">
        <Link to="/jobs" className="btn-primary hf-premium">
          Apply to Jobs
        </Link>

        <Link to="/resume/edit" className="btn-outline hf-premium">
          Update Resume
        </Link>
      </div>
    </section>
  );
};

export default ResumeFooterCTA;
