import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // TODO: Replace with real API call
    setTimeout(() => {
      setLoading(false);
      if (email && password && fullName) {
        // Success logic here
      } else {
        setError('Please fill all fields');
      }
    }, 1200);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default">
      <Paper elevation={3} sx={{ p: 4, minWidth: 340, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <PersonAddAlt1Icon color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Register
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            fullWidth
            margin="normal"
            required
            autoFocus
            autoComplete="name"
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
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
            autoComplete="new-password"
          />
          {error && (
            <Typography color="error" variant="body2" mt={1} mb={1} align="center">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, mb: 1, py: 1.2, fontWeight: 700, fontSize: '1rem' }}
            disabled={loading}
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
          <Box display="flex" justifyContent="center" mt={2}>
            <Typography variant="body2">
              Already have an account?{' '}
              <MuiLink component={RouterLink} to="/" color="primary">
                Sign in
              </MuiLink>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterForm;
