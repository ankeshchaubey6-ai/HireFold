import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, isAuthenticated } = useAuth();

  // Still loading user (optional safety)
  if (user === undefined) return null;

  // Not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login/candidate" replace />;
  }

  // Logged in but wrong role
  if (allowedRole && user.role !== allowedRole) {
    return user.role === "RECRUITER" ? (
      <Navigate to="/recruiter" replace />
    ) : (
      <Navigate to="/candidate" replace />
    );
  }

  return children;
};

export default ProtectedRoute;