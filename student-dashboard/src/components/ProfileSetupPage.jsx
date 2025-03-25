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
  Alert,
  FormHelperText
} from '@mui/material';
import {
  ArrowBack,
  LocationOn,
  CalendarToday,
  Phone,
  Person,
  PersonOutline
} from '@mui/icons-material';
import { useProfile } from '../services/ProfileContext';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const ProfileSetupPage = ({ onBack, onNext }) => {
  const { 
    profileData, 
    updateProfileData, 
    fetchProfile, 
    loading, 
    error, 
    isProfileFetched,
    validationErrors 
  } = useProfile();
  
  const [pageData, setPageData] = useState({
    firstName: '',
    lastName: '',
    preferredName: '',
    mailingAddress: '',
    willingToRelocate: null,
    dateOfBirth: null,
    phoneNumber: ''
  });

  const [formErrors, setFormErrors] = useState({});

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
        dateOfBirth: profileData.date_of_birth ? new Date(profileData.date_of_birth) : null,
        phoneNumber: profileData.phone_number || ''
      });
    }
  }, [profileData]);

  // Update form errors when validation errors change
  useEffect(() => {
    setFormErrors({
      firstName: validationErrors.first_name || '',
      lastName: validationErrors.last_name || '',
      mailingAddress: validationErrors.mailing_address || '',
      dateOfBirth: validationErrors.date_of_birth || '',
      phoneNumber: validationErrors.phone_number || ''
    });
  }, [validationErrors]);

  const handleChange = (field) => (event) => {
    setPageData({
      ...pageData,
      [field]: event.target.value
    });
    
    // Clear error when field is changed
    if (formErrors[field]) {
      setFormErrors({
        ...formErrors,
        [field]: ''
      });
    }
  };

  const handleDateChange = (date) => {
    setPageData({
      ...pageData,
      dateOfBirth: date
    });
    
    // Clear error when field is changed
    if (formErrors.dateOfBirth) {
      setFormErrors({
        ...formErrors,
        dateOfBirth: ''
      });
    }
  };

  const handleRelocateChoice = (choice) => {
    setPageData({
      ...pageData,
      willingToRelocate: choice
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!pageData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!pageData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!pageData.mailingAddress.trim()) {
      errors.mailingAddress = 'Mailing address is required';
    }
    
    if (!pageData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else {
      // Basic phone number validation
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(pageData.phoneNumber.replace(/[^0-9+]/g, ''))) {
        errors.phoneNumber = 'Please enter a valid phone number';
      }
    }
    
    if (pageData.dateOfBirth && isNaN(new Date(pageData.dateOfBirth).getTime())) {
      errors.dateOfBirth = 'Please enter a valid date';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
    // Format date to ISO string if it exists
    const formattedDate = pageData.dateOfBirth instanceof Date && !isNaN(pageData.dateOfBirth)
      ? pageData.dateOfBirth.toISOString().split('T')[0]
      : pageData.dateOfBirth;
    
    // Update the global profile data with this page's data
    const success = updateProfileData({
      first_name: pageData.firstName,
      last_name: pageData.lastName,
      preferred_name: pageData.preferredName,
      mailing_address: pageData.mailingAddress,
      willing_to_relocate: pageData.willingToRelocate,
      date_of_birth: formattedDate,
      phone_number: pageData.phoneNumber
    });
    
    if (success) {
      onNext(); // Navigate to the next page
    }
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
            First Name *
          </Typography>
          <TextField
            fullWidth
            value={pageData.firstName}
            onChange={handleChange('firstName')}
            variant="outlined"
            error={!!formErrors.firstName}
            helperText={formErrors.firstName}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: '#6b7c93' }} />
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

        {/* Last Name */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            Last Name *
          </Typography>
          <TextField
            fullWidth
            value={pageData.lastName}
            onChange={handleChange('lastName')}
            variant="outlined"
            error={!!formErrors.lastName}
            helperText={formErrors.lastName}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: '#6b7c93' }} />
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline sx={{ color: '#6b7c93' }} />
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

        {/* Mailing Address */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            Mailing Address *
          </Typography>
          <TextField
            fullWidth
            value={pageData.mailingAddress}
            onChange={handleChange('mailingAddress')}
            variant="outlined"
            error={!!formErrors.mailingAddress}
            helperText={formErrors.mailingAddress}
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
            Are You Willing To Relocate? *
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
            Date Of Birth *
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={pageData.dateOfBirth}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!formErrors.dateOfBirth}
                  helperText={formErrors.dateOfBirth}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: '#6b7c93' }} />
                      </InputAdornment>
                    ),
                    ...params.InputProps
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: '#fff',
                    }
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </Box>

        {/* Mobile Phone Number */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            Mobile Phone Number *
          </Typography>
          <TextField
            fullWidth
            value={pageData.phoneNumber}
            onChange={handleChange('phoneNumber')}
            variant="outlined"
            error={!!formErrors.phoneNumber}
            helperText={formErrors.phoneNumber}
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
        
        <FormHelperText>* Required fields</FormHelperText>
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