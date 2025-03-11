import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/reduxHooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard that only allows authenticated users
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = useAppSelector(state => state.auth);
  const { isAuthenticated, isLoading, checkingAuth, user } = auth;
  
  // Debug authentication state
  useEffect(() => {
    console.log('ProtectedRoute - Auth State:', {
      isAuthenticated,
      isLoading,
      checkingAuth,
      hasUser: !!user
    });
  }, [isAuthenticated, isLoading, checkingAuth, user]);
  
  // Show nothing while checking auth status
  if (isLoading || checkingAuth) {
    console.log('ProtectedRoute - Still loading, showing nothing');
    return null;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Render children if authenticated
  console.log('ProtectedRoute - User authenticated, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
