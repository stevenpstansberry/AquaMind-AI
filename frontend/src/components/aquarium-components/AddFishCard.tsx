import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Box, MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Typography, IconButton, List, ListItem
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';  // Icon for add button
import AIChatInterface from '../AIChatInterface';  // Dummy AI chat component
import FishInfoCard from './FishInfoCard';
import { Aquarium, Fish } from '../../interfaces/Aquarium';

interface AddFishCardProps {
  open: boolean;
  onClose: () => void;
  aquarium: Aquarium;  // Pass the entire Aquarium object
  onAddFish: (fish: Fish[]) => void; }

const freshwaterFishList = [
  {
    name: "Neon Tetra",
    count: 10,
    role: "schooling",
    type: "Freshwater",
    description: "A small and peaceful fish with vibrant blue and red colors.",
    feedingHabits: "Omnivore, feeds on flake food, small pellets, and brine shrimp.",
    tankRequirements: "Prefers heavily planted tanks with subdued lighting.",
    compatibility: "Peaceful species, suitable for community tanks.",
    lifespan: "5 years",
    size: "1.5 inches",
    waterParameters: "pH 6.0-7.0, Temperature 72-78°F",
    breedingInfo: "Egg scatterer, prefers dim lighting for breeding.",
    behavior: "Active and peaceful, prefers swimming in groups.",
    careLevel: "Easy",
    dietaryRestrictions: "None",
    nativeHabitat: "Streams and tributaries of South America.",
    stockingRecommendations: "Keep in schools of at least 6-10 for best behavior.",
    specialConsiderations: "Sensitive to water changes and fluctuations in pH.",
    minTankSize: 10,
  },
  {
    name: "Betta",
    count: 1,
    role: "predator",
    type: "Freshwater",
    description: "Known for its bright colors and flowing fins, Betta fish are often kept alone.",
    feedingHabits: "Carnivore, prefers live or frozen foods like bloodworms and daphnia.",
    tankRequirements: "Can live in small tanks, but prefers a minimum of 5 gallons.",
    compatibility: "Aggressive towards other Betta males, best kept alone or with peaceful tankmates.",
    lifespan: "3-5 years",
    size: "3 inches",
    waterParameters: "pH 6.5-7.5, Temperature 76-82°F",
    breedingInfo: "Bubble nest builder; males protect the eggs.",
    behavior: "Territorial, especially males; can be aggressive towards similar-looking fish.",
    careLevel: "Moderate",
    dietaryRestrictions: "Avoid overfeeding and fatty foods.",
    nativeHabitat: "Rice paddies and slow-moving streams in Southeast Asia.",
    stockingRecommendations: "Can be kept in community tanks if properly selected tankmates.",
    specialConsiderations: "Needs access to the water surface to breathe air.",
    minTankSize: 5,
  },
  {
    name: "Corydoras Catfish",
    count: 6,
    role: "scavenger",
    type: "Freshwater",
    description: "Small bottom-dwelling fish that help keep the substrate clean.",
    feedingHabits: "Omnivore, feeds on sinking pellets and leftover food.",
    tankRequirements: "Prefers soft substrate and lots of hiding places.",
    compatibility: "Very peaceful and good for community tanks.",
    lifespan: "5 years",
    size: "2.5 inches",
    waterParameters: "pH 6.0-7.5, Temperature 72-78°F",
    breedingInfo: "Egg layers, prefer shallow water for breeding.",
    behavior: "Active bottom-dweller, enjoys being in groups.",
    careLevel: "Easy",
    dietaryRestrictions: "None",
    nativeHabitat: "Streams and small rivers in South America.",
    stockingRecommendations: "Best kept in groups of at least 5-6.",
    specialConsiderations: "Sensitive to sharp substrate and poor water quality.",
    minTankSize: 20,
  },
  {
    name: "Angelfish",
    count: 2,
    role: "predator",
    type: "Freshwater",
    description: "Elegant fish with tall fins, popular in larger community tanks.",
    feedingHabits: "Omnivore, enjoys flakes, pellets, and live food.",
    tankRequirements: "Needs a tall tank due to its body shape.",
    compatibility: "Semi-aggressive, especially during breeding.",
    lifespan: "10 years",
    size: "6 inches",
    waterParameters: "pH 6.5-7.0, Temperature 76-82°F",
    breedingInfo: "Pairs form monogamous relationships and guard eggs.",
    behavior: "Can become territorial, especially when breeding.",
    careLevel: "Moderate",
    dietaryRestrictions: "None",
    nativeHabitat: "Slow-moving rivers in the Amazon Basin.",
    stockingRecommendations: "Best kept with fish that are not fin-nippers.",
    specialConsiderations: "Sensitive to water quality; frequent changes required.",
    minTankSize: 30,
  },
  {
    name: "Guppy",
    count: 6,
    role: "community",
    type: "Freshwater",
    description: "Small, colorful livebearer that is easy to care for.",
    feedingHabits: "Omnivore, feeds on flakes and small live foods.",
    tankRequirements: "Can thrive in small tanks with plants.",
    compatibility: "Peaceful and great for community tanks.",
    lifespan: "2-3 years",
    size: "2 inches",
    waterParameters: "pH 7.0-8.0, Temperature 72-82°F",
    breedingInfo: "Livebearer, breeds readily in community tanks.",
    behavior: "Very active, enjoys swimming in groups.",
    careLevel: "Easy",
    dietaryRestrictions: "None",
    nativeHabitat: "Freshwater streams in Central and South America.",
    stockingRecommendations: "Keep in groups, and males can be quite vibrant in color.",
    specialConsiderations: "Prolific breeders; population control may be needed.",
    minTankSize: 5,
  },
  {
    name: "Common Pleco",
    count: 1,
    role: "scavenger",
    type: "Freshwater",
    description: "Popular algae-eating fish, known for its sucker mouth.",
    feedingHabits: "Herbivore, feeds on algae and sinking wafers.",
    tankRequirements: "Requires a large tank with plenty of hiding spots.",
    compatibility: "Peaceful, though its size can be intimidating to smaller fish.",
    lifespan: "15-20 years",
    size: "Up to 24 inches in the wild, 12-18 inches in aquariums.",
    waterParameters: "pH 6.5-7.5, Temperature 72-82°F",
    breedingInfo: "Rarely breeds in home aquariums.",
    behavior: "Nocturnal, often hides during the day.",
    careLevel: "Moderate",
    dietaryRestrictions: "Requires supplemental algae wafers or vegetables.",
    nativeHabitat: "Rivers and streams in South America.",
    stockingRecommendations: "Keep in large tanks of at least 100 gallons.",
    specialConsiderations: "Can grow extremely large; often outgrows home aquariums and may require rehoming to a large tank.",
    minTankSize: 100,
  },
  {
    name: "Zebra Danio",
    count: 6,
    role: "schooling",
    type: "Freshwater",
    description: "Hardy, active fish with distinctive horizontal stripes.",
    feedingHabits: "Omnivore, feeds on flake food, small live or frozen foods.",
    tankRequirements: "Can thrive in a variety of water conditions.",
    compatibility: "Very peaceful and great for community tanks.",
    lifespan: "5 years",
    size: "2 inches",
    waterParameters: "pH 6.5-7.5, Temperature 64-77°F",
    breedingInfo: "Egg scatterer, easy to breed in captivity.",
    behavior: "Active swimmers, often darting around the tank.",
    careLevel: "Easy",
    dietaryRestrictions: "None",
    nativeHabitat: "Streams and rivers in India and Bangladesh.",
    stockingRecommendations: "Keep in schools of 6 or more.",
    specialConsiderations: "Very hardy and good for beginners.",
    minTankSize: 10,
  }
];

