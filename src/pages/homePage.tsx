// components/HomePage.tsx

import React, { useState } from "react";
import {
  APP_FEATURES,
  APP_STATISTICS,
  APP_TEXT,
} from "../pages/navbarData";

import { MdPsychology, MdRecordVoiceOver } from "react-icons/md";
import { Search, MapPin, ChevronDown } from "lucide-react";

interface HomePageProps {
  userLanguage: string;
  setUserLanguage: (lang: string) => void;
  setCurrentModule: (module: string) => void;
}

const CITY_OPTIONS = [
  "Islamabad",
  "Lahore",
  "Karachi",
  "Rawalpindi",
  "Faisalabad",
  "Peshawar",
  "Quetta",
  "Multan",
  "Other",
];

const POPULAR_REASONS = [
  { id: "fever", en: "Fever & Flu", ur: "بخار اور نزلہ" },
  { id: "chest-pain", en: "Chest Pain", ur: "سینے میں درد" },
  { id: "bp", en: "Blood Pressure", ur: "بلڈ پریشر" },
  { id: "sugar", en: "Diabetes / Sugar", ur: "شوگر" },
  { id: "stomach", en: "Stomach Pain", ur: "پیٹ درد" },
  { id: "headache", en: "Headache / Migraine", ur: "سر درد / مائیگرین" },
];

