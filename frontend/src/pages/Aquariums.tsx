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
import { Button, Box, AppBar, Toolbar, Typography, Grid, Card, CardContent } from '@mui/material';

interface Aquarium {
  id: string;  // Changed to string for UUID support
  name: string;
  type: string;
  size: string;
  species: string[];
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
          equipment: ["Air Pump"]
        },
        {
          id: "bfa7d8f1-8d8e-477d-b8b7-43dfec6760a9",
          name: "Saltwater Reef",
          type: "Saltwater",
          size: "75",
          species: ["Clownfish", "Blue Tang"],
          equipment: ["Protein Skimmer", "Wave Maker"]
        },
        {
          id: "e4ad3b5f-74eb-4b19-97f9-d2f53f58741a",
          name: "Planted Tank",
          type: "Freshwater",
          size: "40",
          species: ["Angelfish"],
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
                  boxShadow: 'none',
                  borderBottom: '2px solid #333', // Dark underline
                  paddingBottom: '10px', // Space under text
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

              {/* Grid of Cards with Subtle Hover Effect */}
              <Grid container spacing={3} sx={{ marginTop: '20px' }}>
                {/* Fish Card (larger) */}
                <Grid item xs={12} md={6} lg={6}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
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
                  </Card>
                </Grid>

                {/* Plant Card (larger) */}
                <Grid item xs={12} md={6} lg={6}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.01)', // Subtle scaling
                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.12)', // Softer shadow
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">Plants</Typography>
                      <Typography variant="body1">No plants added yet.</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Equipment Card */}
                <Grid item xs={12} md={6} lg={4}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
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
                  </Card>
                </Grid>

                {/* Aquarium Parameters Card */}
                <Grid item xs={12} md={6} lg={8}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
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
                  </Card>
                </Grid>
              </Grid>
            </>
          )}
        </Box>

        {/* Bottom Section for Aquarium Insights and Add New Aquarium */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          {/* Aquarium Insights (at the bottom) */}
          <Card 
            sx={{ 
              width: '100%', 
              height: '150px',
              transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
              '&:hover': {
                transform: 'scale(1.01)', // Subtle scaling
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.12)', // Softer shadow
              }
            }}
          >
            <CardContent>
              <Typography variant="h6">Aquarium Insights (AI-Powered)</Typography>
              <Typography variant="body1">
                Placeholder response
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </div>
    </div>
  );
};

export default Aquariums;
