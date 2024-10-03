/**
 * @file Aquariums.tsx
 * @author Steven Stansberry
 * @location /src/pages/Aquariums.tsx
 * @description 
 * This page renders the user's aquarium dashboard, displaying a list of existing aquariums and a button to add new aquariums.
 * It integrates with the AquariumSidebar and AquariumWizard components to manage aquarium data and provide an interactive 
 * wizard for creating new aquariums.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../util/AuthContext';
import AquariumSidebar from '../components/aquarium-components/AquariumSidebar';
import AquariumWizard from '../components/aquarium-components/aquarium-wizard-components/AquariumWizard';
import { Button, Box, AppBar, Toolbar, Typography, Grid, Card, CardContent, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle'; // Import plus icon

interface Aquarium {
  id: string;  // Changed to string for UUID support
  name: string;
  type: string;
  size: string;
  species: string[];
  plants: string[];
  equipment: string[];
}

const Aquariums: React.FC = () => {
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [currentAquarium, setCurrentAquarium] = useState<Aquarium | null>(null);

  const { user } = useAuth();

  const handleOpenWizard = () => {
    setShowWizard(true);
  };

  useEffect(() => {
    const fetchAquariums = async () => {
      const mockAquariums: Aquarium[] = [
        {
          id: "51f8ee76-4f84-44ac-b29e-04db8f90cb2e",
          name: "Test Tank",
          type: "Freshwater",
          size: "55",
          species: ["Tetra"],
          plants: ["Anubias"],
          equipment: ["Air Pump"]
        },
        {
          id: "bfa7d8f1-8d8e-477d-b8b7-43dfec6760a9",
          name: "Saltwater Reef",
          type: "Saltwater",
          size: "75",
          species: ["Clownfish", "Blue Tang"],
          plants: [],
          equipment: ["Protein Skimmer", "Wave Maker"]
        },
        {
          id: "e4ad3b5f-74eb-4b19-97f9-d2f53f58741a",
          name: "Planted Tank",
          type: "Freshwater",
          size: "40",
          species: ["Angelfish"],
          plants: ["Anubias"],
          equipment: ["CO2 System", "Heater"]
        }
      ];
      setAquariums(mockAquariums);
    };

    fetchAquariums();
  }, []);

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
        {/* Main Content: Fish, Plants, Equipment, Parameters */}
        <Box sx={{ flexGrow: 1 }}>
          {showWizard && (
            <AquariumWizard onClose={() => setShowWizard(false)} />
          )}

          {aquariums.length === 0 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowWizard(true)}
              >
                + Create New Aquarium
              </Button>
            </Box>
          )}

          {currentAquarium && (
            <>
              {/* Static Navbar for Current Aquarium Details */}
              <AppBar
                position="static"
                color="default"
                sx={{
                  borderBottom: '2px solid #333', // Dark underline
                  paddingBottom: '10px', // Space under text
                  border: '1px solid #e0e0e0',
                  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
                  borderRadius: '8px',  
                  backgroundColor: '#fafafa',
                  '&:hover': {
                    transform: 'scale(1.01)', // Subtle scaling
                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.12)', // Softer shadow
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

              {/* Grid of Cards with Subtle Hover Effect and Plus Icon */}
              <Grid container spacing={3} sx={{ marginTop: '20px' }}>
                {/* Fish Card (larger) */}
                <Grid item xs={12} md={6} lg={6}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      position: 'relative', 
                      transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                      border: '1px solid #e0e0e0',
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
                      borderRadius: '8px',  
                      backgroundColor: '#fafafa',
                      '&:hover': {
                        transform: 'scale(1.01)',  // Subtle scaling
                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.12)', // Softer shadow
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">Fish</Typography>
                      <Typography variant="body1">
                        {currentAquarium.species.join(', ')}
                      </Typography>
                    </CardContent>
                    {/* Plus Icon */}
                    <IconButton 
                      color="primary" 
                      sx={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px', 
                        color: '#B0BEC5',  
                        fontSize: '20px'  
                      }}
                      aria-label="add fish"
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </Card>
                </Grid>

                {/* Plant Card (larger) */}
                <Grid item xs={12} md={6} lg={6}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      position: 'relative', // To position the plus icon
                      transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                      border: '1px solid #e0e0e0',
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
                      borderRadius: '8px',  
                      backgroundColor: '#fafafa',
                      '&:hover': {
                        transform: 'scale(1.01)', // Subtle scaling
                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.12)', // Softer shadow
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">Plants</Typography>
                      {/* Display the plants or a message if no plants are added */}
                      <Typography variant="body1">
                        {currentAquarium.plants.length > 0 
                          ? currentAquarium.plants.join(', ')  // List plants if available
                          : 'No plants added yet.'}  
                      </Typography>
                    </CardContent>
                    {/* Plus Icon */}
                    <IconButton 
                      color="primary" 
                      sx={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px', 
                        color: '#B0BEC5',  
                        fontSize: '20px'  
                      }}
                      aria-label="add plant"
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </Card>
                </Grid>
                {/* Equipment Card */}
                <Grid item xs={12} md={6} lg={4}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      position: 'relative', // To position the plus icon
                      transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                      border: '1px solid #e0e0e0',
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
                      borderRadius: '8px',  
                      backgroundColor: '#fafafa',
                      '&:hover': {
                        transform: 'scale(1.01)', // Subtle scaling
                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.12)', // Softer shadow
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">Equipment</Typography>
                      <Typography variant="body1">
                        {currentAquarium.equipment.join(', ')}
                      </Typography>
                    </CardContent>
                    {/* Plus Icon */}
                    <IconButton 
                      color="primary" 
                      sx={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px', 
                        color: '#B0BEC5',  
                        fontSize: '20px'  
                      }}
                      aria-label="add equipment"
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </Card>
                </Grid>

                {/* Aquarium Parameters Card */}
                <Grid item xs={12} md={6} lg={8}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      position: 'relative', // To position the plus icon
                      transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                      border: '1px solid #e0e0e0',
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
                      borderRadius: '8px',  
                      backgroundColor: '#fafafa',
                      '&:hover': {
                        transform: 'scale(1.01)', // Subtle scaling
                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.12)', // Softer shadow
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">Aquarium Parameters</Typography>
                      <Typography variant="body1">
                        Temperature: 78°F<br />
                        pH Level: 7.2<br />
                        Ammonia: 0 ppm
                      </Typography>
                    </CardContent>
                    {/* Plus Icon */}
                    <IconButton 
                      color="primary" 
                      sx={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px', 
                        color: '#B0BEC5',  
                        fontSize: '20px'  
                      }}
                      aria-label="add parameters"
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}
        </Box>

        {/* Bottom Section for Aquarium Insights and Add New Aquarium */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          {/* Aquarium Insights (at the bottom, no plus icon) */}
          <Card 
            sx={{ 
              width: '100%', 
              height: '150px',
              transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
              border: '1px solid #e0e0e0',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
              borderRadius: '8px',  
              backgroundColor: '#fafafa',
              '&:hover': {
                transform: 'scale(1.01)', // Subtle scaling
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.12)', // Softer shadow
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
