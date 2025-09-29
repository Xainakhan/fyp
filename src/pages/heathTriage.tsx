import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  User,
  AlertTriangle,
  Phone,
  Clock,
  CheckCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageSquare,
  Stethoscope,
  RotateCcw,
} from "lucide-react";



   
const mockSymptoms = [
  "fever","headache","cough","fatigue","nausea","chest_pain",
  "shortness_of_breath","abdominal_pain","diarrhea","vomiting",
  "muscle_aches","sore_throat","runny_nose","dizziness","joint_pain",
  "back_pain","skin_rash","itching"
];

const symptomSynonymsEN = {
  fever: ["high temperature","hot","burning up","feverish","temperature"],
  headache: ["head pain","migraine","head hurts","head ache"],
  cough: ["coughing","hack","throat clearing"],
  fatigue: ["tired","exhausted","weakness","lethargy","worn out"],
  nausea: ["sick feeling","queasy","feel sick","stomach upset"],
  chest_pain: ["chest hurts","chest discomfort","heart pain"],
  shortness_of_breath: ["breathing difficulty","cant breathe","breathless"],
  abdominal_pain: ["stomach pain","belly pain","tummy ache"],
  sore_throat: ["throat pain","throat hurts","scratchy throat"],
  dizziness: ["lightheaded","vertigo","spinning","unsteady"],
};

const symptomSynonymsUR = {
  fever: ["بخار","تیز بخار","حرارت","گرمی محسوس ہونا"],
  headache: ["سر درد","دردِ سر","مائگرین"],
  cough: ["کھانسی","کھانکھار","گلا صاف کرنا"],
  fatigue: ["کمزوری","تھکاوٹ","سستی","نڈھال"],
  nausea: ["متلی","جی متلانا","ابکائیاں","دل متلانا"],
  chest_pain: ["سینے میں درد","سینے میں کھچاؤ","دل کا درد"],
  shortness_of_breath: ["سانس میں دقت","سانس پھولنا","سانس نہیں آرہا"],
  abdominal_pain: ["پیٹ میں درد","پیٹ کا درد","پیٹ میں مروڑ","پیٹ کی تکلیف"],
  sore_throat: ["گلے میں درد","گلا خراب","خراش"],
  dizziness: ["چکر آنا","سر گھومنا","لڑکھڑانا"],
  diarrhea: ["اسہال","پتلا پاخانہ"],
  vomiting: ["قے","اُلٹی"],
  runny_nose: ["ناک بہنا","زکام"],
  skin_rash: ["جلدی خارش","دانے","راش"],
  back_pain: ["کمر درد"],
  joint_pain: ["جوڑوں کا درد"],
  itching: ["خارش","کھجلی"],
  muscle_aches: ["پٹھوں میں درد","بدن درد"],
};

const severityData = {
  fever:7, chest_pain:9, shortness_of_breath:8, headache:5,
  cough:4, fatigue:3, nausea:4, abdominal_pain:6, diarrhea:5,
  vomiting:6, dizziness:7, joint_pain:4, back_pain:5, skin_rash:3
};

const precautionData = {
  "Common Cold": [
    "Rest and stay hydrated",
    "Use saline nasal drops",
    "Avoid close contact with others",
  ],
  "Flu": [
    "Get plenty of rest and sleep",
    "Drink lots of fluids",
    "Stay home until fever-free for 24 hours",
  ],
  "Pneumonia": [
    "Seek immediate medical attention",
    "Take prescribed antibiotics if bacterial",
    "Rest and drink plenty of fluids",
  ],
};

/* =========================
   2) i18n (EN/UR)
   ========================= */
