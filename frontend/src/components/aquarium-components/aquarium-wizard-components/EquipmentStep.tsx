interface EquipmentStepProps {
  setAquariumData: React.Dispatch<React.SetStateAction<any>>;
}

const EquipmentStep: React.FC<EquipmentStepProps> = ({  setAquariumData }) => {
  const handleEquipmentSelection = (equipment: string) => {
    setAquariumData((prevData: any) => ({ ...prevData, equipment: [...prevData.equipment, equipment] }));
  };

  return (
    <div>
      <h3>Select Equipment</h3>
      <button onClick={() => handleEquipmentSelection('Filter')}>Filter</button>
      <button onClick={() => handleEquipmentSelection('Heater')}>Heater</button>
    </div>
  );
};

export default EquipmentStep;
