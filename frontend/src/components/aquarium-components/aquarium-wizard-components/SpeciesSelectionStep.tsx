import React, { useEffect } from 'react';
import FishSelectionHelper from './FishSelectionHelper';
import { Box } from '@mui/material';

interface SpeciesSelectionStepProps {
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  aquariumData: { name: string; id: string; type: string; size: string;  species: { name: string; count: number }[]; equipment: string[] };
  setIsStepValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const SpeciesSelectionStep: React.FC<SpeciesSelectionStepProps> = ({
  setAquariumData,
  aquariumData,
  setIsStepValid,
}) => {
  useEffect(() => {
    // Always true
    setIsStepValid(aquariumData.species.length >= 0);

    // Log the selected fish
    console.log('Selected fish:', aquariumData.species);

    console.log("current data: ", aquariumData);

    setAquariumData((prevData: any) => ({ ...prevData, species: aquariumData.species }));
    
  }, [aquariumData.species, setIsStepValid]);

  return (
    <Box>
      {/* Pass aquariumType and tankSize to the FishSelectionHelper */}
      <FishSelectionHelper
        setAquariumData={setAquariumData}
        aquariumData={aquariumData}
        initialSelectedFish={aquariumData.species.map((s) => s.name)} // Extract fish names
      />
    </Box>
  );
};

export default SpeciesSelectionStep;
