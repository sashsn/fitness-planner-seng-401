// src/layouts/GuestMainLayout.tsx
import React from 'react';
import { Box, CssBaseline, Toolbar, Paper, Button, Typography } from '@mui/material';
import ExpandableSidebar from '../components/layouts/ExpandableSidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';

interface GuestMainLayoutProps {
  locked?: boolean;
}

const GuestMainLayout: React.FC<GuestMainLayoutProps> = ({ locked = false }) => {
  const navigate = useNavigate();
  // For authenticated users, these would come from your state (here we use placeholders).
  const sidebarUsername = locked ? 'Guest' : 'YourUsername';
  const sidebarUserAvatar = locked ? undefined : 'your-avatar-url';

  return (
    <Box sx={{ display: 'flex', position: 'relative' }}>
      <CssBaseline />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
      {locked && (
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(255,255,255,0.9)',
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
          }}
        >
          <Typography variant="h4" gutterBottom>
            <LockIcon sx={{ fontSize: 40, mr: 1 }} /> Premium Features Locked
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            As a guest, you can generate workout plans but saving and tracking require an account.
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary" onClick={() => navigate('/register')}>
              Register
            </Button>
            <Button variant="outlined" color="primary" onClick={() => navigate('/login')}>
              Login
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default GuestMainLayout;
