import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  CircularProgress, 
  Link as MuiLink,
  Alert,
  Fade,
  Grow,
  alpha,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email as EmailIcon, 
  Lock as LockIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/userSlice';
import { useTheme } from '@mui/material/styles';
import type { UserProfile } from '../../types/user';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with reduced timeout
      setTimeout(() => {
        if (email === 'demo@phrm.com' && password === 'password') {
          // Create a comprehensive demo profile
          const demoProfile: UserProfile = {
            id: 'demo-user-1',
            email: 'demo@phrm.com',
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1985-06-15',
            gender: 'male',
            phone: '+1 (555) 123-4567',
            address: {
              street: '123 Health Street',
              city: 'Wellness City',
              state: 'CA',
              zipCode: '90210',
              country: 'United States'
            },
            emergencyContact: {
              name: 'Jane Doe',
              relationship: 'Spouse',
              phone: '+1 (555) 987-6543'
            },
            medicalInfo: {
              bloodType: 'O+',
              allergies: ['Penicillin', 'Shellfish', 'Peanuts'],
              chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
              medications: ['Metformin 500mg', 'Lisinopril 10mg', 'Aspirin 81mg']
            },
            preferences: {
              theme: 'light',
              notifications: {
                email: true,
                sms: false,
                push: true
              }
            },
            createdAt: '2023-01-15T10:30:00Z',
            updatedAt: new Date().toISOString()
          };
          
          const loginPayload = { token: 'demo-token', profile: demoProfile };
          dispatch(login(loginPayload));
        } else {
          setError('Invalid credentials');
        }
        setLoading(false);
      }, 300);
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
      setLoading(false);
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh" 
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        padding: 2,
      }}
    >
      <Fade in={mounted} timeout={800}>
        <Paper 
          elevation={8} 
          sx={{ 
            p: 4, 
            minWidth: { xs: '90%', sm: 400 }, 
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[12],
            },
          }}
        >
          <Grow in={mounted} timeout={1000}>
            <Box>
              <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <LoginIcon sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Typography variant="h4" fontWeight={700} color="primary">
                  PHRM
                </Typography>
              </Box>

              <Typography variant="h5" fontWeight={600} mb={1} align="center" color="text.primary">
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3} align="center">
                Sign in to your Personal Health Records
              </Typography>

              {error && (
                <Fade in timeout={300}>
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 2, 
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        alignItems: 'center',
                      },
                    }}
                  >
                    {error}
                  </Alert>
                </Fade>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grow in={mounted} timeout={1200}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-1px)',
                          boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
                        },
                      },
                    }}
                  />
                </Grow>

                <Grow in={mounted} timeout={1400}>
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            disabled={loading}
                            sx={{
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-1px)',
                          boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
                        },
                      },
                    }}
                  />
                </Grow>

                <Grow in={mounted} timeout={1600}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: '1rem',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                      '&.Mui-disabled': {
                        background: theme.palette.action.disabledBackground,
                      },
                    }}
                  >
                    {loading ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={20} color="inherit" />
                        <span>Signing in...</span>
                      </Box>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Grow>

                <Grow in={mounted} timeout={1800}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Demo credentials: demo@phrm.com / password
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      Don't have an account?{' '}
                      <MuiLink 
                        component={RouterLink} 
                        to="/register" 
                        sx={{ 
                          fontWeight: 600,
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            textDecoration: 'underline',
                            color: theme.palette.secondary.main,
                          },
                        }}
                      >
                        Sign up
                      </MuiLink>
                    </Typography>
                  </Box>
                </Grow>
              </Box>
            </Box>
          </Grow>
        </Paper>
      </Fade>
    </Box>
  );
};

export default LoginForm;
