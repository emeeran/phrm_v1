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
import { Typography, Box, Container, Paper, Fade, Grow, alpha, useTheme } from '@mui/material';

// Dashboard component
const Dashboard = () => {
  const theme = useTheme();
  
  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      <Fade in timeout={600}>
        <Box>
          {/* Welcome Header */}
          <Grow in timeout={800}>
            <Box mb={2} px={2}>
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                  borderRadius: 3,
                  p: 3,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.divider, 0.08),
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography 
                  variant="h4" 
                  fontWeight={800} 
                  color="text.primary"
                  component="h1"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 0.5,
                  }}
                >
                  Welcome Back, John! 👋
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  Today is {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mt: 1, fontSize: '0.9rem' }}
                >
                  You have 2 urgent items requiring attention
                </Typography>
              </Box>
            </Box>
          </Grow>
          
          {/* Health Metrics Table */}
          <Box mb={2} px={2}>
            <DashboardCards />
          </Box>
          
          {/* Mobile Quick Actions */}
          <Box 
            mb={2} 
            px={2} 
            sx={{ 
              display: { xs: 'block', lg: 'none' },
            }}
          >
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.12),
                boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.04)}`,
              }}
            >
              <QuickActions />
            </Paper>
          </Box>
          
          {/* Recent Activity */}
          <Box px={2}>
            <RecentActivity />
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

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
