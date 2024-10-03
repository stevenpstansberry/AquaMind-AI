import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography } from '@mui/material';

interface SummaryStepProps {
  aquariumData: { 
    name: string; 
    id: string; 
    type: string; 
    size: string;  
    species: { name: string; count: number }[]; 
    plants: { name: string; count: number }[]; 
    equipment: string[]; 
  };
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ aquariumData, setAquariumData }) => {
  const [aquariumName, setAquariumName] = useState(aquariumData.name);

  // Update aquarium name in parent state whenever it changes
  useEffect(() => {
    setAquariumData((prevData: any) => ({ ...prevData, name: aquariumName }));
  }, [aquariumName, setAquariumData]);

  return (
    <Box>
      <Typography variant="h5">Summary</Typography>

      {/* Input for Aquarium Name */}
      <TextField
        label="Aquarium Name"
        variant="outlined"
        fullWidth
        value={aquariumName}
        onChange={(e) => setAquariumName(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Typography variant="body1">
        <strong>Type:</strong> {aquariumData.type}
      </Typography>
      <Typography variant="body1">
        <strong>Size:</strong> {aquariumData.size} gallons
      </Typography>
      
      {/* Display the species with their count */}
      <Typography variant="body1">
        <strong>Species:</strong>{' '}
        {aquariumData.species.length > 0 ? (
          aquariumData.species.map((s) => `${s.name} (x${s.count})`).join(', ')
        ) : (
          'None selected'
        )}
      </Typography>

      {/* Display the plants with their count */}
      <Typography variant="body1">
        <strong>Plants:</strong>{' '}
        {aquariumData.plants && aquariumData.plants.length > 0 ? (
          aquariumData.plants.map((p) => `${p.name} (x${p.count})`).join(', ')
        ) : (
          'None selected'
        )}
      </Typography>

      {/* Display the equipment */}
      <Typography variant="body1">
        <strong>Equipment:</strong>{' '}
        {aquariumData.equipment.length > 0 ? aquariumData.equipment.join(', ') : 'None selected'}
      </Typography>
    </Box>
  );
};

export default SummaryStep;
