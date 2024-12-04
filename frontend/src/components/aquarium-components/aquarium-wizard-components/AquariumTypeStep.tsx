/**
 * @file AquariumTypeStep.tsx
 * @location src/components/aquarium-components/aquarium-wizard-components/AquariumTypeStep.tsx
 * @description This component renders the Aquarium Type selection step in the aquarium setup wizard. It allows the user to select the 'Freshwater' type and shows 'Saltwater' as coming soon.
 * 
 * @author ...
 */

import React, { useState } from 'react';
import { Button, Typography, Grid, Box, Tooltip } from '@mui/material';
import { Aquarium } from '../../../interfaces/Aquarium';
import { useTheme } from '@mui/material/styles';
import { useThemeContext } from '../../../util/ThemeContext';

interface AquariumTypeStepProps {
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  setIsStepValid: React.Dispatch<React.SetStateAction<boolean>>;
  aquariumData: Aquarium;
}

const AquariumTypeStep: React.FC<AquariumTypeStepProps> = ({ setAquariumData, setIsStepValid, aquariumData }) => {
  const [selectedType, setSelectedType] = useState<string | null>(aquariumData.type || null); // Initialize from aquariumData

  const theme = useTheme();
  const { toggleTheme, isDarkMode } = useThemeContext();
  /**
   * Handles the selection of an aquarium type. Updates the local state and the parent state.
   * 
   * @param {string} type - The type of aquarium selected by the user ('Freshwater').
   * @returns {void}
   */
  const handleTypeSelection = (type: string): void => {
    setSelectedType(type); // Set the selected type
    setAquariumData((prevData: any) => ({ ...prevData, type })); // Update the aquarium data
    setIsStepValid(true); // Mark the step as valid once a type is selected
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
        Select Aquarium Type
      </Typography>
  
      <Grid container spacing={4} justifyContent="center">
        {/* Freshwater Option */}
        <Grid item xs={12} sm={6}>
          <Button
            variant={selectedType === 'Freshwater' ? 'contained' : 'outlined'}
            fullWidth
            onClick={() => handleTypeSelection('Freshwater')}
            sx={{
              textTransform: 'none', // Disable auto-capitalization
              backgroundColor: selectedType === 'Freshwater' ? theme.palette.primary.main : 'transparent',
              color: selectedType === 'Freshwater' ? theme.palette.primary.contrastText : theme.palette.text.primary,
              borderColor: selectedType !== 'Freshwater' ? theme.palette.divider : 'transparent',
              '&:hover': {
                backgroundColor: selectedType === 'Freshwater' ? theme.palette.primary.dark : theme.palette.action.hover,
              },
            }}
          >
            Freshwater
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 1, color: theme.palette.text.primary }}>
            Beginner-friendly and easy to maintain. Fish: Neon Tetras, Betta. Plants: Java Fern, Amazon Sword.
          </Typography>
        </Grid>
  
        {/* Saltwater Options (Coming Soon) */}
        <Grid item xs={12} sm={6}>
          <Tooltip title="Coming Soon!">
            <span>
              <Button
                variant="outlined"
                fullWidth
                disabled
                sx={{
                  textTransform: 'none', // Disable auto-capitalization
                  color: theme.palette.text.disabled,
                  borderColor: theme.palette.divider,
                  '&:hover': {
                    backgroundColor: theme.palette.action.disabledBackground,
                  },
                }}
              >
                Saltwater (Coming Soon)
              </Button>
            </span>
          </Tooltip>
          <Typography variant="body2" align="center" sx={{ mt: 1, color: theme.palette.text.primary }}>
            Advanced setup with vibrant marine life. Fish: Clownfish, Yellow Tang. Corals: Zoanthids, Star Polyps.
          </Typography>
        </Grid>
      </Grid>
  
      <Box mt={2} textAlign="center">
        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
          <strong>Tip:</strong> Freshwater is ideal for beginners. Stay tuned for Saltwater options coming soon!
        </Typography>
      </Box>
    </Box>
  );  
};

export default AquariumTypeStep;