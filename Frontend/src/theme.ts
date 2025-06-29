import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1', // Indigo
      contrastText: '#fff',
    },
    secondary: {
      main: '#06b6d4', // Cyan
      contrastText: '#fff',
    },
    background: {
      default: 'linear-gradient(135deg, #f0fdfa 0%, #e0e7ff 100%)',
      paper: 'rgba(255,255,255,0.85)',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e42',
    },
    info: {
      main: '#3b82f6',
    },
    success: {
      main: '#22c55e',
    },
    text: {
      primary: '#2d3748',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 800, fontSize: '2.7rem', letterSpacing: 1 },
    h2: { fontWeight: 700, fontSize: '2.2rem' },
    h3: { fontWeight: 700, fontSize: '1.7rem' },
    h4: { fontWeight: 600, fontSize: '1.3rem' },
    h5: { fontWeight: 500, fontSize: '1.1rem' },
    h6: { fontWeight: 500, fontSize: '1rem' },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.95rem' },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: 'none',
          fontWeight: 700,
          boxShadow: '0 2px 8px 0 rgba(99,102,241,0.08)',
          transition: 'box-shadow 0.2s',
          '&:hover': {
            boxShadow: '0 4px 16px 0 rgba(99,102,241,0.18)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
          boxShadow: '0 8px 32px 0 rgba(99,102,241,0.10)',
          borderRadius: 18,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: '0 8px 32px 0 rgba(99,102,241,0.10)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      contrastText: '#fff',
    },
    secondary: {
      main: '#06b6d4',
      contrastText: '#fff',
    },
    background: {
      default: 'linear-gradient(135deg, #18181b 0%, #23232a 100%)',
      paper: '#23232a',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e42',
    },
    info: {
      main: '#3b82f6',
    },
    success: {
      main: '#22c55e',
    },
    text: {
      primary: '#f3f4f6',
      secondary: '#a1a1aa',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 800, fontSize: '2.7rem', letterSpacing: 1 },
    h2: { fontWeight: 700, fontSize: '2.2rem' },
    h3: { fontWeight: 700, fontSize: '1.7rem' },
    h4: { fontWeight: 600, fontSize: '1.3rem' },
    h5: { fontWeight: 500, fontSize: '1.1rem' },
    h6: { fontWeight: 500, fontSize: '1rem' },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.95rem' },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: 'none',
          fontWeight: 700,
          boxShadow: '0 2px 8px 0 rgba(99,102,241,0.08)',
          transition: 'box-shadow 0.2s',
          '&:hover': {
            boxShadow: '0 4px 16px 0 rgba(99,102,241,0.18)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #23232a 0%, #18181b 100%)',
          boxShadow: '0 8px 32px 0 rgba(99,102,241,0.18)',
          borderRadius: 18,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: '0 8px 32px 0 rgba(99,102,241,0.18)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(24,24,27,0.9)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
        },
      },
    },
  },
});
