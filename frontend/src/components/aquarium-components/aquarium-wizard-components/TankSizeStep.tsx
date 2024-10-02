import React, { useState, useEffect } from 'react';
import { Typography, TextField, Box, InputAdornment } from '@mui/material';

interface TankSizeStepProps {
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
}

const TankSizeStep: React.FC<TankSizeStepProps> = ({ setAquariumData }) => {
  const [customSize, setCustomSize] = useState('');
  const [sizeError, setSizeError] = useState(false);

  // Handle changes in the text field and update state
  const handleCustomSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCustomSize(value);

    // Validate to allow only numbers
    if (/^\d+$/.test(value) || value === '') {
      setSizeError(false);
      setAquariumData((prevData: any) => ({ ...prevData, size: `${value} gallons` }));
    } else {
      setSizeError(true);
    }
  };

  // When exiting this step, the parent will handle navigation via onNext
  useEffect(() => {
    if (!sizeError && customSize) {
      setAquariumData((prevData: any) => ({ ...prevData, size: `${customSize} gallons` }));
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