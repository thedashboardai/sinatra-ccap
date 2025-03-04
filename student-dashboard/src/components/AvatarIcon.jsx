import React from 'react';
import { Box } from '@mui/material';

// A simple avatar component that displays a character
// In a real app, you would use an actual image
const AvatarIcon = () => {
  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mb: 2,
      }}
    >
      <svg width="80" height="90" viewBox="0 0 80 90">
        <g transform="translate(0, 5)">
          {/* Simple cartoon character */}
          <circle cx="40" cy="30" r="20" fill="#FFD7B5" /> {/* Face */}
          <circle cx="33" cy="26" r="2" fill="#333" /> {/* Left eye */}
          <circle cx="47" cy="26" r="2" fill="#333" /> {/* Right eye */}
          <path d="M36 35 Q40 38 44 35" stroke="#333" strokeWidth="1.5" fill="none" /> {/* Smile */}
          {/* Hair */}
          <path d="M25 20 Q40 5 55 20" stroke="#8B4513" strokeWidth="8" fill="none" />
          {/* Body */}
          <rect x="32" y="50" width="16" height="25" fill="#3498db" />
          {/* Arms */}
          <rect x="20" y="50" width="12" height="5" fill="#3498db" />
          <rect x="48" y="50" width="15" height="5" fill="#3498db" />
          {/* Hand wave */}
          <rect x="63" y="45" width="5" height="10" fill="#FFD7B5" transform="rotate(-15, 63, 45)" />
        </g>
      </svg>
    </Box>
  );
};

export default AvatarIcon;