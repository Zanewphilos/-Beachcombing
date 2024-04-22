import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, Typography, Card, CardContent, IconButton, DialogTitle, Button, TextField, DialogActions } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import { FavoriteDetailsData } from '../types/FavoriteTypes';

// necessary for chartjs to work
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface FavoriteDetailsModalProps {
  favorite: FavoriteDetailsData | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: number, newNote: string) => void; 
  onDelete: (id: number) => void; 
}

const FavoriteDetailsModal: React.FC<FavoriteDetailsModalProps> = ({ favorite, open, onClose, onUpdate, onDelete }) => {
  
  const [editNote, setEditNote] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);


  useEffect(() => {
    if(favorite) {
      setEditNote(favorite.note);
    }
  }, [favorite]);
  
  if (!favorite) return null;
  const handleUpdateClick = () => {
    setIsEditOpen(true);
  };
  
  const handleEditOpen = () => {
    setIsEditOpen(true);
  };
  const handleEditClose = () => {
    setIsEditOpen(false);
  };


  const handleEditNote = async () => {
    await onUpdate(favorite.id, editNote);
    setIsEditOpen(false);
  };

  const handleDeleteClick = async () => {
    await onDelete(favorite.id);
  };


  const tideData = JSON.parse(favorite.tideData);
  const chartData = {
    labels: tideData.extremes.map((extreme: any) => new Date(extreme.date).toLocaleTimeString()),
    datasets: [{
      label: 'Tide Height (meters)',
      data: tideData.extremes.map((extreme: any) => extreme.height),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
    }],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
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
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="md">
      <DialogTitle>
        Favorite Details
        <IconButton onClick={onClose} style={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Card sx={{ marginBottom: '20px' }}>
        <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Location: {favorite.fullAddress}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Coordinates: {favorite.latitude}, {favorite.longitude}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Date: {new Date(favorite.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Notes: {favorite.note}
            </Typography>
            <Button variant="contained" color="primary" startIcon={<UpdateIcon />} onClick={handleEditOpen}>
              Update
            </Button>
            <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={handleDeleteClick}>
              Delete
            </Button>
          </CardContent>
        </Card>
        <div style={{ height: '300px' }}>
          <Line data={chartData} options={options} />
        </div>
      </DialogContent>

      <Dialog open={isEditOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Edit Note"
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditNote} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default FavoriteDetailsModal;