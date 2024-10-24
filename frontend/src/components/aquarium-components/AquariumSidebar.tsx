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
import AquariumIcon from '../../assets/Icons/FishIcon';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { Aquarium } from '../../interfaces/Aquarium';
import { ViewSidebar } from '@mui/icons-material';

interface AquariumSidebarProps {
  aquariums: Aquarium[];
  onOpenWizard: () => void;
  setCurrentAquarium: (aquarium: Aquarium) => void;
  currentAquarium: Aquarium | null;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  onEditAquarium: (aquarium: Aquarium) => void;
}

const AquariumSidebar: React.FC<AquariumSidebarProps> = ({ aquariums, onOpenWizard, setCurrentAquarium, currentAquarium, collapsed, setCollapsed, onEditAquarium }) => {
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
        overflow: 'hidden', // hides content when collapsed
      }}
    >
      <div>
        <IconButton onClick={() => setCollapsed(!collapsed)}>
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: collapsed ? 'center' : 'flex-start',
            overflow: 'hidden', // prevents stretching when collapsing
          }}
        >
        {collapsed ? (
          <Tooltip title="Expand Sidebar" placement='right'>
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <ViewSidebar 
              sx={{
                color: '#438ED9',
              }}
              />
            </IconButton>
          </Tooltip>
        ) : (
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              whiteSpace: 'nowrap',
              visibility: collapsed ? 'hidden' : 'visible',
              
            }}
          >
            Your Aquariums
          </Typography>
        )}

          {aquariums.length > 0 ? (
            <List sx={{ width: '100%' }}>
              {aquariums.map((aquarium) => (
                <ListItem
                  key={aquarium.id}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    backgroundColor: currentAquarium?.id === aquarium.id ? theme.palette.action.selected : 'inherit',
                    borderRadius: '4px',
                    padding: '8px',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                  onClick={() => setCurrentAquarium(aquarium)}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexShrink: 0,
                      flexGrow: 1, // ensures that the name and icon stick together
                    }}
                  >
                    <Tooltip title={aquarium.name} placement="right">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          flexShrink: 0,
                        }}
                        component="div"
                      >
                        <AquariumIcon fontSize="small" />
                      </Box>
                    </Tooltip>
                    <Typography
                      noWrap
                      sx={{
                        ml: 1,
                        display: collapsed ? 'none' : 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flexGrow: 1, // ensures that the typography takes available space without pushing the edit icon away
                      }}
                    >
                      {aquarium.name}
                    </Typography>
                  </Box>
                  {!collapsed && (
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent triggering the aquarium selection when editing
                        console.log(`Editing aquarium with id: ${aquarium.id}`);
                        onEditAquarium(aquarium);
                      }}
                      size="small"
                      sx={{
                        ml: 1,
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </ListItem>

              ))}
            </List>
          ) : (
            <Typography
              sx={{
                display: collapsed ? 'none' : 'block',
                whiteSpace: 'nowrap',
              }}
            >
            </Typography>
          )}
        </Box>
      </div>

      <Box
        sx={{
          width: '100%',
          mt: 'auto',
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <Tooltip title="Add a new aquarium" placement={collapsed ? "right" : "top"}>
          {collapsed ? (
            <IconButton color="primary" onClick={onOpenWizard}>
              <AddIcon />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={onOpenWizard}
              sx={{
                width: '100%',
                whiteSpace: 'nowrap', // prevent wrapping of button text
              }}
            >
              + Add New Aquarium
            </Button>
          )}
        </Tooltip>
      </Box>
    </Box>
  );
};


export default AquariumSidebar;