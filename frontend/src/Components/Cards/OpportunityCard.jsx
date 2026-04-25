import React from "react";
import { Link } from "react-router-dom";

import "../../Styles/opportunities.css";
import "../../Styles/sectionSurface.css";

import ResumeBasedMatches from "../../Assets/ResumeBasedMatches.png";
import SkillAlignedJobs from "../../Assets/SkillAlignedJobs.png";
import CareerRecommendations from "../../Assets/CareerRecommendations.png";

const opportunities = [
  {
    title: "Resume Based Matches",
    description: "Jobs intelligently matched using your resume with AI-powered precision.",
    tag: "Recommended",
    tagColor: "#e50914",
    image: ResumeBasedMatches,
    stats: "2,345+ matches",
    cta: "Find Matches "
  },
  {
    title: "Skill Aligned Jobs",
    description: "Opportunities aligned perfectly with your skills and experience level.",
    tag: "Trending",
    tagColor: "#f59e0b",
    image: SkillAlignedJobs,
    stats: "1,892+ jobs",
    cta: "View Jobs "
  },
  {
    title: "Career Recommendations",
    description: "Personalized career paths to help you grow faster and achieve your goals.",
    tag: "New",
    tagColor: "#10b981",
    image: CareerRecommendations,
    stats: "Available now",
    cta: "Get Started "
  },
];

const OpportunityCard = ({ isLoading = false, variant = "default" }) => {
  if (isLoading) {
    return (
      <section className="section-surface">
        <div className="section-surface__inner">
          <div className="opportunities-grid">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="opportunity-card-skeleton">
                <div className="opportunity-card-skeleton-inner">
                  <div className="skeleton-image" />
                  <div className="skeleton-body">
                    <div className="skeleton-title" />
                    <div className="skeleton-description" />
                    <div className="skeleton-stats" />
                    <div className="skeleton-cta" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`section-surface ${variant === "featured" ? "section-surface--featured" : ""}`}>
      <div className="section-surface__inner">
        <div className="opportunities-grid">
          {opportunities.map((item, index) => (
            <Link
              key={item.title}
              to="/login/candidate"
              className="opportunity-card"
              style={{ animationDelay: `${index * 0.1}s` }}
              aria-label={item.title}
            >
              <div className="opportunity-card-inner">
                <div className="opportunity-card-glow" />
                <div className="opportunity-card-corner-accent" />
                
                <div className="opportunity-card__image-wrapper">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="opportunity-card__image"
                  />
                  <div 
                    className="opportunity-card__tag"
                    style={{ background: item.tagColor }}
                  >
                    {item.tag}
                  </div>
                  <div className="opportunity-card__stats">
                    {item.stats}
                  </div>
                </div>

                <div className="opportunity-card__body">
                  <h3 className="opportunity-card__title">
                    {item.title}
                  </h3>
                  <p className="opportunity-card__desc">
                    {item.description}
                  </p>
                  
                  <div className="opportunity-card__divider" />
                  
                  <div className="opportunity-card__footer">
                    <span className="opportunity-card__cta">
                      {item.cta}
                    </span>
                    <span className="opportunity-card__arrow"></span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpportunityCard;
