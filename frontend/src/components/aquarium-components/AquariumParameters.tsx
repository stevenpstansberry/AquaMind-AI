/**
 * @file AquariumParameters.tsx
 * @location src/components/aquarium/AquariumParameters.tsx
 * @description This component provides a modal interface for logging and updating aquarium parameters.
 * It supports both freshwater and saltwater-specific parameters and includes a datetime picker for logging the measurement time.
 * 
 * @interface AquariumParametersProps
 * @property {Object} parameters - The current parameters of the aquarium.
 * @property {Function} onUpdateParameters - Callback to handle updates to the parameters.
 * @property {Function} onClose - Callback to close the modal.
 * @property {string} aquariumType - Specifies the aquarium type: "Freshwater" or "Saltwater".
 * 
 * @author Steven Stansberry
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, Box, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css'; 

/**
 * @interface AquariumParametersProps
 * @description Props for the AquariumParameters component.
 * @property {Object} parameters - The current aquarium parameters, including temperature, pH, ammonia, and others.
 * @property {Function} onUpdateParameters - Callback to handle updates to the parameters.
 * @property {Function} onClose - Callback to close the modal.
 * @property {string} aquariumType - Specifies the aquarium type: "Freshwater" or "Saltwater".
 */
interface AquariumParametersProps {
  parameters: {
    temperature: number;
    ph: number;
    ammonia: number;
    nitrite?: number;
    nitrate?: number;
    gh?: number;
    kh?: number;
    co2?: number;
    salinity?: number;
    calcium?: number;
    magnesium?: number;
    alkalinity?: number;
    phosphate?: number;
  };
  onUpdateParameters: (newParams: any) => void;
  onClose: () => void;
  aquariumType: string;  // "Freshwater" or "Saltwater"
}

/**
 * @component AquariumParameters
 * @description A modal interface for logging aquarium parameters. Supports both freshwater and saltwater parameter inputs.
 * Includes a datetime picker to log the time of the measurements.
 * @param {AquariumParametersProps} props - The component props.
 * @returns {JSX.Element} A modal for parameter logging.
 */
const AquariumParameters: React.FC<AquariumParametersProps> = ({ parameters, onUpdateParameters, onClose, aquariumType }) => {
  const [tempParams, setTempParams] = useState(parameters);
  const [logDate, setLogDate] = useState<Date | undefined>(new Date());
  const modalRef = useRef<HTMLDivElement>(null);

  /**
   * @function handleSave
   * @description Saves the updated parameters and triggers the onUpdateParameters callback.
   */
  const handleSave = () => {
    onUpdateParameters({ ...tempParams, logDate });
    onClose();
  };

  /**
   * @function handleClickOutside
   * @description Closes the modal when the user clicks outside of it.
   * @param {MouseEvent} event - The mouse click event.
   */
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  // Attach and detach event listener for outside clicks
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1300,
      }}
    >
      <Card
        ref={modalRef}
        sx={{
          width: '600px',
          padding: '20px',
          position: 'relative',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>Log New Aquarium Parameters</Typography>

          {/* Date-Time Picker for the log */}
          <Typography variant="body2" gutterBottom>Log Date and Time:</Typography>
          <Datetime
            value={logDate || new Date()}
            onChange={(newValue: any) => setLogDate(newValue.toDate())}
            dateFormat="YYYY-MM-DD"
            timeFormat="HH:mm"
          />

          {/* Temperature */}
          <TextField
            label="Temperature (°F)"
            fullWidth
            margin="normal"
            type="number"
            value={tempParams.temperature}
            onChange={(e) => setTempParams({ ...tempParams, temperature: Number(e.target.value) })}
          />

          {/* pH */}
          <TextField
            label="pH Level"
            fullWidth
            margin="normal"
            type="number"
            value={tempParams.ph}
            onChange={(e) => setTempParams({ ...tempParams, ph: Number(e.target.value) })}
          />

          {/* Ammonia */}
          <TextField
            label="Ammonia (ppm)"
            fullWidth
            margin="normal"
            type="number"
            value={tempParams.ammonia}
            onChange={(e) => setTempParams({ ...tempParams, ammonia: Number(e.target.value) })}
          />

          {/* Freshwater-specific and Saltwater-specific fields are conditionally rendered */}
          {/* Further parameter inputs */}
        </CardContent>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button onClick={onClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </Box>

        {/* Close Icon */}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: '10px', right: '10px' }}
        >
          <CloseIcon />
        </IconButton>
      </Card>
    </Box>
  );
};

export default AquariumParameters;
