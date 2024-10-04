// components/aquarium-components/PlantCard.tsx
import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface PlantCardProps {
  plants: { name: string; count: number }[];
}

const PlantCard: React.FC<PlantCardProps> = ({ plants }) => {
  return (
    <Card sx={cardStyle}>
      <CardContent>
        <Typography variant="h6">Plants</Typography>
        <Typography variant="body1">
          {plants.length > 0
            ? plants.map(plant => `${plant.name} (x${plant.count})`).join(', ')
            : 'No plants added yet.'}
        </Typography>
      </CardContent>
      <IconButton color="primary" sx={editIconStyle} aria-label="edit plants">
        <EditIcon />
      </IconButton>
    </Card>
  );
};

const cardStyle = {
  height: '100%',
  position: 'relative',
  transition: 'transform 0.15s ease-in-out, boxShadow 0.15s ease-in-out',
  border: '1px solid #e0e0e0',
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
  borderRadius: '8px',
  backgroundColor: '#fafafa',
  '&:hover': {
    transform: 'scale(1.01)',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.12)',
  },
};

const editIconStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  color: '#B0BEC5',
  fontSize: '20px',
};

export default PlantCard;
