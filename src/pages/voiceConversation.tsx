import React, { useState, useEffect, useRef } from "react";
import { Mic, Square, VolumeX, Trash2, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language: string;
}

type EmotionLabel =
  | "positive"
  | "negative"
  | "neutral"
  | "anxious"
  | "sad"
  | "angry";

interface VoiceConversationProps {
  userLanguage?: "en" | "ur";
  setCurrentModule?: (module: string) => void;
}

// ---------------- EMOTION DETECTION HELPERS ----------------

const detectEmotionFromText = (text: string): EmotionLabel => {
  const t = text.toLowerCase();
  const positiveWords = [
    "thank",
    "good",
    "great",
    "relieved",
    "better",
    "fine",
    "okay",
    "shukar",
  ];
  const anxiousWords = [
    "worried",
    "scared",
    "anxious",
    "nervous",
    "panic",
    "tension",
  ];
  const sadWords = ["sad", "depressed", "crying", "hopeless", "down", "dukhi"];
  const angryWords = [
    "angry",
    "upset",
    "frustrated",
    "annoyed",
    "gussa",
    "irritated",
  ];

  if (positiveWords.some((w) => t.includes(w))) return "positive";
  if (anxiousWords.some((w) => t.includes(w))) return "anxious";
  if (sadWords.some((w) => t.includes(w))) return "sad";
  if (angryWords.some((w) => t.includes(w))) return "angry";
  if (t.includes("?")) return "anxious";
  if (t.includes("pain") || t.includes("hurt") || t.includes("dard"))
    return "sad";
  return "neutral";
};

// -----------------------------------------------------------

