import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, Box, Tooltip, Menu, MenuItem } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // Import Info Icon

interface EquipmentCardProps {
  equipment: { name: string; type: string }[]; // Equipment has both 'name' and 'type' fields
}

enum DisplayMode {
  ALL_EQUIPMENT,
  LIGHTING,
  HEATING,
  FILTRATION,
  FEEDING,
  TEST_CHEMICALS,
  OTHER,
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment }) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.ALL_EQUIPMENT);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for kebab menu
  const [equipmentList, setEquipmentList] = useState(equipment);

  // Update equipmentList when new equipment props are passed
  useEffect(() => {
    setEquipmentList(equipment);
  }, [equipment]);

  // Filter the equipment based on the current display mode
  const filteredEquipment = equipmentList.filter((item) => {
    switch (displayMode) {
      case DisplayMode.LIGHTING:
        return item.type === 'lighting';
      case DisplayMode.HEATING:
        return item.type === 'heating';
      case DisplayMode.FILTRATION:
        return item.type === 'filtration';
      case DisplayMode.FEEDING:
        return item.type === 'feeding';
      case DisplayMode.TEST_CHEMICALS:
        return item.type === 'test_chemicals';
      case DisplayMode.OTHER:
        return !['lighting', 'heating', 'filtration', 'feeding', 'test_chemicals'].includes(item.type);
      case DisplayMode.ALL_EQUIPMENT:
      default:
        return true;
    }
  });

  // Cycle through display modes when clicking the card
  const cycleDisplayMode = () => {
    const validModes = Object.values(DisplayMode).filter((value) => typeof value === 'number');
    setDisplayMode((prevMode) => {
      const nextMode = (prevMode + 1) % validModes.length;
      return nextMode;
    });
  };

  // Handle opening the kebab menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent triggering card click
    setAnchorEl(event.currentTarget);
  };

  // Handle closing the kebab menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddNewEquipment = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent cycling mode when adding new equipment
    console.log('Add new equipment clicked');
  };

  const handleShowEquipmentInfo = (item: { name: string; type: string }) => {
    console.log('Equipment details:', item);
  };

  const displayModeText = {
    [DisplayMode.ALL_EQUIPMENT]: 'All Equipment',
    [DisplayMode.LIGHTING]: 'Lighting',
    [DisplayMode.HEATING]: 'Heating',
    [DisplayMode.FILTRATION]: 'Filtration',
    [DisplayMode.FEEDING]: 'Feeding',
    [DisplayMode.TEST_CHEMICALS]: 'Test Chemicals',
    [DisplayMode.OTHER]: 'Other Equipment',
  };

  return (
    <Card sx={cardStyle} onClick={cycleDisplayMode}>
      <CardContent>
        <Typography variant="h6">Equipment</Typography>
        <Typography variant="body1">{displayModeText[displayMode]}</Typography>

        <Box sx={{ marginTop: 2 }}>
          {filteredEquipment.length > 0 ? (
            filteredEquipment.map((item, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1 }}
              >
                {/* Equipment Name with Info Icon */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">{item.name}</Typography>
                  
                  {/* Info Icon */}
                  <Tooltip title="View Equipment Info">
                    <IconButton
                      size="small"
                      color="info"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowEquipmentInfo(item);
                      }}
                    >
                      <InfoOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2">No equipment in this category.</Typography>
          )}
        </Box>
      </CardContent>

      {/* Add New Equipment Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2, paddingLeft: '4px', paddingBottom: '16px' }}>
        <Typography variant="body2" sx={{ flexGrow: 1, paddingLeft: '12px' }}>
          Add New Equipment
        </Typography>

        <Tooltip title="Add New Equipment">
          <IconButton
            color="primary"
            onClick={handleAddNewEquipment}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Tooltip and More Options (Kebab) Menu */}
      <Tooltip title="More options">
        <IconButton color="primary" sx={iconStyle} onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
      </Tooltip>

      {/* Menu for More Options */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => setDisplayMode(DisplayMode.ALL_EQUIPMENT)}>All Equipment</MenuItem>
        <MenuItem onClick={() => setDisplayMode(DisplayMode.LIGHTING)}>Lighting</MenuItem>
        <MenuItem onClick={() => setDisplayMode(DisplayMode.HEATING)}>Heating</MenuItem>
        <MenuItem onClick={() => setDisplayMode(DisplayMode.FILTRATION)}>Filtration</MenuItem>
        <MenuItem onClick={() => setDisplayMode(DisplayMode.FEEDING)}>Feeding</MenuItem>
        <MenuItem onClick={() => setDisplayMode(DisplayMode.TEST_CHEMICALS)}>Test Chemicals</MenuItem>
        <MenuItem onClick={() => setDisplayMode(DisplayMode.OTHER)}>Other Equipment</MenuItem>
      </Menu>
    </Card>
  );
};

// Styles for the card and icons
const cardStyle = {
  height: '100%',
  position: 'relative',
  transition: 'transform 0.15s ease-in-out, boxShadow 0.15s ease-in-out',
  border: '1px solid #e0e0e0',
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
  borderRadius: '8px',
  backgroundColor: '#fafafa',
  userSelect: 'none',
  outline: 'none', // Remove focus outline on click
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

export default EquipmentCard;
