// src/components/CuisinePortfolio.jsx
import React, { useState, useEffect } from 'react';
import { Box, Grid, Fab, Typography, CircularProgress, Alert, Snackbar } from '@mui/material';
import { Add } from '@mui/icons-material';
import AddDishModal from './AddDishModal';
import ViewDishModal from './ViewDishModal';
import { portfolioService } from '../services/api';

// Placeholder image path - using one of the local dish images
const PLACEHOLDER_IMAGE = '/images/dishes/salad1.jpg';

const CuisinePortfolio = () => {
  const [dishes, setDishes] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  // Fetch dishes when component mounts
  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    setFetchingData(true);
    try {
      const portfolioData = await portfolioService.getPortfolio();
      
      // Map backend portfolio items to the format expected by the UI
      const formattedDishes = portfolioData.map(item => ({
        id: item.id,
        image: item.image_url,
        name: item.title,
        description: item.description || 'No description available.',
        created_at: item.created_at
      }));
      
      setDishes(formattedDishes);
    } catch (err) {
      console.error('Error fetching dishes:', err);
      showAlert('Failed to load dishes. Please try again later.', 'error');
    } finally {
      setFetchingData(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenViewModal = (dish) => {
    setSelectedDish(dish);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedDish(null);
  };

  const handleAddDish = async (newDish) => {
    try {
      setLoading(true);
      
      // Use direct upload through the backend
      const formData = new FormData();
      formData.append('image', newDish.image);
      
      // Get the token
      const token = localStorage.getItem('token');
      
      // Upload directly to the backend
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/portfolio/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      const { fileURL } = data;
      
      // Save the dish in the database
      const portfolioItem = {
        title: newDish.name,
        description: newDish.description,
        image_url: fileURL
      };
      
      const savedItem = await portfolioService.addPortfolioItem(portfolioItem);
      
      // Add the new dish to the state
      const formattedDish = {
        id: savedItem.id,
        image: savedItem.image_url,
        name: savedItem.title,
        description: savedItem.description,
        created_at: savedItem.created_at
      };
      
      setDishes(prevDishes => [...prevDishes, formattedDish]);
      showAlert('Dish added successfully!', 'success');
      
      // Refresh the portfolio data to ensure everything is up to date
      loadDishes();
    } catch (err) {
      console.error('Error adding dish:', err);
      showAlert('Failed to add dish. Please try again.', 'error');
    } finally {
      setLoading(false);
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteDish = async (id) => {
    try {
      setLoading(true);
      await portfolioService.deletePortfolioItem(id);
      setDishes(prevDishes => prevDishes.filter(dish => dish.id !== id));
      showAlert('Dish deleted successfully!', 'success');
      
      // Refresh the data
      loadDishes();
    } catch (err) {
      console.error('Error deleting dish:', err);
      showAlert('Failed to delete dish. Please try again.', 'error');
    } finally {
      setLoading(false);
      setIsViewModalOpen(false);
    }
  };

  const showAlert = (message, severity = 'success') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleImageError = (e) => {
    console.warn(`Failed to load image: ${e.target.src}`);
    e.target.src = PLACEHOLDER_IMAGE;
    e.target.onerror = null; // Prevent infinite loop if placeholder also fails
  };

  const isLoadingState = loading || fetchingData;

  return (
    <Box sx={{ py: 1, position: 'relative', height: '100%' }}>
      {isLoadingState && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoadingState && dishes.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            You haven't added any dishes yet. Click the + button to start building your portfolio.
          </Typography>
        </Box>
      )}

      {!isLoadingState && dishes.length > 0 && (
        <Grid container spacing={1}>
          {dishes.map((dish) => (
            <Grid item xs={4} key={dish.id} sx={{ aspectRatio: '1/1' }}>
              <Box
                onClick={() => handleOpenViewModal(dish)}
                sx={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    opacity: 0.9,
                  },
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
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Add Button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleOpenAddModal}
        disabled={isLoadingState}
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          bgcolor: '#42a5f5',
          '&:hover': {
            bgcolor: '#2196f3',
          },
        }}
      >
        <Add />
      </Fab>

      {/* Add Dish Modal */}
      <AddDishModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAdd={handleAddDish}
      />

      {/* View Dish Modal */}
      {selectedDish && (
        <ViewDishModal
          open={isViewModalOpen}
          onClose={handleCloseViewModal}
          dish={selectedDish}
          onDelete={() => handleDeleteDish(selectedDish.id)}
          onImageError={handleImageError}
        />
      )}

      {/* Alert Snackbar */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
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

export default CuisinePortfolio;