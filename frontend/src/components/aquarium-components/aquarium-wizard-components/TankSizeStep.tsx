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

  useEffect(() => {
    const numValue = parseInt(customSize, 10);
    validateSize(numValue);
    // Update validation state if there's no error and the input is a valid number
    if (!sizeError && !isNaN(numValue)) {
      setIsStepValid(true);
      setAquariumData((prevData: any) => ({ ...prevData, size: `${numValue}` }));
    } else {
      setIsStepValid(false);
    }
  }, [customSize, sizeError]); // Run whenever customSize or sizeError changes

  /**
   * Validates tank size and sets error/warning messages without updating parent state on every keystroke.
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
    }
  };

  /**
   * Handles changes in the tank size input field but does not immediately update the parent state.
   * Only updates if the value is a valid number or an empty string (to allow clearing the input temporarily)
   */
  const handleSizeChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setCustomSize(value);
      const numValue = parseInt(value, 10);
      validateSize(numValue);
    }
  };

  /**
   * Updates the parent state only when the user finishes typing (onBlur).
   */
  const handleBlur = () => {
    const numValue = parseInt(customSize, 10);
    if (!sizeError && !isNaN(numValue)) {
      setAquariumData((prevData: any) => ({ ...prevData, size: `${numValue}` }));
      setIsStepValid(true);
    } else {
      setIsStepValid(false);
    }
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
    

      {/* Placeholder for Future Aquarium Size Graphic */}
      {/*
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
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Size Graphic
        </Typography>
      </Box>
      */}

      {/* Tank Size Input with Increment/Decrement Controls */}
      <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
        <Button onClick={() => handleSizeChange(String(Number(customSize) - 1))} disabled={Number(customSize) <= 1}>
          -
        </Button>
        <TextField
          label="Tank Size"
          variant="outlined"
          type="number" 
          value={customSize}
          onChange={(e) => handleSizeChange(e.target.value)}
          onBlur={handleBlur}
          error={sizeError}
          helperText={sizeError ? 'Invalid tank size' : warning || ''}
          InputProps={{
            endAdornment: <InputAdornment position="end">gallons</InputAdornment>,
            inputProps: { min: 1, max: 100000, step: 1, style: { textAlign: 'left', width: '100px' } },
          }}
          sx={{ mx: 1 }}
        />
        <Button onClick={() => handleSizeChange(String(Number(customSize) + 1))}>
          +
        </Button>
      </Box>

      <Typography variant="body2" color="textSecondary" gutterBottom>
        Most tank sizes range from 10 to 100 gallons.
      </Typography>

      {/* Slider for Tank Size with Scroll Wheel Handling */}
      <Box sx={{ width: '80%', mx: 'auto', mt: 3 }} onWheel={handleWheel}>
        <Slider
          value={Number(customSize)}
          onChange={(e, newValue) => handleSizeChange(String(newValue))}
          aria-labelledby="tank-size-slider"
          step={1}
          min={5}
          max={250}
          marks={[
            { value: 5, label: '5' },
            { value: 125, label: '125' },
            { value: 250, label: '250' },
          ]}
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
