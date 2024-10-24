/**
 * @file AquariumWizard.tsx
 * @location src/components/aquarium-components/aquarium-wizard-components/AquariumWizard.tsx
 * @description This component renders the Aquarium Setup Wizard, guiding the user through different setup steps such as choosing the aquarium type, tank size, species, plants, equipment, and providing a summary. It handles navigation between steps, validating inputs, and saving the setup.
 * 
 * @author Steven Stansberry
 */

import React, { useState } from 'react'; 
import { Card, CardContent, Typography, Button, Box, Backdrop } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import AquariumTypeStep from './AquariumTypeStep';
import TankSizeStep from './TankSizeStep';
import SpeciesSelectionStep from './SpeciesSelectionStep';
import PlantSelectionStep from './PlantSelectionStep'; 
import EquipmentStep from './EquipmentStep';
import SummaryStep from './SummaryStep';
import AquariumWizardProgress from './AquariumWizardProgress';
import AIChatInterface from '../../ai-components/AIChatInterface'; 

interface AquariumWizardProps {
  onClose: () => void;
  handleAddAquarium: (aquariumToAdd: any) => void;
  handleSnackbar: (message: string, severity: 'success' | 'error' | 'warning' | 'info', open: boolean) => void;
}

const AquariumWizard: React.FC<AquariumWizardProps> = ({ onClose, handleAddAquarium, handleSnackbar }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [aquariumData, setAquariumData] = useState({
    id: '',
    name: '',
    type: '',
    size: '',
    species: [],  
    plants: [],   // Array to store selected plants
    equipment: [],
  });

  const [isStepValid, setIsStepValid] = useState(false); 
  const [showChat, setShowChat] = useState(false);

  /**
   * Resets the state of the wizard when it is closed.
   * This includes resetting the current step, aquarium data, and validation state.
   * 
   * @returns {void}
   */
  const resetWizard = (): void => {
    setCurrentStep(0);
    setAquariumData({
      id: '',
      name: '',
      type: '',
      size: '',
      species: [],  
      plants: [],
      equipment: [],
    });
    setIsStepValid(false);
  };

  /**
   * Advances to the next step in the wizard. 
   * It also resets the step validation state.
   * 
   * @returns {void}
   */
  const handleNext = (): void => {
    console.log("next", aquariumData);
    setCurrentStep((prevStep) => prevStep + 1);
    setIsStepValid(false); 
  };

  /**
   * Goes back to the previous step in the wizard. 
   * It also sets the validation state to true to allow navigation.
   * 
   * @returns {void}
   */
  const handlePrev = (): void => {
    console.log("back", aquariumData);
    setCurrentStep((prevStep) => prevStep - 1);
    setIsStepValid(true); 
  };

  /**
   * Handles the final step of the wizard, generating a unique ID if necessary,
   * saving the aquarium data, and closing the wizard.
   * 
   * @returns {void}
   */
  const handleFinish = (): void => {
    const id = aquariumData.id || uuidv4();
    const finalAquariumData = { ...aquariumData, id };

    console.log("Saving Aquarium:", finalAquariumData); 
    handleAddAquarium(finalAquariumData); // Save the aquarium data
    onClose(); 
    handleSnackbar('Aquarium setup complete!', 'success', true); // Show success message
    resetWizard(); // Reset the wizard state after closing
  };

  // Update steps to include Plant Selection
  const steps = ['Aquarium Type', 'Tank Size', 'Species', 'Plants (Optional)', 'Equipment', 'Summary'];

  return (
    <Backdrop open={true} sx={{ zIndex: 1000 }}>
      <Card sx={{
        width: '800px',
        padding: '30px',
        position: 'relative',
        zIndex: 1001,
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5">Aquarium Setup Wizard</Typography>
          <Button
            onClick={() => {
              onClose(); // Close the wizard
              resetWizard(); // Reset the wizard state
            }}
            sx={{ fontSize: '1.5rem' }}
          >
            ×
          </Button>
        </Box>

        {/* Aquarium Wizard Steps */}
        <AquariumWizardProgress activeStep={currentStep} steps={steps} />
        <CardContent>
          {/* Step components */}
          {currentStep === 0 && <AquariumTypeStep setAquariumData={setAquariumData} setIsStepValid={setIsStepValid} aquariumData={aquariumData} />}
          {currentStep === 1 && <TankSizeStep setAquariumData={setAquariumData} setIsStepValid={setIsStepValid} aquariumData={aquariumData} />}
          {currentStep === 2 && <SpeciesSelectionStep setAquariumData={setAquariumData} aquariumData={aquariumData} setIsStepValid={setIsStepValid}/>}
          {currentStep === 3 && <PlantSelectionStep setAquariumData={setAquariumData} aquariumData={aquariumData} setIsStepValid={setIsStepValid}/>} {/* Plant step */}
          
          {/* EquipmentStep with a unique key */}
          {currentStep === 4 && (
            <EquipmentStep
              key={currentStep} // Add a key to reset state when remounted
              setAquariumData={setAquariumData}
              setIsStepValid={setIsStepValid}
              aquariumData={aquariumData}
            />
          )}
          
          {currentStep === 5 && <SummaryStep aquariumData={aquariumData} setAquariumData={setAquariumData} setIsStepValid={setIsStepValid}/>}
        </CardContent>

        {/* Button container */}
        <Box display="flex" justifyContent="space-between" mt={2}>
          {currentStep > 0 ? (
            <Button onClick={handlePrev}>Back</Button>
          ) : (
            <Box />
          )}

          <Box display="flex" gap={2}>
            <Button variant="outlined" onClick={() => setShowChat((prev) => !prev)}>
              {showChat ? "Hide AI" : "Ask AI"}
            </Button>

            {currentStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext} disabled={!isStepValid}>
              Next
            </Button>
          ) : (
            <Button variant="contained" onClick={handleFinish} disabled={!isStepValid}>
              Finish
            </Button>
          )}
          </Box>
        </Box>

        <AIChatInterface showChat={showChat} onClose={() => setShowChat(false)} />
      </Card>
    </Backdrop>
  );
};

export default AquariumWizard;
