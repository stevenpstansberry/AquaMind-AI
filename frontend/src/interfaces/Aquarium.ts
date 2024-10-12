// interfaces/Aquarium.ts
export interface Aquarium {
    id: string;
    name: string;
    type: "Freshwater" | "Saltwater";
    size: string;
    species: Fish[]; 
    plants: { name: string; count: number; role: string }[]; 
    equipment: Equipment[];
    parameters?: {
      temperature?: number;
      ph?: number;
      ammonia?: number;
      nitrite?: number;
      nitrate?: number;
      gh?: number;
      kh?: number;
      co2?: number;
      salinity?: number;
      calcium?: number;
      magnesium?: number;
      alkalinity?: number;
      phosphate?: number;
    };
  }

export interface Fish {
  name: string;
  count: number;
  role: string;
  type: string;  
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
}

export interface Plant {
  name: string;
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
}




export interface Equipment {
  name: string;
  description: string;
  role: string; // The role of the equipment (e.g., 'Water Filtration', 'Lighting')
  importance: string; // Why the equipment is important
  usage: string; // How the equipment is used
  specialConsiderations: string; // Any special considerations for the equipment
  fields: { [key: string]: string };
  type: 'filtration' | 'lighting' | 'heating' | 'feeding' | 'test_chemicals' | 'other'; // Category for display mode
}
  
  