import React, { useEffect, useState } from 'react';
import { List, ListItem, Typography, Button, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface Aquarium {
  id: number;
  name: string;
}

const AquariumSidebar: React.FC = () => {
  // State to store aquarium data
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);

  useEffect(() => {
    const mockAquariums = [
      { id: 1, name: 'Freshwater Tank' },
      { id: 2, name: 'Saltwater Reef' },
      { id: 3, name: 'Planted Tank' },
    ];
    setAquariums(mockAquariums);
  }, []);

  // Handler for adding a new aquarium
  const handleAddAquarium = () => {
    console.log('Navigate to aquarium creation page');
  };

  // Handler for editing an aquarium
  const handleEditAquarium = (id: number) => {
    console.log(`Editing aquarium with id: ${id}`);
    // Logic to edit the aquarium, e.g., open a modal or navigate to edit page
  };

  return (
    <Box
      sx={{
        width: '250px',
        height: '100vh',
        backgroundColor: '#f0f0f0', // Slightly different background color
        padding: '20px',
        position: 'fixed',
        top: 0,
        left: 0,
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderTop: '4px solid #007bff', // Add top border
      }}
    >
      <div>
        {/* Heading */}
        <Typography variant="h6" gutterBottom>
          Your Aquariums
        </Typography>

        {/* Aquarium List */}
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
                  onClick={() => handleEditAquarium(aquarium.id)}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No aquariums yet. Click the button below to add one!</Typography>
        )}
      </div>

      {/* Button to create a new aquarium */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddAquarium}
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
