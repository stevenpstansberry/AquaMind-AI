// util/DetailsContext.tsx

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { fetchSpeciesDetails, fetchPlantDetails, fetchEquipmentDetails, saveToLocalStorage } from './DetailsService';

interface DetailsContextType {
  species: any[];
  plants: any[];
  equipment: any[];
  fetchAllDetails: () => void;
}

const DetailsContext = createContext<DetailsContextType>({
  species: [],
  plants: [],
  equipment: [],
  fetchAllDetails: () => {},
});

export const useDetails = () => useContext(DetailsContext);

export const DetailsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [species, setSpecies] = useState<any[]>([]);
  const [plants, setPlants] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);

  // Fetch all details and update the state
  const fetchAllDetails = async () => {
    const [speciesData, plantsData, equipmentData] = await Promise.all([
      fetchSpeciesDetails(),
      fetchPlantDetails(),
      fetchEquipmentDetails(),
    ]);

    setSpecies(speciesData || []);
    setPlants(plantsData || []);
    setEquipment(equipmentData || []);
  };

  // Fetch details when the component mounts
  useEffect(() => {
    fetchAllDetails();
  }, []);

  // Save to local storage whenever any details are updated
  useEffect(() => {
    saveToLocalStorage('details_species', species);
    saveToLocalStorage('details_plants', plants);
    saveToLocalStorage('details_equipment', equipment);
  }, [species, plants, equipment]);

  return (
    <DetailsContext.Provider value={{ species, plants, equipment, fetchAllDetails }}>
      {children}
    </DetailsContext.Provider>
  );
};
