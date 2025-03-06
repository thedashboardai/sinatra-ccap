import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Tab,
  Tabs,
  Paper,
  Button,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit,
  Share,
  LocationOn,
  Business,
  MoreVert,
  ExitToApp
} from '@mui/icons-material';
import CuisinePortfolio from './CuisinePortfolio';
import { useProfile } from '../services/ProfileContext';

const ProfileView = ({ onLogout }) => {
  const { profileData, fetchProfile, loading, error, isProfileFetched } = useProfile();
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);

  // Fetch profile data if not already fetched
  useEffect(() => {
    if (!isProfileFetched) {
      fetchProfile();
    }
  }, [fetchProfile, isProfileFetched]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear localStorage token
    localStorage.removeItem('sinatraToken');
    localStorage.removeItem('user');
    
    // Call the onLogout prop to navigate back to login
    if (onLogout) {
      onLogout();
    }
    
    handleMenuClose();
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
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: '#f5f5f5',
      }}
    >
      {/* Header with background image and profile picture */}
      <Box
        sx={{
          position: 'relative',
          height: 180,
          width: '100%',
          overflow: 'visible', // Changed from 'hidden' to 'visible' to allow the avatar to extend outside
        }}
      >
        {/* Background image */}
        <Box
          component="img"
          src="/student/images/chef-kitchen-bg.jpg"
          alt="Kitchen Background"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.9)',
          }}
        />

        {/* Profile picture - positioned to be fully visible */}
        <Box
          sx={{
            position: 'absolute',
            left: 16,
            bottom: -24,
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: 'white',
            padding: '3px', // Creates a white border effect
            zIndex: 1,
          }}
        >
          <Avatar
            src={profileData?.profile_picture_url || "/student/images/profile-placeholder.jpg"}
            alt="Profile"
            sx={{
              width: '100%',
              height: '100%',
            }}
          />
        </Box>

        {/* Action buttons */}
        <Box
          sx={{
            position: 'absolute',
            right: 10,
            bottom: 10,
            display: 'flex',
            gap: 1,
          }}
        >
          <IconButton
            aria-label="edit profile"
            sx={{
              bgcolor: 'rgba(255,255,255,0.7)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            <Edit sx={{ color: '#42a5f5' }} />
          </IconButton>
          <IconButton
            aria-label="share profile"
            sx={{
              bgcolor: 'rgba(255,255,255,0.7)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            <Share sx={{ color: '#42a5f5' }} />
          </IconButton>
          <IconButton
            aria-label="more options"
            onClick={handleMenuOpen}
            sx={{
              bgcolor: 'rgba(255,255,255,0.7)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            <MoreVert sx={{ color: '#42a5f5' }} />
          </IconButton>
          
          {/* More options menu */}
          <Menu
            anchorEl={menuAnchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 2,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                mt: 1.5,
                borderRadius: 2,
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1,
                },
              },
            }}
          >
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1, color: '#42a5f5' }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Profile info */}
      <Box
        sx={{
          pt: 5,
          px: 2,
          pb: 2,
          bgcolor: 'white',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            mb: 0.5,
          }}
        >
          {profileData ? `${profileData.first_name} ${profileData.last_name}` : 'Loading...'}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#78909c',
            mb: 2,
          }}
        >
          {profileData && profileData.current_position ? 
            `${profileData.current_position} at ${profileData.current_employer}` : 
            'Profile details loading...'}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#78909c' }}>
            <Business sx={{ fontSize: 20, mr: 1, color: '#78909c' }} />
            <Typography variant="body2" sx={{ color: '#78909c' }}>
              {profileData?.current_employer || 'Not specified'} 
              {profileData?.culinary_class_years && (
                <>
                  <Typography component="span" sx={{ mx: 0.5, color: '#bdbdbd' }}>•</Typography>
                  {profileData.culinary_class_years}+ years
                </>
              )}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', color: '#78909c' }}>
            <LocationOn sx={{ fontSize: 20, mr: 1, color: '#78909c' }} />
            <Typography variant="body2" sx={{ color: '#78909c' }}>
              {profileData?.city && profileData?.state ? 
                `${profileData.city}, ${profileData.state}` : 
                'Location not specified'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper
        elevation={0}
        sx={{
          mt: 1,
          borderRadius: 0,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              color: '#9e9e9e',
              '&.Mui-selected': {
                color: '#42a5f5',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#42a5f5',
              height: 3,
            },
          }}
        >
          <Tab label="About" />
          <Tab label="Cuisine Portfolio" />
        </Tabs>
      </Paper>

      {/* Tab content */}
      <Box
        sx={{
          flex: 1,
          bgcolor: '#f5f5f5',
          overflow: 'auto',
        }}
      >
        {tabValue === 0 && (
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  color: '#455a64',
                }}
              >
                About
              </Typography>
              <IconButton size="small">
                <Edit sx={{ fontSize: 18, color: '#42a5f5' }} />
              </IconButton>
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'white',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#78909c',
                  lineHeight: 1.6,
                }}
              >
                {profileData?.bio || 'No bio information available.'}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#42a5f5',
                  mt: 1,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                See More
              </Typography>
            </Paper>

            {/* Additional Profile Information */}
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  color: '#455a64',
                  mb: 1,
                }}
              >
                Work Details
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'white',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#78909c', fontWeight: 500 }}>
                    Current Job
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#455a64' }}>
                    {profileData?.current_job ? 'Yes' : 'No'}
                  </Typography>
                </Box>
                
                {profileData?.current_job && (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#78909c', fontWeight: 500 }}>
                        Current Position
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#455a64' }}>
                        {profileData?.current_position || 'Not specified'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#78909c', fontWeight: 500 }}>
                        Hours Per Week
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#455a64' }}>
                        {profileData?.current_work_hours || 'Not specified'}
                      </Typography>
                    </Box>
                  </>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#78909c', fontWeight: 500 }}>
                    Preferred Hours
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#455a64' }}>
                    {profileData?.hours_per_week || 'Not specified'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#78909c', fontWeight: 500 }}>
                    Weekend Availability
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#455a64' }}>
                    {profileData?.available_weekends ? 'Available' : 'Not Available'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#78909c', fontWeight: 500 }}>
                    Ready to Work
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#455a64' }}>
                    {profileData?.ready_to_work ? 'Yes' : 'No'}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        )}

        {tabValue === 1 && <CuisinePortfolio />}
      </Box>
    </Box>
  );
};

export default ProfileView;