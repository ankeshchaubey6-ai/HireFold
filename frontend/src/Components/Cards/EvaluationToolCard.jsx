import React from "react";
import { CardSkeleton } from "../Common/SkeletonVariants";
import "../../Styles/evaluationToolCard.css";

const EvaluationToolCard = ({
  title,
  description,
  image,
  meta,
  isLoading = false,
  index = 0,
  badge = "Coming Soon",
  progress,
  variant = "default",
}) => {
  if (isLoading) {
    return <CardSkeleton />;
  }

  return (
    <div 
      className={`et-card ${variant === "featured" ? "et-card--featured" : ""}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="et-card-inner">
        <div className="et-card-glow" />
        <div className="et-card-corner-accent" />
        
        <div className="et-card-image-wrapper">
          <img
            src={image}
            alt={title}
            className="et-card-image"
          />
          {badge && (
            <div className="et-card-badge">
              {badge}
            </div>
          )}
        </div>

        <div className="et-card-body">
          <div className="et-card-header">
            <h3 className="et-card-title">{title}</h3>
            {meta && (
              <span className="et-card-meta-chip">{meta}</span>
            )}
          </div>

          <p className="et-card-description">{description}</p>

          {/* Optional Progress Bar */}
          {progress && (
            <div className="et-card-progress">
              <div className="et-card-progress-bar">
                <div 
                  className="et-card-progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="et-card-progress-text">{progress}%</span>
            </div>
          )}

          <div className="et-card-divider" />

          <p className="et-card-subtext">
            Designed to ensure fairness, accuracy, and reliability throughout the hiring process.
          </p>

          <div className="et-card-actions">
            <button className="et-card-btn et-card-btn--disabled" disabled>
              Coming Soon
              <span className="et-card-btn-icon"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationToolCard;
