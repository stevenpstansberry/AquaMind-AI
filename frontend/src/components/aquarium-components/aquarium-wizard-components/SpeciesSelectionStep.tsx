import React, { useEffect } from 'react';
import FishSelectionHelper from './FishSelectionHelper';
import { Box } from '@mui/material';

interface SpeciesSelectionStepProps {
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  aquariumData: { type: string; size: string; species: string[]; equipment: string[] };
  setIsStepValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const SpeciesSelectionStep: React.FC<SpeciesSelectionStepProps> = ({
  setAquariumData,
  aquariumData,
  setIsStepValid,
}) => {
  useEffect(() => {
    // Check if at least one species is selected to enable the "Next" button
    setIsStepValid(aquariumData.species.length > 0);

    // Log the selected fish
    console.log('Selected fish:', aquariumData.species);

    console.log("current data: ", aquariumData);

    setAquariumData((prevData: any) => ({ ...prevData, species: aquariumData.species }));
    
  }, [aquariumData.species, setIsStepValid]);

  return (
    <Box>
      {/* Pass aquariumType and tankSize to the FishSelectionHelper */}
      <FishSelectionHelper
        setAquariumData={setAquariumData} // Function to update aquarium data
        aquariumData={aquariumData} // Pass the aquarium data
        initialSelectedFish={aquariumData.species}  // Pass the previously selected fish
      />
    </Box>
  );
};

export default SpeciesSelectionStep;
