interface SpeciesSelectionStepProps {

    setAquariumData: React.Dispatch<React.SetStateAction<any>>;
  }
  
  const SpeciesSelectionStep: React.FC<SpeciesSelectionStepProps> = ({ setAquariumData }) => {
    const handleSpeciesSelection = (species: string) => {
      setAquariumData((prevData: any) => ({ ...prevData, species: [...prevData.species, species] }));
    };
  
    return (
      <div>
        <h3>Select Species</h3>
        <button onClick={() => handleSpeciesSelection('Clownfish')}>Clownfish</button>
        <button onClick={() => handleSpeciesSelection('Tetra')}>Tetra</button>
      </div>
    );
  };
  
  export default SpeciesSelectionStep;
  