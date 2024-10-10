import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box,
  MenuItem, Select, InputLabel, FormControl, List, ListItem, Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Aquarium, Equipment } from '../../interfaces/Aquarium';

// Interface for equipment from the database (fields as an array of strings)
interface EquipmentFromDB {
  name: string;
  description: string;
  role: string;
  importance: string;
  usage: string;
  specialConsiderations?: string;
  fields: string[];  // List of field names
  type: 'filtration' | 'lighting' | 'heating' | 'feeding' | 'test_chemicals' | 'other';
}

interface AddEquipmentCardProps {
  open: boolean;
  onClose: () => void;
  onAddEquipment: (equipment: Equipment[]) => void;
  aquarium: Aquarium;
}

// Mocked list of equipment coming from the database (using EquipmentFromDB)
const equipmentList: EquipmentFromDB[] = [
  {
    name: "Filter",
    description: "Removes debris, waste, and harmful chemicals from the water, keeping it clean and healthy for fish.",
    role: "Water Filtration",
    importance: "Maintains water quality by filtering out physical waste and converting harmful chemicals (like ammonia) into less toxic compounds.",
    usage: "Install in the aquarium and clean or replace filter media regularly to ensure efficient operation.",
    specialConsiderations: "Do not over-clean or replace all filter media at once to avoid disrupting beneficial bacteria colonies.",
    fields: ["Brand", "Model Name", "Flow Rate", "Type"],
    type: "filtration"
  },
  {
    name: "Protein Skimmer",
    description: "Removes organic waste from water by creating foam that captures debris and dissolved organics.",
    role: "Advanced Filtration",
    importance: "Helps maintain clean water by removing dissolved organic compounds before they break down.",
    fields: ["Brand", "Model Name", "Capacity"],
    type: "filtration",
    usage: "Install in the aquarium and clean or replace filter media regularly to ensure efficient operation.",
    specialConsiderations: "Do not over-clean or replace all filter media at once to avoid disrupting beneficial bacteria colonies."
  },
  // Add other equipment data here...
];

const AddEquipmentCard: React.FC<AddEquipmentCardProps> = ({ open, onClose, onAddEquipment }) => {
  // Set default type to "filtration"
  const [selectedType, setSelectedType] = useState<string>('filtration'); // Default to filtration
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
  const [customFields, setCustomFields] = useState<{ [key: string]: string }>({});
  const [selectedEquipmentItem, setSelectedEquipmentItem] = useState<EquipmentFromDB | null>(null);

  // Filter equipment by selected type
  const filteredEquipmentList = equipmentList.filter(equipment => equipment.type === selectedType);

  // Automatically select the first available equipment when the type changes
  useEffect(() => {
    if (filteredEquipmentList.length > 0) {
      handleSelectEquipment(filteredEquipmentList[0]);
    } else {
      setSelectedEquipmentItem(null);
    }
  }, [selectedType]);

  // Handle selection of equipment from the dropdown
  const handleSelectEquipment = (equipment: EquipmentFromDB) => {
    setSelectedEquipmentItem(equipment);
    // Initialize fields with empty strings for user input
    setCustomFields(
      equipment.fields.reduce((acc: { [key: string]: string }, field: string) => {
        acc[field] = '';  // Initialize each field with an empty string
        return acc;
      }, {})
    );
  };

  // Handle change in input fields
  const handleFieldChange = (fieldName: string, value: string) => {
    setCustomFields({
      ...customFields,
      [fieldName]: value,
    });
  };

  // Convert the selected equipment from EquipmentFromDB to UserEquipmentFormat and add it to the list
  const handleAddEquipment = () => {
    if (selectedEquipmentItem) {
      const equipmentToSave: Equipment = {
        name: selectedEquipmentItem.name,
        description: selectedEquipmentItem.description,
        role: selectedEquipmentItem.role,
        importance: selectedEquipmentItem.importance,
        usage: selectedEquipmentItem.usage,
        specialConsiderations: selectedEquipmentItem.specialConsiderations || '',
        fields: customFields,  // Store user input as key-value pairs in fields
        type: selectedEquipmentItem.type,
      };

      setSelectedEquipment([...selectedEquipment, equipmentToSave]);
      setCustomFields({});  // Reset fields after adding equipment
      setSelectedEquipmentItem(null);  // Reset selected equipment
      setSelectedType('filtration');  // Reset the type to default "filtration" after adding equipment
    }
  };

  // Handle saving all selected equipment
  const handleSaveAll = () => {
    onAddEquipment(selectedEquipment);
    setSelectedEquipment([]);  // Clear the list after saving
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      sx={{ '& .MuiDialog-paper': { minHeight: '500px' } }}  // Make dialog taller by default
    >
      <DialogTitle>Add New Equipment</DialogTitle>
      <DialogContent>
        <Box>
          {/* Type selection dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel shrink>Select Equipment Type</InputLabel> {/* Ensures label does not overlap */}
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              displayEmpty
            >
              {/* Removed "None" option; defaults to "filtration" */}
              <MenuItem value="filtration">Filtration</MenuItem>
              <MenuItem value="lighting">Lighting</MenuItem>
              <MenuItem value="heating">Heating</MenuItem>
              <MenuItem value="feeding">Feeding</MenuItem>
              <MenuItem value="test_chemicals">Test Chemicals</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          {/* Equipment selection dropdown, filtered by type */}
          {selectedType && (
            <FormControl fullWidth margin="normal">
              <InputLabel shrink>Select Equipment</InputLabel> {/* Ensures label does not overlap */}
              <Select
                value={selectedEquipmentItem ? selectedEquipmentItem.name : ''}
                onChange={(e) => {
                  const foundEquipment = filteredEquipmentList.find(eq => eq.name === e.target.value);
                  if (foundEquipment) {
                    handleSelectEquipment(foundEquipment);
                  }
                }}
                displayEmpty
              >
                {filteredEquipmentList.map((equipment) => (
                  <MenuItem key={equipment.name} value={equipment.name}>
                    {equipment.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Display fields for the selected equipment */}
          {selectedEquipmentItem && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedEquipmentItem.description}
              </Typography>
              {selectedEquipmentItem.fields.map((field: string) => (
                <TextField
                  key={field}
                  label={field}
                  value={customFields[field] || ''}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  fullWidth
                  margin="normal"
                />
              ))}

              <Button
                variant="contained"
                color="primary"
                onClick={handleAddEquipment}
                startIcon={<AddCircleOutlineIcon />}
              >
                Add Equipment
              </Button>
            </>
          )}

          {/* Display selected equipment with user inputs */}
          {selectedEquipment.length > 0 && (
            <>
              <Typography variant="h6" marginTop={2}>Selected Equipment</Typography>
              <List>
                {selectedEquipment.map((equipment, index) => (
                  <ListItem key={index}>
                    <Typography>
                      {equipment.name} - {Object.entries(equipment.fields).map(([key, value]) => (
                        <span key={key}>{key}: {value}; </span>
                      ))}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSaveAll} color="primary" disabled={selectedEquipment.length === 0}>
          Save Equipment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEquipmentCard;
