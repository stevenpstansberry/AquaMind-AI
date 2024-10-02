import React, { useState, useEffect } from 'react';
import { Typography, TextField, Box, InputAdornment } from '@mui/material';

interface TankSizeStepProps {
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  setIsStepValid: React.Dispatch<React.SetStateAction<boolean>>;
  aquariumData: { type: string; size: string; species: string[]; equipment: string[] };
}

const TankSizeStep: React.FC<TankSizeStepProps> = ({ setAquariumData, setIsStepValid, aquariumData }) => {
  const [customSize, setCustomSize] =  useState<string | string>(aquariumData.size || ''); // Initialize from aquariumData
  const [sizeError, setSizeError] = useState(false);

  // Handle changes in the text field and update state
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

  // When exiting this step, the parent will handle navigation via onNext
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
