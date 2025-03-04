// src/components/ViewDishModal.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  Button,
  CircularProgress,
  DialogActions,
  DialogTitle,
} from '@mui/material';
import { Close, MoreVert, Delete } from '@mui/icons-material';

// Use local image for fallback
const PLACEHOLDER_IMAGE = '/images/dishes/sushi1.jpg';

const ViewDishModal = ({ open, onClose, dish, onDelete }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const menuOpen = Boolean(menuAnchorEl);

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleOpenDeleteDialog = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(dish.id);
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
      onClose();
    }
  };

  // Get user name from localStorage
  const getUserName = () => {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User';
    }
    return 'User';
  };

  // Format the date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handle image error
  const handleImageError = (e) => {
    console.warn(`Failed to load image: ${e.target.src}`);
    e.target.src = PLACEHOLDER_IMAGE;
    e.target.onerror = null; // Prevent infinite loop
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            maxWidth: 500,
            m: { xs: 2, sm: 3 },
            p: 0,
            overflow: 'hidden'
          },
        }}
      >
        {/* Header with close button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #eee'
        }}>
          <Typography variant="h6" fontWeight="medium">
            Dish Photo
          </Typography>
          <IconButton onClick={onClose} edge="end" size="small">
            <Close />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 0 }}>
          {/* User info with timestamp */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center', 
            p: 2 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src="/images/profile-placeholder.jpg"
                alt={getUserName()}
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Typography variant="body1" fontWeight="medium">
                {getUserName()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                {formatDate(dish.created_at)}
              </Typography>
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVert fontSize="small" />
              </IconButton>
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
                <MenuItem onClick={handleOpenDeleteDialog} sx={{ color: '#f44336' }}>
                  <Delete fontSize="small" sx={{ mr: 1 }} />
                  Delete
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Dish image */}
          <Box
            sx={{
              width: '100%',
              height: 300,
              position: 'relative',
              bgcolor: '#f0f0f0',
            }}
          >
            <Box
              component="img"
              src={dish.image}
              alt={dish.name}
              onError={handleImageError}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>

          {/* Dish name */}
          <Box sx={{ px: 2, pt: 2 }}>
            <Chip
              label={dish.name}
              sx={{
                bgcolor: '#e3f2fd',
                color: '#42a5f5',
                fontWeight: 500,
                borderRadius: 1,
                height: 32,
                mb: 2
              }}
            />
          </Box>

          {/* Dish description */}
          <Box sx={{ px: 2, pb: 3 }}>
            <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
              {dish.description}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1
          }
        }}
      >
        <DialogTitle>
          Delete Dish
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the "{dish.name}" dish? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDeleteDialog} 
            color="primary"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Delete />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewDishModal;