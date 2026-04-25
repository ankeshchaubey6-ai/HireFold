import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/exploreCareerDomains.css";
import "../../Styles/sectionSurface.css";

import FrontendDevelopment from "../../Assets/FrontendDevelopment.png";
import BackendDevelopment from "../../Assets/BackendDevelopment.png";
import DataScience from "../../Assets/DataScience.png";
import UIUXDesign from "../../Assets/UIUXDesign.png";

const domains = [
  {
    title: "Frontend Development",
    description: "Build modern, interactive user interfaces with React and modern frameworks.",
    image: FrontendDevelopment,
    badge: "Popular",
    badgeColor: "#e50914",
    stats: "24+ jobs",
    salary: "$70k - $110k",
    technologies: "React  Vue  Angular"
  },
  {
    title: "Backend Development",
    description: "Design scalable APIs and server-side logic with robust architecture.",
    image: BackendDevelopment,
    badge: "High Demand",
    badgeColor: "#f59e0b",
    stats: "18+ jobs",
    salary: "$75k - $120k",
    technologies: "Node  Python  Java"
  },
  {
    title: "Data Science",
    description: "Analyze data to drive smarter decisions using ML and AI.",
    image: DataScience,
    badge: "Trending",
    badgeColor: "#10b981",
    stats: "12+ jobs",
    salary: "$80k - $130k",
    technologies: "Python  ML  SQL"
  },
  {
    title: "UI UX Design",
    description: "Craft intuitive and user-focused designs with modern tools.",
    image: UIUXDesign,
    badge: "Creative",
    badgeColor: "#8b5cf6",
    stats: "15+ jobs",
    salary: "$65k - $105k",
    technologies: "Figma  Adobe XD  Sketch"
  },
];

const CareerDomainCard = ({ isLoading = false, variant = "default" }) => {
  if (isLoading) {
    return (
      <section className="section-surface">
        <div className="section-surface__inner">
          <div className="explore-domains-grid">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="explore-domain-card-skeleton">
                <div className="explore-domain-card-skeleton-inner">
                  <div className="skeleton-image" />
                  <div className="skeleton-body">
                    <div className="skeleton-title" />
                    <div className="skeleton-description" />
                    <div className="skeleton-tech" />
                    <div className="skeleton-footer" />
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
        <div className="explore-domains-grid">
          {domains.map((domain, index) => (
            <Link
              key={domain.title}
              to="/jobs"
              className="explore-domain-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="explore-domain-card-inner">
                <div className="explore-domain-card-glow" />
                <div className="explore-domain-card-corner-accent" />
                
                <div className="explore-domain-card__image-wrapper">
                  <img
                    src={domain.image}
                    alt={domain.title}
                    className="explore-domain-card__image"
                  />
                  {domain.badge && (
                    <div 
                      className="explore-domain-card__badge" 
                      style={{ background: domain.badgeColor }}
                    >
                      {domain.badge}
                    </div>
                  )}
                  <div className="explore-domain-card__stats-badge">
                    {domain.stats}
                  </div>
                </div>

                <div className="explore-domain-card__body">
                  <div className="explore-domain-card__header">
                    <h3 className="explore-domain-card__title">
                      {domain.title}
                    </h3>
                  </div>

                  <p className="explore-domain-card__description">
                    {domain.description}
                  </p>

                  <div className="explore-domain-card__technologies">
                    <span className="tech-icon"></span>
                    <span className="tech-text">{domain.technologies}</span>
                  </div>

                  <div className="explore-domain-card__divider" />
                  
                  <div className="explore-domain-card__footer">
                    <div className="explore-domain-card__salary">
                      <span className="salary-icon"></span>
                      <span className="salary-text">{domain.salary}</span>
                    </div>
                    <div className="explore-domain-card__arrow">
                      Explore 
                    </div>
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

export default CareerDomainCard;
