import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AquariumParameters from './AquariumParameters';

// Define possible display modes
enum DisplayMode {
  CURRENT_PARAMETERS,
  GRAPH_VIEW,
  SUGGESTED_PARAMETERS
}

interface ParametersCardProps {
  parameters: { temperature: number; ph: number; ammonia: number };
  onUpdateParameters: (newParams: { temperature: number; ph: number; ammonia: number }) => void;
  aquariumData: { type: string; species: { name: string; count: number }[] };
}

const ParametersCard: React.FC<ParametersCardProps> = ({ parameters, onUpdateParameters, aquariumData }) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.CURRENT_PARAMETERS); // Track current display mode
  const [showParametersModal, setShowParametersModal] = useState(false);  // For editing modal

  // Handle saving parameters
  const handleSave = (newParams: { temperature: number; ph: number; ammonia: number }) => {
    console.log("Saving parameters:", newParams);  
    setShowParametersModal(false);
  };

  // Get numeric values from the DisplayMode enum
  const validModes = Object.values(DisplayMode).filter(value => typeof value === 'number');

  // Handle cycling through different views
  const cycleDisplayMode = () => {
    setDisplayMode((prevMode) => {
      const nextMode = (prevMode + 1) % validModes.length;
      console.log("Cycling display mode (before rounding):", nextMode);  
      return Math.floor(nextMode);  // Ensure the next mode is an integer
    });
  };

  // Text for each display mode
  const displayModeText = {
    [DisplayMode.CURRENT_PARAMETERS]: 'Current Display: Aquarium Parameters',
    [DisplayMode.GRAPH_VIEW]: 'Current Display: Graph View',
    [DisplayMode.SUGGESTED_PARAMETERS]: 'Current Display: Suggested Parameters'
  };

  console.log("Current display mode:", displayMode);  // Debugging statement

  return (
    <>
      <Card
        sx={{
          height: '100%',
          position: 'relative',
          border: '1px solid #e0e0e0',
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
          borderRadius: '8px',
          backgroundColor: '#fafafa',
          transition: 'transform 0.15s ease-in-out, boxShadow 0.15s ease-in-out',
          '&:hover': {
            cursor: 'pointer',
            transform: 'scale(1.01)',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
          }
        }}
        onClick={cycleDisplayMode}  // Cycle view on click
      >
        <CardContent>
          {/* Display the current mode text */}
          <Typography variant="h6">Aquarium Parameters</Typography>
          <Typography variant="body1">
            {displayModeText[displayMode] || 'Unknown display mode'}
          </Typography>
        </CardContent>

        {/* Edit Icon */}
        <IconButton
          color="primary"
          sx={{ position: 'absolute', top: '10px', right: '10px', color: '#B0BEC5' }}
          aria-label="edit parameters"
          onClick={(e) => { e.stopPropagation(); setShowParametersModal(true); }}  
        >
          <EditIcon />
        </IconButton>
      </Card>

      {/* Modal for editing parameters */}
      {showParametersModal && (
        <AquariumParameters
          parameters={parameters}
          onUpdateParameters={handleSave}
          onClose={() => setShowParametersModal(false)}
        />
      )}
    </>
  );
};

export default ParametersCard;
