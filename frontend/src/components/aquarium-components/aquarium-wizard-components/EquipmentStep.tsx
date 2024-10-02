interface EquipmentStepProps {
    onNext: () => void;
    onBack: () => void;
    setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  }
  
  const EquipmentStep: React.FC<EquipmentStepProps> = ({ onNext, onBack, setAquariumData }) => {
    const handleEquipmentSelection = (equipment: string) => {
      setAquariumData((prevData: any) => ({ ...prevData, equipment: [...prevData.equipment, equipment] }));
      onNext();
    };
  
    return (
      <div>
        <h3>Select Equipment</h3>
        <button onClick={() => handleEquipmentSelection('Filter')}>Filter</button>
        <button onClick={() => handleEquipmentSelection('Heater')}>Heater</button>
        <button onClick={onBack}>Back</button>
      </div>
    );
  };
  
  export default EquipmentStep;
  