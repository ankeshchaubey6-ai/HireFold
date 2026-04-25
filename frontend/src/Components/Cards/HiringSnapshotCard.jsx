import React from "react";
import { Link } from "react-router-dom";
import { CardSkeleton } from "../Common/SkeletonVariants";
import "../../Styles/hiringSnapshotCard.css";

const HiringSnapshotCard = ({
  title,
  description,
  image,
  meta,
  to,
  isLoading = false,
  index = 0,
  progress = 65,
  badge = "Active",
  stats = "24 updates",
}) => {
  if (isLoading) {
    return <CardSkeleton />;
  }

  const Wrapper = to ? Link : "div";

  return (
    <Wrapper
      to={to}
      className="hs-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="hs-card-inner">
        <div className="hs-card-glow" />
        <div className="hs-card-corner-accent" />
        
        <div className="hs-card-image-wrapper">
          <img
            src={image}
            alt={title}
            className="hs-card-image"
          />
          {badge && (
            <div className="hs-card-badge">
              {badge}
            </div>
          )}
          {stats && (
            <div className="hs-card-stats">
              {stats} <span>updates</span>
            </div>
          )}
        </div>

        <div className="hs-card-body">
          <div className="hs-card-header">
            <h3 className="hs-card-title">
              {title}
            </h3>
          </div>

          <p className="hs-card-description">
            {description}
          </p>

          {/* Progress Bar Section */}
          {progress && (
            <div className="hs-card-progress">
              <div className="hs-card-progress-header">
                <span>Completion Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="hs-card-progress-bar">
                <div 
                  className="hs-card-progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="hs-card-divider" />

          <p className="hs-card-subtext">
            Monitor activity, track progress, and take quick actions
          </p>

          <div className="hs-card-actions">
            <button className="hs-card-btn">
              View Details 
            </button>

            {meta && (
              <span className="hs-card-meta">
                {meta}
              </span>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default HiringSnapshotCard;
