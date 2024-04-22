import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useLocation } from '../contexts/LocationContext';
import { TideResponse, ChartData } from '../types/TidesTypes';
import { FavoriteData } from '../types/FavoriteTypes';

import { apiService_Tide } from '../services/apiService/apiService_Tides';
import { saveToFavorites } from '../services/apiService/apiService_Favorites';
import { useDate } from '../contexts/DateContext'; // 引入useDate hook

import FavoriteIcon from '@mui/icons-material/Favorite';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TideChart = () => {
  
  const { latitude, longitude, fullAddress, district, state, country } = useLocation();
  const { currentDate } = useDate();
  const [tideData, setTideData] = useState<TideResponse | null>(null);
  const [nextLowTide, setNextLowTide] = useState('');

  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');

  let selectedDateTideData = null;

  if (tideData) {
    selectedDateTideData = tideData.extremes.filter(extreme => {
      const tideDate = new Date(extreme.date);
      return tideDate.toDateString() === currentDate.toDateString();
    });
  }
  //deal with modal open
  const handleOpen = () => {
    setOpen(true);
  };

  // deal with modal close
  const handleClose = () => {
    setOpen(false);
  };

  // deal with note change
  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setNote(event.target.value);
}

const handleSubmit = async () => {
  if (!tideData) {
    alert('Should have tide Data');
    handleClose();
    return;
  } //ensure tide data is available

  // build data to save
  const dataToSave: FavoriteData = {
    latitude:String(latitude), 
    longitude:String(longitude), 
    fullAddress:fullAddress, 
    district:district, 
    state:state, 
    country:country,
    date: currentDate.toISOString(), // save date as ISO string
    tideData: JSON.stringify(tideData),
    note: note,
  };

  try {
    // save to favorites
    await saveToFavorites(dataToSave);
    alert('Successfully saved to favorites!');
    handleClose(); // close modal
  } catch (error) {
    console.error('Error saving to favorites:', error);
    alert('Failed to save to favorites.');
  }
};



  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: 'Tide Height (meters)',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  });

  useEffect(() => {
    console.log('Fetching tide data for date:', currentDate);
    if (latitude && longitude && currentDate) {
      apiService_Tide(latitude, longitude)
        .then(data => {
          if (data.extremes.length > 0) {
            // Found tide data, setting it
            setTideData(data);
  
            // Filtering for selected date's tide data
            const filteredData = data.extremes.filter(extreme => {
              const date = new Date(extreme.date);
              return date.toDateString() === currentDate.toDateString();
            });
  
            // Preparing chart labels and data
            const labels = filteredData.map(extreme => new Date(extreme.date).toLocaleTimeString());
            const tideHeights = filteredData.map(extreme => extreme.height);
  
            // Updating chart data state
            setChartData({
              labels: labels,
              datasets: [{
                label: 'Tide Height (meters)',
                data: tideHeights,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
              }],
            });
  
            // Finding the next low tide event
            const now = new Date();
            const futureLowTides = data.extremes.filter(extreme => 
              extreme.type === 'Low' && new Date(extreme.date) > now);
  
            if (futureLowTides.length > 0) {
              const nextLowTide = futureLowTides.reduce((prev, curr) => 
                new Date(prev.date) < new Date(curr.date) ? prev : curr);
              setNextLowTide(new Date(nextLowTide.date).toLocaleString());
            } else {
              // No upcoming low tides found
              setNextLowTide('');
            }
          } else {
            // No tide data found for the current date
            setTideData(null);
            setChartData({
              labels: [],
              datasets: [{
                label: 'Tide Height (meters)',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
              }],
            });
            setNextLowTide('');
          }
        })
        .catch(error => {
          console.error("Error fetching tide data:", error);
          setTideData(null);
          setChartData({
            labels: [],
            datasets: [{
              label: 'Tide Height (meters)',
              data: [],
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }],
          });
          setNextLowTide('');
        });
    }
  }, [latitude, longitude, currentDate]);// add currentDate to the dependency array



  const options = {
    scales: {
      y: {
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
  };


  return (
    <div>
      <IconButton onClick={handleOpen} style={{ position: 'fixed', top: 10, right: 10 }}>
        <p>Save</p>
        <FavoriteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Collecting Tidal Data</DialogTitle>
        <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="note"
          label="notes"
          type="text"
          fullWidth
          variant="outlined"
          value={note}
          onChange={handleNoteChange}
          multiline  
          rows={4}    
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>cancel</Button>
          <Button onClick={handleSubmit}>submit</Button>
        </DialogActions>
      </Dialog>
    <Line data={chartData} options={options} />
    {(!tideData || tideData.extremes.length === 0) && <p>No tide data in this place</p>}
      <p><strong>The time of the next low tide is:</strong> {nextLowTide || 'N/A'}</p>
    
  </div>
  );
};

export default TideChart;