import React from 'react';
import { Card, CardContent, Typography, CardActionArea } from '@mui/material';
import { FavoriteData } from '../types/FavoriteTypes';

interface FavoriteCardProps {
  favorite: FavoriteData;
  onClick: () => void; 
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ favorite, onClick }) => {
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  };

  return (
    <Card sx={{ maxWidth: 345, margin: '20px' }}>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {formatDate(new Date(favorite.date))}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {favorite.country}, {favorite.district}, {favorite.fullAddress}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default FavoriteCard;