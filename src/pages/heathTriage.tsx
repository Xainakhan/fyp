import React, {
  useState,
  useEffect,
  useRef,
  type FormEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { askRag } from "../services/ragService";

import {
  Send,
  Bot,
  User,
  AlertTriangle,
  Phone,
  Clock,
  CheckCircle,
  MessageSquare,
  Stethoscope,
  RotateCcw,
  Wifi,
  WifiOff,
  Download,
  X,
  Activity,
  UserRound,
} from "lucide-react";

// Types
interface Message {
  id: number;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
}

interface UserData {
  name?: string;
  age?: number;
  gender?: string;
}

interface Diagnosis {
  prediction: string;
  severity: string;
  days: number;
  precautions?: string[];
  confidence?: number;
}

interface ApiResponse {
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

interface HealthResponse {
  success: boolean;
  model_loaded: boolean;
  model_info?: any;
  error?: string;
}

interface RoboDocChatbotProps {
  onNavigateToDoctor?: () => void;
}
const cleanMarkdown = (text: string) => {
  return text
    .replace(/\*\*/g, "") // remove bold
    .replace(/\*/g, "") // remove single stars
    .replace(/_/g, ""); // remove underscores
};

// API Configuration
const API_BASE_URL = "http://localhost:5000/api/nlp";

// API Service Functions
const predictDiseaseAPI = async (
  symptoms: string[],
  durationDays: number
): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symptoms: symptoms,
        duration: durationDays,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error predicting disease:", error);
    throw error;
  }
};

const getAllSymptoms = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/symptoms`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.symptoms || [];
  } catch (error) {
    console.error("Error fetching symptoms:", error);
    return [];
  }
};

const getSymptomWeights = async (): Promise<Record<string, any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/symptom-weights`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.symptoms || {};
  } catch (error) {
    console.error("Error fetching symptom weights:", error);
    return {};
  }
};

const checkBackendHealth = async (): Promise<HealthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Backend health check failed:", error);
    return { success: false, model_loaded: false, error: error.message };
  }
};

