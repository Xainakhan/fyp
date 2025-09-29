// components/VoiceConversation.tsx
import React, { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language: string;
}

interface VoiceConversationProps {
  userLanguage: string;
}

const VoiceConversation: React.FC<VoiceConversationProps> = ({
  userLanguage,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for speech recognition and synthesis
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize speech services
  useEffect(() => {
    initializeSpeechServices();
    return () => {
      cleanup();
    };
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSpeechServices = () => {
    // Initialize Speech Recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = userLanguage === "ur" ? "ur-PK" : "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
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
          handleUserMessage(finalTranscript.trim());
        } else {
          setCurrentTranscript(interimTranscript);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setCurrentTranscript("");
      };
    } else {
      setError("Speech recognition is not supported in this browser");
    }

    // Initialize Speech Synthesis
    if ("speechSynthesis" in window) {
      synthesisRef.current = window.speechSynthesis;
    } else {
      setError("Speech synthesis is not supported in this browser");
    }
  };

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setCurrentTranscript("");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleUserMessage = async (text: string) => {
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
      // Simulate AI response (replace with actual API call)
      const aiResponse = await getAIResponse(text, userLanguage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        language: userLanguage,
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      // Speak the AI response
      await speakText(aiResponse, userLanguage);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setError("Failed to get AI response");
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulate AI response (replace with actual API integration)
  const getAIResponse = async (userText: string, language: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Health-related responses based on user input
    const responses = {
      en: {
        greeting: "Hello! I'm your AI health assistant. How can I help you today?",
        symptoms: "I understand you're experiencing some symptoms. Can you tell me more about when they started and how severe they are?",
        pain: "I'm sorry to hear you're in pain. Can you describe the location and intensity of your pain on a scale of 1-10?",
        fever: "Fever can be concerning. Have you taken your temperature? Are you experiencing any other symptoms along with the fever?",
        default: "I understand your concern. Could you provide more details so I can better assist you with your health query?"
      },
      ur: {
        greeting: "السلام علیکم! میں آپ کا AI صحت مشیر ہوں۔ آج آپ کی کیا مدد کر سکتا ہوں؟",
        symptoms: "میں سمجھ گیا کہ آپ کو کچھ علامات ہو رہی ہیں۔ کیا آپ بتا سکتے ہیں کہ یہ کب شروع ہوئیں اور کتنی شدید ہیں؟",
        pain: "مجھے افسوس ہے کہ آپ کو درد ہو رہا ہے۔ کیا آپ درد کی جگہ اور شدت کو 1-10 کے پیمانے پر بیان کر سکتے ہیں؟",
        fever: "بخار تشویش کی بات ہو سکتی ہے۔ کیا آپ نے اپنا درجہ حرارت چیک کیا ہے؟ کیا بخار کے ساتھ کوئی اور علامات بھی ہیں؟",
        default: "میں آپ کی پریشانی سمجھ گیا ہوں۔ کیا آپ مزید تفصیلات دے سکتے ہیں تاکہ میں آپ کے صحت کے سوال میں بہتر مدد کر سکوں؟"
      }
    };

    const langResponses = responses[language as keyof typeof responses] || responses.en;
    const lowerText = userText.toLowerCase();

    if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('سلام')) {
      return langResponses.greeting;
    } else if (lowerText.includes('pain') || lowerText.includes('درد')) {
      return langResponses.pain;
    } else if (lowerText.includes('fever') || lowerText.includes('بخار')) {
      return langResponses.fever;
    } else if (lowerText.includes('symptom') || lowerText.includes('علامت')) {
      return langResponses.symptoms;
    } else {
      return langResponses.default;
    }
  };

  const speakText = async (text: string, language: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!synthesisRef.current) {
        reject(new Error("Speech synthesis not available"));
        return;
      }

      // Cancel any ongoing speech
      synthesisRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "ur" ? "ur-PK" : "en-US";
      utterance.rate = 0.9;
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
        setIsSpeaking(false);
        console.error("Speech synthesis error:", event.error);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      synthesisRef.current.speak(utterance);
    });
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    stopSpeaking();
    stopListening();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">
            {userLanguage === "ur" ? "آوازی گفتگو" : "Voice Conversation"}
          </h2>
          <p className="text-blue-100">
            {userLanguage === "ur"
              ? "AI کے ساتھ آواز میں بات کریں"
              : "Have a voice conversation with AI"}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Conversation Area */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <div className="text-4xl mb-4">🎤</div>
              <p>
                {userLanguage === "ur"
                  ? "گفتگو شروع کرنے کے لیے مائیک بٹن دبائیں"
                  : "Press the microphone button to start conversation"}
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
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.isUser
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 border"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}

          {/* Current Transcript Display */}
          {currentTranscript && (
            <div className="flex justify-end">
              <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg bg-blue-100 text-blue-800 border-2 border-blue-300">
                <p className="text-sm italic">{currentTranscript}</p>
                <p className="text-xs opacity-70">
                  {userLanguage === "ur" ? "سن رہا ہوں..." : "Listening..."}
                </p>
              </div>
            </div>
          )}

          {/* AI Processing Indicator */}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg bg-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  <p className="text-sm text-gray-600">
                    {userLanguage === "ur" ? "سوچ رہا ہوں..." : "Thinking..."}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Controls */}
        <div className="p-6 bg-white border-t">
          <div className="flex items-center justify-center space-x-4">
            {/* Microphone Button */}
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking || isProcessing}
              className={`relative p-4 rounded-full text-white font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                isListening
                  ? "bg-red-500 hover:bg-red-600 animate-pulse"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isListening ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              )}
            </button>

            {/* Stop Speaking Button */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-4 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all transform hover:scale-105"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </button>
            )}

            {/* Clear Conversation Button */}
            {messages.length > 0 && (
              <button
                onClick={clearConversation}
                className="p-4 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition-all transform hover:scale-105"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            )}
          </div>

          {/* Status Text */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {isListening
                ? userLanguage === "ur"
                  ? "🎤 سن رہا ہوں..."
                  : "🎤 Listening..."
                : isSpeaking
                ? userLanguage === "ur"
                  ? "🔊 بول رہا ہوں..."
                  : "🔊 Speaking..."
                : isProcessing
                ? userLanguage === "ur"
                  ? "⏳ پروسیسنگ..."
                  : "⏳ Processing..."
                : userLanguage === "ur"
                ? "مائیک بٹن دبا کر بات شروع کریں"
                : "Press microphone to start talking"}
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          {userLanguage === "ur" ? "استعمال کی ہدایات" : "How to Use"}
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            {userLanguage === "ur"
              ? "مائیک بٹن دبا کر بات کرنا شروع کریں"
              : "Press the microphone button to start speaking"}
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            {userLanguage === "ur"
              ? "AI خود بخود آپ کا جواب آواز میں دے گا"
              : "AI will automatically respond with voice"}
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            {userLanguage === "ur"
              ? "اگر AI بول رہا ہو تو رک جانے کے لیے Stop بٹن دبائیں"
              : "Press Stop button to interrupt AI speech if needed"}
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            {userLanguage === "ur"
              ? "Clear بٹن سے پوری گفتگو صاف کر سکتے ہیں"
              : "Use Clear button to reset the entire conversation"}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceConversation;