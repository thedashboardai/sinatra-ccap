import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Box,
} from '@mui/material';

const ProfileSuccessDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          p: 0,
          m: { xs: 2, sm: 4 },
          width: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 64px)' }
        }
      }}
    >
      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            p: 4,
            pt: 5
          }}
        >
          {/* Avatar with thumbs up - replace with your image */}
          <Box
            component="img"
            src="/images/thumbs-up-avatar.png" // You'll need to add this image
            alt="Success"
            sx={{
              width: 150,
              height: 150,
              mb: 3,
              objectFit: 'contain'
            }}
          />

          <Typography
            variant="h5"
            sx={{
              fontSize: '1.75rem',
              fontWeight: 600,
              color: '#42a5f5',
              mb: 2
            }}
          >
            Your profile has been successfully created.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#555',
              mb: 4,
              maxWidth: '80%',
              mx: 'auto'
            }}
          >
            Get ready to explore all of the great features we have to offer you here at Sinatra.
          </Typography>

          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              bgcolor: '#42a5f5',
              color: 'white',
              borderRadius: 28,
              py: 1.5,
              px: 6,
              textTransform: 'none',
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: '#2196f3',
              },
              boxShadow: 'none',
              width: '100%',
              maxWidth: 350
            }}
          >
            Let's Go!
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSuccessDialog;