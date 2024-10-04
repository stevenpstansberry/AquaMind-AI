// components/aquarium-components/ParametersCard.tsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AquariumParameters from './AquariumParameters';  // Import the modal component

interface ParametersCardProps {
  parameters: { temperature: number; ph: number; ammonia: number };
  onUpdateParameters: (newParams: { temperature: number; ph: number; ammonia: number }) => void;
}

const ParametersCard: React.FC<ParametersCardProps> = ({ parameters, onUpdateParameters }) => {
  const [showParametersModal, setShowParametersModal] = useState(false);  // Modal visibility state

  // Handle the save of parameters
  const handleSave = (newParams: { temperature: number; ph: number; ammonia: number }) => {
    onUpdateParameters(newParams);  // Pass new parameters to parent
    setShowParametersModal(false);  // Close the modal after saving
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          position: 'relative',
          border: '1px solid #e0e0e0',
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
          borderRadius: '8px',
          backgroundColor: '#fafafa',
        }}
      >
        <CardContent>
          <Typography variant="h6">Aquarium Parameters</Typography>
          <Typography variant="body1">
            Temperature: {parameters.temperature}°F<br />
            pH Level: {parameters.ph}<br />
            Ammonia: {parameters.ammonia} ppm
          </Typography>
        </CardContent>

        {/* Edit Icon */}
        <IconButton
          color="primary"
          sx={{ position: 'absolute', top: '10px', right: '10px', color: '#B0BEC5' }}
          aria-label="edit parameters"
          onClick={() => setShowParametersModal(true)}  // Open the modal on click
        >
          <EditIcon />
        </IconButton>
      </Card>

      {/* Conditionally render the AquariumParameters modal */}
      {showParametersModal && (
        <AquariumParameters
          parameters={parameters}
          onUpdateParameters={handleSave}
          onClose={() => setShowParametersModal(false)}  // Close the modal without saving
        />
      )}
    </>
  );
};

export default ParametersCard;
