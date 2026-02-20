export interface SymptomEntry {
  id: string;
  symptom: string;
  severity: "mild" | "moderate" | "severe";
  date: string;
  duration: string;
  bodyPart: string;
  relatedSymptoms: string[];
}

export interface HealthPrediction {
  risk: "low" | "medium" | "high";
  message: string;
  recommendation: string;
}

export interface DiseaseSuggestion {
  id: string;
  name: string;
  likelihood: "low" | "medium" | "high";
  reason: string;
  urgencyNote: string;
}

export interface SeverityTrend {
  label: string;
  color: string;
}