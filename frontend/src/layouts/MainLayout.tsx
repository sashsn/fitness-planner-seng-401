import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, CssBaseline, Toolbar, AppBar, IconButton, Typography, Avatar, Menu, MenuItem, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import ExpandableSidebar from '../components/layouts/ExpandableSidebar';
import { logout } from '../features/auth/authSlice';

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // CHANGED: Detect mobile view
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const username = user?.username || user?.firstName || 'User';
  const userAvatar = user?.profileImage || undefined;
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleProfileClick = () => {
    navigate('/profile');
    handleProfileMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}> {/* CHANGED: For mobile, layout is column */}
      <CssBaseline />
      
      {/* App Bar remains unchanged */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: isMobile ? '100%' : 'calc(100% - 68px)' },
          ml: { sm: isMobile ? 0 : '68px' },
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Fitness Planner
          </Typography>
          <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 1 }}>
            <Avatar 
              alt={username} 
              src={userAvatar} 
              sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
            >
              {username.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* CHANGED: Render the expandable sidebar; it will render differently for mobile */}
      <ExpandableSidebar 
        username={username}
        userAvatar={userAvatar}
        onLogout={handleLogout}
      />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: isMobile ? '56px' : 0, // CHANGED: Add top margin on mobile to account for horizontal menu height
          ml: isMobile ? 0 : '68px',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
