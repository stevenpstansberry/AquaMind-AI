interface SpeciesSelectionStepProps {
    onNext: () => void;
    onBack: () => void;
    setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  }
  
  const SpeciesSelectionStep: React.FC<SpeciesSelectionStepProps> = ({ onNext, onBack, setAquariumData }) => {
    const handleSpeciesSelection = (species: string) => {
      setAquariumData((prevData: any) => ({ ...prevData, species: [...prevData.species, species] }));
      onNext();
    };
  
    return (
      <div>
        <h3>Select Species</h3>
        <button onClick={() => handleSpeciesSelection('Clownfish')}>Clownfish</button>
        <button onClick={() => handleSpeciesSelection('Tetra')}>Tetra</button>
        <button onClick={onBack}>Back</button>
      </div>
    );
  };
  
  export default SpeciesSelectionStep;
  