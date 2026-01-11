import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeContextProvider');
  }
  return context;
};

export const ThemeContextProvider = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('vcart_theme_mode');
    if (savedMode) return savedMode;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Persist theme preference
  useEffect(() => {
    localStorage.setItem('vcart_theme_mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Create dynamic theme based on mode
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const value = {
    mode,
    toggleTheme,
    theme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Dynamic theme factory
const createAppTheme = (mode) => {
  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isLight ? '#6366F1' : '#818CF8',
        light: isLight ? '#818CF8' : '#A5B4FC',
        dark: isLight ? '#4F46E5' : '#6366F1',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: isLight ? '#EC4899' : '#F472B6',
        light: isLight ? '#F472B6' : '#F9A8D4',
        dark: isLight ? '#DB2777' : '#EC4899',
        contrastText: '#FFFFFF',
      },
      background: {
        default: isLight ? '#F5F7FA' : '#0F172A',
        paper: isLight ? '#FFFFFF' : '#1E293B',
      },
      text: {
        primary: isLight ? '#0A1929' : '#F1F5F9',
        secondary: isLight ? '#475569' : '#94A3B8',
      },
      divider: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
      success: {
        main: isLight ? '#10B981' : '#34D399',
        light: isLight ? '#34D399' : '#6EE7B7',
        dark: isLight ? '#059669' : '#10B981',
      },
      warning: {
        main: isLight ? '#F59E0B' : '#FBBF24',
        light: isLight ? '#FBBF24' : '#FCD34D',
        dark: isLight ? '#D97706' : '#F59E0B',
      },
      error: {
        main: isLight ? '#EF4444' : '#F87171',
        light: isLight ? '#F87171' : '#FCA5A5',
        dark: isLight ? '#DC2626' : '#EF4444',
      },
      info: {
        main: isLight ? '#3B82F6' : '#60A5FA',
        light: isLight ? '#60A5FA' : '#93C5FD',
        dark: isLight ? '#2563EB' : '#3B82F6',
      },
    },
    typography: {
      fontFamily: '"Inter", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: '"Poppins", "Playfair Display", serif',
        fontWeight: 700,
        fontSize: '3.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontFamily: '"Poppins", "Playfair Display", serif',
        fontWeight: 700,
        fontSize: '2.75rem',
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontFamily: '"Poppins", "Playfair Display", serif',
        fontWeight: 600,
        fontSize: '2.25rem',
        lineHeight: 1.3,
      },
      h4: {
        fontFamily: '"Poppins", "Playfair Display", serif',
        fontWeight: 600,
        fontSize: '1.75rem',
        lineHeight: 1.4,
      },
      h5: {
        fontFamily: '"Poppins", serif',
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.4,
      },
      h6: {
        fontFamily: '"Poppins", serif',
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '0.02em',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      isLight 
        ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        : '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
      isLight
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
      isLight
        ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        : '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      isLight
        ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        : '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
      ...Array(20).fill(isLight 
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        : '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      ),
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '10px 24px',
            fontSize: '0.95rem',
            fontWeight: 600,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isLight 
                ? '0 10px 20px rgba(0, 0, 0, 0.15)'
                : '0 10px 20px rgba(0, 0, 0, 0.5)',
            },
          },
          containedPrimary: {
            background: isLight 
              ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
              : 'linear-gradient(135deg, #818CF8 0%, #A78BFA 100%)',
            boxShadow: isLight
              ? '0 4px 12px rgba(99, 102, 241, 0.3)'
              : '0 4px 12px rgba(129, 140, 248, 0.3)',
            '&:hover': {
              background: isLight
                ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
                : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              boxShadow: isLight
                ? '0 8px 20px rgba(99, 102, 241, 0.4)'
                : '0 8px 20px rgba(129, 140, 248, 0.4)',
            },
          },
          containedSecondary: {
            background: isLight
              ? 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)'
              : 'linear-gradient(135deg, #F472B6 0%, #F9A8D4 100%)',
            boxShadow: isLight
              ? '0 4px 12px rgba(236, 72, 153, 0.3)'
              : '0 4px 12px rgba(244, 114, 182, 0.3)',
            '&:hover': {
              background: isLight
                ? 'linear-gradient(135deg, #DB2777 0%, #EC4899 100%)'
                : 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
              boxShadow: isLight
                ? '0 8px 20px rgba(236, 72, 153, 0.4)'
                : '0 8px 20px rgba(244, 114, 182, 0.4)',
            },
          },
          outlined: {
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
              backgroundColor: isLight ? 'rgba(99, 102, 241, 0.04)' : 'rgba(129, 140, 248, 0.08)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: isLight ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 41, 59, 0.8)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: isLight
                ? '0 20px 40px rgba(0, 0, 0, 0.12)'
                : '0 20px 40px rgba(0, 0, 0, 0.6)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: isLight 
              ? '1px solid rgba(0, 0, 0, 0.08)'
              : '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: 'none',
            color: isLight ? '#0A1929' : '#F1F5F9',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 12,
          },
          elevation1: {
            boxShadow: isLight
              ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              transition: 'all 0.3s ease',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isLight ? '#6366F1' : '#818CF8',
                },
              },
              '&.Mui-focused': {
                boxShadow: isLight
                  ? '0 0 0 3px rgba(99, 102, 241, 0.1)'
                  : '0 0 0 3px rgba(129, 140, 248, 0.2)',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiBadge: {
        styleOverrides: {
          badge: {
            fontWeight: 600,
          },
        },
      },
    },
  });
};
