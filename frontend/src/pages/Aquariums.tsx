/**
 * @fileoverview The Aquariums component displays the list of aquariums and their details.
 * It allows users to view and edit aquarium parameters, add new aquariums, and displays a summary
 * of each selected aquarium, including fish, plants, and equipment information.
 * 
 * @file src/pages/Aquariums.tsx
 * @component
 * @requires ../util/AuthContext
 * @requires ../components/aquarium-components/AquariumSidebar
 * @requires ../components/aquarium-components/aquarium-wizard-components/AquariumWizard
 * @requires ../interfaces/Aquarium
 * @requires ../util/MockAquariums.json
 * 
 * @description The main page for displaying aquariums and their details. Fetches mock aquarium data and
 * displays it with various components like the sidebar, fish, plant, and equipment cards, and a wizard for creating new aquariums.
 * 
 * @returns {React.ReactElement} The rendered Aquariums component.
 * @function
 * @exports Aquariums
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../util/AuthContext';
import AquariumSidebar from '../components/aquarium-components/AquariumSidebar';
import AquariumWizard from '../components/aquarium-components/aquarium-wizard-components/AquariumWizard';
import { Box, AppBar, Toolbar, Typography, Grid, CardContent, Card } from '@mui/material';
import AquariumParameters from '../components/aquarium-components/AquariumParameters';
import { Aquarium } from '../interfaces/Aquarium';
import mockAquaData from '../util/MockAquariums.json';

// Import the refactored card components
import FishCard from '../components/aquarium-components/FishCard';
import PlantCard from '../components/aquarium-components/PlantCard';
import EquipmentCard from '../components/aquarium-components/EquipmentCard';
import ParametersCard from '../components/aquarium-components/ParametersCard';

const Aquariums: React.FC = () => {
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [currentAquarium, setCurrentAquarium] = useState<Aquarium | null>(null);

  /**
   * Opens the aquarium setup wizard.
   * 
   * @returns {void}
   */
  const handleOpenWizard = (): void => {
    setShowWizard(true);
  };

  /**
   * Fetches aquarium data (mock data used here) and sets it to the component state.
   * 
   * @returns {void}
   */
  useEffect(() => {
    const fetchAquariums = async () => {
      const mockAquariums: Aquarium[] = mockAquaData as Aquarium[];
      setAquariums(mockAquariums);
    };

    fetchAquariums();
  }, []);

  /**
   * Updates the parameters of the currently selected aquarium.
   * 
   * @param {Object} newParams - The new parameters to update the current aquarium with.
   * @param {number} newParams.temperature - The temperature of the water.
   * @param {number} newParams.ph - The pH level of the water.
   * @param {number} newParams.ammonia - The ammonia level of the water.
   * @returns {void}
   */
  const handleUpdateParameters = (newParams: { temperature: number; ph: number; ammonia: number }): void => {
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
                  <PlantCard aquarium={currentAquarium} />
                </Grid>

                {/* Equipment Card */}
                <Grid item xs={12} md={6} lg={4}>
                  <EquipmentCard aquarium={currentAquarium} />
                </Grid>

                {/* Aquarium Parameters Card */}
                <Grid item xs={12} md={6} lg={8}>
                  <ParametersCard
                    parameters={{
                      temperature: currentAquarium.parameters?.temperature ?? 0,
                      ph: currentAquarium.parameters?.ph ?? 0,
                      ammonia: currentAquarium.parameters?.ammonia ?? 0,
                      nitrite: currentAquarium.parameters?.nitrite,
                      nitrate: currentAquarium.parameters?.nitrate,
                      gh: currentAquarium.parameters?.gh,
                      kh: currentAquarium.parameters?.kh,
                      co2: currentAquarium.parameters?.co2,
                      salinity: currentAquarium.parameters?.salinity,
                      calcium: currentAquarium.parameters?.calcium,
                      magnesium: currentAquarium.parameters?.magnesium,
                      alkalinity: currentAquarium.parameters?.alkalinity,
                      phosphate: currentAquarium.parameters?.phosphate,
                    }}
                    onUpdateParameters={handleUpdateParameters}
                    aquariumData={currentAquarium}
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
