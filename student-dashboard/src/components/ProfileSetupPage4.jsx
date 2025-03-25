import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  TextField,
  Avatar,
  IconButton,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  FormHelperText
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  DeleteOutline,
  PhotoCamera
} from '@mui/icons-material';
import { useProfile } from '../services/ProfileContext';

const ProfileSetupPage4 = ({ onBack, onSubmit }) => {
  const { profileData, updateProfileData, saveProfile, loading, error } = useProfile();
  
  const [pageData, setPageData] = useState({
    bio: '',
    profilePicture: null,
    profilePicturePreview: '/student/images/profile-placeholder.jpg'
  });

  const [profilePictureDetails, setProfilePictureDetails] = useState({
    name: 'profilepicture.png',
    date: new Date().toLocaleDateString(),
    size: '0 KB'
  });

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [formErrors, setFormErrors] = useState({});

  // Update local state when profileData changes
  useEffect(() => {
    if (profileData) {
      setPageData({
        bio: profileData.bio || 'Passionate about creating unforgettable dining experiences, I bring artistry and precision to every dish I craft. With a love for fresh, high-quality ingredients and a deep understanding of flavor balance, I specialize in elevating traditional recipes with modern techniques. My kitchen is my canvas, where I blend innovation with culinary heritage to delight the senses. Whether it’s crafting delicate sushi rolls, vibrant salads, or perfectly grilled seafood, I believe that every plate tells a story. Follow my journey through flavors and textures as I bring the finest culinary experiences to your table.',
        profilePicture: null,
        profilePicturePreview: profileData.profile_picture_url || '/student/images/profile-placeholder.jpg'
      });
    }
  }, [profileData]);

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

  const handleFileUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Validate file type
      if (!file.type.match('image.*')) {
        setAlertMessage('Please select an image file (jpeg, png, etc.)');
        setAlertSeverity('error');
        setAlertOpen(true);
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setAlertMessage('Image is too large. Maximum size is 5MB.');
        setAlertSeverity('error');
        setAlertOpen(true);
        return;
      }
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Update file details
      setProfilePictureDetails({
        name: file.name,
        date: new Date().toLocaleDateString(),
        size: `${Math.round(file.size / 1024)} KB`
      });
      
      setPageData({
        ...pageData,
        profilePicture: file,
        profilePicturePreview: previewUrl
      });
    }
  };

  const handleDeletePicture = () => {
    setPageData({
      ...pageData,
      profilePicture: null,
      profilePicturePreview: '/student/images/profile-placeholder.jpg'
    });
    
    setProfilePictureDetails({
      name: 'profilepicture.png',
      date: new Date().toLocaleDateString(),
      size: '0 KB'
    });
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!pageData.bio.trim()) {
      errors.bio = 'Bio is required';
    } else if (pageData.bio.trim().length < 50) {
      errors.bio = 'Bio should be at least 50 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitProfile = async () => {
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
    // Update the global profile data with this page's data
    updateProfileData({
      bio: pageData.bio,
      profile_picture_url: pageData.profilePicturePreview !== '/student/images/profile-placeholder.jpg' ? pageData.profilePicturePreview : null,
    });
    
    try {
      // Save all profile data to the server
      const success = await saveProfile();
      if (success) {
        // Call the onSubmit prop to show success dialog
        onSubmit();
      } else {
        setAlertMessage('Please fix validation errors and try again.');
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    } catch (err) {
      setAlertMessage('Failed to save profile. Please try again.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
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
            value={100} 
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
        <Typography variant="body2" color="text.secondary">4/4</Typography>
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
            Well Done! Now upload a profile picture and fill in your bio.
          </Typography>
        </Box>
      </Box>

      {/* Form fields */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Profile Picture */}
        <Box>
          <Typography variant="body2" sx={{ mb: 1, color: '#6b7c93' }}>
            Profile Picture
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            mb: 2 
          }}>
            <Box 
              sx={{ 
                position: 'relative', 
                mb: 2,
                width: 120,
                height: 120
              }}
            >
              <Avatar
                src={pageData.profilePicturePreview}
                alt="Profile"
                sx={{ 
                  width: '100%', 
                  height: '100%'
                }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  right: -10,
                  bottom: -5,
                  bgcolor: '#e3f2fd',
                  color: '#42a5f5',
                  '&:hover': {
                    bgcolor: '#bbdefb'
                  },
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}
                component="label"
              >
                <PhotoCamera />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </IconButton>
            </Box>
          </Box>
          
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: '#fff',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
                {profilePictureDetails.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7c93' }}>
                {profilePictureDetails.date} · {profilePictureDetails.size}
              </Typography>
            </Box>
            
            <IconButton 
              size="small" 
              onClick={handleDeletePicture}
              sx={{ 
                color: '#f44336',
                bgcolor: '#ffebee',
                '&:hover': {
                  bgcolor: '#ffcdd2'
                }
              }}
            >
              <DeleteOutline />
            </IconButton>
          </Paper>
        </Box>

        {/* Bio */}
        <Box>
          <Typography variant="body2" sx={{ mb: 1, color: '#6b7c93' }}>
            Bio *
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={5}
            value={pageData.bio}
            onChange={handleChange('bio')}
            variant="outlined"
            placeholder="Tell us about yourself, your culinary background, and your interests..."
            error={!!formErrors.bio}
            helperText={formErrors.bio}
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
          onClick={handleSubmitProfile}
          disabled={loading}
          endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
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
          Submit
        </Button>
      </Box>

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

export default ProfileSetupPage4;