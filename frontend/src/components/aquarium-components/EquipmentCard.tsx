import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, IconButton, Box, Tooltip, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, Button
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete Icon
import EquipmentInfoCard from './EquipmentInfoCard'; // Import the EquipmentInfoCard component
import AddEquipmentCard from './AddEquipmentCard';
import { Aquarium, Equipment } from '../../interfaces/Aquarium';

interface EquipmentCardProps {
  aquarium: Aquarium;
  onUpdateEquipment: (updatedEquipment : Equipment []) => void;
  handleSnackbar: (message: string, severity: 'success' | 'error' | 'warning' | 'info', open: boolean) => void;
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

const EquipmentCard: React.FC<EquipmentCardProps> = ({ aquarium, onUpdateEquipment, handleSnackbar }) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.ALL_EQUIPMENT);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for kebab menu
  const [equipmentList, setEquipmentList] = useState(aquarium.equipment || []); // State for equipment list
  const [selectedEquipment, setSelectedEquipment] = useState<any | null>(null); // State for selected equipment for the info card
  const [infoCardOpen, setInfoCardOpen] = useState(false); // State to open/close EquipmentInfoCard
  const [addEquipmentOpen, setAddEquipmentOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete confirmation dialog
  const [equipmentToDelete, setEquipmentToDelete] = useState<any | null>(null); // Track the equipment to be deleted

  // Update equipmentList when new equipment props are passed
  useEffect(() => {
    setEquipmentList(aquarium.equipment);
  }, [aquarium]);

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

  // Handle showing the EquipmentInfoCard
  const handleShowEquipmentInfo = (item: any) => {
    setSelectedEquipment(item); // Set the selected equipment
    setInfoCardOpen(true); // Open the EquipmentInfoCard
  };

  // Close the EquipmentInfoCard
  const handleCloseInfoCard = () => {
    setInfoCardOpen(false);
    setSelectedEquipment(null); // Clear selected equipment when closing
  };

  const handleAddNewEquipment = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent cycling mode when adding new equipment
    setEquipmentList(aquarium.equipment); 
    setAddEquipmentOpen(true);
  };

  const handleAddEquipment = (newEquipment: Equipment) => {
    const updatedEquipmentList = [...equipmentList, newEquipment];
    setEquipmentList(updatedEquipmentList);
    onUpdateEquipment(updatedEquipmentList);
    handleSnackbar(`${newEquipment.name} added successfully!`, 'success', true);
    setAddEquipmentOpen(false);
  };
  
  const handleCloseAddEquipment = () => {
    setAddEquipmentOpen(false);
  };


  // Handle opening delete confirmation dialog
  const handleOpenDeleteDialog = (equipment: any) => {
    setEquipmentToDelete(equipment); // Track the equipment to delete
    setDeleteDialogOpen(true); // Open confirmation dialog
  };

  // Handle closing delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setEquipmentToDelete(null); // Reset the tracked equipment
  };

// Handle deleting the selected equipment
const handleDeleteEquipment = () => {
  if (equipmentToDelete) {
    const updatedEquipmentList = equipmentList.filter(item => item !== equipmentToDelete);
    setEquipmentList(updatedEquipmentList);
    onUpdateEquipment(updatedEquipmentList);
    setDeleteDialogOpen(false);
    handleSnackbar(`${equipmentToDelete.name} deleted successfully!`, 'success', true);
    setEquipmentToDelete(null);
  }
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
    <>
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
                          handleShowEquipmentInfo(item); // Pass the clicked item to show in the info card
                        }}
                      >
                        <InfoOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {/* Delete Icon */}
                  <Tooltip title="Delete Equipment" disableInteractive>
                    <IconButton
                      size="small"
                      sx={deleteIconStyle} // Apply new styles here
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDeleteDialog(item); // Open delete confirmation dialog
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
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

      {/* Equipment Info Card */}
      <EquipmentInfoCard open={infoCardOpen} onClose={handleCloseInfoCard} equipment={selectedEquipment} />

      {/* Add Equipment Modal */}
      <AddEquipmentCard
        open={addEquipmentOpen}
        onClose={handleCloseAddEquipment}
        aquarium={aquarium}
        onAddEquipment={handleAddEquipment}
        handleSnackbar={handleSnackbar}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Delete {equipmentToDelete?.name}?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete {equipmentToDelete?.name}? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">Cancel</Button>
          <Button onClick={handleDeleteEquipment} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
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

// New delete icon style
const deleteIconStyle = {
  color: '#B0BEC5', // Light gray by default
  '&:hover': {
    color: '#ff5252', // Turn red when hovered over
  },
};

export default EquipmentCard;
