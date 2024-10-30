// src/components/aquarium-components/ParameterLoggingModal.tsx

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
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
      temperature: typeof temperature === 'number' ? temperature : 0,
      ph: typeof ph === 'number' ? ph : 0,
      hardness: typeof hardness === 'number' ? hardness : 0,
      // Add more parameters
    };
    onAddEntry(newEntry);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Log New Water Parameters</DialogTitle>
      <DialogContent>
        <TextField
          label="Temperature (°C)"
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
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Log Parameters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ParameterLoggingModal;
