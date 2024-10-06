// interfaces/Aquarium.ts
export interface Aquarium {
    id: string;
    name: string;
    type: "Freshwater" | "Saltwater";
    size: string;
    species: { name: string; count: number }[];
    plants: { name: string; count: number }[];
    equipment: string[];
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
  };
  