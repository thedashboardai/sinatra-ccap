// src/components/AddDishModal.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  Avatar,
  InputAdornment,
  MenuItem,
  FormControl,
  CircularProgress,
  Alert
} from '@mui/material';
import { Close, KeyboardArrowDown, AddAPhoto } from '@mui/icons-material';

// The 32 dishes we want to make available for selection
const DISH_OPTIONS = [
  'Sushi Platter', 'Quinoa Salad', 'Grilled Salmon', 'Vegetable Bowl',
  'Maki Selection', 'Green Bowl', 'Spicy Tuna Roll', 'Fresh Salad',
  'Salmon Rolls', 'Pistachio Cake', 'Chocolate Mousse', 'Fruit Tart',
  'Ramen Bowl', 'Poke Bowl', 'Pad Thai', 'Chicken Curry',
  'Beef Stir Fry', 'Vegetable Stir Fry', 'Shrimp Scampi', 'Pasta Primavera',
  'Margherita Pizza', 'Caesar Salad', 'Greek Salad', 'Caprese Salad',
  'Avocado Toast', 'Eggs Benedict', 'Pancakes', 'French Toast',
  'Chicken Sandwich', 'Club Sandwich', 'Tuna Melt', 'BLT Sandwich'
];

const AddDishModal = ({ open, onClose, onAdd }) => {
  const [dishData, setDishData] = useState({
    name: '',
    description: 'A delicious dish made with fresh ingredients and expert preparation.',
    image: null,
    imagePreview: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field) => (event) => {
    setDishData({
      ...dishData,
      [field]: event.target.value,
    });
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Please upload a JPEG or PNG image.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File is too large. Maximum size is 5MB.');
        return;
      }
      
      const imageUrl = URL.createObjectURL(file);
      
      setDishData({
        ...dishData,
        image: file,
        imagePreview: imageUrl,
      });
      
      setError(null);
    }
  };

  const handleSubmit = () => {
    if (!dishData.name) {
      setError('Please select a dish name.');
      return;
    }
    
    setLoading(true);
    
    // For now, let's just pass the data directly to the parent component
    // This simplification helps avoid S3 permission issues during development
    onAdd({
      name: dishData.name,
      description: dishData.description,
      // Pass the image file, but we'll use a local placeholder in the parent component
      image: dishData.image
    });
  };

  const handleClose = () => {
    // Reset form state when closing the modal
    setDishData({
      name: '',
      description: 'A delicious dish made with fresh ingredients and expert preparation.',
      image: null,
      imagePreview: null,
    });
    setError(null);
    setLoading(false);
    onClose();
  };

  // Get user name from localStorage
  const getUserName = () => {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      return `${user.first_name || ''}`.trim() || 'User';
    }
    return 'User';
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          maxWidth: 500,
          m: { xs: 2, sm: 3 },
        },
      }}
    >
      <DialogTitle sx={{ p: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            Add Dish Photo
          </Typography>
          <IconButton onClick={handleClose} edge="end">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 2, pb: 3 }}>
        {/* User Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src="/images/profile-placeholder.jpg"
            alt={getUserName()}
            sx={{ width: 32, height: 32, mr: 1.5 }}
          />
          <Typography variant="body1" fontWeight="medium">
            {getUserName()}
          </Typography>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Add a photo of one of your best dishes to showcase your culinary skills.
        </Typography>

        {/* Image Upload - This is just for UI display, we're not actually uploading */}
        <Box
          sx={{
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative',
            mb: 3,
            bgcolor: dishData.imagePreview ? 'transparent' : '#f5f5f5',
            height: 200,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: dishData.imagePreview ? 'none' : '1px dashed #ccc',
          }}
        >
          {dishData.imagePreview ? (
            <>
              <Box
                component="img"
                src={dishData.imagePreview}
                alt="Dish"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)',
                  },
                }}
                onClick={() => {
                  setDishData({
                    ...dishData,
                    image: null,
                    imagePreview: null,
                  });
                }}
                disabled={loading}
              >
                <Close fontSize="small" />
              </IconButton>
            </>
          ) : (
            <Button
              component="label"
              startIcon={<AddAPhoto />}
              sx={{ color: '#78909c' }}
              disabled={loading}
            >
              Add Photos
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
              />
            </Button>
          )}
        </Box>

        {/* Dish Name Dropdown */}
        <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
          <TextField
            select
            label="Dish Name"
            value={dishData.name}
            onChange={handleChange('name')}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <KeyboardArrowDown />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          >
            {DISH_OPTIONS.map((dish) => (
              <MenuItem key={dish} value={dish}>
                {dish}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>

        {/* Description Field */}
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={3}
          value={dishData.description}
          onChange={handleChange('description')}
          disabled={loading}
          variant="outlined"
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />

        {/* Add Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !dishData.name}
          sx={{
            bgcolor: '#42a5f5',
            color: 'white',
            py: 1,
            textTransform: 'none',
            borderRadius: 1.5,
            '&:hover': {
              bgcolor: '#2196f3',
            },
            '&.Mui-disabled': {
              bgcolor: '#e0e0e0',
              color: '#9e9e9e',
            },
          }}
        >
          {loading ? <CircularProgress size={24} /> : 'Add Dish'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddDishModal;