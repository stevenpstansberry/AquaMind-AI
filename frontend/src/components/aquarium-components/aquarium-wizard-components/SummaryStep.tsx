/**
 * @file SummaryStep.tsx
 * @location src/components/aquarium-components/aquarium-wizard-components/SummaryStep.tsx
 * @description This component renders the summary step in the aquarium setup wizard. It displays a summary of the aquarium's name, type, size, selected species, plants, and equipment. It also allows the user to update the aquarium name.
 * 
 * @author Steven Stansberry
 */

import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography } from '@mui/material';
import { Aquarium } from '../../../interfaces/Aquarium';


interface SummaryStepProps {
  aquariumData: Aquarium
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  setIsStepValid: (isValid: boolean) => void;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ aquariumData, setAquariumData, setIsStepValid }) => {
  const [aquariumName, setAquariumName] = useState(aquariumData.name);
  const [isNameEmpty, setIsNameEmpty] = useState(false);


  /**
   * Updates the aquarium name in the parent state whenever the local aquarium name state changes.
   * 
   * @returns {void}
   */
  useEffect(() => {
    setAquariumData((prevData: any) => ({ ...prevData, name: aquariumName }));
  }, [aquariumName, setAquariumData]);
  
  // Effect to check if the aquarium name is empty and update the state
  useEffect(() => {
    const isEmpty = aquariumName.trim() === '';
    setIsNameEmpty(isEmpty);
    setIsStepValid(!isEmpty); // Notify the parent about the validity
  }, [aquariumName, setIsStepValid]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setAquariumName(newName);
    setIsNameEmpty(newName.trim() === '');
  };

  return (
    <Box>
      <Typography variant="h5">Summary</Typography>

      {/* Input for Aquarium Name */}
      <TextField
        label="Aquarium Name"
        variant="outlined"
        fullWidth
        value={aquariumName}
        onChange={handleNameChange}
        error={isNameEmpty}
        helperText={isNameEmpty ? 'Aquarium name cannot be empty' : ''}
        sx={{ mb: 3 }}
      />


      <Typography variant="body1">
        <strong>Type:</strong> {aquariumData.type}
      </Typography>
      <Typography variant="body1">
        <strong>Size:</strong> {aquariumData.size} gallons
      </Typography>
    </Box>
  );
};

export default SummaryStep;
