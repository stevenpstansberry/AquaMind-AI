/**
 * @file SummaryStep.tsx
 * @location src/components/aquarium-components/aquarium-wizard-components/SummaryStep.tsx
 * @description This component renders the summary step in the aquarium setup wizard. It displays a summary of the aquarium's name, type, size, selected species, plants, and equipment. It also allows the user to update the aquarium name.
 * 
 * @author Steven Stansberry
 */

import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography } from '@mui/material';

interface SummaryStepProps {
  aquariumData: { 
    name: string; 
    id: string; 
    type: string; 
    size: string;  
    species: { name: string; count: number }[]; 
    plants: { name: string; count: number }[]; 
    equipment: { name: string; details: any }[];  // Equipment is an array of objects
  };
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ aquariumData, setAquariumData }) => {
  const [aquariumName, setAquariumName] = useState(aquariumData.name);

  /**
   * Updates the aquarium name in the parent state whenever the local aquarium name state changes.
   * 
   * @returns {void}
   */
  useEffect(() => {
    setAquariumData((prevData: any) => ({ ...prevData, name: aquariumName }));
  }, [aquariumName, setAquariumData]);

  return (
    <Box>
      <Typography variant="h5">Summary</Typography>

      {/* Input for Aquarium Name */}
      <TextField
        label="Aquarium Name"
        variant="outlined"
        fullWidth
        value={aquariumName}
        onChange={(e) => setAquariumName(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Typography variant="body1">
        <strong>Type:</strong> {aquariumData.type}
      </Typography>
      <Typography variant="body1">
        <strong>Size:</strong> {aquariumData.size} gallons
      </Typography>
      
      {/* Display the species with their count */}
      <Typography variant="body1">
        <strong>Species:</strong>{' '}
        {aquariumData.species.length > 0 ? (
          aquariumData.species.map((s) => `${s.name} (x${s.count})`).join(', ')
        ) : (
          'None selected'
        )}
      </Typography>

      {/* Display the plants with their count */}
      <Typography variant="body1">
        <strong>Plants:</strong>{' '}
        {aquariumData.plants && aquariumData.plants.length > 0 ? (
          aquariumData.plants.map((p) => `${p.name} (x${p.count})`).join(', ')
        ) : (
          'None selected'
        )}
      </Typography>

      {/* Display the equipment */}
      <Typography variant="body1">
        <strong>Equipment:</strong>{' '}
        {aquariumData.equipment.length > 0 ? (
          aquariumData.equipment.map((eq) => {
            const detailEntries = Object.entries(eq.details)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ');  // Join all details as a string
            return `${eq.name}${detailEntries ? ` (${detailEntries})` : ''}`;
          }).join(', ')
        ) : (
          'None selected'
        )}
      </Typography>
    </Box>
  );
};

export default SummaryStep;
