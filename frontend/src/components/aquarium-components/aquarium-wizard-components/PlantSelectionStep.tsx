import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';

interface PlantSelectionStepProps {
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  setIsStepValid: React.Dispatch<React.SetStateAction<boolean>>;
  aquariumData: { plants: { name: string; count: number }[]; type: string; size: string };
}

const plantOptions = [
  { name: 'Java Fern', description: 'Easy to grow, great for freshwater tanks.' },
  { name: 'Amazon Sword', description: 'Thrives in larger tanks, good for aquascaping.' },
  { name: 'Anubias', description: 'Slow-growing, hardy freshwater plant.' },
  { name: 'Hornwort', description: 'Fast-growing, provides excellent oxygenation.' },
  // Add more plants if necessary
];

const PlantSelectionStep: React.FC<PlantSelectionStepProps> = ({ setAquariumData, setIsStepValid, aquariumData }) => {
  const [selectedPlants, setSelectedPlants] = useState<{ name: string; count: number }[]>(aquariumData.plants || []);
  setIsStepValid(selectedPlants.length >= 0);
  useEffect(() => {
    // Update the aquariumData when selected plants change
    setAquariumData((prevData: any) => ({ ...prevData, plants: selectedPlants }));
  }, [selectedPlants, setAquariumData]);

  const handlePlantSelection = (plantName: string) => {
    const existingPlant = selectedPlants.find((plant) => plant.name === plantName);

    if (existingPlant) {
      setSelectedPlants((prevPlants) =>
        prevPlants.map((plant) =>
          plant.name === plantName ? { ...plant, count: plant.count + 1 } : plant
        )
      );
    } else {
      setSelectedPlants((prevPlants) => [...prevPlants, { name: plantName, count: 1 }]);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Plants (Optional)
      </Typography>

      <Grid container spacing={3}>
        {plantOptions.map((plant, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                border: selectedPlants.find((p) => p.name === plant.name) ? '2px solid #007bff' : '1px solid #ddd',
                bgcolor: selectedPlants.find((p) => p.name === plant.name) ? '#e3f2fd' : 'inherit',
                cursor: 'pointer',
              }}
              onClick={() => handlePlantSelection(plant.name)}
            >
              <CardActionArea>
                <CardContent>
                  <Typography variant="h6">{plant.name}</Typography>
                  <Typography variant="body2">{plant.description}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PlantSelectionStep;