const saltwaterFishList = [
  {
    name: "Clownfish",
    count : 1,
    role: "community",
    type: "Saltwater",
    description: "Popular and hardy saltwater fish known for its symbiotic relationship with anemones.",
    feedingHabits: "Omnivore, feeds on flake food, frozen shrimp, and pellets.",
    tankRequirements: "Prefers reef tanks with live rock and anemones.",
    compatibility: "Peaceful, can be territorial towards other clownfish.",
    lifespan: "5-10 years",
    size: "4 inches",
    waterParameters: "pH 8.0-8.4, Temperature 75-82°F, Salinity 1.023-1.025",
    breedingInfo: "Egg layers; males care for eggs.",
    behavior: "Bold and territorial, especially around their host anemone.",
    careLevel: "Easy",
    dietaryRestrictions: "None",
    nativeHabitat: "Shallow reefs in the Indo-Pacific.",
    stockingRecommendations: "Best kept in pairs or small groups.",
    specialConsiderations: "May become aggressive towards other clownfish species.",
    minTankSize: 20,
  },
  {
    name: "Blue Tang",
    count : 1,
    role: "schooling",
    type: "Saltwater",
    description: "Bright blue fish with yellow tail, made famous by the movie 'Finding Nemo'.",
    feedingHabits: "Herbivore, feeds on algae and spirulina-based foods.",
    tankRequirements: "Needs large tanks with lots of swimming space.",
    compatibility: "Peaceful, but can be aggressive towards other tangs.",
    lifespan: "8-20 years",
    size: "12 inches",
    waterParameters: "pH 8.0-8.4, Temperature 75-82°F, Salinity 1.023-1.025",
    breedingInfo: "Rarely bred in home aquariums.",
    behavior: "Active swimmer, enjoys open space.",
    careLevel: "Moderate",
    dietaryRestrictions: "Requires regular feedings of algae or plant-based food.",
    nativeHabitat: "Coral reefs in the Pacific Ocean.",
    stockingRecommendations: "Best kept singly unless in a very large tank.",
    specialConsiderations: "Susceptible to marine ich (Cryptocaryon).",
    minTankSize: 100,
  },
  {
    name: "Royal Gramma",
    count : 1,
    role: "community",
    type: "Saltwater",
    description: "Colorful fish with purple front half and yellow rear half, ideal for small reef tanks.",
    feedingHabits: "Carnivore, feeds on mysis shrimp, brine shrimp, and pellets.",
    tankRequirements: "Thrives in reef tanks with plenty of hiding spaces.",
    compatibility: "Peaceful, but can be territorial in smaller tanks.",
    lifespan: "5 years",
    size: "3 inches",
    waterParameters: "pH 8.1-8.4, Temperature 72-78°F, Salinity 1.023-1.025",
    breedingInfo: "Egg layers, males guard the eggs.",
    behavior: "Shy but territorial, will defend its cave.",
    careLevel: "Easy",
    dietaryRestrictions: "None",
    nativeHabitat: "Coral reefs in the Caribbean Sea.",
    stockingRecommendations: "Can be kept with other peaceful reef fish.",
    specialConsiderations: "May become aggressive towards fish of a similar shape or color.",
    minTankSize: 30,
  },
  {
    name: "Yellow Tang",
    count : 1,
    role: "herbivore",
    type: "Saltwater",
    description: "Bright yellow fish, popular for algae control in reef tanks.",
    feedingHabits: "Herbivore, feeds on algae and seaweed.",
    tankRequirements: "Needs large tanks with open swimming space and live rock.",
    compatibility: "Peaceful, but may become territorial towards other tangs.",
    lifespan: "10 years",
    size: "8 inches",
    waterParameters: "pH 8.1-8.4, Temperature 75-82°F, Salinity 1.023-1.025",
    breedingInfo: "Difficult to breed in captivity.",
    behavior: "Active swimmer, prefers open spaces with hiding places.",
    careLevel: "Moderate",
    dietaryRestrictions: "Requires regular algae or seaweed supplementation.",
    nativeHabitat: "Coral reefs in the Pacific Ocean, especially Hawaii.",
    stockingRecommendations: "Best kept singly unless in large tanks.",
    specialConsiderations: "Highly active, requires plenty of swimming room.",
    minTankSize: 75,
  },
  {
    name: "Mandarin Dragonet",
    count : 1,
    role: "predator",
    type: "Saltwater",
    description: "Colorful fish known for its intricate pattern and vibrant colors.",
    feedingHabits: "Carnivore, primarily feeds on live copepods.",
    tankRequirements: "Prefers reef tanks with live rock and a thriving copepod population.",
    compatibility: "Peaceful, can be kept with other non-aggressive fish.",
    lifespan: "5 years",
    size: "3 inches",
    waterParameters: "pH 8.1-8.4, Temperature 72-78°F, Salinity 1.023-1.025",
    breedingInfo: "Spawning in captivity is rare but possible.",
    behavior: "Slow-moving and peaceful, prefers hiding in rocks.",
    careLevel: "Difficult",
    dietaryRestrictions: "Must have a constant supply of live copepods.",
    nativeHabitat: "Coral reefs in the Pacific Ocean.",
    stockingRecommendations: "Should only be kept in well-established tanks with abundant live food.",
    specialConsiderations: "Very difficult to feed; needs a large copepod population or frequent supplementation.",
    minTankSize: 30,
  },
  {
    name: "Firefish Goby",
    count : 1,
    role: "community",
    type: "Saltwater",
    description: "Small, slender fish with a brilliant red/orange back half and elongated dorsal fin.",
    feedingHabits: "Carnivore, feeds on brine shrimp, mysis shrimp, and small pellets.",
    tankRequirements: "Requires a covered tank due to its tendency to jump.",
    compatibility: "Very peaceful and great for reef tanks.",
    lifespan: "3-5 years",
    size: "3 inches",
    waterParameters: "pH 8.1-8.4, Temperature 72-78°F, Salinity 1.023-1.025",
    breedingInfo: "Rarely bred in captivity.",
    behavior: "Shy and peaceful, prefers hiding spots in live rock.",
    careLevel: "Easy",
    dietaryRestrictions: "None",
    nativeHabitat: "Tropical reefs in the Indo-Pacific.",
    stockingRecommendations: "Best kept singly or in pairs.",
    specialConsiderations: "Can be skittish and may jump out of open tanks.",
    minTankSize: 20,
  }
];





