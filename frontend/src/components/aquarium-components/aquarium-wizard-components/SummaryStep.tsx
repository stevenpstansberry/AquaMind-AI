interface SummaryStepProps {
    aquariumData: {
      type: string;
      size: string;
      species: string[];
      equipment: string[];
    };
    onBack: () => void;
  }
  
  const SummaryStep: React.FC<SummaryStepProps> = ({ aquariumData, onBack }) => {
    return (
      <div>
        <h3>Summary</h3>
        <p>Type: {aquariumData.type}</p>
        <p>Size: {aquariumData.size}</p>
        <p>Species: {aquariumData.species.join(', ')}</p>
        <p>Equipment: {aquariumData.equipment.join(', ')}</p>
        <button onClick={onBack}>Back</button>
      </div>
    );
  };
  
  export default SummaryStep;
  