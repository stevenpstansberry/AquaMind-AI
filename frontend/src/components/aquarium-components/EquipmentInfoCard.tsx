import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface EquipmentInfoCardProps {
  open: boolean;
  onClose: () => void;
  equipment: {
    name: string;
    description: string;
    role: string;
    importance: string;
    usage: string;
    specialConsiderations: string;
  } | null;
}

const EquipmentInfoCard: React.FC<EquipmentInfoCardProps> = ({ open, onClose, equipment }) => {
  if (!equipment) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{`${equipment.name} Information`}</DialogTitle>
      <DialogContent>
        <Box>

          {/* General Information */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">General Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2"><strong>Name:</strong> {equipment.name}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}><strong>Role:</strong> {equipment.role}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}><strong>Description:</strong> {equipment.description}</Typography>
            </AccordionDetails>
          </Accordion>

          {/* Why is it important? */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Why is it Important?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{equipment.importance}</Typography>
            </AccordionDetails>
          </Accordion>

          {/* How to Use */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">How to Use?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{equipment.usage}</Typography>
            </AccordionDetails>
          </Accordion>

          {/* Special Considerations */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Special Considerations</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{equipment.specialConsiderations}</Typography>
            </AccordionDetails>
          </Accordion>

        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EquipmentInfoCard;