const HomePage: React.FC<HomePageProps> = ({
  userLanguage,
  setUserLanguage,
  setCurrentModule,
}) => {
  const isUrdu = userLanguage === "ur";

  const [city, setCity] = useState<string>("Islamabad");
  const [isCityOpen, setIsCityOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // when user presses main "Find Doctor" button
  const handleSearch = () => {
    try {
      if (city) {
        sessionStorage.setItem("sehatHub-findDoctor-city", city);
      }
      sessionStorage.setItem(
        "sehatHub-findDoctor-query",
        searchTerm.trim() || ""
      );
    } catch {
      // ignore storage errors
    }

    // show doctor page (module based)
    setCurrentModule("findDoctor");
  };

  // when user clicks a quick reason chip
  const handleReasonClick = (labelEn: string) => {
    const value = labelEn.trim();
    setSearchTerm(value);

    try {
      if (city) {
        sessionStorage.setItem("sehatHub-findDoctor-city", city);
      }
      sessionStorage.setItem("sehatHub-findDoctor-query", value);
    } catch {
      // ignore
    }

    // directly open Find Doctor module so it can prune doctors
    setCurrentModule("findDoctor");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-50 via-blue-50 to-indigo-100 flex">
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">
        {/* main glass card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
          {/* HERO + SEARCH */}
          <section className="px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10 lg:pt-12 pb-6 sm:pb-8 lg:pb-10">
            <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-start sm:justify-between">
              {/* title + tagline */}
              <div className="text-center sm:text-left">
                <p className="inline-flex items-center px-3 py-1 rounded-full text-[11px] sm:text-xs bg-blue-50 text-blue-700 border border-blue-100 mb-3">
                  <span className="mr-1">🩺</span>
                  {isUrdu ? "صوت سے پہلے صحت کی جانچ" : "Voice-First Health Triage"}
                </p>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-3 sm:mb-4 leading-tight">
                  {
                    APP_TEXT.appName[
                      userLanguage as keyof typeof APP_TEXT.appName
                    ]
                  }
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-xl mx-auto sm:mx-0">
                  {
                    APP_TEXT.tagline[
                      userLanguage as keyof typeof APP_TEXT.tagline
                    ]
                  }
                </p>
              </div>

              {/* language toggle */}
              <div className="flex justify-center sm:justify-end mt-4 sm:mt-0">
                <div className="inline-flex bg-white rounded-full p-1 shadow-md">
                  <button
                    onClick={() => setUserLanguage("en")}
                    className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base transition-all ${
                      userLanguage === "en"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setUserLanguage("ur")}
                    className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base transition-all ${
                      userLanguage === "ur"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    اردو
                  </button>
                </div>
              </div>
            </div>

            {/* search panel */}
            <div className="mt-6 sm:mt-8 bg-white/95 border border-slate-100 rounded-2xl shadow-md p-3 sm:p-4 lg:p-5">
              <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                {isUrdu
                  ? "اپنا شہر منتخب کریں اور ڈاکٹر، اسپیشلسٹ یا ہسپتال تلاش کریں"
                  : "Select your city and search for a doctor, specialist, or hospital"}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative">
                {/* city dropdown */}
                <div className="sm:w-1/3 relative">
                  <button
                    type="button"
                    onClick={() => setIsCityOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 sm:px-4 py-2.5 text-sm"
                  >
                    <span className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>{city || (isUrdu ? "شہر منتخب کریں" : "Select city")}</span>
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {isCityOpen && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                      {CITY_OPTIONS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setCity(c);
                            setIsCityOpen(false);
                          }}
                          className={`w-full text-left px-3 sm:px-4 py-2 text-sm hover:bg-blue-50 ${
                            c === city ? "bg-blue-50 text-blue-700" : ""
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* search input + button */}
                <div className="flex-1 flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 sm:px-4 py-2.5">
                    <Search className="w-4 h-4 text-gray-400 mr-2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm"
                      placeholder={
                        isUrdu
                          ? "ڈاکٹر، اسپیشلسٹ، ہسپتال یا بیماری تلاش کریں…"
                          : "Search by doctor, specialty, hospital or disease..."
                      }
                    />
                  </div>

                  <button
                    onClick={handleSearch}
                    className="sm:w-auto w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-xl px-4 sm:px-6 py-2.5 flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <Search className="w-4 h-4" />
                    {isUrdu ? "ڈاکٹر تلاش کریں" : "Find Doctor"}
                  </button>
                </div>
              </div>

              {/* popular reasons / diseases row */}
              <div className="mt-4">
                <p className="text-[11px] sm:text-xs text-gray-500 mb-2">
                  {isUrdu
                    ? "یا ان عام مسائل میں سے کسی کو منتخب کریں:"
                    : "Or choose from common health reasons:"}
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {POPULAR_REASONS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleReasonClick(r.en)}
                      className="flex-shrink-0 px-3 sm:px-4 py-1.5 rounded-full bg-slate-50 hover:bg-blue-50 border border-slate-200 text-xs sm:text-sm text-gray-700 hover:text-blue-700 transition-colors"
                    >
                      {isUrdu ? r.ur : r.en}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* HOW CAN WE HELP – main features */}
          <section className="px-4 sm:px-8 lg:px-12 pb-6 sm:pb-8 lg:pb-10">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {isUrdu
                  ? "ہم آج آپ کی کیسے مدد کر سکتے ہیں؟"
                  : "How can we help you today?"}
              </h2>
              <p className="hidden sm:block text-xs text-gray-500">
                {isUrdu
                  ? "صرف ایک کلک میں مناسب آپشن منتخب کریں"
                  : "Choose the option that fits you best"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {APP_FEATURES.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentModule(feature.module)}
                  className="bg-white/95 w-full text-left p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer border border-slate-100"
                >
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1.5 sm:mb-2">
                    {isUrdu ? feature.titleUrdu : feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {isUrdu ? feature.descUrdu : feature.desc}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* QUICK START CTA (Interview + Voice) */}
          <section className="px-4 sm:px-8 lg:px-12 pb-6 sm:pb-8 lg:pb-10 text-center">
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center">
              <button
                onClick={() => setCurrentModule("interview")}
                className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <MdPsychology className="text-lg sm:text-2xl" />
                {
                  APP_TEXT.buttons.startInterview[
                    userLanguage as keyof typeof APP_TEXT.buttons.startInterview
                  ]
                }
              </button>

              <button
                onClick={() => setCurrentModule("tts")}
                className="bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <MdRecordVoiceOver className="text-lg sm:text-2xl" />
                {
                  APP_TEXT.buttons.testVoice[
                    userLanguage as keyof typeof APP_TEXT.buttons.testVoice
                  ]
                }
              </button>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
              {
                APP_TEXT.moduleHelperText[
                  userLanguage as keyof typeof APP_TEXT.moduleHelperText
                ]
              }
            </p>
          </section>

          {/* STATS */}
          <section className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 bg-slate-50/60 border-t border-slate-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
              {APP_STATISTICS.map((stat, index) => (
                <div key={index} className="space-y-1 sm:space-y-1.5">
                  <div
                    className={`text-lg sm:text-2xl font-bold tracking-tight ${stat.color}`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[11px] sm:text-xs md:text-sm text-gray-600">
                    {isUrdu ? stat.labelUrdu : stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* DISCLAIMER */}
          <section className="px-4 sm:px-8 lg:px-12 pb-8 sm:pb-10 lg:pb-12">
            <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="text-yellow-600 text-xl sm:text-2xl">⚠️</div>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1 sm:mb-2 text-sm sm:text-base">
                    {
                      APP_TEXT.disclaimer.title[
                        userLanguage as keyof typeof APP_TEXT.disclaimer.title
                      ]
                    }
                  </h4>
                  <p className="text-xs sm:text-sm text-yellow-800 leading-relaxed">
                    {
                      APP_TEXT.disclaimer.content[
                        userLanguage as keyof typeof APP_TEXT.disclaimer.content
                      ]
                    }
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
