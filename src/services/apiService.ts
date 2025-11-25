// src/services/apiService.ts

export const API_BASE_URL = "http://localhost:5000/api/nlp";

export interface PredictResponse {
  disease?: string;
  confidence?: number;
  precautions?: string[];
  description?: string;
  // backend may send more fields – keep it flexible:
  [key: string]: any;
}

export const getAllSymptoms = async (): Promise<string[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/symptoms`);
    const data = await res.json();
    return data.symptoms || [];
  } catch (err) {
    console.error("Error fetching symptoms:", err);
    return [];
  }
};

export const predictDisease = async (
  symptoms: string[],
  durationDays: number
): Promise<PredictResponse> => {
  try {
    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symptoms,
        duration: durationDays,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Predict API failed:", err);
    throw err;
  }
};

export const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Backend health failed:", err);
    return { success: false };
  }
};
