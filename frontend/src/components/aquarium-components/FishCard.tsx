import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';  // Vertical kebab icon for menu

interface FishCardProps {
  species: { name: string; count: number; role: string }[]; // Add "role" to categorize fish
}

enum DisplayMode {
  SCHOOLING_FISH,
  SCAVENGERS,
  PREDATORS,
  PEACEFUL_COMMUNITY,
  BREEDERS,
}

const FishCard: React.FC<FishCardProps> = ({ species }) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.SCHOOLING_FISH);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Handle filtering species based on the current display mode
  const filteredSpecies = species.filter((fish) => {
    switch (displayMode) {
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
        return true;
    }
  });

  // Function to cycle through display modes
  const cycleDisplayMode = () => {
    setDisplayMode((prevMode) => {
      const nextMode = (prevMode + 1) % Object.keys(DisplayMode).length;
      return nextMode;
    });
  };

  // Handle menu opening and closing
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();  // Prevent triggering the card's click handler
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Mapping of display modes to user-friendly text
  const displayModeText = {
    [DisplayMode.SCHOOLING_FISH]: 'Schooling Fish',
    [DisplayMode.SCAVENGERS]: 'Scavengers',
    [DisplayMode.PREDATORS]: 'Predators',
    [DisplayMode.PEACEFUL_COMMUNITY]: 'Peaceful Community Fish',
    [DisplayMode.BREEDERS]: 'Breeders',
  };

  return (
    <Card
      sx={cardStyle}
      onClick={cycleDisplayMode}  // Cycle view on card click
    >
      <CardContent>
        <Typography variant="h6">Fish</Typography>
        <Typography variant="body1">{displayModeText[displayMode]}</Typography>
        <Typography variant="body2">
          {filteredSpecies.length > 0
            ? filteredSpecies.map((fish) => (
                <span key={fish.name}>
                  {fish.name} (x{fish.count})
                </span>
              ))
            : 'No fish in this category.'}
        </Typography>
      </CardContent>

      {/* Vertical Kebab Icon for opening the menu */}
      <IconButton
        color="primary"
        sx={iconStyle}
        onClick={handleMenuOpen}  // Open the menu
      >
        <MoreVertIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => setDisplayMode(DisplayMode.SCHOOLING_FISH)}>Schooling Fish</MenuItem>
        <MenuItem onClick={() => setDisplayMode(DisplayMode.SCAVENGERS)}>Scavengers</MenuItem>
        <MenuItem onClick={() => setDisplayMode(DisplayMode.PREDATORS)}>Predators</MenuItem>
        <MenuItem onClick={() => setDisplayMode(DisplayMode.PEACEFUL_COMMUNITY)}>Peaceful Community Fish</MenuItem>
        <MenuItem onClick={() => setDisplayMode(DisplayMode.BREEDERS)}>Breeders</MenuItem>
      </Menu>
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
  '&:hover': {
    cursor: 'pointer',  // Add hover effect for the card
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