const i18n = {
  en: {
    appName: "RoboDoc",
    subtitle: "AI Medical Assistant",
    initial1: "Hello! I'm RoboDoc. I can help diagnose your symptoms using text or voice.",
    initial2: 'Type "start" or click voice mode and say "start" to begin!',
    btnText: "Text",
    btnVoice: "Voice",
    voiceReady: "Voice ready",
    voiceNotSupported: "Voice not supported in this browser",
    micDisabled: "Microphone Disabled",
    clickToSpeak: "Click to Speak",
    listening: "Listening...",
    speaking: "Speaking...",
    voiceErrorTitle: "Voice Error",
    tip1: "💡 Tip: Speak clearly and wait for the green \"Voice ready\" indicator",
    tip2ready: "✅ Voice system ready - Click microphone to start",
    enableMic: "Enable Microphone",
    tryAgain: "Try Again",
    dismiss: "Dismiss",
    debug: "Debug",
    you: "You",
    bot: "RoboDoc",
    startPlease: 'Please say "start" to begin.',
    askName: "What's your name?",
    askAge: name => `Hi ${name}! How old are you?`,
    ageNumber: "Please tell me your age as a number.",
    askGender: "What's your gender? Male or Female?",
    askMainSymptom: "Thank you! Now describe your main symptom. For example: headache, fever, cough.",
    didntUnderstandSymptom: "I didn't understand that symptom. Try: headache, fever, cough, fatigue, nausea.",
    addMoreSymptoms: s => `You have ${s.replace("_"," ")}. Any other symptoms?`,
    addedSymptom: s => `Added ${s.replace("_"," ")}. Any other symptoms?`,
    sayNoOrAdd: "Say 'no' if no more symptoms, or describe another symptom.",
    askDays: "How many days have you had these symptoms?",
    daysNumber: "Please tell me the number of days, like '3' or '5'.",
    analysisComplete: "Analysis Complete",
    condition: c => `Condition: ${c}`,
    severity: s => `Severity: ${s.toUpperCase()}`,
    recommendations: "Recommendations:",
    urgent: "URGENT: Please seek immediate medical attention!",
    moreCheck: name => `Would you like to check other symptoms, ${name}?`,
    thanksRestart: name => `Thank you, ${name}! Stay healthy! Say 'start' to begin again.`,
    emergency: "Emergency",
    langToggle: "Language",
    english: "English",
    urdu: "Urdu",
  },
  ur: {
    appName: "روبو ڈاک",
    subtitle: "AI میڈیکل اسسٹنٹ",
    initial1: "اسلام علیکم! میں RoboDoc ہوں۔ میں آپ کی علامات کی بنیاد پر مدد کر سکتا ہوں۔",
    initial2: 'شروع کرنے کے لیے "start" لکھیں یا وائس موڈ پر "start" کہیں۔',
    btnText: "ٹیکسٹ",
    btnVoice: "وائس",
    voiceReady: "وائس تیار ہے",
    voiceNotSupported: "اس براؤزر میں وائس سپورٹ نہیں ہے",
    micDisabled: "مائیکروفون بند ہے",
    clickToSpeak: "بولنے کے لیے کلک کریں",
    listening: "سن رہا ہوں...",
    speaking: "بول رہا ہوں...",
    voiceErrorTitle: "وائس ایرر",
    tip1: "💡 مشورہ: واضح بولیں اور سبز \"وائس تیار ہے\" اشارے کا انتظار کریں",
    tip2ready: "✅ وائس سسٹم تیار ہے - مائیک پر کلک کریں",
    enableMic: "مائیک آن کریں",
    tryAgain: "دوبارہ کوشش کریں",
    dismiss: "بند کریں",
    debug: "ڈی بگ",
    you: "آپ",
    bot: "روبو ڈاک",
    startPlease: 'براہِ کرم شروع کرنے کے لیے "start" کہیں۔',
    askName: "آپ کا نام کیا ہے؟",
    askAge: name => `خوش آمدید ${name}! آپ کی عمر کتنی ہے؟`,
    ageNumber: "براہِ مہربانی عمر ہندسوں میں بتائیں۔",
    askGender: "آپ کی جنس کیا ہے؟ مرد یا عورت؟",
    askMainSymptom: "شکریہ! اب اپنی بنیادی علامت بتائیں۔ مثال: سر درد، بخار، کھانسی۔",
    didntUnderstandSymptom: "میں سمجھ نہیں سکا۔ مثالیں: سر درد، بخار، کھانسی، تھکاوٹ، متلی۔",
    addMoreSymptoms: s => `آپ کو ${humanSymptomUrdu(s)} ہے۔ کوئی اور علامت؟`,
    addedSymptom: s => `${humanSymptomUrdu(s)} شامل کر دی۔ کوئی اور علامت؟`,
    sayNoOrAdd: "اگر مزید علامات نہیں تو 'نہیں' کہیں، یا دوسری علامت بتائیں۔",
    askDays: "یہ علامات کتنے دن سے ہیں؟",
    daysNumber: "براہِ مہربانی دن ہندسوں میں بتائیں، جیسے '3' یا '5'۔",
    analysisComplete: "تجزیہ مکمل",
    condition: c => `ممکنہ حالت: ${condUrdu(c)}`,
    severity: s => `شدت: ${sevUrdu(s)}`,
    recommendations: "ہدایات:",
    urgent: "ہنگامی صورتحال: براہِ کرم فوراً ڈاکٹر سے رجوع کریں!",
    moreCheck: name => `کیا آپ مزید علامات چیک کرنا چاہیں گے، ${name}؟`,
    thanksRestart: name => `شکریہ ${name}! صحت مند رہیں! دوبارہ شروع کرنے کیلئے 'start' کہیں۔`,
    emergency: "ایمرجنسی",
    langToggle: "زبان",
    english: "انگریزی",
    urdu: "اردو",
  },
};

