import React, { useState, useEffect, useRef } from "react";
import { Mic, Square, VolumeX, Trash2, Info } from "lucide-react";

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
  setCurrentModule?: (module: string) => void; // for voice navigation
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
  const sadWords = [
    "sad",
    "depressed",
    "crying",
    "hopeless",
    "down",
    "dukhi",
  ];
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

const summarizeEmotion = (history: EmotionLabel[]): string => {
  if (history.length === 0) {
    return "I'm still learning your emotional tone. You can talk freely and I'll adapt.";
  }

  const counts: Record<EmotionLabel, number> = {
    positive: 0,
    negative: 0,
    neutral: 0,
    anxious: 0,
    sad: 0,
    angry: 0,
  };

  history.forEach((e) => {
    counts[e] = (counts[e] || 0) + 1;
  });

  const dominant = (Object.keys(counts) as EmotionLabel[]).reduce((a, b) =>
    counts[b] > counts[a] ? b : a
  );

  switch (dominant) {
    case "positive":
      return "Overall you sound relatively hopeful and positive.";
    case "anxious":
      return "You seem a little worried. I'll keep things calm and reassuring.";
    case "sad":
      return "Your tone sounds a bit low or sad. I'll respond gently with support.";
    case "angry":
      return "You sound frustrated. I'll stay calm and help you through it.";
    case "neutral":
    default:
      return "Your tone seems mostly neutral. I'll keep explanations clear and balanced.";
  }
};

// -----------------------------------------------------------

