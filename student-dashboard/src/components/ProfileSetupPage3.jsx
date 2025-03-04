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
  Alert
} from '@mui/material';
import {
  KeyboardArrowDown,
  ArrowBack,
  ArrowForward,
  Business,
  Work,
  AccessTime,
  FileCopy
} from '@mui/icons-material';
import { useProfile } from '../services/ProfileContext';

const ProfileSetupPage3 = ({ onBack, onNext }) => {
  const { profileData, updateProfileData, loading, error } = useProfile();
  
  const [pageData, setPageData] = useState({
    hasJob: null,
    workplace: '',
    position: '',
    workHours: '',
    hasResume: null,
    readyToWork: null,
    interests: [],
    hasFoodHandlersCard: null,
    culinarySchoolYears: '',
    resumeFile: null,
    resumeUrl: '',
    foodHandlersCardFile: null,
    foodHandlersCardUrl: null
  });

  // Update local state when profileData changes
  useEffect(() => {
    if (profileData) {
      setPageData({
        hasJob: profileData.current_job,
        workplace: profileData.current_employer || '',
        position: profileData.current_position || '',
        workHours: profileData.current_work_hours?.toString() || '0',
        hasResume: profileData.has_resume,
        readyToWork: profileData.ready_to_work,
        interests: profileData.job_interests || [],
        hasFoodHandlersCard: profileData.food_handlers_card,
        culinarySchoolYears: profileData.culinary_class_years?.toString() || '',
        resumeFile: null,
        resumeUrl: profileData.resume_url || '',
        foodHandlersCardFile: null,
        foodHandlersCardUrl: profileData.food_handlers_card_url || null
      });
    }
  }, [profileData]);

  const handleChange = (field) => (event) => {
    setPageData({
      ...pageData,
      [field]: event.target.value
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
      // In a real implementation, you would upload this file to a server
      // and get back a URL. For now, we'll create a local URL.
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
      // In a real implementation, you would upload this file to a server
      // and get back a URL. For now, we'll create a local URL.
      const fileUrl = URL.createObjectURL(file);
      
      setPageData({
        ...pageData,
        foodHandlersCardFile: file,
        foodHandlersCardUrl: fileUrl,
        hasFoodHandlersCard: true
      });
    }
  };

  const handleNext = () => {
    // Update the global profile data with this page's data
    updateProfileData({
      current_job: pageData.hasJob,
      current_employer: pageData.workplace,
      current_position: pageData.position,
      current_work_hours: parseInt(pageData.workHours) || 0,
      has_resume: pageData.hasResume,
      ready_to_work: pageData.readyToWork,
      job_interests: pageData.interests,
      food_handlers_card: pageData.hasFoodHandlersCard,
      culinary_class_years: parseInt(pageData.culinarySchoolYears) || 0,
      resume_url: pageData.resumeUrl,
      food_handlers_card_url: pageData.foodHandlersCardUrl
    });
    
    onNext(); // Navigate to the next page
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
            src="/images/avatar.png"
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
            Do You Currently Have A Job?
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
        </Box>

        {/* Where do you work - only show if hasJob is true */}
        {pageData.hasJob === true && (
          <>
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
                Where Do You Work?
              </Typography>
              <TextField
                fullWidth
                value={pageData.workplace}
                onChange={handleChange('workplace')}
                variant="outlined"
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
                What Is Your Current Position?
              </Typography>
              <TextField
                fullWidth
                value={pageData.position}
                onChange={handleChange('position')}
                variant="outlined"
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
                How Many Hours A Week Do You Work?
              </Typography>
              <TextField
                fullWidth
                value={pageData.workHours}
                onChange={handleChange('workHours')}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTime sx={{ color: '#6b7c93' }} />
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
            Do You Have A Resume?
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
            Are You Ready To Work Now?
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
        </Box>

        {/* Interests */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            Select The Options That You Are Interested In
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              fullWidth
              variant={pageData.interests.includes('culinary') ? "contained" : "outlined"}
              onClick={() => handleInterestToggle('culinary')}
              sx={{
                borderRadius: 2,
                py: 1.5,
                color: pageData.interests.includes('culinary') ? 'white' : '#42a5f5',
                borderColor: '#42a5f5',
                '&:hover': {
                  borderColor: '#42a5f5',
                  bgcolor: pageData.interests.includes('culinary') ? '#2196f3' : 'rgba(33, 150, 243, 0.04)',
                },
              }}
            >
              Culinary
            </Button>
            <Button
              fullWidth
              variant={pageData.interests.includes('baking') ? "contained" : "outlined"}
              onClick={() => handleInterestToggle('baking')}
              sx={{
                borderRadius: 2,
                py: 1.5,
                color: pageData.interests.includes('baking') ? 'white' : '#42a5f5',
                borderColor: '#42a5f5',
                '&:hover': {
                  borderColor: '#42a5f5',
                  bgcolor: pageData.interests.includes('baking') ? '#2196f3' : 'rgba(33, 150, 243, 0.04)',
                },
              }}
            >
              Baking & Pastry
            </Button>
          </Box>
        </Box>

        {/* Food handlers card */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            Do You Have A Food Handlers Card?
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
            How Many Years Of Culinary School Have You Attended?
          </Typography>
          <TextField
            fullWidth
            value={pageData.culinarySchoolYears}
            onChange={handleChange('culinarySchoolYears')}
            variant="outlined"
            InputProps={{
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