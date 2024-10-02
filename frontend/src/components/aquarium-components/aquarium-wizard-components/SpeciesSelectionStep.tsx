import React, { useState, useEffect } from 'react';
import FishSelectionHelper from './FishSelectionHelper'; 
import { Typography, Box } from '@mui/material';

interface SpeciesSelectionStepProps {
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  aquariumData: { type: string; size: string; species: string[] }; // Pass the aquarium data
}

const SpeciesSelectionStep: React.FC<SpeciesSelectionStepProps> = ({ setAquariumData, aquariumData }) => {
  const [selectedFish, setSelectedFish] = useState<string[]>([]); // Local state to store selected fish

  useEffect(() => {
    // Update the selected species in the parent state when selectedFish changes
    setAquariumData((prevData: any) => ({ ...prevData, species: selectedFish }));
  }, [selectedFish, setAquariumData]);

  return (
    <Box>
      {/* Pass aquariumType and tankSize to the FishSelectionHelper */}
      <FishSelectionHelper
        aquariumType={aquariumData.type} // Pass the type (Freshwater/Saltwater)
        tankSize={parseInt(aquariumData.size)} // Pass the tank size in gallons
        setSelectedFish={setSelectedFish} // Pass a function to update selected fish
      />
    </Box>
  );
};

export default SpeciesSelectionStep;
