import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box,
  MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Typography, IconButton, List, ListItem
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
    usage: "Install in the aquarium and clean or replace filter media regularly.",
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
    usage: "Install in saltwater systems. Adjust foam production to match the tank’s needs."
  },
  // Add other equipment data here...
];

const AddEquipmentCard: React.FC<AddEquipmentCardProps> = ({ open, onClose, onAddEquipment }) => {
  const [selectedType, setSelectedType] = useState<string>('filtration');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
  const [customFields, setCustomFields] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredEquipmentList = equipmentList
    .filter((equipment) => equipment.type === selectedType)
    .filter((equipment) => equipment.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSelectEquipment = (equipment: EquipmentFromDB) => {
    const equipmentToAdd: Equipment = {
      name: equipment.name,
      description: equipment.description,
      role: equipment.role,
      importance: equipment.importance,
      usage: equipment.usage,
      specialConsiderations: equipment.specialConsiderations || '',
      fields: {},  // Initialize fields as an empty object
      type: equipment.type,
    };

    setSelectedEquipment([...selectedEquipment, equipmentToAdd]);
  };

  const handleFieldChange = (equipmentIndex: number, fieldName: string, value: string) => {
    const updatedEquipment = [...selectedEquipment];
    updatedEquipment[equipmentIndex].fields[fieldName] = value;  // Update the field value
    setSelectedEquipment(updatedEquipment);  // Update the state with modified equipment
  };

  const handleAddAllEquipment = () => {
    onAddEquipment(selectedEquipment);
    setSelectedEquipment([]); // Reset selected equipment after saving
    setCustomFields({}); // Reset custom fields
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Equipment</DialogTitle>
      <DialogContent>
        <Box>
          {/* Filter by Equipment Type */}
          <FormControl fullWidth margin="normal">
            <InputLabel shrink>Filter by Equipment Type</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              displayEmpty
            >
              <MenuItem value="filtration">Filtration</MenuItem>
              <MenuItem value="lighting">Lighting</MenuItem>
              <MenuItem value="heating">Heating</MenuItem>
              <MenuItem value="feeding">Feeding</MenuItem>
              <MenuItem value="test_chemicals">Test Chemicals</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          {/* Search by Equipment Name */}
          <TextField
            label="Search Equipment"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Equipment Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Equipment Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Importance</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Add</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEquipmentList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((equipment) => (
                    <TableRow key={equipment.name}>
                      <TableCell>{equipment.name}</TableCell>
                      <TableCell>{equipment.role}</TableCell>
                      <TableCell>{equipment.importance}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleSelectEquipment(equipment)}
                        >
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredEquipmentList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          {/* Selected Equipment and Fields Input */}
          {selectedEquipment.length > 0 && (
            <Box mt={2}>
              <Typography variant="h6">Selected Equipment to Add:</Typography>
              <List>
                {selectedEquipment.map((equipment, index) => (
                  <ListItem key={index}>
                    <Box width="100%">
                      <Typography variant="body2">{equipment.name}</Typography>

                      {/* Render input fields for each selected equipment's fields */}
                      {equipmentList
                        .find((eq) => eq.name === equipment.name)
                        ?.fields.map((field) => (
                          <TextField
                            key={field}
                            label={field}
                            value={selectedEquipment[index].fields[field] || ''}
                            onChange={(e) => handleFieldChange(index, field, e.target.value)}
                            fullWidth
                            margin="normal"
                          />
                        ))}
                    </Box>
                  </ListItem>
                ))}
              </List>
              <Button variant="contained" color="primary" onClick={handleAddAllEquipment}>
                Add Selected Equipment
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEquipmentCard;
