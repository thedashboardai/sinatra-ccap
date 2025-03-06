import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Link,
  Paper,
  Slide,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  ArrowBack,
  Email,
  Lock
} from '@mui/icons-material';
import ProfileSetupPage from './ProfileSetupPage';
import ProfileSetupPage2 from './ProfileSetupPage2';
import ProfileSetupPage3 from './ProfileSetupPage3';
import ProfileSetupPage4 from './ProfileSetupPage4';
import ProfileSuccessDialog from './ProfileSuccessDialog';
import ProfileView from './ProfileView';
import ResetPasswordPage from './ResetPasswordPage';
import { authService } from '../services/api'; // Import the authService
import { ProfileProvider } from '../services/ProfileContext'; // Import the ProfileProvider

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'resetPassword', 'profile1', 'profile2', 'profile3', 'profile4', 'profileView'
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [token, setToken] = useState('');

  // All other functions and hooks remain the same...
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setAlertMessage('Please enter both email and password');
      setAlertSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use the authService for login
      const data = await authService.login(email, password);
      
      // The login has been successful if we reach this point
      // The token is already stored in localStorage by the authService
      
      // Navigate to profile setup
      setCurrentPage('profile1');
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        setAlertMessage('Invalid email or password. Please try again.');
      } else if (error.code === 'auth/too-many-requests') {
        setAlertMessage('Too many failed login attempts. Please try again later or reset your password.');
      } else if (error.response && error.response.data && error.response.data.message) {
        setAlertMessage(error.response.data.message);
      } else {
        setAlertMessage('Failed to login. Please try again later.');
      }
      
      setAlertSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToProfile2 = () => {
    setCurrentPage('profile2');
  };

  const handleNavigateToProfile3 = () => {
    setCurrentPage('profile3');
  };

  const handleNavigateToProfile4 = () => {
    setCurrentPage('profile4');
  };

  const handleNavigateToProfileView = () => {
    setCurrentPage('profileView');
  };
  
  const handleLogout = async () => {
    try {
      await authService.logout();
      // Clear any component state
      setEmail('');
      setPassword('');
      setToken('');
      // Navigate back to login
      setCurrentPage('login');
    } catch (error) {
      console.error('Logout error:', error);
      setAlertMessage('Error during logout. Please try again.');
      setAlertSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleProfileSubmit = () => {
    console.log('Profile submitted!');
    // Show success dialog instead of snackbar
    setSuccessDialogOpen(true);
  };

  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
    // Navigate to profile view after closing the dialog
    handleNavigateToProfileView();
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  const handleNavigateToResetPassword = () => {
    setCurrentPage('resetPassword');
  };
  
  const handleBackFromResetPassword = () => {
    setCurrentPage('login');
  };

  const handleBackToProfile3 = () => {
    setCurrentPage('profile3');
  };

  const handleBackToProfile2 = () => {
    setCurrentPage('profile2');
  };

  const handleBackToProfile1 = () => {
    setCurrentPage('profile1');
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ProfileProvider>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100%',
          bgcolor: '#f5f5f5',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: '390px',
            height: {
              xs: '100%',
              sm: '844px' // iPhone 12 Pro Max height
            },
            borderRadius: {
              xs: 0,
              sm: 3
            },
            overflow: 'hidden',
            bgcolor: '#e8f4fc',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: {
              xs: 'none',
              sm: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 1px rgba(0,0,0,0.1)'
            },
            position: 'relative'
          }}
        >
          {/* Login Form */}
          <Slide direction="right" in={currentPage === 'login'} mountOnEnter unmountOnExit>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                position: 'absolute'
              }}
            >
            {/* Login form content - remains the same */}
            {/* Header with back button */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <IconButton
                edge="start"
                sx={{ p: 0, color: '#000' }}
                aria-label="back"
              >
                <ArrowBack />
              </IconButton>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  ml: 1.5, 
                  fontWeight: 'bold', 
                  fontSize: '2rem',
                  color: '#000'
                }}
              >
                Log In
              </Typography>
            </Box>

            {/* Avatar with welcome message */}
            <Box sx={{ 
              display: 'flex', 
              mt: 3,
              mb: 4,
              alignItems: 'flex-start'
            }}>
              <Box sx={{ 
                width: '80px', 
                height: '80px',
                flexShrink: 0
              }}>
                <img
                  src="student/images/avatar.png"
                  alt="Avatar"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </Box>
              <Box sx={{
                ml: 2,
                p: 3,
                bgcolor: '#fff',
                borderRadius: 4,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#333',
                    fontWeight: 400
                  }}
                >
                  Welcome to Sinatra! Please enter your email and password.
                </Typography>
              </Box>
            </Box>

            {/* Email field */}
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 1,
                color: '#6b7c93',
                fontWeight: 400,
                fontSize: '1rem'
              }}
            >
              Email Address
            </Typography>
            <TextField
              fullWidth
              id="email"
              placeholder="youremail@gmail.com"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email fontSize="small" sx={{ color: '#6b7c93' }} />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 28,
                  bgcolor: '#fff',
                  height: 56,
                  '& fieldset': {
                    borderColor: 'rgba(0,0,0,0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0,0,0,0.2)',
                  },
                },
                '& .MuiInputBase-input': {
                  pl: 0
                }
              }}
            />

            {/* Password field */}
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 1,
                color: '#6b7c93',
                fontWeight: 400,
                fontSize: '1rem'
              }}
            >
              Password
            </Typography>
            <TextField
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock fontSize="small" sx={{ color: '#6b7c93' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      sx={{ color: '#6b7c93' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 28,
                  bgcolor: '#fff',
                  height: 56,
                  '& fieldset': {
                    borderColor: 'rgba(0,0,0,0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0,0,0,0.2)',
                  },
                },
                '& .MuiInputBase-input': {
                  pl: 0
                }
              }}
            />

            {/* Login button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 2,
                py: 1.5,
                bgcolor: '#42a5f5',
                color: 'white',
                '&:hover': {
                  bgcolor: '#2196f3',
                },
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 500,
                borderRadius: 28,
                boxShadow: 'none',
                height: 56
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>

            {/* Forgot password link */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 2 
            }}>
              <Link 
                onClick={handleNavigateToResetPassword}
                sx={{ 
                  color: '#42a5f5', 
                  textDecoration: 'none',
                  fontWeight: 400,
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            {/* Terms and Policy */}
            <Box sx={{ 
              mt: 'auto', 
              textAlign: 'center', 
              py: 3 
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#6b7c93',
                  fontSize: '0.875rem',
                  px: 2
                }}
              >
                By logging in to Sinatra, you agree to our {' '}
                <Link href="#" sx={{ color: '#42a5f5' }}>
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="#" sx={{ color: '#42a5f5' }}>
                  Privacy Policy
                </Link>
              </Typography>
            </Box>
          </Box>
          </Slide>

          {/* Reset Password Page */}
          <Slide direction="left" in={currentPage === 'resetPassword'} mountOnEnter unmountOnExit>
            <Box sx={{ 
              height: '100%', 
              width: '100%',
              position: 'absolute'
            }}>
              <ResetPasswordPage onBack={handleBackFromResetPassword} />
            </Box>
          </Slide>

          {/* Profile Setup Page 1 */}
          <Slide direction={currentPage === 'login' ? 'left' : 'right'} in={currentPage === 'profile1'} mountOnEnter unmountOnExit>
            <Box sx={{ 
              height: '100%', 
              width: '100%',
              position: 'absolute'
            }}>
              <ProfileSetupPage onBack={handleBackToLogin} onNext={handleNavigateToProfile2} />
            </Box>
          </Slide>

          {/* Profile Setup Page 2 */}
          <Slide direction={currentPage === 'profile1' ? 'left' : 'right'} in={currentPage === 'profile2'} mountOnEnter unmountOnExit>
            <Box sx={{ 
              height: '100%', 
              width: '100%',
              position: 'absolute'
            }}>
              <ProfileSetupPage2 onBack={handleBackToProfile1} onNext={handleNavigateToProfile3} />
            </Box>
          </Slide>

          {/* Profile Setup Page 3 */}
          <Slide direction={currentPage === 'profile2' ? 'left' : 'right'} in={currentPage === 'profile3'} mountOnEnter unmountOnExit>
            <Box sx={{ 
              height: '100%', 
              width: '100%',
              position: 'absolute'
            }}>
              <ProfileSetupPage3 onBack={handleBackToProfile2} onNext={handleNavigateToProfile4} />
            </Box>
          </Slide>

          {/* Profile Setup Page 4 (Final) */}
          <Slide direction="left" in={currentPage === 'profile4'} mountOnEnter unmountOnExit>
            <Box sx={{ 
              height: '100%', 
              width: '100%',
              position: 'absolute'
            }}>
              <ProfileSetupPage4 onBack={handleBackToProfile3} onSubmit={handleProfileSubmit} />
            </Box>
          </Slide>

          {/* Profile View */}
          <Slide direction="left" in={currentPage === 'profileView'} mountOnEnter unmountOnExit>
            <Box sx={{ 
              height: '100%', 
              width: '100%',
              position: 'absolute'
            }}>
              <ProfileView onLogout={handleLogout} />
            </Box>
          </Slide>
        </Paper>

        {/* Success Dialog */}
        <ProfileSuccessDialog 
          open={successDialogOpen} 
          onClose={handleCloseSuccessDialog}
        />

        {/* Alert Snackbar */}
        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={4000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={alertSeverity} 
            sx={{ width: '100%' }}
          >
            {alertMessage || 'Profile submitted successfully!'}
          </Alert>
        </Snackbar>
      </Box>
    </ProfileProvider>
  );
};

export default LoginPage;