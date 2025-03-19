import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/reduxHooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard that only allows authenticated users or guests
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = useAppSelector(state => state.auth);
  const { isAuthenticated, isLoading } = auth;

  // If still loading, show nothing
  if (isLoading) {
    return null;
  }

  // Check if user is authenticated or is a guest
  if (!isAuthenticated && !localStorage.getItem('guest')) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
