import { MdMic } from "react-icons/md";
import { GiBrain } from "react-icons/gi";
import { MdHealthAndSafety } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";

export interface Module {
  id: string;
  name: string;
  nameUrdu: string;
}

export interface Feature {
  title: string;
  titleUrdu: string;
  desc: string;
  descUrdu: string;
  icon: string;
  module: string;
}

export interface Statistic {
  value: string;
  label: string;
  labelUrdu: string;
  color: string;
}

export interface EmergencyContact {
  icon: string;
  label: string;
  labelUrdu: string;
  number: string;
}

// App modules configuration
export const APP_MODULES: Module[] = [
  { id: "home", name: "Home", nameUrdu: "ہوم" },
  { id: "tts", name: "Voice Conversation", nameUrdu: "آواز سے ان پٹ" },
  { id: "interview", name: "Health Interview", nameUrdu: "صحت کا انٹرویو" },
{ id: "symptom", name: "Symptom Checker", nameUrdu: "علامات کی جانچ" },

  { id: "triage", name: "Health Triage", nameUrdu: "صحت کی جانچ" },
  { id: "doctor", name: "Find Doctor", nameUrdu: "ڈاکٹر تلاش کریں" },
   { id: "timeline", name: "Health Timeline", nameUrdu: "ڈاکٹر تلاش کریں" },
];

// Features data for home page
export const APP_FEATURES = [
  {
    icon: <MdMic className="text-blue-600" />,
    title: "Voice Conversation",
    titleUrdu: "آواز پر مبنی مکالمہ",
    desc: "Natural voice interaction",
    descUrdu: "قدرتی آواز میں گفتگو",
    module: "tts",
  },
  {
    icon: <GiBrain className="text-pink-500" />,
    title: "Smart Interview",
    titleUrdu: "اسمارٹ انٹرویو",
    desc: "AI powered health assessment",
    descUrdu: "اے آئی پر مبنی ہیلتھ اسیسمنٹ",
    module: "interview",
  },
  {
    icon: <MdHealthAndSafety className="text-purple-500" />,
    title: "Smart Triage",
    titleUrdu: "اسمارٹ ٹریائج",
    desc: "Instant condition assessment",
    descUrdu: "فوری حالت کا جائزہ",
    module: "triage",
  },
  {
    icon: <FaUserDoctor className="text-amber-500" />,
    title: "Specialist Routing",
    titleUrdu: "اسپیشلسٹ رہنمائی",
    desc: "Right doctor guidance",
    descUrdu: "درست ڈاکٹر تک رہنمائی",
    module: "specialist",
  },
];

// App statistics
export const APP_STATISTICS: Statistic[] = [
  {
    value: "10+",
    label: "Medical Conditions",
    labelUrdu: "طبی حالات",
    color: "text-blue-600",
  },
  {
    value: "50+",
    label: "Symptoms Detected",
    labelUrdu: "علامات کی شناخت",
    color: "text-green-600",
  },
  {
    value: "2",
    label: "Languages Supported",
    labelUrdu: "زبانوں میں",
    color: "text-purple-600",
  },
  {
    value: "AI",
    label: "Powered Analysis",
    labelUrdu: "طاقتور تجزیہ",
    color: "text-orange-600",
  },
];

// Emergency contacts
export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    icon: "🚨",
    label: "Emergency:",
    labelUrdu: "ایمرجنسی:",
    number: "1122",
  },
  {
    icon: "🏥",
    label: "Helpline:",
    labelUrdu: "ہیلپ لائن:",
    number: "1166",
  },
  {
    icon: "📞",
    label: "Police:",
    labelUrdu: "پولیس:",
    number: "15",
  },
];

// App text content
export const APP_TEXT = {
  appName: {
    en: "SehatHub",
    ur: "صحت ہب",
  },
  tagline: {
    en: "Voice-First Bilingual Health Triage & Specialty Routing",
    ur: "آوازی ذریعے دو لسانی صحت کی رہنمائی اور ڈاکٹر کی تلاش",
  },
  buttons: {
    startInterview: {
      en: "Start Health Interview",
      ur: "صحت کا انٹرویو شروع کریں",
    },
    testVoice: {
      en: "Test Voice Features",
      ur: "آواز کا ٹیسٹ",
    },
    emergency: {
      en: "Emergency",
      ur: "ایمرجنسی",
    },
  },
  disclaimer: {
    title: {
      en: "Important Notice",
      ur: "اہم نوٹ",
    },
    content: {
      en: "This is not a diagnostic tool. Always consult with healthcare professionals. This system is for informational purposes only and should not replace professional medical advice.",
      ur: "یہ تشخیصی ٹول نہیں ہے۔ ہمیشہ ڈاکٹر سے مشورہ کریں۔ یہ صرف معلوماتی مقاصد کے لیے ہے اور پیشہ ورانہ طبی مشورے کا متبادل نہیں۔",
    },
  },
  footer: {
    about: {
      title: {
        en: "About SehatHub",
        ur: "صحت ہب کے بارے میں",
      },
      content: {
        en: "Pakistan's first AI-powered bilingual health platform. Providing intelligent symptom analysis and medical guidance.",
        ur: "پاکستان کا پہلا AI سے چلنے والا دو لسانی صحت کا پلیٹ فارم۔ ذہین علامات کا تجزیہ اور طبی رہنمائی فراہم کرتا ہے۔",
      },
    },
    quickLinks: {
      en: "Quick Links",
      ur: "فوری لنکس",
    },
    emergencyContacts: {
      en: "Emergency Contacts",
      ur: "ایمرجنسی رابطے",
    },
    copyright: {
      en: "© 2024 SehatHub - FYP Project by Zainab Batool | Supervised by: Mam Mehwish",
      ur: "© 2024 صحت ہب - زینب بتول کی جانب سے تیار کردہ FYP | نگرانی: میم محویش",
    },
    educationalNote: {
      en: "Developed for educational purposes and not a substitute for professional medical advice",
      ur: "یہ تعلیمی مقاصد کے لیے تیار کیا گیا ہے اور پیشہ ورانہ طبی مشورے کا متبادل نہیں",
    },
  },
  moduleHelperText: {
    en: "Click on any feature above for comprehensive health assessment",
    ur: "مکمل صحت کے جائزے کے لیے اوپر کسی بھی فیچر پر کلک کریں",
  },
  placeholders: {
    voiceModule: {
      title: "Voice Recognition Module",
      content: "Voice input module will be implemented here",
    },
    triageModule: {
      title: "Health Triage Module",
      content: "Intelligent triage system will be implemented here",
    },
    specialtyModule: {
      title: "Specialty Routing Module",
      content: "Doctor finding and specialty routing will be implemented here",
    },
  },
};
