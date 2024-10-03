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
import AIChatInterface from '../../../components/AIChatInterface'; 

interface AquariumWizardProps {
  onClose: () => void;
}

const AquariumWizard: React.FC<AquariumWizardProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [aquariumData, setAquariumData] = useState({
    id: '',
    name: '',
    type: '',
    size: '',
    species: [],  
    plants: [],   // New array to store selected plants
    equipment: [],
  });

  const [isStepValid, setIsStepValid] = useState(false); 
  const [showChat, setShowChat] = useState(false);

  const handleNext = () => {
    console.log("next", aquariumData);
    setCurrentStep((prevStep) => prevStep + 1);
    setIsStepValid(false); 
  };

  const handlePrev = () => {
    console.log("back", aquariumData);
    setCurrentStep((prevStep) => prevStep - 1);
    setIsStepValid(true); 
  };

  // Function to handle "Finish" step
  const handleFinish = () => {
    const id = aquariumData.id || uuidv4();
    const finalAquariumData = { ...aquariumData, id };

    console.log("Saving Aquarium:", finalAquariumData); 
    onClose(); 
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
          <Button onClick={onClose} sx={{ fontSize: '1.5rem' }}>×</Button>
        </Box>

        {/* Aquarium Wizard Steps */}
        <AquariumWizardProgress activeStep={currentStep} steps={steps} />
        <CardContent>
          {/* Step components */}
          {currentStep === 0 && <AquariumTypeStep setAquariumData={setAquariumData} setIsStepValid={setIsStepValid} aquariumData={aquariumData} />}
          {currentStep === 1 && <TankSizeStep setAquariumData={setAquariumData} setIsStepValid={setIsStepValid} aquariumData={aquariumData} />}
          {currentStep === 2 && <SpeciesSelectionStep setAquariumData={setAquariumData} aquariumData={aquariumData} setIsStepValid={setIsStepValid}/>}
          {currentStep === 3 && <PlantSelectionStep setAquariumData={setAquariumData} aquariumData={aquariumData} setIsStepValid={setIsStepValid}/>} {/* Plant step */}
          {currentStep === 4 && <EquipmentStep setAquariumData={setAquariumData} setIsStepValid={setIsStepValid} aquariumData={aquariumData}/>}
          {currentStep === 5 && <SummaryStep aquariumData={aquariumData} setAquariumData={setAquariumData} />}
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
             <Button variant="contained" onClick={handleNext} disabled={!isStepValid}>Next</Button>
            ) : (
              <Button variant="contained" onClick={handleFinish}>Finish</Button>
            )}
          </Box>
        </Box>

        <AIChatInterface showChat={showChat} onClose={() => setShowChat(false)} />
      </Card>
    </Backdrop>
  );
};

export default AquariumWizard;
