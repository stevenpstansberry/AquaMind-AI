import React, { useState } from 'react';
import {  Typography, Grid, Box, Card, CardContent } from '@mui/material';

interface EquipmentStepProps { 
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
}

const equipmentOptions = [
  { name: 'Filter', description: 'Necessary for water purification.' },
  { name: 'Heater', description: 'Maintains stable water temperature.' },
  { name: 'Light', description: 'For plant growth and to display the tank.' },
  { name: 'Air Pump', description: 'Increases oxygen levels in the water.' },
  { name: 'Protein Skimmer', description: 'Removes organic compounds, ideal for saltwater tanks.' },
  { name: 'CO2 System', description: 'For planted tanks to provide carbon dioxide.' },
  { name: 'UV Sterilizer', description: 'Controls bacteria and parasites in the tank.' },
  { name: 'Wave Maker', description: 'Creates currents, ideal for saltwater tanks.' },
  { name: 'Thermometer', description: 'Monitors water temperature.' },
  { name: 'Aquarium Stand', description: 'Supports your aquarium with stability.' },
];

const EquipmentStep: React.FC<EquipmentStepProps> = ({ setAquariumData }) => {
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  const handleEquipmentSelection = (equipment: string) => {
    if (selectedEquipment.includes(equipment)) {
      setSelectedEquipment(prev => prev.filter(item => item !== equipment)); // Deselect if already selected
    } else {
      setSelectedEquipment(prev => [...prev, equipment]); // Add new equipment
    }

    // Update parent component's state
    setAquariumData((prevData: any) => ({ ...prevData, equipment: [...selectedEquipment, equipment] }));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Equipment
      </Typography>

      <Grid container spacing={3}>
        {equipmentOptions.map((equipment, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                border: selectedEquipment.includes(equipment.name) ? '2px solid #007bff' : '1px solid #ddd',
                cursor: 'pointer',
              }}
              onClick={() => handleEquipmentSelection(equipment.name)}
            >
              <CardContent>
                <Typography variant="h6">{equipment.name}</Typography>
                <Typography variant="body2">{equipment.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EquipmentStep;
