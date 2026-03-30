// doctors/types.ts

export type Language = "en" | "ur";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface DoctorBase {
  id: number;
  name: string;
  qualification: string;
  experience: string;
  hospital: string;
  location: string;
  coordinates: Coordinates;
  address?: string;
  phone: string;
  rating: number;
  reviews: number;
  consultationFee: number;
  availability: string[];
  timeSlots: string[];
  languages: string[];
  specializations: string[];
  verified: boolean;
  onlineConsultation: boolean;
  distance: number | null;
}

export interface SpecialtyName {
  en: string;
  ur: string;
}

export interface SpecialtyData {
  name: SpecialtyName;
  specialty: SpecialtyName;
  conditions: string[];
  doctors: DoctorBase[];
}

export type DoctorDatabase = Record<string, SpecialtyData>;

export type DoctorWithMeta = DoctorBase & {
  specialty: SpecialtyName;
  specialtyKey: string;
  specialtyName: string; 
};

export type SortBy =
  | "distance"
  | "rating"
  | "experience"
  | "price_low"
  | "price_high"
  | "reviews";

export interface PriceRange {
  min: string;
  max: string;
}
