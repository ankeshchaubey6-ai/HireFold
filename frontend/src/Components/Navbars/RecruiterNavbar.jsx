import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../Context/ThemeContext";
import { useSiteSearch } from "../../hooks/useSiteSearch";
import "./RecruiterNavbar.css";
import { useAuth } from "../../Context/AuthContext";

const RecruiterNavbar = () => {
  const [open, setOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { suggestions, hasResults, isEmptyQuery } = useSiteSearch(searchQuery);

  const isActive = (path) => {
    if (path === "/recruiter") {
      return pathname === path;
    }
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <>
      <header className="recruiter-navbar">
        <div className="recruiter-navbar__inner">

          {/* LEFT */}
          <div className="recruiter-navbar__left">
            <button
              className="recruiter-navbar__hamburger"
              onClick={() => setOpen(true)}
            >
              
            </button>

            <Link to="/recruiter" className="recruiter-navbar__logo">
              HireFold
            </Link>
          </div>

          {/* CENTER */}
          <nav className="recruiter-navbar__center">
            <Link className={isActive("/recruiter") ? "active" : ""} to="/recruiter">
              Home
            </Link>
            <Link className={isActive("/recruiter/post-job") ? "active" : ""} to="/recruiter/post-job">Post Job
             </Link>

            <Link className={isActive("/recruiter/applicants") ? "active" : ""} to="/recruiter/applicants">
              Applicants
            </Link>
            <Link className={isActive("/recruiter/interviews") ? "active" : ""} to="/recruiter/interviews">
              Interviews
            </Link>
          </nav>

          {/* RIGHT */}
          <div className="recruiter-navbar__right">
            <div className="recruiter-navbar__search">
              <input
                type="text"
                placeholder="Search candidates, jobs..."
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    navigate(`/recruiter/applicants?search=${encodeURIComponent(searchQuery)}`);
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
                    suggestions.map((suggestion) => (
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

            <Link
              className="recruiter-navbar__icon"
              to="/recruiter/notifications"
            >
              
            </Link>

            <button className="recruiter-navbar__theme" onClick={toggleTheme}>
              {theme === "dark" ? "" : ""}
            </button>
          </div>

        </div>
      </header>

      {/* DRAWER */}
      {open && (
        <div className="recruiter-drawer-overlay" onClick={() => setOpen(false)}>
          <aside
            className="recruiter-drawer"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* PRIMARY NAVIGATION */}
            <nav className="recruiter-drawer-nav-main">
              <Link to="/recruiter" onClick={() => setOpen(false)}>
                 Home
              </Link>
              <Link to="/recruiter/post-job" onClick={() => setOpen(false)}>
                 Post Job
              </Link>
              <Link to="/recruiter/applicants" onClick={() => setOpen(false)}>
                 Applicants
              </Link>
              <Link to="/recruiter/interviews" onClick={() => setOpen(false)}>
                 Interviews
              </Link>
              <Link
                to="/recruiter/notifications"
                onClick={() => setOpen(false)}
              >
                 Notifications
              </Link>
            </nav>

            {/* COLLAPSIBLE SECTION: Services & Plans */}
            <div className="recruiter-drawer-section">
              <button
                className="recruiter-drawer-toggle"
                onClick={() =>
                  setExpandedSection(
                    expandedSection === "services" ? null : "services"
                  )
                }
                aria-expanded={expandedSection === "services"}
              >
                 Services & Plans
                <span className="recruiter-drawer-toggle-icon">
                  {expandedSection === "services" ? "" : "+"}
                </span>
              </button>
              {expandedSection === "services" && (
                <div className="recruiter-drawer-items">
                <Link to="/recruiter/services-plans" onClick={() => setOpen(false)}>
  Services & Plans
</Link>

                </div>
              )}
            </div>

            {/* COLLAPSIBLE SECTION: Analytics & Reports */}
            <div className="recruiter-drawer-section">
              <button
                className="recruiter-drawer-toggle"
                onClick={() =>
                  setExpandedSection(
                    expandedSection === "analytics" ? null : "analytics"
                  )
                }
                aria-expanded={expandedSection === "analytics"}
              >
                 Analytics & Reports
                <span className="recruiter-drawer-toggle-icon">
                  {expandedSection === "analytics" ? "" : "+"}
                </span>
              </button>
              {expandedSection === "analytics" && (
                <div className="recruiter-drawer-items">
                  <Link to="/recruiter/reports" onClick={() => setOpen(false)}>
                    Reports
                  </Link>
                </div>
              )}
            </div>

            {/* LOGOUT BUTTON */}
            <div className="recruiter-drawer-logout">
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="recruiter-drawer-logout-btn"
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

export default RecruiterNavbar;

