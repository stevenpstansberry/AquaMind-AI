/**
 * @file EquipmentInfoCard.tsx
 * @location src/components/aquarium-components/aquarium-wizard-components/EquipmentInfoCard.tsx
 * @description This component renders a detailed information card for a selected piece of equipment in the aquarium setup wizard. The card displays information such as the equipment's role, importance, usage, and any special considerations.
 * 
 * @author Steven Stansberry
 */

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Equipment } from '../../interfaces/Aquarium';

interface EquipmentInfoCardProps {
  open: boolean;
  onClose: () => void;
  equipment: Equipment | null;
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

          {/* Custom Fields */}
          {equipment.fields && Object.keys(equipment.fields).length > 0 && (
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Custom Fields</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {Object.entries(equipment.fields).map(([key, value]) => {
                  if (value) {
                    return (
                      <Typography key={key} variant="body2" sx={{ mt: 1 }}>
                        <strong>{key}:</strong> {value}
                      </Typography>
                    );
                  }
                  return null; // Do not render if the field is empty
                })}
              </AccordionDetails>
            </Accordion>
          )}

        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EquipmentInfoCard;
