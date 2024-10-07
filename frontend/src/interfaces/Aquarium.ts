// interfaces/Aquarium.ts
export interface Aquarium {
    id: string;
    name: string;
    type: "Freshwater" | "Saltwater";
    size: string;
    species: Fish[]; 
    plants: { name: string; count: number; role: string }[]; 
    equipment: { name: string; type: string }[];
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
  minTankSize?: number;  // Only include minTankSize now
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
  
  