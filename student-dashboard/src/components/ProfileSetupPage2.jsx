import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  LinearProgress,
  InputAdornment,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress
} from '@mui/material';
import {
  KeyboardArrowDown,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';
import { useProfile } from '../services/ProfileContext';

const ProfileSetupPage2 = ({ onBack, onNext }) => {
  const { profileData, updateProfileData, loading } = useProfile();
  
  const [pageData, setPageData] = useState({
    school: '',
    graduationYear: '',
    transportation: 'drive',
    hoursPerWeek: '',
    timeAvailable: '',
    availableWeekends: null
  });

  // Update local state when profileData changes
  useEffect(() => {
    if (profileData) {
      setPageData({
        school: profileData.high_school || '',
        graduationYear: profileData.graduation_year || '',
        transportation: profileData.transportation || 'drive',
        hoursPerWeek: profileData.hours_per_week?.toString() || '40',
        timeAvailable: profileData.work_preference ? profileData.work_preference[0] : 'Morning(6 AM - 10 AM)',
        availableWeekends: profileData.available_weekends
      });
    }
  }, [profileData]);

  const handleChange = (field) => (event) => {
    setPageData({
      ...pageData,
      [field]: event.target.value
    });
  };

  const handleWeekendChoice = (choice) => {
    setPageData({
      ...pageData,
      availableWeekends: choice
    });
  };

  const handleNext = () => {
    // Update global profile data
    updateProfileData({
      high_school: pageData.school,
      graduation_year: pageData.graduationYear,
      transportation: pageData.transportation,
      hours_per_week: parseInt(pageData.hoursPerWeek) || 40,
      work_preference: [pageData.timeAvailable],
      available_weekends: pageData.availableWeekends
    });
    
    onNext();
  };

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
            value={50} 
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
        <Typography variant="body2" color="text.secondary">2/4</Typography>
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
        {/* School */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            High School Or College Where Culinary Classes Were Taken
          </Typography>
          <TextField
            fullWidth
            value={pageData.school}
            onChange={handleChange('school')}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#fff',
              }
            }}
          />
        </Box>

        {/* Graduation Year */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            What Is Your Year Of Graduation?
          </Typography>
          <TextField
            fullWidth
            value={pageData.graduationYear}
            onChange={handleChange('graduationYear')}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#fff',
              }
            }}
          />
        </Box>

        {/* Transportation */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            How Will You Get To Work?
          </Typography>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              name="transportation"
              value={pageData.transportation}
              onChange={handleChange('transportation')}
            >
              <FormControlLabel
                value="drive"
                control={
                  <Radio sx={{ display: 'none' }} />
                }
                label={
                  <Button
                    fullWidth
                    variant={pageData.transportation === 'drive' ? "contained" : "outlined"}
                    onClick={() => setPageData({...pageData, transportation: 'drive'})}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      mb: 1,
                      justifyContent: 'center',
                      color: pageData.transportation === 'drive' ? 'white' : '#42a5f5',
                      borderColor: '#42a5f5',
                      bgcolor: pageData.transportation === 'drive' ? '#42a5f5' : 'white',
                      '&:hover': {
                        bgcolor: pageData.transportation === 'drive' ? '#2196f3' : 'rgba(33, 150, 243, 0.04)',
                        borderColor: '#42a5f5',
                      },
                    }}
                  >
                    I will drive myself
                  </Button>
                }
                sx={{ m: 0 }}
              />
              <FormControlLabel
                value="dropped"
                control={
                  <Radio sx={{ display: 'none' }} />
                }
                label={
                  <Button
                    fullWidth
                    variant={pageData.transportation === 'dropped' ? "contained" : "outlined"}
                    onClick={() => setPageData({...pageData, transportation: 'dropped'})}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      mb: 1,
                      justifyContent: 'center',
                      color: pageData.transportation === 'dropped' ? 'white' : '#42a5f5',
                      borderColor: '#42a5f5',
                      bgcolor: pageData.transportation === 'dropped' ? '#42a5f5' : 'white',
                      '&:hover': {
                        bgcolor: pageData.transportation === 'dropped' ? '#2196f3' : 'rgba(33, 150, 243, 0.04)',
                        borderColor: '#42a5f5',
                      },
                    }}
                  >
                    I will be dropped off
                  </Button>
                }
                sx={{ m: 0 }}
              />
              <FormControlLabel
                value="public"
                control={
                  <Radio sx={{ display: 'none' }} />
                }
                label={
                  <Button
                    fullWidth
                    variant={pageData.transportation === 'public' ? "contained" : "outlined"}
                    onClick={() => setPageData({...pageData, transportation: 'public'})}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      justifyContent: 'center',
                      color: pageData.transportation === 'public' ? 'white' : '#42a5f5',
                      borderColor: '#42a5f5',
                      bgcolor: pageData.transportation === 'public' ? '#42a5f5' : 'white',
                      '&:hover': {
                        bgcolor: pageData.transportation === 'public' ? '#2196f3' : 'rgba(33, 150, 243, 0.04)',
                        borderColor: '#42a5f5',
                      },
                    }}
                  >
                    I will use public transportation
                  </Button>
                }
                sx={{ m: 0 }}
              />
            </RadioGroup>
          </FormControl>
        </Box>

        {/* Hours per week */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            How Many Hours Do You Want To Work Per Week?
          </Typography>
          <TextField
            fullWidth
            value={pageData.hoursPerWeek}
            onChange={handleChange('hoursPerWeek')}
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

        {/* Time available */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            What Time Of The Day Are You Available To Work?
          </Typography>
          <TextField
            fullWidth
            value={pageData.timeAvailable}
            onChange={handleChange('timeAvailable')}
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

        {/* Weekend availability */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7c93' }}>
            Are You Available To Work During The Weekends?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant={pageData.availableWeekends === true ? "contained" : "outlined"}
              onClick={() => handleWeekendChoice(true)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                color: pageData.availableWeekends === true ? 'white' : '#42a5f5',
                borderColor: '#42a5f5',
                '&:hover': {
                  borderColor: '#42a5f5',
                  bgcolor: pageData.availableWeekends === true ? '#2196f3' : 'rgba(33, 150, 243, 0.04)',
                },
              }}
            >
              Yes
            </Button>
            <Button
              fullWidth
              variant={pageData.availableWeekends === false ? "contained" : "outlined"}
              onClick={() => handleWeekendChoice(false)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                color: pageData.availableWeekends === false ? 'white' : '#42a5f5',
                borderColor: '#42a5f5',
                '&:hover': {
                  borderColor: '#42a5f5',
                  bgcolor: pageData.availableWeekends === false ? '#2196f3' : 'rgba(33, 150, 243, 0.04)',
                },
              }}
            >
              No
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Navigation buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 'auto', pt: 3 }}>
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

export default ProfileSetupPage2;