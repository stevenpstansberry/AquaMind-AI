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
  export const fetchSpeciesDetails = async () => {
    console.log("Fetching species details...");
    const data = await getAllDetails("species");
    if (data) {
      localStorage.setItem("species", JSON.stringify(data));
      console.log("Species details saved to local storage:", data);
    }
    return data;
  };
  
  export const fetchPlantDetails = async () => {
    console.log("Fetching plant details...");
    const data = await getAllDetails("plants");
    if (data) {
      localStorage.setItem("plants", JSON.stringify(data));
      console.log("Plant details saved to local storage:", data);
    }
    return data;
  };
  
  export const fetchEquipmentDetails = async () => {
    console.log("Fetching equipment details...");
    const data = await getAllDetails("equipment");
    if (data) {
      localStorage.setItem("equipment", JSON.stringify(data));
      console.log("Equipment details saved to local storage:", data);
    }
    return data;
  };
  