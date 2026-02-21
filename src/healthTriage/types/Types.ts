export interface Message {
  id: number;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
}

export interface UserData {
  name?: string;
  age?: number;
  gender?: string;
}

export interface Diagnosis {
  prediction: string;
  severity: string;
  days: number;
  precautions?: string[];
  confidence?: number;
}

export interface ApiResponse {
  success: boolean;
  primary_prediction?: {
    disease: string;
    confidence: number;
    info: {
      precautions: string[];
    };
  };
  severity?: {
    level: string;
    score: number;
    recommendation: string;
  };
}

export interface HealthResponse {
  success: boolean;
  model_loaded: boolean;
  model_info?: any;
  error?: string;
}