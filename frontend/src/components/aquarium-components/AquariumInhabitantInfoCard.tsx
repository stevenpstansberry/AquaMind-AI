/**
 * @file AquariumInhabitantInfoCard.tsx
 * @description This component renders a detailed information card for a selected inhabitant (fish or plant) in the aquarium setup wizard. It dynamically displays relevant information based on the type of inhabitant passed in (Fish or Plant).
 * 
 * @param {Object} props - The props for the component.
 * @property {boolean} open - Determines whether the dialog is open or closed.
 * @property {() => void} onClose - Function to close the dialog.
 * @property {Fish | Plant | null} inhabitant - The aquarium inhabitant (Fish or Plant) to display.
 * @returns {React.ReactElement | null} - The rendered info card for the inhabitant, or null if no inhabitant is selected.
 * 
 * @component
 */

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, Accordion, AccordionSummary, AccordionDetails, IconButton, DialogActions, Button, } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import { Fish, Plant } from '../../interfaces/Aquarium';

type AquariumInhabitant = Fish | Plant;

interface AquariumInhabitantInfoCardProps {
  open: boolean;
  onClose: () => void;
  inhabitant: AquariumInhabitant | null;
}

const isFish = (inhabitant: AquariumInhabitant): inhabitant is Fish => {
  return (inhabitant as Fish).feedingHabits !== undefined;
};

const AquariumInhabitantInfoCard: React.FC<AquariumInhabitantInfoCardProps> = ({ open, onClose, inhabitant }) => {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  if (!inhabitant) return null;

  const handleImageClick = () => {
    setImageDialogOpen(true);
  };

  const handleImageDialogClose = () => {
    setImageDialogOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{inhabitant.name} Information
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
              <Box sx={{ textAlign: 'center', mb: 2, position: 'relative' }}>
                {inhabitant.imageUrl ? (
                  <>
                    <img 
                      src={inhabitant.imageUrl} 
                      alt={inhabitant.name} 
                      style={{ maxHeight: '200px', maxWidth: '100%', cursor: 'pointer' }} 
                      onClick={handleImageClick}
                    />
                    <IconButton 
                      sx={{ position: 'absolute', bottom: 8, right: 8 }} 
                      onClick={handleImageClick}
                    >
                      <ZoomInIcon />
                    </IconButton>
                  </>
                ) : (
                  <Box sx={{ height: '150px', width: '100%', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      No Image Available
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Display common details */}
              <Typography variant="body2">
                <strong>Name:</strong> {inhabitant.name}
              </Typography>
              <Typography variant="body2">
                <strong>Scientific Name:</strong> {inhabitant.scientificName || 'Scientific name not specified.'}
              </Typography>
              <Typography variant="body2">
                <strong>Count:</strong> {inhabitant.count}
              </Typography>
              <Typography variant="body2">
                <strong>Role:</strong> {inhabitant.role}
              </Typography>
              <Typography variant="body2">
                <strong>Type:</strong> {inhabitant.type}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Description:</strong> {inhabitant.description || 'No description available.'}
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
                <strong>Tank Requirements:</strong> {inhabitant.tankRequirements || 'Tank requirements not specified.'}
              </Typography>

              {/* Minimum Tank Size */}
              {inhabitant.minTankSize && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Minimum Tank Size:</strong> {inhabitant.minTankSize} gallons
                </Typography>
              )}

              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Water Parameters:</strong> {inhabitant.waterParameters || 'Water parameters not specified.'}
              </Typography>

              {/* Fish-specific Compatibility */}
              {isFish(inhabitant) && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Compatibility:</strong> {inhabitant.compatibility || 'Compatibility information not available.'}
                </Typography>
              )}

              {/* Plant-specific Lighting Needs */}
              {!isFish(inhabitant) && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Lighting Needs:</strong> {inhabitant.lightingNeeds || 'Lighting needs not specified.'}
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Care, Behavior, or Growth */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{isFish(inhabitant) ? 'Care and Behavior' : 'Growth and Care'}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {isFish(inhabitant) ? (
                <>
                  <Typography variant="body2">
                    <strong>Feeding Habits:</strong> {inhabitant.feedingHabits || 'Feeding habits not specified.'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Behavior:</strong> {inhabitant.behavior || 'Behavior information not available.'}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body2">
                    <strong>Growth Rate:</strong> {inhabitant.growthRate || 'Growth rate not specified.'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Lighting Needs:</strong> {inhabitant.lightingNeeds || 'Lighting needs not specified.'}
                  </Typography>
                </>
              )}
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Care Level:</strong> {inhabitant.careLevel || 'Care level not specified.'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Special Considerations:</strong> {inhabitant.specialConsiderations || 'Special considerations not available.'}
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Breeding / Propagation and Lifespan */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{isFish(inhabitant) ? 'Breeding and Lifespan' : 'Propagation and Lifespan'}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                <strong>{isFish(inhabitant) ? 'Breeding Information' : 'Propagation Methods'}:</strong> {isFish(inhabitant) ? inhabitant.breedingInfo || 'Breeding information not available.' : inhabitant.propagationMethods || 'Propagation methods not available.'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Lifespan:</strong> {inhabitant.lifespan || 'Lifespan not specified.'}
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Stocking/Compatibility and Habitat */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Stocking / Compatibility and Habitat</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                <strong>{isFish(inhabitant) ? 'Stocking Recommendations' : 'Compatibility'}:</strong> {isFish(inhabitant) ? inhabitant.stockingRecommendations || 'Stocking recommendations not available.' : inhabitant.compatibility || 'Compatibility information not available.'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Native Habitat:</strong> {inhabitant.nativeHabitat || 'Native habitat information not available.'}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </DialogContent>

      {/* Image Dialog */}
      {inhabitant.imageUrl && (
        <Dialog open={imageDialogOpen} onClose={handleImageDialogClose} maxWidth="lg">
          <DialogContent sx={{ textAlign: 'center' }}>
          <IconButton
              onClick={handleImageDialogClose}
              sx={{ position: 'absolute', right: 8, top: 8 }}
              aria-label="close image dialog"
            >
              <CloseIcon />
            </IconButton>
            <img 
              src={inhabitant.imageUrl} 
              alt={inhabitant.name} 
              style={{ width: '100%', maxHeight: '80vh' }} 
            />
          </DialogContent>
          <DialogActions>
          </DialogActions>
        </Dialog>
      )}
    </Dialog>
  );
};

export default AquariumInhabitantInfoCard;
