import React, { useState, useEffect, useRef, Fragment } from 'react';
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
  Tooltip,
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu'; // NEW: For mobile menu button

// SidebarItem type definition
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

// Renders a dropdown menu containing all sidebar items (except Dashboard).
// For "Workouts", subItems are rendered as a  list.
const MobileMenuDropdown: React.FC<{
  menuItems: SidebarItem[];
  navigate: (path: string) => void;
  isActive: (path: string) => boolean;
  onLogout: () => void;
}> = ({ menuItems, navigate, isActive, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [subAnchorEl, setSubAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const subOpen = Boolean(subAnchorEl);

  const handleMainOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMainClose = () => {
    setAnchorEl(null);
    setSubAnchorEl(null);
  };

  // For the Workouts item, open a secondary submenu on hover.
  const handleWorkoutsMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setSubAnchorEl(event.currentTarget);
  };

  const handleWorkoutsMouseLeave = () => {
    setSubAnchorEl(null);
  };

  return (
    <Fragment>
      <Button 
        onClick={handleMainOpen} 
        variant={open ? 'contained' : 'outlined'} 
        sx={{ color: open ? 'white' : 'inherit' }}
      >
        <MenuIcon />
        <Typography variant="caption" sx={{ ml: 0.5 }}>Menu</Typography>
        <ExpandMore sx={{ ml: 0.5 }} />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMainClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {menuItems.map((item) => {
          if (item.text === 'Workouts' && item.subItems) {
            return (
              <MenuItem 
                key={item.text}
                onMouseEnter={handleWorkoutsMouseEnter} 
                onMouseLeave={handleWorkoutsMouseLeave}
                onClick={() => {
                  // Do not navigate on click for Workouts parent.
                }}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {item.icon}
                <Typography variant="caption" sx={{ ml: 0.5 }}>{item.text}</Typography>
                <ExpandMore sx={{ ml: 0.5 }} />
                {/* Secondary submenu rendered as a horizontal list */}
                <Menu
                  anchorEl={subAnchorEl}
                  open={subOpen}
                  onClose={() => setSubAnchorEl(null)}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  PaperProps={{
                    sx: { display: 'flex', flexDirection: 'row', p: 1 },
                  }}
                >
                  {item.subItems.map((subItem) => (
                    <MenuItem
                      key={subItem.text}
                      onClick={() => {
                        if (subItem.path) navigate(subItem.path);
                        handleMainClose();
                      }}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      {subItem.icon}
                      <Typography variant="caption" sx={{ ml: 0.5 }}>{subItem.text}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </MenuItem>
            );
          } else {
            return (
              <MenuItem
                key={item.text}
                onClick={() => {
                  if (item.path) navigate(item.path);
                  handleMainClose();
                }}
                sx={{ color: isActive(item.path!) ? 'primary.main' : 'inherit' }}
              >
                {item.icon}
                <Typography variant="caption" sx={{ ml: 1 }}>{item.text}</Typography>
              </MenuItem>
            );
          }
        })}
        <Divider />
        <MenuItem
          onClick={() => {
            onLogout();
            handleMainClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <LogoutIcon />
          <Typography variant="caption" sx={{ ml: 1 }}>Logout</Typography>
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

const ExpandableSidebar: React.FC<ExpandableSidebarProps> = ({ 
  username = 'User',
  userAvatar,
  onLogout
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // CHANGED: Detect mobile view

  // Desktop states (used only in desktop mode)
  const [open, setOpen] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  // For mobile mode, default openSubMenu should be null so only Dashboard is selected initially.
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const drawerWidth = open || hoverOpen ? 240 : 68;

  const isActive = (path: string) => location.pathname === path;
  const isActiveGroup = (paths: string[]) => paths.some(path => location.pathname.startsWith(path));

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

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
          path: '/workouts/Workouts',
          badge: 3,
        },
        {
          text: 'Create Workout',
          icon: <AddIcon />,
          path: '/workouts/CreateWorkout',
        },
        {
          text: 'Generate Plan',
          icon: <AutoAwesomeIcon />,
          path: '/workouts/GenerateWorkout',
        },
        {
          text: 'View Plans',
          icon: <AssessmentIcon />,
          path: '/workouts/WorkoutPlans',
        },
      ],
    },
    {
      text: 'Nutrition',
      icon: <RestaurantMenuIcon />,
      path: '/nutrition/Nutrition',
    },
    {
      text: 'Progress',
      icon: <AssessmentIcon />,
      path: '/goals/Goals',
    },
  ];

  // Desktop handlers (unchanged)
  const handleDrawerOpen = () => {
    setOpen(true);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMouseEnter = () => {
    if (open) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      if (isMounted.current) setHoverOpen(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      if (isMounted.current) setHoverOpen(false);
    }, 300);
  };

  const isOpenNow = open || hoverOpen;

  const handleSubMenuToggle = (menuText: string) => {
    if (menuText === 'Workouts') {
      if (openSubMenu === 'Workouts') {
        setOpenSubMenu(null);
        setOpen(false);
      } else {
        setOpenSubMenu('Workouts');
        setOpen(true);
      }
    } else {
      setOpenSubMenu(openSubMenu === menuText ? null : menuText);
    }
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    if (hoverOpen && !open) setHoverOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    if (hoverOpen) setHoverOpen(false);
  };

  useEffect(() => {
    // Auto-open submenu in desktop mode if active route matches one of the sub-items.
    if (!isMobile) {
      menuItems.forEach(item => {
        if (item.subItems && item.subItems.some(subItem => location.pathname.startsWith(subItem.path!))) {
          setOpenSubMenu(item.text);
          if (item.text === 'Workouts') setOpen(true);
        }
      });
    }
  }, [location.pathname, isMobile]);

  // ==============================
  // Mobile Rendering: Top Bar with Dashboard + Dropdown
  // ==============================
  if (isMobile) {
    const dashboardItem = menuItems.find((item) => item.text === 'Dashboard');
    const otherItems = menuItems.filter((item) => item.text !== 'Dashboard');

    return (
      <Box
        sx={{
          position: 'fixed',
          top: { xs: 56, sm: 64 },
          width: '100%',
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
          zIndex: theme.zIndex.drawer + 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
        }}
      >
        {/* Dashboard Button */}
        <Button
          onClick={() => dashboardItem?.path && handleMenuItemClick(dashboardItem.path)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: dashboardItem && isActive(dashboardItem.path!) ? theme.palette.primary.main : 'inherit',
          }}
        >
          {dashboardItem?.icon}
          <Typography variant="subtitle2" sx={{ ml: 1 }}>{dashboardItem?.text}</Typography>
        </Button>
        {/* Mobile Dropdown for Other Items */}
        <MobileMenuDropdown 
          menuItems={otherItems} 
          navigate={navigate} 
          isActive={(path: string) => location.pathname === path} 
          onLogout={handleLogoutClick} 
        />
      </Box>
    );
  }

  // ==============================
  // Desktop Rendering: Vertical Drawer
  // ==============================
  const drawerContent = (
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
                background: theme.palette.primary.main,
              }}
            >
              {username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              {username}
            </Typography>
          </Box>
        )}
        <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
          {isOpenNow ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      <Divider />

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, px: 1 }}>
        {menuItems.map((item) => (
          <Fragment key={item.text}>
            {item.subItems ? (
              <>
                <Tooltip title={isOpenNow ? '' : item.text} placement="right">
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleSubMenuToggle(item.text)}
                      sx={{
                        borderRadius: '8px',
                        mb: 0.5,
                        backgroundColor: openSubMenu === item.text ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
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
                              backgroundColor: isActive(subItem.path!) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
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
                      backgroundColor: isActive(item.path!) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
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
          </Fragment>
        ))}
      </List>

      <Divider />

      <List sx={{ px: 1, pb: 1 }}>
        <Tooltip title={isOpenNow ? '' : "Logout"} placement="right">
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogoutClick}
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

  return isMobile ? null : (
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
      {drawerContent}
    </Drawer>
  );
};

export default ExpandableSidebar;
