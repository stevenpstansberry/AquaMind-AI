/**
 * @file EquipmentInfoCard.tsx
 * @location src/components/aquarium-components/aquarium-wizard-components/EquipmentInfoCard.tsx
 * @description This component renders a detailed information card for a selected piece of equipment in the aquarium setup wizard. The card displays information such as the equipment's role, importance, usage, and any special considerations.
 * 
 * @param {Object} props - The props for the component.
 * @property {boolean} open - Determines whether the dialog is open or closed.
 * @property {() => void} onClose - Function to close the dialog.
 * @property {Equipment | null} equipment - The aquarium equipment to display.
 * 
 * @component
 */

import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, Accordion, AccordionSummary, AccordionDetails, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
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
      <DialogTitle>
        {`${equipment.name} Information`}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
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
    </Dialog>
  );
};

export default EquipmentInfoCard;
