import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  CssBaseline, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton,
  alpha,
  Fade,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import MedicationIcon from '@mui/icons-material/Medication';
import EventIcon from '@mui/icons-material/Event';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/userSlice';
import QuickActions from '../dashboard/QuickActions';

const drawerWidth = 180;
const quickActionsWidth = 200;

const navItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Family', icon: <GroupIcon />, path: '/family' },
  { text: 'Medications', icon: <MedicationIcon />, path: '/medications' },
  { text: 'Appointments', icon: <EventIcon />, path: '/appointments' },
  { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();

  // Only show Quick Actions sidebar on the dashboard route
  const showQuickActions = location.pathname === '/';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const drawer = (
    <Box 
      sx={{ 
        height: '100%', 
        background: `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.98)}, ${alpha(theme.palette.background.default, 0.95)})`,
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid',
        borderRightColor: alpha(theme.palette.divider, 0.12),
      }}
    >
      <Toolbar sx={{ 
        borderBottom: '1px solid',
        borderBottomColor: alpha(theme.palette.divider, 0.08),
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
      }}>
        <Typography 
          variant="h6" 
          fontWeight={800} 
          sx={{
            background: 'linear-gradient(45deg, white, rgba(255,255,255,0.8))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          PHRM
        </Typography>
      </Toolbar>
      <List sx={{ px: 2, pt: 2 }}>
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Fade in timeout={300 + index * 100} key={item.text}>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
                  component={Link} 
                  to={item.path}
                  onMouseEnter={() => setHoveredItem(item.text)}
                  onMouseLeave={() => setHoveredItem(null)}
                  sx={{ 
                    textDecoration: 'none', 
                    color: 'inherit',
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    position: 'relative',
                    overflow: 'hidden',
                    bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 4,
                      height: '100%',
                      bgcolor: theme.palette.primary.main,
                      opacity: isActive ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      transform: 'translateX(6px)',
                      '& .nav-icon': {
                        color: theme.palette.primary.main,
                        transform: 'scale(1.1)',
                      },
                      '& .nav-text': {
                        color: theme.palette.primary.main,
                        fontWeight: 700,
                      },
                      '&::before': {
                        opacity: 1,
                      },
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      className="nav-icon"
                      sx={{
                        color: isActive ? theme.palette.primary.main : 'text.secondary',
                        transition: 'all 0.3s ease',
                        transform: hoveredItem === item.text || isActive ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      {item.icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    className="nav-text"
                    primaryTypographyProps={{ 
                      fontWeight: isActive ? 700 : 600, 
                      fontSize: '0.9rem',
                      color: isActive ? theme.palette.primary.main : 'text.primary',
                      transition: 'all 0.2s ease',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Fade>
          );
        })}
        <ListItem key="Logout" disablePadding sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <ListItemButton 
            onClick={handleLogout} 
            sx={{ 
              textDecoration: 'none', 
              color: 'error.main',
              borderRadius: 2,
              px: 2,
              py: 1.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'error.main',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.8))',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          color: 'text.primary',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar>
          <IconButton 
            color="inherit" 
            edge="start" 
            onClick={handleDrawerToggle} 
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'white',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" fontWeight={800} color="primary.main">
            Personal Health Records Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            border: 'none',
          },
          display: { xs: 'none', sm: 'block' },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            border: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: 0.5, 
          ml: { 
            xs: 0,
            sm: `${drawerWidth}px`,
            lg: showQuickActions ? `${drawerWidth + quickActionsWidth}px` : `${drawerWidth}px`
          },
          pb: 0.5,
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        }}
      >
        <Toolbar />
        {children}
      </Box>
      
      {/* Left Quick Actions Sidebar (only on dashboard) */}
      {showQuickActions && (
        <Drawer
          variant="permanent"
          sx={{
            width: quickActionsWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: quickActionsWidth, 
              boxSizing: 'border-box',
              border: 'none',
              background: 'linear-gradient(180deg, rgba(248,250,252,0.98), rgba(241,245,249,0.98))',
              backdropFilter: 'blur(10px)',
              borderRight: '1px solid rgba(0,0,0,0.04)',
              left: drawerWidth,
              zIndex: (theme) => theme.zIndex.drawer - 1,
            },
            display: { xs: 'none', lg: 'block' },
          }}
          open
        >
          <Toolbar />
          <Box sx={{ p: 1.5, height: '100%', overflow: 'auto' }}>
            <QuickActions />
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default DashboardLayout;
