import React, { useState, useEffect } from 'react';
import { getUser } from '../services/AuthServices';
import AquariumSidebar from '../components/aquarium-components/AquariumSidebar';

const Aquariums: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);

  // Check if the user is logged in by looking for user data in localStorage
  useEffect(() => {
    const storedUserName = getUser();
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  return (
    <div>
      <h1>Your Aquariums</h1>
      <AquariumSidebar/>
    </div>
  );
};

export default Aquariums;
