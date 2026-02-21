export const mockSymptoms: string[] = [
  "fever",
  "headache",
  "cough",
  "fatigue",
  "nausea",
  "chest_pain",
  "shortness_of_breath",
  "abdominal_pain",
  "diarrhea",
  "vomiting",
  "muscle_aches",
  "sore_throat",
  "runny_nose",
  "dizziness",
  "joint_pain",
  "back_pain",
  "skin_rash",
  "itching",
];

export const i18n = {
  en: {
    appName: "RoboDoc",
    subtitle: "AI Medical Assistant",
    initial1: "Hello! I'm RoboDoc, your AI health assistant.",
    initial2: 'Type "start" to begin your symptom analysis.',
    askName: "What's your name?",
    askAge: (name: string) => `Hi ${name}! How old are you?`,
    askGender: "What's your gender? (Male/Female)",
    askMainSymptom: "Describe your main symptom (e.g., fever, cough, headache)",
    addMoreSymptoms: (s: string) =>
      `Got it: ${s.replace("_", " ")}. Any other symptoms?`,
    askDays: "How many days have you had these symptoms?",
    analysisComplete: "Analysis Complete",
    analyzing: "Analyzing your symptoms with AI...",
    condition: (c: string) => `Predicted Condition: ${c}`,
    severity: (s: string) => `Severity Level: ${s.toUpperCase()}`,
    recommendations: "Recommendations:",
    moreCheck: (name: string) => `Check more symptoms, ${name}?`,
    thanksRestart: (name: string) =>
      `Thanks ${name}! Type 'start' to begin again.`,
  },
};

export const cleanMarkdown = (text: string): string => {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/_/g, "");
};

export const processInput = (input: string): { token: string } => {
  const lower = input.toLowerCase().trim();
  if (["yes", "yeah", "ok", "sure"].some((w) => lower.includes(w)))
    return { token: "yes" };
  if (["no", "nope", "never"].some((w) => lower.includes(w)))
    return { token: "no" };
  const num = lower.match(/\d+/);
  if (num) return { token: num[0] };
  return { token: lower };
};

export const normalizeSymptom = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .replace(/back ?pain|pain in back|lower back pain|backache/g, "back pain")
    .replace(/head ?ache|head pain/g, "headache")
    .replace(/chest ?pain/g, "chest pain")
    .replace(
      /shortness of breath|difficulty breathing/g,
      "shortness of breath"
    );
};

export const predictDiseaseLocal = (symptoms: string[]): string => {
  const set = new Set(symptoms);
  if (set.has("fever") && set.has("cough") && set.has("shortness_of_breath"))
    return "Pneumonia";
  if (set.has("fever") && set.has("cough") && set.has("fatigue"))
    return "Influenza (Flu)";
  if (set.has("runny_nose") && set.has("sore_throat") && set.has("cough"))
    return "Common Cold";
  if (set.has("diarrhea") && set.has("vomiting") && set.has("abdominal_pain"))
    return "Gastroenteritis";
  if (set.has("nausea") && set.has("vomiting")) return "Food Poisoning";
  if (set.has("skin_rash") && set.has("itching")) return "Allergic Reaction";
  if (set.has("muscle_aches") && set.has("joint_pain")) return "Arthritis";
  if (set.has("back_pain") && set.has("muscle_aches")) return "Muscle Strain";
  if (set.has("chest_pain") && set.has("shortness_of_breath"))
    return "Cardiac Issue (Seek immediate care)";
  if (set.has("headache") && set.has("fever") && set.has("dizziness"))
    return "Viral Infection";
  if (set.has("headache") && set.has("dizziness")) return "Migraine";
  if (set.has("fever")) return "Viral Infection";
  if (set.has("headache")) return "Tension Headache";
  if (set.has("cough")) return "Bronchitis";
  if (set.has("fatigue")) return "General Fatigue";
  return "General Illness";
};