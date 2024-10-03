import React, { useEffect } from 'react';
import PlantSelectionHelper from './PlantSelectionHelper'; // Use PlantSelectionHelper
import { Box } from '@mui/material';

interface PlantSelectionStepProps {
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  setIsStepValid: React.Dispatch<React.SetStateAction<boolean>>;
  aquariumData: { plants: { name: string; count: number }[]; type: string; size: string };
}

const PlantSelectionStep: React.FC<PlantSelectionStepProps> = ({
  setAquariumData,
  setIsStepValid,
  aquariumData,
}) => {
  useEffect(() => {
    // Check if the step is valid (optional step, so always valid)
    setIsStepValid(true);

    console.log('Selected plants:', aquariumData.plants);
  }, [aquariumData.plants, setIsStepValid]);

  return (
    <Box>
      <PlantSelectionHelper
        setAquariumData={setAquariumData} // Pass data update function
        aquariumData={aquariumData} // Pass current aquarium data
        initialSelectedPlants={aquariumData.plants.map((p) => p.name)} // Pass initial selected plants
      />
    </Box>
  );
};

export default PlantSelectionStep;
