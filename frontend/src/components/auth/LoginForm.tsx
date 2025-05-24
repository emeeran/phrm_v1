import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/userSlice';
import type { UserProfile } from '../../types/user';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default">
      <Paper elevation={3} sx={{ p: 4, minWidth: 340, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={2} align="center">
          Sign In
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2} align="center">
          Demo: Use <strong>demo@phrm.com</strong> / <strong>password</strong>
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            autoFocus
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          <Box display="flex" justifyContent="center" mt={2}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <MuiLink component={RouterLink} to="/register" color="primary">
                Sign up
              </MuiLink>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;
