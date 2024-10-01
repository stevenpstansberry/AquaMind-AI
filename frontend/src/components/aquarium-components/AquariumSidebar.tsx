import React, { useEffect, useState } from 'react';
import './AquariumSidebar.css'; 

interface Aquarium {
  id: number;
  name: string;
}

const AquariumSidebar: React.FC = () => {
  // State to store aquarium data
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);

  // Mock data for now, later replace with an API call to fetch aquariums
  useEffect(() => {
    const mockAquariums = [
      { id: 1, name: 'Freshwater Tank' },
      { id: 2, name: 'Saltwater Reef' },
      { id: 3, name: 'Planted Tank' },
    ];
    setAquariums(mockAquariums);
  }, []);

  // Handler for adding a new aquarium
  const handleAddAquarium = () => {
    console.log('Navigate to aquarium creation page');
    // Here you can redirect the user to the aquarium creation wizard
  };

  return (
    <div className="aquarium-sidebar">
      <h3>Your Aquariums</h3>
      <ul className="aquarium-list">
        {aquariums.length > 0 ? (
          aquariums.map(aquarium => (
            <li key={aquarium.id} className="aquarium-item">
              {aquarium.name}
            </li>
          ))
        ) : (
          <p>No aquariums yet. Click the button below to add one!</p>
        )}
      </ul>

      {/* Button to create a new aquarium */}
      <button className="add-aquarium-btn" onClick={handleAddAquarium}>
        + Add New Aquarium
      </button>
    </div>
  );
};

export default AquariumSidebar;
