import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, Box, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface EquipmentCardProps {
  equipment: { name: string; type: string }[]; // Equipment has both 'name' and 'type' fields
}

enum DisplayMode {
  ALL_EQUIPMENT,
  LIGHTING,
  HEATING,
  FILTRATION,
  OTHER,
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment }) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.ALL_EQUIPMENT);
  const [equipmentList, setEquipmentList] = useState(equipment);
  const [originalEquipmentList, setOriginalEquipmentList] = useState(equipment);

  // Update equipmentList and originalEquipmentList when new equipment props are passed
  useEffect(() => {
    setEquipmentList(equipment);
    setOriginalEquipmentList(equipment);
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
      case DisplayMode.OTHER:
        return !['lighting', 'heating', 'filtration'].includes(item.type);
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

  // Mapping of display modes to user-friendly text
  const displayModeText = {
    [DisplayMode.ALL_EQUIPMENT]: 'All Equipment',
    [DisplayMode.LIGHTING]: 'Lighting',
    [DisplayMode.HEATING]: 'Heating',
    [DisplayMode.FILTRATION]: 'Filtration',
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
              <Typography key={index} variant="body2">
                {item.name}
              </Typography>
            ))
          ) : (
            <Typography variant="body2">No equipment in this category.</Typography>
          )}
        </Box>
      </CardContent>

      <Tooltip title="Edit Equipment">
        <IconButton color="primary" sx={editIconStyle}>
          <EditIcon />
        </IconButton>
      </Tooltip>
    </Card>
  );
};

// Styles for the card and edit icon
const cardStyle = {
  height: '100%',
  position: 'relative',
  transition: 'transform 0.15s ease-in-out, boxShadow 0.15s ease-in-out',
  border: '1px solid #e0e0e0',
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
  borderRadius: '8px',
  backgroundColor: '#fafafa',
  userSelect: 'none',  // Prevent text selection on click
  outline: 'none',     // Remove focus outline on click
  '&:hover': {
    cursor: 'pointer',
    transform: 'scale(1.01)',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.12)',
  },
};

const editIconStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  color: '#B0BEC5',
  fontSize: '20px',
};

export default EquipmentCard;
