import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

import "../../Styles/auth.css";
import "../../Styles/pagesurface.css";

const LoginRecruiter = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const getStrength = () => {
    if (password.length > 8) return "strong";
    if (password.length > 4) return "medium";
    return "weak";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login({
        role: "RECRUITER",
        email,
        password
      });

      navigate("/recruiter");
    } catch {
      setError("Login failed.");
    }
  };

  const handleGoogle = async () => {
    setError("");

    try {
      await loginWithGoogle({
        role: "RECRUITER"
      });

      navigate("/recruiter");
    } catch {
      setError("Google login failed.");
    }
  };

  return (
    <main className="page">
      <div className="page-surface auth-page">
        <div className="auth-wrapper">

          <div className="auth-visual">
            <h2>Welcome Recruiter </h2>
            <p>Access your dashboard and manage hiring effortlessly.</p>
          </div>

          <div className="auth-form-container">
            <h1>Recruiter Login</h1>

            <form className="auth-form" onSubmit={handleSubmit}>

              {error && (
                <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
              )}

              <div className="auth-field">
                <input
                  type="email"
                  required
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label>Work email</label>
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
                Sign In
              </button>

              <button
                type="button"
                className="auth-submit hf-premium"
                onClick={handleGoogle}
                style={{
                  background: "#ffffff",
                  color: "#111",
                  border: "1px solid var(--border)",
                }}
              >
                Continue with Google
              </button>

            </form>
          </div>

        </div>
      </div>
    </main>
  );
};

export default LoginRecruiter;

