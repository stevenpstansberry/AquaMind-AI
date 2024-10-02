import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

interface AquariumWizardProgressProps {
  activeStep: number;
  steps: string[];
}

const AquariumWizardProgress: React.FC<AquariumWizardProgressProps> = ({ activeStep, steps }) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((label, index) => (
        <Step key={index}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default AquariumWizardProgress;
