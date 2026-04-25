import React from "react";
import "../../Styles/feedback.css";

/* Assets already available */
import FeedbackBanner from "../../Assets/UserFeedback.png";
import RatingsReviews from "../../Assets/RatingsReviews.png";
import ContinuousImprovement from "../../Assets/ContinuousImprovement.png";

const Feedback = () => {
  return (
    <main className="feedback-page">

      {/* ================= HERO ================= */}
      <section className="feedback-hero section-surface">
        <img
          src={FeedbackBanner}
          alt="User feedback"
          className="feedback-hero-image"
        />

        <h1>Your Feedback Matters</h1>
        <p className="feedback-hero-subtitle">
          HireFold is built around continuous improvement. Your feedback helps
          us refine features, fix gaps, and deliver a better hiring experience
          for everyone.
        </p>
      </section>

      {/* ================= WHY FEEDBACK ================= */}
      <section className="feedback-split section-surface">
        <div className="feedback-text">
          <h2>Why We Ask for Feedback</h2>
          <p>
            Hiring and career growth are deeply personal experiences. We believe
            the best way to build HireFold is by listening directly to the
            people who use it.
          </p>
          <p>
            Every suggestion, concern, or idea helps us identify whats working
            well and what needs improvement  ensuring the platform evolves in
            the right direction.
          </p>
        </div>

        <img
          src={ContinuousImprovement}
          alt="Continuous improvement"
          className="feedback-image"
        />
      </section>

      {/* ================= FEEDBACK FORM ================= */}
      <section className="feedback-split reverse section-surface">
        <img
          src={RatingsReviews}
          alt="Ratings and reviews"
          className="feedback-image"
        />

        <div className="feedback-form-wrapper">
          <h2>Share Your Experience</h2>

          <form className="feedback-form">
            <input type="text" placeholder="Your Name (optional)" />
            <input type="email" placeholder="Your Email (optional)" />

            <select>
              <option value="">What best describes you?</option>
              <option>Candidate</option>
              <option>Recruiter</option>
              <option>Hiring Manager</option>
              <option>Other</option>
            </select>

            <select>
              <option value="">Type of Feedback</option>
              <option>Feature Suggestion</option>
              <option>Bug / Issue</option>
              <option>User Experience</option>
              <option>General Feedback</option>
            </select>

            <textarea
              placeholder="Write your feedback here..."
              rows={5}
              required
            />

            <button type="submit" className="hf-premium">Submit Feedback</button>
          </form>
        </div>
      </section>

      {/* ================= CLOSING NOTE ================= */}
      <section className="feedback-section section-surface">
        <h2>Our Commitment</h2>
        <p>
          We review feedback carefully and use it to guide product decisions,
          feature improvements, and user experience enhancements.
        </p>
        <p>
          Thank you for helping us build a smarter, fairer, and more effective
          hiring platform.
        </p>
      </section>

    </main>
  );
};

export default Feedback;

