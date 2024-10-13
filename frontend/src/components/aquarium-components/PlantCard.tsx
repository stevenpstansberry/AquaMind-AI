import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, Menu, MenuItem, Box, Button, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';  
import RemoveIcon from '@mui/icons-material/Remove';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; 
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';  // Import the Outlined Info icon
import PlantInfoCard from './PlantInfoCard';
import AddPlantCard from './AddPlantCard';
import { Aquarium } from '../../interfaces/Aquarium';

interface PlantCardProps {
  aquarium : Aquarium;
}

enum DisplayMode {
  ALL_PLANTS,
  FAST_GROWING,
  SLOW_GROWING,
  FLOATING,
  ROOTED,
}

const PlantCard: React.FC<PlantCardProps> = ({ aquarium }) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.ALL_PLANTS);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [plantList, setPlantList] = useState(aquarium.plants); // Track plant count updates
  const [originalPlantList, setOriginalPlantList] = useState(aquarium.plants); // Track original state of plant list
  const [changesSaved, setChangesSaved] = useState(true); // Track unsaved changes
  const [selectedPlant, setSelectedPlant] = useState<{ name: string; count: number; role: string; type: string } | null>(null);  // Track selected plant
  const [infoCardOpen, setInfoCardOpen] = useState(false);  
  const [addPlantOpen, setAddPlantOpen] = useState(false);  
  const [plantToDelete, setPlantToDelete] = useState<{ name: string; count: number; role: string; type: string } | null>(null);  // Track fish to be deleted
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);  // Track delete confirmation dialog state

  // Update plantList and originalPlantList when new plants props are passed
  useEffect(() => {
    setPlantList(aquarium.plants);
    setOriginalPlantList(aquarium.plants);
    setChangesSaved(true); // Reset changes saved status when plants update
  }, [aquarium]);

  // Function to compare current plant list with the original list
  const checkChangesSaved = () => {
    if(!plantList || !originalPlantList) return;

    const isSame = plantList.every((plant, idx) => plant.count === originalPlantList[idx].count);
    setChangesSaved(isSame);
  };

  // Update to check for changes every time plantList is updated
  useEffect(() => {
    checkChangesSaved();
  }, [plantList]);

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
  };

  // Decrement function with confirmation for deletion
  const handleDecrement = (name: string) => {
    const updatedPlantList = plantList.map((plant) => {
      if (plant.name === name) {
        const newCount = plant.count - 1;
        if (newCount === 0) {
          setPlantToDelete(plant);  // Store plant to potentially delete
          setConfirmDeleteOpen(true);  // Open confirmation dialog
          return plant;  // Return unchanged to keep plant in the list temporarily
        }
        return { ...plant, count: newCount };
      }
      return plant;
    });
    setPlantList(updatedPlantList);
  };

  // Remove plant if confirmed and update both plantList and originalPlantList
  const handleConfirmDelete = () => {
    if (plantToDelete) {
      // Update both the current plant list and the original plant list
      setPlantList((prevList) => prevList.filter(plant => plant.name !== plantToDelete.name));
      setOriginalPlantList((prevList) => prevList.filter(plant => plant.name !== plantToDelete.name));  // Update original list
      setPlantToDelete(null);  // Clear the plant to delete state
      setConfirmDeleteOpen(false);  // Close the confirmation dialog
    }
  };

  const handleCancelDelete = () => {
    setPlantToDelete(null);  // Reset plant to delete
    setConfirmDeleteOpen(false);  // Close confirmation dialog
  };

  const handleSaveChanges = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent cycling mode when saving
    setOriginalPlantList(plantList); // Save current state as the original
    setChangesSaved(true); // Mark changes as saved
  };

  const handleDiscardChanges = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent cycling mode when discarding
    setPlantList(originalPlantList); // Revert to the original plant list
    setChangesSaved(true);
  };

  const handleAddNewPlant = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent cycling mode when adding new plant
    setAddPlantOpen(true); // Open the add plant dialog
  };

  const handleAddPlant = (plantList: { name: string; count: number; type: string; role: string }[]) => {
    setPlantList((prevList) => [...prevList, ...plantList]); 
    setAddPlantOpen(false);  
  };

  const handleShowPlantInfo = (plant: { name: string; count: number; role: string; type: string }) => {
      setSelectedPlant(plant);
      setInfoCardOpen(true);
      console.log('Plant details:', plant);
  };

  const handleInfoCardClose = () => {
    setInfoCardOpen(false);
    setSelectedPlant(null);
  };

  const handleCloseAddPlant = () => {
    setAddPlantOpen(false);
  }

  const displayModeText = {
    [DisplayMode.ALL_PLANTS]: 'All Plants',
    [DisplayMode.FAST_GROWING]: 'Fast Growing Plants',
    [DisplayMode.SLOW_GROWING]: 'Slow Growing Plants',
    [DisplayMode.FLOATING]: 'Floating Plants',
    [DisplayMode.ROOTED]: 'Rooted Plants',
  };

  return (
    <>
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

          {/* Save/Discard Buttons */}
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

        <IconButton color="primary" sx={iconStyle} onClick={handleMenuOpen}>
            <MoreVertIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => setDisplayMode(DisplayMode.ALL_PLANTS)}>All Plants</MenuItem>
            <MenuItem onClick={() => setDisplayMode(DisplayMode.FAST_GROWING)}>Fast Growing Plants</MenuItem>
            <MenuItem onClick={() => setDisplayMode(DisplayMode.SLOW_GROWING)}>Slow Growing Plants</MenuItem>
            <MenuItem onClick={() => setDisplayMode(DisplayMode.FLOATING)}>Floating Plants</MenuItem>
            <MenuItem onClick={() => setDisplayMode(DisplayMode.ROOTED)}>Rooted Plants</MenuItem>
          </Menu>
      </Card>

      {/* Plant Info Modal */}
      <PlantInfoCard open={infoCardOpen} onClose={handleInfoCardClose} plant={selectedPlant} />

      {/* Add Plant Modal */}
      <AddPlantCard open={addPlantOpen} onClose={handleCloseAddPlant} aquarium={aquarium} onAddPlant={handleAddPlant} />
    </>    
  );
};

// Styles for the card
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

const iconStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  color: '#B0BEC5',
  fontSize: '20px',
};

export default PlantCard;
