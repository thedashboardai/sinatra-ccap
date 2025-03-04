import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(66,165,245,0.2) 0%, rgba(66,165,245,0) 70%)',
            top: '-100px',
            right: '-100px',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(66,165,245,0.1) 0%, rgba(66,165,245,0) 70%)',
            bottom: '-150px',
            left: '-150px',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(33,150,243,0.15) 0%, rgba(33,150,243,0) 70%)',
            top: '20%',
            left: '15%',
          }}
        />
      </Box>
      <LoginPage />
    </ThemeProvider>
  );
}

export default App;