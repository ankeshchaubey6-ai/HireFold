import React from "react";
import { Link } from "react-router-dom";

import "../../Styles/inDemandRoles.css";
import "../../Styles/sectionSurface.css";

import FrontendEngineer from "../../Assets/FrontendEngineer.png";
import BackendEngineer from "../../Assets/BackendEngineer.png";
import FullStackDeveloper from "../../Assets/FullStackDeveloper.png";
import ProductManager from "../../Assets/ProductManager.png";

const roles = [
  {
    title: "Frontend Engineer",
    demand: "High Demand",
    demandColor: "#e50914",
    image: FrontendEngineer,
    description:
      "Build modern user interfaces with performance and accessibility in mind.",
    meta: "React  UI  Performance",
    salary: "$80k - $120k",
    openings: "24 openings"
  },
  {
    title: "Backend Engineer",
    demand: "High Demand",
    demandColor: "#e50914",
    image: BackendEngineer,
    description:
      "Design scalable APIs and reliable server-side systems.",
    meta: "Node  APIs  Databases",
    salary: "$85k - $130k",
    openings: "18 openings"
  },
  {
    title: "Full Stack Developer",
    demand: "Trending",
    demandColor: "#f59e0b",
    image: FullStackDeveloper,
    description:
      "Work across frontend and backend to deliver complete products.",
    meta: "MERN  DevOps  Cloud",
    salary: "$90k - $140k",
    openings: "32 openings"
  },
  {
    title: "Product Manager",
    demand: "Growing",
    demandColor: "#10b981",
    image: ProductManager,
    description:
      "Define product strategy and collaborate with cross-functional teams.",
    meta: "Roadmaps  UX  Stakeholders",
    salary: "$95k - $150k",
    openings: "12 openings"
  },
];

const InDemandRoleCard = ({ isLoading = false, variant = "default" }) => {
  if (isLoading) {
    return (
      <section className="section-surface">
        <div className="section-surface__inner">
          <div className="in-demand-grid">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="in-demand-card-skeleton">
                <div className="in-demand-card-skeleton-inner">
                  <div className="skeleton-image" />
                  <div className="skeleton-body">
                    <div className="skeleton-title" />
                    <div className="skeleton-description" />
                    <div className="skeleton-meta" />
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
        <div className="in-demand-grid">
          {roles.map((role, index) => (
            <Link
              key={role.title}
              to="/jobs"
              className="in-demand-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="in-demand-card-inner">
                <div className="in-demand-card-glow" />
                <div className="in-demand-card-corner-accent" />
                
                <div className="in-demand-card__image-wrapper">
                  <img
                    src={role.image}
                    alt={role.title}
                    className="in-demand-card__image"
                  />
                  <div className="in-demand-card__openings">
                    {role.openings}
                  </div>
                </div>

                <div className="in-demand-card__body">
                  <div className="in-demand-card__header">
                    <h3 className="in-demand-card__title">
                      {role.title}
                    </h3>
                    <div 
                      className="in-demand-card__badge" 
                      style={{ background: role.demandColor }}
                    >
                      {role.demand}
                    </div>
                  </div>

                  <p className="in-demand-card__description">
                    {role.description}
                  </p>

                  <div className="in-demand-card__meta">
                    <span className="meta-icon"></span>
                    <span>{role.meta}</span>
                  </div>

                  <div className="in-demand-card__divider" />

                  <div className="in-demand-card__footer">
                    <div className="in-demand-card__salary">
                      <span className="salary-icon"></span>
                      <span className="salary-text">{role.salary}</span>
                    </div>
                    <div className="in-demand-card__cta">
                      Apply Now 
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

export default InDemandRoleCard;
