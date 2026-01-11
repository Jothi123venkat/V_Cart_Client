import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = ({ fullscreen = false, size = 40 }) => {
  if (fullscreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <CircularProgress size={size} thickness={4} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
      }}
    >
      <CircularProgress size={size} thickness={4} />
    </Box>
  );
};

export default LoadingSpinner;
