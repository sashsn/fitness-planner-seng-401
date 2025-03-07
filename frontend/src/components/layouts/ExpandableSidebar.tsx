import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Collapse,
  useTheme,
  Badge,
  Avatar,
  Typography,
  alpha,
  Tooltip
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface SidebarItem {
  text: string;
  icon: JSX.Element;
  path?: string;
  badge?: number;
  subItems?: SidebarItem[];
}

interface ExpandableSidebarProps {
  username?: string;
  userAvatar?: string;
  onLogout: () => void;
}

const ExpandableSidebar: React.FC<ExpandableSidebarProps> = ({ 
  username = 'User',
  userAvatar,
  onLogout
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>('workouts'); // Default open submenu
  const [hoverOpen, setHoverOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const drawerWidth = open ? 240 : 68;
  const isActive = (path: string) => location.pathname === path;

  const menuItems: SidebarItem[] = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      text: 'Workouts',
      icon: <FitnessCenterIcon />,
      subItems: [
        {
          text: 'My Workouts',
          icon: <FormatListBulletedIcon />,
          path: '/workouts',
          badge: 3, // Example badge count
        },
        {
          text: 'Create Workout',
          icon: <AddIcon />,
          path: '/workouts/create',
        },
        {
          text: 'Generate Plan',
          icon: <AutoAwesomeIcon />,
          path: '/workouts/generate',
        },
        {
          text: 'View Plans',
          icon: <AssessmentIcon />,
          path: '/workouts/plans',
        },
      ],
    },
    {
      text: 'Nutrition',
      icon: <RestaurantMenuIcon />,
      path: '/nutrition',
    },
    {
      text: 'Progress',
      icon: <AssessmentIcon />,
      path: '/progress',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
    },
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoverTimeout(setTimeout(() => setHoverOpen(true), 300));
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoverTimeout(setTimeout(() => setHoverOpen(false), 300));
  };

  const isOpenNow = open || hoverOpen;

  const handleSubMenuToggle = (menuText: string) => {
    setOpenSubMenu(openSubMenu === menuText ? null : menuText);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    if (hoverOpen) setHoverOpen(false);
  };

  const drawer = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Sidebar Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          justifyContent: isOpenNow ? 'space-between' : 'center',
        }}
      >
        {isOpenNow && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src={userAvatar}
              sx={{ 
                width: 32, 
                height: 32,
                mr: 1,
                background: theme.palette.primary.main
              }}
            >
              {username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
              variant="subtitle2"
              noWrap
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              {username}
            </Typography>
          </Box>
        )}
        
        <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
          {isOpenNow ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </Box>

      <Divider />

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, px: 1 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            {item.subItems ? (
              <>
                <Tooltip title={isOpenNow ? '' : item.text} placement="right">
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleSubMenuToggle(item.text)}
                      sx={{
                        borderRadius: '8px',
                        mb: 0.5,
                        backgroundColor: openSubMenu === item.text 
                          ? alpha(theme.palette.primary.main, 0.1)
                          : 'transparent',
                        justifyContent: isOpenNow ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: isOpenNow ? 2 : 'auto',
                          color: openSubMenu === item.text ? theme.palette.primary.main : 'inherit',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {isOpenNow && (
                        <>
                          <ListItemText primary={item.text} />
                          {openSubMenu === item.text ? <ExpandLess /> : <ExpandMore />}
                        </>
                      )}
                    </ListItemButton>
                  </ListItem>
                </Tooltip>

                <Collapse in={isOpenNow && openSubMenu === item.text} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <Tooltip key={subItem.text} title={isOpenNow ? '' : subItem.text} placement="right">
                        <ListItem disablePadding>
                          <ListItemButton
                            onClick={() => handleMenuItemClick(subItem.path!)}
                            sx={{
                              pl: isOpenNow ? 4 : 2.5,
                              py: 1,
                              borderRadius: '8px',
                              mb: 0.5,
                              backgroundColor: isActive(subItem.path!)
                                ? alpha(theme.palette.primary.main, 0.1)
                                : 'transparent',
                              justifyContent: isOpenNow ? 'initial' : 'center',
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: isOpenNow ? 2 : 'auto',
                                color: isActive(subItem.path!) ? theme.palette.primary.main : 'inherit',
                              }}
                            >
                              {subItem.badge ? (
                                <Badge badgeContent={subItem.badge} color="error">
                                  {subItem.icon}
                                </Badge>
                              ) : (
                                subItem.icon
                              )}
                            </ListItemIcon>
                            {isOpenNow && (
                              <ListItemText 
                                primary={subItem.text}
                                primaryTypographyProps={{
                                  variant: 'body2',
                                  color: isActive(subItem.path!) ? theme.palette.primary.main : 'inherit',
                                  fontWeight: isActive(subItem.path!) ? 'bold' : 'normal',
                                }}
                              />
                            )}
                          </ListItemButton>
                        </ListItem>
                      </Tooltip>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <Tooltip title={isOpenNow ? '' : item.text} placement="right">
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleMenuItemClick(item.path!)}
                    sx={{
                      borderRadius: '8px',
                      mb: 0.5,
                      backgroundColor: isActive(item.path!)
                        ? alpha(theme.palette.primary.main, 0.1)
                        : 'transparent',
                      justifyContent: isOpenNow ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isOpenNow ? 2 : 'auto',
                        color: isActive(item.path!) ? theme.palette.primary.main : 'inherit',
                      }}
                    >
                      {item.badge ? (
                        <Badge badgeContent={item.badge} color="error">
                          {item.icon}
                        </Badge>
                      ) : (
                        item.icon
                      )}
                    </ListItemIcon>
                    {isOpenNow && (
                      <ListItemText 
                        primary={item.text}
                        primaryTypographyProps={{
                          color: isActive(item.path!) ? theme.palette.primary.main : 'inherit',
                          fontWeight: isActive(item.path!) ? 'bold' : 'normal',
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* Logout Button */}
      <Divider />
      <List sx={{ px: 1, pb: 1 }}>
        <Tooltip title={isOpenNow ? '' : "Logout"} placement="right">
          <ListItem disablePadding>
            <ListItemButton
              onClick={onLogout}
              sx={{
                borderRadius: '8px',
                justifyContent: isOpenNow ? 'initial' : 'center',
                px: 2.5,
                color: theme.palette.error.main,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isOpenNow ? 2 : 'auto',
                  color: theme.palette.error.main,
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              {isOpenNow && <ListItemText primary="Logout" />}
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </List>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.standard,
        }),
        '& .MuiDrawer-paper': {
          overflowX: 'hidden',
          width: drawerWidth,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default ExpandableSidebar;
