import React from "react";
import { Link } from "react-router-dom";
import { footerConfig } from "./footerConfig";
import "./Footer.css";

const Footer = ({ role = "public" }) => {
  const config = footerConfig[role];

  const roleText =
    role === "recruiter"
      ? "Built for Recruiters"
      : role === "candidate"
      ? "Built for Candidates"
      : "Built for Candidates & Recruiters";

  return (
    <footer className="hf-footer">
      <div className="hf-footer-divider" />

      <div className="hf-footer-grid">
        <FooterSection title="About" items={config.about} />
        <FooterSection title="Explore" items={config.explore} />
        <FooterSection title="Support" items={config.support} />
        <FooterSection title="Legal" items={config.legal} />
      </div>

      <div className="hf-footer-bottom">
        <p>
          {roleText}
          <span>  </span>
          <strong>HireFold</strong>
          <span>  </span>
           {new Date().getFullYear()} All rights reserved
        </p>
      </div>
    </footer>
  );
};

const FooterSection = ({ title, items }) => (
  <div className="hf-footer-section">
    <h4>{title}</h4>
    <ul>
      {items.map((item) => (
        <li key={item.to}>
          <Link to={item.to}>{item.label}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;

