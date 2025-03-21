import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/reduxHooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isGuest?: boolean;  // Optional flag to allow guest access
}

/**
 * Route guard that only allows authenticated users or guest users with isGuest flag
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isGuest }) => {
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
  
   // If the user is not authenticated and it's not a guest, redirect to login
   if (!isAuthenticated && !isGuest) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
   // Render children if authenticated or if it's a guest
   console.log('ProtectedRoute - User authenticated or guest, rendering children');
   return <>{children}</>;
};

export default ProtectedRoute;
