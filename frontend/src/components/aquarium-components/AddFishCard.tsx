import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import AIChatInterface from '../AIChatInterface';  // Dummy AI chat component
import { Aquarium, Fish } from '../../interfaces/Aquarium'; 

interface AddFishCardProps {
  open: boolean;
  onClose: () => void;
  aquarium: Aquarium;  // Pass the entire Aquarium object
  onAddFish: (fish: Fish) => void;
}

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
  }
];

const saltwaterFishList = [
  {
    name: "Clownfish",
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
  },
  {
    name: "Blue Tang",
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
  },
  {
    name: "Royal Gramma",
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
  },
  {
    name: "Yellow Tang",
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
  },
  {
    name: "Mandarin Dragonet",
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
  },
  {
    name: "Firefish Goby",
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
  }
];



const AddFishCard: React.FC<AddFishCardProps> = ({ open, onClose, aquarium, onAddFish }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Freshwater');  // Default to Freshwater
  const [count, setCount] = useState(1);
  const [role, setRole] = useState('schooling');
  const [showChat, setShowChat] = useState(false);  // State for toggling AI chat

  // Handle adding the fish and resetting the form
  const handleAddFish = () => {
    if (name && count > 0) {
      // Find the fish from the list (based on the selected type)
      const fishList = type === 'Freshwater' ? freshwaterFishList : saltwaterFishList;
      const selectedFish = fishList.find(fish => fish.name === name);

      if (selectedFish) {
        // Create a new Fish object with the full details
        const fish: Fish = {
          ...selectedFish,  // Use the full details from the predefined list
          count,            // Override the count with the user input
          role              // Override the role with the user input
        };

        onAddFish(fish);  // Add the new fish to the list
        setName('');      // Reset fields
        setCount(1);
        setType('Freshwater');
        setRole('schooling');
        onClose();        // Close the modal
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Fish</DialogTitle>
      <DialogContent>
        <Box>
          {/* Fish Name */}
          <TextField
            label="Fish Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="Enter fish species name"
          />

          {/* Fish Type (Freshwater/Saltwater) */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value as string)}>
              <MenuItem value="Freshwater">Freshwater</MenuItem>
              <MenuItem value="Saltwater">Saltwater</MenuItem>
            </Select>
          </FormControl>

          {/* Fish Count */}
          <TextField
            label="Count"
            type="number"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10))}
            fullWidth
            margin="normal"
          />

          {/* Fish Role (Schooling, Predator, etc.) */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value as string)}>
              <MenuItem value="schooling">Schooling</MenuItem>
              <MenuItem value="predator">Predator</MenuItem>
              <MenuItem value="scavenger">Scavenger</MenuItem>
              <MenuItem value="community">Community</MenuItem>
              <MenuItem value="breeder">Breeder</MenuItem>
            </Select>
          </FormControl>

          {/* Display Tank Size and Type Info */}
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Tank Size: {aquarium.size} gallons ({aquarium.type}) - Helps filter suitable species.
          </Typography>

          {/* AI Chat Interface */}
          <Box mt={2}>
            <Button variant="outlined" onClick={() => setShowChat(!showChat)}>
              {showChat ? 'Hide' : 'Show'} AI Suggestions
            </Button>
            {/* Pass the entire aquarium data to the AIChatInterface for personalized suggestions */}
            <AIChatInterface showChat={showChat} onClose={() => setShowChat(false)} aquarium={aquarium} />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleAddFish} color="primary" variant="contained">Add Fish</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFishCard;