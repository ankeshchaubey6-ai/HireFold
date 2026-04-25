import React from "react";
import { Link } from "react-router-dom";
import { CardSkeleton } from "../Common/SkeletonVariants";
import "../../Styles/candidateMatchCard.css";

const CandidateMatchCard = ({
  title,
  description,
  image,
  meta,
  to,
  isLoading = false,
  matchScore = 85,
  skills = ["React", "TypeScript", "Node.js"],
  aiInsight = "Strong technical alignment with job requirements",
  index = 0,
}) => {
  if (isLoading) {
    return <CardSkeleton />;
  }

  const Wrapper = to ? Link : "div";

  // Calculate match dots (5 dots based on score)
  const matchDots = Math.round(matchScore / 20);

  return (
    <Wrapper 
      to={to} 
      className="cm-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="cm-card-inner">
        <div className="cm-card-glow" />
        
        <div className="cm-card-image-wrapper">
          <img
            src={image}
            alt={title}
            className="cm-card-image"
          />
          
          {/* Match Score Badge */}
          <div className="cm-card-match-score">
            <span className="cm-card-match-score-value">{matchScore}%</span>
            <span className="cm-card-match-score-label">Match</span>
          </div>
          
          {/* AI Badge */}
          <div className="cm-card-ai-badge">
            <span></span>
            <span>AI Assessed</span>
          </div>
        </div>

        <div className="cm-card-body">
          <div className="cm-card-title">
            {title}
            <div className="cm-card-match-indicator">
              {[1, 2, 3, 4, 5].map((dot) => (
                <div 
                  key={dot} 
                  className={`cm-card-match-dot ${dot <= matchDots ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>

          <p className="cm-card-description">
            {description}
          </p>

          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <div className="cm-card-skills">
              {skills.map((skill) => (
                <span key={skill} className="cm-card-skill">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* AI Insight */}
          <div className="cm-card-ai-insight">
            <p className="cm-card-ai-insight-text">
              {aiInsight}
            </p>
          </div>

          <div className="cm-card-divider" />

          <p className="cm-card-subtext">
            AI-driven evaluation based on resume quality,
            skills alignment, and job relevance.
          </p>

          <div className="cm-card-actions">
            <button className="cm-card-btn">
              View Candidates 
            </button>

            {meta && (
              <span className="cm-card-meta">
                {meta}
              </span>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default CandidateMatchCard;
