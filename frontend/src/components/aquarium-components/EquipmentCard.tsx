// components/aquarium-components/EquipmentCard.tsx
import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface EquipmentCardProps {
  equipment: string[];
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment }) => {
  return (
    <Card sx={cardStyle}>
      <CardContent>
        <Typography variant="h6">Equipment</Typography>
        <Typography variant="body1">
          {equipment.length > 0 ? equipment.join(', ') : 'No equipment added yet.'}
        </Typography>
      </CardContent>
      <IconButton color="primary" sx={editIconStyle} aria-label="edit equipment">
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

export default EquipmentCard;
