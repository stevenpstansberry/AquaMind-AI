import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Plant } from '../../interfaces/Aquarium'; // Assuming Plant interface is defined in Aquarium

interface PlantInfoCardProps {
  open: boolean;
  onClose: () => void;
  plant: Plant | null;
}

const PlantInfoCard: React.FC<PlantInfoCardProps> = ({ open, onClose, plant }) => {
  if (!plant) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Plant Information</DialogTitle>
      <DialogContent>
        <Box>

          {/* General Information */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">General Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Plant Image Placeholder */}
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                {plant.imageUrl ? (
                  <img src={plant.imageUrl} alt={plant.name} style={{ maxHeight: '200px', maxWidth: '100%' }} />
                ) : (
                  <Box sx={{ height: '150px', width: '100%', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      No Image Available
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Plant Details */}
              <Typography variant="body2">
                <strong>Name:</strong> {plant.name}
              </Typography>
              <Typography variant="body2">
                <strong>Count:</strong> {plant.count}
              </Typography>
              <Typography variant="body2">
                <strong>Role:</strong> {plant.role}
              </Typography>
              <Typography variant="body2">
                <strong>Type:</strong> {plant.type}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Description:</strong> {plant.description || 'No description available.'}
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Tank and Water Requirements */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Tank and Water Requirements</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                <strong>Tank Requirements:</strong> {plant.tankRequirements || 'Tank requirements not specified.'}
              </Typography>

              {/* Minimum Tank Size */}
              {plant.minTankSize && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Minimum Tank Size:</strong> {plant.minTankSize} gallons
                </Typography>
              )}

              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Water Parameters:</strong> {plant.waterParameters || 'Water parameters not specified.'}
              </Typography>

              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Lighting Needs:</strong> {plant.lightingNeeds || 'Lighting needs not specified.'}
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Growth and Care */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Growth and Care</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                <strong>Growth Rate:</strong> {plant.growthRate || 'Growth rate not specified.'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Care Level:</strong> {plant.careLevel || 'Care level not specified.'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Special Considerations:</strong> {plant.specialConsiderations || 'No special considerations available.'}
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Propagation and Lifespan */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Propagation and Lifespan</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                <strong>Propagation Methods:</strong> {plant.propagationMethods || 'Propagation methods not available.'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Lifespan:</strong> {plant.lifespan || 'Lifespan not specified.'}
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Compatibility and Habitat */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Compatibility and Habitat</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                <strong>Compatibility:</strong> {plant.compatibility || 'Compatibility information not available.'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Native Habitat:</strong> {plant.nativeHabitat || 'Native habitat information not available.'}
              </Typography>
            </AccordionDetails>
          </Accordion>
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

export default PlantInfoCard;
