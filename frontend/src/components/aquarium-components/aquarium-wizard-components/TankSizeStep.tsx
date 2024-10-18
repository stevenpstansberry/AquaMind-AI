/**
 * @file TankSizeStep.tsx
 * @location src/components/aquarium-components/aquarium-wizard-components/TankSizeStep.tsx
 * @description This component renders the tank size input step in the aquarium setup wizard. It allows the user to enter the tank size and validates the input to ensure it's a valid number. Updates the parent state with the tank size value.
 * 
 * @author Steven Stansberry
 */

import React, { useState, useEffect } from 'react';
import { Typography, TextField, Box, InputAdornment } from '@mui/material';

interface TankSizeStepProps {
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  setIsStepValid: React.Dispatch<React.SetStateAction<boolean>>;
  aquariumData: { type: string; size: string;  species: { name: string; count: number }[]; equipment: string[] };

}

const TankSizeStep: React.FC<TankSizeStepProps> = ({ setAquariumData, setIsStepValid, aquariumData }) => {
  const [customSize, setCustomSize] =  useState<string | string>(aquariumData.size || ''); // Initialize from aquariumData
  const [sizeError, setSizeError] = useState(false);

  /**
   * Handles changes in the tank size input field. Validates the input to ensure only numeric values are allowed.
   * If valid, updates the tank size in the parent state.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event for the input field.
   * @returns {void}
   */
  const handleCustomSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCustomSize(value);

    // Validate to allow only numbers
    if (/^\d+$/.test(value)) {
      setSizeError(false);
      setAquariumData((prevData: any) => ({ ...prevData, size: `${value}` }));
    } else if (value === '') {
      // If the input is cleared, invalidate the step
      setIsStepValid(false);
      setAquariumData((prevData: any) => ({ ...prevData, size: '' }));
    } else {
      setSizeError(true);
    }
  };

  /**
   * Effect that updates the parent state and validates the step when the custom size changes.
   * This effect runs whenever the `customSize` or `sizeError` state variables change.
   * 
   * @returns {void}
   */
  useEffect(() => {
    if (!sizeError && customSize) {
      setAquariumData((prevData: any) => ({ ...prevData, size: `${customSize}` }));
      setIsStepValid(true); // Mark the step as valid
    }
  }, [customSize, sizeError, setAquariumData]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
      <Typography variant="h5" gutterBottom>
        Enter Tank Size
      </Typography>
      
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Most tank sizes range from 10 to 100 gallons.
      </Typography>

      {/* Custom Size Input */}
      <TextField
        label="Tank Size"
        variant="outlined"
        value={customSize}
        onChange={handleCustomSizeChange}
        error={sizeError}
        helperText={sizeError ? 'Please enter a valid number' : ''}
        InputProps={{
          endAdornment: <InputAdornment position="end">gallons</InputAdornment>,
        }}
        sx={{ width: '300px', mt: 2 }}
      />
    </Box>
  );
};

export default TankSizeStep;
