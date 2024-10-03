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
import { Button, Box } from '@mui/material';

interface Aquarium {
  id: number;
  name: string;
}

const Aquariums: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [currentAquarium, setCurrentAquarium] = useState<Aquarium | null>(null);

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
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar for displaying aquariums */}
      {aquariums.length > 0 && (
        <AquariumSidebar
          aquariums={aquariums}
          onOpenWizard={handleOpenWizard}
          setCurrentAquarium={setCurrentAquarium}
          currentAquarium={currentAquarium}
        />
      )}

      {/* Main content */}
      <div style={{ marginLeft: aquariums.length > 0 ? '250px' : '0', padding: '20px', width: '100%' }}>
        <h1>{user ? `${user}'s Aquariums` : 'Your Aquariums'}</h1>

        {/* Render Aquarium Wizard modal */}
        {showWizard && (
          <AquariumWizard onClose={() => setShowWizard(false)} />
        )}

        {/* Show "Create New Aquarium" button only when there are no aquariums */}
        {aquariums.length === 0 && (
          <Box
            sx={{
              position: 'absolute',  // Absolute positioning to place the button at the bottom center
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',  // Center horizontally
              textAlign: 'center',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowWizard(true)}
            >
              + Create New Aquarium
            </Button>
          </Box>
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
