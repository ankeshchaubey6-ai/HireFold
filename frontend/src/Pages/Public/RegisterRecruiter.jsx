import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

import "../../Styles/auth.css";
import "../../Styles/pagesurface.css";

const RegisterRecruiter = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
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
      name,
      role: "RECRUITER",
      company,
      email,
      password
    });

    if (res?.success) {
      navigate("/recruiter");
    } else {
      setError(res?.message || "Registration failed.");
    }
  };

  const handleGoogle = async () => {
    try {
      const res = await loginWithGoogle({ role: "RECRUITER" });

      if (res?.success) {
        navigate("/recruiter");
      } else {
        setError("Google signup failed.");
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
            <h2>Hire Smarter </h2>
            <p>Join HireFold and streamline your hiring workflow.</p>
          </div>

          <div className="auth-form-container">
            <h1>Recruiter Registration</h1>

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
                <label>Your Name</label>
              </div>

              <div className="auth-field">
                <input
                  type="text"
                  required
                  placeholder=" "
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                <label>Company name</label>
              </div>

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
                Create Account
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
                Sign up with Google
              </button>

            </form>
          </div>

        </div>
      </div>
    </main>
  );
};

export default RegisterRecruiter;
