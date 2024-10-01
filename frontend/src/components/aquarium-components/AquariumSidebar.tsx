import React from 'react';
import { List, ListItem, Typography, Button, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { useThemeContext } from '../../util/ThemeContext';

interface Aquarium {
  id: number;
  name: string;
}

interface AquariumSidebarProps {
  aquariums: Aquarium[];
  onOpenWizard: () => void;
}

const AquariumSidebar: React.FC<AquariumSidebarProps> = ({ aquariums, onOpenWizard  }) => {
    const theme = useTheme(); 


  return (
    <Box
      sx={{
        width: '250px',
        height: '100vh',
        backgroundColor: theme.palette.background.default, 
        padding: '20px',
        position: 'fixed',
        top: 0,
        left: 0,
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderTop: `4px solid ${theme.palette.primary.main}`, 
        color: theme.palette.text.primary, 
      }}
    >
      <div>
        {/* Heading */}
        <Typography variant="h6" gutterBottom>
          Your Aquariums
        </Typography>

        {/* Check if there are any aquariums */}
        {aquariums.length > 0 ? (
          <List>
            {aquariums.map((aquarium) => (
              <ListItem
                key={aquarium.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingRight: 0,
                }}
              >
                <Typography>{aquarium.name}</Typography>
                {/* Edit Icon */}
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => console.log(`Editing aquarium with id: ${aquarium.id}`)}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>
            You have no aquariums. Get started by adding one!
          </Typography>
        )}
      </div>

      {/* Button to create a new aquarium */}
      <Button
        variant="contained"
        color="primary"
        onClick={onOpenWizard} // Trigger the wizard from the sidebar
        sx={{
          width: '100%',
          marginTop: 'auto',
        }}
      >
        + Add New Aquarium
      </Button>
    </Box>
  );
};

export default AquariumSidebar;
