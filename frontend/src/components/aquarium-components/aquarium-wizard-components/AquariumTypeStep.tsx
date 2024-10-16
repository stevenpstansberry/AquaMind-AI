/**
 * @file AquariumTypeStep.tsx
 * @location src/components/aquarium-components/aquarium-wizard-components/AquariumTypeStep.tsx
 * @description This component renders the Aquarium Type selection step in the aquarium setup wizard. It allows the user to select between 'Freshwater' and 'Saltwater' types and updates the state accordingly.
 * 
 * @author Steven Stansberry
 */

import React, { useState } from 'react';
import { Button, Typography, Grid, Box } from '@mui/material';

interface AquariumTypeStepProps {
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  setIsStepValid: React.Dispatch<React.SetStateAction<boolean>>;
  aquariumData: { name: string; id: string; type: string; size: string; species: { name: string; count: number }[]; equipment: string[] };
}

const AquariumTypeStep: React.FC<AquariumTypeStepProps> = ({ setAquariumData, setIsStepValid, aquariumData }) => {
  const [selectedType, setSelectedType] = useState<string | null>(aquariumData.type || null); // Initialize from aquariumData

  /**
   * Handles the selection of an aquarium type (Freshwater or Saltwater). Updates the local state and the parent state.
   * 
   * @param {string} type - The type of aquarium selected by the user ('Freshwater' or 'Saltwater').
   * @returns {void}
   */
  const handleTypeSelection = (type: string): void => {
    setSelectedType(type); // Set the selected type
    setAquariumData((prevData: any) => ({ ...prevData, type })); // Update the aquarium data
    setIsStepValid(true); // Mark the step as valid once a type is selected
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
