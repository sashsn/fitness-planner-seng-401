import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxHooks';

// User ID that should only access profile page
const RESTRICTED_USER_ID = '61e7b81a-78be-4ca9-81e3-a984eb7ef38e';

interface RestrictedAccessGuardProps {
  children: React.ReactNode;
  allowedPath?: string; // Path this user is allowed to access
}

/**
 * A guard that restricts specific users to only access certain paths
 */
const RestrictedAccessGuard: React.FC<RestrictedAccessGuardProps> = ({ 
  children,
  allowedPath = '/profile' 
}) => {
  const { user } = useAppSelector(state => state.auth);
  const location = useLocation();
  
  // If user isn't logged in yet, render children normally
  if (!user) {
    return <>{children}</>;
  }
  
  // Check if this is the restricted user
  const isRestrictedUser = user.id === RESTRICTED_USER_ID;
  
  // If it's the restricted user and not on the allowed path, redirect
  if (isRestrictedUser && location.pathname !== allowedPath) {
    console.log('Restricted user attempting to access unauthorized page. Redirecting to profile.');
    return <Navigate to={allowedPath} replace />;
  }
  
  // Otherwise, render the children as normal
  return <>{children}</>;
};

export default RestrictedAccessGuard;
