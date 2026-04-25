import React from "react";
import "../../Styles/terms.css";

const Terms = () => {
  return (
    <section className="legal-page">
      <header className="legal-hero">
        <h1>Terms & Conditions</h1>
        <p>
          These terms govern your use of the HireFold platform. Please read
          them carefully.
        </p>
      </header>

      <div className="legal-content">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using HireFold, you agree to be bound by these
            Terms & Conditions.
          </p>
        </section>

        <section>
          <h2>2. Platform Usage</h2>
          <p>
            HireFold may only be used for lawful hiring, assessments, and
            recruitment activities. Misuse or manipulation is strictly
            prohibited.
          </p>
        </section>

        <section>
          <h2>3. Candidate Responsibilities</h2>
          <p>
            Candidates must provide accurate information and complete
            assessments honestly. Any attempt to bypass evaluation systems
            may result in account termination.
          </p>
        </section>

        <section>
          <h2>4. Recruiter Responsibilities</h2>
          <p>
            Recruiters agree to use HireFold fairly and in compliance with
            equal opportunity laws and ethical hiring standards.
          </p>
        </section>

        <section>
          <h2>5. Intellectual Property</h2>
          <p>
            All content, designs, and systems on HireFold are the intellectual
            property of HireFold and may not be copied or redistributed.
          </p>
        </section>

        <section>
          <h2>6. Limitation of Liability</h2>
          <p>
            HireFold is not liable for hiring decisions made by employers or
            outcomes resulting from platform usage.
          </p>
        </section>

        <section>
          <h2>7. Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate
            these terms.
          </p>
        </section>

        <section>
          <h2>8. Changes to Terms</h2>
          <p>
            Terms may be updated periodically. Continued use indicates
            acceptance of revised terms.
          </p>
        </section>
      </div>
    </section>
  );
};

export default Terms;
