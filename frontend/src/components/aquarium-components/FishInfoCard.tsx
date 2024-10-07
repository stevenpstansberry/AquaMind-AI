import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Fish } from '../../interfaces/Aquarium';

interface FishInfoCardProps {
  open: boolean;
  onClose: () => void;
  fish: Fish | null;
}

const FishInfoCard: React.FC<FishInfoCardProps> = ({ open, onClose, fish }) => {
  if (!fish) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Fish Information</DialogTitle>
      <DialogContent>
        <Box>

          {/* General Information */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">General Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Fish Image Placeholder */}
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                {fish.imageUrl ? (
                  <img src={fish.imageUrl} alt={fish.name} style={{ maxHeight: '200px', maxWidth: '100%' }} />
                ) : (
                  <Box sx={{ height: '150px', width: '100%', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      No Image Available
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Fish Details */}
              <Typography variant="body2">
                <strong>Name:</strong> {fish.name}
              </Typography>
              <Typography variant="body2">
                <strong>Count:</strong> {fish.count}
              </Typography>
              <Typography variant="body2">
                <strong>Role:</strong> {fish.role}
              </Typography>
              <Typography variant="body2">
                <strong>Type:</strong> {fish.type}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Description:</strong> {fish.description || 'No description available.'}
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
                <strong>Tank Requirements:</strong> {fish.tankRequirements || 'Tank requirements not specified.'}
              </Typography>

              {/* Minimum Tank Size */}
              {fish.minTankSize && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Minimum Tank Size:</strong> {fish.minTankSize} gallons
                </Typography>
              )}

              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Water Parameters:</strong> {fish.waterParameters || 'Water parameters not specified.'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Compatibility:</strong> {fish.compatibility || 'Compatibility information not available.'}
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Care and Behavior */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Care and Behavior</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                <strong>Feeding Habits:</strong> {fish.feedingHabits || 'Feeding habits not specified.'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Behavior:</strong> {fish.behavior || 'Behavior information not available.'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Care Level:</strong> {fish.careLevel || 'Care level not specified.'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Special Considerations:</strong> {fish.specialConsiderations || 'Special considerations not available.'}
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Breeding and Lifespan */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Breeding and Lifespan</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                <strong>Breeding Information:</strong> {fish.breedingInfo || 'Breeding information not available.'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Lifespan:</strong> {fish.lifespan || 'Lifespan not specified.'}
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Stocking and Habitat */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Stocking and Habitat</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                <strong>Stocking Recommendations:</strong> {fish.stockingRecommendations || 'Stocking recommendations not available.'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Dietary Restrictions:</strong> {fish.dietaryRestrictions || 'Dietary restrictions not specified.'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Native Habitat:</strong> {fish.nativeHabitat || 'Native habitat information not available.'}
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

export default FishInfoCard;
