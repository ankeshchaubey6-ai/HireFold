// src/Components/ResumeAnalysis/Header/AnalysisHeader.jsx

import React from "react";
import PropTypes from "prop-types";

/* =========================================================
   AnalysisHeader
   ---------------------------------------------------------
   Top-level header for Resume Analysis page.
   - Title + subtitle
   - Optional right slot for controls / meta
========================================================= */

const AnalysisHeader = ({
  title,
  subtitle,
  rightSlot,
}) => {
  return (
    <header className="analysis-header">
      <div className="analysis-header-left">
        <h1 className="analysis-title">{title}</h1>
        {subtitle && (
          <p className="analysis-subtitle">{subtitle}</p>
        )}
      </div>

      {rightSlot && (
        <div className="analysis-header-right">
          {rightSlot}
        </div>
      )}
    </header>
  );
};

AnalysisHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  rightSlot: PropTypes.node,
};

export default AnalysisHeader;
