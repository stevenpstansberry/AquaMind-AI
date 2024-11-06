/**
 * @file SummaryStep.tsx
 * @location src/components/aquarium-components/aquarium-wizard-components/SummaryStep.tsx
 * @description This component renders the summary step in the aquarium setup wizard. It displays a summary of the aquarium's name, type, size, selected species, plants, and equipment. It also allows the user to update the aquarium name.
 */

import React, { useState, useEffect, useRef } from 'react';
import { TextField, Box, Typography } from '@mui/material';
import { Aquarium } from '../../../interfaces/Aquarium';

interface SummaryStepProps {
  aquariumData: Aquarium;
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  setIsStepValid: (isValid: boolean) => void;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ aquariumData, setAquariumData, setIsStepValid }) => {
  const [aquariumName, setAquariumName] = useState(aquariumData.name);
  const [isNameEmpty, setIsNameEmpty] = useState(aquariumName.trim() === ''); // Initial validation check
  const [hasEdited, setHasEdited] = useState(false); // Tracks if the user has interacted with the field
  const nameInputRef = useRef<HTMLInputElement>(null); // Reference to the TextField

  /**
   * Updates the aquarium name in the parent state whenever the local aquarium name state changes.
   */
  useEffect(() => {
    setAquariumData((prevData: any) => ({ ...prevData, name: aquariumName }));
  }, [aquariumName, setAquariumData]);

  // Focus the TextField when the component mounts
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
    // Immediately set initial step validation to false if the name is empty
    setIsStepValid(!isNameEmpty);
  }, [setIsStepValid, isNameEmpty]);

  // Effect to check if the aquarium name is empty and update the state
  useEffect(() => {
    const isEmpty = aquariumName.trim() === '';
    setIsNameEmpty(isEmpty);
    setIsStepValid(!isEmpty); // Notify the parent about the validity immediately
  }, [aquariumName, setIsStepValid]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setAquariumName(newName);
    setHasEdited(true); // Set to true after the user starts typing
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Summary
      </Typography>

      <TextField
        label="Aquarium Name"
        variant="outlined"
        fullWidth
        value={aquariumName}
        onChange={handleNameChange}
        error={isNameEmpty && hasEdited}
        helperText={isNameEmpty && hasEdited ? '' : ''}
        sx={{ mb: 3 }}
        inputRef={nameInputRef}
      />

      <Typography variant="body1">
        <strong>Type:</strong> {aquariumData.type}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Size:</strong> {aquariumData.size} gallons
      </Typography>

      {/* Friendly Message Box with Fixed Height */}
      <Box sx={{ height: '24px', mt: 2 }}>
        {isNameEmpty ? (
          <Box sx={{ height: '24px' }} /> // Empty placeholder
        ) : (
          <Typography variant="body2" color="textSecondary">
            Great choice! After finishing, you’ll be able to stock your aquarium with fish, plants, and more.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SummaryStep;
