interface TankSizeStepProps {
    onNext: () => void;
    onBack: () => void;
    setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  }
  
  const TankSizeStep: React.FC<TankSizeStepProps> = ({ onNext, onBack, setAquariumData }) => {
    const handleSizeSelection = (size: string) => {
      setAquariumData((prevData: any) => ({ ...prevData, size }));
      onNext();
    };
  
    return (
      <div>
        <h3>Select Tank Size</h3>
        <button onClick={() => handleSizeSelection('Small')}>Small</button>
        <button onClick={() => handleSizeSelection('Medium')}>Medium</button>
        <button onClick={() => handleSizeSelection('Large')}>Large</button>
        <button onClick={onBack}>Back</button>
      </div>
    );
  };
  
  export default TankSizeStep;
  