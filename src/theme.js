import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0a1929', // Deep Navy / Midnight Blue
      light: '#132f4c',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#c5a059', // Gold / Champagne
      light: '#e6c683',
      dark: '#947a32',
      contrastText: '#000000',
    },
    background: {
      default: '#f8f9fa', // Soft off-white
      paper: '#ffffff',
    },
    text: {
      primary: '#0a1929',
      secondary: '#505a66',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', // More modern feel
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 8, // Slightly more rounded for modern feel
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #0a1929 30%, #132f4c 90%)',
        },
        containedSecondary: {
            color: '#fff',
            background: 'linear-gradient(45deg, #c5a059 30%, #e6c683 90%)',
        }
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                },
                border: '1px solid rgba(0,0,0,0.05)',
            }
        }
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                backgroundColor: '#0a1929',
            }
        }
    }
  },
});

export default theme;
