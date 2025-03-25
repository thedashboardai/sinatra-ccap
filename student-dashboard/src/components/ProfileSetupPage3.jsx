import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  LinearProgress,
  InputAdornment,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  FormHelperText,
  FormControl
} from '@mui/material';
import {
  KeyboardArrowDown,
  ArrowBack,
  ArrowForward,
  Business,
  Work,
  AccessTime,
  FileCopy,
  DateRange
} from '@mui/icons-material';
import { useProfile } from '../services/ProfileContext';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const ProfileSetupPage3 = ({ onBack, onNext }) => {
  const { profileData, updateProfileData, loading, error, validationErrors, jobInterestMap } = useProfile();
  
  const [pageData, setPageData] = useState({
    hasJob: null,
    workplace: '',
    position: '',
    workHours: '',
    hasResume: null,
    readyToWork: null,
    startDate: null,
    interests: [],
    hasFoodHandlersCard: null,
    culinarySchoolYears: '',
    resumeFile: null,
    resumeUrl: '',
    foodHandlersCardFile: null,
    foodHandlersCardUrl: null
  });

  const [formErrors, setFormErrors] = useState({});

  // Culinary and Baking/Pastry options with their UUIDs
  const JOB_INTEREST_OPTIONS = {
    'Culinary': 'df832319-251b-4f01-968c-4bc4028cf126',
    'Baking and Pastry': '9e4ad21c-1863-4a66-8ded-fed975b6c3d9'
  };

  // Update local state when profileData changes
  useEffect(() => {
    if (profileData) {
      // Convert job interests from UUIDs to readable values
      let interestsArray = [];
      
      if (Array.isArray(profileData.job_interests)) {
        // Map UUIDs to readable values or keep as-is if not found in map
        interestsArray = profileData.job_interests.map(
          uuid => Object.keys(JOB_INTEREST_OPTIONS).find(key => JOB_INTEREST_OPTIONS[key] === uuid) || uuid
        );
      }
      
      setPageData({
        hasJob: profileData.current_job,
        workplace: profileData.current_employer || '',
        position: profileData.current_position || '',
        workHours: profileData.current_work_hours ? profileData.current_work_hours.toString() : '',
        hasResume: profileData.has_resume,
        readyToWork: profileData.ready_to_work,
        startDate: profileData.start_date ? new Date(profileData.start_date) : null,
        interests: interestsArray,
        hasFoodHandlersCard: profileData.food_handlers_card,
        culinarySchoolYears: profileData.culinary_class_years ? profileData.culinary_class_years.toString() : '',
        resumeFile: null,
        resumeUrl: profileData.resume_url || '',
        foodHandlersCardFile: null,
        foodHandlersCardUrl: profileData.food_handlers_card_url || null
      });
    }
  }, [profileData]);

  // Update form errors when validation errors change
  useEffect(() => {
    setFormErrors({
      workHours: validationErrors.current_work_hours || '',
      culinarySchoolYears: validationErrors.culinary_class_years || ''
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
      startDate: date
    });
  };

  const handleBooleanChoice = (field, choice) => {
    setPageData({
      ...pageData,
      [field]: choice
    });
  };

  const handleInterestToggle = (interest) => {
    const currentInterests = [...pageData.interests];
    
    if (currentInterests.includes(interest)) {
      setPageData({
        ...pageData,
        interests: currentInterests.filter(item => item !== interest)
      });
    } else {
      setPageData({
        ...pageData,
        interests: [...currentInterests, interest]
      });
    }
  };

  const handleResumeUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Create a local URL for preview
      const fileUrl = URL.createObjectURL(file);
      
      setPageData({
        ...pageData,
        resumeFile: file,
        resumeUrl: fileUrl,
        hasResume: true
      });
    }
  };

  const handleFoodHandlersCardUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Create a local URL for preview
      const fileUrl = URL.createObjectURL(file);
      
      setPageData({
        ...pageData,
        foodHandlersCardFile: file,
        foodHandlersCardUrl: fileUrl,
        hasFoodHandlersCard: true
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Required validations
    if (pageData.hasJob === null) {
      errors.hasJob = 'Please select whether you currently have a job';
    }
    
    if (pageData.hasJob === true) {
      if (!pageData.workplace.trim()) {
        errors.workplace = 'Please enter your workplace';
      }
      
      if (!pageData.position.trim()) {
        errors.position = 'Please enter your position';
      }
      
      if (!pageData.workHours.trim()) {
        errors.workHours = 'Please enter your work hours';
      } else if (isNaN(pageData.workHours) || parseInt(pageData.workHours) < 0) {
        errors.workHours = 'Please enter a valid number of hours';
      }
    }
    
    if (pageData.hasResume === null) {
      errors.hasResume = 'Please select whether you have a resume';
    }
    
    if (pageData.readyToWork === null) {
      errors.readyToWork = 'Please select whether you are ready to work';
    }
    
    if (pageData.readyToWork === false && !pageData.startDate) {
      errors.startDate = 'Please select when you will be ready to work';
    }
    
    if (pageData.interests.length === 0) {
      errors.interests = 'Please select at least one interest';
    }
    
    if (pageData.hasFoodHandlersCard === null) {
      errors.hasFoodHandlersCard = 'Please select whether you have a food handlers card';
    }
    
    if (!pageData.culinarySchoolYears.trim()) {
      errors.culinarySchoolYears = 'Please enter years of culinary school';
    } else if (isNaN(pageData.culinarySchoolYears) || parseInt(pageData.culinarySchoolYears) < 0) {
      errors.culinarySchoolYears = 'Please enter a valid number of years';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
    // Convert readable interests to UUIDs
    const interestUUIDs = pageData.interests.map(
      interest => JOB_INTEREST_OPTIONS[interest] || interest
    );
    
    // Format date to ISO string if it exists
    const formattedStartDate = pageData.startDate instanceof Date && !isNaN(pageData.startDate)
      ? pageData.startDate.toISOString().split('T')[0]
      : null;
    
    // Update the global profile data with this page's data
    const success = updateProfileData({
      current_job: pageData.hasJob,
      current_employer: pageData.workplace,
      current_position: pageData.position,
      current_work_hours: parseInt(pageData.workHours) || 0,
      has_resume: pageData.hasResume,
      ready_to_work: pageData.readyToWork,
      start_date: formattedStartDate,
      job_interests: interestUUIDs,
      food_handlers_card: pageData.hasFoodHandlersCard,
      culinary_class_years: parseInt(pageData.culinarySchoolYears) || 0,
      resume_url: pageData.resumeUrl,
      food_handlers_card_url: pageData.foodHandlersCardUrl
    });
    
    if (success) {
      onNext(); // Navigate to the next page
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
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
        <Button
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{ 
            p: 0, 
            color: '#000',
            minWidth: 'auto',
            textTransform: 'none',
            fontWeight: 'normal'
          }}
        >
          Complete Your Profile
        </Button>
      </Box>

      {/* Progress bar */}
      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={75} 
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
        <Typography variant="body2" color="text.secondary">3/4</Typography>
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
            Confirm your background and work preferences.
          </Typography>
        </Box>
      </Box>

      {/* Form fields */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Currently have a job */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            Do You Currently Have A Job? *
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant={pageData.hasJob === true ? "contained" : "outlined"}
              onClick={() => handleBooleanChoice('hasJob', true)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                color: pageData.hasJob === true ? 'white' : '#42a5f5',
                borderColor: '#42a5f5',
                '&:hover': {
                  borderColor: '#42a5f5',
                  bgcolor: pageData.hasJob === true ? '#2196f3' : 'rgba(33, 150, 243, 0.04)',
                },
              }}
            >
              Yes
            </Button>
            <Button
              fullWidth
              variant={pageData.hasJob === false ? "contained" : "outlined"}
              onClick={() => handleBooleanChoice('hasJob', false)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                color: pageData.hasJob === false ? 'white' : '#42a5f5',
                borderColor: '#42a5f5',
                '&:hover': {
                  borderColor: '#42a5f5',
                  bgcolor: pageData.hasJob === false ? '#2196f3' : 'rgba(33, 150, 243, 0.04)',
                },
              }}
            >
              No
            </Button>
          </Box>
          {formErrors.hasJob && (
            <FormHelperText error>{formErrors.hasJob}</FormHelperText>
          )}
        </Box>

        {/* Where do you work - only show if hasJob is true */}
        {pageData.hasJob === true && (
          <>
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
                Where Do You Work? *
              </Typography>
              <TextField
                fullWidth
                value={pageData.workplace}
                onChange={handleChange('workplace')}
                variant="outlined"
                error={!!formErrors.workplace}
                helperText={formErrors.workplace}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business sx={{ color: '#6b7c93' }} />
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

            {/* Current position */}
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
                What Is Your Current Position? *
              </Typography>
              <TextField
                fullWidth
                value={pageData.position}
                onChange={handleChange('position')}
                variant="outlined"
                error={!!formErrors.position}
                helperText={formErrors.position}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Work sx={{ color: '#6b7c93' }} />
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

            {/* Work hours */}
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
                How Many Hours A Week Do You Work? *
              </Typography>
              <TextField
                fullWidth
                value={pageData.workHours}
                onChange={handleChange('workHours')}
                variant="outlined"
                type="number"
                error={!!formErrors.workHours}
                helperText={formErrors.workHours}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTime sx={{ color: '#6b7c93' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      hours
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
          </>
        )}

        {/* Has resume */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            Do You Have A Resume? *
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant={pageData.hasResume === true ? "contained" : "outlined"}
              onClick={() => handleBooleanChoice('hasResume', true)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                color: pageData.hasResume === true ? 'white' : '#42a5f5',
                borderColor: '#42a5f5',
                '&:hover': {
                  borderColor: '#42a5f5',
                  bgcolor: pageData.hasResume === true ? '#2196f3' : 'rgba(33, 150, 243, 0.04)',
                },
              }}
            >
              Yes
            </Button>
            <Button
              fullWidth
              variant={pageData.hasResume === false ? "contained" : "outlined"}
              onClick={() => handleBooleanChoice('hasResume', false)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                color: pageData.hasResume === false ? 'white' : '#42a5f5',
                borderColor: '#42a5f5',
                '&:hover': {
                  borderColor: '#42a5f5',
                  bgcolor: pageData.hasResume === false ? '#2196f3' : 'rgba(33, 150, 243, 0.04)',
                },
              }}
            >
              No
            </Button>
          </Box>
          {formErrors.hasResume && (
            <FormHelperText error>{formErrors.hasResume}</FormHelperText>
          )}
        </Box>

        {/* Upload resume - only show if hasResume is true */}
        {pageData.hasResume === true && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: '#f5f5f5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
              mb: 1
            }}
          >
            <FileCopy sx={{ color: '#6b7c93', fontSize: 32 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#333', textAlign: 'center' }}>
              {pageData.resumeUrl ? 'Resume Uploaded' : 'Upload Your Resume'}
            </Typography>
            {pageData.resumeUrl ? (
              <Typography variant="caption" sx={{ color: '#42a5f5', textAlign: 'center' }}>
                Resume uploaded successfully
              </Typography>
            ) : (
              <Typography variant="caption" sx={{ color: '#6b7c93', textAlign: 'center' }}>
                pdf, doc, and jpeg are supported
              </Typography>
            )}
            <Button
              variant="contained"
              component="label"
              sx={{
                bgcolor: '#42a5f5',
                color: 'white',
                '&:hover': {
                  bgcolor: '#2196f3',
                },
                borderRadius: 28,
                py: 1,
                px: 3,
                textTransform: 'none'
              }}
            >
              {pageData.resumeUrl ? 'Change File' : 'Choose File'}
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx,.jpeg,.jpg"
                onChange={handleResumeUpload}
              />
            </Button>
          </Paper>
        )}

        {/* Ready to work */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            Are You Ready To Work Now? *
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant={pageData.readyToWork === true ? "contained" : "outlined"}
              onClick={() => handleBooleanChoice('readyToWork', true)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                color: pageData.readyToWork === true ? 'white' : '#42a5f5',
                borderColor: '#42a5f5',
                '&:hover': {
                  borderColor: '#42a5f5',
                  bgcolor: pageData.readyToWork === true ? '#2196f3' : 'rgba(33, 150, 243, 0.04)',
                },
              }}
            >
              Yes
            </Button>
            <Button
              fullWidth
              variant={pageData.readyToWork === false ? "contained" : "outlined"}
              onClick={() => handleBooleanChoice('readyToWork', false)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                color: pageData.readyToWork === false ? 'white' : '#42a5f5',
                borderColor: '#42a5f5',
                '&:hover': {
                  borderColor: '#42a5f5',
                  bgcolor: pageData.readyToWork === false ? '#2196f3' : 'rgba(33, 150, 243, 0.04)',
                },
              }}
            >
              No
            </Button>
          </Box>
          {formErrors.readyToWork && (
            <FormHelperText error>{formErrors.readyToWork}</FormHelperText>
          )}
        </Box>

        {/* Start date - only show if not ready to work now */}
        {pageData.readyToWork === false && (
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
              When Will You Be Ready To Work? *
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={pageData.startDate}
                onChange={handleDateChange}
                minDate={new Date()} // Cannot select a date in the past
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!formErrors.startDate}
                    helperText={formErrors.startDate}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRange sx={{ color: '#6b7c93' }} />
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
        )}

        {/* Interests */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            Select The Options That You Are Interested In *
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              fullWidth
              variant={pageData.interests.includes('Culinary') ? "contained" : "outlined"}
              onClick={() => handleInterestToggle('Culinary')}
              sx={{
                borderRadius: 2,
                py: 1.5,
                color: pageData.interests.includes('Culinary') ? 'white' : '#42a5f5',
                borderColor: '#42a5f5',
                '&:hover': {
                  borderColor: '#42a5f5',
                  bgcolor: pageData.interests.includes('Culinary') ? '#2196f3' : 'rgba(33, 150, 243, 0.04)',
                },
              }}
            >
              Culinary
            </Button>
            <Button
              fullWidth
              variant={pageData.interests.includes('Baking and Pastry') ? "contained" : "outlined"}
              onClick={() => handleInterestToggle('Baking and Pastry')}
              sx={{
                borderRadius: 2,
                py: 1.5,
                color: pageData.interests.includes('Baking and Pastry') ? 'white' : '#42a5f5',
                borderColor: '#42a5f5',
                '&:hover': {
                  borderColor: '#42a5f5',
                  bgcolor: pageData.interests.includes('Baking and Pastry') ? '#2196f3' : 'rgba(33, 150, 243, 0.04)',
                },
              }}
            >
              Baking & Pastry
            </Button>
          </Box>
          {formErrors.interests && (
            <FormHelperText error>{formErrors.interests}</FormHelperText>
          )}
        </Box>

        {/* Food handlers card */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            Do You Have A Food Handlers Card? *
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant={pageData.hasFoodHandlersCard === true ? "contained" : "outlined"}
              onClick={() => handleBooleanChoice('hasFoodHandlersCard', true)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                color: pageData.hasFoodHandlersCard === true ? 'white' : '#42a5f5',
                borderColor: '#42a5f5',
                '&:hover': {
                  borderColor: '#42a5f5',
                  bgcolor: pageData.hasFoodHandlersCard === true ? '#2196f3' : 'rgba(33, 150, 243, 0.04)',
                },
              }}
            >
              Yes
            </Button>
            <Button
              fullWidth
              variant={pageData.hasFoodHandlersCard === false ? "contained" : "outlined"}
              onClick={() => handleBooleanChoice('hasFoodHandlersCard', false)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                color: pageData.hasFoodHandlersCard === false ? 'white' : '#42a5f5',
                borderColor: '#42a5f5',
                '&:hover': {
                  borderColor: '#42a5f5',
                  bgcolor: pageData.hasFoodHandlersCard === false ? '#2196f3' : 'rgba(33, 150, 243, 0.04)',
                },
              }}
            >
              No
            </Button>
          </Box>
          {formErrors.hasFoodHandlersCard && (
            <FormHelperText error>{formErrors.hasFoodHandlersCard}</FormHelperText>
          )}
        </Box>

        {/* Upload food handlers card - only show if hasFoodHandlersCard is true */}
        {pageData.hasFoodHandlersCard === true && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: '#f5f5f5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
              mb: 1
            }}
          >
            <FileCopy sx={{ color: '#6b7c93', fontSize: 32 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#333', textAlign: 'center' }}>
              {pageData.foodHandlersCardUrl ? 'Card Uploaded' : 'Upload Your Food Handlers Card'}
            </Typography>
            {pageData.foodHandlersCardUrl ? (
              <Typography variant="caption" sx={{ color: '#42a5f5', textAlign: 'center' }}>
                Food handlers card uploaded successfully
              </Typography>
            ) : (
              <Typography variant="caption" sx={{ color: '#6b7c93', textAlign: 'center' }}>
                pdf, doc, and jpeg are supported
              </Typography>
            )}
            <Button
              variant="contained"
              component="label"
              sx={{
                bgcolor: '#42a5f5',
                color: 'white',
                '&:hover': {
                  bgcolor: '#2196f3',
                },
                borderRadius: 28,
                py: 1,
                px: 3,
                textTransform: 'none'
              }}
            >
              {pageData.foodHandlersCardUrl ? 'Change File' : 'Choose File'}
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx,.jpeg,.jpg"
                onChange={handleFoodHandlersCardUpload}
              />
            </Button>
          </Paper>
        )}

        {/* Culinary school years */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            How Many Years Of Culinary School Have You Attended? *
          </Typography>
          <TextField
            fullWidth
            value={pageData.culinarySchoolYears}
            onChange={handleChange('culinarySchoolYears')}
            variant="outlined"
            type="number"
            error={!!formErrors.culinarySchoolYears}
            helperText={formErrors.culinarySchoolYears}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  years
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

      {/* Navigation buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          startIcon={<ArrowBack />}
          sx={{
            py: 1.5,
            flex: 1,
            color: '#42a5f5',
            borderColor: '#42a5f5',
            borderRadius: 28,
            textTransform: 'none',
            '&:hover': {
              borderColor: '#42a5f5',
              bgcolor: 'rgba(33, 150, 243, 0.04)',
            },
          }}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
          disabled={loading}
          sx={{
            py: 1.5,
            flex: 1,
            bgcolor: '#42a5f5',
            color: 'white',
            borderRadius: 28,
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#2196f3',
            },
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileSetupPage3;