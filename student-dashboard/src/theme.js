import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#42a5f5', // Blue color from the login button
      light: '#e8f4fc', // Light blue background
    },
    secondary: {
      main: '#6b7c93', // Gray text color
    },
    background: {
      default: '#f5f5f5',
      paper: '#e8f4fc',
    },
    text: {
      primary: '#000000',
      secondary: '#6b7c93',
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
    button: {
      textTransform: 'none',
    },
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    body1: {
      fontSize: '1rem',
      color: '#6b7c93',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#6b7c93',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 28,
            backgroundColor: '#ffffff',
            '& fieldset': {
              borderColor: 'rgba(0,0,0,0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0,0,0,0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#42a5f5',
            },
          },
          '& .MuiInputBase-input': {
            padding: '16.5px 14px',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 4,
        },
        bar: {
          borderRadius: 4,
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#42a5f5',
          '&:hover': {
            backgroundColor: '#2196f3',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#e8f4fc',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f5f5f5',
        },
      },
    },
  },
});

export default theme;