const VoiceConversation: React.FC<VoiceConversationProps> = ({
  userLanguage = "en",
  setCurrentModule,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Emotion tracking
  const [emotionHistory, setEmotionHistory] = useState<EmotionLabel[]>([]);
  const [emotionalSummary, setEmotionalSummary] = useState<string>(
    "I'm still learning your emotional tone. You can talk freely and I'll adapt."
  );

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // INIT + CLEANUP
  useEffect(() => {
    initializeSpeechServices();
    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLanguage]);

  // Auto scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Recompute emotional summary whenever history updates
  useEffect(() => {
    if (emotionHistory.length === 0) {
      setEmotionalSummary(
        "I'm still learning your emotional tone. You can talk freely and I'll adapt."
      );
      return;
    }

    if (emotionHistory.length < 3) {
      setEmotionalSummary(
        "I'm still learning your emotional tone. Keep talking, and I'll adapt."
      );
      return;
    }

    const lastTen = emotionHistory.slice(-10);
    setEmotionalSummary(summarizeEmotion(lastTen));
  }, [emotionHistory]);

  // ---------------- SPEECH INIT ----------------

  const initializeSpeechServices = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari over HTTPS."
      );
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

        if (event.error === "no-speech") {
          setError("No speech detected. Please try again.");
        } else if (event.error === "audio-capture") {
          setError("Microphone not available. Please check permissions.");
        } else if (event.error === "not-allowed") {
          setError("Microphone access denied. Please allow microphone access.");
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
        setCurrentTranscript("");
      };

      recognition.onend = () => {
        setIsListening(false);
        setCurrentTranscript("");
      };
    } catch (err) {
      console.error("Error initializing speech recognition:", err);
      setError("Failed to initialize speech recognition");
    }

    // Check Speech Synthesis support
    if (!("speechSynthesis" in window)) {
      setError("Speech synthesis is not supported in this browser");
    }
  };

  const cleanup = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.log("Error stopping recognition:", err);
      }
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  // ---------------- LISTEN / SPEAK CONTROL ----------------

  const startListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition not initialized");
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
        setError("Failed to start listening");
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Error stopping recognition:", err);
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

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
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
    const t = text.toLowerCase();

    // NAVIGATION COMMANDS
    if (t.includes("open symptom") || t.includes("symptom checker")) {
      setCurrentModule && setCurrentModule("symptom");
      await speakText(
        userLanguage === "ur"
          ? "Symptom checker khol raha hoon."
          : "Opening the symptom checker.",
        userLanguage
      );
      return true;
    }

    if (
      t.includes("find doctor") ||
      t.includes("doctor in") ||
      t.includes("open doctor")
    ) {
      setCurrentModule && setCurrentModule("doctor");
      await speakText(
        userLanguage === "ur"
          ? "Doctor finder khol raha hoon."
          : "Opening the doctor finder.",
        userLanguage
      );
      return true;
    }

    if (t.includes("start interview") || t.includes("health interview")) {
      setCurrentModule && setCurrentModule("interview");
      await speakText(
        userLanguage === "ur"
          ? "Health interview start kar raha hoon."
          : "Starting the health interview.",
        userLanguage
      );
      return true;
    }

    if (
      t.includes("start triage") ||
      t.includes("chatbot") ||
      t.includes("assessment")
    ) {
      setCurrentModule && setCurrentModule("triage");
      await speakText(
        userLanguage === "ur"
          ? "Health triage module khol raha hoon."
          : "Opening the health triage module.",
        userLanguage
      );
      return true;
    }

    if (t.includes("go home") || t.includes("home screen")) {
      setCurrentModule && setCurrentModule("home");
      await speakText(
        userLanguage === "ur"
          ? "Home screen par ja raha hoon."
          : "Going back to the home screen.",
        userLanguage
      );
      return true;
    }

    // SCROLL COMMANDS
    if (t.includes("scroll down")) {
      window.scrollBy({ top: 500, behavior: "smooth" });
      await speakText(
        userLanguage === "ur"
          ? "Scroll down kar diya hai."
          : "Scrolling down.",
        userLanguage
      );
      return true;
    }

    if (t.includes("scroll up")) {
      window.scrollBy({ top: -500, behavior: "smooth" });
      await speakText(
        userLanguage === "ur"
          ? "Scroll up kar diya hai."
          : "Scrolling up.",
        userLanguage
      );
      return true;
    }

    // STOP COMMANDS
    if (t.includes("stop") || t.includes("ruk jao") || t.includes("bas")) {
      stopListening();
      stopSpeaking();
      await speakText(
        userLanguage === "ur"
          ? "Theek hai, main ruk gaya hoon."
          : "Okay, I’ve stopped now.",
        userLanguage
      );
      return true;
    }

    return false;
  };

  // ---------------- AI LOGIC ----------------

  const getAIResponse = async (
    userText: string,
    language: string
  ): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 600)); // small delay

    const t = userText.toLowerCase();
    const isUrdu = language === "ur";

    // GREETINGS
    if (
      t.includes("hello") ||
      t.includes("hi") ||
      t.includes("salam") ||
      t.includes("assalam") ||
      t.includes("aoa")
    ) {
      return isUrdu
        ? "السلام علیکم، میں آپ کا AI ہیلتھ اسسٹنٹ ہوں۔ آپ کیسی طبی مدد چاہتے ہیں؟"
        : "Hi, I’m your AI health assistant. How can I support you today?";
    }

    // HOW ARE YOU
    if (t.includes("how are you") || t.includes("kese ho") || t.includes("how r u")) {
      return isUrdu
        ? "میں بالکل ٹھیک ہوں، شکریہ! میں یہاں آپ کی صحت سے متعلق سوالات میں مدد کے لیے ہوں۔"
        : "I’m doing well, thank you! I’m here to help you with any health-related questions.";
    }

    // FEVER
    if (t.includes("fever") || t.includes("bukhār") || t.includes("bukhar")) {
      return isUrdu
        ? "آپ کو بخار محسوس ہو رہا ہے، یہ تشویش کی بات ہو سکتی ہے۔ اگر بخار 3 دن سے زیادہ رہے، بہت تیز ہو، یا سانس میں دقت، سینے میں درد، شدید کمزوری یا کنفیوژن ہو تو فوراً ڈاکٹر سے رابطہ کریں یا ایمرجنسی جائیں۔ گھر میں، پانی زیادہ پئیں، آرام کریں، اور ڈاکٹر کے مشورے کے بغیر کوئی دوا خود سے شروع نہ کریں۔"
        : "You mentioned fever, which can be concerning. If your fever lasts more than 3 days, is very high, or you have trouble breathing, chest pain, severe weakness, or confusion, you should contact a doctor or visit emergency services. At home, stay hydrated, rest, and avoid starting any new medicine without medical advice.";
    }

    // PAIN
    if (t.includes("pain") || t.includes("dard") || t.includes("hurt")) {
      return isUrdu
        ? "آپ نے درد کا ذکر کیا ہے۔ درد کی صحیح نوعیت سمجھنے کے لیے جگہ، شدت، دورانیہ اور دیگر علامات جاننا ضروری ہے۔ اگر درد بہت شدید ہو، اچانک شروع ہوا ہو، یا سانس، بولنے، یا چلنے میں مشکل ہو تو فوراً ایمرجنسی میں جائیں۔"
        : "You mentioned pain. To understand it properly, we usually look at the location, intensity, duration, and associated symptoms. If the pain is very severe, sudden, or affects your breathing, speech, or movement, please seek emergency medical care immediately.";
    }

    // HEADACHE
    if (t.includes("headache") || t.includes("sar dard") || t.includes("migraine")) {
      return isUrdu
        ? "سر درد کی بہت سی وجوہات ہو سکتی ہیں، جیسے تناؤ، نیند کی کمی، پانی کی کمی یا مائیگرین۔ اگر سر درد اچانک اور بہت شدید ہو، نظر میں دھندلاہٹ، بولنے میں مشکل، ہاتھ پاؤں سن ہونا، یا بخار کے ساتھ ہو تو فوراً ڈاکٹر کے پاس جائیں۔"
        : "Headaches can have many causes like tension, lack of sleep, dehydration, or migraine. If the headache is sudden and very severe, or comes with blurred vision, difficulty speaking, numbness, or fever, please see a doctor urgently.";
    }

    // MENTAL HEALTH
    if (
      t.includes("anxious") ||
      t.includes("anxiety") ||
      t.includes("depressed") ||
      t.includes("sad") ||
      t.includes("tension")
    ) {
      return isUrdu
        ? "آپ نے ذہنی کیفیت کا ذکر کیا ہے، جو واقعی اہم ہے۔ اگر آپ مسلسل پریشانی، اداسی، یا بے چینی محسوس کر رہے ہیں تو کسی ماہرِ نفسیات یا کونسلر سے بات کرنا بہت مددگار ہو سکتا ہے۔ آپ اکیلے نہیں ہیں، ایسی کیفیت عام ہے اور اس کا علاج ممکن ہے۔ اگر کبھی خود کو نقصان پہنچانے کا خیال آئے تو فوراً کسی قریبی فرد یا ایمرجنسی ہیلپ لائن سے رابطہ کریں۔"
        : "You’ve mentioned your emotional state, which is very important. If you are feeling ongoing anxiety, sadness, or stress, speaking with a mental health professional or counselor can really help. You’re not alone, and these feelings are common and treatable. If you ever feel at risk of harming yourself, please contact a trusted person or an emergency helpline immediately.";
    }

    // GENERIC HEALTH / SYMPTOMS
    if (
      t.includes("symptom") ||
      t.includes("problem") ||
      t.includes("issue")
    ) {
      return isUrdu
        ? "مجھے بتائیں کہ مسئلہ کب شروع ہوا، کہاں محسوس ہو رہا ہے، شدت کتنی ہے، اور کیا پہلے بھی ایسا ہوا ہے۔ جتنی تفصیل دیں گے، میں اتنی بہتر general رہنمائی دے سکوں گا، لیکن یاد رہے کہ یہ صرف معلوماتی ہے، حتمی تشخیص ڈاکٹر ہی کر سکتا ہے۔"
        : "Please tell me when the problem started, where you feel it, how intense it is, and if it has happened before. The more details you share, the better general guidance I can give — but remember, I can’t replace a real doctor for diagnosis.";
    }

    // FALLBACK
    return isUrdu
      ? "میں آپ کی بات سمجھنے کی کوشش کر رہا ہوں۔ آپ اپنی طبی کیفیت، علامات، یا سوال کو تھوڑا تفصیل سے بیان کریں، میں general معلومات اور آگے کے steps کے بارے میں رہنمائی دوں گا۔ لیکن یاد رہے کہ حتمی تشخیص اور علاج کے لیے ہمیشہ ڈاکٹر سے رجوع کریں۔"
      : "I’m trying to understand your situation. Please describe your condition, symptoms, or question in a bit more detail and I’ll guide you with general information and next steps. Remember, I cannot replace a real doctor for diagnosis or treatment.";
  };

  // ---------------- MESSAGE HANDLER ----------------

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;

    // Emotion
    const emotion = detectEmotionFromText(text);
    setEmotionHistory((prev) => [...prev, emotion]);

    // Add user message
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
      // First: try voice navigation commands
      const commandHandled = await handleVoiceCommands(text);
      if (commandHandled) {
        setIsProcessing(false);
        return;
      }

      // Normal AI reply
      const aiResponse = await getAIResponse(text, userLanguage);

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
      setError("Failed to process your message. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ---------------- UTIL ----------------

  const clearConversation = () => {
    setMessages([]);
    setEmotionHistory([]);
    setEmotionalSummary(
      "I'm still learning your emotional tone. You can talk freely and I'll adapt."
    );
    stopSpeaking();
    stopListening();
    setError(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isUrdu = userLanguage === "ur";

  // ---------------- UI ----------------

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[2.1fr,1.1fr]">
          {/* LEFT: Conversation Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 flex flex-col min-h-[480px] sm:min-h-[560px] transition-shadow duration-200 hover:shadow-2xl">
            {/* Header */}
            <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-blue-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-3xl">
              <h2 className="text-lg sm:text-xl font-semibold mb-1 flex items-center gap-2">
                <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
                {isUrdu ? "آوازی ہیلتھ اسسٹنٹ" : "Voice Health Assistant"}
              </h2>
              <p className="text-xs sm:text-sm text-blue-100">
                {isUrdu
                  ? "مجھ سے آواز کے ذریعے بات کریں، میں بنیادی رہنمائی، جذباتی ٹون اور ایپ نیویگیشن میں مدد کروں گا۔"
                  : "Talk to me using your voice. I’ll give basic health guidance, track emotional tone, and help you navigate the app."}
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
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4 shadow-inner animate-pulse">
                    <Mic className="w-8 h-8" />
                  </div>
                  <p className="mb-2 text-sm sm:text-base">
                    {isUrdu
                      ? "گفتگو شروع کرنے کے لیے مائیک بٹن دبائیں۔"
                      : "Press the microphone button to start talking."}
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-400">
                    {isUrdu
                      ? 'آپ کہہ سکتے ہیں: "Open symptom checker", "Find doctor in Lahore", "Scroll down"'
                      : 'You can say: "Open symptom checker", "Find doctor in Lahore", "Scroll down".'}
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-sm lg:max-w-md px-4 py-3 rounded-2xl text-sm sm:text-[15px] leading-relaxed transition-all duration-150 ${
                        message.isUser
                          ? "bg-blue-600 text-white shadow-md translate-y-[1px]"
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
                  <div className="max-w-[80%] sm:max-w-sm lg:max-w-md px-4 py-3 rounded-2xl bg-blue-100 text-blue-900 border-2 border-blue-300 shadow-sm transition-all duration-150">
                    <p className="text-sm italic">{currentTranscript}</p>
                    <p className="text-[11px] opacity-70 mt-1">
                      {isUrdu ? "سن رہا ہوں..." : "Listening..."}
                    </p>
                  </div>
                </div>
              )}

              {/* Processing */}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-200 text-gray-700 text-sm shadow-sm">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                    <span>{isUrdu ? "سوچ رہا ہوں..." : "Thinking..."}</span>
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
                  className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full text-white transition-all transform hover:scale-105 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-[0_0_0_10px_rgba(239,68,68,0.25)]"
                      : "bg-blue-600 hover:bg-blue-700 shadow-[0_10px_25px_rgba(37,99,235,0.35)]"
                  }`}
                  title={isListening ? "Stop listening" : "Start listening"}
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
                    className="flex items-center justify-center w-12 h-12 sm:w-12 sm:h-12 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 shadow-md"
                    title="Stop speaking"
                  >
                    <VolumeX className="w-5 h-5" />
                  </button>
                )}

                {/* Clear */}
                {messages.length > 0 && (
                  <button
                    onClick={clearConversation}
                    className="flex items-center justify-center w-12 h-12 sm:w-12 sm:h-12 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 shadow-md"
                    title="Clear conversation"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Status */}
              <div className="text-center mt-3">
                <p className="text-xs sm:text-sm text-gray-600">
                  {isListening
                    ? isUrdu
                      ? "🎤 سن رہا ہوں..."
                      : "🎤 Listening..."
                    : isSpeaking
                    ? isUrdu
                      ? "🔊 بول رہا ہوں..."
                      : "🔊 Speaking..."
                    : isProcessing
                    ? isUrdu
                      ? "⏳ پروسیسنگ..."
                      : "⏳ Processing..."
                    : isUrdu
                    ? "مائیک بٹن دبا کر بات شروع کریں۔"
                    : "Press the microphone to start talking."}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Emotion + Tips */}
          <div className="space-y-4 lg:space-y-5">
            {/* Emotion Summary */}
            <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4 sm:p-5 shadow-sm">
              <h3 className="text-sm sm:text-base font-semibold text-blue-900 mb-1.5 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                {isUrdu
                  ? "آپ کی مجموعی جذباتی ٹون"
                  : "Your Overall Emotional Tone"}
              </h3>
              <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                {emotionalSummary}
              </p>
              <p className="text-[10px] sm:text-[11px] text-blue-500 mt-2">
                {isUrdu
                  ? "یہ صرف اندازاً جذباتی تجزیہ ہے، طبی تشخیص نہیں۔"
                  : "This is an approximate emotional analysis, not a clinical diagnosis."}
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-white/80 border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                {isUrdu ? "مثالی وائس کمانڈز" : "Example Voice Commands"}
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
                <li>• "Open symptom checker"</li>
                <li>• "Find doctor in Lahore"</li>
                <li>• "Start interview"</li>
                <li>• "Scroll down" / "Scroll up"</li>
                <li>• "Stop" / "Ruk jao"</li>
              </ul>
              <p className="mt-3 text-[11px] text-gray-500">
                {isUrdu
                  ? "یہ فیچر صرف general معلومات اور ایپ نیویگیشن کے لیے ہے، حتمی تشخیص اور علاج کے لیے ہمیشہ کسی مستند ڈاکٹر سے رجوع کریں۔"
                  : "This feature is for general information and app navigation only. Always consult a qualified doctor for diagnosis and treatment."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceConversation;
