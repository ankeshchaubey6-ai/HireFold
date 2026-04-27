import React from "react";
import PropTypes from "prop-types";

const KeywordGapPanel = ({ keywordGap }) => {
  const found = Array.isArray(keywordGap?.foundKeywords)
    ? keywordGap.foundKeywords
    : [];
  const missing = Array.isArray(keywordGap?.missingKeywords)
    ? keywordGap.missingKeywords
    : [];
  const suggested = Array.isArray(keywordGap?.suggestedKeywords)
    ? keywordGap.suggestedKeywords
    : [];
  const safeConfidence = Math.min(1, Math.max(0, Number(keywordGap?.confidence) || 0));

  return (
    <div className="keyword-gap-panel">
      <div className="keyword-gap-grid">
        <div className="keyword-gap-card">
          <h4 className="keyword-gap-title">Found Keywords</h4>
          {found.length === 0 ? (
            <p className="keyword-empty">No role keywords were matched yet.</p>
          ) : (
            <div className="keyword-chip-grid">
              {found.map((keyword) => (
                <span key={keyword} className="keyword-chip keyword-chip-suggested">
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="keyword-gap-card">
          <h4 className="keyword-gap-title">Missing Keywords</h4>
          {missing.length === 0 ? (
            <p className="keyword-empty">No major keyword gaps detected.</p>
          ) : (
            <div className="keyword-chip-grid">
              {missing.map((keyword) => (
                <span key={keyword} className="keyword-chip">
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="keyword-gap-card">
          <h4 className="keyword-gap-title">Suggested Keywords</h4>
          {suggested.length === 0 ? (
            <p className="keyword-empty">No additional suggestions.</p>
          ) : (
            <div className="keyword-chip-grid">
              {suggested.map((keyword) => (
                <span key={keyword} className="keyword-chip keyword-chip-suggested">
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="keyword-confidence-bar">
        <div className="confidence-track">
          <div
            className="confidence-fill"
            style={{ width: `${safeConfidence * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

KeywordGapPanel.propTypes = {
  keywordGap: PropTypes.shape({
    foundKeywords: PropTypes.arrayOf(PropTypes.string),
    missingKeywords: PropTypes.arrayOf(PropTypes.string),
    suggestedKeywords: PropTypes.arrayOf(PropTypes.string),
    confidence: PropTypes.number,
  }),
};

export default KeywordGapPanel;
