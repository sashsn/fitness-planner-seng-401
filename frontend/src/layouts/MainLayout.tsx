import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, CssBaseline, Toolbar, AppBar, IconButton, Typography, Avatar, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import ExpandableSidebar from '../components/layouts/ExpandableSidebar';

const MainLayout: React.FC = () => {
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
    // Implement logout functionality
    // dispatch(logout());
    navigate('/login');
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
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: 'calc(100% - 68px)' },
          ml: { sm: '68px' },
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Fitness Planner
          </Typography>
          
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          
          <IconButton 
            onClick={handleProfileMenuOpen}
            sx={{ ml: 1 }}
          >
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
      
      {/* Sidebar */}
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
          width: { sm: 'calc(100% - 68px)' },
          ml: { sm: '68px' },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
