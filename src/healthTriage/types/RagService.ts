import type { ApiResponse, HealthResponse } from "../types/Types";

const API_BASE_URL = "http://localhost:5000/api/nlp";

export const predictDiseaseAPI = async (
  symptoms: string[],
  durationDays: number
): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptoms, duration: durationDays }),
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

export const getAllSymptoms = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/symptoms`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.symptoms || [];
  } catch (error) {
    console.error("Error fetching symptoms:", error);
    return [];
  }
};

export const getSymptomWeights = async (): Promise<Record<string, any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/symptom-weights`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.symptoms || {};
  } catch (error) {
    console.error("Error fetching symptom weights:", error);
    return {};
  }
};

export const checkBackendHealth = async (): Promise<HealthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  } catch (error: any) {
    console.error("Backend health check failed:", error);
    return { success: false, model_loaded: false, error: error.message };
  }
};