import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Aquarium } from '../interfaces/Aquarium';
import { useAuth } from './AuthContext';
import { getUserAquariums } from '../services/APIServices';

interface AquariumContextType {
  aquariums: Aquarium[];
  addAquarium: (aquarium: Aquarium) => void;
  removeAquarium: (id: string) => void;
  fetchAquariums: () => void;
  updateAquarium: (updatedAquarium: Aquarium) => void;
}

const AquariumContext = createContext<AquariumContextType>({
  aquariums: [],
  addAquarium: () => {},
  removeAquarium: () => {},
  fetchAquariums: () => {},
  updateAquarium: () => {},
});

export const useAquarium = () => useContext(AquariumContext);

export const AquariumProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);
  const { user } = useAuth(); // Access authenticated user from AuthContext

  // Fetch aquariums when the user logs in or when the component mounts
  useEffect(() => {
    if (user) {
      fetchAquariums();
      console.log('Fetching aquariums for user:', user.email);
    }
  }, [user]);

  // Save aquariums to local storage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`aquariums_${user.email}`, JSON.stringify(aquariums));
    }
  }, [aquariums, user]);

  const fetchAquariums = async () => {
    if (user) {
      // Retrieve aquariums from local storage for the logged-in user
      const storedAquariums = localStorage.getItem(`aquariums_${user.email}`);
      if (storedAquariums) {
        const parsedAquariums = JSON.parse(storedAquariums);
        setAquariums(parsedAquariums.length > 0 ? parsedAquariums : []);
      } else {
        // Fetch from the API if local storage is empty
        try {
          const fetchedAquariums = await getUserAquariums();
          if (fetchedAquariums.length > 0) {
            setAquariums(fetchedAquariums);
            localStorage.setItem(`aquariums_${user.email}`, JSON.stringify(fetchedAquariums));
          } else {
            // If no aquariums exist, initialize with an empty array
            setAquariums([]);
            localStorage.setItem(`aquariums_${user.email}`, JSON.stringify([]));
          }
        } catch (error) {
          console.error('Error fetching aquariums:', error);
          // Optionally set aquariums to an empty array if API call fails
          setAquariums([]);
        }
      }
    }
  };

  const addAquarium = (aquarium: Aquarium) => {
    setAquariums((prev) => {
      const updatedAquariums = [...prev, aquarium];
      // Save updated aquariums to local storage
      if (user) {
        localStorage.setItem(`aquariums_${user.email}`, JSON.stringify(updatedAquariums));
      }
      return updatedAquariums;
    });
  };

  const removeAquarium = (id: string) => {
    setAquariums((prev) => {
      const updatedAquariums = prev.filter((a) => a.id !== id);
      // Save updated aquariums to local storage
      if (user) {
        localStorage.setItem(`aquariums_${user.email}`, JSON.stringify(updatedAquariums));
      }
      return updatedAquariums;
    });
  };

  const updateAquarium = (updatedAquarium: Aquarium) => {
    setAquariums((prevAquariums) =>
      prevAquariums.map((aquarium) =>
        aquarium.id === updatedAquarium.id ? updatedAquarium : aquarium
      )
    );
  };


  return (
    <AquariumContext.Provider value={{ aquariums, addAquarium, removeAquarium, fetchAquariums, updateAquarium }}>
      {children}
    </AquariumContext.Provider>
  );
};
