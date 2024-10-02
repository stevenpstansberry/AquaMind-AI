import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';

interface Fish {
  name: string;
  type: string;
  minTankSize: number;
  description: string;
}

interface FishSelectionHelperProps {
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  aquariumData: { type: string; size: string; species: string[]; equipment: string[] };
  initialSelectedFish: string[];  // Added prop to receive initially selected fish
}

const fishSpecies: Fish[] = [
  { name: 'Clownfish', type: 'Saltwater', minTankSize: 20, description: 'Colorful and hardy, ideal for reef tanks.' },
  { name: 'Tetra', type: 'Freshwater', minTankSize: 10, description: 'Small and active schooling fish.' },
  { name: 'Angelfish', type: 'Freshwater', minTankSize: 30, description: 'Beautiful but requires larger tanks.' },
  { name: 'Blue Tang', type: 'Saltwater', minTankSize: 50, description: 'Vibrant and active but needs plenty of swimming space.' },
  // Add more fish species as needed
];

const FishSelectionHelper: React.FC<FishSelectionHelperProps> = ({
  setAquariumData,
  aquariumData,
  initialSelectedFish,
}) => {
  const [searchTerm, setSearchTerm] = useState('');        
  const [availableFish, setAvailableFish] = useState<Fish[]>([]);  
  const [selectedFish, setSelectedFish] = useState<string[]>(initialSelectedFish || []); // Initialize from parent

  useEffect(() => {
    setSelectedFish(initialSelectedFish || []); // Reset to initialSelectedFish if passed from parent
  }, [initialSelectedFish]);

  useEffect(() => {
    // Filter fish based on aquarium type and tank size
    const filteredFish = fishSpecies.filter(
      fish => fish.type === aquariumData.type && fish.minTankSize <= Number(aquariumData.size)
    );
    setAvailableFish(filteredFish);
  }, [aquariumData.type, aquariumData.size]);

  // Handle fish selection and update aquariumData.species directly
  const handleFishSelection = (fishName: string) => {
    let updatedSelection: string[]; 

    if (selectedFish.includes(fishName)) {
      updatedSelection = selectedFish.filter(fish => fish !== fishName);  // Deselect fish
    } else {
      updatedSelection = [...selectedFish, fishName];  // Select fish
    }

    setSelectedFish(updatedSelection);  // Update local state
    setAquariumData((prevData: any) => ({
      ...prevData,
      species: updatedSelection, // Update aquariumData with the new selected species
    }));

    console.log("new data: ", aquariumData);
  };

  // Handle search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Apply search filter on fish list
  const filteredFish = availableFish.filter(fish =>
    fish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
