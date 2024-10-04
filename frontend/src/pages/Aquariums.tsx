import React, { useState, useEffect } from 'react';
import { useAuth } from '../util/AuthContext';
import AquariumSidebar from '../components/aquarium-components/AquariumSidebar';
import AquariumWizard from '../components/aquarium-components/aquarium-wizard-components/AquariumWizard';
import { Box, AppBar, Toolbar, Typography, Grid, IconButton, CardContent, Card } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AquariumParameters from '../components/aquarium-components/AquariumParameters';

// Import the refactored card components
import FishCard from '../components/aquarium-components/FishCard';
import PlantCard from '../components/aquarium-components/PlantCard';
import EquipmentCard from '../components/aquarium-components/EquipmentCard';
import ParametersCard from '../components/aquarium-components/ParametersCard';

interface Aquarium {
  id: string;   // UUID
  name: string; // Aquarium name
  type: string; // Freshwater, Saltwater, etc.
  size: string; // Size in gallons
  species: { name: string; count: number }[];  // Species with name and count
  plants: { name: string; count: number }[];   // Plants with name and count
  equipment: string[]; // List of equipment as strings
  parameters?: { temperature: number; ph: number; ammonia: number };  // Add parameters to the aquarium interface
}

const Aquariums: React.FC = () => {
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [currentAquarium, setCurrentAquarium] = useState<Aquarium | null>(null);
  const [showParametersOverlay, setShowParametersOverlay] = useState(false);

  const { user } = useAuth();

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
          species: [{ name: "Tetra", count: 5 }],
          plants: [{ name: "Anubias", count: 3 }],
          equipment: ["Air Pump"],
          parameters: { temperature: 78, ph: 7.2, ammonia: 0 }
        },
        {
          id: "bfa7d8f1-8d8e-477d-b8b7-43dfec6760a9",
          name: "Saltwater Reef",
          type: "Saltwater",
          size: "75",
          species: [
            { name: "Clownfish", count: 2 },
            { name: "Blue Tang", count: 1 }
          ],
          plants: [],
          equipment: ["Protein Skimmer", "Wave Maker"],
          parameters: { temperature: 77, ph: 8.2, ammonia: 0.2 }
        },
        {
          id: "e4ad3b5f-74eb-4b19-97f9-d2f53f58741a",
          name: "Planted Tank",
          type: "Freshwater",
          size: "40",
          species: [{ name: "Angelfish", count: 1 }],
          plants: [{ name: "Anubias", count: 5 }],
          equipment: ["CO2 System", "Heater"],
          parameters: { temperature: 80, ph: 6.8, ammonia: 0 }
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
              <Grid container spacing={3} sx={{ marginTop: '20px' }}>
                {/* Fish Card */}
                <Grid item xs={12} md={6} lg={6}>
                  <FishCard species={currentAquarium.species} />
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
                parameters={currentAquarium.parameters || { temperature: 0, ph: 0, ammonia: 0 }}
                onUpdateParameters={handleUpdateParameters}
                aquariumData={currentAquarium}  // Pass the whole aquarium data for suggested parameters
                />
                </Grid>
              </Grid>
            </>
          )}
        </Box>

        {/* Modal for Editing Parameters */}
        {showParametersOverlay && currentAquarium && (
          <AquariumParameters
            parameters={currentAquarium.parameters || { temperature: 0, ph: 0, ammonia: 0 }}
            onUpdateParameters={handleUpdateParameters}
            onClose={() => setShowParametersOverlay(false)}  // Close the overlay on cancel or save
          />
        )}

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