// Urdu helpers for display
function humanSymptomUrdu(key) {
  const map = {
    fever:"بخار", headache:"سر درد", cough:"کھانسی", fatigue:"تھکاوٹ", nausea:"متلی",
    chest_pain:"سینے میں درد", shortness_of_breath:"سانس میں دقت", abdominal_pain:"پیٹ میں درد",
    diarrhea:"اسہال", vomiting:"قے", muscle_aches:"بدن درد", sore_throat:"گلے میں درد",
    runny_nose:"ناک بہنا", dizziness:"چکر آنا", joint_pain:"جوڑوں کا درد", back_pain:"کمر درد",
    skin_rash:"جلدی خارش", itching:"خارش",
  };
  return map[key] || key;
}
function condUrdu(c){
  const map = { "Common Cold":"نزلہ زکام", "Flu":"فلو", "Pneumonia":"نمونیا" };
  return map[c] || c;
}
function sevUrdu(s){
  const map = { low:"کم", moderate:"درمیانی", high:"زیادہ" };
  return map[s] || s;
}

/* =========================
   3) Bilingual processing
   ========================= */
const URDU_DIGITS = { "۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9" };
const normalizeUrduDigits = (s="") =>
  s.replace(/[۰-۹]/g, d => URDU_DIGITS[d] ?? d);

const YES_WORDS_EN = ["yes","yeah","yep","okay","ok","sure","absolutely","definitely"];
const NO_WORDS_EN  = ["no","nope","not really","none","nothing","never"];
const YES_WORDS_UR = ["ہاں","جی","جی ہاں","بالکل"];
const NO_WORDS_UR  = ["نہیں","جی نہیں","ہرگز نہیں","کوئی نہیں"];

const isUrduText = (txt="") => /[\u0600-\u06FF]/.test(txt);

/** returns {lang:'en'|'ur', token:'yes'|'no'|number|symptom|raw} */
const processInputBilingual = (input) => {
  const raw = input.trim();
  const lower = raw.toLowerCase();
  const ur = isUrduText(raw);

  // map Urdu digits to Latin first, then extract numbers
  const normalizedForNumber = normalizeUrduDigits(raw);
  const numberMatch = normalizedForNumber.match(/\d+/);

  // YES/NO
  if (!ur) {
    if (YES_WORDS_EN.some(w => lower.includes(w))) return { lang:"en", token:"yes" };
    if (NO_WORDS_EN.some(w => lower.includes(w)))  return { lang:"en", token:"no"  };
  } else {
    if (YES_WORDS_UR.some(w => raw.includes(w))) return { lang:"ur", token:"yes" };
    if (NO_WORDS_UR.some(w => raw.includes(w)))  return { lang:"ur", token:"no"  };
  }

  // number
  if (numberMatch) {
    return { lang: ur ? "ur" : "en", token: numberMatch[0] };
  }

  // symptoms
  const hitSym = (table) => {
    for (const [sym, syns] of Object.entries(table)) {
      const found = syns.some(s => (ur ? raw.includes(s) : lower.includes(s)));
      if (found) return sym;
      // also check "word match" for keys ("chest pain" vs "chest_pain")
      const keyPlain = sym.replace("_"," ");
      if (ur ? raw.includes(keyPlain) : lower.includes(keyPlain)) return sym;
    }
    return null;
  };
  if (!ur) {
    const s = hitSym(symptomSynonymsEN);
    if (s) return { lang:"en", token:s };
  } else {
    const s = hitSym(symptomSynonymsUR);
    if (s) return { lang:"ur", token:s };
  }

  return { lang: ur ? "ur" : "en", token: raw };
};

