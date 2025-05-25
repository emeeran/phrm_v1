import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { 
      fontWeight: 800,
      fontSize: '3.5rem',
      lineHeight: 1.2,
    },
    h2: { 
      fontWeight: 800,
      fontSize: '3rem',
      lineHeight: 1.2,
    },
    h3: { 
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.3,
    },
    h4: { 
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h5: { 
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h6: { 
      fontWeight: 700,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.12)',
    '0px 16px 32px rgba(0,0,0,0.15)',
    '0px 20px 40px rgba(0,0,0,0.18)',
    '0px 24px 48px rgba(0,0,0,0.2)',
    '0px 32px 64px rgba(0,0,0,0.25)',
    '0px 40px 80px rgba(0,0,0,0.3)',
    '0px 48px 96px rgba(0,0,0,0.35)',
    '0px 56px 112px rgba(0,0,0,0.4)',
    '0px 64px 128px rgba(0,0,0,0.45)',
    '0px 72px 144px rgba(0,0,0,0.5)',
    '0px 80px 160px rgba(0,0,0,0.55)',
    '0px 88px 176px rgba(0,0,0,0.6)',
    '0px 96px 192px rgba(0,0,0,0.65)',
    '0px 104px 208px rgba(0,0,0,0.7)',
    '0px 112px 224px rgba(0,0,0,0.75)',
    '0px 120px 240px rgba(0,0,0,0.8)',
    '0px 128px 256px rgba(0,0,0,0.85)',
    '0px 136px 272px rgba(0,0,0,0.9)',
    '0px 144px 288px rgba(0,0,0,0.95)',
    '0px 152px 304px rgba(0,0,0,1)',
    '0px 160px 320px rgba(0,0,0,1)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
          '&:hover': {
            boxShadow: '0px 8px 24px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
