import React from "react";
import "../../Styles/privacy.css";

const PrivacyPolicy = () => {
  return (
    <section className="legal-page">
      <header className="legal-hero">
        <h1>Privacy Policy</h1>
        <p>
          Your privacy matters to us. This policy explains how HireFold
          collects, uses, and protects your information.
        </p>
      </header>

      <div className="legal-content">
        <section>
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly, such as your name,
            email address, resume data, and assessment responses. We also
            collect limited technical data to improve platform performance.
          </p>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To deliver skill-based hiring and assessments</li>
            <li>To personalize job recommendations</li>
            <li>To improve fairness, security, and performance</li>
          </ul>
        </section>

        <section>
          <h2>3. Data Protection & Security</h2>
          <p>
            HireFold uses industry-standard security practices including
            encryption, access control, and monitored infrastructure to
            protect your data.
          </p>
        </section>

        <section>
          <h2>4. Sharing of Information</h2>
          <p>
            We never sell personal data. Information is shared only with
            authorized recruiters or service providers strictly for hiring
            purposes.
          </p>
        </section>

        <section>
          <h2>5. Your Rights</h2>
          <p>
            You may access, update, or request deletion of your data at any
            time by contacting our support team.
          </p>
        </section>

        <section>
          <h2>6. Updates to This Policy</h2>
          <p>
            This policy may be updated periodically. Continued use of HireFold
            indicates acceptance of the revised policy.
          </p>
        </section>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
