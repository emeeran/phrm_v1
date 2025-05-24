import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardCards from './components/dashboard/DashboardCards';
import RecentActivity from './components/dashboard/RecentActivity';
import QuickActions from './components/dashboard/QuickActions';
import Profile from './components/profile/Profile';
import { Typography, Box, Grid } from '@mui/material';

// Placeholder components for routes
const Dashboard = () => (
  <Box>
    <Typography variant="h4" fontWeight={700} gutterBottom>
      Welcome to PHRM Dashboard
    </Typography>
    <Typography variant="body1" color="text.secondary" mb={4}>
      Your personal health records manager dashboard.
    </Typography>
    
    {/* Health Metrics Cards */}
    <Box mb={4}>
      <DashboardCards />
    </Box>
    
    {/* Recent Activity and Quick Actions */}
    <Grid container spacing={3}>
      <Grid item xs={12} lg={8}>
        <RecentActivity />
      </Grid>
      <Grid item xs={12} lg={4}>
        <QuickActions />
      </Grid>
    </Grid>
  </Box>
);

const Family = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Family Members
    </Typography>
    <Typography variant="body1">
      Manage your family members' health records.
    </Typography>
  </Box>
);

const Medications = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Medications
    </Typography>
    <Typography variant="body1">
      Track medications and prescriptions.
    </Typography>
  </Box>
);

const Appointments = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Appointments
    </Typography>
    <Typography variant="body1">
      Manage medical appointments and schedules.
    </Typography>
  </Box>
);

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/*" element={<LoginForm />} />
      </Routes>
    );
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/family" element={<Family />} />
        <Route path="/medications" element={<Medications />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

export default App;
