import { FavoriteData, FavoriteDetailsData } from '../../types/FavoriteTypes';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;


export const saveToFavorites = async (data: FavoriteData): Promise<void> => {
  const url = `${baseUrl}/FavoritePlaces`;

  const serializedTideData = JSON.stringify(data.tideData);


  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, 
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to save to favorites');
  }

  
  const responseData = await response.json();
  console.log('Successfully saved to favorites:', responseData);
};


export const fetchFavorites = async (): Promise<FavoriteDetailsData[]> => {
  const url = `${baseUrl}/FavoritePlaces`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, 
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch favorites');
  }

  const favorites: FavoriteDetailsData[] = await response.json();
  return favorites;
};


export const updateFavoriteNote = async (id: number, note: string): Promise<void> => {
  const url = `${baseUrl}/FavoritePlaces/${id}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // If your API requires authentication
    },
    body: JSON.stringify({ note: note }),
  });

  if (!response.ok) {
    throw new Error('Failed to update favorite note');
  }

  console.log('Successfully updated favorite note');
};


export const deleteFavorite = async (id: number): Promise<void> => {
  const url = `${baseUrl}/FavoritePlaces/${id}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // If your API requires authentication
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete favorite');
  }

  console.log('Successfully deleted favorite');
};