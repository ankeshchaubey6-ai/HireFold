import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../Context/AuthContext";

import "../../Styles/auth.css";
import "../../Styles/pagesurface.css";

const RegisterCandidate = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const getStrength = () => {
    if (password.length > 8) return "strong";
    if (password.length > 4) return "medium";
    return "weak";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const res = await register({
      role: "CANDIDATE",
      name,
      email,
      password
    });
    if (res.success) {
      navigate("/candidate");
    } else {
      setError(res.message || "Registration failed.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await loginWithGoogle({
        idToken: credentialResponse.credential,
        role: "CANDIDATE",
      });

      if (res?.success !== false) {
        navigate("/candidate");
      } else {
        setError(res?.message || "Google signup failed.");
      }
    } catch {
      setError("Google signup failed.");
    }
  };

  return (
    <main className="page">
      <div className="page-surface auth-page">
        <div className="auth-wrapper">

          <div className="auth-visual">
            <h2>Start Your Career </h2>
            <p>Create your profile and unlock smarter job matches.</p>
          </div>

          <div className="auth-form-container">
            <h1>Candidate Registration</h1>

            <form className="auth-form" onSubmit={handleSubmit}>
              {error && (
                <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
              )}

              <div className="auth-field">
                <input
                  type="text"
                  required
                  placeholder=" "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label>Full name</label>
              </div>

              <div className="auth-field">
                <input
                  type="email"
                  required
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label>Email address</label>
              </div>

              <div className="auth-field password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder=" "
                />
                <label>Password</label>

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className={`password-strength ${getStrength()}`}>
                <span />
              </div>

              <button type="submit" className="auth-submit hf-premium">
                Create Account
              </button>
            </form>

            {/* GOOGLE LOGIN BUTTON */}
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google signup failed.")}
                theme="filled_blue"
                size="large"
                shape="pill"
                text="continue_with"
                width="320"
              />
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default RegisterCandidate;