const mockSymptoms: string[] = [
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

const i18n = {
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

const processInput = (input: string): { token: string } => {
  const lower = input.toLowerCase().trim();
  if (["yes", "yeah", "ok", "sure"].some((w) => lower.includes(w)))
    return { token: "yes" };
  if (["no", "nope", "never"].some((w) => lower.includes(w)))
    return { token: "no" };
  const num = lower.match(/\d+/);
  if (num) return { token: num[0] };
  return { token: lower };
};
// Detect symptoms even if user types natural language like "pain in neck"
const detectSymptom = (input: string, available: string[]) => {
  const lower = input.toLowerCase();

  // 1) Exact match
  if (available.includes(lower)) return lower;

  // 2) Partial match (e.g., "severe headache" → headache)
  for (const sym of available) {
    if (lower.includes(sym.replace("_", " "))) {
      return sym;
    }
  }

  // 3) Special cases for phrases
  if (lower.includes("neck")) return "neck_pain";
  if (lower.includes("back")) return "back_pain";
  if (lower.includes("throat")) return "sore_throat";
  if (lower.includes("stomach") || lower.includes("belly"))
    return "abdominal_pain";

  return null;
};

// Local fallback prediction
const predictDiseaseLocal = (symptoms: string[]): string => {
  const set = new Set(symptoms);

  if (set.has("fever") && set.has("cough") && set.has("shortness_of_breath")) {
    return "Pneumonia";
  }
  if (set.has("fever") && set.has("cough") && set.has("fatigue")) {
    return "Influenza (Flu)";
  }
  if (set.has("runny_nose") && set.has("sore_throat") && set.has("cough")) {
    return "Common Cold";
  }
  if (set.has("diarrhea") && set.has("vomiting") && set.has("abdominal_pain")) {
    return "Gastroenteritis";
  }
  if (set.has("nausea") && set.has("vomiting")) {
    return "Food Poisoning";
  }
  if (set.has("skin_rash") && set.has("itching")) {
    return "Allergic Reaction";
  }
  if (set.has("muscle_aches") && set.has("joint_pain")) {
    return "Arthritis";
  }
  if (set.has("back_pain") && set.has("muscle_aches")) {
    return "Muscle Strain";
  }
  if (set.has("chest_pain") && set.has("shortness_of_breath")) {
    return "Cardiac Issue (Seek immediate care)";
  }
  if (set.has("headache") && set.has("fever") && set.has("dizziness")) {
    return "Viral Infection";
  }
  if (set.has("headache") && set.has("dizziness")) {
    return "Migraine";
  }
  if (set.has("fever")) return "Viral Infection";
  if (set.has("headache")) return "Tension Headache";
  if (set.has("cough")) return "Bronchitis";
  if (set.has("fatigue")) return "General Fatigue";

  return "General Illness";
};

const RoboDocChatbot: React.FC<RoboDocChatbotProps> = ({
  onNavigateToDoctor,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "bot", text: i18n.en.initial1, timestamp: new Date() },
    { id: 2, sender: "bot", text: i18n.en.initial2, timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [step, setStep] = useState<string>("initial");
  const [userData, setUserData] = useState<UserData>({});
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);

  const [availableSymptoms, setAvailableSymptoms] =
    useState<string[]>(mockSymptoms);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [, setSymptomWeights] = useState<Record<string, any>>({});
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadBackend = async () => {
      try {
        const health = await checkBackendHealth();
        if (health.success && health.model_loaded) {
          setBackendConnected(true);
          const symptoms = await getAllSymptoms();
          const weights = await getSymptomWeights();
          setAvailableSymptoms(symptoms.length > 0 ? symptoms : mockSymptoms);
          setSymptomWeights(weights);
          console.log("Backend connected:", health.model_info);
        }
      } catch (error) {
        console.warn("Backend offline, using fallback");
        setBackendConnected(false);
      }
    };
    loadBackend();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 100) + "px";
    }
  }, [inputValue]);

  const addMessage = (sender: "bot" | "user", text: string) => {
    const cleaned = cleanMarkdown(text);

    const msg: Message = {
      id: Date.now() + Math.random(),
      sender,
      text: cleaned,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, msg]);
  };

  const simulateTyping = async (
    text: string,
    delay: number = 600
  ): Promise<void> => {
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, delay));
    setIsTyping(false);
    addMessage("bot", cleanMarkdown(text));
  };
 const normalizeSymptom = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z0-9 ]/g, "")     // remove special chars
    .replace(/\s+/g, " ")              // fix spacing
    .replace(/back ?pain|pain in back|lower back pain|backache/g, "back pain")
    .replace(/head ?ache|head pain/g, "headache")
    .replace(/chest ?pain/g, "chest pain")
    .replace(/shortness of breath|difficulty breathing/g, "shortness of breath");
};


  const handleUserInput = async (message: string): Promise<void> => {
    addMessage("user", message);
    setInputValue("");
    const { token } = processInput(message);

    // ================================
    // 1️⃣ UNIVERSAL EXIT / RESET
    // ================================
    if (message.toLowerCase().includes("restart")) {
      resetChat();
      return;
    }

    // ================================
    // 2️⃣ IF USER TYPES START → BEGIN DIAGNOSIS FLOW
    // ================================
    if (message.toLowerCase() === "start") {
      setStep("name");
      await simulateTyping(i18n.en.askName);
      return;
    }

    // ================================
    // 3️⃣ IF NOT INSIDE DIAGNOSIS, HANDLE CHAT MODE
    // ================================
    if (step === "initial") {
      // ——— RAG FOR MEDICAL QUESTIONS ———
      if (message.trim().split(" ").length > 2) {
        try {
          await simulateTyping("Let me check that for you...", 400);
          const rag = await askRag(message);
          await simulateTyping(rag.answer);
        } catch (err) {
          console.error(err);
          await simulateTyping("Sorry, I couldn't fetch an answer right now.");
        }
        return;
      }

      // ——— BASIC CONVERSATION HANDLING ———
      const lower = message.toLowerCase();

      if (lower.includes("hi") || lower.includes("hello")) {
        await simulateTyping("Hello! How can I help you today?");
        return;
      }

      if (lower.includes("how are you")) {
        await simulateTyping("I'm doing great! How can I assist you?");
        return;
      }

      if (lower.includes("bye")) {
        await simulateTyping("Goodbye! Stay healthy 😊");
        return;
      }

      // DEFAULT RESPONSE
      await simulateTyping(
        "You can chat with me freely, or type “start” to begin a symptom diagnosis."
      );
      return;
    }

    // ================================
    // 4️⃣ DIAGNOSIS FLOW (OLD LOGIC)
    // ================================
    switch (step) {
      case "name": {
        const medicalKeywords = [
          "fever",
          "malaria",
          "dengue",
          "pain",
          "cough",
          "flu",
          "headache",
          "nausea",
          "vomiting",
          "diarrhea",
          "infection",
          "ill",
          "dizzy",
        ];

        const lower = message.toLowerCase();

        // If user types a disease or symptom instead of a name → DO NOT accept
        if (medicalKeywords.some((k) => lower.includes(k))) {
          await simulateTyping(
            "It looks like you're talking about a medical condition.\n\n" +
              "👉 Do you want to **chat normally** or **start a full diagnosis**?\n" +
              "Type **chat** or **diagnose**."
          );
          setStep("confirmMode");
          return;
        }

        // Otherwise accept as normal name
        setUserData((prev) => ({ ...prev, name: message }));
        setStep("age");
        await simulateTyping(i18n.en.askAge(message));
        break;
      }

      case "age":
        const age = parseInt(token);
        if (age && age > 0 && age < 150) {
          setUserData((prev) => ({ ...prev, age }));
          setStep("gender");
          await simulateTyping(i18n.en.askGender);
        } else {
          await simulateTyping("Please enter a valid age (1-150)");
        }
        break;

      case "gender":
        const gender = message.toLowerCase().includes("female")
          ? "female"
          : "male";
        setUserData((prev) => ({ ...prev, gender }));
        setStep("symptoms");
        await simulateTyping(i18n.en.askMainSymptom);
        break;

case "symptoms":
  const firstSymptom = normalizeSymptom(message);
  setSymptoms([firstSymptom]);
  setStep("moreSymptoms");
  await simulateTyping(`Got it: ${firstSymptom}. Any other symptoms?`);
  break;


case "moreSymptoms":
  if (token === "no") {
    setStep("duration");
    await simulateTyping(i18n.en.askDays);
  } else {
    const s = normalizeSymptom(message);
    setSymptoms((prev) => [...prev, s]);
    await simulateTyping(`Added: ${s}. Any more symptoms?`);
  }
  break;



      case "duration":
        const days = parseInt(token);
        if (days && days > 0) {
          await provideDiagnosis(days);
        } else {
          await simulateTyping("Please enter number of days (e.g., 3, 5, 7)");
        }
        break;

      case "completed":
        if (token === "yes") {
          setStep("symptoms");
          setSymptoms([]);
          setDiagnosis(null);
          await simulateTyping(i18n.en.askMainSymptom);
        } else {
          await simulateTyping(i18n.en.thanksRestart(userData.name || "there"));
          setStep("initial");
        }
        break;
      case "confirmMode":
        if (message.toLowerCase() === "chat") {
          setStep("initial");
          await simulateTyping("Sure! You can chat with me freely now.");
        } else if (message.toLowerCase() === "diagnose") {
          setStep("age");
          await simulateTyping("Great! Let's continue. How old are you?");
        } else {
          await simulateTyping('Please type "chat" or "diagnose".');
        }
        break;

      default:
        await simulateTyping(
          "I didn’t understand that. Type “start” to begin diagnosis or ask your question."
        );
    }
  };

  const provideDiagnosis = async (days: number): Promise<void> => {
    try {
      await simulateTyping(i18n.en.analyzing, 400);

      console.log("Sending to API:", { symptoms, days });

      if (backendConnected) {
        const result = await predictDiseaseAPI(symptoms, days);

        console.log("API Response:", result);

        if (result.success && result.primary_prediction && result.severity) {
          const { primary_prediction, severity } = result;

          setDiagnosis({
            prediction: primary_prediction.disease,
            severity: severity.level,
            precautions: primary_prediction.info.precautions,
            confidence: primary_prediction.confidence,
            days,
          });

          setStep("completed");
          await simulateTyping(i18n.en.analysisComplete);
          await simulateTyping(
            `${i18n.en.condition(primary_prediction.disease)} (${(
              primary_prediction.confidence * 100
            ).toFixed(1)}% confidence)`
          );
          await simulateTyping(
            `${i18n.en.severity(severity.level)} (Score: ${severity.score})`
          );
          await simulateTyping(i18n.en.recommendations);

          for (let i = 0; i < primary_prediction.info.precautions.length; i++) {
            await simulateTyping(
              `${i + 1}. ${primary_prediction.info.precautions[i]}`,
              500
            );
          }

          if (severity.level === "high") {
            await simulateTyping(`${severity.recommendation}`, 800);
          }
        }
      } else {
        const prediction = predictDiseaseLocal(symptoms);
        const severity = symptoms.length > 3 ? "moderate" : "low";

        setDiagnosis({
          prediction,
          severity,
          days,
          precautions: [
            "Rest and stay hydrated",
            "Monitor symptoms",
            "Consult a doctor if symptoms persist",
          ],
        });
        setStep("completed");

        await simulateTyping(i18n.en.analysisComplete);
        await simulateTyping(i18n.en.condition(prediction));
        await simulateTyping(i18n.en.severity(severity));
        await simulateTyping("Rest, stay hydrated, and monitor symptoms.");
      }

      await simulateTyping(i18n.en.moreCheck(userData.name || "there"));
    } catch (error) {
      console.error("Diagnosis error:", error);
      await simulateTyping(
        "Sorry, analysis failed. Please try again or consult a doctor."
      );
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    handleUserInput(inputValue.trim());
  };

  const resetChat = (): void => {
    setMessages([
      { id: 1, sender: "bot", text: i18n.en.initial1, timestamp: new Date() },
      { id: 2, sender: "bot", text: i18n.en.initial2, timestamp: new Date() },
    ]);
    setStep("initial");
    setUserData({});
    setSymptoms([]);
    setDiagnosis(null);
    setShowAnalysis(false);
  };

  const generatePDF = (): void => {
    if (!diagnosis) return;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>RoboDoc Medical Report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      color: #333;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #3b82f6;
      margin: 0;
      font-size: 32px;
    }
    .section {
      margin-bottom: 25px;
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #3b82f6;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }
    .symptoms {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .symptom-tag {
      background: #dcfce7;
      color: #166534;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
    }
    .recommendations {
      list-style: none;
      padding: 0;
    }
    .recommendations li {
      padding: 10px;
      margin-bottom: 8px;
      background: white;
      border-radius: 6px;
      border-left: 3px solid #3b82f6;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>ROBODOC</h1>
    <p>AI Medical Analysis Report</p>
  </div>
  <div class="section">
    <h2>Patient Information</h2>
    <div class="info-grid">
      <div><strong>Name:</strong> ${userData.name || "N/A"}</div>
      <div><strong>Age:</strong> ${userData.age || "N/A"}</div>
      <div><strong>Gender:</strong> ${userData.gender || "N/A"}</div>
    </div>
  </div>
  <div class="section">
    <h2>Symptoms</h2>
    <div class="symptoms">
      ${symptoms
        .map((s) => `<span class="symptom-tag">${s.replace(/_/g, " ")}</span>`)
        .join("")}
    </div>
    <p>Duration: ${diagnosis.days} days</p>
  </div>
  <div class="section">
    <h2>Diagnosis</h2>
    <h3>${diagnosis.prediction}</h3>
    <p>Severity: ${diagnosis.severity}</p>
    ${
      diagnosis.confidence
        ? `<p>Confidence: ${(diagnosis.confidence * 100).toFixed(1)}%</p>`
        : ""
    }
  </div>
  <div class="section">
    <h2>Recommendations</h2>
    <ul class="recommendations">
      ${
        diagnosis.precautions
          ? diagnosis.precautions.map((p) => `<li>${p}</li>`).join("")
          : "<li>Rest and consult a doctor</li>"
      }
    </ul>
  </div>
  <p style="margin-top: 30px; font-size: 12px; color: #666;">Generated: ${new Date().toLocaleString()}</p>
</body>
</html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2.5 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <Stethoscope className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {i18n.en.appName}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden xs:block">
                {i18n.en.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-3">
            <div className="flex items-center space-x-1 sm:space-x-2 px-2 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm">
              {backendConnected ? (
                <>
                  <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  <span className="text-xs text-green-600 font-medium hidden xs:inline">
                    Online
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  <span className="text-xs text-gray-500 hidden xs:inline">
                    Offline
                  </span>
                </>
              )}
            </div>

            <button
              onClick={() => onNavigateToDoctor?.()}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md text-xs sm:text-sm font-medium"
              title="Find a Doctor"
            >
              <UserRound className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Find Doctor</span>
              <span className="sm:hidden">Doctor</span>
            </button>

            <button
              onClick={resetChat}
              className="p-1.5 sm:p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              title="Reset Chat"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full min-h-0">
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4 space-y-2.5 sm:space-y-4"
        >
          {messages.map((m, index) => (
            <div
              key={m.id}
              className={`flex ${
                m.sender === "user" ? "justify-end" : "justify-start"
              } animate-[fadeIn_0.3s_ease-in-out]`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className={`flex max-w-[90%] sm:max-w-xl ${
                  m.sender === "user" ? "flex-row-reverse" : "flex-row"
                } items-end`}
              >
                <div
                  className={
                    m.sender === "user" ? "ml-1.5 sm:ml-2" : "mr-1.5 sm:mr-2"
                  }
                >
                  <div
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md ${
                      m.sender === "user"
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                        : "bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500"
                    }`}
                  >
                    {m.sender === "user" ? (
                      <User className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                    )}
                  </div>
                </div>
                <div
                  className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-sm text-sm ${
                    m.sender === "user"
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <p className="leading-relaxed break-words">{m.text}</p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex animate-[fadeIn_0.3s_ease-in-out]">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500 mr-1.5 sm:mr-2 flex items-center justify-center shadow-md">
                <Bot className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 border border-gray-200 shadow-sm">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t px-3 sm:px-6 py-3 sm:py-4 flex-shrink-0">
          <form
            onSubmit={handleSubmit}
            className="flex items-end space-x-2 sm:space-x-3"
          >
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setInputValue(e.target.value)
              }
              onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto text-sm sm:text-base"
              style={{
                minHeight: "40px",
                maxHeight: "100px",
              }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 flex-shrink-0 shadow-md"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Diagnosis Summary Bar */}
      {diagnosis && !isTyping && step === "completed" && (
        <div className="bg-white border-t shadow-lg sticky bottom-0 z-10">
          <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                <span className="font-medium truncate max-w-[150px] sm:max-w-none">
                  {diagnosis.prediction}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <AlertTriangle
                  className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
                    diagnosis.severity === "high"
                      ? "text-red-500"
                      : diagnosis.severity === "moderate"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                />
                <span className="capitalize">{diagnosis.severity}</span>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                <span>{diagnosis.days} days</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => setShowAnalysis(true)}
                className="flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm flex-1 sm:flex-initial"
              >
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>View Analysis</span>
              </button>
              <button
                onClick={onNavigateToDoctor}
                className="flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition text-xs sm:text-sm flex-1 sm:flex-initial"
              >
                <UserRound className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Consult Doctor</span>
              </button>
              {diagnosis.severity === "high" && (
                <button className="flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs sm:text-sm flex-1 sm:flex-initial">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Emergency</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Analysis Modal */}
      {showAnalysis && diagnosis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
                <h2 className="text-base sm:text-xl font-bold">
                  Medical Analysis Report
                </h2>
              </div>
              <button
                onClick={() => setShowAnalysis(false)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
                  Patient Information
                </h3>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Name</p>
                    <p className="font-medium truncate">
                      {userData.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Age</p>
                    <p className="font-medium">{userData.age || "N/A"} years</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Gender</p>
                    <p className="font-medium capitalize">
                      {userData.gender || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" />
                  Reported Symptoms
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {symptoms.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm"
                    >
                      {s.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  Duration: {diagnosis.days} days
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                  <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-500" />
                  Diagnosis
                </h3>
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 sm:p-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-base sm:text-lg font-bold text-indigo-900">
                      {diagnosis.prediction}
                    </span>
                    {diagnosis.confidence && (
                      <span className="px-2.5 py-1 bg-indigo-200 text-indigo-800 rounded-full text-xs sm:text-sm font-medium w-fit">
                        {(diagnosis.confidence * 100).toFixed(1)}% confidence
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-xs sm:text-sm">
                    <div className="flex items-center space-x-1">
                      <AlertTriangle
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                          diagnosis.severity === "high"
                            ? "text-red-500"
                            : diagnosis.severity === "moderate"
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      />
                      <span className="capitalize font-medium">
                        {diagnosis.severity} Severity
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {diagnosis.precautions && diagnosis.precautions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {diagnosis.precautions.map((precaution, i) => (
                      <li
                        key={i}
                        className="flex items-start space-x-2 text-xs sm:text-sm"
                      >
                        <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-medium text-xs">
                          {i + 1}
                        </span>
                        <span className="text-gray-700 pt-0.5">
                          {precaution}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {diagnosis.severity === "high" && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded-r-lg">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-1 text-sm sm:text-base">
                        Important Notice
                      </h4>
                      <p className="text-xs sm:text-sm text-red-700">
                        This condition requires immediate medical attention.
                        Please consult a healthcare professional as soon as
                        possible.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 sm:p-3 text-xs text-yellow-800">
                <strong>Disclaimer:</strong> This is an AI-assisted preliminary
                analysis and should NOT replace professional medical advice.
                Always consult qualified healthcare providers for accurate
                diagnosis and treatment.
              </div>
            </div>

            <div className="border-t px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0 flex-shrink-0">
              <p className="text-xs text-gray-500 text-center sm:text-left">
                Generated on {new Date().toLocaleString()}
              </p>
              <div className="flex space-x-2 sm:space-x-3">
                <button
                  onClick={() => setShowAnalysis(false)}
                  className="flex-1 sm:flex-initial px-3 py-2 sm:px-4 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  Close
                </button>
                <button
                  onClick={onNavigateToDoctor}
                  className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition text-sm"
                >
                  <UserRound className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Consult Doctor</span>
                </button>
                <button
                  onClick={generatePDF}
                  className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition text-sm"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoboDocChatbot;
