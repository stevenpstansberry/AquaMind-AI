import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import AIChatInterface from '../AIChatInterface';  // Dummy AI chat component
import { Aquarium } from '../../interfaces/Aquarium';  // Assuming Aquarium interface is defined here

interface AddFishCardProps {
  open: boolean;
  onClose: () => void;
  aquarium: Aquarium;  // Pass the entire Aquarium object
  onAddFish: (fish: { name: string; count: number; type: string; role: string }) => void;
}

const AddFishCard: React.FC<AddFishCardProps> = ({ open, onClose, aquarium, onAddFish }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Freshwater');  // Default to Freshwater
  const [count, setCount] = useState(1);
  const [role, setRole] = useState('schooling');
  const [showChat, setShowChat] = useState(false);  // State for toggling AI chat

  // Handle adding the fish and resetting the form
  const handleAddFish = () => {
    if (name && count > 0) {
      onAddFish({ name, count, type, role });
      setName('');  // Reset fields
      setCount(1);
      setType('Freshwater');
      setRole('schooling');
      onClose();  // Close the modal
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Fish</DialogTitle>
      <DialogContent>
        <Box>
          {/* Fish Name */}
          <TextField
            label="Fish Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="Enter fish species name"
          />

          {/* Fish Type (Freshwater/Saltwater) */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value as string)}>
              <MenuItem value="Freshwater">Freshwater</MenuItem>
              <MenuItem value="Saltwater">Saltwater</MenuItem>
            </Select>
          </FormControl>

          {/* Fish Count */}
          <TextField
            label="Count"
            type="number"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10))}
            fullWidth
            margin="normal"
          />

          {/* Fish Role (Schooling, Predator, etc.) */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value as string)}>
              <MenuItem value="schooling">Schooling</MenuItem>
              <MenuItem value="predator">Predator</MenuItem>
              <MenuItem value="scavenger">Scavenger</MenuItem>
              <MenuItem value="community">Community</MenuItem>
              <MenuItem value="breeder">Breeder</MenuItem>
            </Select>
          </FormControl>

          {/* Display Tank Size and Type Info */}
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Tank Size: {aquarium.size} gallons ({aquarium.type}) - Helps filter suitable species.
          </Typography>

          {/* AI Chat Interface */}
          <Box mt={2}>
            <Button variant="outlined" onClick={() => setShowChat(!showChat)}>
              {showChat ? 'Hide' : 'Show'} AI Suggestions
            </Button>
            {/* Pass the entire aquarium data to the AIChatInterface for personalized suggestions */}
            <AIChatInterface showChat={showChat} onClose={() => setShowChat(false)} aquarium={aquarium} />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleAddFish} color="primary" variant="contained">Add Fish</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFishCard;
