/**
 * @file AquariumWizardProgress.tsx
 * @location src/components/aquarium-components/aquarium-wizard-components/AquariumWizardProgress.tsx
 * @description This component renders the stepper used to indicate the progress of the aquarium setup wizard. It displays the labels of each step and highlights the active step.
 * 
 * @author Steven Stansberry
 */

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
