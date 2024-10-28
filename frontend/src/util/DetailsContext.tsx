// util/DetailsContext.tsx

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { fetchSpeciesDetails, fetchPlantDetails, fetchEquipmentDetails, saveToLocalStorage } from './DetailsService';
import { Fish, Plant, Equipment } from '../interfaces/Aquarium'; // Import types here

interface DetailsContextType {
  species: Fish[]; // Use specific types
  plants: Plant[];
  equipment: Equipment[];
  fetchAllDetails: () => void;
  speciesList: () => Fish[];
  plantList: () => Plant[];
  equipmentList: () => Equipment[];
}

const DetailsContext = createContext<DetailsContextType>({
  species: [],
  plants: [],
  equipment: [],
  fetchAllDetails: () => {},
  speciesList: () => [],
  plantList: () => [],
  equipmentList: () => [],
});

export const useDetails = () => useContext(DetailsContext);

export const DetailsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [species, setSpecies] = useState<Fish[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  // Fetch all details and update the state
  const fetchAllDetails = async () => {
    const [speciesData, plantsData, equipmentData] = await Promise.all([
      fetchSpeciesDetails(),
      fetchPlantDetails(),
      fetchEquipmentDetails(),
    ]);

    console.log('Species Data:', speciesData);
    console.log('Plants Data:', plantsData);
    console.log('Equipment Data:', equipmentData);

    setSpecies(Array.isArray(speciesData) ? speciesData : []);
    setPlants(Array.isArray(plantsData) ? plantsData : []);
    setEquipment(Array.isArray(equipmentData) ? equipmentData : []);
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

  // Getters for species, plants, and equipment
  const speciesList = () => JSON.parse(localStorage.getItem('details_species') || '[]');
  const plantList = () => JSON.parse(localStorage.getItem('details_plants') || '[]');
  const equipmentList = () => JSON.parse(localStorage.getItem('details_equipment') || '[]');

  return (
    <DetailsContext.Provider value={{ species, plants, equipment, fetchAllDetails, speciesList, plantList, equipmentList }}>
      {children}
    </DetailsContext.Provider>
  );
};