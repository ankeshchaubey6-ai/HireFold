import React, { useState } from "react";
import "../../Styles/faq.css";

/* Assets already available */
import FAQBanner from "../../Assets/ResumeImprovementTips.png";
import InterviewGuide from "../../Assets/InterviewCompleted.png";

const faqs = [
  {
    question: "What is HireFold?",
    answer:
      "HireFold is a modern hiring and career intelligence platform that helps candidates and recruiters make data-driven decisions through resume analysis, ATS compatibility scoring, interview readiness insights, and structured hiring workflows."
  },
  {
    question: "How does ATS compatibility scoring work?",
    answer:
      "HireFold analyzes resumes against industry-standard ATS parsing rules and role-based keyword relevance to generate an ATS compatibility score, helping candidates improve visibility and recruiters identify relevant profiles faster."
  },
  {
    question: "Is HireFold only for recruiters?",
    answer:
      "No. HireFold is designed for both candidates and recruiters. Candidates use it to optimize resumes and prepare for interviews, while recruiters use it to screen, evaluate, and hire talent efficiently."
  },
  {
    question: "What is interview readiness score?",
    answer:
      "Interview readiness score reflects how prepared a candidate is based on resume quality, skill alignment, and evaluation benchmarks. It helps candidates understand gaps and helps recruiters assess preparedness objectively."
  },
  {
    question: "Does HireFold support bias-free hiring?",
    answer:
      "Yes. HireFold promotes structured and merit-based hiring by focusing on skills, readiness, and performance indicators instead of subjective judgments."
  },
  {
    question: "Can I use HireFold for self-managed hiring?",
    answer:
      "Yes. Recruiters can choose between self-managed hiring or assisted hiring models depending on their hiring needs and level of support required."
  },
  {
    question: "Is my data secure on HireFold?",
    answer:
      "Data security and privacy are a top priority. HireFold follows secure data handling practices to ensure user information remains protected."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <main className="faq-page">

      {/* ================= HERO ================= */}
      <section className="faq-hero section-surface">
        <img
          src={FAQBanner}
          alt="Frequently asked questions"
          className="faq-hero-image"
        />

        <h1>Frequently Asked Questions</h1>
        <p className="faq-hero-subtitle">
          Find answers to common questions about HireFold, resumes, ATS scoring,
          interviews, and hiring workflows.
        </p>
      </section>

      {/* ================= FAQ LIST ================= */}
      <section className="faq-section section-surface">
        <h2>General Questions</h2>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${
                activeIndex === index ? "active" : ""
              }`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span className="faq-icon">
                  {activeIndex === index ? "" : "+"}
                </span>
              </button>

              {activeIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= SUPPORT NOTE ================= */}
      <section className="faq-split section-surface">
        <div className="faq-text">
          <h2>Still Have Questions?</h2>
          <p>
            If you couldnt find the answer you were looking for, feel free to
            reach out to our support team. Were always happy to help.
          </p>
          <p>
            HireFold is continuously evolving, and we update our FAQs regularly
            based on user feedback.
          </p>
        </div>

        <img
          src={InterviewGuide}
          alt="Interview guidance and support"
          className="faq-image"
        />
      </section>

    </main>
  );
};

export default FAQ;

