// healthInterview/helpers.ts
import type { FormData } from "./types";

export const parseDurationToDays = (input: string): number => {
  if (!input) return 0;
  const lower = input.toLowerCase();
  const numMatch = lower.match(/(\d+)/);
  const n = numMatch ? parseInt(numMatch[1], 10) : 0;
  if (!n) return 0;
  if (lower.includes("week")) return n * 7;
  if (lower.includes("month")) return n * 30;
  return n;
};

export const buildSymptomsArray = (associatedSymptoms: string, mainConcern: string): string[] => {
  if (associatedSymptoms.trim().length > 0) {
    return associatedSymptoms.split(/,|;|\n/).map((s) => s.trim()).filter(Boolean);
  }
  if (mainConcern.trim().length > 0) return [mainConcern.trim()];
  return [];
};

export const buildMedicalHistoryText = (form: FormData): string => {
  const parts: string[] = [];
  if (form.chronicConditions.length > 0) parts.push(`Chronic conditions: ${form.chronicConditions.join(", ")}`);
  if (form.otherConditions) parts.push(`Other history: ${form.otherConditions}`);
  if (form.currentMedicines) parts.push(`Current medicines: ${form.currentMedicines}`);
  if (form.allergies) parts.push(`Allergies: ${form.allergies}`);
  return parts.join(" | ");
};

export const buildLifestyleText = (form: FormData): string => {
  const parts: string[] = [];
  if (form.smokingStatus) parts.push(`Smoking/tobacco: ${form.smokingStatus}`);
  if (form.alcoholUse) parts.push(`Alcohol/substances: ${form.alcoholUse}`);
  if (form.exercise) parts.push(`Exercise: ${form.exercise}`);
  if (form.sleepHours) parts.push(`Sleep (hrs): ${form.sleepHours}`);
  if (form.stressLevel) parts.push(`Stress level: ${form.stressLevel}`);
  if (form.moodNotes) parts.push(`Mood notes: ${form.moodNotes}`);
  return parts.join(" | ");
};

export const downloadSummary = (form: FormData) => {
  const lines = [
    "SehatHub – Health Interview Summary",
    "",
    `Generated on: ${new Date().toLocaleString()}`,
    "----------------------------------------------",
    "BASIC INFORMATION",
    `Name: ${form.fullName || "Not provided"}`,
    `Age: ${form.age || "Not provided"}`,
    `Gender: ${form.gender || "Not provided"}`,
    `City: ${form.city || "Not provided"}`,
    `Phone: ${form.phone || "Not provided"}`,
    "",
    "CURRENT PROBLEM",
    `Main concern: ${form.mainConcern || "Not provided"}`,
    `Duration: ${form.symptomDuration || "Not provided"}`,
    `Pattern: ${form.symptomPattern || "Not provided"}`,
    `Worse when: ${form.symptomWorseWhen || "Not provided"}`,
    `Other symptoms: ${form.associatedSymptoms || "Not provided"}`,
    "",
    "MEDICAL HISTORY",
    `Chronic conditions: ${form.chronicConditions.length > 0 ? form.chronicConditions.join(", ") : "None"}`,
    `Other past illnesses / surgeries: ${form.otherConditions || "Not provided"}`,
    `Regular medicines: ${form.currentMedicines || "Not provided"}`,
    `Allergies: ${form.allergies || "Not provided"}`,
    "",
    "LIFESTYLE & MENTAL HEALTH",
    `Smoking / tobacco: ${form.smokingStatus || "Not provided"}`,
    `Alcohol / substances: ${form.alcoholUse || "Not provided"}`,
    `Exercise / activity: ${form.exercise || "Not provided"}`,
    `Average sleep (hours): ${form.sleepHours || "Not provided"}`,
    `Stress level: ${form.stressLevel || "Not provided"}`,
    `Mood / mental health notes: ${form.moodNotes || "Not provided"}`,
    "",
    "NOTE: This summary is for consultation support only. It is NOT a medical report or diagnosis.",
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "SehatHub_Health_Interview_Summary.txt";
  a.click();
  URL.revokeObjectURL(url);
};