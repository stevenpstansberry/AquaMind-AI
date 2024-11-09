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


import React, { useState, useEffect,useRef } from 'react';
import { useAquarium } from '../util/AquariumContext';
import AquariumSidebar from '../components/aquarium-components/AquariumSidebar';
import AquariumWizard from '../components/aquarium-components/aquarium-wizard-components/AquariumWizard';
import { Box, AppBar, Toolbar, Typography, Grid,  Snackbar, Alert, Button } from '@mui/material';
import { createAquarium, updateAquarium as apiUpdateAquarium, deleteAquarium as apiDeleteAquarium } from '../services/APIServices';
import EditAquarium from '../components/aquarium-components/EditAquarium';
import { fetchSpeciesDetails, fetchPlantDetails, fetchEquipmentDetails } from '../util/DetailsService';
import AquariumInsights from '../components/ai-components/AquariumInsights';
import { Aquarium, Equipment, Fish, Plant, WaterParameterEntry } from '../interfaces/Aquarium';
import FishCard from '../components/aquarium-components/FishCard';
import PlantCard from '../components/aquarium-components/PlantCard';
import EquipmentCard from '../components/aquarium-components/EquipmentCard';
import ParametersCard from '../components/aquarium-components/ParametersCard';
import ReactGA from 'react-ga';



