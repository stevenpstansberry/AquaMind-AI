import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Menu, MenuItem, Box, Button, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';  
import RemoveIcon from '@mui/icons-material/Remove';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; 
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';  // Import the Outlined Info icon

interface PlantCardProps {
  plants: { name: string; count: number; role: string }[];  // Plants now have a 'role' field
}

enum DisplayMode {
  ALL_PLANTS,
  FAST_GROWING,
  SLOW_GROWING,
  FLOATING,
  ROOTED,
}

const PlantCard: React.FC<PlantCardProps> = ({ plants }) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.ALL_PLANTS);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [plantList, setPlantList] = useState(plants); // Track plant count updates
  const [originalPlantList] = useState(plants); // Track original state of plant list
  const [changesSaved, setChangesSaved] = useState(true); // Track unsaved changes

  // Handle filtering plants based on the current display mode
  const filteredPlants = plantList.filter((plant) => {
    switch (displayMode) {
      case DisplayMode.ALL_PLANTS:
        return true;
      case DisplayMode.FAST_GROWING:
        return plant.role === 'fast-growing';
      case DisplayMode.SLOW_GROWING:
        return plant.role === 'slow-growing';
      case DisplayMode.FLOATING:
        return plant.role === 'floating';
      case DisplayMode.ROOTED:
        return plant.role === 'rooted';
      default:
        return false;
    }
  });

  const cycleDisplayMode = (e: React.MouseEvent<HTMLDivElement>) => {
    const validModes = Object.values(DisplayMode).filter((value) => typeof value === 'number');
    setDisplayMode((prevMode) => {
      const nextMode = (prevMode + 1) % validModes.length;
      return nextMode;
    });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleIncrement = (name: string) => {
    setPlantList((prevList) =>
      prevList.map((plant) =>
        plant.name === name ? { ...plant, count: plant.count + 1 } : plant
      )
    );
    setChangesSaved(false);
  };

  const handleDecrement = (name: string) => {
    setPlantList((prevList) =>
      prevList.map((plant) =>
        plant.name === name && plant.count > 0 ? { ...plant, count: plant.count - 1 } : plant
      )
    );
    setChangesSaved(false);
  };

  const handleSaveChanges = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent cycling mode when saving
    setChangesSaved(true);
  };

  const handleDiscardChanges = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent cycling mode when discarding
    setPlantList(originalPlantList); // Revert to the original plant list
    setChangesSaved(true);
  };

  const handleAddNewPlant = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent cycling mode when adding new plant
    console.log('Add new plant clicked');
  };

  const handleShowPlantInfo = (plant: { name: string; count: number; role: string }) => {
    console.log('Plant details:', plant);
  };

  const displayModeText = {
    [DisplayMode.ALL_PLANTS]: 'All Plants',
    [DisplayMode.FAST_GROWING]: 'Fast Growing Plants',
    [DisplayMode.SLOW_GROWING]: 'Slow Growing Plants',
    [DisplayMode.FLOATING]: 'Floating Plants',
    [DisplayMode.ROOTED]: 'Rooted Plants',
  };

  return (
    <Card sx={cardStyle} onClick={cycleDisplayMode}>
      <CardContent>
        <Typography variant="h6">Plants</Typography>
        <Typography variant="body1">{displayModeText[displayMode]}</Typography>
        
        <Box sx={{ marginTop: 2 }}>
          {filteredPlants.length > 0
            ? filteredPlants.map((plant) => (
                <Box key={plant.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1 }}>
                  
                  {/* Plant Name, Count and Info Button */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">
                      {plant.name} (x{plant.count})
                    </Typography>
                    
                    {/* Info Button placed directly next to the plant name and count */}
                    <Tooltip title="View Plant Info">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowPlantInfo(plant);
                        }}
                      >
                        <InfoOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Increment/Decrement Button Group */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Decrease count">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecrement(plant.name);
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Increase count">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIncrement(plant.name);
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))
            : <Typography variant="body2">No plants in this category.</Typography>
          }
        </Box>

        {/* Add New Plant Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            Add New Plant
          </Typography>

          <Tooltip title="Add New Plant">
            <IconButton
              color="primary"
              onClick={handleAddNewPlant}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {!changesSaved && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: 2 }}>
            <Button onClick={handleDiscardChanges} color="secondary" variant="outlined">
              Discard Changes
            </Button>
            <Button onClick={handleSaveChanges} color="primary" variant="contained">
              Save Changes
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Styles for the card and kebab icon
const cardStyle = {
  height: '100%',
  position: 'relative',
  transition: 'transform 0.15s ease-in-out, boxShadow 0.15s ease-in-out',
  border: '1px solid #e0e0e0',
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
  borderRadius: '8px',
  backgroundColor: '#fafafa',
  userSelect: 'none', 
  '&:hover': {
    cursor: 'pointer',
    transform: 'scale(1.01)',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.12)',
  },
};

export default PlantCard;
