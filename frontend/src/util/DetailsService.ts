// util/DetailsService.ts
import { getAllDetails } from '../services/APIServices';

export const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`Local Storage Updated: ${key}`, JSON.parse(localStorage.getItem(key) || '[]'));
  };
  
  export const fetchAndSaveDetails = async (type: string) => {
    const storageKey = `details_${type}`;
    
    // Check if data already exists in local storage
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      console.log(`Data loaded from local storage for ${type}:`, JSON.parse(storedData));
      return JSON.parse(storedData);
    }
  
    // Fetch from API if not in local storage
    try {
      const data = await getAllDetails(type);
      saveToLocalStorage(storageKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      return null;
    }
  };
  
  // Individual fetch functions for each type
  export const fetchSpeciesDetails = async () => fetchAndSaveDetails('species');
  export const fetchPlantDetails = async () => fetchAndSaveDetails('plants');
  export const fetchEquipmentDetails = async () => fetchAndSaveDetails('equipment');
  