import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { user } = useAuth();

  if (requireAuth) {
    // Protected route - requires authentication
    return user ? children : <Navigate to="/" replace />;
  } else {
    // Public route - redirects to home if already logged in
    return user ? <Navigate to="/home" replace /> : children;
  }
};

export default ProtectedRoute;
