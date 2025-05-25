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
import FamilyManagement from './components/family/FamilyManagement';
import MedicationManagement from './components/medications/MedicationManagement';
import AppointmentManagement from './components/appointments/AppointmentManagement';
import { Typography, Box, Grid } from '@mui/material';

// Dashboard component
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
      <Grid size={{ xs: 12, lg: 8 }}>
        <RecentActivity />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <QuickActions />
      </Grid>
    </Grid>
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
        <Route path="/family" element={<FamilyManagement />} />
        <Route path="/medications" element={<MedicationManagement />} />
        <Route path="/appointments" element={<AppointmentManagement />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

export default App;
