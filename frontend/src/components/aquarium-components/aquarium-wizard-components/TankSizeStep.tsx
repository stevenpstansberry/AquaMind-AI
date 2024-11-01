/**
 * @file TankSizeStep.tsx
 * @location src/components/aquarium-components/aquarium-wizard-components/TankSizeStep.tsx
 * @description This component renders the tank size input step in the aquarium setup wizard. It allows the user to enter the tank size and validates the input to ensure it's a valid number. Updates the parent state with the tank size value.
 * 
 * @editor Enhanced with initial validation check, tip text, and refined warnings.
 */

import React, { useState, useEffect } from 'react';
import { Typography, TextField, Box, InputAdornment, Slider, Button } from '@mui/material';
import { Aquarium } from '../../../interfaces/Aquarium';

interface TankSizeStepProps {
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  setIsStepValid: React.Dispatch<React.SetStateAction<boolean>>;
  aquariumData: Aquarium;
}

const TankSizeStep: React.FC<TankSizeStepProps> = ({ setAquariumData, setIsStepValid, aquariumData }) => {
  const [customSize, setCustomSize] = useState<string>(aquariumData.size || '10'); // Default to 10 gallons
  const [sizeError, setSizeError] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  /**
   * Validates tank size on load and updates the state accordingly.
   */
  useEffect(() => {
    const initialSize = parseInt(customSize, 10);
    validateSize(initialSize);
  }, []);

  /**
   * Validates tank size and sets error/warning messages.
   * 
   * @param {number} size - The tank size to validate.
   */
  const validateSize = (size: number) => {
    if (size < 1) {
      setSizeError(true);
      setWarning("Tank size can't be less than 1 gallon.");
    } else if (size > 100000) {
      setSizeError(true);
      setWarning("Please enter a realistic tank size.");
    } else {
      setSizeError(false);
      setWarning(size < 5 ? "Please be careful in stocking an aquarium less than 5 gallons." : null);
      setAquariumData((prevData: any) => ({ ...prevData, size: `${size}` }));
      setIsStepValid(true);
    }
  };

  /**
   * Handles changes in the tank size input field and slider.
   */
  const handleSizeChange = (value: string) => {
    const numValue = parseInt(value, 10);
    setCustomSize(value);
    validateSize(numValue);
  };

  /**
   * Handles scroll wheel events on the slider, adjusting tank size.
   */
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const increment = event.deltaY < 0 ? 1 : -1;
    const newSize = Math.max(5, Math.min(250, Number(customSize) + increment));
    handleSizeChange(newSize.toString());
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
      <Typography variant="h5" gutterBottom>
        Enter Tank Size
      </Typography>
      
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Most tank sizes range from 10 to 100 gallons.
      </Typography>

      {/* Placeholder for Future Aquarium Size Graphic */}
      <Box
        sx={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          border: '2px dashed lightgray',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow for visual emphasis
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Size Graphic
        </Typography>
      </Box>

      {/* Tank Size Input with Increment/Decrement Controls */}
      <TextField
        label="Tank Size"
        variant="outlined"
        value={customSize}
        onChange={(e) => handleSizeChange(e.target.value)}
        error={sizeError}
        helperText={sizeError ? 'Invalid tank size' : warning || ''}
        InputProps={{
          endAdornment: <InputAdornment position="end">gallons</InputAdornment>,
          inputProps: { min: 0, max: 100000, step: 1 },
          // Increment/Decrement Buttons
          inputComponent: (props: any) => (
            <Box display="flex" alignItems="center">
              <Button onClick={() => handleSizeChange(String(Number(customSize) - 1))} disabled={Number(customSize) <= 1}>-</Button>
              <input {...props} style={{ textAlign: 'center', width: '50px' }} />
              <Button onClick={() => handleSizeChange(String(Number(customSize) + 1))}>+</Button>
            </Box>
          )
        }}
        sx={{ width: '300px', mt: 2 }}
      />

      {/* Slider for Tank Size with Scroll Wheel Handling */}
      <Box sx={{ width: '80%', mx: 'auto', mt: 3 }} onWheel={handleWheel}>
        <Slider
          value={Number(customSize)}
          onChange={(e, newValue) => handleSizeChange(String(newValue))}
          aria-labelledby="tank-size-slider"
          step={1}
          min={5}
          max={250}
          marks={[{ value: 5, label: '5' }, { value: 125, label: '125' }, { value: 250, label: '250' }]}
          sx={{
            '.MuiSlider-track': { backgroundColor: 'primary.main', opacity: 0.8 },
            '.MuiSlider-rail': { opacity: 0.3 },
          }}
        />
      </Box>

      {/* Tip Text */}
      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
        Tip: Bigger aquariums allow you to stock even more fish!
      </Typography>
    </Box>
  );
};

export default TankSizeStep;
