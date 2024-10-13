import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Box, MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Typography, IconButton, List, ListItem
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AIChatInterface from '../AIChatInterface';  // Assuming you have this for AI suggestions
import PlantInfoCard from './PlantInfoCard';  // Component similar to FishInfoCard
import { Aquarium, Plant } from '../../interfaces/Aquarium';  // Ensure Plant interface is imported

interface AddPlantCardProps {
  open: boolean;
  onClose: () => void;
  aquarium: Aquarium;  // Pass the entire Aquarium object
  onAddPlant: (plants: Plant[]) => void;  // Callback when plants are added
}

const freshwaterPlantList: Plant[] = [
  {
    name: "Anubias",
    count: 1,
    role: "Oxygenator",
    type: "Rooted",
    description: "Slow-growing, hardy plant that thrives in low light.",
    tankRequirements: "Does well in low light, attaches to rocks or driftwood.",
    minTankSize: 5,
    compatibility: "Compatible with most freshwater fish.",
    lifespan: "Several years",
    size: "6-12 inches",
    waterParameters: "pH 6.0-7.5, Temp 72-82°F",
    lightingNeeds: "Low",
    growthRate: "Slow",
    careLevel: "Easy",
    nativeHabitat: "West Africa",
    propagationMethods: "Rhizome division",
    specialConsiderations: "Do not bury rhizome in substrate.",
    imageUrl: "",
  },
  {
    name: "Java Fern",
    count: 1,
    role: "Decorative",
    type: "Rooted",
    description: "Easy-to-care-for plant, great for beginners.",
    tankRequirements: "Attaches to rocks or driftwood, does not require substrate.",
    minTankSize: 10,
    compatibility: "Compatible with most fish.",
    lifespan: "Several years",
    size: "10-14 inches",
    waterParameters: "pH 6.0-7.5, Temp 68-82°F",
    lightingNeeds: "Low to medium",
    growthRate: "Slow",
    careLevel: "Easy",
    nativeHabitat: "Southeast Asia",
    propagationMethods: "Rhizome division",
    specialConsiderations: "Avoid burying the rhizome.",
    imageUrl: "",
  },
  // Add more plants as needed
];

const AddPlantCard: React.FC<AddPlantCardProps> = ({ open, onClose, aquarium, onAddPlant }) => {
  const [roleFilter, setRoleFilter] = useState('');  
  const [careLevelFilter, setCareLevelFilter] = useState('');  // New filter for care level
  const [minTankSizeFilter, setMinTankSizeFilter] = useState<number>(parseInt(aquarium.size));  // Default to aquarium size
  const [searchQuery, setSearchQuery] = useState('');  
  const [showChat, setShowChat] = useState(false);  
  const [page, setPage] = useState(0);  
  const [rowsPerPage, setRowsPerPage] = useState(5);  
  const [selectedPlantList, setSelectedPlantList] = useState<Plant[]>([]);  
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);  
  const [infoOpen, setInfoOpen] = useState(false);  

  const plantList = aquarium.type === 'Freshwater' ? freshwaterPlantList : [];  // Saltwater plants could be added later

  // Filter plant list based on role, care level, minimum tank size, and search query
  const filteredPlantList = plantList.filter(plant => {
    return (
      (!roleFilter || plant.role === roleFilter) &&
      (!careLevelFilter || plant.careLevel === careLevelFilter) &&
      (!searchQuery || plant.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleSelectPlant = (plant: Plant) => {
    const isSelected = selectedPlantList.some(p => p.name === plant.name);
    
    // Ensure `count` is initialized
    const plantWithCount = { ...plant, count: plant.count || 1 };  // Add default count if it's missing
  
    if (isSelected) {
      setSelectedPlantList(selectedPlantList.filter(p => p.name !== plant.name));  
    } else {
      setSelectedPlantList([...selectedPlantList, plantWithCount]);  
    }
  };
  

  const isPlantSelected = (plant: Plant) => {
    return selectedPlantList.some(p => p.name === plant.name);
  };

  // Handle opening the plant info card
  const handlePlantClick = (plant: Plant) => {
    setSelectedPlant(plant);
    setInfoOpen(true);
  };

  const handleCloseInfo = () => {
    setInfoOpen(false);  
    setSelectedPlant(null);  
  };

  const handleAddAllPlants = () => {
    // Double-check before adding that all plants have the `count` property
    if (selectedPlantList.every(plant => plant.count !== undefined)) {
      onAddPlant(selectedPlantList);  
      setSelectedPlantList([]);  
    } else {
      console.error("One or more plants are missing the 'count' property.");
    }
  };
  

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Plants</DialogTitle>
        <DialogContent>
          <Box>
            {/* Filter by Role */}
            <FormControl fullWidth margin="normal">
              <InputLabel shrink>Filter by Role</InputLabel>
              <Select
                label="Filter by Role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="Oxygenator">Oxygenator</MenuItem>
                <MenuItem value="Decorative">Decorative</MenuItem>
                <MenuItem value="Carpet">Carpet</MenuItem>
              </Select>
            </FormControl>

            {/* Filter by Care Level */}
            <FormControl fullWidth margin="normal">
              <InputLabel shrink>Filter by Care Level</InputLabel>
              <Select
                label="Filter by Care Level"
                value={careLevelFilter}
                onChange={(e) => setCareLevelFilter(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">All Care Levels</MenuItem>
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Moderate">Moderate</MenuItem>
                <MenuItem value="Difficult">Difficult</MenuItem>
              </Select>
            </FormControl>


            {/* Search by Plant Name */}
            <TextField
              label="Search Plant"
              variant="outlined"
              fullWidth
              margin="normal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Plant Table */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Plant Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Care Level</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Min Tank Size</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Add</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPlantList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((plant) => (
                    <TableRow
                      key={plant.name}
                      hover
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: isPlantSelected(plant) ? 'rgba(0, 123, 255, 0.1)' : 'inherit',
                      }}
                      onClick={() => handlePlantClick(plant)}  
                    >
                      <TableCell>{plant.name}</TableCell>
                      <TableCell>{plant.role}</TableCell>
                      <TableCell>{plant.careLevel}</TableCell>
                      <TableCell>{plant.minTankSize}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(event) => {
                            event.stopPropagation();  
                            handleSelectPlant(plant);
                          }}
                          color={isPlantSelected(plant) ? "secondary" : "primary"}
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
              count={filteredPlantList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Selected Plants and Add Button */}
            {selectedPlantList.length > 0 && (
              <Box mt={2} display="flex" justifyContent="flex-end" alignItems="flex-end" textAlign="right">
                <Box>
                  <Typography variant="h6">Selected Plants to Add:</Typography>
                  <List>
                    {selectedPlantList.map(plant => (
                      <ListItem key={plant.name} sx={{ padding: 0 }}>
                        <Typography variant="body2">• {plant.name}</Typography>
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddAllPlants}
                  >
                    ADD SELECTED PLANTS TO AQUARIUM
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          {/* AI Chat Interface */}
          <Box mt={2}>
            <Button variant="outlined" onClick={() => setShowChat(!showChat)}>
              {showChat ? 'Hide' : 'Show'} AI Suggestions
            </Button>
            <AIChatInterface showChat={showChat} onClose={() => setShowChat(false)} aquarium={aquarium} />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="secondary">Cancel</Button>
        </DialogActions>

        {/* Plant Info Modal using PlantInfoCard */}
        {selectedPlant && (
          <PlantInfoCard 
            open={infoOpen} 
            onClose={handleCloseInfo} 
            plant={selectedPlant} 
          />
        )}
      </Dialog>
    </>
  );
};

export default AddPlantCard;
