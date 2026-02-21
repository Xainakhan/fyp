import { useState, useEffect, useRef } from "react";
import { askRag } from "../../services/ragService";
import type { Message, UserData, Diagnosis } from "../types/Types";
import {
  i18n,
  mockSymptoms,
  cleanMarkdown,
  processInput,
  normalizeSymptom,
  predictDiseaseLocal,
} from "../types/Constants";
import {
  predictDiseaseAPI,
  getAllSymptoms,
  getSymptomWeights,
  checkBackendHealth,
} from "../types/RagService";

const INITIAL_MESSAGES: Message[] = [
  { id: 1, sender: "bot", text: i18n.en.initial1, timestamp: new Date() },
  { id: 2, sender: "bot", text: i18n.en.initial2, timestamp: new Date() },
];

export const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [step, setStep] = useState<string>("initial");
  const [userData, setUserData] = useState<UserData>({});
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [availableSymptoms, setAvailableSymptoms] =
    useState<string[]>(mockSymptoms);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load backend on mount
  useEffect(() => {
    const loadBackend = async (): Promise<void> => {
      try {
        const health = await checkBackendHealth();
        if (health.success && health.model_loaded) {
          setBackendConnected(true);
          const symptomsData = await getAllSymptoms();
          const weights = await getSymptomWeights();
          setAvailableSymptoms(
            symptomsData.length > 0 ? symptomsData : mockSymptoms
          );
          console.log("Backend connected:", health.model_info);
        }
      } catch {
        console.warn("Backend offline, using fallback");
        setBackendConnected(false);
      }
    };
    loadBackend();
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 200) + "px";
    }
  }, [inputValue]);

  const addMessage = (sender: "bot" | "user", text: string): void => {
    const msg: Message = {
      id: Date.now() + Math.random(),
      sender,
      text: cleanMarkdown(text),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
  };

  const simulateTyping = async (
    text: string,
    delay?: number
  ): Promise<void> => {
    setIsTyping(true);
    await new Promise<void>((resolve) =>
      setTimeout(resolve, delay ?? 600)
    );
    setIsTyping(false);
    addMessage("bot", cleanMarkdown(text));
  };

  const provideDiagnosis = async (days: number): Promise<void> => {
    try {
      await simulateTyping(i18n.en.analyzing, 400);

      if (backendConnected) {
        const result = await predictDiseaseAPI(symptoms, days);
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
            await simulateTyping(severity.recommendation, 800);
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
        } catch {
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
          "fever","malaria","dengue","pain","cough","flu","headache",
          "nausea","vomiting","diarrhea","infection","ill","dizzy",
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
        const gender = message.toLowerCase().includes("female") ? "female" : "male";
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    handleUserInput(inputValue.trim());
  };

  const resetChat = (): void => {
    setMessages(INITIAL_MESSAGES);
    setStep("initial");
    setUserData({});
    setSymptoms([]);
    setDiagnosis(null);
    setShowAnalysis(false);
  };

  const generatePDF = (userData: UserData, symptoms: string[], diagnosis: Diagnosis): void => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>RoboDoc Medical Report</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #333; }
    .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #3b82f6; margin: 0; font-size: 32px; }
    .section { margin-bottom: 25px; background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; }
    .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
    .symptoms { display: flex; flex-wrap: wrap; gap: 10px; }
    .symptom-tag { background: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 20px; font-size: 14px; }
    .recommendations { list-style: none; padding: 0; }
    .recommendations li { padding: 10px; margin-bottom: 8px; background: white; border-radius: 6px; border-left: 3px solid #3b82f6; }
  </style>
</head>
<body>
  <div class="header"><h1>ROBODOC</h1><p>AI Medical Analysis Report</p></div>
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
      ${symptoms.map((s) => `<span class="symptom-tag">${s.replace(/_/g, " ")}</span>`).join("")}
    </div>
    <p>Duration: ${diagnosis.days} days</p>
  </div>
  <div class="section">
    <h2>Diagnosis</h2>
    <h3>${diagnosis.prediction}</h3>
    <p>Severity: ${diagnosis.severity}</p>
    ${diagnosis.confidence ? `<p>Confidence: ${(diagnosis.confidence * 100).toFixed(1)}%</p>` : ""}
  </div>
  <div class="section">
    <h2>Recommendations</h2>
    <ul class="recommendations">
      ${diagnosis.precautions ? diagnosis.precautions.map((p) => `<li>${p}</li>`).join("") : "<li>Rest and consult a doctor</li>"}
    </ul>
  </div>
  <p style="margin-top: 30px; font-size: 12px; color: #666;">Generated: ${new Date().toLocaleString()}</p>
</body>
</html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => printWindow.print();
    }
  };

  return {
    // State
    messages,
    inputValue,
    setInputValue,
    isTyping,
    diagnosis,
    userData,
    symptoms,
    sidebarOpen,
    setSidebarOpen,
    backendConnected,
    showAnalysis,
    setShowAnalysis,
    // Refs
    chatContainerRef,
    textareaRef,
    messagesEndRef,
    // Actions
    handleSubmit,
    handleUserInput,
    resetChat,
    generatePDF,
  };
};