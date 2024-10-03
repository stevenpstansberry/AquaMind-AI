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

/**
 * Interface representing an aquarium object.
 */
interface Aquarium {
  id: number;
  name: string;
}

/**
 * Props for the AquariumSidebar component.
 */
interface AquariumSidebarProps {
  aquariums: Aquarium[];
  onOpenWizard: () => void;
  setCurrentAquarium: (aquarium: Aquarium) => void;  // Function to set the current aquarium
}

/**
 * AquariumSidebar component renders a sidebar that displays the user's aquariums and provides 
 * an option to add a new aquarium. Each aquarium can be edited by clicking the edit icon.
 */
const AquariumSidebar: React.FC<AquariumSidebarProps> = ({ aquariums, onOpenWizard, setCurrentAquarium }) => {
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
                  cursor: 'pointer',
                }}
                onClick={() => setCurrentAquarium(aquarium)}  // Set the selected aquarium
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
