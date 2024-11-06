/**
 * @file AquariumWizard.tsx
 * @location src/components/aquarium-components/aquarium-wizard-components/AquariumWizard.tsx
 * @description This component renders the Aquarium Setup Wizard, guiding the user through different setup steps such as choosing the aquarium type, tank size, species, plants, equipment, and providing a summary. It handles navigation between steps, validating inputs, and saving the setup.
 * 
 * @autor Steven Stansberry
 */

import React, { useState, useEffect, useRef } from 'react'; 
import { Dialog, Card, CardContent, Typography, Button, Box, Backdrop, IconButton } from '@mui/material';
import { Close as CloseIcon, ChatBubble as ChatBubbleIcon } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import AquariumTypeStep from './AquariumTypeStep';
import TankSizeStep from './TankSizeStep';
import SpeciesSelectionStep from './SpeciesSelectionStep';
import PlantSelectionStep from './PlantSelectionStep'; 
import EquipmentStep from './EquipmentStep';
import SummaryStep from './SummaryStep';
import AquariumWizardProgress from './AquariumWizardProgress';
import AIChatInterface from '../../ai-components/AIChatInterface'; 
import AIButton from '../../ai-components/AIButton';

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
    plants: [],   
    equipment: [],
  });

  const [isStepValid, setIsStepValid] = useState(false); 
  const [showChat, setShowChat] = useState(false);

  // Create a ref to access the chat container
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the bottom of the chat when it opens
  useEffect(() => {
    if (showChat && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [showChat]);

  const suggestions = [
    [
      "What are the key differences between freshwater and saltwater aquariums?",
      "What are some examples of common saltwater fish?"
    ],
    [
      "How do I determine the right tank size for my aquarium?",
      "What are the benefits of a larger tank?"
    ],
    [
      "What are some beginner-friendly fish species?",
      "How do I introduce new fish to my aquarium?"
    ],
    [
      "What are the best plants for my aquarium?",
      "How do I care for live plants in my aquarium?"
    ],
    [
      "What equipment do I need for my aquarium?",
      "How do I maintain the equipment in my aquarium?"
    ],
    [
      "How do I ensure my aquarium is properly set up?",
      "What are the common mistakes to avoid in aquarium setup?"
    ]
  ];

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
  // const steps = ['Aquarium Type', 'Tank Size', 'Species (Optional)', 'Plants (Optional)', 'Equipment (Optional)', 'Summary'];
  const steps = ['Aquarium Type', 'Tank Size', 'Summary'];

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);
  
  const handleClose = () => {
    onClose();
    resetWizard();
  };

  return (
      <Backdrop
      open={true}
      sx={{ zIndex: 2000 }}
      onClick={(event) => {
        if ((event.target as HTMLElement).id === 'aquarium-wizard-backdrop') {
          handleClose();
        }
      }}
      id="aquarium-wizard-backdrop"
    >
      <Card
        sx={{
          width: '800px',
          padding: '30px',
          position: 'relative',
          zIndex: 1001,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()} 
      >
        <Box display="flex" justifyContent="space-between">
          <IconButton
            onClick={() => {
              onClose();
              resetWizard();
            }}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              color: 'lightgray',
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" sx={{ marginLeft: 'auto', marginRight: 'auto' }}>Aquarium Setup Wizard</Typography>
        </Box>

        <AquariumWizardProgress activeStep={currentStep} steps={steps} />
        <CardContent>
          {currentStep === 0 && <AquariumTypeStep setAquariumData={setAquariumData} setIsStepValid={setIsStepValid} aquariumData={aquariumData} />}
          {currentStep === 1 && <TankSizeStep setAquariumData={setAquariumData} setIsStepValid={setIsStepValid} aquariumData={aquariumData} />}
          {currentStep === 3 && <SpeciesSelectionStep setAquariumData={setAquariumData} aquariumData={aquariumData} setIsStepValid={setIsStepValid}/>}
          {currentStep === 4 && <PlantSelectionStep setAquariumData={setAquariumData} aquariumData={aquariumData} setIsStepValid={setIsStepValid}/>}
          {currentStep === 5 && (
            <EquipmentStep
              key={currentStep}
              setAquariumData={setAquariumData}
              setIsStepValid={setIsStepValid}
              aquariumData={aquariumData}
            />
          )}
          {currentStep === 2 && <SummaryStep aquariumData={aquariumData} setAquariumData={setAquariumData} setIsStepValid={setIsStepValid}/>}
        </CardContent>
        <Box display="flex" justifyContent="space-between" mt={2}>
          {currentStep > 0 ? (
            <Button onClick={handlePrev}>Back</Button>
          ) : (
            <Box />
          )}

          <Box display="flex" gap={2}>
            <AIButton
              onClick={() => setShowChat((prev) => !prev)}
              isChatActive={showChat}
            >
            </AIButton>

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

        <div ref={chatContainerRef}>
          <AIChatInterface showChat={showChat} onClose={() => setShowChat(false)} suggestions={suggestions[currentStep]}/>
        </div>
      </Card>
    </Backdrop>
  );
};

export default AquariumWizard;
