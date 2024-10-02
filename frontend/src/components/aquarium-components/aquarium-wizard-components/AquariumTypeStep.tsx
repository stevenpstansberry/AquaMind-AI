import React from 'react';

interface AquariumTypeStepProps {
  onNext: () => void;
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
}

const AquariumTypeStep: React.FC<AquariumTypeStepProps> = ({ onNext, setAquariumData }) => {
  const handleTypeSelection = (type: string) => {
    setAquariumData((prevData: any) => ({ ...prevData, type }));
    onNext();
  };

  return (
    <div>
      <h3>Select Aquarium Type</h3>
      <button onClick={() => handleTypeSelection('Freshwater')}>Freshwater</button>
      <button onClick={() => handleTypeSelection('Saltwater')}>Saltwater</button>
    </div>
  );
};

export default AquariumTypeStep;
