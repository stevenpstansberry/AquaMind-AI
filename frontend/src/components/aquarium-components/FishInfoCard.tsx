// FishInfoCard.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

interface FishInfoCardProps {
  open: boolean;
  onClose: () => void;
  fish: { name: string; count: number; role: string } | null;
}

const FishInfoCard: React.FC<FishInfoCardProps> = ({ open, onClose, fish }) => {
  if (!fish) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Fish Information</DialogTitle>
      <DialogContent>
        <Box>
          <Typography variant="h6">{fish.name}</Typography>
          <Typography variant="body1">Count: {fish.count}</Typography>
          <Typography variant="body1">Role: {fish.role}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FishInfoCard;
