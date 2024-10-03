import React, { useState, useEffect } from 'react';
import { Typography, Grid, Box, TextField, Checkbox, FormControlLabel, Collapse } from '@mui/material';

interface EquipmentStepProps {
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  aquariumData: {
    name: string;
    id: string;
    type: string;
    size: string;
    species: { name: string; count: number }[];
    equipment: { name: string; details: any }[];
  };
  setIsStepValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const equipmentCategories = [
  {
    category: 'Filtration Equipment',
    items: [
      { name: 'Filter', fields: ['Brand', 'Model Name', 'Flow Rate', 'Type'] },
      { name: 'Protein Skimmer', fields: ['Brand', 'Model Name', 'Capacity'] },
      { name: 'UV Sterilizer', fields: ['Brand', 'Model Name', 'Wattage'] },
      { name: 'Wave Maker', fields: ['Brand', 'Model Name', 'Flow Rate'] }
    ],
  },
  {
    category: 'Heating & Lighting',
    items: [
      { name: 'Heater', fields: ['Brand', 'Model Name', 'Wattage', 'Temperature Range'] },
      { name: 'Light', fields: ['Brand', 'Model Name', 'Wattage', 'Spectrum Type'] },
      { name: 'Thermometer', fields: ['Brand', 'Model Name', 'Accuracy'] }
    ],
  },
  {
    category: 'Aeration',
    items: [
      { name: 'Air Pump', fields: ['Brand', 'Model Name', 'Flow Rate'] },
      { name: 'CO2 System', fields: ['Brand', 'Model Name', 'Flow Rate'] }
    ],
  },
  {
    category: 'Feeding',
    items: [
      { name: 'Food', fields: ['Brand', 'Type of Food', 'Species-Specific', 'Quantity per Feeding', 'Feeding Frequency'] }
    ],
  },
  {
    category: 'Chemicals',
    items: [
      { name: 'Water Conditioner', fields: ['Brand', 'Type of Chemical', 'Dosage', 'Frequency of Use', 'Purpose'] },
      { name: 'Fertilizer', fields: ['Brand', 'Dosage', 'Frequency of Use', 'Purpose'] }
    ],
  },
  {
    category: 'Maintenance',
    items: [
      { name: 'Filter Replacement', fields: ['Brand', 'Model', 'Replacement Schedule'] },
      { name: 'Water Change Tools', fields: ['Tool Type', 'Frequency of Water Change'] },
      { name: 'Test Kits', fields: ['Brand', 'Type of Test (pH, Ammonia, etc.)', 'Frequency of Use'] }
    ],
  },
];

const EquipmentStep: React.FC<EquipmentStepProps> = ({
  aquariumData,
  setAquariumData,
  setIsStepValid,
}) => {
  const [selectedEquipment, setSelectedEquipment] = useState<{ name: string; details: any }[]>(
    aquariumData.equipment || []
  );

  // Function to toggle equipment selection
  const handleEquipmentToggle = (equipmentName: string) => {
    if (selectedEquipment.some(e => e.name === equipmentName)) {
      // Remove equipment if already selected
      setSelectedEquipment(prev =>
        prev.filter(item => item.name !== equipmentName)
      );
    } else {
      // Add new equipment with empty details
      setSelectedEquipment(prev => [...prev, { name: equipmentName, details: {} }]);
    }
  };

  // Handle updating specific equipment details
  const handleDetailChange = (equipmentName: string, field: string, value: string) => {
    setSelectedEquipment(prev =>
      prev.map(e => e.name === equipmentName ? { ...e, details: { ...e.details, [field]: value } } : e)
    );
  };

  useEffect(() => {
    // Update aquariumData with selected equipment and details
    setAquariumData((prevData: any) => ({ ...prevData, equipment: selectedEquipment }));

    // Validate the step: at least one equipment should be selected
    setIsStepValid(selectedEquipment.length > 0);
  }, [selectedEquipment, setAquariumData, setIsStepValid]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Equipment and Add Details (Optional)
      </Typography>

      <Grid container spacing={2}>
        {equipmentCategories.map((category, catIndex) => (
          <Grid item xs={12} key={catIndex}>
            <Typography variant="h6">{category.category}</Typography>

            {/* Iterate through the equipment items in each category */}
            {category.items.map((equipment, index) => {
              const isSelected = selectedEquipment.some(e => e.name === equipment.name);
              const equipmentDetails = selectedEquipment.find(e => e.name === equipment.name)?.details || {};

              return (
                <Grid item xs={12} key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleEquipmentToggle(equipment.name)}
                        color="primary"
                      />
                    }
                    label={equipment.name}
                  />

                  {/* Optional fields for equipment details */}
                  <Collapse in={isSelected} timeout="auto" unmountOnExit>
                    <Grid container spacing={2} sx={{ pl: 4, mt: 1 }}>
                      {equipment.fields.map(field => (
                        <Grid item xs={12} sm={6} md={4} key={field}>
                          <TextField
                            label={field}
                            fullWidth
                            value={equipmentDetails[field] || ''}
                            onChange={(e) =>
                              handleDetailChange(equipment.name, field, e.target.value)
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Collapse>
                </Grid>
              );
            })}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EquipmentStep;
