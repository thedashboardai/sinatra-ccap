import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Divider
} from '@mui/material';
import {
  ArrowBack,
  Email,
  Lock,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { authService } from '../services/api'; // Import the authService

const ResetPasswordPage = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [resetMode, setResetMode] = useState('email'); // 'email' or 'password'

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const showAlert = (message, severity = 'success') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleResetModeChange = (mode) => {
    setResetMode(mode);
    // Clear password fields when switching modes
    if (mode === 'email') {
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email) {
      showAlert('Please enter your email address', 'error');
      return;
    }
    
    if (resetMode === 'password') {
      if (!newPassword) {
        showAlert('Please enter a new password', 'error');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
      }
      
      // Password strength validation
      if (newPassword.length < 8) {
        showAlert('Password must be at least 8 characters', 'error');
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Use the authService for direct password change
        await authService.changePassword(email, newPassword);
        
        showAlert('Password reset successful! Please login with your new password.');
        // Clear the form
        setEmail('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Redirect to login after a delay
        setTimeout(() => {
          onBack();
        }, 3000);
      } catch (error) {
        console.error('Error resetting password:', error);
        if (error.response && error.response.data && error.response.data.message) {
          showAlert(error.response.data.message, 'error');
        } else if (error.code) {
          // Firebase error
          showAlert(`Error: ${error.message}`, 'error');
        } else {
          showAlert('An error occurred. Please try again later.', 'error');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Send a reset email
      setIsLoading(true);
      
      try {
        // Use the authService to send a reset email
        await authService.resetPassword(email);
        
        showAlert('Password reset email sent! Check your inbox for further instructions.');
        // Clear the email field
        setEmail('');
      } catch (error) {
        console.error('Error sending reset email:', error);
        if (error.code === 'auth/user-not-found') {
          showAlert('No account found with this email address.', 'error');
        } else {
          showAlert('An error occurred. Please try again later.', 'error');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        position: 'absolute'
      }}
    >
      {/* Header with back button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <IconButton
          edge="start"
          sx={{ p: 0, color: '#000' }}
          aria-label="back"
          onClick={onBack}
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
          Reset Password
        </Typography>
      </Box>

      {/* Avatar with message */}
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
            src="/student/images/avatar.png"
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
            {resetMode === 'email' 
              ? 'Enter your email and we will send you a password reset link.' 
              : 'Enter your email and a new password to reset your account.'}
          </Typography>
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        {/* Reset options toggle */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant={resetMode === 'email' ? "contained" : "outlined"}
            onClick={() => handleResetModeChange('email')}
            sx={{
              borderRadius: '20px 0 0 20px',
              flex: 1,
              maxWidth: 180,
              py: 1.2,
              color: resetMode === 'email' ? 'white' : '#42a5f5',
              bgcolor: resetMode === 'email' ? '#42a5f5' : 'transparent',
              borderColor: '#42a5f5',
              '&:hover': {
                bgcolor: resetMode === 'email' ? '#2196f3' : 'rgba(33, 150, 243, 0.08)',
                borderColor: '#42a5f5',
              },
            }}
          >
            Send Reset Email
          </Button>
          <Button
            variant={resetMode === 'password' ? "contained" : "outlined"}
            onClick={() => handleResetModeChange('password')}
            sx={{
              borderRadius: '0 20px 20px 0',
              flex: 1,
              maxWidth: 180,
              py: 1.2,
              color: resetMode === 'password' ? 'white' : '#42a5f5',
              bgcolor: resetMode === 'password' ? '#42a5f5' : 'transparent',
              borderColor: '#42a5f5',
              '&:hover': {
                bgcolor: resetMode === 'password' ? '#2196f3' : 'rgba(33, 150, 243, 0.08)',
                borderColor: '#42a5f5',
              },
            }}
          >
            Set New Password
          </Button>
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

        {/* Conditional password fields based on reset mode */}
        {resetMode === 'password' && (
          <>
            {/* New Password field */}
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 1,
                color: '#6b7c93',
                fontWeight: 400,
                fontSize: '1rem'
              }}
            >
              New Password
            </Typography>
            <TextField
              fullWidth
              name="newPassword"
              type={showPassword ? 'text' : 'password'}
              id="newPassword"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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

            {/* Confirm Password field */}
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 1,
                color: '#6b7c93',
                fontWeight: 400,
                fontSize: '1rem'
              }}
            >
              Confirm Password
            </Typography>
            <TextField
              fullWidth
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock fontSize="small" sx={{ color: '#6b7c93' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleToggleConfirmPasswordVisibility}
                      sx={{ color: '#6b7c93' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
          </>
        )}

        {/* Reset button with dynamic text */}
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
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            resetMode === 'email' ? 'Send Reset Email' : 'Reset Password'
          )}
        </Button>
      </form>

      {/* Alert Snackbar */}
      <Snackbar 
        open={alertOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alertSeverity} 
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResetPasswordPage;