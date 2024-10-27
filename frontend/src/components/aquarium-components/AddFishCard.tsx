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
import FishInfoCard from './FishInfoCard';
import AquariumInhabitantInfoCard from './AquariumInhabitantInfoCard';
import { Aquarium, Fish } from '../../interfaces/Aquarium';
import freshWaterFishData from '../../util/FreshwaterFishData.json';
import { getAllDetails } from '../../services/APIServices';
import saltWaterFishData from '../../util/SaltwaterFishData.json';

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

  /**
   * Fetch fish data when the component is mounted or when the aquarium type changes
   */
  useEffect(() => {
    const fetchFishData = async () => {
      try {

        const data = await getAllDetails("species") as Fish[];
        setFishList(data);
      } catch (error) {
        console.error("Error fetching fish data:", error);
        handleSnackbar("Error fetching fish data", 'error', true);
      }
    };

    fetchFishData();
  }, [aquarium.type, handleSnackbar]);

    /**
   * @function useEffect
   * @description Filters the fish list based on the role, care level, minimum tank size, and search query. 
   * This effect is triggered whenever the dialog is open or one of the filter conditions changes.
   * 
   * @param {boolean} open - Indicates if the dialog is open.
   */
    useEffect(() => {
      console.log("Aquarium species:", aquarium.species);
      console.log("Fish list:", fishList);
  
      if (open) {
          // Map the names of fish that already exist in the aquarium
          const existingFishNames = aquarium.species
              .filter(fish => fish && fish.name)  
              .map(fish => fish.name.toLowerCase());
  
          // Filter the fish list based on the current aquarium state and available fish
          const availableFish = fishList.filter(fish => {
            if (!fish || !fish.name) {
                console.warn("Fish object missing name property or fish object itself is null:", fish);
                return false; // Skip any fish that is missing a name or is null/undefined
            }
            const isExisting = existingFishNames.includes(fish.name.toLowerCase());
            if (isExisting) {
                console.log(`Fish removed (already exists in aquarium): ${fish.name}`);
            }
            return !isExisting; // Exclude existing fish
        });
  
          // Apply other filters: role, care level, tank size, search query
          const filteredFish = availableFish.filter(fish => {
              const matchesRole = !roleFilter || fish.role === roleFilter;
              const matchesCareLevel = !careLevelFilter || fish.careLevel === careLevelFilter;
              const matchesTankSize = !minTankSizeFilter || Number(fish.minTankSize) <= minTankSizeFilter;
              const matchesSearch = !searchQuery || (fish.name && fish.name.toLowerCase().includes(searchQuery.toLowerCase()));
  
              return matchesRole && matchesCareLevel && matchesTankSize && matchesSearch;
          });
  
          console.log("Filtered fish list:", filteredFish);
          setFilteredFishList(filteredFish);
      }
  }, [open, aquarium.species, roleFilter, careLevelFilter, minTankSizeFilter, searchQuery]);
  


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

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Fish</DialogTitle>
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
                <MenuItem value="schooling">Schooling</MenuItem>
                <MenuItem value="predator">Predator</MenuItem>
                <MenuItem value="scavenger">Scavenger</MenuItem>
                <MenuItem value="community">Community</MenuItem>
              </Select>
            </FormControl>

            {/* Filter by Care Level */}
            <FormControl fullWidth margin="normal">
              <InputLabel shrink>Filter by Care Level</InputLabel>
              <Select
                label="Filter by Care Level"
                value={careLevelFilter}
                onChange={(e) => setCareLevelFilter(e.target.value)}  // Handle care level selection
                displayEmpty
              >
                <MenuItem value="">All Care Levels</MenuItem>
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Moderate">Moderate</MenuItem>
                <MenuItem value="Difficult">Difficult</MenuItem>
              </Select>
            </FormControl>

            {/* Filter by Minimum Tank Size */}
            <TextField
              label="Filter by Minimum Tank Size (gallons)"
              type="number"
              value={minTankSizeFilter}
              onChange={(e) => setMinTankSizeFilter(parseInt(e.target.value))}  // Update based on user input
              fullWidth
              margin="normal"
            />

            {/* Search by Fish Name */}
            <TextField
              label="Search Fish"
              variant="outlined"
              fullWidth
              margin="normal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Fish Table */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Fish Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Care Level</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Min Tank Size</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Add</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredFishList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((fish) => (
                    <TableRow
                      key={fish.name}
                      hover
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: isFishSelected(fish) ? 'rgba(0, 123, 255, 0.1)' : 'inherit',  
                      }}
                      onClick={() => handleFishClick(fish)}  
                    >
                      <TableCell>{fish.name}</TableCell>
                      <TableCell>{fish.role}</TableCell>
                      <TableCell>{fish.careLevel}</TableCell>  {/* Display care level */}
                      <TableCell>{fish.minTankSize}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(event) => {
                            event.stopPropagation();  
                            handleSelectFish(fish);
                          }}
                          color={isFishSelected(fish) ? "secondary" : "primary"}
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
              count={filteredFishList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Selected Fish and Add Button */}
            {selectedFishList.length > 0 && (
              <Box mt={2} display="flex" justifyContent="flex-end" alignItems="flex-end" textAlign="right">
                <Box>
                  <Typography variant="h6">Selected Fish to Add:</Typography>
                  <List>
                    {selectedFishList.map(fish => (
                      <ListItem key={fish.name} sx={{ padding: 0 }}>
                        <Typography variant="body2">• {fish.name}</Typography>
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddAllFish}
                  >
                    ADD SELECTED FISH TO AQUARIUM
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
            <AIChatInterface
              showChat={showChat}
              onClose={() => setShowChat(false)}
              aquarium={aquarium}
              suggestions={[
                "What fish can I add to this tank?", 
                "Do the fish in my tank need any special care?",
              ]}
              onAddItem={handleAddFishGPT} 
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="secondary">Cancel</Button>
        </DialogActions>

        {/* Fish Info Modal using FishInfoCard */}
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