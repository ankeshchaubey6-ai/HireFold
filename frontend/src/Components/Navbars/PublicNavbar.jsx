import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../Context/ThemeContext";
import { useSiteSearch } from "../../hooks/useSiteSearch";
import Modal from "../Common/Modal";
import "./PublicNavbar.css";

const PublicNavbar = () => {
  const [open, setOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { suggestions, hasResults, isEmptyQuery } = useSiteSearch(searchQuery);

  // Detect auth pages
  const isAuthPage =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");

  return (
    <>
      <header className="public-navbar">
        <div className="public-navbar__inner">
          {/* LEFT */}
          <div className="public-navbar__left">
            <button
              className="public-navbar__hamburger"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              
            </button>

            <Link to="/" className="public-navbar__logo">
              HireFold
            </Link>
          </div>

          {/* CENTER */}
          {!isAuthPage && (
            <nav
              className="public-navbar__center"
              aria-label="Primary navigation"
            >
              <Link to="/">Home</Link>
              <Link to="/jobs">Jobs</Link>
              <Link to="/interviews">Interviews</Link>
              <Link to="/about">About</Link>
            </nav>
          )}

          {/* RIGHT */}
          <div className="public-navbar__right">
            {!isAuthPage && (
              <>
                <div className="public-navbar__search">
                  <input
                    type="text"
                    placeholder="Search jobs, skills..."
                    aria-label="Search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim()) {
                        navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
                        setShowSuggestions(false);
                      } else if (e.key === "Escape") {
                        setShowSuggestions(false);
                      }
                    }}
                    onFocus={() => searchQuery && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={showSuggestions && !isEmptyQuery}
                  />
                  {showSuggestions && !isEmptyQuery && (
                    <div className="search-suggestions" role="listbox">
                      {hasResults ? (
                        suggestions.map((suggestion, index) => (
                          <div
                            key={suggestion.route}
                            className="search-suggestion-item"
                            role="option"
                            onClick={() => {
                              navigate(`${suggestion.route}?search=${encodeURIComponent(searchQuery)}`);
                              setSearchQuery("");
                              setShowSuggestions(false);
                            }}
                          >
                            {suggestion.label}
                          </div>
                        ))
                      ) : (
                        <div className="search-no-results">
                          No results found for "{searchQuery}"
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* CREATE ACCOUNT  opens auth chooser */}
                <button
                  className="public-navbar__create hrf-premium-btn"
                  onClick={() => setAuthModalOpen(true)}
                >
                  Create Account
                </button>
              </>
            )}

            <button
              className="public-navbar__theme"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </header>

      {/* AUTH SELECTION MODAL */}
      {authModalOpen && (
        <Modal
          title="Continue as"
          onClose={() => setAuthModalOpen(false)}
        >
          <div className="auth-choice-container">
            <h3 className="auth-choice-title">Continue as</h3>
            
            {/* CANDIDATE GROUP */}
            <div className="auth-choice-group">
              <h4 className="auth-choice-group-label"> Candidate</h4>
              <div className="auth-choice-group-items">
                <Link
                  to="/login/candidate"
                  onClick={() => setAuthModalOpen(false)}
                  className="auth-choice-btn auth-choice-btn--login"
                >
                  <span className="auth-choice-btn-label">Login</span>
                  <span className="auth-choice-btn-desc">Sign in to your account</span>
                </Link>

                <Link
                  to="/register/candidate"
                  onClick={() => setAuthModalOpen(false)}
                  className="auth-choice-btn auth-choice-btn--register hrf-premium"
                >
                  <span className="auth-choice-btn-label">Register</span>
                  <span className="auth-choice-btn-desc">Create a new account</span>
                </Link>
              </div>
            </div>

            {/* RECRUITER GROUP */}
            <div className="auth-choice-group">
              <h4 className="auth-choice-group-label"> Recruiter</h4>
              <div className="auth-choice-group-items">
                <Link
                  to="/login/recruiter"
                  onClick={() => setAuthModalOpen(false)}
                  className="auth-choice-btn auth-choice-btn--login"
                >
                  <span className="auth-choice-btn-label">Login</span>
                  <span className="auth-choice-btn-desc">Sign in to your account</span>
                </Link>

                <Link
                  to="/register/recruiter"
                  onClick={() => setAuthModalOpen(false)}
                  className="auth-choice-btn auth-choice-btn--register hrf-premium"
                >
                  <span className="auth-choice-btn-label">Register</span>
                  <span className="auth-choice-btn-desc">Create a new account</span>
                </Link>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* HAMBURGER DRAWER */}
      {open && (
        <div
          className="public-drawer-overlay"
          onClick={() => setOpen(false)}
        >
          <aside
            className="public-drawer"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* PRIMARY NAVIGATION */}
            <nav className="public-drawer-nav-main">
              <Link to="/" onClick={() => setOpen(false)}> Home</Link>
              <Link to="/jobs" onClick={() => setOpen(false)}> Jobs</Link>
              <Link to="/interviews" onClick={() => setOpen(false)}> Interviews</Link>
              <Link to="/about" onClick={() => setOpen(false)}> About</Link>
            </nav>

            {/* AUTHENTICATION */}
            <div className="public-drawer-section">
              <button
                className="public-drawer-toggle"
                onClick={() =>
                  setExpandedSection(expandedSection === "auth" ? null : "auth")
                }
              >
                 Authentication
                <span className="public-drawer-toggle-icon">
                  {expandedSection === "auth" ? "" : "+"}
                </span>
              </button>

              {expandedSection === "auth" && (
                <div className="public-drawer-items">
                  <Link to="/login/candidate" onClick={() => setOpen(false)}>Candidate Login</Link>
                  <Link to="/login/recruiter" onClick={() => setOpen(false)}>Recruiter Login</Link>
                  <Link to="/register/candidate" onClick={() => setOpen(false)}>Candidate Register</Link>
                  <Link to="/register/recruiter" onClick={() => setOpen(false)}>Recruiter Register</Link>
                </div>
              )}
            </div>

            {/* INTERVIEW & TEST */}
            <div className="public-drawer-section">
              <button
                className="public-drawer-toggle"
                onClick={() =>
                  setExpandedSection(
                    expandedSection === "interview" ? null : "interview"
                  )
                }
              >
                 Interview & Test
                <span className="public-drawer-toggle-icon">
                  {expandedSection === "interview" ? "" : "+"}
                </span>
              </button>

              {expandedSection === "interview" && (
                <div className="public-drawer-items">
                  <Link to="/interview" onClick={() => setOpen(false)}>Interview</Link>
                  <Link to="/test" onClick={() => setOpen(false)}>Test</Link>
                </div>
              )}
            </div>

            {/* PRICING */}
            <div className="public-drawer-section">
              <button
                className="public-drawer-toggle"
                onClick={() =>
                  setExpandedSection(
                    expandedSection === "pricing" ? null : "pricing"
                  )
                }
              >
                 Pricing & Plans
                <span className="public-drawer-toggle-icon">
                  {expandedSection === "pricing" ? "" : "+"}
                </span>
              </button>

              {expandedSection === "pricing" && (
                <div className="public-drawer-items">
                  <Link to="/pricing" onClick={() => setOpen(false)}>
                    Pricing & Plans
                  </Link>
                </div>
              )}
            </div>

            {/* SUPPORT */}
            <div className="public-drawer-section">
              <button
                className="public-drawer-toggle"
                onClick={() =>
                  setExpandedSection(
                    expandedSection === "support" ? null : "support"
                  )
                }
              >
                 Support & Trust
                <span className="public-drawer-toggle-icon">
                  {expandedSection === "support" ? "" : "+"}
                </span>
              </button>

              {expandedSection === "support" && (
                <div className="public-drawer-items">
                  <Link to="/feedback" onClick={() => setOpen(false)}>Feedback</Link>
                  <Link to="/faq" onClick={() => setOpen(false)}>FAQ</Link>
                  <Link to="/stories" onClick={() => setOpen(false)}>Success Stories</Link>
                  <Link to="/security" onClick={() => setOpen(false)}>Security & Anti-Cheating</Link>
                </div>
              )}
            </div>

            {/* COMPANY */}
            <div className="public-drawer-section">
              <button
                className="public-drawer-toggle"
                onClick={() =>
                  setExpandedSection(
                    expandedSection === "company" ? null : "company"
                  )
                }
              >
                 Company
                <span className="public-drawer-toggle-icon">
                  {expandedSection === "company" ? "" : "+"}
                </span>
              </button>

              {expandedSection === "company" && (
                <div className="public-drawer-items">
                  <Link to="/about" onClick={() => setOpen(false)}>About Us</Link>
                  <Link to="/contact" onClick={() => setOpen(false)}>Contact Us</Link>
                  <Link to="/blogs" onClick={() => setOpen(false)}>Blogs</Link>
                  <Link to="/privacy" onClick={() => setOpen(false)}>Privacy Policy</Link>
                  <Link to="/terms" onClick={() => setOpen(false)}>Terms & Conditions</Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default PublicNavbar;

