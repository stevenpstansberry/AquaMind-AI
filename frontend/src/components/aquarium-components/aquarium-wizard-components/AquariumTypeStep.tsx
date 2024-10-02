import React, { useState } from 'react';
import { Button, Typography, Grid, Box } from '@mui/material';

interface AquariumTypeStepProps {
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
}

const AquariumTypeStep: React.FC<AquariumTypeStepProps> = ({ setAquariumData }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null); // Track selected type

  const handleTypeSelection = (type: string) => {
    setSelectedType(type); // Set the selected type
    setAquariumData((prevData: any) => ({ ...prevData, type })); // Update the aquarium data
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Aquarium Type
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {/* Freshwater Option */}
        <Grid item xs={12} sm={6}>
          <Button
            variant={selectedType === 'Freshwater' ? 'contained' : 'outlined'} // Highlight if selected
            color="primary"
            fullWidth
            onClick={() => handleTypeSelection('Freshwater')}
          >
            Freshwater
          </Button>
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
            Easier to maintain, lower cost. Ideal for beginners.
          </Typography>
        </Grid>

        {/* Saltwater Option */}
        <Grid item xs={12} sm={6}>
          <Button
            variant={selectedType === 'Saltwater' ? 'contained' : 'outlined'} // Highlight if selected
            color="secondary"
            fullWidth
            onClick={() => handleTypeSelection('Saltwater')}
          >
            Saltwater
          </Button>
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
            Requires more care, higher cost. Vibrant and colorful.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AquariumTypeStep;
