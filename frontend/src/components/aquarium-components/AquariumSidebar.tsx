/**
 * @file AquariumSidebar.tsx
 * @author Steven Stansberry
 * @location /src/components/aquarium-components/AquariumSidebar.tsx
 * @description 
 * This component renders a sidebar that displays a list of aquariums. The sidebar also includes a button to trigger the aquarium creation wizard 
 * and allows users to edit existing aquariums through the edit icon next to each aquarium entry.
 */

import React from 'react';
import { List, ListItem, Typography, Button, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';

interface Aquarium {
  id: string;             
  name: string;
  type: string;
  size: string;
  species: string[];
  equipment: string[];
}


interface AquariumSidebarProps {
  aquariums: Aquarium[];
  onOpenWizard: () => void;
  setCurrentAquarium: (aquarium: Aquarium) => void;
  currentAquarium: Aquarium | null; // Track the currently selected aquarium
}

const AquariumSidebar: React.FC<AquariumSidebarProps> = ({ aquariums, onOpenWizard, setCurrentAquarium, currentAquarium }) => {
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
        <Typography variant="h6" gutterBottom>
          Your Aquariums
        </Typography>

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
                  cursor: 'pointer',
                  // Apply a different background color if this aquarium is selected
                  backgroundColor: currentAquarium?.id === aquarium.id ? theme.palette.action.selected : 'inherit',
                  borderRadius: '4px', // Add border-radius to look neat
                  padding: '8px',
                }}
                onClick={() => setCurrentAquarium(aquarium) } // Select aquarium on click
              >
                <Typography>{aquarium.name}</Typography>
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

      <Button
        variant="contained"
        color="primary"
        onClick={onOpenWizard}
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
