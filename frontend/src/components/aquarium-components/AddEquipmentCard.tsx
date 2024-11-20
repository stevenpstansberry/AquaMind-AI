/**
 * @file AddEquipmentCard.tsx
 * @location src/components/equipment/AddEquipmentCard.tsx
 * @description This component provides a modal interface for users to add new equipment to their aquarium.
 * Users can filter, search, and select equipment, view details in a separate info card, and fill in custom fields with units before saving.
 * An AI chat interface is included for interactive guidance on equipment choices.
 * 
 * @author Steven Stansberry
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box,
  MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Typography, IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EquipmentInfoCard from './EquipmentInfoCard';
import { Aquarium, Equipment } from '../../interfaces/Aquarium';
import { getAllDetails } from '../../services/APIServices';
import AIChatInterface from '../ai-components/AIChatInterface';
import AIButton from '../ai-components/AIButton';

/**
 * @interface AddEquipmentCardProps
 * @description Props for the AddEquipmentCard component.
 * @property {boolean} open - Determines if the modal is open.
 * @property {() => void} onClose - Function to close the modal.
 * @property {(equipment: Equipment) => void} onAddEquipment - Callback to add equipment to the aquarium.
 * @property {Aquarium} aquarium - The aquarium object containing current equipment and details.
 * @property {(message: string, severity: 'success' | 'error' | 'warning' | 'info', open: boolean) => void} handleSnackbar - Callback to display a snackbar message.
 */
interface AddEquipmentCardProps {
  open: boolean;
  onClose: () => void;
  onAddEquipment: (equipment: Equipment) => void;
  aquarium: Aquarium;
  handleSnackbar: (message: string, severity: 'success' | 'error' | 'warning' | 'info', open: boolean) => void;
}

/**
 * @constant fieldUnitMapping
 * @description A mapping of equipment fields to their respective unit options for input selection.
 */
const fieldUnitMapping: { [key: string]: string[] } = {
  "Flow Rate": ["Gallons per Hour (GPH)", "Liters per Hour (LPH)", "Cubic Meters per Hour (m³/h)"],
  "Capacity": ["Gallons", "Liters", "Cubic Meters"],
  "Wattage": ["Watts (W)", "Kilowatts (kW)"],
  "Temperature Range": ["°F (Fahrenheit)", "°C (Celsius)"],
  "Spectrum Type": ["Kelvin (K)", "Nanometers (nm)"],
  "Quantity": ["Grams (g)", "Milligrams (mg)", "Ounces (oz)"],
  "Dosage": ["Milliliters (mL)", "Liters (L)", "Fluid Ounces (fl oz)"],
  "Frequency of Use": ["times/day", "times/week", "times/month"],
};

/**
 * @component AddEquipmentCard
 * @description A modal component for adding equipment to an aquarium. It includes:
 * - Equipment filtering and search
 * - Custom field input with unit selection
 * - Pagination for the equipment list
 * - AI chat integration for guidance
 * - Info card for viewing detailed equipment descriptions
 * @param {AddEquipmentCardProps} props - Props for the AddEquipmentCard component.
 * @returns {JSX.Element} A modal for adding aquarium equipment.
 */
const AddEquipmentCard: React.FC<AddEquipmentCardProps> = ({
  open,
  onClose,
  onAddEquipment,
  aquarium,
  handleSnackbar,
}) => {
  const [selectedType, setSelectedType] = useState<string>('filtration');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [customFields, setCustomFields] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [infoOpen, setInfoOpen] = useState(false);
  const [equipmentInfo, setEquipmentInfo] = useState<Equipment | null>(null);
  const [filteredEquipmentList, setFilteredEquipmentList] = useState<Equipment[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [showChat, setShowChat] = useState(false);

  /**
   * Fetches equipment data from the API and updates the equipment list.
   */
  useEffect(() => {
    const fetchEquipmentData = async () => {
      try {
        const data = await getAllDetails("equipment") as Equipment[];
        setEquipmentList(data);
      } catch (error) {
        console.error("Error fetching equipment data:", error);
        handleSnackbar("Error fetching equipment data", 'error', true);
      }
    };
    fetchEquipmentData();
  }, [aquarium.type, handleSnackbar]);

  /**
   * Filters the equipment list based on the selected type, search query, and existing aquarium equipment.
   */
  useEffect(() => {
    if (open) {
      const filteredList = equipmentList
        .filter((equipment) => equipment.type === selectedType)
        .filter((equipment) => equipment.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter((equipment) => !aquarium.equipment.some((aqEquipment) => aqEquipment.name === equipment.name));
      setFilteredEquipmentList(filteredList);
    }
  }, [open, aquarium.equipment, selectedType, searchQuery]);

  /**
   * Updates selected equipment and its custom field values.
   * @param {string} fieldName - The field name to update.
   * @param {string} value - The new value for the field.
   */
  const handleFieldChange = (fieldName: string, value: string) => {
    if (selectedEquipment) {
      setSelectedEquipment({
        ...selectedEquipment,
        fieldValues: {
          ...selectedEquipment.fieldValues,
          [fieldName]: value,
        },
      });
    }
  };

  /**
   * Saves the selected equipment and its fields, adding it to the aquarium.
   */
  const handleSaveEquipment = () => {
    if (selectedEquipment) {
      const updatedFields = { ...selectedEquipment.fieldValues };
      Object.keys(updatedFields).forEach((field) => {
        const unit = updatedFields[`${field}_unit`];
        if (unit) {
          updatedFields[field] = `${updatedFields[field]} ${unit}`;
        }
      });
      const fieldsArray = Object.keys(updatedFields).map((field) => `${field}: ${updatedFields[field]}`);
      const equipmentToSave = { ...selectedEquipment, fields: fieldsArray };
      onAddEquipment(equipmentToSave);
      setSelectedEquipment(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Equipment</DialogTitle>
      <Box position="absolute" top={8} right={8}>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        {/* Main content */}
      </DialogContent>
      {/* AI Chat Interface */}
      <AIChatInterface
        showChat={showChat}
        onClose={() => setShowChat(false)}
        aquarium={aquarium}
      />
    </Dialog>
  );
};

export default AddEquipmentCard;
