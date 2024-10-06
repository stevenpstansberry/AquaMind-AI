import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, Box, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';  // Import datetime picker styles

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

const AquariumParameters: React.FC<AquariumParametersProps> = ({ parameters, onUpdateParameters, onClose, aquariumType }) => {
  const [tempParams, setTempParams] = useState(parameters);
  const [logDate, setLogDate] = useState<Date | undefined>(new Date());
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    onUpdateParameters({ ...tempParams, logDate });
    onClose();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

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

          {/* Nitrite */}
          {tempParams.nitrite !== undefined && (
            <TextField
              label="Nitrite (ppm)"
              fullWidth
              margin="normal"
              type="number"
              value={tempParams.nitrite}
              onChange={(e) => setTempParams({ ...tempParams, nitrite: Number(e.target.value) })}
            />
          )}

          {/* Nitrate */}
          {tempParams.nitrate !== undefined && (
            <TextField
              label="Nitrate (ppm)"
              fullWidth
              margin="normal"
              type="number"
              value={tempParams.nitrate}
              onChange={(e) => setTempParams({ ...tempParams, nitrate: Number(e.target.value) })}
            />
          )}

          {/* Freshwater-specific parameters */}
          {aquariumType === 'Freshwater' && (
            <>
              {tempParams.gh !== undefined && (
                <TextField
                  label="General Hardness (GH)"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={tempParams.gh}
                  onChange={(e) => setTempParams({ ...tempParams, gh: Number(e.target.value) })}
                />
              )}

              {tempParams.kh !== undefined && (
                <TextField
                  label="Carbonate Hardness (KH)"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={tempParams.kh}
                  onChange={(e) => setTempParams({ ...tempParams, kh: Number(e.target.value) })}
                />
              )}

              {tempParams.co2 !== undefined && (
                <TextField
                  label="CO2 (ppm)"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={tempParams.co2}
                  onChange={(e) => setTempParams({ ...tempParams, co2: Number(e.target.value) })}
                />
              )}
            </>
          )}

          {/* Saltwater-specific parameters */}
          {aquariumType === 'Saltwater' && (
            <>
              {tempParams.salinity !== undefined && (
                <TextField
                  label="Salinity (ppt)"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={tempParams.salinity}
                  onChange={(e) => setTempParams({ ...tempParams, salinity: Number(e.target.value) })}
                />
              )}

              {tempParams.calcium !== undefined && (
                <TextField
                  label="Calcium (ppm)"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={tempParams.calcium}
                  onChange={(e) => setTempParams({ ...tempParams, calcium: Number(e.target.value) })}
                />
              )}

              {tempParams.magnesium !== undefined && (
                <TextField
                  label="Magnesium (ppm)"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={tempParams.magnesium}
                  onChange={(e) => setTempParams({ ...tempParams, magnesium: Number(e.target.value) })}
                />
              )}

              {tempParams.alkalinity !== undefined && (
                <TextField
                  label="Alkalinity (dKH)"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={tempParams.alkalinity}
                  onChange={(e) => setTempParams({ ...tempParams, alkalinity: Number(e.target.value) })}
                />
              )}

              {tempParams.phosphate !== undefined && (
                <TextField
                  label="Phosphate (ppm)"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={tempParams.phosphate}
                  onChange={(e) => setTempParams({ ...tempParams, phosphate: Number(e.target.value) })}
                />
              )}
            </>
          )}
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
