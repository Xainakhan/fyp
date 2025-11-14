// src/services/apiService.js

const API_BASE_URL = 'http://localhost:5000/api/nlp';

export const predictDisease = async (symptoms, durationDays) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symptoms: symptoms,
        duration: durationDays
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error predicting disease:', error);
    throw error;
  }
};

export const getSymptomWeights = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/symptom-weights`);
    const data = await response.json();
    return data.symptoms;
  } catch (error) {
    console.error('Error fetching symptom weights:', error);
    return {};
  }
};

export const getAllSymptoms = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/symptoms`);
    const data = await response.json();
    return data.symptoms;
  } catch (error) {
    console.error('Error fetching symptoms:', error);
    return [];
  }
};

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return { success: false, error: error.message };
  }
};