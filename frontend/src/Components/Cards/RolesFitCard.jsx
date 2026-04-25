import React from "react";
import { Link } from "react-router-dom";

import "../../Styles/rolesThatFit.css";

import FrontendDeveloper from "../../Assets/FrontendDeveloper.png";
import BackendDeveloper from "../../Assets/BackendDeveloper.png";
import DataAnalyst from "../../Assets/DataAnalyst.png";

const roles = [
  {
    title: "Frontend Developer",
    description: "Build responsive and interactive user interfaces.",
    image: FrontendDeveloper,
    icon: "",
    skills: ["React", "TypeScript", "TailwindCSS"],
  },
  {
    title: "Backend Developer",
    description: "Develop scalable backend systems and APIs.",
    image: BackendDeveloper,
    icon: "",
    skills: ["Node.js", "Python", "PostgreSQL"],
  },
  {
    title: "Data Analyst",
    description: "Analyze data to generate business insights.",
    image: DataAnalyst,
    icon: "",
    skills: ["SQL", "Python", "Tableau"],
  },
];

const RolesThatFitCard = () => {
  return (
    <section className="section-surface">
      <div className="roles-fit-grid">
        {roles.map((role, index) => (
          <Link
            key={role.title}
            to="/jobs"
            className="roles-fit-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="roles-fit-card-inner">
              <div className="roles-fit-card-glow" />
              
              <div className="roles-fit-card__image-wrapper">
                <img
                  src={role.image}
                  alt={role.title}
                  className="roles-fit-card__image"
                />
                <div className="roles-fit-card__icon-badge">
                  <span>{role.icon}</span>
                </div>
              </div>

              <div className="roles-fit-card__body">
                <h3 className="roles-fit-card__title">{role.title}</h3>
                <p className="roles-fit-card__description">{role.description}</p>
                
                <div className="roles-fit-card__skills">
                  {role.skills.map((skill) => (
                    <span key={skill} className="roles-fit-card__skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="roles-fit-card__footer">
                  <span className="roles-fit-card__cta">Explore Opportunities </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RolesThatFitCard;
