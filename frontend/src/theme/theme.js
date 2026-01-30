import { createTheme } from '@mui/material/styles';

// Jilinde Credit Brand Colors - Green Theme
const brandColors = {
  primary: {
    50: '#e8f5e8',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50', // Main brand green
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },
  secondary: {
    50: '#f3e5f5',
    100: '#e1bee7',
    200: '#ce93d8',
    300: '#ba68c8',
    400: '#ab47bc',
    500: '#9c27b0',
    600: '#8e24aa',
    700: '#7b1fa2',
    800: '#6a1b9a',
    900: '#4a148c',
  },
  success: {
    50: '#e8f5e8',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50',
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },
  warning: {
    50: '#fff8e1',
    100: '#ffecb3',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffca28',
    500: '#ffc107',
    600: '#ffb300',
    700: '#ffa000',
    800: '#ff8f00',
    900: '#ff6f00',
  },
  error: {
    50: '#ffebee',
    100: '#ffcdd2',
    200: '#ef9a9a',
    300: '#e57373',
    400: '#ef5350',
    500: '#f44336',
    600: '#e53935',
    700: '#d32f2f',
    800: '#c62828',
    900: '#b71c1c',
  },
  info: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3',
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
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
  }
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brandColors.primary[500],
      light: brandColors.primary[300],
      dark: brandColors.primary[700],
      contrastText: '#ffffff',
    },
    secondary: {
      main: brandColors.secondary[500],
      light: brandColors.secondary[300],
      dark: brandColors.secondary[700],
      contrastText: '#ffffff',
    },
    success: {
      main: brandColors.success[500],
      light: brandColors.success[300],
      dark: brandColors.success[700],
      contrastText: '#ffffff',
    },
    warning: {
      main: brandColors.warning[500],
      light: brandColors.warning[300],
      dark: brandColors.warning[700],
      contrastText: '#000000',
    },
    error: {
      main: brandColors.error[500],
      light: brandColors.error[300],
      dark: brandColors.error[700],
      contrastText: '#ffffff',
    },
    info: {
      main: brandColors.info[500],
      light: brandColors.info[300],
      dark: brandColors.info[700],
      contrastText: '#ffffff',
    },
    grey: brandColors.grey,
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      color: brandColors.grey[900],
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: brandColors.grey[900],
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: brandColors.grey[900],
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: brandColors.grey[900],
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: brandColors.grey[900],
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: brandColors.grey[900],
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: brandColors.grey[800],
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: brandColors.grey[700],
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
          },
        },
        contained: {
          background: `linear-gradient(45deg, ${brandColors.primary[500]} 30%, ${brandColors.primary[400]} 90%)`,
          '&:hover': {
            background: `linear-gradient(45deg, ${brandColors.primary[600]} 30%, ${brandColors.primary[500]} 90%)`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${brandColors.grey[200]}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: brandColors.primary[400],
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: brandColors.primary[500],
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${brandColors.primary[600]} 0%, ${brandColors.primary[500]} 100%)`,
          boxShadow: '0 2px 12px rgba(76, 175, 80, 0.15)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${brandColors.grey[200]}`,
          background: '#ffffff',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          '&:hover': {
            backgroundColor: brandColors.primary[50],
          },
          '&.Mui-selected': {
            backgroundColor: brandColors.primary[100],
            color: brandColors.primary[700],
            '&:hover': {
              backgroundColor: brandColors.primary[100],
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
        colorPrimary: {
          backgroundColor: brandColors.primary[100],
          color: brandColors.primary[800],
        },
        colorSuccess: {
          backgroundColor: brandColors.success[100],
          color: brandColors.success[800],
        },
      },
    },
  },
});

export default theme;