/* =========================
   4) Diagnosis logic (unchanged)
   ========================= */
const predictDisease = (symptoms) => {
  const set = new Set(symptoms);
  if (set.has("fever") && set.has("cough") && set.has("shortness_of_breath")) return "Pneumonia";
  if (set.has("fever") && set.has("cough") && set.has("muscle_aches")) return "Flu";
  if (set.has("runny_nose") && set.has("sore_throat") && set.has("cough")) return "Common Cold";
  return symptoms.length > 0 ? "Common Cold" : "Unable to determine";
};

const calculateSeverity = (symptoms, days) => {
  if (symptoms.length === 0) return "low";
  const total = symptoms.reduce((sum, s) => sum + (severityData[s] || 3), 0);
  const avg = total / symptoms.length;
  const score = avg * (days > 7 ? 1.5 : 1);
  if (score > 15) return "high";
  if (score > 8) return "moderate";
  return "low";
};

/* =========================
   5) Component
   ========================= */
const RoboDocVoiceChatbot = () => {
  // language state (default EN). Will auto-switch if Urdu text detected.
  const [lang, setLang] = useState("en");

  const t = (key, ...args) => {
    const dict = i18n[lang];
    const val = dict[key];
    return typeof val === "function" ? val(...args) : val;
  };

  const [messages, setMessages] = useState([
    { id:1, sender:"bot", text:i18n.en.initial1, timestamp:new Date() },
    { id:2, sender:"bot", text:i18n.en.initial2, timestamp:new Date() },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  // voice state (kept as in your original – primarily English)
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [micPermission, setMicPermission] = useState("prompt");
  const [voiceReady, setVoiceReady] = useState(false);
  const [browserSupport, setBrowserSupport] = useState({
    speechRecognition: false, speechSynthesis: false, mediaDevices: false
  });
  const [debugInfo, setDebugInfo] = useState("");

  const [step, setStep] = useState("initial");
  const [userData, setUserData] = useState({});
  const [symptoms, setSymptoms] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechTimeoutRef = useRef(null);
  const autoListenTimeoutRef = useRef(null);

  /* ===== Keep your original voice init/effects here =====
     I only trimmed for brevity. Paste your exact voice init,
     handlers, speak(), startListening/stopListening, etc.
     (No functional change needed for bilingual text mode.)
  ======================================================= */
  useEffect(() => {
    // ... (your original voice initialization code unchanged)
    // Set voiceReady / browserSupport accordingly
    // For brevity in this snippet, keep your existing code block here.
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // If transcript comes from voice, keep your handler (English). No change needed.

  const addMessage = async (sender, text) => {
    const newMessage = { id: Date.now()+Math.random(), sender, text, timestamp: new Date() };
    setMessages(prev => [...prev, newMessage]);
    // speaking behavior unchanged...
  };

  const simulateTyping = async (text, delay = 800) => {
    setIsTyping(true);
    await new Promise(r => setTimeout(r, delay));
    setIsTyping(false);
    await addMessage("bot", text);
  };

  const handleUserInput = async (message) => {
    // Auto-detect Urdu and switch UI language for THIS conversation turn (and subsequent)
    if (isUrduText(message) && lang !== "ur") {
      setLang("ur");
      // also swap initial messages if still at initial
      if (step === "initial" && messages.length <= 3) {
        setMessages([
          { id:1, sender:"bot", text:i18n.ur.initial1, timestamp:new Date() },
          { id:2, sender:"bot", text:i18n.ur.initial2, timestamp:new Date() },
        ]);
      }
    }

    addMessage("user", message);
    setInputValue("");
    clearTimeout(autoListenTimeoutRef.current);

    const { lang: detectedLang, token } = processInputBilingual(message);

    // If user switched language mid-flow, update UI lang
    if (detectedLang !== lang) setLang(detectedLang);

    switch (step) {
      case "initial": {
        if (token === "yes" || message.toLowerCase().includes("start") || isUrduText(message)) {
          setStep("name");
          await simulateTyping(i18n[detectedLang].askName);
        } else {
          await simulateTyping(i18n[detectedLang].startPlease);
        }
        break;
      }
      case "name": {
        const name = message.trim();
        setUserData(prev => ({ ...prev, name }));
        setStep("age");
        await simulateTyping(i18n[detectedLang].askAge(name));
        break;
      }
      case "age": {
        const num = parseInt(token, 10);
        if (num && num > 0 && num < 150) {
          setUserData(prev => ({ ...prev, age:num }));
          setStep("gender");
          await simulateTyping(i18n[detectedLang].askGender);
        } else {
          await simulateTyping(i18n[detectedLang].ageNumber);
        }
        break;
      }
      case "gender": {
        const lower = message.toLowerCase();
        const ur = isUrduText(message);
        const isFemale = ur ? /عورت|فی میل/.test(message) : lower.includes("female");
        const gender = isFemale ? "female" : "male";
        setUserData(prev => ({ ...prev, gender }));
        setStep("symptoms");
        await simulateTyping(i18n[detectedLang].askMainSymptom);
        break;
      }
      case "symptoms": {
        if (mockSymptoms.includes(token)) {
          setSymptoms([token]);
          setStep("moreSymptoms");
          await simulateTyping(i18n[detectedLang].addMoreSymptoms(token));
        } else {
          await simulateTyping(i18n[detectedLang].didntUnderstandSymptom);
        }
        break;
      }
      case "moreSymptoms": {
        if (token === "no") {
          setStep("duration");
          await simulateTyping(i18n[detectedLang].askDays);
        } else if (mockSymptoms.includes(token)) {
          setSymptoms(prev => [...prev, token]);
          await simulateTyping(i18n[detectedLang].addedSymptom(token));
        } else {
          await simulateTyping(i18n[detectedLang].sayNoOrAdd);
        }
        break;
      }
      case "duration": {
        const numDays = parseInt(token, 10);
        if (numDays && numDays > 0) {
          await provideDiagnosis(numDays, detectedLang);
        } else {
          await simulateTyping(i18n[detectedLang].daysNumber);
        }
        break;
      }
      case "completed": {
        if (token === "yes") {
          setStep("symptoms");
          setSymptoms([]);
          setDiagnosis(null);
          await simulateTyping(i18n[detectedLang].askMainSymptom);
        } else {
          await simulateTyping(i18n[detectedLang].thanksRestart(userData.name || ""));
          setStep("initial");
        }
        break;
      }
      default:
        await simulateTyping(i18n[detectedLang].startPlease);
    }
  };

  const provideDiagnosis = async (days, currentLang) => {
    const prediction = predictDisease(symptoms);
    const severity = calculateSeverity(symptoms, days);
    const precautions = precautionData[prediction] || [
      "Rest and stay hydrated",
      "Monitor symptoms",
      "Consult a healthcare provider",
    ];

    const newDiagnosis = { prediction, severity, precautions, days };
    setDiagnosis(newDiagnosis);
    setStep("completed");

    await simulateTyping(i18n[currentLang].analysisComplete);
    await simulateTyping(i18n[currentLang].condition(prediction));
    await simulateTyping(i18n[currentLang].severity(severity));

    await simulateTyping(i18n[currentLang].recommendations);
    for (let i = 0; i < precautions.length; i++) {
      // For Urdu, you could localize these lines later if you want
      await simulateTyping(`${i + 1}. ${precautions[i]}`, 650);
    }

    if (severity === "high") {
      await simulateTyping(i18n[currentLang].urgent, 1200);
    }
    await simulateTyping(i18n[currentLang].moreCheck(userData.name || ""));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    handleUserInput(inputValue.trim());
  };

  const resetChat = () => {
    const initialLang = lang;
    setMessages([
      { id:1, sender:"bot", text:i18n[initialLang].initial1, timestamp:new Date() },
      { id:2, sender:"bot", text:i18n[initialLang].initial2, timestamp:new Date() },
    ]);
    setStep("initial");
    setUserData({});
    setSymptoms([]);
    setDiagnosis(null);
    setInputValue("");
    setTranscript("");
    setVoiceError("");
    setDebugInfo("");
    // stopListening / cancel speech if you keep voice code
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", { hour12:true, hour:"numeric", minute:"2-digit" });

  const dir = lang === "ur" ? "rtl" : "ltr";
  const align = lang === "ur" ? "text-right" : "text-left";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col" dir={dir}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div className={`${align}`}>
                <h1 className="text-2xl font-bold text-gray-900">{t("appName")}</h1>
                <p className="text-sm text-gray-600">{t("subtitle")}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Language Toggle */}
              <div className="flex items-center bg-gray-100 rounded-full p-1">
                <span className="px-3 text-xs text-gray-600">{t("langToggle")}:</span>
                <button
                  onClick={()=>setLang("en")}
                  className={`px-3 py-1 rounded-full text-sm ${lang==="en"?"bg-white shadow-sm text-blue-600":"text-gray-600"}`}
                >
                  {t("english")}
                </button>
                <button
                  onClick={()=>setLang("ur")}
                  className={`px-3 py-1 rounded-full text-sm ${lang==="ur"?"bg-white shadow-sm text-blue-600":"text-gray-600"}`}
                >
                  {t("urdu")}
                </button>
              </div>

              {/* Text/Voice mode toggle (kept) */}
              <div className="flex items-center bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setIsVoiceMode(false)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !isVoiceMode ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t("btnText")}</span>
                </button>
                <button
                  onClick={() => setIsVoiceMode(true)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isVoiceMode ? "bg-white text-green-600 shadow-sm" : "text-gray-600"
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>{t("btnVoice")}</span>
                </button>
              </div>

              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 rounded-full transition-colors ${
                  voiceEnabled ? "bg-green-100 text-green-600 hover:bg-green-200"
                                : "bg-red-100 text-red-600 hover:bg-red-200"
                }`}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button onClick={resetChat} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Voice status bar (texts localized) */}
      {isVoiceMode && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {isListening && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">{t("listening")}</span>
                  </div>
                )}
                {isSpeaking && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">{t("speaking")}</span>
                  </div>
                )}
                {!isListening && !isSpeaking && !voiceError && micPermission === "granted" && (
                  <span className="text-green-600 font-medium">{t("voiceReady")}</span>
                )}
                {voiceError && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">{t("voiceErrorTitle")}: {voiceError}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {debugInfo && (
                  <button onClick={() => setDebugInfo("")} className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300" title={debugInfo}>
                    {t("debug")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender==="user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-2xl ${m.sender==="user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`${m.sender==="user" ? "ml-3" : "mr-3"}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    m.sender==="user" ? "bg-blue-500 text-white" : "bg-gradient-to-br from-green-400 to-blue-500 text-white"
                  }`}>
                    {m.sender==="user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                </div>

                <div className={`rounded-2xl px-4 py-3 shadow-sm max-w-md ${
                  m.sender==="user" ? "bg-blue-500 text-white" : "bg-white text-gray-800 border border-gray-100"
                } ${lang==="ur" ? "text-right" : "text-left"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${m.sender==="user" ? "text-blue-100" : "text-gray-500"}`}>
                      {m.sender==="user" ? t("you") : t("bot")}
                    </span>
                    <span className={`text-xs ${m.sender==="user" ? "text-blue-100" : "text-gray-400"}`}>
                      {formatTime(m.timestamp)}
                    </span>
                  </div>
                  <div className="whitespace-pre-line leading-relaxed">
                    {m.text}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 text-white flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay:"0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay:"0.2s" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          {!isVoiceMode ? (
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={lang==="ur" ? "یہاں اپنا پیغام لکھیں..." : "Type your message here..."}
                className={`flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 ${lang==="ur"?"text-right":"text-left"}`}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 transition-all font-medium shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          ) : (
            /* Your existing voice button block; only replace static strings via t() if you like */
            <div className={`text-sm ${align}`}>{t("voiceNotSupported")} (voice kept as-is)</div>
          )}
        </div>
      </div>

      {/* Diagnosis Footer */}
      {diagnosis && (
        <div className="bg-white border-t border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-gray-900">
                    {lang==="ur" ? condUrdu(diagnosis.prediction) : diagnosis.prediction}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className={`w-5 h-5 ${
                    diagnosis.severity==="high" ? "text-red-500" :
                    diagnosis.severity==="moderate" ? "text-yellow-500" : "text-green-500"
                  }`} />
                  <span className="text-gray-700 capitalize">
                    {lang==="ur" ? sevUrdu(diagnosis.severity) : `${diagnosis.severity} severity`}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">
                    {lang==="ur"
                      ? `${diagnosis.days} دن`
                      : `${diagnosis.days} day${diagnosis.days!==1?'s':''}`
                    }
                  </span>
                </div>
              </div>
              {diagnosis.severity === "high" && (
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                    <Phone className="w-4 h-4" />
                    <span>{t("emergency")}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoboDocVoiceChatbot;
