import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, Backdrop } from '@mui/material';
import AquariumTypeStep from './AquariumTypeStep';
import TankSizeStep from './TankSizeStep';
import SpeciesSelectionStep from './SpeciesSelectionStep';
import EquipmentStep from './EquipmentStep';
import SummaryStep from './SummaryStep';
import AquariumWizardProgress from './AquariumWizardProgress';

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
  
    const handleNext = () => {
      setCurrentStep((prevStep) => prevStep + 1);
    };
  
    const handlePrev = () => {
      setCurrentStep((prevStep) => prevStep - 1);
    };
  
    const steps = ['Aquarium Type', 'Tank Size', 'Species', 'Equipment', 'Summary'];
  
    return (
      <Backdrop open={true} sx={{ zIndex: 1000 }}>
        <Card sx={{ width: '600px', padding: '20px', position: 'relative', zIndex: 1001 }}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h5">Aquarium Setup Wizard</Typography>
            <Button onClick={onClose} sx={{ fontSize: '1.5rem' }}>×</Button>
          </Box>
  
          <AquariumWizardProgress activeStep={currentStep} steps={steps} />
  
          <CardContent>
            {currentStep === 0 && <AquariumTypeStep onNext={handleNext} setAquariumData={setAquariumData} />}
            {currentStep === 1 && <TankSizeStep onNext={handleNext} onBack={handlePrev} setAquariumData={setAquariumData} />}
            {currentStep === 2 && <SpeciesSelectionStep onNext={handleNext} onBack={handlePrev} setAquariumData={setAquariumData} />}
            {currentStep === 3 && <EquipmentStep onNext={handleNext} onBack={handlePrev} setAquariumData={setAquariumData} />}
            {currentStep === 4 && <SummaryStep aquariumData={aquariumData} onBack={handlePrev} />}
          </CardContent>
  
          <Box display="flex" justifyContent="space-between" mt={2}>
            {currentStep > 0 && <Button onClick={handlePrev}>Back</Button>}
            {currentStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>Next</Button>
            ) : (
              <Button variant="contained" onClick={onClose}>Finish</Button>
            )}
          </Box>
        </Card>
      </Backdrop>
    );
  };
  
  export default AquariumWizard;