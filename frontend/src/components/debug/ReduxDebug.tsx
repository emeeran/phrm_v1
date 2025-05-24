import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { logout } from '../../store/userSlice';
import { Box, Typography, Paper, Button } from '@mui/material';

const ReduxDebug: React.FC = () => {
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const clearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  const testLogout = () => {
    dispatch(logout());
  };

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.100' }}>
      <Typography variant="h6" gutterBottom>
        Redux Debug Info
      </Typography>
      <Typography variant="body2">
        <strong>isAuthenticated:</strong> {userState.isAuthenticated ? 'true' : 'false'}
      </Typography>
      <Typography variant="body2">
        <strong>token:</strong> {userState.token || 'null'}
      </Typography>
      <Typography variant="body2">
        <strong>profile:</strong> {userState.profile ? JSON.stringify(userState.profile) : 'null'}
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button size="small" variant="outlined" onClick={clearStorage}>
          Clear Storage
        </Button>
        <Button size="small" variant="outlined" onClick={testLogout}>
          Test Logout
        </Button>
      </Box>
    </Paper>
  );
};

export default ReduxDebug;