const Aquariums: React.FC = () => {
  const { aquariums = [], addAquarium, updateAquarium, removeAquarium } = useAquarium(); 
  const [showWizard, setShowWizard] = useState(false);
  const [currentAquarium, setCurrentAquarium] = useState<Aquarium | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isFirstRender = useRef(true);


  // Track page views on route changes
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, [window.location.pathname, window.location.search]);

  // Effect to set the default aquarium when component mounts
  useEffect(() => {
    if (isFirstRender.current) {
      if (aquariums.length > 0) {
        setCurrentAquarium(aquariums[0]); // Set the first aquarium as the default
      } else {
        setCurrentAquarium(null); // No aquariums available, set to null
      }
      isFirstRender.current = false;
    }
  }, [aquariums]);

  const handleAquariumSelect = (aquarium: Aquarium) => {
    setCurrentAquarium(aquarium);
  };


    // Fetch all details when Aquariums component mounts
    useEffect(() => {
      const fetchAllDetails = async () => {
        try {
          const species = await fetchSpeciesDetails();
          const plants = await fetchPlantDetails();
          const equipment = await fetchEquipmentDetails();
  
          if (species) console.log("Fetched species:", species);
          if (plants) console.log("Fetched plants:", plants);
          if (equipment) console.log("Fetched equipment:", equipment);
        } catch (error) {
          console.error("Error fetching details:", error);
          handleSnackbar("Failed to fetch aquarium details.", "error", true);
        }
      };
  
      fetchAllDetails();
    }, []);

  // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  

  /**
   * Opens the aquarium setup wizard.
   * 
   * @returns {void}
   */
  const handleOpenWizard = (): void => {
    setShowWizard(true);
  };

  // Function to handle opening the edit dialog
  const handleOpenEditDialog = (aquarium: Aquarium) => {
    setCurrentAquarium(aquarium);
    setIsEditDialogOpen(true);
  };



  /**
   * Handles the snackbar visibility, message, and severity.
   * 
   * @param {string} message - The message to display in the snackbar.
   * @param {'success' | 'error' | 'warning' | 'info'} severity - The severity of the snackbar.
   * @param {boolean} open - Whether the snackbar is open or not.
   */
    const handleSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info', open: boolean): void => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(open);
    };

  /**
   * Adds a new aquarium using the context's addAquarium function.
   * 
   * @param {Aquarium} aquariumToAdd - The aquarium to add.
   */
  const handleAddAquarium = (aquariumToAdd: Aquarium): void => {
    addAquarium(aquariumToAdd);

    try {
      createAquarium(aquariumToAdd);
      handleSnackbar('Aquarium added successfully!', 'success', true);
    } catch (error) {
      console.error("Failed to add aquarium:", error);
      handleSnackbar('Failed to add aquarium.', 'error', true);
    }
  };

  // Function to handle saving the updated aquariums
  const handleSaveAquarium = (updatedAquarium: Aquarium) => {
    updateAquarium(updatedAquarium);
    apiUpdateAquarium(updatedAquarium.id, updatedAquarium)
      .then(() => {
        console.log('Successfully updated aquarium!');
      })
      .catch(error => {
        console.error('Failed to update aquarium:', error);
      });
    setIsEditDialogOpen(false);
  };

  // Function to handle deleting an aquarium
  const handleDeleteAquarium = (id: string) => {
    apiDeleteAquarium(id)
      .then(() => {
        removeAquarium(id);
        console.log('Aquarium deleted successfully!');
        handleSnackbar('Aquarium deleted successfully!', 'success', true);
      })
      .catch(error => {
        console.error('Failed to delete aquarium:', error);
        handleSnackbar('Failed to delete aquarium. Please try again later', 'error', true);
      });
    setIsEditDialogOpen(false);
    
  };


  // /**
  //  * Updates the parameters of the currently selected aquarium.
  //  * 
  //  * @param {Object} newParams - The new parameters to update the current aquarium with.
  //  * @param {number} newParams.temperature - The temperature of the water.
  //  * @param {number} newParams.ph - The pH level of the water.
  //  * @param {number} newParams.ammonia - The ammonia level of the water.
  //  * @returns {void}
  //  */
  const handleUpdateParameters = (newEntries: WaterParameterEntry[]): void => {
    if (currentAquarium) {
      const updatedAquarium = {
        ...currentAquarium,
        parameterEntries: newEntries,
      };
      setCurrentAquarium(updatedAquarium);
      updateAquarium(updatedAquarium);
      apiUpdateAquarium(updatedAquarium.id, updatedAquarium)
        .then((response) => {
          console.log('API updated aquarium:', response);
        })
        .catch((error) => {
          console.error('Failed to update aquarium via API:', error);
        });
    }
  };

  const handleUpdateSpecies = (newSpecies: Fish[]): void => {
    if (currentAquarium) {
      const updatedAquarium = {
        ...currentAquarium,
        species: newSpecies,
      };
      setCurrentAquarium(updatedAquarium);
      updateAquarium(updatedAquarium);
      apiUpdateAquarium(updatedAquarium.id, updatedAquarium)
        .then(response => {
          console.log('API updated aquarium:', response);
        })
        .catch(error => {
          console.error('Failed to update aquarium via API:', error);
        });
      console.log('Updated aquarium:', updatedAquarium);
    }
  };

  const handleUpdatePlants = (newPlants: Plant[]): void => {
    if (currentAquarium) {
      const updatedAquarium = {
        ...currentAquarium,
        plants: newPlants,
      };
      setCurrentAquarium(updatedAquarium);
      updateAquarium(updatedAquarium);
      apiUpdateAquarium(updatedAquarium.id, updatedAquarium)
        .then(response => {
          console.log('API updated aquarium:', response);
        })
        .catch(error => {
          console.error('Failed to update aquarium via API:', error);
        });
      console.log('Updated aquarium:', updatedAquarium);
    }
  };

  const handleUpdateEquipment = (updatedEquipmentList: Equipment[]): void => {
    if (currentAquarium) {
      const updatedAquarium = {
        ...currentAquarium,
        equipment: updatedEquipmentList,
      };
      setCurrentAquarium(updatedAquarium);
      updateAquarium(updatedAquarium);
      apiUpdateAquarium(updatedAquarium.id, updatedAquarium)
        .then(response => {
          console.log('API updated aquarium:', response);
        })
        .catch(error => {
          console.error('Failed to update aquarium via API:', error);
        });
      console.log('Updated aquarium:', updatedAquarium);
    }
  };

  return (
    <>
      {aquariums.length === 0 ? (
        <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '20px',
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: '20px' }}>
              You don't have any aquariums yet.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpenWizard}>
              Create Your First Aquarium
            </Button>
            {showWizard && (
              <AquariumWizard
                onClose={() => setShowWizard(false)}
                handleAddAquarium={handleAddAquarium}
                handleSnackbar={handleSnackbar}
              />
            )}
          </Box>
        </div>
      ) : (
        <div style={{ display: 'flex', height: '100vh' }}>
          <AquariumSidebar
            aquariums={aquariums}
            onOpenWizard={handleOpenWizard}
            setCurrentAquarium={setCurrentAquarium}
            currentAquarium={currentAquarium}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            onEditAquarium={handleOpenEditDialog}
          />
  
          {/* Main Content with Unique Key */}
          <div
            key={currentAquarium?.id} // Unique key to reset state on aquarium switch
            style={{
              marginLeft: collapsed ? '60px' : '200px',
              transition: 'margin-left 0.3s',
              padding: '20px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              {showWizard && (
                <AquariumWizard
                  onClose={() => setShowWizard(false)}
                  handleAddAquarium={handleAddAquarium}
                  handleSnackbar={handleSnackbar}
                />
              )}
  
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
                      },
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
                    <Grid item xs={12} md={6} lg={6}>
                      <FishCard aquarium={currentAquarium} onUpdateSpecies={handleUpdateSpecies} handleSnackbar={handleSnackbar} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <PlantCard aquarium={currentAquarium} onUpdatePlants={handleUpdatePlants} handleSnackbar={handleSnackbar} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <EquipmentCard aquarium={currentAquarium} onUpdateEquipment={handleUpdateEquipment} handleSnackbar={handleSnackbar} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={8}>
                      <ParametersCard
                        onUpdateParameters={handleUpdateParameters}
                        aquarium={currentAquarium}
                        handleSnackbar={handleSnackbar}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>
  
            {/* Bottom Section for Aquarium Insights */}
            {currentAquarium && <AquariumInsights aquarium={currentAquarium} />}
          </div>
        </div>
      )}
  
      {/* Snackbar Component */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
  
      {/* Edit Aquarium Dialog */}
      {currentAquarium && (
        <EditAquarium
          aquarium={currentAquarium}
          onSave={handleSaveAquarium}
          onDelete={handleDeleteAquarium}
          onClose={() => setIsEditDialogOpen(false)}
          open={isEditDialogOpen}
          handleSnackbar={handleSnackbar}
        />
      )}
    </>
  );
  
};

export default Aquariums;