const VoiceConversation: React.FC<VoiceConversationProps> = ({
  userLanguage = "en",
  setCurrentModule,
}) => {
  const { t } = useTranslation("voiceConversation");

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionLabel[]>([]);
  const [emotionalSummary, setEmotionalSummary] = useState<string>("");

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set initial emotional summary after t() is available
  useEffect(() => {
    setEmotionalSummary(t("emotion.initial"));
  }, [t]);

  useEffect(() => {
    initializeSpeechServices();
    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (emotionHistory.length === 0) {
      setEmotionalSummary(t("emotion.initial"));
      return;
    }
    if (emotionHistory.length < 3) {
      setEmotionalSummary(t("emotion.learning"));
      return;
    }
    const lastTen = emotionHistory.slice(-10);
    const counts: Record<EmotionLabel, number> = {
      positive: 0,
      negative: 0,
      neutral: 0,
      anxious: 0,
      sad: 0,
      angry: 0,
    };
    lastTen.forEach((e) => {
      counts[e] = (counts[e] || 0) + 1;
    });
    const dominant = (Object.keys(counts) as EmotionLabel[]).reduce((a, b) =>
      counts[b] > counts[a] ? b : a,
    );
    setEmotionalSummary(t(`emotion.${dominant}`));
  }, [emotionHistory, t]);

  // ---------------- SPEECH INIT ----------------

  const initializeSpeechServices = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(t("errors.noRecognition"));
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = userLanguage === "ur" ? "ur-PK" : "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        if (finalTranscript) {
          setCurrentTranscript("");
          handleUserMessage(finalTranscript.trim());
        } else {
          setCurrentTranscript(interimTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "no-speech") setError(t("errors.noSpeech"));
        else if (event.error === "audio-capture")
          setError(t("errors.audioCapture"));
        else if (event.error === "not-allowed")
          setError(t("errors.notAllowed"));
        else setError(`${t("errors.generic")} ${event.error}`);
        setIsListening(false);
        setCurrentTranscript("");
      };

      recognition.onend = () => {
        setIsListening(false);
        setCurrentTranscript("");
      };
    } catch (err) {
      console.error("Error initializing speech recognition:", err);
      setError(t("errors.failedInit"));
    }

    if (!("speechSynthesis" in window)) {
      setError(t("errors.noSynthesis"));
    }
  };

  const cleanup = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.log(err);
      }
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  // ---------------- LISTEN / SPEAK CONTROL ----------------

  const startListening = () => {
    if (!recognitionRef.current) {
      setError(t("errors.notInitialized"));
      return;
    }
    if (isListening) return;
    try {
      setCurrentTranscript("");
      setError(null);
      recognitionRef.current.start();
    } catch (err: any) {
      console.error("Error starting recognition:", err);
      if (err.message && err.message.includes("already started")) {
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current.start();
        }, 100);
      } else {
        setError(t("errors.failedStart"));
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const speakText = async (text: string, language: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!("speechSynthesis" in window)) {
        reject(new Error("Speech synthesis not available"));
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "ur" ? "ur-PK" : "en-US";
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      utterance.onerror = (event) => {
        console.error(event);
        setIsSpeaking(false);
        reject(new Error("Speech synthesis error"));
      };
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    });
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // ---------------- VOICE COMMANDS ----------------

  const handleVoiceCommands = async (text: string): Promise<boolean> => {
    const tl = text.toLowerCase();

    if (tl.includes("open symptom") || tl.includes("symptom checker")) {
      setCurrentModule && setCurrentModule("symptom");
      await speakText(t("navigation.openingSymptom"), userLanguage);
      return true;
    }
    if (
      tl.includes("find doctor") ||
      tl.includes("doctor in") ||
      tl.includes("open doctor")
    ) {
      setCurrentModule && setCurrentModule("doctor");
      await speakText(t("navigation.openingDoctor"), userLanguage);
      return true;
    }
    if (tl.includes("start interview") || tl.includes("health interview")) {
      setCurrentModule && setCurrentModule("interview");
      await speakText(t("navigation.openingInterview"), userLanguage);
      return true;
    }
    if (
      tl.includes("start triage") ||
      tl.includes("chatbot") ||
      tl.includes("assessment")
    ) {
      setCurrentModule && setCurrentModule("triage");
      await speakText(t("navigation.openingTriage"), userLanguage);
      return true;
    }
    if (tl.includes("go home") || tl.includes("home screen")) {
      setCurrentModule && setCurrentModule("home");
      await speakText(t("navigation.goingHome"), userLanguage);
      return true;
    }
    if (tl.includes("scroll down")) {
      window.scrollBy({ top: 500, behavior: "smooth" });
      await speakText(t("navigation.scrollDown"), userLanguage);
      return true;
    }
    if (tl.includes("scroll up")) {
      window.scrollBy({ top: -500, behavior: "smooth" });
      await speakText(t("navigation.scrollUp"), userLanguage);
      return true;
    }
    if (tl.includes("stop") || tl.includes("ruk jao") || tl.includes("bas")) {
      stopListening();
      stopSpeaking();
      await speakText(t("navigation.stopped"), userLanguage);
      return true;
    }
    return false;
  };

  // ---------------- AI LOGIC ----------------

  const getAIResponse = async (userText: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const tl = userText.toLowerCase();

    if (
      tl.includes("hello") ||
      tl.includes("hi") ||
      tl.includes("salam") ||
      tl.includes("assalam") ||
      tl.includes("aoa")
    )
      return t("ai.greeting");
    if (
      tl.includes("how are you") ||
      tl.includes("kese ho") ||
      tl.includes("how r u")
    )
      return t("ai.howAreYou");
    if (tl.includes("fever") || tl.includes("bukhār") || tl.includes("bukhar"))
      return t("ai.fever");
    if (tl.includes("pain") || tl.includes("dard") || tl.includes("hurt"))
      return t("ai.pain");
    if (
      tl.includes("headache") ||
      tl.includes("sar dard") ||
      tl.includes("migraine")
    )
      return t("ai.headache");
    if (
      tl.includes("anxious") ||
      tl.includes("anxiety") ||
      tl.includes("depressed") ||
      tl.includes("sad") ||
      tl.includes("tension")
    )
      return t("ai.mentalHealth");
    if (
      tl.includes("symptom") ||
      tl.includes("problem") ||
      tl.includes("issue")
    )
      return t("ai.symptom");

    return t("ai.fallback");
  };

  // ---------------- MESSAGE HANDLER ----------------

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;

    const emotion = detectEmotionFromText(text);
    setEmotionHistory((prev) => [...prev, emotion]);

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
      language: userLanguage,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const commandHandled = await handleVoiceCommands(text);
      if (commandHandled) {
        setIsProcessing(false);
        return;
      }

      const aiResponse = await getAIResponse(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        language: userLanguage,
      };
      setMessages((prev) => [...prev, aiMessage]);
      await speakText(aiResponse, userLanguage);
    } catch (err) {
      console.error("Error in handleUserMessage:", err);
      setError(t("errors.failedProcess"));
    } finally {
      setIsProcessing(false);
    }
  };

  // ---------------- UTIL ----------------

  const clearConversation = () => {
    setMessages([]);
    setEmotionHistory([]);
    setEmotionalSummary(t("emotion.initial"));
    stopSpeaking();
    stopListening();
    setError(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ---------------- UI ----------------

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-50 via-green-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[2.1fr,1.1fr]">
          {/* LEFT: Conversation Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 flex flex-col min-h-[480px] sm:min-h-[560px] transition-shadow duration-200 hover:shadow-2xl">
            {/* Header */}
            <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-green-50 bg-gradient-to-r from-green-600 to-indigo-600 text-white rounded-t-3xl">
              <h2 className="text-lg sm:text-xl font-semibold mb-1 flex items-center gap-2">
                <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
                {t("header.title")}
              </h2>
              <p className="text-xs sm:text-sm text-green-100">
                {t("header.subtitle")}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 px-4 py-3 mx-4 mt-3 rounded-md flex gap-2">
                <Info className="w-4 h-4 text-red-500 mt-0.5" />
                <p className="text-xs sm:text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Conversation */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-4 pb-3 space-y-4 bg-slate-50/60">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-10 sm:mt-14">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4 shadow-inner animate-pulse">
                    <Mic className="w-8 h-8" />
                  </div>
                  <p className="mb-2 text-sm sm:text-base">
                    {t("empty.prompt")}
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-400">
                    {t("empty.hint")}
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-sm lg:max-w-md px-4 py-3 rounded-2xl text-sm sm:text-[15px] leading-relaxed transition-all duration-150 ${
                        message.isUser
                          ? "bg-green-600 text-white shadow-md translate-y-[1px]"
                          : "bg-white text-gray-800 border border-gray-100 shadow-sm"
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.text}</p>
                      <p className="text-[10px] opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}

              {/* Current Transcript */}
              {currentTranscript && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] sm:max-w-sm lg:max-w-md px-4 py-3 rounded-2xl bg-green-100 text-green-900 border-2 border-green-300 shadow-sm">
                    <p className="text-sm italic">{currentTranscript}</p>
                    <p className="text-[11px] opacity-70 mt-1">
                      {t("status.listeningInline")}
                    </p>
                  </div>
                </div>
              )}

              {/* Processing */}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-200 text-gray-700 text-sm shadow-sm">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent" />
                    <span>{t("status.thinking")}</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Controls */}
            <div className="px-4 sm:px-6 py-4 border-t bg-white/80 rounded-b-3xl">
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                {/* Mic */}
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isSpeaking || isProcessing}
                  className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full text-white transition-all transform hover:scale-105 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-[0_0_0_10px_rgba(239,68,68,0.25)]"
                      : "bg-green-600 hover:bg-green-700 shadow-[0_10px_25px_rgba(37,99,235,0.35)]"
                  }`}
                >
                  {isListening ? (
                    <Square className="w-6 h-6" />
                  ) : (
                    <Mic className="w-6 h-6" />
                  )}
                </button>

                {/* Stop Speaking */}
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all transform hover:scale-105 shadow-md"
                  >
                    <VolumeX className="w-5 h-5" />
                  </button>
                )}

                {/* Clear */}
                {messages.length > 0 && (
                  <button
                    onClick={clearConversation}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition-all transform hover:scale-105 shadow-md"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Status */}
              <div className="text-center mt-3">
                <p className="text-xs sm:text-sm text-gray-600">
                  {isListening
                    ? t("status.listening")
                    : isSpeaking
                      ? t("status.speaking")
                      : isProcessing
                        ? t("status.processing")
                        : t("status.idle")}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Emotion + Tips */}
          <div className="space-y-4 lg:space-y-5">
            {/* Emotion Summary */}
            <div className="bg-green-50/80 border border-green-100 rounded-2xl p-4 sm:p-5 shadow-sm">
              <h3 className="text-sm sm:text-base font-semibold text-green-900 mb-1.5 flex items-center gap-2">
                <Info className="w-4 h-4 text-green-500" />
                {t("emotion.title")}
              </h3>
              <p className="text-xs sm:text-sm text-green-800 leading-relaxed">
                {emotionalSummary}
              </p>
              <p className="text-[10px] sm:text-[11px] text-green-500 mt-2">
                {t("emotion.disclaimer")}
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-white/80 border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-green-500" />
                {t("commands.title")}
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
                <li>• "{t("commands.list.symptom")}"</li>
                <li>• "{t("commands.list.doctor")}"</li>
                <li>• "{t("commands.list.interview")}"</li>
                <li>• "{t("commands.list.scroll")}"</li>
                <li>• "{t("commands.list.stop")}"</li>
              </ul>
              <p className="mt-3 text-[11px] text-gray-500">
                {t("commands.disclaimer")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceConversation;
