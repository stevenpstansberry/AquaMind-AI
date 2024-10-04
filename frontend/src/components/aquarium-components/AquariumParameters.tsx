import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, Box, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AquariumParametersProps {
  parameters: { temperature: number; ph: number; ammonia: number }; // Initial parameters
  onUpdateParameters: (newParams: { temperature: number; ph: number; ammonia: number }) => void;
  onClose: () => void; // Close the overlay card
}

const AquariumParameters: React.FC<AquariumParametersProps> = ({ parameters, onUpdateParameters, onClose }) => {
  const [tempParams, setTempParams] = useState(parameters); // Track temp params before saving
  const modalRef = useRef<HTMLDivElement>(null); // Ref for the modal content

  // Function to handle clicks outside the modal content
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();  // Close the modal when clicking outside
    }
  };

  // Add event listener for detecting clicks outside
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Cleanup the event listener when component unmounts
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSave = () => {
    onUpdateParameters(tempParams); // Save the parameters
    onClose(); // Close the overlay card
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1300, // Ensure it overlays the entire page
      }}
    >
      <Card
        ref={modalRef}  // Attach the ref to the modal content
        sx={{
          width: '500px',
          padding: '20px',
          position: 'relative',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent>
          <Typography variant="h6">Edit Aquarium Parameters</Typography>
          <TextField
            label="Temperature (°F)"
            fullWidth
            margin="normal"
            type="number"
            value={tempParams.temperature}
            onChange={(e) => setTempParams({ ...tempParams, temperature: Number(e.target.value) })}
          />
          <TextField
            label="pH Level"
            fullWidth
            margin="normal"
            type="number"
            value={tempParams.ph}
            onChange={(e) => setTempParams({ ...tempParams, ph: Number(e.target.value) })}
          />
          <TextField
            label="Ammonia (ppm)"
            fullWidth
            margin="normal"
            type="number"
            value={tempParams.ammonia}
            onChange={(e) => setTempParams({ ...tempParams, ammonia: Number(e.target.value) })}
          />
        </CardContent>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button onClick={onClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </Box>
        {/* Close Icon */}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: '10px', right: '10px' }}
        >
          <CloseIcon />
        </IconButton>
      </Card>
    </Box>
  );
};

export default AquariumParameters;
