import React from "react";
import "../../Styles/contact.css";

/* Assets already available in your project */
import ContactBanner from "../../Assets/ContactSupport.png";
import GlobalSupport from "../../Assets/GlobalSupport.png";
import UserFeedback from "../../Assets/UserFeedback.png";

const Contact = () => {
  return (
    <main className="contact-page">

      {/* ================= HERO ================= */}
      <section className="contact-hero section-surface">
        <img
          src={ContactBanner}
          alt="Contact HireFold Support"
          className="contact-hero-image"
        />

        <h1>Contact Us</h1>
        <p className="contact-hero-subtitle">
          Were here to help. Whether youre a candidate, recruiter, or partner,
          reach out to us for support, feedback, or collaboration.
        </p>
      </section>

      {/* ================= CONTACT INTRO ================= */}
      <section className="contact-section section-surface">
        <h2>Get in Touch</h2>
        <p>
          HireFold is built with users at its core. If you have questions about
          resumes, ATS scoring, interviews, hiring workflows, or platform usage,
          our team is always ready to assist.
        </p>
        <p>
          We value every message and aim to respond as quickly as possible with
          clear and helpful guidance.
        </p>
      </section>

      {/* ================= CONTACT FORM ================= */}
      <section className="contact-split section-surface">
        <div className="contact-form-wrapper">
          <h2>Send Us a Message</h2>

          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <select>
              <option value="">Select Query Type</option>
              <option>Candidate Support</option>
              <option>Recruiter Support</option>
              <option>Feedback / Suggestions</option>
              <option>Business / Partnerships</option>
            </select>
            <textarea placeholder="Your Message" rows={5} required />
            <button type="submit" className="hf-premium">Submit Message</button>
          </form>
        </div>

        <img
          src={UserFeedback}
          alt="User feedback and communication"
          className="contact-image"
        />
      </section>

      {/* ================= SUPPORT DETAILS ================= */}
      <section className="contact-split reverse section-surface">
        <img
          src={GlobalSupport}
          alt="Global support"
          className="contact-image"
        />

        <div className="contact-text">
          <h2>Our Support Philosophy</h2>
          <p>
            At HireFold, support is not just about resolving issues  its about
            building trust. We believe in clear communication, timely responses,
            and continuous improvement based on user feedback.
          </p>
          <p>
            Every query helps us refine the platform and deliver a better hiring
            experience for everyone.
          </p>
        </div>
      </section>

    </main>
  );
};

export default Contact;

