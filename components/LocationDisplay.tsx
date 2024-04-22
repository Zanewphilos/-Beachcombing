import React from 'react';
import { useLocation } from '../contexts/LocationContext';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const LocationDisplay: React.FC = () => {
  const { district, state, country } = useLocation();
 //from useLocation hook
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
     
      <LocationOnIcon sx={{ mr: 1 }} />
      <Typography variant="body1">
        {district ? `${district}, ${state}` : 'Locating...'}
      </Typography>
    </Box>
  );
};

export default LocationDisplay;