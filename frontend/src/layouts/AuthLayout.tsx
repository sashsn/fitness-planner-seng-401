import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Container, Box, Paper } from '@mui/material';
import { useAppSelector } from '../hooks/reduxHooks';

const AuthLayout: React.FC = () => {
  const { isAuthenticated, checkingAuth } = useAppSelector(state => state.auth);

  // If auth check is still in progress, show nothing
  if (checkingAuth) return null;
  
  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;
