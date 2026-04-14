import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { askRag } from "../../services/ragService";
import type { Message, UserData, Diagnosis } from "../types/Types";
import {
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

export const useChatbot = () => {
  const { t } = useTranslation("healthTriage");

  const fill = (str: string, vars: Record<string, string | number>) =>
    Object.entries(vars).reduce(
      (s, [k, v]) => s.replace(`{{${k}}}`, String(v)),
      str
    );

  const makeInitialMessages = (): Message[] => [
    { id: 1, sender: "bot", text: t("bot.initial1"), timestamp: new Date() },
    { id: 2, sender: "bot", text: t("bot.initial2"), timestamp: new Date() },
  ];

  const [messages, setMessages] = useState<Message[]>(makeInitialMessages);
  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [step, setStep] = useState<string>("initial");
  const [userData, setUserData] = useState<UserData>({});
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
const [_availableSymptoms, setAvailableSymptoms] = useState<string[]>(mockSymptoms);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Re-render initial messages when language changes
  useEffect(() => {
    setMessages(makeInitialMessages());
  }, [i18n.language]);

  // Load backend on mount
  useEffect(() => {
    const loadBackend = async (): Promise<void> => {
      try {
        const health = await checkBackendHealth();
        if (health.success && health.model_loaded) {
          setBackendConnected(true);
          const symptomsData = await getAllSymptoms();
          await getSymptomWeights();
          setAvailableSymptoms(symptomsData.length > 0 ? symptomsData : mockSymptoms);
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
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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

  const simulateTyping = async (text: string, delay?: number): Promise<void> => {
    setIsTyping(true);
    await new Promise<void>((resolve) => setTimeout(resolve, delay ?? 600));
    setIsTyping(false);
    addMessage("bot", cleanMarkdown(text));
  };

  const provideDiagnosis = async (days: number): Promise<void> => {
    try {
      await simulateTyping(t("bot.analyzing"), 400);

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
          await simulateTyping(t("bot.analysisComplete"));
          await simulateTyping(
            fill(t("bot.condition"), { condition: primary_prediction.disease }) +
              ` (${(primary_prediction.confidence * 100).toFixed(1)}%)`
          );
          await simulateTyping(
            fill(t("bot.severity"), { severity: severity.level.toUpperCase() }) +
              ` (Score: ${severity.score})`
          );
          await simulateTyping(t("bot.recommendations"));
          for (let i = 0; i < primary_prediction.info.precautions.length; i++) {
            await simulateTyping(`${i + 1}. ${primary_prediction.info.precautions[i]}`, 500);
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
        await simulateTyping(t("bot.analysisComplete"));
        await simulateTyping(fill(t("bot.condition"), { condition: prediction }));
        await simulateTyping(fill(t("bot.severity"), { severity: severity.toUpperCase() }));
        await simulateTyping(t("bot.restHydrate"));
      }

      await simulateTyping(fill(t("bot.moreCheck"), { name: userData.name || "there" }));
    } catch (error) {
      console.error("Diagnosis error:", error);
      await simulateTyping(t("bot.diagnosisFailed"));
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
      await simulateTyping(t("bot.askName"));
      return;
    }

    if (step === "initial") {
      if (message.trim().split(" ").length > 2) {
        try {
          await simulateTyping(t("bot.letMeCheck"), 400);
          const rag = await askRag(message);
          await simulateTyping(rag.answer);
        } catch {
          await simulateTyping(t("bot.fetchError"));
        }
        return;
      }
      const lower = message.toLowerCase();
      if (lower.includes("hi") || lower.includes("hello")) {
        await simulateTyping(t("bot.hello"));
        return;
      }
      if (lower.includes("how are you")) {
        await simulateTyping(t("bot.doingGreat"));
        return;
      }
      if (lower.includes("bye")) {
        await simulateTyping(t("bot.goodbye"));
        return;
      }
      await simulateTyping(t("bot.freeChat"));
      return;
    }

    switch (step) {
      case "name": {
        const medicalKeywords = [
          "fever","malaria","dengue","pain","cough","flu","headache",
          "nausea","vomiting","diarrhea","infection","ill","dizzy",
        ];
        if (medicalKeywords.some((k) => message.toLowerCase().includes(k))) {
          await simulateTyping(t("bot.medicalDetected"));
          setStep("confirmMode");
          return;
        }
        setUserData((prev) => ({ ...prev, name: message }));
        setStep("age");
        await simulateTyping(fill(t("bot.askAge"), { name: message }));
        break;
      }
      case "age": {
        const age = parseInt(token);
        if (age && age > 0 && age < 150) {
          setUserData((prev) => ({ ...prev, age }));
          setStep("gender");
          await simulateTyping(t("bot.askGender"));
        } else {
          await simulateTyping(t("bot.invalidAge"));
        }
        break;
      }
      case "gender": {
        const gender = message.toLowerCase().includes("female") ? "female" : "male";
        setUserData((prev) => ({ ...prev, gender }));
        setStep("symptoms");
        await simulateTyping(t("bot.askMainSymptom"));
        break;
      }
      case "symptoms": {
        const firstSymptom = normalizeSymptom(message);
        setSymptoms([firstSymptom]);
        setStep("moreSymptoms");
        await simulateTyping(fill(t("bot.gotIt"), { symptom: firstSymptom }));
        break;
      }
      case "moreSymptoms": {
        if (token === "no") {
          setStep("duration");
          await simulateTyping(t("bot.askDays"));
        } else {
          const s = normalizeSymptom(message);
          setSymptoms((prev) => [...prev, s]);
          await simulateTyping(fill(t("bot.added"), { symptom: s }));
        }
        break;
      }
      case "duration": {
        const days = parseInt(token);
        if (days && days > 0) {
          await provideDiagnosis(days);
        } else {
          await simulateTyping(t("bot.invalidDays"));
        }
        break;
      }
      case "completed": {
        if (token === "yes") {
          setStep("symptoms");
          setSymptoms([]);
          setDiagnosis(null);
          await simulateTyping(t("bot.askMainSymptom"));
        } else {
          await simulateTyping(fill(t("bot.thanksRestart"), { name: userData.name || "there" }));
          setStep("initial");
        }
        break;
      }
      case "confirmMode": {
        if (message.toLowerCase() === "chat") {
          setStep("initial");
          await simulateTyping(t("bot.confirmChat"));
        } else if (message.toLowerCase() === "diagnose") {
          setStep("age");
          await simulateTyping(t("bot.confirmDiagnose"));
        } else {
          await simulateTyping(t("bot.confirmPrompt"));
        }
        break;
      }
      default: {
        await simulateTyping(t("bot.didNotUnderstand"));
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
    setMessages(makeInitialMessages());
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
  <title>${t("pdf.title")}</title>
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
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header"><h1>${t("pdf.title")}</h1><p>${t("pdf.subtitle")}</p></div>
  <div class="section">
    <h2>${t("pdf.patientInfo")}</h2>
    <div class="info-grid">
      <div><strong>${t("modal.name")}:</strong> ${userData.name || t("modal.na")}</div>
      <div><strong>${t("modal.age")}:</strong> ${userData.age || t("modal.na")}</div>
      <div><strong>${t("modal.gender")}:</strong> ${userData.gender || t("modal.na")}</div>
    </div>
  </div>
  <div class="section">
    <h2>${t("pdf.symptoms")}</h2>
    <div class="symptoms">
      ${symptoms.map((s) => `<span class="symptom-tag">${s.replace(/_/g, " ")}</span>`).join("")}
    </div>
    <p>${t("pdf.duration")} ${diagnosis.days} ${t("pdf.days")}</p>
  </div>
  <div class="section">
    <h2>${t("pdf.diagnosis")}</h2>
    <h3>${diagnosis.prediction}</h3>
    <p>${t("pdf.severity")} ${diagnosis.severity}</p>
    ${diagnosis.confidence ? `<p>${t("pdf.confidence")} ${(diagnosis.confidence * 100).toFixed(1)}%</p>` : ""}
  </div>
  <div class="section">
    <h2>${t("pdf.recommendations")}</h2>
    <ul class="recommendations">
      ${diagnosis.precautions
        ? diagnosis.precautions.map((p) => `<li>${p}</li>`).join("")
        : `<li>${t("pdf.fallback")}</li>`}
    </ul>
  </div>
  <p class="footer">${t("pdf.generated")} ${new Date().toLocaleString()}</p>
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
    chatContainerRef,
    textareaRef,
    messagesEndRef,
    handleSubmit,
    handleUserInput,
    resetChat,
    generatePDF,
    t,
  };
};