import React, { useState, useEffect } from 'react';
import { getUser } from '../services/AuthServices';
import { useAuth } from '../util/AuthContext';
import AquariumSidebar from '../components/aquarium-components/AquariumSidebar';

interface Aquarium {
  id: number;
  name: string;
}

const Aquariums: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [aquariums, setAquariums] = useState<Aquarium[]>([]); // State to store aquarium data

  const { isLoggedIn, user, logout } = useAuth(); // Access isLoggedIn and logout function


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


  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <AquariumSidebar aquariums={aquariums} />

      {/* Main content */}
      <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        <h1>{user ? `${user}'s Aquariums` : 'Your Aquariums'}</h1>
        {/* Main page content goes here */}
      </div>
    </div>
  );
};

export default Aquariums;
