/**
 * @file AddFishCard.tsx
 * @location src/components/aquarium-components/AddFishCard.tsx
 * @description This component renders a modal dialog for adding fish to the aquarium. 
 * It allows filtering fish by role, care level, and minimum tank size, and includes a search bar 
 * for finding fish by name. Users can view details of each fish and select multiple fish to add to 
 * their aquarium. The component also provides pagination for fish lists and integrates an AI chat interface 
 * for suggestions.
 * 
 * @author Steven Stansberry
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Box, MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Typography, IconButton, List, ListItem
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';  
import AIChatInterface from '../ai-components/AIChatInterface'; 
import AquariumInhabitantInfoCard from './AquariumInhabitantInfoCard';
import { Aquarium, Fish } from '../../interfaces/Aquarium';
import { getAllDetails } from '../../services/APIServices';
import saltWaterFishData from '../../util/SaltwaterFishData.json';
import { useDetails } from '../../util/DetailsContext';
import SelectedInhabitantsList from './SelectedInhabitantsList';
import FilterPanel from './FilterPanel';
import InhabitantTable from './InhabitantTable';


interface AddFishCardProps {
  open: boolean;
  onClose: () => void;
  aquarium: Aquarium;  // Pass the entire Aquarium object
  onAddFish: (fish: Fish[]) => void; 
  handleSnackbar: (message: string, severity: 'success' | 'error' | 'warning' | 'info', open: boolean) => void;
}

const saltwaterFishList = saltWaterFishData;


/**
 * @function AddFishCard
 * @description Renders a modal dialog for adding fish to the aquarium, allowing filtering, 
 * selecting, and viewing fish details.
 * 
 * @param {AddFishCardProps} props - Component props.
 * @param {boolean} props.open - Determines if the dialog is open.
 * @param {function} props.onClose - Function to handle closing the dialog.
 * @param {Aquarium} props.aquarium - The aquarium object, containing information about the tank.
 * @param {function} props.onAddFish - Callback function when fish are added to the aquarium.
 * 
 * @returns {JSX.Element} - The rendered component.
 */
