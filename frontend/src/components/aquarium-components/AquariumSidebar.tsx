/**
 * @file AquariumSidebar.tsx
 * @author Steven Stansberry
 * @location /src/components/aquarium-components/AquariumSidebar.tsx
 * @description 
 * This component renders a sidebar that displays a list of aquariums. The sidebar also includes a button to trigger the aquarium creation wizard 
 * and allows users to edit existing aquariums through the edit icon next to each aquarium entry.
 */

import React, { useState } from 'react';
import { List, ListItem, Typography, Button, Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import AquariumIcon from '@mui/icons-material/AcUnit'; 
import { useTheme } from '@mui/material/styles';
import { Aquarium } from '../../interfaces/Aquarium';



// add collapse icon, have the state managed by the parent component, and in the parent component conditonally render the sidebar or the collapse icon.
//tt
//tt

interface AquariumSidebarProps {
  aquariums: Aquarium[];
  onOpenWizard: () => void;
  setCurrentAquarium: (aquarium: Aquarium) => void;
  currentAquarium: Aquarium | null;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const AquariumSidebar: React.FC<AquariumSidebarProps> = ({ aquariums, onOpenWizard, setCurrentAquarium, currentAquarium, collapsed, setCollapsed }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: collapsed ? '60px' : '250px',
        height: '100vh',
        backgroundColor: theme.palette.background.default,
        padding: '20px 10px',
        position: 'fixed',
        top: 0,
        left: 0,
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderTop: `4px solid ${theme.palette.primary.main}`,
        color: theme.palette.text.primary,
        transition: 'width 0.3s',
        overflowX: 'hidden',
      }}
    >
      <div>
        <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ mb: 2 }}>
          <MenuIcon />
        </IconButton>

        {!collapsed && (
          <Typography variant="h6" gutterBottom>
            Your Aquariums
          </Typography>
        )}

        {aquariums.length > 0 ? (
          <List>
            {aquariums.map((aquarium) => (
              <ListItem
                key={aquarium.id}
                sx={{
                  display: 'flex',
                  justifyContent: collapsed ? 'center' : 'space-between',
                  alignItems: 'center',
                  paddingRight: 0,
                  cursor: 'pointer',
                  backgroundColor: currentAquarium?.id === aquarium.id ? theme.palette.action.selected : 'inherit',
                  borderRadius: '4px',
                  padding: '8px',
                }}
                onClick={() => setCurrentAquarium(aquarium)}
              >
                <Tooltip title={aquarium.name} placement="right">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AquariumIcon fontSize="small" />
                    {!collapsed && (
                      <Typography noWrap sx={{ ml: 1 }}>{aquarium.name}</Typography>
                    )}
                  </Box>
                </Tooltip>
                {!collapsed && (
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => console.log(`Editing aquarium with id: ${aquarium.id}`)}
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
        ) : (
          !collapsed && (
            <Typography>
              You have no aquariums. Get started by adding one!
            </Typography>
          )
        )}
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={onOpenWizard}
        sx={{
          width: '100%',
          marginTop: 'auto',
          display: collapsed ? 'none' : 'block',
        }}
      >
        + Add New Aquarium
      </Button>
    </Box>
  );
};

export default AquariumSidebar;