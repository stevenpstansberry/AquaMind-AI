import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';  // Vertical three-dot icon (kebab menu)
import AquariumParameters from './AquariumParameters';

// Define possible display modes
enum DisplayMode {
  CURRENT_PARAMETERS,
  WATER_QUALITY_GRAPH,
  PLANT_PARAMETER_GRAPH,
  FISH_HEALTH_GRAPH,
  SUGGESTED_PARAMETERS
}

interface ParametersCardProps {
    parameters: {
      temperature: number;
      ph: number;
      ammonia: number;
      nitrite?: number;  // Add optional nitrite
      nitrate?: number;  // Add optional nitrate
      gh?: number;       // Add optional general hardness
      kh?: number;       // Add optional carbonate hardness
      co2?: number;      // Add optional CO2 (for planted tanks)
      salinity?: number; // Add optional salinity (for saltwater)
      calcium?: number;  // Add optional calcium (for saltwater)
      magnesium?: number;// Add optional magnesium (for saltwater)
      alkalinity?: number;// Add optional alkalinity (for saltwater)
      phosphate?: number; // Add optional phosphate (for saltwater)
    };
    onUpdateParameters: (newParams: {
      temperature: number;
      ph: number;
      ammonia: number;
      nitrite?: number;
      nitrate?: number;
      gh?: number;
      kh?: number;
      co2?: number;
      salinity?: number;
      calcium?: number;
      magnesium?: number;
      alkalinity?: number;
      phosphate?: number;
    }) => void;
    aquariumData: { type: string; species: { name: string; count: number }[] };
  }
  

const ParametersCard: React.FC<ParametersCardProps> = ({ parameters, onUpdateParameters, aquariumData }) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.CURRENT_PARAMETERS);  // Track current display mode
  const [showParametersModal, setShowParametersModal] = useState(false);  // For editing modal
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);  // For menu anchor

  // Handle saving parameters
  const handleSave = (newParams: { temperature: number; ph: number; ammonia: number; salinity?: number }) => {
    console.log("Saving parameters:", newParams);  
    onUpdateParameters(newParams);
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

  // Handle menu opening and closing
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();  // Prevent the card's click handler from being triggered
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Text for each display mode
  const displayModeText = {
    [DisplayMode.CURRENT_PARAMETERS]: 'Current Display: Aquarium Parameters',
    [DisplayMode.WATER_QUALITY_GRAPH]: 'Current Display: Water Quality Graphs',
    [DisplayMode.PLANT_PARAMETER_GRAPH]: 'Current Display: Plant Growth Parameters',
    [DisplayMode.FISH_HEALTH_GRAPH]: 'Current Display: Fish Health and Stability',
    [DisplayMode.SUGGESTED_PARAMETERS]: 'Current Display: Suggested Parameters'
  };

  // Dynamically include parameters based on aquarium type
  const aquariumType = aquariumData.type.toLowerCase();

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
          userSelect: 'none',  // Prevent text selection
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

          {/* Display parameters based on aquarium type */}
          <Typography variant="body2">
            Temperature: {parameters.temperature}°F
            <br />
            pH: {parameters.ph}
            <br />
            Ammonia: {parameters.ammonia} ppm
            <br />
            {/* Conditionally show salinity for saltwater tanks */}
            {aquariumType === 'saltwater' && `Salinity: ${parameters.salinity || 'N/A'} ppt`}
          </Typography>
        </CardContent>

        {/* Vertical three-dot (kebab) menu icon */}
        <IconButton
          color="primary"
          sx={{ position: 'absolute', top: '10px', right: '10px', color: '#B0BEC5' }}
          aria-label="menu options"
          onClick={handleMenuOpen}  // Open the menu
        >
          <MoreVertIcon />
        </IconButton>

        {/* Menu Options */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {/* Log new parameters */}
          <MenuItem onClick={() => {
            setShowParametersModal(true);  // Open the modal for logging new parameters
            handleMenuClose();  // Close the menu
          }}>
            Log new parameters
          </MenuItem>

          {/* Edit Graph TimeFrame */}
          <MenuItem onClick={() => {
            console.log("Edit Graph TimeFrame clicked");  // Placeholder action
            handleMenuClose();
          }}>
            Edit Graph TimeFrame
          </MenuItem>

          {/* Aquarium Parameters Settings */}
          <MenuItem onClick={() => {
            console.log("Aquarium Parameters Settings clicked");  // Placeholder action
            handleMenuClose();
          }}>
            Aquarium Parameters Settings
          </MenuItem>
        </Menu>
      </Card>

      {/* Modal for logging new parameters */}
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
