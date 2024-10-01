import React, { useState, useEffect } from 'react';
import { getUser } from '../services/AuthServices';
import AquariumSidebar from '../components/aquarium-components/AquariumSidebar';

interface Aquarium {
  id: number;
  name: string;
}

const Aquariums: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [aquariums, setAquariums] = useState<Aquarium[]>([]); // State to store aquarium data

  // Simulate fetching aquariums from API
  useEffect(() => {
    const fetchAquariums = async () => {
      // Replace with actual API call to get aquariums
      const mockAquariums = [
        { id: 1, name: 'Freshwater Tank' },
        { id: 2, name: 'Saltwater Reef' },
        { id: 3, name: 'Planted Tank' },
      ];
      setAquariums(mockAquariums);
    };

    fetchAquariums();
  }, []);

  // Check if the user is logged in by looking for user data in localStorage
  useEffect(() => {
    const storedUserName = getUser();
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  return (
    <div>
      <h1>{userName ? `${userName}'s Aquariums` : 'Your Aquariums'}</h1>
      {/* Pass aquarium data to the sidebar */}
      <AquariumSidebar aquariums={aquariums} />
    </div>
  );
};

export default Aquariums;
