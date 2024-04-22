import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material'; 
import FavoriteCard from '../components/FavoriteCard';
import { fetchFavorites, updateFavoriteNote, deleteFavorite } from '../services/apiService/apiService_Favorites';
import { FavoriteDetailsData } from '../types/FavoriteTypes';
import FavoriteDetailsModal from '../components/FavoriteDetailModal';

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteDetailsData[]>([]);
  const [selectedFavorite, setSelectedFavorite] = useState<FavoriteDetailsData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const fetchedFavorites = await fetchFavorites();
        setFavorites(fetchedFavorites);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        // Handle the error appropriately here (e.g., show an error message)
      }
    };

    loadFavorites();
  }, []);

  const handleCardClick = (favorite: FavoriteDetailsData) => {
    setSelectedFavorite(favorite);
    setIsModalOpen(true);
    // Handle the card click here (e.g., navigate to the detail page)
    console.log('Favorite clicked:', favorite);
    
  };


  const handleUpdate = async (id: number, note: string) => {
    try {
      await updateFavoriteNote(id, note);
      // Update local state to reflect changes
      setFavorites(prevFavorites =>
        prevFavorites.map(fav => (fav.id === id ? { ...fav, note } : fav))
      );
      setIsModalOpen(false); // Optionally close modal after update
    } catch (error) {
      console.error('Error updating favorite note:', error);
      // Handle error appropriately here
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteFavorite(id);
      // Remove the deleted favorite from local state
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== id));
      setIsModalOpen(false); // Close modal after delete
    } catch (error) {
      console.error('Error deleting favorite:', error);
      // Handle error appropriately here
    }
  };

  return (
    <div>
      <h1>My Favorites</h1>
      {favorites.length > 0 ? ( // check if there are favorites
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {favorites.map(favorite => (
            <FavoriteCard key={favorite.id} favorite={favorite} onClick={() => handleCardClick(favorite)} />
          ))}
        </div>
      ) : (
        <Typography variant="subtitle1" align="center">No favorite tide data yet.</Typography> // 当没有收藏时显示消息
      )}
      {selectedFavorite && (
        <FavoriteDetailsModal
          favorite={selectedFavorite}
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default FavoritesPage;