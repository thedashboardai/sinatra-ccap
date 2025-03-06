import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  LinearProgress,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ArrowBack,
  LocationOn,
  CalendarToday,
  Phone,
  KeyboardArrowDown
} from '@mui/icons-material';
import { useProfile } from '../services/ProfileContext';

const ProfileSetupPage = ({ onBack, onNext }) => {
  const { 
    profileData, 
    updateProfileData, 
    fetchProfile, 
    loading, 
    error, 
    isProfileFetched 
  } = useProfile();
  
  const [pageData, setPageData] = useState({
    firstName: '',
    lastName: '',
    preferredName: '',
    mailingAddress: '',
    willingToRelocate: null,
    dateOfBirth: '',
    phoneNumber: ''
  });

  // Fetch profile data when component mounts
  useEffect(() => {
    if (!isProfileFetched) {
      fetchProfile();
    }
  }, [fetchProfile, isProfileFetched]);

  // Update local state when profileData changes
  useEffect(() => {
    if (profileData) {
      setPageData({
        firstName: profileData.first_name || '',
        lastName: profileData.last_name || '',
        preferredName: profileData.preferred_name || '',
        mailingAddress: profileData.mailing_address || '',
        willingToRelocate: profileData.willing_to_relocate,
        dateOfBirth: profileData.date_of_birth || '',
        phoneNumber: profileData.phone_number || ''
      });
    }
  }, [profileData]);

  const handleChange = (field) => (event) => {
    setPageData({
      ...pageData,
      [field]: event.target.value
    });
  };

  const handleRelocateChoice = (choice) => {
    setPageData({
      ...pageData,
      willingToRelocate: choice
    });
  };

  const handleNext = () => {
    // Update the global profile data with this page's data
    updateProfileData({
      first_name: pageData.firstName,
      last_name: pageData.lastName,
      preferred_name: pageData.preferredName,
      mailing_address: pageData.mailingAddress,
      willing_to_relocate: pageData.willingToRelocate,
      date_of_birth: pageData.dateOfBirth,
      phone_number: pageData.phoneNumber
    });
    
    onNext(); // Navigate to the next page
  };

  if (loading && !isProfileFetched) {
    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading your profile...</Typography>
      </Box>
    );
  }

  if (error && !isProfileFetched) {
    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchProfile}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'auto',
        bgcolor: '#e8f4fc'
      }}
    >
      {/* Header with back button and title */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton
          edge="start"
          onClick={onBack}
          sx={{ p: 0, color: '#000' }}
          aria-label="back"
        >
          <ArrowBack />
        </IconButton>
        <Typography 
          variant="h6" 
          component="h1" 
          sx={{ 
            ml: 1.5, 
            fontWeight: '500', 
            color: '#333',
            fontSize: '1.1rem'
          }}
        >
          Complete Your Profile
        </Typography>
      </Box>

      {/* Progress bar */}
      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={25} 
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#42a5f5',
                borderRadius: 4,
              }
            }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">1/4</Typography>
      </Box>

      {/* Avatar with speech bubble */}
      <Box sx={{ 
        display: 'flex', 
        mb: 3,
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
          p: 2,
          bgcolor: '#fff',
          borderRadius: 4,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#333',
              fontWeight: 400
            }}
          >
            Confirm your personal information on your profile.
          </Typography>
        </Box>
      </Box>

      {/* Form fields */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* First Name */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            First Name
          </Typography>
          <TextField
            fullWidth
            value={pageData.firstName}
            onChange={handleChange('firstName')}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#fff',
              }
            }}
          />
        </Box>

        {/* Last Name */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            Last Name
          </Typography>
          <TextField
            fullWidth
            value={pageData.lastName}
            onChange={handleChange('lastName')}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#fff',
              }
            }}
          />
        </Box>

        {/* Preferred Name */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            What Is Your Preferred Name?
          </Typography>
          <TextField
            fullWidth
            value={pageData.preferredName}
            onChange={handleChange('preferredName')}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#fff',
              }
            }}
          />
        </Box>

        {/* Mailing Address */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            Mailing Address
          </Typography>
          <TextField
            fullWidth
            value={pageData.mailingAddress}
            onChange={handleChange('mailingAddress')}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn sx={{ color: '#6b7c93' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#fff',
              }
            }}
          />
        </Box>

        {/* Willing to Relocate */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            Are You Willing To Relocate?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant={pageData.willingToRelocate === true ? "contained" : "outlined"}
              onClick={() => handleRelocateChoice(true)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                color: pageData.willingToRelocate === true ? 'white' : '#42a5f5',
                borderColor: '#42a5f5',
                '&:hover': {
                  borderColor: '#42a5f5',
                  bgcolor: pageData.willingToRelocate === true ? '#2196f3' : 'rgba(33, 150, 243, 0.04)',
                },
              }}
            >
              Yes
            </Button>
            <Button
              fullWidth
              variant={pageData.willingToRelocate === false ? "contained" : "outlined"}
              onClick={() => handleRelocateChoice(false)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                color: pageData.willingToRelocate === false ? 'white' : '#42a5f5',
                borderColor: '#42a5f5',
                '&:hover': {
                  borderColor: '#42a5f5',
                  bgcolor: pageData.willingToRelocate === false ? '#2196f3' : 'rgba(33, 150, 243, 0.04)',
                },
              }}
            >
              No
            </Button>
          </Box>
        </Box>

        {/* Date of Birth */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            Date Of Birth
          </Typography>
          <TextField
            fullWidth
            value={pageData.dateOfBirth}
            onChange={handleChange('dateOfBirth')}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday sx={{ color: '#6b7c93' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <KeyboardArrowDown sx={{ color: '#6b7c93' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#fff',
              }
            }}
          />
        </Box>

        {/* Mobile Phone Number */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            Mobile Phone Number
          </Typography>
          <TextField
            fullWidth
            value={pageData.phoneNumber}
            onChange={handleChange('phoneNumber')}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone sx={{ color: '#6b7c93' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#fff',
              }
            }}
          />
        </Box>
      </Box>

      {/* Next button */}
      <Button
        fullWidth
        variant="contained"
        onClick={handleNext}
        disabled={loading}
        sx={{
          mt: 'auto',
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
          marginTop: 3
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Next'}
      </Button>
    </Box>
  );
};

export default ProfileSetupPage;