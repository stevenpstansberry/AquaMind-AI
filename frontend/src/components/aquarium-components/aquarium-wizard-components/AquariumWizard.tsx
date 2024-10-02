import React, { useState } from 'react'; 
import { Card, CardContent, Typography, Button, Box, Backdrop } from '@mui/material';
import AquariumTypeStep from './AquariumTypeStep';
import TankSizeStep from './TankSizeStep';
import SpeciesSelectionStep from './SpeciesSelectionStep';
import EquipmentStep from './EquipmentStep';
import SummaryStep from './SummaryStep';
import AquariumWizardProgress from './AquariumWizardProgress';
import AIChatInterface from '../../../components/AIChatInterface'; 

interface AquariumWizardProps {
  onClose: () => void;
}

const AquariumWizard: React.FC<AquariumWizardProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [aquariumData, setAquariumData] = useState({
    type: '',
    size: '',
    species: [],
    equipment: [],
  });

  const [isStepValid, setIsStepValid] = useState(false); // New state to track step completion
  const [showChat, setShowChat] = useState(false); // Toggle between wizard and chat interface

  const handleNext = () => {
    console.log("next", aquariumData);
    setCurrentStep((prevStep) => prevStep + 1);
    setIsStepValid(false); // Reset the validity check for the next step
  };

  const handlePrev = () => {
    console.log("back", aquariumData);
    setCurrentStep((prevStep) => prevStep - 1);
    setIsStepValid(true); // Assume previous steps are valid
  };

  const steps = ['Aquarium Type', 'Tank Size', 'Species', 'Equipment', 'Summary'];

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
          <Button onClick={onClose} sx={{ fontSize: '1.5rem' }}>×</Button>
        </Box>

        {/* Aquarium Wizard Steps */}
        <AquariumWizardProgress activeStep={currentStep} steps={steps} />
        <CardContent>
          {/* Step components */}
          {currentStep === 0 && <AquariumTypeStep setAquariumData={setAquariumData} setIsStepValid={setIsStepValid} aquariumData={aquariumData} />}
          {currentStep === 1 && <TankSizeStep setAquariumData={setAquariumData} setIsStepValid={setIsStepValid} aquariumData={aquariumData} />}
          {currentStep === 2 && <SpeciesSelectionStep setAquariumData={setAquariumData} aquariumData={aquariumData} setIsStepValid={setIsStepValid}/>}
          {currentStep === 3 && <EquipmentStep setAquariumData={setAquariumData} setIsStepValid={setIsStepValid} aquariumData={aquariumData}/>}
          {currentStep === 4 && <SummaryStep aquariumData={aquariumData} />}
        </CardContent>

        {/* Button container */}
        <Box display="flex" justifyContent="space-between" mt={2}>
          {currentStep > 0 ? (
            <Button onClick={handlePrev}>Back</Button>
          ) : (
            <Box />
          )}

          <Box display="flex" gap={2}>
            {/* Button to expand the card and show the AI chat interface below */}
            <Button variant="outlined" onClick={() => setShowChat((prev) => !prev)}>
              {showChat ? "Hide AI" : "Ask AI"}
            </Button>

            {/* Always align the Next/Finish button to the right */}
            {currentStep < steps.length - 1 ? (
             <Button variant="contained" onClick={handleNext} disabled={!isStepValid}>Next</Button>
            ) : (
              <Button variant="contained" onClick={onClose}>Finish</Button>
            )}
          </Box>
        </Box>

        {/* Use the AIChatInterface component here */}
        <AIChatInterface showChat={showChat} onClose={() => setShowChat(false)} />
      </Card>
    </Backdrop>
  );
};

export default AquariumWizard;
