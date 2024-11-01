/**
 * @file EquipmentStep.tsx
 * @location src/components/aquarium-components/aquarium-wizard-components/EquipmentStep.tsx
 * @description This component renders the equipment selection step in the aquarium setup wizard. It allows the user to choose essential and non-essential equipment, view detailed information, and input specific details for each selected equipment item.
 * 
 * @author Steven Stansberry
 */

import React, { useState, useEffect } from 'react';
import { Typography, Grid, Box, TextField, Checkbox, FormControlLabel, Collapse, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { ExpandMore, Add as AddIcon } from '@mui/icons-material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EquipmentInfoCard from '../EquipmentInfoCard';

interface EquipmentStepProps {
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  aquariumData: {
    name: string;
    id: string;
    type: string;
    size: string;
    species: { id: string; name: string; count: number }[];
    equipment: { name: string; details: any }[];
  };
  setIsStepValid: React.Dispatch<React.SetStateAction<boolean>>;
}

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
        importance: 'Keeps water at a stable temperature, crucial for the health and well-being of tropical fish.',
        usage: 'Place near a water flow source for even heat distribution. Set the thermostat to the desired temperature.',
        specialConsiderations: 'Monitor temperature regularly to avoid overheating or underheating.',
        fields: ['Brand', 'Model Name', 'Wattage', 'Temperature Range'],
      },
      {
        name: 'Light',
        description: 'Provides lighting for fish and plants, simulating natural day-night cycles.',
        role: 'Lighting',
        importance: 'Essential for photosynthesis in live plants and to enhance the appearance of the fish and tank.',
        usage: 'Choose appropriate spectrum and intensity based on the plants and fish. Use a timer to regulate day-night cycles.',
        specialConsiderations: 'Avoid excessive lighting, as it can promote algae growth.',
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
        importance: 'Helps maintain clean water by removing dissolved organic compounds before they break down.',
        usage: 'Install in saltwater systems. Adjust foam production to match the tank’s needs. Clean the collection cup regularly.',
        specialConsiderations: 'Used mostly in marine systems. Overuse may disrupt beneficial bacteria.',
        fields: ['Brand', 'Model Name', 'Capacity'],
      },
      {
        name: 'UV Sterilizer',
        description: 'Uses ultraviolet light to kill harmful bacteria, algae spores, and parasites in the water.',
        role: 'Sterilization',
        importance: 'Reduces the spread of diseases and controls algae blooms, improving overall water quality and fish health.',
        usage: 'Install after the filter in the water flow path. Replace the UV bulb periodically for continued effectiveness.',
        specialConsiderations: 'Overuse may disrupt beneficial bacteria.',
        fields: ['Brand', 'Model Name', 'Wattage'],
      },
      {
        name: 'Wave Maker',
        description: 'Creates water movement to mimic natural currents, which is beneficial for some species and plants.',
        role: 'Water Movement',
        importance: 'Ensures even distribution of oxygen and nutrients throughout the tank.',
        usage: 'Place the wave maker strategically in the tank to optimize water flow.',
        specialConsiderations: 'Adjust the flow rate to avoid turbulence.',
        fields: ['Brand', 'Model Name', 'Flow Rate'],
      },
    ],
  },
  {
    category: 'Aeration',
    items: [
      {
        name: 'Air Pump',
        description: 'Provides oxygen by creating bubbles that increase surface agitation, enhancing gas exchange.',
        role: 'Aeration',
        importance: 'Ensures adequate oxygen levels in the water, especially in densely stocked tanks or tanks with limited surface area.',
        usage: 'Install the air pump with an air stone or diffuser for better oxygen distribution.',
        specialConsiderations: 'Over-aeration can cause excessive water movement, which may stress certain fish species.',
        fields: ['Brand', 'Model Name', 'Flow Rate'],
      },
      {
        name: 'CO2 System',
        description: 'Provides carbon dioxide to plants for photosynthesis, promoting healthier growth.',
        role: 'Plant Nutrition',
        importance: 'Essential for planted tanks to enhance the growth of aquatic plants.',
        usage: 'Install a CO2 diffuser and adjust the flow rate.',
        specialConsiderations: 'Monitor CO2 levels closely, as too much can harm fish.',
        fields: ['Brand', 'Model Name', 'Flow Rate'],
      },
    ],
  },
  {
    category: 'Feeding',
    items: [
      {
        name: 'Flakes',
        description: 'Standard fish food for omnivorous species.',
        role: 'Feeding',
        importance: 'Provides a balanced diet for general fish health.',
        fields: ['Brand', 'Feeding Frequency', 'Quantity'],
      },
      {
        name: 'Blood Worms',
        description: 'High-protein food for carnivorous fish.',
        role: 'Feeding',
        importance: 'Provides essential nutrients and enhances coloration.',
        fields: ['Brand', 'Feeding Frequency', 'Quantity'],
      },
      {
        name: 'Algae Wafers',
        description: 'Supplemental food for bottom-feeding fish and algae eaters.',
        role: 'Feeding',
        importance: 'Ensures proper nutrition for algae-eating fish.',
        fields: ['Brand', 'Feeding Frequency', 'Quantity'],
      },
      {
        name: 'Pellets',
        description: 'Pellet food for medium to large fish, available in sinking and floating forms.',
        role: 'Feeding',
        importance: 'Good for species-specific diets, such as cichlids or goldfish.',
        fields: ['Brand', 'Feeding Frequency', 'Quantity'],
      },
      {
        name: 'Freeze-Dried Brine Shrimp',
        description: 'Lightweight, nutritious food for various fish species.',
        role: 'Feeding',
        importance: 'Provides high-quality protein and is a favorite treat for many fish.',
        fields: ['Brand', 'Feeding Frequency', 'Quantity'],
      },
      {
        name: 'Frozen Bloodworms',
        description: 'Frozen high-protein food suitable for carnivorous fish.',
        role: 'Feeding',
        importance: 'Excellent source of protein and other nutrients.',
        fields: ['Brand', 'Feeding Frequency', 'Quantity'],
      },
      {
        name: 'Live Brine Shrimp',
        description: 'Live food for fish that prefer hunting live prey.',
        role: 'Feeding',
        importance: 'Stimulates natural hunting behavior in predatory fish.',
        fields: ['Source', 'Feeding Frequency', 'Quantity'],
      },
      {
        name: 'Spirulina Flakes',
        description: 'Vegetable-based food for herbivorous fish.',
        role: 'Feeding',
        importance: 'Rich in nutrients, promotes healthy immune systems and vibrant coloration.',
        fields: ['Brand', 'Feeding Frequency', 'Quantity'],
      }
    ],
  },
  {
    category: 'Chemicals & Maintenance',
    items: [
      {
        name: 'Water Conditioner',
        description: 'Neutralizes harmful substances like chlorine and heavy metals from tap water, making it safe for aquarium use.',
        role: 'Water Treatment',
        importance: 'Prepares tap water for aquarium use.',
        usage: 'Add to new water before water changes.',
        specialConsiderations: 'Use with every water change. Overuse can result in poor water quality.',
        fields: ['Brand', 'Type of Chemical', 'Dosage', 'Frequency of Use'],
      },
      {
        name: 'Test Kits',
        description: 'Measures water parameters like pH, ammonia, nitrite, and nitrate levels.',
        role: 'Water Testing',
        importance: 'Ensures water quality remains safe for fish.',
        usage: 'Use regularly to monitor water conditions.',
        specialConsiderations: 'Accurate testing is essential for high-stocked tanks.',
        fields: ['Brand', 'Type of Test', 'Frequency of Use'],
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

  const [expandedEssentialCategories, setExpandedEssentialCategories] = useState<boolean[]>(Array(essentialEquipment.length).fill(false));
  const [expandedNonEssentialCategories, setExpandedNonEssentialCategories] = useState<boolean[]>(Array(nonEssentialEquipment.length).fill(false));

  const [infoCardOpen, setInfoCardOpen] = useState<boolean>(false);
  const [selectedEquipmentInfo, setSelectedEquipmentInfo] = useState<any | null>(null);

  /**
   * Toggles the selection of equipment. If the equipment is already selected, it will be removed; otherwise, it will be added.
   * 
   * @param {string} equipmentName - The name of the equipment to toggle.
   * @returns {void}
   */
  const handleEquipmentToggle = (equipmentName: string) => {
    if (selectedEquipment.some(e => e.name === equipmentName)) {
      setSelectedEquipment(prev => prev.filter(item => item.name !== equipmentName));
    } else {
      setSelectedEquipment(prev => [...prev, { name: equipmentName, details: {} }]);
    }
  };

  /**
   * Opens the information card dialog for a specific piece of equipment.
   * 
   * @param {any} equipment - The equipment object containing details to display in the info card.
   * @returns {void}
   */
  const handleOpenInfoCard = (equipment: any) => {
    setSelectedEquipmentInfo(equipment);
    setInfoCardOpen(true);
  };

  /**
   * Closes the information card dialog.
   * 
   * @returns {void}
   */
  const handleCloseInfoCard = () => {
    setInfoCardOpen(false);
    setSelectedEquipmentInfo(null);
  };

  /**
   * Updates the details of a selected piece of equipment when the user changes input fields.
   * 
   * @param {string} equipmentName - The name of the equipment whose details are being updated.
   * @param {string} field - The specific field being updated (e.g., "Brand", "Model Name").
   * @param {string} value - The new value input by the user.
   * @returns {void}
   */
  const handleDetailChange = (equipmentName: string, field: string, value: string) => {
    setSelectedEquipment(prev =>
      prev.map(e => (e.name === equipmentName ? { ...e, details: { ...e.details, [field]: value } } : e))
    );
  };

  /**
   * Updates the aquarium data state and sets the step validation based on the selected equipment.
   * This useEffect runs whenever the selected equipment changes.
   */
  useEffect(() => {
    setAquariumData((prevData: any) => ({ ...prevData, equipment: selectedEquipment }));
    setIsStepValid(selectedEquipment.length >= 0);
  }, [selectedEquipment, setAquariumData, setIsStepValid]);

  /**
   * Renders the equipment categories with their respective items. Allows expanding/collapsing categories
   * and selecting individual equipment items.
   * 
   * @param {any[]} categories - Array of equipment categories to render.
   * @param {boolean[]} expandedCategories - State array indicating whether each category is expanded.
   * @param {React.Dispatch<React.SetStateAction<boolean[]>>} setExpandedCategories - Function to toggle the expanded state of categories.
   * @returns {JSX.Element} The rendered grid containing categories and their equipment items.
   */
  const renderEquipmentCategory = (
    categories: any[],
    expandedCategories: boolean[],
    setExpandedCategories: React.Dispatch<React.SetStateAction<boolean[]>>
  ) => (
    <Grid container spacing={2}>
      {categories.map((category, catIndex) => (
        <Grid item xs={12} key={catIndex}>
          <Box
            display="flex"
            alignItems="center"
            onClick={() =>
              setExpandedCategories(prev => {
                const updated = [...prev];
                updated[catIndex] = !updated[catIndex];
                return updated;
              })
            }
            sx={{ cursor: 'pointer', padding: '10px', borderRadius: '8px' }}
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
                    label={<Typography sx={{ fontWeight: 'bold' }}>{equipment.name}</Typography>}
                  />

                  <IconButton
                    aria-label="info"
                    onClick={() => handleOpenInfoCard(equipment)}
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
      {renderEquipmentCategory(essentialEquipment, expandedEssentialCategories, setExpandedEssentialCategories)}

      {/* Render Non-Essential Equipment */}
      <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>
        Non-Essential Equipment
      </Typography>
      {renderEquipmentCategory(nonEssentialEquipment, expandedNonEssentialCategories, setExpandedNonEssentialCategories)}

      {/* Equipment Info Card Dialog */}
      {selectedEquipmentInfo && (
        <EquipmentInfoCard open={infoCardOpen} onClose={handleCloseInfoCard} equipment={selectedEquipmentInfo} />
      )}
    </Box>
  );
};

export default EquipmentStep;
