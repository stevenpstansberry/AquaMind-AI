import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Box, MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Typography, IconButton, List, ListItem
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AIChatInterface from '../ai-components/AIChatInterface';  // Assuming you have this for AI suggestions
import AquariumInhabitantInfoCard from './AquariumInhabitantInfoCard';
import { getAllDetails } from '../../services/APIServices';
import { Aquarium, Plant } from '../../interfaces/Aquarium';  // Ensure Plant interface is imported
import SelectedInhabitantsList from './SelectedInhabitantsList';
import FilterPanel from './FilterPanel';
import InhabitantTable from './InhabitantTable';


interface AddPlantCardProps {
  open: boolean;
  onClose: () => void;
  aquarium: Aquarium;  // Pass the entire Aquarium object
  onAddPlant: (plants: Plant[]) => void;  // Callback when plants are added
  handleSnackbar: (message: string, severity: 'success' | 'error' | 'warning' | 'info', open: boolean) => void;
}


const AddPlantCard: React.FC<AddPlantCardProps> = ({ open, onClose, aquarium, onAddPlant, handleSnackbar }) => {
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
  const [localPlantList, setLocalPlantList] = useState<Plant[]>(aquarium.plants);  // Local copy of aquarium plants
  const [plantList, setPlantList] = useState<Plant[]>([]);  // State for all plants
  const [filteredPlantList, setFilteredPlantList] = useState<Plant[]>([]);


   /**
   * Fetch plant data when the component is mounted or when the aquarium type changes
   */
useEffect(() => {
  if (open) {
    const plantsData = localStorage.getItem('details_plants'); // Call speciesList() to get the actual array
    const parsedPlantsData = plantsData ? JSON.parse(plantsData) : [];
    console.log("Add PlantCard opened. Setting plantList to species data from DetailsContext.");
    setPlantList(parsedPlantsData); // Set plantList to the array returned by speciesList()
    console.log("Current plantList:", parsedPlantsData);
    console.log("Local storage for plants:", localStorage.getItem('details_plants'));
    }
  }, [open]); // Run this effect when species or open changes

  useEffect(() => {
    if (open) {
      console.log("Opened Add Plant Card");
      console.log("Aquarium data:", aquarium);
      console.log("Aquarium size:", aquarium.size);
      console.log("Aquarium type:", aquarium.type);
      console.log("Existing plants in aquarium:", localPlantList);  // Use localPlantList here

      const existingPlantNames = aquarium.plants.map(plant => plant.name.toLowerCase());
      console.log("Existing plant names (lowercased):", existingPlantNames);

      const filtered = plantList.filter(plant => {
        const matchesRole = !roleFilter || plant.role === roleFilter;
        const matchesCareLevel = !careLevelFilter || plant.careLevel === careLevelFilter;
        const matchesTankSize = !minTankSizeFilter || Number(plant.minTankSize) <= minTankSizeFilter;
        const matchesSearch = !searchQuery || plant.name.toLowerCase().includes(searchQuery.toLowerCase());
        const notInExisting = !existingPlantNames.includes(plant.name.toLowerCase());

        console.log(`Plant: ${plant.name}, Role: ${matchesRole}, CareLevel: ${matchesCareLevel}, TankSize: ${matchesTankSize}, Search: ${matchesSearch}, NotInExisting: ${notInExisting}`);

        return matchesRole && matchesCareLevel && matchesTankSize && matchesSearch && notInExisting;
      });

      console.log("Filtered plants:", filtered);
      setFilteredPlantList(filtered);
    }
  }, [roleFilter, careLevelFilter, minTankSizeFilter, searchQuery, plantList, open, localPlantList]);  // Add localPlantList as a dependency

 

  

  const handleSelectPlant = (plant: Plant) => {
    console.log('Plant selected:', plant);  // Log the plant when selected
    const isSelected = selectedPlantList.some(p => p.name === plant.name);
    
    // Ensure `count` is initialized with a default value if undefined
    const plantWithCount = { ...plant, count: plant.count ?? 1 };  // Use '??' to assign 1 if count is undefined
    console.log('Plant after count initialization:', plantWithCount);  // Log plant after ensuring count

    if (isSelected) {
      console.log('Removing plant from selected list:', plantWithCount);
      setSelectedPlantList(selectedPlantList.filter(p => p.name !== plant.name));
      handleSnackbar(`${plant.name} removed from selection.`, 'info', true);
    } else {
      console.log('Adding plant to selected list:', plantWithCount);
      setSelectedPlantList([...selectedPlantList, plantWithCount]);
      handleSnackbar(`${plant.name} added to selection.`, 'success', true);
    }
  };

  const isPlantSelected = (plant: Plant) => {
    return selectedPlantList.some(p => p.name === plant.name);
  };

  // Handle opening the plant info card
  const handlePlantClick = (plant: Plant) => {
    console.log('Opening plant info card:', plant);  // Log the plant when opening the info card
    setSelectedPlant(plant);
    setInfoOpen(true);
  };

  const handleCloseInfo = () => {
    console.log('Closing plant info card.');
    setInfoOpen(false);  
    setSelectedPlant(null);  
  };

  const handleAddAllPlants = () => {
    console.log('Adding all selected plants:', selectedPlantList);

    const validPlants = selectedPlantList.map(plant => ({ 
      ...plant, 
      count: plant.count ?? 1  // Ensure every plant has a count
    }));

    onAddPlant(validPlants);

    handleSnackbar(`Added ${validPlants.length} plants to the aquarium.`, 'success', true);

    // Update the local plant list with newly added plants
    setLocalPlantList(prevList => [...prevList, ...validPlants]);
    
    setSelectedPlantList([]);
  };
  

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

    /**
   * @function handleAddPlantGPT
   * @description Allows the GPT chatbot to add an item to the aquarium.
   * 
   * @param {string} itemType - The type of item to add.
   * @param {string} itemName - The name of the item to add.
   */
    const handleAddPlantGPT = (itemType: string, itemName: string) => {
      if (itemType.toLowerCase() === 'plant') {
        const plantToAdd = plantList.find(plant => plant.name.toLowerCase() === itemName.toLowerCase());
        if (plantToAdd) {
          handleSelectPlant(plantToAdd); // Add the plant to selectedPlantList
          handleSnackbar(`${itemName} added via AI suggestion!`, 'success', true);
        } else {
          console.warn(`Fish ${itemName} not found in plant list.`);
        }
      } else {
        console.warn(`Item type ${itemType} is not handled in AddPlantCard.`);
      }
    };

    return (
      <>
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
          <DialogTitle>Add New Plants</DialogTitle>
          <DialogContent>
            {/* Filter Panel */}
            <FilterPanel
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              careLevelFilter={careLevelFilter}
              setCareLevelFilter={setCareLevelFilter}
              minTankSizeFilter={minTankSizeFilter}
              setMinTankSizeFilter={setMinTankSizeFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              roles={['Oxygenator', 'Decorative', 'Carpet']}
              careLevels={['Easy', 'Moderate', 'Difficult']}
              searchLabel="Search Plant"
            />
  
            {/* Plant Table */}
            <InhabitantTable<Plant>
              data={filteredPlantList}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              onRowClick={handlePlantClick}
              onSelectItem={handleSelectPlant}
              isItemSelected={isPlantSelected}
              columns={[
                { field: 'name', headerName: 'Plant Name' },
                { field: 'role', headerName: 'Role' },
                { field: 'careLevel', headerName: 'Care Level' },
                { field: 'minTankSize', headerName: 'Min Tank Size' },
              ]}
              addButtonColor="primary"
            />
  
            {/* Selected Plants and Add Button */}
            <SelectedInhabitantsList<Plant>
              selectedItems={selectedPlantList}
              onAddAll={handleAddAllPlants}
              label="Selected Plants to Add:"
              buttonText="ADD SELECTED PLANTS TO AQUARIUM"
            />
  
            {/* AI Chat Interface */}
            <Box mt={2}>
              <Button variant="outlined" onClick={() => setShowChat(!showChat)}>
                {showChat ? 'Hide' : 'Show'} AI Suggestions
              </Button>
              <AIChatInterface
                showChat={showChat}
                onClose={() => setShowChat(false)}
                aquarium={aquarium}
                suggestions={[
                  'What plants can I add to this tank?',
                  'Do the plants in my tank need any special care?',
                ]}
                onAddItem={handleAddPlantGPT}
              />
            </Box>
          </DialogContent>
  
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
  
          {/* Plant Info Modal */}
          {selectedPlant && (
            <AquariumInhabitantInfoCard
              open={infoOpen}
              onClose={handleCloseInfo}
              inhabitant={selectedPlant}
            />
          )}
        </Dialog>
      </>
    );
  };
  
  export default AddPlantCard;