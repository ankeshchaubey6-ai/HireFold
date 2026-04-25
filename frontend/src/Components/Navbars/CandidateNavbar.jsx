import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../Context/ThemeContext";
import { useSiteSearch } from "../../hooks/useSiteSearch";
import "./CandidateNavbar.css";
import { useAuth } from "../../Context/AuthContext";

const CandidateNavbar = () => {
  const [open, setOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { suggestions, hasResults, isEmptyQuery } =
    useSiteSearch(searchQuery);

  return (
    <>
      <header className="candidate-navbar">
        <div className="candidate-navbar__inner">
          {/* LEFT */}
          <div className="candidate-navbar__left">
            <button
              className="candidate-navbar__hamburger"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              
            </button>

            <Link to="/candidate" className="candidate-navbar__logo">
              Hirefold
            </Link>
          </div>

          {/* CENTER */}
          <nav
            className="candidate-navbar__center"
            aria-label="Candidate navigation"
          >
            <Link to="/candidate">Home</Link>
            <Link to="/candidate/jobs">Jobs</Link>
            <Link to="/candidate/resume">Resume</Link>
            <Link to="/candidate/interviews">Interviews</Link>
          </nav>

          {/* RIGHT */}
          <div className="candidate-navbar__right">
            {/* SEARCH */}
            <div className="candidate-navbar__search">
              <input
                type="text"
                placeholder="Search jobs, skills..."
                aria-label="Search jobs"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    navigate(
                      `/candidate/jobs?search=${encodeURIComponent(
                        searchQuery
                      )}`
                    );
                    setShowSuggestions(false);
                  } else if (e.key === "Escape") {
                    setShowSuggestions(false);
                  }
                }}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowSuggestions(false), 150)
                }
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={showSuggestions && !isEmptyQuery}
              />

              {showSuggestions && !isEmptyQuery && (
                <div className="search-suggestions" role="listbox">
                  {hasResults ? (
                    suggestions.map((suggestion) => (
                      <div
                        key={suggestion.route}
                        className="search-suggestion-item"
                        role="option"
                        onClick={() => {
                          navigate(
                            `${suggestion.route}?search=${encodeURIComponent(
                              searchQuery
                            )}`
                          );
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

            {/* NOTIFICATIONS */}
            <Link
              to="/candidate/notifications"
              className="candidate-navbar__icon"
              aria-label="Notifications"
            >
              
            </Link>

            {/* THEME TOGGLE */}
            <button
              className="candidate-navbar__theme"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {theme === "dark" ? "" : ""}
            </button>
          </div>
        </div>
      </header>

      {/* ================= DRAWER ================= */}
      {open && (
        <div
          className="candidate-drawer-overlay"
          onClick={() => setOpen(false)}
        >
          <aside
            className="candidate-drawer"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* PRIMARY NAVIGATION */}
            <nav className="candidate-drawer-nav-main">
              <Link to="/candidate" onClick={() => setOpen(false)}>
                 Home
              </Link>

              <Link to="/candidate/jobs" onClick={() => setOpen(false)}>
                 Jobs
              </Link>

              <Link to="/candidate/resume" onClick={() => setOpen(false)}>
                 Resume Builder
              </Link>

              <Link
                to="/candidate/my-resumes"
                onClick={() => setOpen(false)}
              >
                 My Resumes
              </Link>

              <Link
                to="/candidate/interviews"
                onClick={() => setOpen(false)}
              >
                 Interviews
              </Link>

              <Link
                to="/candidate/notifications"
                onClick={() => setOpen(false)}
              >
                 Notifications
              </Link>
            </nav>

            {/* ================= PROFILE SECTION ================= */}
            <div className="candidate-drawer-section">
              <button
                className="candidate-drawer-toggle"
                onClick={() =>
                  setExpandedSection(
                    expandedSection === "profile"
                      ? null
                      : "profile"
                  )
                }
                aria-expanded={expandedSection === "profile"}
              >
                 Profile
                <span className="candidate-drawer-toggle-icon">
                  {expandedSection === "profile" ? "" : "+"}
                </span>
              </button>

              {expandedSection === "profile" && (
                <div className="candidate-drawer-items">
                  <Link
                    to="/candidate/profile"
                    onClick={() => setOpen(false)}
                  >
                    Profile Settings
                  </Link>

                  {/*  NEW: MY RESUMES PAGE */}
                  <Link
                    to="/candidate/my-resumes"
                    onClick={() => setOpen(false)}
                  >
                     My Saved Resumes
                  </Link>

                  <Link
                    to="/candidate/offers"
                    onClick={() => setOpen(false)}
                  >
                    Offer Letters
                  </Link>
                </div>
              )}
            </div>

            {/* ================= LEARNING & TESTS ================= */}
            <div className="candidate-drawer-section">
              <button
                className="candidate-drawer-toggle"
                onClick={() =>
                  setExpandedSection(
                    expandedSection === "learning"
                      ? null
                      : "learning"
                  )
                }
                aria-expanded={expandedSection === "learning"}
              >
                 Learning
                <span className="candidate-drawer-toggle-icon">
                  {expandedSection === "learning" ? "" : "+"}
                </span>
              </button>

              {expandedSection === "learning" && (
                <div className="candidate-drawer-items">
                  <Link
                    to="/candidate/applied"
                    onClick={() => setOpen(false)}
                  >
                    Applied Jobs
                  </Link>
                  <Link
                    to="/candidate/mock-tests"
                    onClick={() => setOpen(false)}
                  >
                    Mock Tests
                  </Link>
                </div>
              )}
            </div>

            {/* ================= SERVICES & PLANS ================= */}
            <div className="candidate-drawer-section">
              <button
                className="candidate-drawer-toggle"
                onClick={() =>
                  setExpandedSection(
                    expandedSection === "services"
                      ? null
                      : "services"
                  )
                }
                aria-expanded={expandedSection === "services"}
              >
                 Services & Plans
                <span className="candidate-drawer-toggle-icon">
                  {expandedSection === "services" ? "" : "+"}
                </span>
              </button>

              {expandedSection === "services" && (
                <div className="candidate-drawer-items">
                  <Link
                    to="/candidate/plans"
                    onClick={() => setOpen(false)}
                  >
                    Premium Plans
                  </Link>
                </div>
              )}
            </div>

            {/* ================= SUPPORT ================= */}
            <div className="candidate-drawer-section">
              <button
                className="candidate-drawer-toggle"
                onClick={() =>
                  setExpandedSection(
                    expandedSection === "support"
                      ? null
                      : "support"
                  )
                }
                aria-expanded={expandedSection === "support"}
              >
                 Support
                <span className="candidate-drawer-toggle-icon">
                  {expandedSection === "support" ? "" : "+"}
                </span>
              </button>

              {expandedSection === "support" && (
                <div className="candidate-drawer-items">
                  <Link
                    to="/feedback"
                    onClick={() => setOpen(false)}
                  >
                    Feedback
                  </Link>
                  <Link
                    to="/faq"
                    onClick={() => setOpen(false)}
                  >
                    FAQ
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setOpen(false)}
                  >
                    Contact Us
                  </Link>
                </div>
              )}
            </div>

            {/* ================= LEGAL ================= */}
            <div className="candidate-drawer-section">
              <button
                className="candidate-drawer-toggle"
                onClick={() =>
                  setExpandedSection(
                    expandedSection === "legal"
                      ? null
                      : "legal"
                  )
                }
                aria-expanded={expandedSection === "legal"}
              >
                 Legal
                <span className="candidate-drawer-toggle-icon">
                  {expandedSection === "legal" ? "" : "+"}
                </span>
              </button>

              {expandedSection === "legal" && (
                <div className="candidate-drawer-items">
                  <Link
                    to="/privacy"
                    onClick={() => setOpen(false)}
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    to="/terms"
                    onClick={() => setOpen(false)}
                  >
                    Terms & Conditions
                  </Link>
                </div>
              )}
            </div>

            {/* LOGOUT */}
            <div className="candidate-drawer-logout">
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="candidate-drawer-logout-btn"
              >
                 Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default CandidateNavbar;
