import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface AquariumWizardProps {
    onClose: () => void; 
  }

const AquariumWizard: React.FC<AquariumWizardProps> = ({ onClose }) => {
    return (
    <Box 
      sx={{ 
        position: 'fixed', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: '400px', 
        backgroundColor: 'white', 
        padding: '20px', 
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' 
      }}
    >
      <Typography variant="h5">Aquarium Setup Wizard</Typography>
      {/* Wizard content goes here */}

      {/* Close button */}
      <Button 
        onClick={onClose} 
        variant="contained" 
        color="secondary" 
        sx={{ marginTop: '20px' }}
      >
        Close Wizard
      </Button>
    </Box>
  );
};

export default AquariumWizard;
