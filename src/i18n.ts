// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// ── EN imports ──
import enNavbar from "./locale/en/navbar.json";
import enVoiceConversation from "./locale/en/voiceConversation.json";

// ── UR imports ──
import urNavbar from "./locale/ur/navbar.json";
import urVoiceConversation from "./locale/ur/voiceConversation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        navbar: enNavbar,
        voiceConversation: enVoiceConversation,
      },
      ur: {
        navbar: urNavbar,
        voiceConversation: urVoiceConversation,
      },
    },
    lng: "en",              // default language
    fallbackLng: "en",      // fallback if key missing in ur
    interpolation: {
      escapeValue: false,   // React already handles XSS
    },
  });

export default i18n;