import React, { useState, useEffect } from 'react';
import { Typography, Grid, Box, TextField, Checkbox, FormControlLabel, Collapse, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { ExpandMore, Add as AddIcon } from '@mui/icons-material';

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

// Separate essential and non-essential categories
const essentialEquipment = [
  {
    category: 'Essential Filtration & Heating',
    items: [
      { name: 'Filter', fields: ['Brand', 'Model Name', 'Flow Rate', 'Type'] },
      { name: 'Heater', fields: ['Brand', 'Model Name', 'Wattage', 'Temperature Range'] },
      { name: 'Light', fields: ['Brand', 'Model Name', 'Wattage', 'Spectrum Type'] },
    ],
  },
];

const nonEssentialEquipment = [
  {
    category: 'Other Filtration Equipment',
    items: [
      { name: 'Protein Skimmer', fields: ['Brand', 'Model Name', 'Capacity'] },
      { name: 'UV Sterilizer', fields: ['Brand', 'Model Name', 'Wattage'] },
      { name: 'Wave Maker', fields: ['Brand', 'Model Name', 'Flow Rate'] }
    ],
  },
  {
    category: 'Aeration & Feeding',
    items: [
      { name: 'Air Pump', fields: ['Brand', 'Model Name', 'Flow Rate'] },
      { name: 'CO2 System', fields: ['Brand', 'Model Name', 'Flow Rate'] },
      { name: 'Food', fields: ['Brand', 'Type of Food', 'Species-Specific', 'Quantity per Feeding', 'Feeding Frequency'] }
    ],
  },
  {
    category: 'Chemicals & Maintenance',
    items: [
      { name: 'Water Conditioner', fields: ['Brand', 'Type of Chemical', 'Dosage', 'Frequency of Use', 'Purpose'] },
      { name: 'Filter Replacement', fields: ['Brand', 'Model', 'Replacement Schedule'] },
      { name: 'Test Kits', fields: ['Brand', 'Type of Test (pH, Ammonia, etc.)', 'Frequency of Use'] },
    ],
  },
];

const EquipmentStep: React.FC<EquipmentStepProps> = ({
  aquariumData,
  setAquariumData,
  setIsStepValid,
}) => {
  const [selectedEquipment, setSelectedEquipment] = useState<{ name: string; details: any }[]>(aquariumData.equipment || []);
  
  // Essential categories expanded by default
  const [expandedEssentialCategories, setExpandedEssentialCategories] = useState<boolean[]>(Array(essentialEquipment.length).fill(true));
  const [expandedNonEssentialCategories, setExpandedNonEssentialCategories] = useState<boolean[]>(Array(nonEssentialEquipment.length).fill(false));
  
  const [customEquipmentName, setCustomEquipmentName] = useState<{ [key: number]: string }>({});

  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<number | null>(null);
  const [customFields, setCustomFields] = useState<string[]>([]); // Stores the fields for the custom equipment

  // Function to toggle equipment selection
  const handleEquipmentToggle = (equipmentName: string) => {
    if (selectedEquipment.some(e => e.name === equipmentName)) {
      setSelectedEquipment(prev => prev.filter(item => item.name !== equipmentName));
    } else {
      setSelectedEquipment(prev => [...prev, { name: equipmentName, details: {} }]);
    }
  };

  // Handle updating specific equipment details
  const handleDetailChange = (equipmentName: string, field: string, value: string) => {
    setSelectedEquipment(prev =>
      prev.map(e => (e.name === equipmentName ? { ...e, details: { ...e.details, [field]: value } } : e))
    );
  };

  // Toggle collapse for essential categories
  const handleEssentialCategoryToggle = (index: number) => {
    setExpandedEssentialCategories(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  // Toggle collapse for non-essential categories
  const handleNonEssentialCategoryToggle = (index: number) => {
    setExpandedNonEssentialCategories(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  useEffect(() => {
    // Update aquariumData with selected equipment and details
    setAquariumData((prevData: any) => ({ ...prevData, equipment: selectedEquipment }));

    // Validate the step: at least one equipment should be selected
    setIsStepValid(selectedEquipment.length > 0);
  }, [selectedEquipment, setAquariumData, setIsStepValid]);

  const renderEquipmentCategory = (categories: any[], expandedCategories: boolean[], handleToggle: (index: number) => void, essential: boolean) => (
    <Grid container spacing={2}>
      {categories.map((category, catIndex) => (
        <Grid item xs={12} key={catIndex}>
          {/* Clickable header to toggle category collapse */}
          <Box
            display="flex"
            alignItems="center"
            onClick={() => handleToggle(catIndex)}
            sx={{ cursor: 'pointer', backgroundColor: essential ? '#e0f7fa' : 'inherit', padding: '10px', borderRadius: '8px' }} // Highlight essential items
          >
            <IconButton
              sx={{
                transform: expandedCategories[catIndex] ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            >
              <ExpandMore />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 1 }}>
              {category.category}
            </Typography>
          </Box>

          {/* Collapse category content */}
          <Collapse in={expandedCategories[catIndex]} timeout="auto" unmountOnExit>
            {category.items.map((equipment: any, index: number) => {
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
                    label={<Typography sx={{ fontWeight: essential ? 'bold' : 'inherit' }}>{equipment.name}</Typography>} // Bold for essential items
                  />

                  {/* Optional fields for equipment details */}
                  <Collapse in={isSelected} timeout="auto" unmountOnExit>
                    <Grid container spacing={2} sx={{ pl: 4, mt: 1 }}>
                      {equipment.fields.map((field: string) => (
                        <Grid item xs={12} sm={6} md={4} key={field}>
                          <TextField
                            label={field}
                            fullWidth
                            value={equipmentDetails[field] || ''}
                            onChange={e => handleDetailChange(equipment.name, field, e.target.value)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Collapse>
                </Grid>
              );
            })}
          </Collapse>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Essential and Non-Essential Equipment
      </Typography>

      {/* Render Essential Equipment */}
      <Typography variant="h5" sx={{ mt: 2, mb: 1, color: 'primary.main' }}>
        Essential Equipment
      </Typography>
      {renderEquipmentCategory(essentialEquipment, expandedEssentialCategories, handleEssentialCategoryToggle, true)}

      {/* Render Non-Essential Equipment */}
      <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>
        Non-Essential Equipment
      </Typography>
      {renderEquipmentCategory(nonEssentialEquipment, expandedNonEssentialCategories, handleNonEssentialCategoryToggle, false)}

      {/* Modal and other features can remain the same as before */}
    </Box>
  );
};

export default EquipmentStep;
