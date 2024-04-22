import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { fetchLocationDetails } from '../services/apiService/apiService_AzureMap';


// 定义Location状态的类型
interface LocationState {
  latitude: number | null;
  longitude: number | null;
  fullAddress: string;
  district: string;
  state: string;
  country: string;
}

interface LocationContextType extends LocationState {
  updateLocation: (latitude: number, longitude: number) => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);


export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};


export const LocationProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    fullAddress: '',
    district: '',
    state: '',
    country: '',
  });

  const updateLocation = useCallback(async (latitude: number, longitude: number) => {
    // only update latitude and longitude
    setLocation(current => ({ ...current, latitude, longitude }));

    try {
      const locationDetails = await fetchLocationDetails(latitude, longitude);
      //success, update location details
      setLocation(current => ({ ...current, ...locationDetails }));
    } catch (error) {
      console.error("Failed to update location details", error);
    }
  }, []);


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        updateLocation(latitude, longitude);
     
      });
    }
  }, []);

  const value = { ...location, updateLocation }
  
  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