const AddFishCard: React.FC<AddFishCardProps> = ({ open, onClose, aquarium, onAddFish }) => {
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

  const fishList = aquarium.type === 'Freshwater' ? freshwaterFishList : saltwaterFishList;

  const existingFishNames = aquarium.species.map(fish => fish.name.toLowerCase());

  const availableFish = fishList.filter(fish => !existingFishNames.includes(fish.name.toLowerCase()));

  // Filter fish list based on role, care level, minimum tank size, and search query
  const filteredFishList = availableFish.filter(fish => {
    return (
      (!roleFilter || fish.role === roleFilter) &&
      (!careLevelFilter || fish.careLevel === careLevelFilter) &&  // Filter by care level
      (!minTankSizeFilter || Number(fish.minTankSize) <= minTankSizeFilter) &&  // Ensure fish tank size <= user's tank size
      (!searchQuery || fish.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleSelectFish = (fish: Fish) => {
    const isSelected = selectedFishList.some(f => f.name === fish.name);
    if (isSelected) {
      setSelectedFishList(selectedFishList.filter(f => f.name !== fish.name));  
    } else {
      setSelectedFishList([...selectedFishList, fish]);  
    }
  };

  const isFishSelected = (fish: Fish) => {
    return selectedFishList.some(f => f.name === fish.name);
  };

  // Handle opening the fish info card (replace existing modal with FishInfoCard)
  const handleFishClick = (fish: Fish) => {
    setSelectedFish(fish);
    setInfoOpen(true);  // Open the FishInfoCard modal
  };

  const handleCloseInfo = () => {
    setInfoOpen(false);  
    setSelectedFish(null);  
  };

  const handleAddAllFish = () => {
    onAddFish(selectedFishList);  
    setSelectedFishList([]);  
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
            <AIChatInterface showChat={showChat} onClose={() => setShowChat(false)} aquarium={aquarium} />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="secondary">Cancel</Button>
        </DialogActions>

        {/* Fish Info Modal using FishInfoCard */}
        {selectedFish && (
          <FishInfoCard 
            open={infoOpen} 
            onClose={handleCloseInfo} 
            fish={selectedFish} 
          />
        )}
      </Dialog>
    </>
  );
};

export default AddFishCard;