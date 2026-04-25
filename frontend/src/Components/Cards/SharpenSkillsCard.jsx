import React from "react";
import { Link } from "react-router-dom";

import "../../Styles/sharpenSkills.css";

import MockInterviews from "../../Assets/MockInterviews.png";
import PracticeAssessments from "../../Assets/PracticeAssessments.png";
import ResumeImprovementTips from "../../Assets/ResumeImprovementTips.png";

const skills = [
  {
    title: "Mock Interviews",
    description: "Practice real interview scenarios with experts and get instant feedback",
    image: MockInterviews,
    icon: "",
    duration: "30-45 min",
    badge: "Popular",
  },
  {
    title: "Practice Assessments",
    description: "Test your skills with curated assessments and track your progress",
    image: PracticeAssessments,
    icon: "",
    duration: "20-30 min",
    badge: "New",
  },
  {
    title: "Resume Improvement Tips",
    description: "Improve your resume to stand out to recruiters with AI-powered suggestions",
    image: ResumeImprovementTips,
    icon: "",
    duration: "15-20 min",
    badge: "Recommended",
  },
];

const SharpenSkillsCard = () => {
  return (
    <section className="section-surface">
      <div className="sharpen-skills-grid">
        {skills.map((skill, index) => (
          <Link
            key={skill.title}
            to="/dashboard"
            className="sharpen-skills-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="sharpen-skills-card-inner">
              <div className="sharpen-skills-card-glow" />
              
              <div className="sharpen-skills-card__image-wrapper">
                <img
                  src={skill.image}
                  alt={skill.title}
                  className="sharpen-skills-card__image"
                />
                <div className="sharpen-skills-card__badge">
                  <span className={`badge-${skill.badge.toLowerCase()}`}>
                    {skill.badge}
                  </span>
                </div>
                <div className="sharpen-skills-card__icon-badge">
                  <span>{skill.icon}</span>
                </div>
              </div>

              <div className="sharpen-skills-card__body">
                <div className="sharpen-skills-card__header">
                  <h3 className="sharpen-skills-card__title">{skill.title}</h3>
                  <span className="sharpen-skills-card__duration">{skill.duration}</span>
                </div>
                <p className="sharpen-skills-card__description">{skill.description}</p>
                <div className="sharpen-skills-card__footer">
                  <span className="sharpen-skills-card__cta">Start Learning </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SharpenSkillsCard;
