import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/about.css";
import AboutUsBanner from "../../Assets/AboutUsBanner.png";
import CompanyHiringSuccess from "../../Assets/CompanyHiringSuccess.png";
import Fairandsecure from "../../Assets/Fairandsecure.png";
import GrowthAchievement from "../../Assets/GrowthAchievement.png";
import GlobalSupport from "../../Assets/GlobalSupport.png";

const About = () => {
  return (
    <main className="about-page">
      <section className="about-hero section-surface">
        <img src={AboutUsBanner} alt="About HireFold" className="about-hero-image" />
        <h1>About HireFold</h1>
        <p>
          HireFold helps teams hire with more structure and helps candidates understand how
          to improve their resumes, applications, and interview readiness.
        </p>
      </section>

      <div className="about-stats">
        <div className="stat-card">
          <div className="stat-number">10,000+</div>
          <div className="stat-label">Candidates supported</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">500+</div>
          <div className="stat-label">Companies served</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">98%</div>
          <div className="stat-label">Platform satisfaction</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">50+</div>
          <div className="stat-label">Regions reached</div>
        </div>
      </div>

      <section className="about-split section-surface">
        <div className="about-text">
          <h2>Who We Are</h2>
          <p>
            We built HireFold to make hiring more transparent, measurable, and easier to act on.
            The platform brings resume analysis, application workflows, and interview operations
            into one place.
          </p>
          <p>
            Recruiters get structured insights, and candidates get clearer signals about how to
            improve their chances.
          </p>
        </div>
        <img src={CompanyHiringSuccess} alt="Hiring success" className="about-image" />
      </section>

      <section className="about-split reverse section-surface">
        <img src={Fairandsecure} alt="Fair and secure hiring" className="about-image" />
        <div className="about-text">
          <h2>Our Mission</h2>
          <p>
            Our mission is to reduce guesswork in hiring and make job search feedback more useful.
          </p>
          <p>
            We focus on structured evaluation, practical recommendations, and workflows that feel
            straightforward for both candidates and hiring teams.
          </p>
        </div>
      </section>

      <section className="about-split section-surface">
        <div className="about-text">
          <h2>What We Build</h2>
          <ul className="about-list">
            <li>Resume analysis and ATS readiness scoring</li>
            <li>Application tracking for candidates and recruiters</li>
            <li>Interview scheduling and pipeline visibility</li>
            <li>Assisted and self-managed hiring workflows</li>
          </ul>
        </div>
        <img src={GrowthAchievement} alt="Growth and outcomes" className="about-image" />
      </section>

      <section className="about-split reverse section-surface">
        <img src={GlobalSupport} alt="Global support" className="about-image" />
        <div className="about-text">
          <h2>Our Vision</h2>
          <p>
            We want hiring decisions to be backed by clearer evidence and better context, not
            just manual screening and incomplete signals.
          </p>
          <p>
            HireFold is designed to keep growing into a practical career and hiring platform for
            both sides of the process.
          </p>
        </div>
      </section>

      <section className="about-cta">
        <h3>Ready to get started?</h3>
        <p>Use HireFold to build better resumes, manage applications, and hire with confidence.</p>
        <div className="cta-buttons">
          <Link to="/register/recruiter" className="btn-primary">
            Start Hiring
          </Link>
          <Link to="/register/candidate" className="btn-secondary">
            Explore Jobs
          </Link>
        </div>
      </section>
    </main>
  );
};

export default About;
