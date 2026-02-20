import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enNavbar from "./locale/en/navbar.json";
import enFooter from "./locale/en/footer.json";
import enVoiceConversation from "./locale/en/voiceConversation.json";
import enDoctors from "./locale/en/doctors.json";
import enHealthInterview from "./locale/en/healthInterview.json";
import enHealthTimeline from "./locale/en/healthTimeline.json";

import urNavbar from "./locale/ur/navbar.json";
import urFooter from "./locale/ur/footer.json";
import urVoiceConversation from "./locale/ur/voiceConversation.json";
import urDoctors from "./locale/ur/doctors.json";
import urHealthInterview from "./locale/ur/healthInterview.json";
import urHealthTimeline from "./locale/ur/healthTimeline.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        navbar: enNavbar,
        footer: enFooter,
        voiceConversation: enVoiceConversation,
        doctors: enDoctors,
        healthInterview: enHealthInterview,
        healthTimeline: enHealthTimeline,
      },
      ur: {
        navbar: urNavbar,
        footer: urFooter,
        voiceConversation: urVoiceConversation,
        doctors: urDoctors,
        healthInterview: urHealthInterview,
        healthTimeline: urHealthTimeline,
      },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;