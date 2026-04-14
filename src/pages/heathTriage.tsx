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
  CheckCircle,
  MessageSquare,
  Stethoscope,
  Wifi,
  WifiOff,
  Download,
  X,
  Activity,
  UserRound,
  Menu,
  Plus,
  Settings,
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
  userLanguage?: "en" | "ur";  // Add this prop
}

const cleanMarkdown = (text: string): string => {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/_/g, "");
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
  userLanguage: _userLanguage, // Add with underscore since not used yet
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
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // FIXED: Changed from availableSymptom to availableSymptoms with setter
  const [_availableSymptoms, _setAvailableSymptoms] = useState<string[]>(mockSymptoms);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [, setSymptomWeights] = useState<Record<string, any>>({});
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadBackend = async (): Promise<void> => {
      try {
        const health = await checkBackendHealth();
        if (health.success && health.model_loaded) {
          setBackendConnected(true);
          const symptomsData = await getAllSymptoms();
          const weights = await getSymptomWeights();
          _setAvailableSymptoms(
            symptomsData.length > 0 ? symptomsData : mockSymptoms
          );
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
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 200) + "px";
    }
  }, [inputValue]);

  const addMessage = (sender: "bot" | "user", text: string): void => {
    const cleaned = cleanMarkdown(text);
    const msg: Message = {
      id: Date.now() + Math.random(),
      sender,
      text: cleaned,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
  };

  const simulateTyping = async (text: string, delay?: number): Promise<void> => {
    setIsTyping(true);
    await new Promise<void>((resolve) => setTimeout(resolve, delay ?? 600));
    setIsTyping(false);
    addMessage("bot", cleanMarkdown(text));
  };

  const normalizeSymptom = (text: string): string => {
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

  const handleUserInput = async (message: string): Promise<void> => {
    addMessage("user", message);
    setInputValue("");
    const { token } = processInput(message);

    if (message.toLowerCase().includes("restart")) {
      resetChat();
      return;
    }

    if (message.toLowerCase() === "start") {
      setStep("name");
      await simulateTyping(i18n.en.askName);
      return;
    }

    if (step === "initial") {
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
      await simulateTyping(
        'You can chat with me freely, or type "start" to begin a symptom diagnosis.'
      );
      return;
    }

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
        if (medicalKeywords.some((k) => lower.includes(k))) {
          await simulateTyping(
            "It looks like you're talking about a medical condition.\n\n" +
              "👉 Do you want to chat normally or start a full diagnosis?\n" +
              'Type chat or diagnose.'
          );
          setStep("confirmMode");
          return;
        }
        setUserData((prev) => ({ ...prev, name: message }));
        setStep("age");
        await simulateTyping(i18n.en.askAge(message));
        break;
      }

      case "age": {
        const age = parseInt(token);
        if (age && age > 0 && age < 150) {
          setUserData((prev) => ({ ...prev, age }));
          setStep("gender");
          await simulateTyping(i18n.en.askGender);
        } else {
          await simulateTyping("Please enter a valid age (1-150)");
        }
        break;
      }

      case "gender": {
        const gender = message.toLowerCase().includes("female")
          ? "female"
          : "male";
        setUserData((prev) => ({ ...prev, gender }));
        setStep("symptoms");
        await simulateTyping(i18n.en.askMainSymptom);
        break;
      }

      case "symptoms": {
        const firstSymptom = normalizeSymptom(message);
        setSymptoms([firstSymptom]);
        setStep("moreSymptoms");
        await simulateTyping(`Got it: ${firstSymptom}. Any other symptoms?`);
        break;
      }

      case "moreSymptoms": {
        if (token === "no") {
          setStep("duration");
          await simulateTyping(i18n.en.askDays);
        } else {
          const s = normalizeSymptom(message);
          setSymptoms((prev) => [...prev, s]);
          await simulateTyping(`Added: ${s}. Any more symptoms?`);
        }
        break;
      }

      case "duration": {
        const days = parseInt(token);
        if (days && days > 0) {
          await provideDiagnosis(days);
        } else {
          await simulateTyping("Please enter number of days (e.g., 3, 5, 7)");
        }
        break;
      }

      case "completed": {
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
      }

      case "confirmMode": {
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
      }

      default: {
        await simulateTyping(
          'I didn\'t understand that. Type "start" to begin diagnosis or ask your question.'
        );
        break;
      }
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
      printWindow.onload = (): void => {
        printWindow.print();
      };
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } flex-shrink-0 transition-all duration-300 overflow-hidden flex flex-col`}
        style={{
          background: "linear-gradient(180deg, #b8d4e8 0%, #9ec4d8 25%, #82b4c8 55%, #8dbfaa 100%)",
        }}
      >
        {/* Sidebar content */}
        <div className="p-4 border-b border-white/30">
          <button
            onClick={resetChat}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors text-sm font-medium text-white"
            style={{ background: "rgba(59, 100, 150, 0.75)" }}
          >
            <Plus className="w-4 h-4" />
            <span>New chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="text-xs px-3 py-2 font-semibold text-blue-900/60">
            Recent
          </div>
          <button className="w-full text-left px-3 py-2.5 rounded-lg transition-colors text-sm flex items-center space-x-2 text-white font-medium"
            style={{ background: "rgba(59, 100, 160, 0.65)" }}
          >
            <MessageSquare className="w-4 h-4 text-white/80" />
            <span className="flex-1 truncate">Symptom Analysis</span>
          </button>
        </div>

        <div className="border-t border-white/30 p-3 space-y-1">
          <button
            onClick={onNavigateToDoctor}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm text-blue-950/80 hover:bg-white/25"
          >
            <UserRound className="w-4 h-4 text-blue-900/60" />
            <span>Find Doctor</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm text-blue-950/80 hover:bg-white/25">
            <Settings className="w-4 h-4 text-blue-900/60" />
            <span>Settings</span>
          </button>
          <div className="px-3 py-2 flex items-center space-x-2 text-xs">
            {backendConnected ? (
              <>
                <Wifi className="w-3 h-3 text-green-600" />
                <span className="text-green-700 font-medium">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-blue-900/40" />
                <span className="text-blue-900/50">Offline Mode</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">
                  RoboDoc
                </h1>
                <p className="text-xs text-gray-500">AI Medical Assistant</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {diagnosis && (
              <>
                <button
                  onClick={() => setShowAnalysis(true)}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center space-x-1.5"
                >
                  <Activity className="w-4 h-4" />
                  <span>View Report</span>
                </button>
                <button
                  onClick={onNavigateToDoctor}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm flex items-center space-x-1.5"
                >
                  <UserRound className="w-4 h-4" />
                  <span>Find Doctor</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto bg-white"
        >
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mr-3 flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] ${
                    m.sender === "user"
                      ? "bg-green-600 text-white rounded-2xl px-4 py-2.5"
                      : "text-gray-800"
                  }`}
                >
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {m.text}
                  </p>
                </div>
                {m.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center ml-3 flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mr-3">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <form onSubmit={handleSubmit} className="relative">
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
                placeholder="Message RoboDoc..."
                rows={1}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-[15px]"
                style={{
                  minHeight: "52px",
                  maxHeight: "200px",
                }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-2 bottom-2 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <p className="text-xs text-center text-gray-500 mt-3">
              RoboDoc can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Modal */}
      {showAnalysis && diagnosis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Activity className="w-6 h-6" />
                <h2 className="text-xl font-bold">Medical Analysis Report</h2>
              </div>
              <button
                onClick={() => setShowAnalysis(false)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Patient Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-green-500" />
                  Patient Information
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Name</p>
                    <p className="font-medium">{userData.name || "N/A"}</p>
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

              {/* Symptoms */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-green-500" />
                  Reported Symptoms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {s.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Duration: {diagnosis.days} days
                </p>
              </div>

              {/* Diagnosis */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Stethoscope className="w-5 h-5 mr-2 text-indigo-500" />
                  Diagnosis
                </h3>
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-indigo-900">
                      {diagnosis.prediction}
                    </span>
                    {diagnosis.confidence && (
                      <span className="px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full text-sm font-medium">
                        {(diagnosis.confidence * 100).toFixed(1)}% confidence
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <AlertTriangle
                        className={`w-4 h-4 ${
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

              {/* Recommendations */}
              {diagnosis.precautions && diagnosis.precautions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {diagnosis.precautions.map((precaution, i) => (
                      <li key={i} className="flex items-start space-x-2 text-sm">
                        <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 font-medium text-xs">
                          {i + 1}
                        </span>
                        <span className="text-gray-700 pt-0.5">{precaution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
                <strong>Disclaimer:</strong> This is an AI-assisted preliminary
                analysis and should NOT replace professional medical advice. Always
                consult qualified healthcare providers for accurate diagnosis and
                treatment.
              </div>
            </div>

            <div className="border-t px-6 py-4 bg-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Generated on {new Date().toLocaleString()}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAnalysis(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  Close
                </button>
                <button
                  onClick={onNavigateToDoctor}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition text-sm"
                >
                  <UserRound className="w-4 h-4" />
                  <span>Consult Doctor</span>
                </button>
                <button
                  onClick={generatePDF}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition text-sm"
                >
                  <Download className="w-4 h-4" />
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