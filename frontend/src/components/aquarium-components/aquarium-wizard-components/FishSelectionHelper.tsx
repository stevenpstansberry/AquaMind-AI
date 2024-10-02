import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Grid, Button, Card, CardContent, CardActionArea } from '@mui/material';

interface Fish {
  name: string;
  type: string;
  minTankSize: number;
  description: string;
}

interface FishSelectionHelperProps {
  aquariumType: string;   // 'Freshwater' or 'Saltwater'
  tankSize: number;       // Tank size in gallons
  setSelectedFish: (fish: string[]) => void;  // Function to update the selected fish in parent component
}

const fishSpecies: Fish[] = [
  { name: 'Clownfish', type: 'Saltwater', minTankSize: 20, description: 'Colorful and hardy, ideal for reef tanks.' },
  { name: 'Tetra', type: 'Freshwater', minTankSize: 10, description: 'Small and active schooling fish.' },
  { name: 'Angelfish', type: 'Freshwater', minTankSize: 30, description: 'Beautiful but requires larger tanks.' },
  { name: 'Blue Tang', type: 'Saltwater', minTankSize: 50, description: 'Vibrant and active but needs plenty of swimming space.' },
  // Add more fish species as needed
];

const FishSelectionHelper: React.FC<FishSelectionHelperProps> = ({ aquariumType, tankSize, setSelectedFish }) => {
  const [searchTerm, setSearchTerm] = useState('');        
  const [availableFish, setAvailableFish] = useState<Fish[]>([]);  // Specify type as Fish[]
  const [selectedFish, setSelectedFishState] = useState<string[]>([]); 

  // Filter fish based on aquarium type and size
  useEffect(() => {
    const filteredFish = fishSpecies.filter(
      fish => fish.type === aquariumType && fish.minTankSize <= tankSize
    );
    setAvailableFish(filteredFish);
  }, [aquariumType, tankSize]);
  
  // Handle search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle fish selection
  const handleFishSelection = (fishName: string) => {
    let updatedSelection: string[]; // New selection state

    if (selectedFish.includes(fishName)) {
      updatedSelection = selectedFish.filter(fish => fish !== fishName);  // Deselect fish
    } else {
      updatedSelection = [...selectedFish, fishName];  // Select fish
    }

    setSelectedFishState(updatedSelection);  // Update local state
    setSelectedFish(updatedSelection);       // Update parent state with the new selection
  };

  // Apply search filter on fish list
  const filteredFish = availableFish.filter(fish => fish.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Fish Species
      </Typography>

      {/* Search Field */}
      <TextField
        label="Search Fish"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        sx={{ mb: 3 }}
      />

      {/* Fish List */}
      <Grid container spacing={3}>
        {filteredFish.length > 0 ? (
          filteredFish.map((fish, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  border: selectedFish.includes(fish.name) ? '2px solid #007bff' : '1px solid #ddd',
                  bgcolor: selectedFish.includes(fish.name) ? '#e3f2fd' : 'inherit',
                  cursor: 'pointer',
                  transition: 'border 0.3s, background-color 0.3s',
                }}
              >
                <CardActionArea onClick={() => handleFishSelection(fish.name)}>
                  <CardContent>
                    <Typography variant="h6">{fish.name}</Typography>
                    <Typography variant="body2">{fish.description}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Min Tank Size: {fish.minTankSize} gallons
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
            No fish species found. Please try a different search term.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default FishSelectionHelper;
