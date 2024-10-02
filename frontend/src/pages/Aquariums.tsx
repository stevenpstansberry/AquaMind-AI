import React, { useState, useEffect } from 'react';
import { getUser } from '../services/AuthServices';
import { useAuth } from '../util/AuthContext';
import AquariumSidebar from '../components/aquarium-components/AquariumSidebar';
import AquariumWizard from '../components/aquarium-components/aquarium-wizard-components/AquariumWizard';
import { Button } from '@mui/material';

interface Aquarium {
  id: number;
  name: string;
}

const Aquariums: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [aquariums, setAquariums] = useState<Aquarium[]>([]); // State to store aquarium data
  const [showWizard, setShowWizard] = useState(false); // State to control the wizard visibility

  const { isLoggedIn, user, logout } = useAuth(); // Access isLoggedIn and logout function

// Function to trigger the wizard modal
const handleOpenWizard = () => {
    setShowWizard(true);
    };

  // Simulate fetching aquariums from API
  useEffect(() => {
    const fetchAquariums = async () => {
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
      <AquariumSidebar aquariums={aquariums} onOpenWizard={handleOpenWizard}/>

      {/* Main content */}
      <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        <h1>{user ? `${user}'s Aquariums` : 'Your Aquariums'}</h1>

        {/* Button to trigger the wizard */}
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setShowWizard(true)}
        >
          + Create New Aquarium
        </Button>

        {/* Render the Aquarium Wizard modal */}
        {showWizard && (
          <AquariumWizard onClose={() => setShowWizard(false)} />
        )}
      </div>
    </div>
  );
};

export default Aquariums;
