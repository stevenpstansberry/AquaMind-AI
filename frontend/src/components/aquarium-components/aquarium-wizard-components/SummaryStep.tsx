interface SummaryStepProps {
    aquariumData: {
      type: string;
      size: string;
      species: string[];
      equipment: string[];
    };
  }
  
  const SummaryStep: React.FC<SummaryStepProps> = ({ aquariumData }) => {
    return (
      <div>
        <h3>Summary</h3>
        <p>Type: {aquariumData.type}</p>
        <p>Size: {aquariumData.size}</p>
        <p>Species: {aquariumData.species.join(', ')}</p>
        <p>Equipment: {aquariumData.equipment.join(', ')}</p>
      </div>
    );
  };
  
  export default SummaryStep;
  