const AddFishCard: React.FC<AddFishCardProps> = ({ open, onClose, aquarium, onAddFish, handleSnackbar }) => {
  const { species, speciesList } = useDetails();

  console.log("species list from context" , species);

  const [roleFilter, setRoleFilter] = useState('');  
  const [careLevelFilter, setCareLevelFilter] = useState('');  // New filter for care level
  const [minTankSizeFilter, setMinTankSizeFilter] = useState<number>(parseInt(aquarium.size));  // Default to aquarium size
  const [searchQuery, setSearchQuery] = useState('');  
  const [showChat, setShowChat] = useState(false);  
  const [page, setPage] = useState(0);  
  const [rowsPerPage, setRowsPerPage] = useState(5);  
  const [selectedFishList, setSelectedFishList] = useState<Fish[]>([]);  
  const [selectedFish, setSelectedFish] = useState<Fish | null>(null);  
  const [infoOpen, setInfoOpen] = useState(false);  
  const [filteredFishList, setFilteredFishList] = useState<Fish[]>([]);
  const [fishList, setFishList] = useState<Fish[]>([]);
  const [localFishList, setLocalFishList] = useState<Fish[]>(aquarium.species);



// Update fishList when species changes or when the component opens
useEffect(() => {
  if (open) {
    const speciesData = localStorage.getItem('details_species'); // Call speciesList() to get the actual array
    const parsedSpeciesData = speciesData ? JSON.parse(speciesData) : [];
    console.log("AddFishCard opened. Setting fishList to species data from DetailsContext.");
    setFishList(parsedSpeciesData); // Set fishList to the array returned by speciesList()
    console.log("Current fishList:", parsedSpeciesData);
    console.log("Local storage for details_species:", localStorage.getItem('details_species'));
  }
}, [species, open]); // Run this effect when species or open changes

  
    /**
   * @function useEffect
   * @description Filters the fish list based on the role, care level, minimum tank size, and search query. 
   * This effect is triggered whenever the dialog is open or one of the filter conditions changes.
   * 
   * @param {boolean} open - Indicates if the dialog is open.
   */
    useEffect(() => {
      if (open) {
        const existingFishNames = localFishList.map(fish => fish.name.toLowerCase());
        
        const filtered = fishList.filter(fish => {
          const matchesRole = !roleFilter || fish.role === roleFilter;
          const matchesCareLevel = !careLevelFilter || fish.careLevel === careLevelFilter;
          const matchesTankSize = !minTankSizeFilter || Number(fish.minTankSize) <= minTankSizeFilter;
          const matchesSearch = !searchQuery || fish.name.toLowerCase().includes(searchQuery.toLowerCase());
          const notInExisting = !existingFishNames.includes(fish.name.toLowerCase());
          
          return matchesRole && matchesCareLevel && matchesTankSize && matchesSearch && notInExisting;
        });
    
        setFilteredFishList(filtered);
      }
    }, [roleFilter, careLevelFilter, minTankSizeFilter, searchQuery, fishList, open, localFishList]);
    
  


  /**
   * @function handleSelectFish
   * @description Adds or removes a fish from the selected fish list when the user clicks on it.
   * 
   * @param {Fish} fish - The fish object to be added or removed from the selected list.
   */
  const handleSelectFish = (fish: Fish) => {
    const isSelected = selectedFishList.some(f => f.name === fish.name);
    if (isSelected) {
      setSelectedFishList(selectedFishList.filter(f => f.name !== fish.name));  
      handleSnackbar(`${fish.name} removed from selection`, 'info', true);
    } else {
      setSelectedFishList([...selectedFishList, fish]);  
      handleSnackbar(`${fish.name} added to selection`, 'success', true);

    }
  };

  /**
   * @function isFishSelected
   * @description Checks if a fish is currently selected.
   * 
   * @param {Fish} fish - The fish object to check.
   * @returns {boolean} - Returns true if the fish is selected, otherwise false.
   */
  const isFishSelected = (fish: Fish) => {
    return selectedFishList.some(f => f.name === fish.name);
  };


  /**
   * @function handleFishClick
   * @description Opens the AquariumInhabitantInfoCard modal with information about the selected fish.
   * 
   * @param {Fish} fish - The fish object to display in the AquariumInhabitantInfoCard modal.
   */
  const handleFishClick = (fish: Fish) => {
    setSelectedFish(fish);
    setInfoOpen(true);  // Open the AquariumInhabitantInfoCard modal
  };


  /**
   * @function handleCloseInfo
   * @description Closes the FishInfoCard modal and clears the selected fish state.
   */
  const handleCloseInfo = () => {
    setInfoOpen(false);  
    setSelectedFish(null);  
  };


  /**
   * @function handleAddAllFish
   * @description Adds all the selected fish to the aquarium and updates the local state.
   */
  const handleAddAllFish = () => {
    console.log('Adding selected fish to aquarium:', selectedFishList);

    // Ensure every fish has a count (use default of 1 if not provided)
    const validFish = selectedFishList.map(fish => ({
      ...fish,
      count: fish.count ?? 1
    }));

    onAddFish(validFish);

    handleSnackbar(`${validFish.length} fish added to the aquarium!`, 'success', true);

    setLocalFishList(prevList => [...prevList, ...validFish]);
    setSelectedFishList([]);  // Clear selected list after adding fish
  };

  /**
   * @function handleChangePage
   * @description Handles pagination when the user changes the page.
   * 
   * @param {unknown} event - The event that triggered the page change.
   * @param {number} newPage - The new page number to be set.
   */
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  /**
   * @function handleChangeRowsPerPage
   * @description Adjusts the number of rows per page in the fish table.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - The event that triggered the rows per page change.
   */
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**
   * @function handleAddFishGPT
   * @description Allows the GPT chatbot to add an item to the aquarium.
   * 
   * @param {string} itemType - The type of item to add.
   * @param {string} itemName - The name of the item to add.
   */
  const handleAddFishGPT = (itemType: string, itemName: string) => {
    if (itemType.toLowerCase() === 'fish') {
      const fishToAdd = fishList.find(fish => fish.name.toLowerCase() === itemName.toLowerCase());
      if (fishToAdd) {
        handleSelectFish(fishToAdd); // Add the fish to selectedFishList
        handleSnackbar(`${itemName} added via AI suggestion!`, 'success', true);
      } else {
        console.warn(`Fish ${itemName} not found in fish list.`);
      }
    } else {
      console.warn(`Item type ${itemType} is not handled in AddFishCard.`);
    }
  };

  const handleFishQuantityChange = (fish: Fish, quantity: number) => {
    if (quantity < 1 || isNaN(quantity)) return;
    setSelectedFishList((prevList) =>
      prevList.map((f) => (f.name === fish.name ? { ...f, count: quantity } : f))
    );
  };
  

  // Handle remove fish
  const handleRemoveFish = (fish: Fish) => {
    setSelectedFishList((prevList) => prevList.filter((f) => f.name !== fish.name));
    handleSnackbar(`${fish.name} removed from selection.`, 'info', true);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Fish</DialogTitle>
        <DialogContent>
          {/* Filter Panel */}
          <FilterPanel
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            careLevelFilter={careLevelFilter}
            setCareLevelFilter={setCareLevelFilter}
            minTankSizeFilter={minTankSizeFilter ?? 0}
            setMinTankSizeFilter={setMinTankSizeFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            roles={['Schooling', 'Predator', 'Scavenger', 'Community']}
            careLevels={['Easy', 'Moderate', 'Difficult']}
            searchLabel="Search Fish"
          />

          {/* Fish Table */}
          <InhabitantTable<Fish>
          key={filteredFishList.length}  // Change key based on filtered list to trigger re-render
          data={filteredFishList}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          onRowClick={handleFishClick}
          onSelectItem={handleSelectFish}
          isItemSelected={isFishSelected}
          columns={[
            { field: 'name', headerName: 'Fish Name' },
            { field: 'role', headerName: 'Role' },
            { field: 'careLevel', headerName: 'Care Level' },
            { field: 'minTankSize', headerName: 'Min Tank Size' },
          ]}
          addButtonColor="primary"
          />


          {/* Selected Fish and Add Button */}
          <SelectedInhabitantsList<Fish>
          selectedItems={selectedFishList}
          onAddAll={handleAddAllFish}
          label="Selected Fish to Add:"
          buttonText="ADD SELECTED FISH TO AQUARIUM"
          onQuantityChange={handleFishQuantityChange}
          onRemoveItem={handleRemoveFish}
          onInfoClick={handleFishClick} // Pass the existing handleFishClick function
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
                'What fish can I add to this tank?',
                'Do the fish in my tank need any special care?',
              ]}
              onAddItem={handleAddFishGPT}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>

        {/* Fish Info Modal */}
        {selectedFish && (
          <AquariumInhabitantInfoCard
            open={infoOpen}
            onClose={handleCloseInfo}
            inhabitant={selectedFish}
          />
        )}
      </Dialog>
    </>
  );
};


export default AddFishCard;