/**
 * @file AquariumSidebar.tsx
 * @author Steven Stansberry
 * @location /src/components/aquarium-components/AquariumSidebar.tsx
 * @description 
 * This component renders a sidebar that displays a list of aquariums. The sidebar also includes a button to trigger the aquarium creation wizard 
 * and allows users to edit existing aquariums through the edit icon next to each aquarium entry.
 */

import React from 'react';
import { List, ListItem, Typography, Button, Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import AquariumIcon from '../../assets/Icons/FishIcon';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { Aquarium } from '../../interfaces/Aquarium';

interface AquariumSidebarProps {
  aquariums: Aquarium[];
  onOpenWizard: () => void;
  setCurrentAquarium: (aquarium: Aquarium) => void;
  currentAquarium: Aquarium | null;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  onEditAquarium: (aquarium: Aquarium) => void;
}

const AquariumSidebar: React.FC<AquariumSidebarProps> = ({
  aquariums,
  onOpenWizard,
  setCurrentAquarium,
  currentAquarium,
  collapsed,
  setCollapsed,
  onEditAquarium,
}) => {
  const theme = useTheme();

  const navbarHeight = 64;
  
  return (
    <Box
      sx={{
        width: collapsed ? '60px' : '250px',
        height: `calc(100vh - ${navbarHeight}px)`,
        backgroundColor: theme.palette.background.default,
        position: 'fixed',
        top: `${navbarHeight}px`, 
        left: 0,
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        color: theme.palette.text.primary,
        transition: 'width 0.3s',
        overflow: 'hidden',
        zIndex: 5 
      }}
    >
      {/* Header Area */}
      <Box
        sx={{
          flexShrink: 0, // Prevent shrinking
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: '10px',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Tooltip title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'} placement="right">
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              justifyContent: 'center',
              transition: 'all 0.3s',
            }}
          >
            <MenuIcon
              sx={{
                color: '#438ED9',
                transition: 'transform 0.2s, color 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                  color: '#306bb3',
                },
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>

      {/* List Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          width: '100%',
          padding: '0 10px', // Apply horizontal padding
          display: 'flex',
          flexDirection: 'column',
          alignItems: collapsed ? 'center' : 'flex-start',
        }}
      >
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
                  backgroundColor:
                    currentAquarium?.id === aquarium.id ? theme.palette.action.selected : 'inherit',
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
                    flexGrow: 1,
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
                      flexGrow: 1,
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
                      e.stopPropagation();
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
            No Aquariums
          </Typography>
        )}
      </Box>

      {/* Footer Area */}
      <Box
        sx={{
          flexShrink: 0, // Prevent shrinking
          width: '100%',
          padding: '10px',
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <Tooltip title="Add a new aquarium" placement={collapsed ? 'right' : 'top'}>
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
                whiteSpace: 'nowrap',
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