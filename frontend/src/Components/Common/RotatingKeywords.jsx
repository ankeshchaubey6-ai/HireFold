import React, { useEffect, useRef, useState } from "react";
import "../../Styles/rotatingKeywords.css";

const RotatingKeywords = ({ words = [] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef(null);

  if (!words.length) return null;

  // Duplicate words for seamless infinite scroll
  const duplicatedWords = [...words, ...words, ...words];

  return (
    <div className="rotating-keywords-premium-wrapper">
      {/* Decorative gradient background */}
      <div className="rotating-keywords-premium__bg"></div>
      
      <div className="rotating-keywords-premium__container">
        {/* Left decorative element */}
        <div className="rotating-keywords-premium__decor rotating-keywords-premium__decor--left">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Main Marquee */}
        <div 
          className="rotating-keywords-premium__marquee"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            ref={trackRef}
            className={`rotating-keywords-premium__track ${isHovered ? 'paused' : ''}`}
          >
            {duplicatedWords.map((word, index) => (
              <div 
                key={index} 
                className="rotating-keywords-premium__item"
                data-text={word}
              >
                <span className="rotating-keywords-premium__keyword">
                  {word}
                </span>
                <span className="rotating-keywords-premium__separator">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="4" fill="currentColor"/>
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right decorative element */}
        <div className="rotating-keywords-premium__decor rotating-keywords-premium__decor--right">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M13 7L18 12L13 17M6 7L11 12L6 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="rotating-keywords-premium__stats">
        <div className="rotating-keywords-premium__stat-item">
          <span className="rotating-keywords-premium__stat-value">10K+</span>
          <span className="rotating-keywords-premium__stat-label">Active Jobs</span>
        </div>
        <div className="rotating-keywords-premium__stat-divider"></div>
        <div className="rotating-keywords-premium__stat-item">
          <span className="rotating-keywords-premium__stat-value">500+</span>
          <span className="rotating-keywords-premium__stat-label">Companies</span>
        </div>
        <div className="rotating-keywords-premium__stat-divider"></div>
        <div className="rotating-keywords-premium__stat-item">
          <span className="rotating-keywords-premium__stat-value">4.9/5</span>
          <span className="rotating-keywords-premium__stat-label">Rating</span>
        </div>
      </div>
    </div>
  );
};

export default RotatingKeywords;