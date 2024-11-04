import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, Menu, MenuItem, Box, Button, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';  
import RemoveIcon from '@mui/icons-material/Remove';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; 
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';  
import AquariumInhabitantInfoCard from './AquariumInhabitantInfoCard';
import AddPlantCard from './AddPlantCard';
import { Aquarium, Plant } from '../../interfaces/Aquarium';

interface PlantCardProps {
  aquarium : Aquarium;
  onUpdatePlants: (plants: Plant[]) => void;
  handleSnackbar: (message: string, severity: 'success' | 'error' | 'warning' | 'info', open: boolean) => void;
}

enum DisplayMode {
  ALL_PLANTS,
  BACKGROUND,
  MIDGROUND,
  FOREGROUND,
  CARPET,
  FLOATING,
  ROOTED,
  OXYGENATOR,
}

const PlantCard: React.FC<PlantCardProps> = ({ aquarium, onUpdatePlants, handleSnackbar }) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.ALL_PLANTS);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [plantList, setPlantList] = useState(aquarium.plants || []);  // Track plant count updates
  const [originalPlantList, setOriginalPlantList] = useState(aquarium.plants); // Track original state of plant list
  const [changesSaved, setChangesSaved] = useState(true); // Track unsaved changes
  const [selectedPlant, setSelectedPlant] = useState<{ name: string; count: number; role: string; type: string } | null>(null);  // Track selected plant
  const [infoCardOpen, setInfoCardOpen] = useState(false);  
  const [addPlantOpen, setAddPlantOpen] = useState(false);  
  const [plantToDelete, setPlantToDelete] = useState<{ name: string; count: number; role: string; type: string } | null>(null);  // Track fish to be deleted
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);  // Track delete confirmation dialog state

  // Update plantList and originalPlantList when new plants props are passed
  useEffect(() => {
    const plants = aquarium.plants || [];
    console.log('aquarium.plants:', plants);
    const validatedPlants = plants.map(plant => ({
      ...plant,
      count: plant.count ?? 1,
    }));
    setPlantList(validatedPlants);
    setOriginalPlantList(validatedPlants);
    setChangesSaved(true);
  }, [aquarium]);
  
  

  // Function to compare current plant list with the original list
  const checkChangesSaved = () => {
    if (!plantList || !originalPlantList) return;
  
    if (plantList.length !== originalPlantList.length) {
      setChangesSaved(false);
      return;
    }
  
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
      case DisplayMode.BACKGROUND:
        return plant.role === 'background';
      case DisplayMode.MIDGROUND:
        return plant.role === 'midground';
      case DisplayMode.FOREGROUND:
        return plant.role === 'foreground';
      case DisplayMode.FLOATING:
        return plant.role === 'floating';
      case DisplayMode.ROOTED:
        return plant.role === 'rooted';
      case DisplayMode.CARPET:
        return plant.type === 'carpet';
      case DisplayMode.OXYGENATOR:
        return plant.type === 'oxygenator';
      default:
        return false;
    }
  });

  const cycleDisplayMode = (e: React.MouseEvent<HTMLDivElement>) => {
    if(!anchorEl) {
      const validModes = Object.values(DisplayMode).filter((value) => typeof value === 'number');
      setDisplayMode((prevMode) => {
        const nextMode = (prevMode + 1) % validModes.length;
        return nextMode;
      });
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  const handleIncrement = (name: string) => {
    setPlantList((prevList) => {
      const updatedList = prevList.map((plant) => {
        if (plant.name === name) {
          console.log('Incrementing count for:', plant);
          return { ...plant, count: (plant.count ?? 0) + 1 };
        }
        return plant;
      });
      console.log('Updated plant list after increment:', updatedList);
      return updatedList;
    });
  };
  
  const handleDecrement = (name: string) => {
    setPlantList((prevList) => {
      const updatedList = prevList.map((plant) => {
        if (plant.name === name) {
          const newCount = (plant.count ?? 1) - 1;
          console.log('Decrementing count for:', plant);
  
          if (newCount <= 0) {
            console.log('Setting plant for deletion:', plant);
            setPlantToDelete(plant);  // Store plant to potentially delete
            setConfirmDeleteOpen(true);  // Open confirmation dialog
            return plant;
          }
          return { ...plant, count: newCount };
        }
        return plant;
      });
      console.log('Updated plant list after decrement:', updatedList);
      return updatedList;
    });
  };
  

  // Remove plant if confirmed and update both plantList and originalPlantList
const handleConfirmDelete = () => {
  if (plantToDelete) {
    console.log('Confirming deletion of plant:', plantToDelete);

    setPlantList((prevList) => {
      const newList = prevList.filter((plant) => plant.name !== plantToDelete.name);
      onUpdatePlants(newList); // Update the parent component with the new plant list
      console.log('Updated plant list after deletion:', newList);
      return newList;
    });

    setOriginalPlantList((prevList) => prevList.filter((plant) => plant.name !== plantToDelete.name));
    setPlantToDelete(null);  // Clear the plant to delete state
    setConfirmDeleteOpen(false);  // Close the confirmation dialog
    handleSnackbar(`${plantToDelete.name} removed from the aquarium.`, 'success', true);
  }
};

  const handleCancelDelete = () => {
    setPlantToDelete(null);  // Reset plant to delete
    setConfirmDeleteOpen(false);  // Close confirmation dialog
  };

  const handleSaveChanges = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent cycling mode when saving
    setOriginalPlantList(plantList); // Save current state as the original
    handleSnackbar('Changes saved.', 'success', true);
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

  const handleAddPlant = (plants: Plant[]) => {
    console.log('Adding new plants:', plants);
  
    setPlantList((prevList) => {
      // Ensure that all new plants have a valid 'count' value
      const newPlantsWithCount = plants.map((plant) => ({
        ...plant,
        count: plant.count ?? 1,  // Default count to 1 if undefined
      }));
  
      // Optionally, check for duplicate plants by name before adding
      const updatedList = [...prevList];
  
      newPlantsWithCount.forEach((newPlant) => {
        const existingPlant = updatedList.find((plant) => plant.name === newPlant.name);
  
        if (existingPlant) {
          // If the plant exists, increment the count
          existingPlant.count += newPlant.count;
        } else {
          // If the plant doesn't exist, add it to the list
          updatedList.push(newPlant);
        }
      });
      handleSnackbar(`${plants.map((plant) => plant.name).join(', ')} added to the aquarium.`, 'success', true);
      console.log('Updated plant list after adding new plants:', updatedList);
      onUpdatePlants(updatedList); // Update the parent component with the new plant list

      return updatedList;
    });
    setAddPlantOpen(false);  // Close the dialog
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
    [DisplayMode.BACKGROUND]: 'Background Plants',
    [DisplayMode.MIDGROUND]: 'Midground Plants',
    [DisplayMode.FOREGROUND]: 'Foreground Plants',
    [DisplayMode.FLOATING]: 'Floating Plants',
    [DisplayMode.ROOTED]: 'Rooted Plants',
    [DisplayMode.CARPET]: 'Carpet Plants',
    [DisplayMode.OXYGENATOR]: 'Oxygenating Plants',
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
            <MenuItem onClick={() => setDisplayMode(DisplayMode.BACKGROUND)}>Background Plants</MenuItem>
            <MenuItem onClick={() => setDisplayMode(DisplayMode.MIDGROUND)}>Midground Plants</MenuItem>
            <MenuItem onClick={() => setDisplayMode(DisplayMode.FOREGROUND)}>Foreground Plants</MenuItem>
            <MenuItem onClick={() => setDisplayMode(DisplayMode.FLOATING)}>Floating Plants</MenuItem>
            <MenuItem onClick={() => setDisplayMode(DisplayMode.ROOTED)}>Rooted Plants</MenuItem>
            <MenuItem onClick={() => setDisplayMode(DisplayMode.CARPET)}>Carpet Plants</MenuItem>
            <MenuItem onClick={() => setDisplayMode(DisplayMode.OXYGENATOR)}>Oxygenating Plants</MenuItem>
          </Menu>
      </Card>

      {/* AquariumInhabitantInfoCard Modal */}
      <AquariumInhabitantInfoCard open={infoCardOpen} onClose={handleInfoCardClose} inhabitant={selectedPlant} />

      {/* Add Plant Modal */}
      <AddPlantCard open={addPlantOpen} onClose={handleCloseAddPlant} aquarium={aquarium} onAddPlant={handleAddPlant} handleSnackbar={handleSnackbar}/>

        {/* Confirm Delete Plant Dialog */}
        <Dialog
        open={confirmDeleteOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirm Fish Removal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove <strong>{plantToDelete?.name}</strong> from the aquarium?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
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
