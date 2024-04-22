import React, { useState } from 'react';
import LocationDisplay from '../components/LocationDisplay';
import TideChart from '../components/TideChart';
import MyDatePicker from '../components/DatePicker'; 
import { DateProvider } from '../contexts/DateContext';
import WeatherComponent from '../components/WeatherComponent';
import Box from '@mui/material/Box';

const HomePage: React.FC = () => {
  
  const [currentDate, setCurrentDate] = useState(new Date());

  const providerValue = { currentDate, setCurrentDate };
    return (
      <div>
      <h1>Home Page</h1>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <LocationDisplay/>
        <DateProvider value={providerValue}>
          <MyDatePicker onDateChange={(newDate) => setCurrentDate(newDate)} />
        </DateProvider>
      </Box>
      <DateProvider value={providerValue}>
        <TideChart />
        <WeatherComponent />
      </DateProvider>
    </div>
    );
};

export default HomePage;