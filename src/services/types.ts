// API Response wrapper
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Triage Types
export interface Condition {
  name: string;
  probability: number;
}

export interface DiagnosisData {
  severity: 'critical' | 'severe' | 'moderate' | 'mild';
  possible_conditions: Condition[];
  recommendations: string[];
  urgency_level: 'emergency' | 'urgent' | 'soon' | 'routine';
}

export interface ChatResponse {
  response: string;
}

// Doctor Types
export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  location: string;
  phone: string;
  rating: number;
  available: boolean;
}

export interface DoctorSearchParams {
  specialty?: string | null;
  location?: string;
}

// Health Types
export interface EmergencyInfo {
  emergency_numbers: {
    ambulance: string;
    rescue: string;
    police: string;
  };
  nearest_hospitals: Hospital[];
}

export interface Hospital {
  name: string;
  distance: string;
  address?: string;
}

export interface InterviewQuestion {
  id: number;
  question: string;
  type: 'text' | 'boolean' | 'multiple_choice';
  options?: string[];
}

// Request Types
export interface SymptomAnalysisRequest {
  symptoms: string;
}

export interface ChatRequest {
  message: string;
  context?: string[];
}

export interface InterviewQuestionsRequest {
  condition?: string;
}