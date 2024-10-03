/**
 * @file Aquariums.tsx
 * @author Steven Stansberry
 * @location /src/pages/Aquariums.tsx
 * @description 
 * This page renders the user's aquarium dashboard, displaying a list of existing aquariums and a button to add new aquariums.
 * It integrates with the AquariumSidebar and AquariumWizard components to manage aquarium data and provide an interactive 
 * wizard for creating new aquariums.
 */

import React, { useState, useEffect } from 'react';
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
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [currentAquarium, setCurrentAquarium] = useState<Aquarium | null>(null); // Track the selected aquarium

  const { isLoggedIn, user, logout } = useAuth();

  const handleOpenWizard = () => {
    setShowWizard(true);
  };

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
      {/* Pass the current aquarium to the sidebar */}
      <AquariumSidebar
        aquariums={aquariums}
        onOpenWizard={handleOpenWizard}
        setCurrentAquarium={setCurrentAquarium}
        currentAquarium={currentAquarium} // Pass selected aquarium
      />

      <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        <h1>{user ? `${user}'s Aquariums` : 'Your Aquariums'}</h1>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setShowWizard(true)}
        >
          + Create New Aquarium
        </Button>

        {showWizard && (
          <AquariumWizard onClose={() => setShowWizard(false)} />
        )}

        {currentAquarium && (
          <div>
            <h2>Current Aquarium: {currentAquarium.name}</h2>
            {/* Display additional information about the selected aquarium */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Aquariums;
