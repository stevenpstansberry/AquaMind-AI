import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box,
  MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Typography, IconButton
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EquipmentInfoCard from './EquipmentInfoCard';
import { Aquarium, Equipment } from '../../interfaces/Aquarium';
import equipmentData from '../../util/EquipmentData.json';
import { getAllDetails } from '../../services/APIServices';

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
  onAddEquipment: (equipment: Equipment) => void;
  aquarium: Aquarium;
  handleSnackbar: (message: string, severity: 'success' | 'error' | 'warning' | 'info', open: boolean) => void;
}

const fieldUnitMapping: { [key: string]: string[] } = {
  "Flow Rate": ["Gallons per Hour (GPH)", "Liters per Hour (LPH)", "Cubic Meters per Hour (m³/h)"],  
  "Capacity": ["Gallons", "Liters", "Cubic Meters"],         
  "Wattage": ["Watts (W)", "Kilowatts (kW)"],                
  "Temperature Range": ["°F (Fahrenheit)", "°C (Celsius)"],  
  "Spectrum Type": ["Kelvin (K)", "Nanometers (nm)"],    
  "Quantity": ["Grams (g)", "Milligrams (mg)", "Ounces (oz)"],           
  "Dosage": ["Milliliters (mL)", "Liters (L)", "Fluid Ounces (fl oz)"],   
  "Frequency of Use": ["times/day", "times/week", "times/month"],         
  // Add more field mappings as necessary...
};



const AddEquipmentCard: React.FC<AddEquipmentCardProps> = ({ open, onClose, onAddEquipment, aquarium, handleSnackbar }) => {
  const [selectedType, setSelectedType] = useState<string>('filtration');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null); // Allow only one equipment to be selected
  const [customFields, setCustomFields] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [infoOpen, setInfoOpen] = useState(false);
  const [equipmentInfo, setEquipmentInfo] = useState<Equipment | null>(null);
  const [filteredEquipmentList, setFilteredEquipmentList] = useState<Equipment[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);



  useEffect(() => {
    const fetchEquipmentData = async () => {
      try {
        // Fetch the data
        const data = await getAllDetails("equipment") as Equipment[];
  

        setEquipmentList(data);
      } catch (error) {
        console.error("Error fetching fish data:", error);
        handleSnackbar("Error fetching fish data", 'error', true);
      }
    };
  
    fetchEquipmentData();
  }, [aquarium.type, handleSnackbar]);



  

  // Re-filter the equipment list whenever the modal is opened or the aquarium equipment changes
  useEffect(() => {
    if (open) {
      const filteredList = equipmentList
        .filter((equipment) => equipment.type === selectedType)
        .filter((equipment) => equipment.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter((equipment) => {
          // Exclude equipment already added to the aquarium
          return !aquarium.equipment.some((aqEquipment) => aqEquipment.name === equipment.name);
        });
      setFilteredEquipmentList(filteredList);
    }
  }, [open, aquarium.equipment, selectedType, searchQuery]);

  const handleSelectEquipment = (equipment: Equipment) => {
    console.log("Selected equipment to add:", equipment);
    const equipmentToAdd: Equipment = {
      ...equipment,
      fieldValues: {}, // Initialize fieldValues as empty object
    };
    handleSnackbar(`Selected ${equipment.name} to add to the aquarium`, 'info', true);
    setSelectedEquipment(equipmentToAdd);
  };

  // Update `selectedEquipment`'s fields when inputs change
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

  // Ensure selected equipment and its fields are correctly saved
  const handleSaveEquipment = () => {
    if (selectedEquipment) {
      const updatedFields = { ...selectedEquipment.fieldValues };
  
      // Concatenate the selected unit with the value for each field
      Object.keys(updatedFields).forEach((field) => {
        const unit = updatedFields[`${field}_unit`];
        if (unit) {
          updatedFields[field] = `${updatedFields[field]} ${unit}`;
        }
      });
  
      // Convert fieldValues object to an array of strings
      const fieldsArray = Object.keys(updatedFields).map((field) => `${field}: ${updatedFields[field]}`);
  
      const equipmentToSave = {
        ...selectedEquipment,
        fields: fieldsArray, // Overwrite fields with the new array
      };
  
      console.log("Saving this equipment", equipmentToSave);
      onAddEquipment(equipmentToSave);
      setSelectedEquipment(null);
    }
  };
  

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEquipmentClick = (equipment: Equipment) => {
    const equipmentToAdd: Equipment = {
      name: equipment.name,
      description: equipment.description,
      role: equipment.role,
      importance: equipment.importance,
      usage: equipment.usage,
      specialConsiderations: equipment.specialConsiderations || '',
      fields: equipment.fields,
      type: equipment.type,
    };
    
    setEquipmentInfo(equipmentToAdd);
    setInfoOpen(true);
  };

  const handleCloseInfo = () => {
    setInfoOpen(false);
    setEquipmentInfo(null);
  };

  // Get the selected equipment details
  const selectedEquipmentDetails = equipmentList.find((eq) => eq.name === selectedEquipment?.name);

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
                    <TableRow
                      key={equipment.name}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleEquipmentClick(equipment)}
                    >
                      <TableCell>{equipment.name}</TableCell>
                      <TableCell>{equipment.role}</TableCell>
                      <TableCell>{equipment.importance}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleSelectEquipment(equipment);
                          }}
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
          {selectedEquipment && (
            <Box mt={2}>
              <Typography variant="h6" sx={{ mb: 2 }}>Selected Equipment to Add:</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>{selectedEquipment.name}</Typography>

              {/* Render input fields for the selected equipment's fields */}
              {selectedEquipmentDetails && selectedEquipmentDetails.fields && Object.keys(selectedEquipmentDetails.fields).map((field) => (
                <Box key={field} display="flex" alignItems="center" sx={{ mb: 2 }}>
                  <TextField
                    label={field}
                    value={selectedEquipment.fieldValues ? selectedEquipment.fieldValues[field] || '' : ''}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    sx={{ flex: 2, marginRight: '10px' }}
                    margin="dense"
                  />
                  {fieldUnitMapping[field] ? (
                    <FormControl sx={{ flex: 1 }} margin="dense">
                      <InputLabel>Unit</InputLabel>
                      <Select
                        value={selectedEquipment.fieldValues ? selectedEquipment.fieldValues[`${field}_unit`] || fieldUnitMapping[field][0] : fieldUnitMapping[field][0]}
                        onChange={(e) => handleFieldChange(`${field}_unit`, e.target.value)}
                      >
                        {fieldUnitMapping[field].map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <Box sx={{ flex: 1 }} />
                  )}
                </Box>
              ))}
  
              {/* Right-aligned button */}
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveEquipment}
                >
                  Add Selected Equipment
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
      </DialogActions>
  
      {/* Equipment Info Modal using EquipmentInfoCard */}
      {equipmentInfo && (
        <EquipmentInfoCard
          open={infoOpen}
          onClose={handleCloseInfo}
          equipment={equipmentInfo}
        />
      )}
    </Dialog>
  );  
};

export default AddEquipmentCard;
