import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuth();

  // If not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but role not allowed, redirect to home or unauthorized page
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, allow access
  return children;
};

export default ProtectedRoute;
