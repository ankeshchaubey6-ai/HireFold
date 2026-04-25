import React from "react";
import { Link } from "react-router-dom";

import "../../Styles/hiringJourney.css";

import UpcomingInterviews from "../../Assets/UpcomingInterviews.png";
import PendingAssessments from "../../Assets/PendingAssessments.png";
import InterviewCompleted from "../../Assets/InterviewCompleted.png";
import OfferReceived from "../../Assets/OfferReceived.png";

const journeySteps = [
  {
    title: "Upcoming Interviews",
    description: "View and prepare for your scheduled interviews",
    image: UpcomingInterviews,
    icon: "",
    status: "3 scheduled",
    badge: "Upcoming",
  },
  {
    title: "Pending Assessments",
    description: "Complete assessments required by employers",
    image: PendingAssessments,
    icon: "",
    status: "2 pending",
    badge: "Action Needed",
  },
  {
    title: "Interview Completed",
    description: "Track interviews you have already attended",
    image: InterviewCompleted,
    icon: "",
    status: "4 completed",
    badge: "Completed",
  },
  {
    title: "Offer Received",
    description: "Review offers received from companies",
    image: OfferReceived,
    icon: "",
    status: "1 offer",
    badge: "New",
  },
];

const HiringJourneyCard = () => {
  return (
    <section className="section-surface">
      <div className="hiring-journey-grid">
        {journeySteps.map((step, index) => (
          <Link
            key={step.title}
            to="/dashboard"
            className="hiring-journey-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="hiring-journey-card-inner">
              <div className="hiring-journey-card-glow" />
              
              <div className="hiring-journey-card__image-wrapper">
                <img
                  src={step.image}
                  alt={step.title}
                  className="hiring-journey-card__image"
                />
                <div className="hiring-journey-card__badge">
                  <span className={`badge-${step.badge.toLowerCase().replace(' ', '-')}`}>
                    {step.badge}
                  </span>
                </div>
                <div className="hiring-journey-card__icon-badge">
                  <span>{step.icon}</span>
                </div>
              </div>

              <div className="hiring-journey-card__body">
                <div className="hiring-journey-card__header">
                  <h3 className="hiring-journey-card__title">{step.title}</h3>
                  <span className="hiring-journey-card__status">{step.status}</span>
                </div>
                <p className="hiring-journey-card__description">{step.description}</p>
                <div className="hiring-journey-card__footer">
                  <span className="hiring-journey-card__cta">View Details </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HiringJourneyCard;
