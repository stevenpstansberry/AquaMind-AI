// interfaces/Aquarium.ts
export interface Aquarium {
    id: string;
    name: string;
    type: string;
    size: string;
    species: Fish[]; 
    plants:  Plant[]; 
    equipment: Equipment[];
    parameterEntries?: WaterParameterEntry[];
    owner?: string; // User id of the aquarium owner
  }

export interface Fish {
  name: string;
  scientificName?: string;
  count: number;
  role: string;
  type: string;  
  id?: string;
  description?: string;
  feedingHabits?: string;
  tankRequirements?: string;
  minTankSize?: number;  
  compatibility?: string;
  lifespan?: string;
  size?: string;
  waterParameters?: string;
  breedingInfo?: string;
  behavior?: string;
  careLevel?: string;
  dietaryRestrictions?: string;
  nativeHabitat?: string;
  stockingRecommendations?: string;
  specialConsiderations?: string;
  imageUrl?: string;
  wikipediaLink?: string;
}

export interface Plant {
  name: string;
  scientificName?: string;    // Scientific name of the plant
  count: number;              // Number of plants
  role: string;               // Role in the aquarium (e.g., "Oxygenator", "Decorative")
  type: string;               // Plant type (e.g., "Floating", "Rooted", "Carpet")
  description?: string;       // Optional plant description
  tankRequirements?: string;  // Specific tank needs (e.g., substrate, CO2)
  minTankSize?: number;       // Minimum tank size in gallons or liters
  compatibility?: string;     // Compatibility with fish or other plants
  lifespan?: string;          // Typical lifespan of the plant
  size?: string;              // Expected size of the plant (e.g., height/width)
  waterParameters?: string;   // Ideal water conditions (e.g., pH, hardness)
  lightingNeeds?: string;     // Lighting requirements (e.g., low, medium, high)
  growthRate?: string;        // Plant growth rate (e.g., slow, fast)
  careLevel?: string;         // Difficulty level for maintaining the plant (e.g., easy, moderate)
  nativeHabitat?: string;     // Origin or native habitat of the plant
  propagationMethods?: string;// How the plant propagates (e.g., runners, cuttings)
  specialConsiderations?: string; // Any special care instructions or conditions
  imageUrl?: string;          // Optional image URL for the plant
  wikipediaLink?: string;     // Optional Wikipedia link for more information
}




export interface Equipment {
    id?: string;
    name: string;
    description: string;
    role: string;
    importance: string;
    usage: string;
    specialConsiderations?: string;
    fields: string[];  // List of field names
    fieldValues?: { [key: string]: string }; // Map of field values
    type: 'filtration' | 'lighting' | 'heating' | 'feeding' | 'test_chemicals' | 'other';
}
  
export interface WaterParameterEntry {
  id: string; // Unique identifier for the parameter entry
  aquariumId: string; // Foreign key to link the entry to an aquarium
  timestamp: number;
  temperature?: number;
  ph?: number;
  hardness?: number;
  // Add more parameters as needed
}