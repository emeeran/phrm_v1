import React from 'react';
import { AppBar, Toolbar, Typography, Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import MedicationIcon from '@mui/icons-material/Medication';
import EventIcon from '@mui/icons-material/Event';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/userSlice';

const drawerWidth = 220;

const navItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Family', icon: <GroupIcon />, path: '/family' },
  { text: 'Medications', icon: <MedicationIcon />, path: '/medications' },
  { text: 'Appointments', icon: <EventIcon />, path: '/appointments' },
  { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <Toolbar />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path} sx={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem key="Logout" disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" fontWeight={700}>
            PHRM Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
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
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
