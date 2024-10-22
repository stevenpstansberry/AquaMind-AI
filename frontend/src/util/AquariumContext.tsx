import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Aquarium } from '../interfaces/Aquarium';
import { useAuth } from './AuthContext';

interface AquariumContextType {
  aquariums: Aquarium[];
  addAquarium: (aquarium: Aquarium) => void;
  removeAquarium: (id: string) => void;
  fetchAquariums: () => void;
}

const AquariumContext = createContext<AquariumContextType>({
  aquariums: [],
  addAquarium: () => {},
  removeAquarium: () => {},
  fetchAquariums: () => {},
});

export const useAquarium = () => useContext(AquariumContext);

export const AquariumProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);
  const { user } = useAuth(); // Access authenticated user from AuthContext

  // Fetch aquariums when the user logs in or when the component mounts
  useEffect(() => {
    if (user) {
      fetchAquariums();
    }
  }, [user]);

  const fetchAquariums = async () => {
    // Simulate fetching aquariums for the logged-in user
    // In real usage, this would be an API call
    const mockAquariums: Aquarium[] = [
      { id: '1', name: 'My Freshwater Tank', type: 'Freshwater', size: '55', species: [], plants: [], equipment: [] },
      // Add more mock or fetched data here
    ];

    setAquariums(mockAquariums);
  };

  const addAquarium = (aquarium: Aquarium) => {
    setAquariums((prev) => [...prev, aquarium]);
  };

  const removeAquarium = (id: string) => {
    setAquariums((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AquariumContext.Provider value={{ aquariums, addAquarium, removeAquarium, fetchAquariums }}>
      {children}
    </AquariumContext.Provider>
  );
};
