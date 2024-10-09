import React, { useState, useEffect } from 'react';
import { Typography, Grid, Box, TextField, Checkbox, FormControlLabel, Collapse, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { ExpandMore, Add as AddIcon } from '@mui/icons-material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; 
import EquipmentInfoCard from '../EquipmentInfoCard'; 

//Todo: Add the EquipmentInfoCard component

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
      {
        name: 'Filter',
        description: 'Removes debris, waste, and harmful chemicals from the water, keeping it clean and healthy for fish.',
        role: 'Water Filtration',
        importance: 'Maintains water quality by filtering out physical waste and converting harmful chemicals (like ammonia) into less toxic compounds.',
        usage: 'Install in the aquarium and clean or replace filter media regularly to ensure efficient operation.',
        specialConsiderations: 'Do not over-clean or replace all filter media at once to avoid disrupting beneficial bacteria colonies.',
        fields: ['Brand', 'Model Name', 'Flow Rate', 'Type'],
      },
      {
        name: 'Heater',
        description: 'Maintains the aquarium water temperature within the required range for the fish species.',
        role: 'Water Heating',
        importance: 'Keeps water at a stable temperature, which is crucial for the health and well-being of most tropical fish species.',
        usage: 'Place near a water flow source for even heat distribution. Set the thermostat to the desired temperature based on the species in the aquarium.',
        specialConsiderations: 'Monitor temperature regularly to avoid overheating or underheating, which can stress fish.',
        fields: ['Brand', 'Model Name', 'Wattage', 'Temperature Range'],
      },
      {
        name: 'Light',
        description: 'Provides lighting for fish and plants, simulating natural day-night cycles.',
        role: 'Lighting',
        importance: 'Essential for photosynthesis in live plants and to enhance the appearance of the fish and tank. It also helps establish a natural environment.',
        usage: 'Choose appropriate spectrum and intensity based on the plants and fish in the aquarium. Use a timer to regulate day-night cycles.',
        specialConsiderations: 'Avoid excessive lighting, as it can promote algae growth. Some species may require dim lighting.',
        fields: ['Brand', 'Model Name', 'Wattage', 'Spectrum Type'],
      },
    ],
  },
];

const nonEssentialEquipment = [
  {
    category: 'Other Filtration Equipment',
    items: [
      {
        name: 'Protein Skimmer',
        description: 'Removes organic waste from water by creating foam that captures debris and dissolved organics.',
        role: 'Advanced Filtration',
        importance: 'Helps in maintaining clean water by removing dissolved organic compounds before they break down and affect water quality.',
        usage: 'Install in saltwater systems and adjust foam production to match the tank’s needs. Clean the collection cup regularly.',
        specialConsiderations: 'Commonly used in marine systems where protein buildup can be significant. Less common in freshwater setups.',
        fields: ['Brand', 'Model Name', 'Capacity'],
      },
      {
        name: 'UV Sterilizer',
        description: 'Uses ultraviolet light to kill harmful bacteria, algae spores, and parasites in the water.',
        role: 'Sterilization',
        importance: 'Reduces the spread of diseases and controls algae blooms, improving overall water quality and fish health.',
        usage: 'Install after the filter in the water flow path. Replace the UV bulb periodically for continued effectiveness.',
        specialConsiderations: 'Overuse may disrupt beneficial bacteria. Use with caution in tanks that rely on natural biological filtration.',
        fields: ['Brand', 'Model Name', 'Wattage'],
      },
      {
        name: 'Wave Maker',
        description: 'Creates water movement to mimic natural currents, which is beneficial for some species and plants.',
        role: 'Water Movement',
        importance: 'Ensures even distribution of oxygen and nutrients throughout the tank, reducing dead spots and helping plant growth.',
        usage: 'Place the wave maker strategically in the tank to optimize water flow without causing turbulence.',
        specialConsiderations: 'Some fish species prefer calmer water, so adjust the flow rate accordingly.',
        fields: ['Brand', 'Model Name', 'Flow Rate'],
      },
    ],
  },
  {
    category: 'Aeration & Feeding',
    items: [
      {
        name: 'Air Pump',
        description: 'Provides oxygen by creating bubbles that increase surface agitation, enhancing gas exchange.',
        role: 'Aeration',
        importance: 'Ensures adequate oxygen levels in the water, especially in densely stocked tanks or tanks with limited surface area.',
        usage: 'Install the air pump with an air stone or diffuser for better oxygen distribution. Adjust the flow rate based on tank size.',
        specialConsiderations: 'Over-aeration can cause excessive water movement, which may stress certain fish species.',
        fields: ['Brand', 'Model Name', 'Flow Rate'],
      },
      {
        name: 'CO2 System',
        description: 'Provides carbon dioxide to plants for photosynthesis, promoting healthier growth.',
        role: 'Plant Nutrition',
        importance: 'Essential for planted tanks to enhance the growth of aquatic plants and maintain a balanced ecosystem.',
        usage: 'Install a CO2 diffuser and adjust the flow rate based on the number of plants and tank size. Monitor CO2 levels to avoid excess.',
        specialConsiderations: 'Too much CO2 can harm fish. Use a CO2 monitor or pH controller for optimal balance.',
        fields: ['Brand', 'Model Name', 'Flow Rate'],
      },
      {
        name: 'Food',
        description: 'Provides nutrition to fish and other aquatic species, ensuring their health and vitality.',
        role: 'Feeding',
        importance: 'Proper feeding helps fish grow, maintain health, and display natural behaviors. It’s essential to feed the right amount and type of food.',
        usage: 'Feed species-specific food in appropriate quantities and at regular intervals. Overfeeding can cause water pollution.',
        specialConsiderations: 'Different species have different dietary needs (herbivore, carnivore, omnivore). Research specific dietary requirements.',
        fields: ['Brand', 'Type of Food', 'Species-Specific', 'Quantity per Feeding', 'Feeding Frequency'],
      },
    ],
  },
  {
    category: 'Chemicals & Maintenance',
    items: [
      {
        name: 'Water Conditioner',
        description: 'Neutralizes harmful substances like chlorine and heavy metals from tap water, making it safe for aquarium use.',
        role: 'Water Treatment',
        importance: 'Prepares tap water for aquarium use by removing toxic substances that could harm fish and invertebrates.',
        usage: 'Add to new water before water changes or when setting up a new tank. Follow dosage instructions carefully.',
        specialConsiderations: 'Use with every water change. Overuse can result in poor water quality.',
        fields: ['Brand', 'Type of Chemical', 'Dosage', 'Frequency of Use', 'Purpose'],
      },
      {
        name: 'Filter Replacement',
        description: 'Replaces old or clogged filter media, ensuring continued filtration efficiency.',
        role: 'Maintenance',
        importance: 'Ensures proper filtration by removing debris, chemicals, and waste from the aquarium. Clogged filters can lead to poor water quality.',
        usage: 'Replace filter media as per the manufacturer’s schedule. Do not replace all media at once to avoid loss of beneficial bacteria.',
        specialConsiderations: 'Some media types, like activated carbon, have limited lifespans and must be replaced regularly.',
        fields: ['Brand', 'Model', 'Replacement Schedule'],
      },
      {
        name: 'Test Kits',
        description: 'Measures water parameters like pH, ammonia, nitrite, and nitrate levels, which are critical for fish health.',
        role: 'Water Testing',
        importance: 'Monitors the water’s chemical balance to ensure it’s safe for fish. Regular testing prevents toxic buildup of harmful substances.',
        usage: 'Use regularly to test water parameters and adjust tank conditions accordingly. Test more frequently in new tanks.',
        specialConsiderations: 'Accurate testing is crucial for maintaining a stable environment, especially in high-stocked or planted tanks.',
        fields: ['Brand', 'Type of Test (pH, Ammonia, etc.)', 'Frequency of Use'],
      },
    ],
  },
];

