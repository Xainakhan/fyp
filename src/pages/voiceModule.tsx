import React, { useState, useRef, useEffect } from 'react';

interface SymptomCheckerProps {
  userLanguage?: string;
}

interface Symptom {
  id: string;
  name: string;
  nameUrdu: string;
  category: string;
  severity: 'mild' | 'moderate' | 'severe';
  commonConditions: string[];
}

interface AssessmentResult {
  urgency: 'low' | 'moderate' | 'high' | 'emergency';
  possibleConditions: string[];
  recommendations: string[];
  disclaimer: string;
}

const SymptomChecker: React.FC<SymptomCheckerProps> = ({ userLanguage = "en" }) => {
  const [activeTab, setActiveTab] = useState<"checker" | "voice" | "history">("checker");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<"symptoms" | "details" | "results">("symptoms");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState({
    age: "",
    duration: "",
    severity: "mild" as "mild" | "moderate" | "severe"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Common symptoms database
  const symptomsDatabase: Symptom[] = [
    { id: "fever", name: "Fever", nameUrdu: "بخار", category: "general", severity: "moderate", commonConditions: ["Flu", "COVID-19", "Infection"] },
    { id: "headache", name: "Headache", nameUrdu: "سر درد", category: "neurological", severity: "mild", commonConditions: ["Tension headache", "Migraine", "Dehydration"] },
    { id: "cough", name: "Cough", nameUrdu: "کھانسی", category: "respiratory", severity: "mild", commonConditions: ["Common cold", "Bronchitis", "COVID-19"] },
    { id: "sore_throat", name: "Sore Throat", nameUrdu: "گلے میں درد", category: "respiratory", severity: "mild", commonConditions: ["Strep throat", "Common cold", "Allergies"] },
    { id: "chest_pain", name: "Chest Pain", nameUrdu: "سینے میں درد", category: "cardiovascular", severity: "severe", commonConditions: ["Heart attack", "Angina", "Muscle strain"] },
    { id: "shortness_breath", name: "Shortness of Breath", nameUrdu: "سانس کی تکلیف", category: "respiratory", severity: "severe", commonConditions: ["Asthma", "COVID-19", "Heart disease"] },
    { id: "nausea", name: "Nausea", nameUrdu: "متلی", category: "digestive", severity: "mild", commonConditions: ["Food poisoning", "Pregnancy", "Migraine"] },
    { id: "dizziness", name: "Dizziness", nameUrdu: "چکر آنا", category: "neurological", severity: "moderate", commonConditions: ["Low blood pressure", "Dehydration", "Inner ear problem"] },
    { id: "fatigue", name: "Fatigue", nameUrdu: "تھکان", category: "general", severity: "mild", commonConditions: ["Anemia", "Depression", "Sleep disorders"] },
    { id: "abdominal_pain", name: "Abdominal Pain", nameUrdu: "پیٹ میں درد", category: "digestive", severity: "moderate", commonConditions: ["Gastritis", "Appendicitis", "Food poisoning"] }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      
      // Initialize speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = userLanguage === 'ur' ? 'ur-PK' : 'en-US';
        
        recognitionRef.current.onresult = (event: any) => {
          const speechResult = event.results[0][0].transcript;
          setTranscript(prev => prev + " " + speechResult);
          processVoiceSymptoms(speechResult);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, [userLanguage]);

  const speak = (text: string) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = userLanguage === 'ur' ? 'ur-PK' : 'en-US';
      utterance.rate = 0.8;
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const processVoiceSymptoms = (voiceInput: string) => {
    const input = voiceInput.toLowerCase();
    const detectedSymptoms: string[] = [];
    
    symptomsDatabase.forEach(symptom => {
      const englishMatch = input.includes(symptom.name.toLowerCase());
      const urduMatch = input.includes(symptom.nameUrdu);
      
      if (englishMatch || urduMatch) {
        detectedSymptoms.push(symptom.id);
      }
    });
    
    if (detectedSymptoms.length > 0) {
      setSelectedSymptoms(prev => [...new Set([...prev, ...detectedSymptoms])]);
      const confirmMessage = userLanguage === 'ur' 
        ? `میں نے یہ علامات سنیں: ${detectedSymptoms.map(id => symptomsDatabase.find(s => s.id === id)?.nameUrdu).join(', ')}`
        : `I detected these symptoms: ${detectedSymptoms.map(id => symptomsDatabase.find(s => s.id === id)?.name).join(', ')}`;
      speak(confirmMessage);
    }
  };

  const filteredSymptoms = symptomsDatabase.filter(symptom =>
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    symptom.nameUrdu.includes(searchTerm)
  );

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const assessSymptoms = () => {
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const severityScore = selectedSymptoms.reduce((score, symptomId) => {
        const symptom = symptomsDatabase.find(s => s.id === symptomId);
        return score + (symptom?.severity === 'severe' ? 3 : symptom?.severity === 'moderate' ? 2 : 1);
      }, 0);

      let urgency: AssessmentResult['urgency'] = 'low';
      if (severityScore >= 8 || selectedSymptoms.some(id => 
        symptomsDatabase.find(s => s.id === id)?.severity === 'severe'
      )) {
        urgency = 'emergency';
      } else if (severityScore >= 5) {
        urgency = 'high';
      } else if (severityScore >= 3) {
        urgency = 'moderate';
      }

      const possibleConditions = Array.from(new Set(
        selectedSymptoms.flatMap(symptomId => 
          symptomsDatabase.find(s => s.id === symptomId)?.commonConditions || []
        )
      ));

      const recommendations = getRecommendations(urgency, userLanguage);
      
      const result: AssessmentResult = {
        urgency,
        possibleConditions,
        recommendations,
        disclaimer: userLanguage === 'ur' 
          ? "یہ صرف ابتدائی جانچ ہے۔ کسی بھی طبی فیصلے کے لیے ڈاکٹر سے رابطہ کریں۔"
          : "This is a preliminary assessment only. Consult a healthcare professional for medical decisions."
      };

      setAssessmentResult(result);
      setCurrentStep("results");
      setIsProcessing(false);

      // Speak the result
      const resultMessage = userLanguage === 'ur'
        ? `آپ کی علامات کی بنیاد پر، یہ ${urgency === 'emergency' ? 'فوری طبی امداد' : urgency === 'high' ? 'اعلیٰ ترجیح' : 'کم ترجیح'} کا معاملہ لگتا ہے۔`
        : `Based on your symptoms, this appears to be a ${urgency} priority case.`;
      speak(resultMessage);
    }, 2000);
  };

  const getRecommendations = (urgency: AssessmentResult['urgency'], lang: string): string[] => {
    const recommendations = {
      emergency: {
        en: ["Seek immediate emergency care", "Call emergency services", "Do not delay treatment"],
        ur: ["فوری طبی امداد حاصل کریں", "ایمرجنسی سروسز کو کال کریں", "علاج میں تاخیر نہ کریں"]
      },
      high: {
        en: ["Consult a doctor within 24 hours", "Monitor symptoms closely", "Avoid strenuous activities"],
        ur: ["24 گھنٹے میں ڈاکٹر سے ملیں", "علامات پر نظر رکھیں", "سخت محنت سے بچیں"]
      },
      moderate: {
        en: ["Schedule a doctor appointment", "Rest and stay hydrated", "Monitor for worsening"],
        ur: ["ڈاکٹر سے وقت لیں", "آرام کریں اور پانی پیئیں", "بگڑنے کی صورت میں نظر رکھیں"]
      },
      low: {
        en: ["Home care may be sufficient", "Rest and monitor symptoms", "Consult if symptoms persist"],
        ur: ["گھریلو علاج کافی ہو سکتا ہے", "آرام کریں اور علامات دیکھیں", "برقرار رہنے پر ڈاکٹر سے ملیں"]
      }
    };
    return recommendations[urgency][lang];
  };

  const resetChecker = () => {
    setSelectedSymptoms([]);
    setCurrentStep("symptoms");
    setAssessmentResult(null);
    setAdditionalInfo({ age: "", duration: "", severity: "mild" });
    setTranscript("");
  };

  const tabs = [
    {
      id: "checker" as const,
      name: userLanguage === "ur" ? "علامات چیکر" : "Symptom Checker",
      icon: "🩺"
    },
    {
      id: "voice" as const,
      name: userLanguage === "ur" ? "آوازی چیکر" : "Voice Checker",
      icon: "🎤"
    },
    {
      id: "history" as const,
      name: userLanguage === "ur" ? "تاریخ" : "History",
      icon: "📋"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {userLanguage === "ur" ? "سہت علامات چیکر" : "Sehat Symptom Checker"}
        </h1>
        <p className="text-gray-600 text-lg">
          {userLanguage === "ur" 
            ? "اپنی علامات بتائیں اور ابتدائی تشخیص حاصل کریں"
            : "Describe your symptoms and get preliminary health assessment"}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-4xl mx-auto mb-8 px-6">
        <div className="flex bg-white rounded-xl shadow-lg p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6">
        {activeTab === "checker" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            {currentStep === "symptoms" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  {userLanguage === "ur" ? "اپنی علامات منتخب کریں" : "Select Your Symptoms"}
                </h2>
                
                {/* Search Bar */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder={userLanguage === "ur" ? "علامات تلاش کریں..." : "Search symptoms..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>

                {/* Symptoms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {filteredSymptoms.map((symptom) => (
                    <button
                      key={symptom.id}
                      onClick={() => toggleSymptom(symptom.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        selectedSymptoms.includes(symptom.id)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className="font-semibold">
                        {userLanguage === "ur" ? symptom.nameUrdu : symptom.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {symptom.category} • {symptom.severity}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Selected Symptoms */}
                {selectedSymptoms.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">
                      {userLanguage === "ur" ? "منتخب شدہ علامات:" : "Selected Symptoms:"}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map(symptomId => {
                        const symptom = symptomsDatabase.find(s => s.id === symptomId);
                        return (
                          <span
                            key={symptomId}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                          >
                            {userLanguage === "ur" ? symptom?.nameUrdu : symptom?.name}
                            <button
                              onClick={() => toggleSymptom(symptomId)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Next Button */}
                {selectedSymptoms.length > 0 && (
                  <div className="text-center">
                    <button
                      onClick={() => setCurrentStep("details")}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      {userLanguage === "ur" ? "اگلا قدم" : "Next Step"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {currentStep === "details" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  {userLanguage === "ur" ? "اضافی تفصیلات" : "Additional Details"}
                </h2>
                
                <div className="max-w-md mx-auto space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {userLanguage === "ur" ? "عمر" : "Age"}
                    </label>
                    <input
                      type="number"
                      value={additionalInfo.age}
                      onChange={(e) => setAdditionalInfo(prev => ({ ...prev, age: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder={userLanguage === "ur" ? "آپ کی عمر" : "Your age"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {userLanguage === "ur" ? "علامات کتنے دن سے؟" : "How long have you had these symptoms?"}
                    </label>
                    <select
                      value={additionalInfo.duration}
                      onChange={(e) => setAdditionalInfo(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">{userLanguage === "ur" ? "منتخب کریں" : "Select duration"}</option>
                      <option value="hours">{userLanguage === "ur" ? "چند گھنٹے" : "Few hours"}</option>
                      <option value="1-2days">{userLanguage === "ur" ? "1-2 دن" : "1-2 days"}</option>
                      <option value="3-7days">{userLanguage === "ur" ? "3-7 دن" : "3-7 days"}</option>
                      <option value="1-2weeks">{userLanguage === "ur" ? "1-2 ہفتے" : "1-2 weeks"}</option>
                      <option value="longer">{userLanguage === "ur" ? "زیادہ دیر سے" : "Longer than 2 weeks"}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {userLanguage === "ur" ? "علامات کی شدت" : "Symptom Severity"}
                    </label>
                    <div className="flex gap-2">
                      {["mild", "moderate", "severe"].map(level => (
                        <button
                          key={level}
                          onClick={() => setAdditionalInfo(prev => ({ ...prev, severity: level as any }))}
                          className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                            additionalInfo.severity === level
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {userLanguage === "ur" 
                            ? { mild: "ہلکی", moderate: "درمیانی", severe: "شدید" }[level]
                            : level.charAt(0).toUpperCase() + level.slice(1)
                          }
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setCurrentStep("symptoms")}
                      className="flex-1 py-3 px-6 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {userLanguage === "ur" ? "واپس" : "Back"}
                    </button>
                    <button
                      onClick={assessSymptoms}
                      disabled={isProcessing}
                      className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    >
                      {isProcessing 
                        ? (userLanguage === "ur" ? "جانچ رہے ہیں..." : "Analyzing...")
                        : (userLanguage === "ur" ? "نتیجہ دیکھیں" : "Get Assessment")
                      }
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "results" && assessmentResult && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  {userLanguage === "ur" ? "تشخیصی نتیجہ" : "Assessment Results"}
                </h2>

                {/* Urgency Level */}
                <div className={`p-6 rounded-lg mb-6 text-center ${
                  assessmentResult.urgency === 'emergency' ? 'bg-red-100 border-2 border-red-500' :
                  assessmentResult.urgency === 'high' ? 'bg-orange-100 border-2 border-orange-500' :
                  assessmentResult.urgency === 'moderate' ? 'bg-yellow-100 border-2 border-yellow-500' :
                  'bg-green-100 border-2 border-green-500'
                }`}>
                  <div className={`text-3xl mb-2 ${
                    assessmentResult.urgency === 'emergency' ? 'text-red-600' :
                    assessmentResult.urgency === 'high' ? 'text-orange-600' :
                    assessmentResult.urgency === 'moderate' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {assessmentResult.urgency === 'emergency' ? '🚨' :
                     assessmentResult.urgency === 'high' ? '⚠️' :
                     assessmentResult.urgency === 'moderate' ? '⚡' : '✅'}
                  </div>
                  <h3 className={`text-xl font-bold ${
                    assessmentResult.urgency === 'emergency' ? 'text-red-800' :
                    assessmentResult.urgency === 'high' ? 'text-orange-800' :
                    assessmentResult.urgency === 'moderate' ? 'text-yellow-800' :
                    'text-green-800'
                  }`}>
                    {userLanguage === "ur" 
                      ? {
                          emergency: "فوری طبی امداد درکار",
                          high: "اعلیٰ ترجیح",
                          moderate: "درمیانی ترجیح",
                          low: "کم ترجیح"
                        }[assessmentResult.urgency]
                      : {
                          emergency: "Emergency Care Required",
                          high: "High Priority",
                          moderate: "Moderate Priority", 
                          low: "Low Priority"
                        }[assessmentResult.urgency]
                    }
                  </h3>
                </div>

                {/* Possible Conditions */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    {userLanguage === "ur" ? "ممکنہ حالات:" : "Possible Conditions:"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {assessmentResult.possibleConditions.map((condition, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    {userLanguage === "ur" ? "تجاویز:" : "Recommendations:"}
                  </h3>
                  <ul className="space-y-2">
                    {assessmentResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Disclaimer */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-600">
                    <strong>{userLanguage === "ur" ? "اہم:" : "Important:"}</strong> {assessmentResult.disclaimer}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={resetChecker}
                    className="flex-1 py-3 px-6 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {userLanguage === "ur" ? "نئی جانچ" : "New Check"}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    {userLanguage === "ur" ? "پرنٹ کریں" : "Print Results"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "voice" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {userLanguage === "ur" ? "آوازی علامات چیکر" : "Voice Symptom Checker"}
            </h2>
            
            <div className="text-center mb-8">
              <p className="text-gray-600 mb-4">
                {userLanguage === "ur" 
                  ? "اپنی علامات بولیں، ہم سن رہے ہیں..."
                  : "Speak your symptoms, we're listening..."}
              </p>
              
              <button
                onClick={isListening ? stopListening : startListening}
                className={`w-24 h-24 rounded-full text-white text-3xl font-bold shadow-lg transition-all duration-200 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isListening ? '⏹️' : '🎤'}
              </button>
              
              <p className="mt-4 text-sm text-gray-500">
                {isListening 
                  ? (userLanguage === "ur" ? "سن رہے ہیں... بولیں" : "Listening... Please speak")
                  : (userLanguage === "ur" ? "مائیک دبا کر بولیں" : "Press mic to speak")
                }
              </p>
            </div>

            {transcript && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">
                  {userLanguage === "ur" ? "آپ نے کہا:" : "You said:"}
                </h3>
                <p className="text-gray-700">{transcript}</p>
              </div>
            )}

            {selectedSymptoms.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  {userLanguage === "ur" ? "پکڑی گئی علامات:" : "Detected Symptoms:"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map(symptomId => {
                    const symptom = symptomsDatabase.find(s => s.id === symptomId);
                    return (
                      <span
                        key={symptomId}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {userLanguage === "ur" ? symptom?.nameUrdu : symptom?.name}
                        <button
                          onClick={() => toggleSymptom(symptomId)}
                          className="text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
                
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setCurrentStep("details")}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    {userLanguage === "ur" ? "جانچ جاری رکھیں" : "Continue Assessment"}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-800">
                {userLanguage === "ur" ? "آوازی کمانڈز:" : "Voice Commands:"}
              </h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• {userLanguage === "ur" ? "\"میرے سر میں درد ہے\"" : "\"I have a headache\""}</p>
                <p>• {userLanguage === "ur" ? "\"مجھے بخار ہے\"" : "\"I have fever\""}</p>
                <p>• {userLanguage === "ur" ? "\"میں کھانس رہا ہوں\"" : "\"I am coughing\""}</p>
                <p>• {userLanguage === "ur" ? "\"سانس لینے میں تکلیف\"" : "\"Difficulty breathing\""}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {userLanguage === "ur" ? "صحت کی تاریخ" : "Health History"}
            </h2>
            
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {userLanguage === "ur" ? "ابھی کوئی تاریخ نہیں" : "No History Yet"}
              </h3>
              <p className="text-gray-500">
                {userLanguage === "ur" 
                  ? "آپ کی پہلی جانچ کے بعد یہاں نتائج نظر آئیں گے"
                  : "Your assessment results will appear here after your first check"}
              </p>
              
              <button
                onClick={() => setActiveTab("checker")}
                className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {userLanguage === "ur" ? "پہلی جانچ شروع کریں" : "Start First Assessment"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Contact Banner */}
      <div className="max-w-4xl mx-auto mt-8 px-6">
        <div className="bg-red-500 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">
                {userLanguage === "ur" ? "ہنگامی حالت؟" : "Emergency?"}
              </h3>
              <p className="text-red-100">
                {userLanguage === "ur" 
                  ? "اگر یہ ہنگامی حالت ہے تو فوری طور پر 1122 یا 115 پر کال کریں"
                  : "If this is an emergency, call 1122 or 115 immediately"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl mb-2">🚨</div>
              <a 
                href="tel:1122"
                className="bg-white text-red-500 px-4 py-2 rounded-lg font-bold hover:bg-red-50 transition-colors"
              >
                {userLanguage === "ur" ? "فوری کال" : "Emergency Call"}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div className="max-w-4xl mx-auto mt-8 px-6">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>💡</span>
            {userLanguage === "ur" ? "صحت کے فوری ٹپس" : "Quick Health Tips"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-300">💧</span>
              <span>
                {userLanguage === "ur" 
                  ? "دن میں 8-10 گلاس پانی پیئیں"
                  : "Drink 8-10 glasses of water daily"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-300">🏃</span>
              <span>
                {userLanguage === "ur" 
                  ? "روزانہ 30 منٹ ورزش کریں"
                  : "Exercise for 30 minutes daily"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-300">😴</span>
              <span>
                {userLanguage === "ur" 
                  ? "7-8 گھنٹے کی نیند ضروری"
                  : "Get 7-8 hours of sleep"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-300">🥗</span>
              <span>
                {userLanguage === "ur" 
                  ? "متوازن غذا کھائیں"
                  : "Eat a balanced diet"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-4xl mx-auto mt-8 px-6">
        <div className="bg-gray-100 rounded-lg p-4 text-center text-sm text-gray-600">
          <p className="font-semibold mb-2">
            {userLanguage === "ur" ? "⚠️ اہم اطلاع" : "⚠️ Important Notice"}
          </p>
          <p>
            {userLanguage === "ur" 
              ? "یہ ٹول صرف تعلیمی مقاصد کے لیے ہے اور کسی بھی طرح پیشہ ور طبی مشورے کا متبادل نہیں۔ کسی بھی صحت کے مسئلے کے لیے اپنے ڈاکٹر سے رابطہ کریں۔"
              : "This tool is for educational purposes only and is not a substitute for professional medical advice. Please consult your doctor for any health concerns."}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-gray-400 text-sm">
        <p>
          {userLanguage === "ur" 
            ? "سہت ہب © 2025 - آپ کی صحت، ہماری ترجیح"
            : "Sehat Hub © 2025 - Your Health, Our Priority"}
        </p>
      </div>
    </div>
  );
};

export default SymptomChecker;

      