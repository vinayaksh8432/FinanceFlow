import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('user') !== null;

  if (!isAuthenticated) {
    // Redirect to the login page with a state object containing the error message and the attempted path
    return <Navigate to="/login" state={{ error: "Please log in to access this page.", from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
