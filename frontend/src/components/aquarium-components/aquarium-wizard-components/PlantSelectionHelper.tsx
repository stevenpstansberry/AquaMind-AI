import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';

interface Plant {
  name: string;
  description: string;
}

interface PlantSelectionHelperProps {
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  aquariumData: { plants: { name: string; count: number }[]; type: string; size: string };
  initialSelectedPlants: string[]; // Array of plant names
}

const plantOptions: Plant[] = [
  { name: 'Java Fern', description: 'Easy to grow, great for freshwater tanks.' },
  { name: 'Amazon Sword', description: 'Thrives in larger tanks, good for aquascaping.' },
  { name: 'Anubias', description: 'Slow-growing, hardy freshwater plant.' },
  { name: 'Hornwort', description: 'Fast-growing, provides excellent oxygenation.' },
  // Add more plant options here if necessary
];

const PlantSelectionHelper: React.FC<PlantSelectionHelperProps> = ({
  setAquariumData,
  aquariumData,
  initialSelectedPlants,
}) => {
  const [searchTerm, setSearchTerm] = useState('');        
  const [availablePlants, setAvailablePlants] = useState<Plant[]>([]);  
  const [selectedPlants, setSelectedPlants] = useState<string[]>(initialSelectedPlants || []);

  useEffect(() => {
    setSelectedPlants(initialSelectedPlants || []); // Initialize with selected plants if provided
  }, [initialSelectedPlants]);

  useEffect(() => {
    // Here you could filter plants by the aquarium type, but for simplicity we'll show all plants
    setAvailablePlants(plantOptions);
  }, []);

  // Handle plant selection and update aquariumData.plants directly
  const handlePlantSelection = (plantName: string) => {
    const plantIndex = aquariumData.plants.findIndex((p: { name: string }) => p.name === plantName);

    // Update aquariumData with selected plant and count
    setAquariumData((prevData: any) => {
      const updatedPlants = [...prevData.plants];

      if (plantIndex !== -1) {
        // Increment the count if plant already exists
        updatedPlants[plantIndex].count += 1;
      } else {
        // Add new plant with count 1
        updatedPlants.push({ name: plantName, count: 1 });
      }

      return { ...prevData, plants: updatedPlants };
    });

    // Update local selected plants state for highlighting
    if (!selectedPlants.includes(plantName)) {
      setSelectedPlants((prev) => [...prev, plantName]);
    }
  };

  // Handle search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Apply search filter on plant list
  const filteredPlants = availablePlants.filter(plant =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Plants (Optional)
      </Typography>

      {/* Search Field */}
      <TextField
        label="Search Plants"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        sx={{ mb: 3 }}
      />

      {/* Plant List */}
      <Grid container spacing={3}>
        {filteredPlants.length > 0 ? (
          filteredPlants.map((plant, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  border: selectedPlants.includes(plant.name) ? '2px solid #007bff' : '1px solid #ddd',
                  bgcolor: selectedPlants.includes(plant.name) ? '#e3f2fd' : 'inherit',
                  cursor: 'pointer',
                  transition: 'border 0.3s, background-color 0.3s',
                }}
              >
                <CardActionArea onClick={() => handlePlantSelection(plant.name)}>
                  <CardContent>
                    <Typography variant="h6">{plant.name}</Typography>
                    <Typography variant="body2">{plant.description}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
            No plant species found. Please try a different search term.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default PlantSelectionHelper;
