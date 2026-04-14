export type Lang = "en" | "ur";
export type StepId = "basic" | "current" | "history" | "lifestyle" | "summary";

export interface TriageResponse {
  primary_prediction: {
    disease: string;
    confidence: number;
    possible_condition?: string;
    risk_level?: string;
    recommendation?: string;
    precautions?: string;
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
  
  // Add these for SummaryStep direct access
  possible_condition?: string;
  risk_level?: string;
  recommendation?: string;
  precautions?: string;
}

export interface FormData {
  fullName: string;
  age: string;
  gender: string;
  city: string;
  phone: string;
  mainConcern: string;
  symptomDuration: string;
  symptomPattern: string;
  symptomWorseWhen: string;
  associatedSymptoms: string;
  chronicConditions: string[];
  otherConditions: string;
  currentMedicines: string;
  allergies: string;
  smokingStatus: string;
  alcoholUse: string;
  exercise: string;
  sleepHours: string;
  stressLevel: string;
  moodNotes: string;
}