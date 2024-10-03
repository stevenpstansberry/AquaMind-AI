import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography } from '@mui/material';

interface SummaryStepProps {
  aquariumData: {
    id?: string;
    name: string;
    type: string;
    size: string;
    species: string[];
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
      <Typography variant="body1">
        <strong>Species:</strong> {aquariumData.species.join(', ')}
      </Typography>
      <Typography variant="body1">
        <strong>Equipment:</strong> {aquariumData.equipment.join(', ')}
      </Typography>
    </Box>
  );
};

export default SummaryStep;