const EquipmentStep: React.FC<EquipmentStepProps> = ({
  aquariumData,
  setAquariumData,
  setIsStepValid,
}) => {
  const [selectedEquipment, setSelectedEquipment] = useState<{ name: string; details: any }[]>(aquariumData.equipment || []);
  const [expandedCategories, setExpandedCategories] = useState<boolean[]>(Array(essentialEquipment.length).fill(false));

  // Dialog state for EquipmentInfoCard
  const [infoCardOpen, setInfoCardOpen] = useState<boolean>(false);
  const [selectedEquipmentInfo, setSelectedEquipmentInfo] = useState<any | null>(null);

  // Function to toggle equipment selection
  const handleEquipmentToggle = (equipmentName: string) => {
    if (selectedEquipment.some(e => e.name === equipmentName)) {
      setSelectedEquipment(prev => prev.filter(item => item.name !== equipmentName));
    } else {
      setSelectedEquipment(prev => [...prev, { name: equipmentName, details: {} }]);
    }
  };

  // Open dialog to show equipment info
  const handleOpenInfoCard = (equipment: any) => {
    setSelectedEquipmentInfo(equipment);
    setInfoCardOpen(true);
  };

  // Close the EquipmentInfoCard dialog
  const handleCloseInfoCard = () => {
    setInfoCardOpen(false);
    setSelectedEquipmentInfo(null);
  };

  const handleDetailChange = (equipmentName: string, field: string, value: string) => {
    setSelectedEquipment(prev =>
      prev.map(e => (e.name === equipmentName ? { ...e, details: { ...e.details, [field]: value } } : e))
    );
  };

  useEffect(() => {
    setAquariumData((prevData: any) => ({ ...prevData, equipment: selectedEquipment }));
    setIsStepValid(selectedEquipment.length > 0);
  }, [selectedEquipment, setAquariumData, setIsStepValid]);

  const renderEquipmentCategory = (categories: any[], essential: boolean) => (
    <Grid container spacing={2}>
      {categories.map((category, catIndex) => (
        <Grid item xs={12} key={catIndex}>
          <Box
            display="flex"
            alignItems="center"
            onClick={() => setExpandedCategories(prev => {
              const updated = [...prev];
              updated[catIndex] = !updated[catIndex];
              return updated;
            })}
            sx={{ cursor: 'pointer', backgroundColor: essential ? '#e0f7fa' : 'inherit', padding: '10px', borderRadius: '8px' }}
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
                    label={<Typography sx={{ fontWeight: essential ? 'bold' : 'inherit' }}>{equipment.name}</Typography>}
                  />

                  <IconButton
                    aria-label="info"
                    onClick={() => handleOpenInfoCard(equipment)} // Open the info card when clicked
                    sx={{ ml: 2 }}
                  >
                    <InfoOutlinedIcon color="primary" />
                  </IconButton>

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
      {renderEquipmentCategory(essentialEquipment, true)}

      {/* Render Non-Essential Equipment */}
      <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>
        Non-Essential Equipment
      </Typography>
      {renderEquipmentCategory(nonEssentialEquipment, false)}

      {/* Equipment Info Card Dialog */}
      {selectedEquipmentInfo && (
        <EquipmentInfoCard
          open={infoCardOpen}
          onClose={handleCloseInfoCard}
          equipment={selectedEquipmentInfo}
        />
      )}
    </Box>
  );
};

export default EquipmentStep;