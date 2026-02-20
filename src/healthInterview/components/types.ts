// healthInterview/types.ts

export type Lang = "en" | "ur";

export type StepId = "basic" | "current" | "history" | "lifestyle" | "summary";

export interface TriageResponse {
  primary_prediction: {
    disease: string;
    confidence: number;
    info?: {
      precautions?: string[];
    };
  };
  severity: {
    level: string;
    score: number;
    recommendation: string;
  };
  input_symptoms?: string[];
  duration_days?: number;
}

export interface FormData {
  // Step 1
  fullName: string;
  age: string;
  gender: string;
  city: string;
  phone: string;
  // Step 2
  mainConcern: string;
  symptomDuration: string;
  symptomPattern: string;
  symptomWorseWhen: string;
  associatedSymptoms: string;
  // Step 3
  chronicConditions: string[];
  otherConditions: string;
  currentMedicines: string;
  allergies: string;
  // Step 4
  smokingStatus: string;
  alcoholUse: string;
  exercise: string;
  sleepHours: string;
  stressLevel: string;
  moodNotes: string;
}