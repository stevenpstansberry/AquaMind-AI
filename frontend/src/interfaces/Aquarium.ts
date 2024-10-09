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
  
  