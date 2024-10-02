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

/**
 * Interface representing an aquarium object.
 * @typedef {Object} Aquarium
 * @property {number} id - The unique identifier of the aquarium.
 * @property {string} name - The name of the aquarium.
 */
interface Aquarium {
  id: number;
  name: string;
}

/**
 * Aquariums component renders the user's aquarium management page, including a sidebar for viewing existing aquariums
 * and a button to create new ones using the AquariumWizard component.
 * 
 * @returns {JSX.Element} The rendered aquariums page component.
 */
const Aquariums: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [aquariums, setAquariums] = useState<Aquarium[]>([]); // State to store aquarium data
  const [showWizard, setShowWizard] = useState(false); // State to control the wizard visibility

  const { isLoggedIn, user, logout } = useAuth(); // Access isLoggedIn and logout function

  /**
   * Function to trigger the aquarium creation wizard.
   * 
   * @function handleOpenWizard
   */
  const handleOpenWizard = () => {
    setShowWizard(true);
  };

  /**
   * useEffect hook to simulate fetching aquarium data from an API.
   * On mount, it sets mock aquarium data for demonstration purposes.
   */
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
      {/* Sidebar for displaying aquariums */}
      <AquariumSidebar aquariums={aquariums} onOpenWizard={handleOpenWizard} />

      {/* Main content */}
      <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        <h1>{user ? `${user}'s Aquariums` : 'Your Aquariums'}</h1>

        {/* Button to trigger the aquarium creation wizard */}
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
