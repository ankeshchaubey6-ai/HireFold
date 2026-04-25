import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ padding: "60px 20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>
        404  Page Not Found
      </h1>

      <p style={{ marginBottom: "20px", color: "#888" }}>
        The page you are looking for does not exist.
      </p>

      <Link to="/" style={{ color: "#e50914", fontWeight: 600 }}>
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;

