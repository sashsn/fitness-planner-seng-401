import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { checkAuth, clearErrors } from '../../features/auth/authSlice';
import LoadingSpinner from '../ui/LoadingSpinner';
import AlertMessage from '../ui/AlertMessage';
import { Button, Box } from '@mui/material';
import { resetAuth } from '../../utils/debug';
import { store } from '../../store';
import { debugState } from '../../utils/debug';

interface AuthLoaderProps {
  children: React.ReactNode;
}

/**
 * Component that handles loading the authentication state on initial app load
 */
const AuthLoader: React.FC<AuthLoaderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { checkingAuth, error } = useAppSelector(state => state.auth);
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    // Log initial state for debugging
    debugState(store);
    
    // Start auth check
    dispatch(checkAuth());
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Auth check timeout occurred');
      setTimeoutOccurred(true);
      // Log state after timeout
      debugState(store);
    }, 10000); // 10 second timeout
    
    // Setup timer to track loading time
    const interval = setInterval(() => {
      setLoadingTime(prev => prev + 1);
    }, 1000);
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [dispatch]);

  // Show the application if loading completes or timeout occurs
  if (!checkingAuth || timeoutOccurred) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      padding: 3
    }}>
      <LoadingSpinner message={`Loading application... (${loadingTime}s)`} />
      
      {error && (
        <AlertMessage 
          message={`Authentication error: ${error}`}
          severity="error"
          onClose={() => dispatch(clearErrors())}
          sx={{ mt: 2, maxWidth: 400 }}
        />
      )}
      
      {timeoutOccurred && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <AlertMessage 
            message="Loading is taking longer than expected. This may indicate an issue with the server connection or authentication."
            severity="warning"
            sx={{ mb: 2, maxWidth: 400 }}
          />
          
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mr: 1 }}
          >
            Reload Page
          </Button>
          
          <Button 
            variant="outlined"
            onClick={resetAuth}
            color="secondary"
          >
            Reset Auth & Go to Login
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AuthLoader;
