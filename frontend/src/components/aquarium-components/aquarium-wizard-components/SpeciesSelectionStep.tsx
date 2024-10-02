import React, { useState, useEffect } from 'react';
import FishSelectionHelper from './FishSelectionHelper';
import { Typography, Box } from '@mui/material';

interface SpeciesSelectionStepProps {
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  aquariumData: { type: string; size: string; species: string[] }; // Pass the aquarium data
  setIsStepValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const SpeciesSelectionStep: React.FC<SpeciesSelectionStepProps> = ({ setAquariumData, aquariumData, setIsStepValid }) => {
  const [selectedFish, setSelectedFish] = useState<string[]>([]); // Local state to store selected fish

  useEffect(() => {
    // Update the parent aquariumData with selected species
    setAquariumData((prevData: any) => ({ ...prevData, species: selectedFish }));

    // Check if at least one species is selected to enable the "Next" button
    if (selectedFish.length > 0) {
      setIsStepValid(true);
    } else {
      setIsStepValid(false);
    }

    // Log the selected fish
    console.log('Selected fish:', selectedFish);

  }, [selectedFish, setAquariumData, setIsStepValid]);

  return (
    <Box>
      {/* Pass aquariumType and tankSize to the FishSelectionHelper */}
      <FishSelectionHelper
        aquariumType={aquariumData.type} // Pass the type (Freshwater/Saltwater)
        tankSize={parseInt(aquariumData.size)} // Pass the tank size in gallons
        setSelectedFish={setSelectedFish} // Function to update selected fish
      />
    </Box>
  );
};

export default SpeciesSelectionStep;
