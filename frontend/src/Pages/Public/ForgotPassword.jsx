import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../../Styles/auth.css";
import "../../Styles/pagesurface.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // STUB  backend later
    setSent(true);
  };

  return (
    <main className="page">
      <div className="page-surface">
        <div className="auth-page">
          <div className="auth-wrapper">

            {/* LEFT PANEL */}
            <div className="auth-visual">
              <h2>Reset Password </h2>
              <p>
                Dont worry  it happens.  
                Enter your email and well help you reset your password.
              </p>
            </div>

            {/* RIGHT FORM */}
            <div className="auth-form-container">
              <h1>Forgot Password</h1>

              {!sent ? (
                <form className="auth-form" onSubmit={handleSubmit}>
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

                  <button type="submit" className="auth-submit hf-premium">
                    Send Reset Link
                  </button>

                  <p style={{ fontSize: "14px", textAlign: "center" }}>
                    Remembered your password?{" "}
                    <Link
                      to="/login/candidate"
                      style={{ color: "#e50914", fontWeight: 600 }}
                    >
                      Go back to login
                    </Link>
                  </p>
                </form>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "15px", marginBottom: "16px" }}>
                     Reset link sent to  
                    <br />
                    <strong>{email}</strong>
                  </p>

                  <Link
                    to="/login/candidate"
                    className="auth-submit"
                    style={{
                      display: "inline-block",
                      textAlign: "center",
                      textDecoration: "none",
                    }}
                  >
                    Back to Login
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;

