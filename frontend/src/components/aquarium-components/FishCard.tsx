import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, Menu, MenuItem, Box, Button, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';  
import RemoveIcon from '@mui/icons-material/Remove';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; 
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';  
import FishInfoCard from './FishInfoCard';  
import AddFishCard from './AddFishCard';  // Import AddFishCard
import { Aquarium } from '../../interfaces/Aquarium';  // Assuming Aquarium interface is here

interface FishCardProps {
  aquarium: Aquarium; 
}

enum DisplayMode {
  ALL_FISH,
  SCHOOLING_FISH,
  SCAVENGERS,
  PREDATORS,
  PEACEFUL_COMMUNITY,
  BREEDERS,
}

const FishCard: React.FC<FishCardProps> = ({ aquarium }) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.ALL_FISH);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [fishList, setFishList] = useState(aquarium.species);  // Use species from the passed aquarium
  const [originalFishList, setOriginalFishList] = useState(aquarium.species);  // Track original state of fish list
  const [changesSaved, setChangesSaved] = useState(true);  // Track unsaved changes
  const [selectedFish, setSelectedFish] = useState<{ name: string; count: number; role: string; type: string } | null>(null);  // Selected fish for info modal
  const [infoCardOpen, setInfoCardOpen] = useState(false);  // Track modal open/close state
  const [addFishOpen, setAddFishOpen] = useState(false);  // Track AddFish modal open/close state

  // Update fish list when aquarium species changes
  useEffect(() => {
    setFishList(aquarium.species);
    setOriginalFishList(aquarium.species);
    setChangesSaved(true);  // Reset changes saved status when species updates
  }, [aquarium]);

  // Compare current fish list with the original to check for unsaved changes
  const checkChangesSaved = () => {
    const isSame = fishList.every((fish, idx) => fish.count === originalFishList[idx].count);
    setChangesSaved(isSame);
  };

  useEffect(() => {
    checkChangesSaved();
  }, [fishList]);

  const filteredSpecies = fishList.filter((fish) => {
    switch (displayMode) {
      case DisplayMode.ALL_FISH:
        return true;
      case DisplayMode.SCHOOLING_FISH:
        return fish.role === 'schooling';
      case DisplayMode.SCAVENGERS:
        return fish.role === 'scavenger';
      case DisplayMode.PREDATORS:
        return fish.role === 'predator';
      case DisplayMode.PEACEFUL_COMMUNITY:
        return fish.role === 'community';
      case DisplayMode.BREEDERS:
        return fish.role === 'breeder';
      default:
        return false;
    }
  });

  const cycleDisplayMode = () => {
    const validModes = Object.values(DisplayMode).filter((value) => typeof value === 'number');
    setDisplayMode((prevMode) => (prevMode + 1) % validModes.length);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleIncrement = (name: string) => {
    setFishList((prevList) =>
      prevList.map((fish) =>
        fish.name === name ? { ...fish, count: fish.count + 1 } : fish
      )
    );
  };

  const handleDecrement = (name: string) => {
    setFishList((prevList) =>
      prevList.map((fish) =>
        fish.name === name && fish.count > 0 ? { ...fish, count: fish.count - 1 } : fish
      )
    );
  };

  const handleSaveChanges = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOriginalFishList(fishList);  // Save current state as the original
    setChangesSaved(true);  // Mark changes as saved
  };

  const handleDiscardChanges = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setFishList(originalFishList);  // Revert to the original fish list
    setChangesSaved(true);
  };

  // Open Add New Fish Modal
  const handleAddNewFish = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent cycling the display mode
    setAddFishOpen(true);
  };

  // Add a new fish to the list
  const handleAddFish = (fish: { name: string; count: number; type: string; role: string }) => {
    setFishList((prevList) => [...prevList, fish]);  // Add the new fish to the list
    setAddFishOpen(false);  // Close the modal
  };

  const handleShowFishInfo = (fish: { name: string; count: number; role: string; type: string }) => {
    setSelectedFish(fish);  // Set selected fish to display in the modal
    setInfoCardOpen(true);  // Open the modal
  };

  const handleCloseFishInfo = () => {
    setInfoCardOpen(false);  // Close the modal
    setSelectedFish(null);  // Reset selected fish
  };

  const handleCloseAddFish = () => {
    setAddFishOpen(false);  // Close the AddFishCard modal
  };

  const displayModeText = {
    [DisplayMode.ALL_FISH]: 'All Fish',
    [DisplayMode.SCHOOLING_FISH]: 'Schooling Fish',
    [DisplayMode.SCAVENGERS]: 'Scavengers',
    [DisplayMode.PREDATORS]: 'Predators',
    [DisplayMode.PEACEFUL_COMMUNITY]: 'Peaceful Community Fish',
    [DisplayMode.BREEDERS]: 'Breeders',
  };

  return (
    <>
      <Card sx={cardStyle} onClick={cycleDisplayMode}>
        <CardContent>
          <Typography variant="h6">Fish</Typography>
          <Typography variant="body1">{displayModeText[displayMode]}</Typography>
        
          <Box sx={{ marginTop: 2 }}>
            {filteredSpecies.length > 0
              ? filteredSpecies.map((fish) => (
                  <Box key={fish.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1 }}>
                    
                    {/* Fish Name, Count and Info Button */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {fish.name} (x{fish.count})
                      </Typography>
                      
                      {/* Info Button placed directly next to the fish name and count */}
                      <Tooltip title="View Fish Info">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowFishInfo(fish);
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
                            handleDecrement(fish.name);
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
                            handleIncrement(fish.name);
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ))
              : <Typography variant="body2">No fish in this category.</Typography>
            }
          </Box>

          {/* Add New Fish Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              Add New Fish
            </Typography>

            <Tooltip title="Add New Fish">
              <IconButton
                color="primary"
                onClick={handleAddNewFish} // Add stopPropagation inside this handler
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
          <MenuItem onClick={() => setDisplayMode(DisplayMode.ALL_FISH)}>All Fish</MenuItem>
          <MenuItem onClick={() => setDisplayMode(DisplayMode.SCHOOLING_FISH)}>Schooling Fish</MenuItem>
          <MenuItem onClick={() => setDisplayMode(DisplayMode.SCAVENGERS)}>Scavengers</MenuItem>
          <MenuItem onClick={() => setDisplayMode(DisplayMode.PREDATORS)}>Predators</MenuItem>
          <MenuItem onClick={() => setDisplayMode(DisplayMode.PEACEFUL_COMMUNITY)}>Peaceful Community Fish</MenuItem>
          <MenuItem onClick={() => setDisplayMode(DisplayMode.BREEDERS)}>Breeders</MenuItem>
        </Menu>
      </Card>

      {/* Fish Info Modal */}
      <FishInfoCard open={infoCardOpen} onClose={handleCloseFishInfo} fish={selectedFish} />

      {/* Add Fish Modal */}
      <AddFishCard
        open={addFishOpen}
        onClose={handleCloseAddFish}
        aquarium={aquarium}  // Pass the entire aquarium object
        onAddFish={handleAddFish}  // Handle adding a fish to the list
      />
    </>
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

const iconStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  color: '#B0BEC5',
  fontSize: '20px',
};

export default FishCard;
