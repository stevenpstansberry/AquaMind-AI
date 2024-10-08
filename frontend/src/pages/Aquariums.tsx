import React, { useState, useEffect } from 'react';
import { useAuth } from '../util/AuthContext';
import AquariumSidebar from '../components/aquarium-components/AquariumSidebar';
import AquariumWizard from '../components/aquarium-components/aquarium-wizard-components/AquariumWizard';
import { Box, AppBar, Toolbar, Typography, Grid, IconButton, CardContent, Card } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AquariumParameters from '../components/aquarium-components/AquariumParameters';
import { Aquarium } from '../interfaces/Aquarium';

// Import the refactored card components
import FishCard from '../components/aquarium-components/FishCard';
import PlantCard from '../components/aquarium-components/PlantCard';
import EquipmentCard from '../components/aquarium-components/EquipmentCard';
import ParametersCard from '../components/aquarium-components/ParametersCard';


const Aquariums: React.FC = () => {
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [currentAquarium, setCurrentAquarium] = useState<Aquarium | null>(null);

  const handleOpenWizard = () => {
    setShowWizard(true);
  };

// Fetch aquarium data (mock)
useEffect(() => {
  const fetchAquariums = async () => {
    const mockAquariums: Aquarium[] = [
      {
        id: "51f8ee76-4f84-44ac-b29e-04db8f90cb2e",
        name: "Test Tank",
        type: "Freshwater",
        size: "55",
        species: [
          {
            name: "Tetra",
            count: 5,
            role: "schooling",
            type: "Freshwater",
            description: "Small and peaceful fish that swim in schools.",
            feedingHabits: "Omnivorous, enjoys small flake food or micro-pellets.",
            tankRequirements: "Well-planted tank with hiding spaces.",
            compatibility: "Highly compatible with other peaceful fish.",
            lifespan: "5-7 years",
            size: "1.5 inches",
            waterParameters: "pH 6.5-7.5, temperature 72-78°F",
            breedingInfo: "Egg layers; provide fine-leaved plants for spawning.",
            behavior: "Peaceful, swims in groups.",
            careLevel: "Easy",
            nativeHabitat: "South America (Amazon Basin)",
            stockingRecommendations: "Should be kept in groups of at least 6.",
            minTankSize: 20,
          },
          {
            name: "Corydoras",
            count: 3,
            role: "scavenger",
            type: "Freshwater",
            description: "Bottom-dwelling fish that help keep the tank clean.",
            feedingHabits: "Eats sinking pellets and leftover food.",
            tankRequirements: "Soft substrate to protect sensitive barbels.",
            compatibility: "Peaceful, good with other non-aggressive species.",
            lifespan: "10-15 years",
            size: "2-3 inches",
            waterParameters: "pH 6.5-7.8, temperature 72-78°F",
            breedingInfo: "Egg layers; breeding can be triggered by cooler water changes.",
            behavior: "Social, prefers groups.",
            careLevel: "Easy",
            nativeHabitat: "South America",
            stockingRecommendations: "Best kept in groups of 4 or more.",
            minTankSize: 30,
          }
        ],
        plants: [
          { name: "Anubias", count: 3, role: "slow-growing" }
        ],
        equipment: [
          { name: "Air Pump", type: "filtration" },
          { name: "Heater", type: "heating" }
        ],
        parameters: {
          temperature: 78,
          ph: 7.2,
          ammonia: 0,
          nitrite: 0,
          nitrate: 20,
          gh: 8,
          kh: 5,
        }
      },
      {
        id: "bfa7d8f1-8d8e-477d-b8b7-43dfec6760a9",
        name: "Saltwater Reef",
        type: "Saltwater",
        size: "75",
        species: [
          {
            name: "Clownfish",
            count: 2,
            role: "community",
            type: "Saltwater",
            description: "Popular, colorful fish known for its symbiotic relationship with anemones.",
            feedingHabits: "Omnivorous, enjoys flake food, pellets, and frozen foods.",
            tankRequirements: "Requires live rock for hiding and anemone for hosting.",
            compatibility: "Compatible with other peaceful fish.",
            lifespan: "6-10 years",
            size: "3-4 inches",
            waterParameters: "pH 8.1-8.4, temperature 74-78°F, salinity 35ppt",
            breedingInfo: "Pairs can breed in captivity with the right conditions.",
            behavior: "Territorial but peaceful, especially near an anemone.",
            careLevel: "Moderate",
            nativeHabitat: "Indo-Pacific reefs",
            stockingRecommendations: "Best kept in pairs.",
            minTankSize: 30,
          },
          {
            name: "Blue Tang",
            count: 1,
            role: "schooling",
            type: "Saltwater",
            description: "Bright blue, active fish known for its bold coloring.",
            feedingHabits: "Herbivorous, primarily algae-based diet.",
            tankRequirements: "Needs a large tank with plenty of swimming room.",
            compatibility: "Generally peaceful but can be aggressive towards other tangs.",
            lifespan: "8-12 years",
            size: "12 inches",
            waterParameters: "pH 8.1-8.4, temperature 75-80°F, salinity 35ppt",
            breedingInfo: "Rarely bred in captivity.",
            behavior: "Active swimmer, needs a lot of space.",
            careLevel: "Challenging",
            nativeHabitat: "Indo-Pacific reefs",
            stockingRecommendations: "Needs at least a 75-gallon tank.",
            minTankSize: 75,
          }
        ],
        plants: [],
        equipment: [
          { name: "Protein Skimmer", type: "filtration" },
          { name: "Wave Maker", type: "filtration" },
          { name: "Heater", type: "heating" }
        ],
        parameters: {
          temperature: 77,
          ph: 8.2,
          ammonia: 0.2,
          nitrite: 0.05,
          nitrate: 5,
          salinity: 35,
          calcium: 420,
          magnesium: 1300,
          alkalinity: 8,
          phosphate: 0.02,
        }
      },
      {
        id: "e4ad3b5f-74eb-4b19-97f9-d2f53f58741a",
        name: "Planted Tank",
        type: "Freshwater",
        size: "40",
        species: [
          {
            name: "Angelfish",
            count: 1,
            role: "predator",
            type: "Freshwater",
            description: "Graceful, semi-aggressive cichlid with long fins.",
            feedingHabits: "Omnivorous, enjoys flakes, pellets, and frozen foods.",
            tankRequirements: "Tall tank with plants for shelter.",
            compatibility: "Can be aggressive with smaller fish.",
            lifespan: "10-12 years",
            size: "6 inches",
            waterParameters: "pH 6.5-7.5, temperature 75-82°F",
            breedingInfo: "Egg layers; form monogamous pairs for breeding.",
            behavior: "Territorial, especially during breeding.",
            careLevel: "Moderate",
            nativeHabitat: "Amazon Basin",
            stockingRecommendations: "Keep in groups with caution.",
            minTankSize: 30,
          },
          {
            name: "Neon Tetra",
            count: 10,
            role: "schooling",
            type: "Freshwater",
            description: "Tiny, vibrant fish with iridescent blue and red stripes.",
            feedingHabits: "Omnivorous, enjoys micro-pellets and small flake food.",
            tankRequirements: "Well-planted tank with soft water.",
            compatibility: "Best kept in large schools, peaceful community fish.",
            lifespan: "5-8 years",
            size: "1.5 inches",
            waterParameters: "pH 6.0-7.0, temperature 70-81°F",
            breedingInfo: "Egg layers; require very soft, acidic water to breed.",
            behavior: "Schooling, peaceful.",
            careLevel: "Easy",
            nativeHabitat: "Amazon Basin",
            stockingRecommendations: "Best kept in groups of 6 or more.",
            minTankSize: 10,
          }
        ],
        plants: [
          { name: "Anubias", count: 5, role: "slow-growing" },
          { name: "Java Fern", count: 2, role: "slow-growing" }
        ],
        equipment: [
          { name: "CO2 System", type: "other" },
          { name: "Heater", type: "heating" },
          { name: "Filter", type: "filtration" }
        ],
        parameters: {
          temperature: 80,
          ph: 6.8,
          ammonia: 0,
          nitrite: 0,
          nitrate: 15,
          gh: 7,
          kh: 4,
          co2: 20,
        }
      }
    ];    
    setAquariums(mockAquariums);
  };

  fetchAquariums();
}, []);






  const handleUpdateParameters = (newParams: { temperature: number; ph: number; ammonia: number }) => {
    if (currentAquarium) {
      setCurrentAquarium({
        ...currentAquarium,
        parameters: newParams,  // Update parameters
      });
    }
  };
  
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {aquariums.length > 0 && (
        <AquariumSidebar
          aquariums={aquariums}
          onOpenWizard={handleOpenWizard}
          setCurrentAquarium={setCurrentAquarium}
          currentAquarium={currentAquarium}
        />
      )}

      <div style={{ marginLeft: aquariums.length > 0 ? '250px' : '0', padding: '20px', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1 }}>
          {showWizard && <AquariumWizard onClose={() => setShowWizard(false)} />}

          {currentAquarium && (
            <>
              {/* Static Navbar for Current Aquarium Details */}
              <AppBar
                position="static"
                color="default"
                sx={{
                  borderBottom: '2px solid #333',
                  paddingBottom: '10px',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
                  borderRadius: '8px',
                  backgroundColor: '#fafafa',
                  '&:hover': {
                    transform: 'scale(1.01)',
                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.12)',
                  }
                }}
              >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ marginRight: '20px' }}>
                    Aquarium Name: {currentAquarium.name}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ marginRight: '20px' }}>
                    Type: {currentAquarium.type}
                  </Typography>
                  <Typography variant="subtitle1">
                    Size: {currentAquarium.size} gallons
                  </Typography>
                </Toolbar>
              </AppBar>

              {/* Grid of Cards */}
              <Grid container spacing={3} sx={{ marginTop: '20px' }} alignItems="flex-start">
                {/* Fish Card */}
                <Grid item xs={12} md={6} lg={6}>
                  {currentAquarium && <FishCard aquarium={currentAquarium} />}
                </Grid>

                {/* Plant Card */}
                <Grid item xs={12} md={6} lg={6}>
                  <PlantCard plants={currentAquarium.plants} />
                </Grid>

                {/* Equipment Card */}
                <Grid item xs={12} md={6} lg={4}>
                  <EquipmentCard equipment={currentAquarium.equipment} />
                </Grid>

                {/* Aquarium Parameters Card */}
                <Grid item xs={12} md={6} lg={8}>
                  <ParametersCard
                    parameters={{
                      temperature: currentAquarium.parameters?.temperature ?? 0,  // Fallback to 0 if undefined
                      ph: currentAquarium.parameters?.ph ?? 0,                   // Fallback to 0 if undefined
                      ammonia: currentAquarium.parameters?.ammonia ?? 0,          // Fallback to 0 if undefined
                      nitrite: currentAquarium.parameters?.nitrite,               // Leave undefined if not present
                      nitrate: currentAquarium.parameters?.nitrate,               // Leave undefined if not present
                      gh: currentAquarium.parameters?.gh,
                      kh: currentAquarium.parameters?.kh,
                      co2: currentAquarium.parameters?.co2,
                      salinity: currentAquarium.parameters?.salinity,
                      calcium: currentAquarium.parameters?.calcium,
                      magnesium: currentAquarium.parameters?.magnesium,
                      alkalinity: currentAquarium.parameters?.alkalinity,
                      phosphate: currentAquarium.parameters?.phosphate
                    }}
                    onUpdateParameters={handleUpdateParameters}
                    aquariumData={currentAquarium}  // Pass the whole aquarium data for suggested parameters
                  />
                </Grid>
              </Grid>
            </>
          )}
        </Box>

        {/* Bottom Section for Aquarium Insights */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <Card
            sx={{
              width: '100%',
              height: '150px',
              transition: 'transform 0.15s ease-in-out, boxShadow 0.15s ease-in-out',
              border: '1px solid #e0e0e0',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
              borderRadius: '8px',
              backgroundColor: '#fafafa',
              '&:hover': {
                transform: 'scale(1.01)',
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.12)',
              }
            }}
          >
            <CardContent>
              <Typography variant="h6">Aquarium Insights (AI-Powered)</Typography>
              <Typography variant="body1">
                Your tank's water temperature is optimal for Tetra species. Make sure to monitor pH levels regularly.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </div>
    </div>
  );
};

export default Aquariums;
