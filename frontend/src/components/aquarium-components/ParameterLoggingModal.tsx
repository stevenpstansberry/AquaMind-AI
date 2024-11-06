// src/components/aquarium-components/ParameterLoggingModal.tsx

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import {Close as CloseIcon} from '@mui/icons-material';
import { WaterParameterEntry } from '../../interfaces/Aquarium';
import { v4 as uuidv4 } from 'uuid';
import { Aquarium } from '../../interfaces/Aquarium';

interface ParameterLoggingModalProps {
  open: boolean;
  onClose: () => void;
  onAddEntry: (entry: WaterParameterEntry) => void;
  aquarium: Aquarium;
}

const ParameterLoggingModal: React.FC<ParameterLoggingModalProps> = ({ open, onClose, onAddEntry, aquarium }) => {
  const [temperature, setTemperature] = useState<number | ''>('');
  const [ph, setPh] = useState<number | ''>('');
  const [hardness, setHardness] = useState<number | ''>('');
  // Add more parameters as needed

  const handleSubmit = () => {
    const newEntry: WaterParameterEntry = {
      aquariumId: aquarium.id,
      id: uuidv4(),
      timestamp: Date.now(),
    };
  
    if (typeof temperature === 'number') {
      newEntry.temperature = temperature;
    }
    if (typeof ph === 'number') {
      newEntry.ph = ph;
    }
    if (typeof hardness === 'number') {
      newEntry.hardness = hardness;
    }
    // Add more parameters as needed
  
    onAddEntry(newEntry);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Log New Water Parameters</DialogTitle>
      <Box position="absolute" top={8} right={8}>
        <IconButton onClick={onClose} aria-label="close" sx={{color: (theme) => theme.palette.grey[500],}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <TextField
          label="Temperature (°F)"
          type="number"
          fullWidth
          margin="normal"
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
        />
        <TextField
          label="pH"
          type="number"
          fullWidth
          margin="normal"
          value={ph}
          onChange={(e) => setPh(Number(e.target.value))}
        />
        <TextField
          label="Hardness (dGH)"
          type="number"
          fullWidth
          margin="normal"
          value={hardness}
          onChange={(e) => setHardness(Number(e.target.value))}
        />
        {/* Add more fields as needed */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Log Parameters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ParameterLoggingModal;
