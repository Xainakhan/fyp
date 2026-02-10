// components/HomePage.tsx

import React, { useState, useEffect } from "react";
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

  // Persist states
  const [city, setCity] = useState<string>(() => {
    try {
      return sessionStorage.getItem("sehatHub-findDoctor-city") || "Islamabad";
    } catch {
      return "Islamabad";
    }
  });
  
  const [isCityOpen, setIsCityOpen] = useState<boolean>(false);
  
  const [searchTerm, setSearchTerm] = useState<string>(() => {
    try {
      return sessionStorage.getItem("sehatHub-findDoctor-query") || "";
    } catch {
      return "";
    }
  });

  // Persist city changes
  useEffect(() => {
    try {
      sessionStorage.setItem("sehatHub-findDoctor-city", city);
    } catch {
      // ignore
    }
  }, [city]);

  // Persist search term changes
  useEffect(() => {
    try {
      sessionStorage.setItem("sehatHub-findDoctor-query", searchTerm);
    } catch {
      // ignore
    }
  }, [searchTerm]);

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
    <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Language Toggle - Top Right */}
        {/* Language Toggle - Top Right */}
        <div className="flex justify-end mb-6 sm:mb-8">
          <div className="inline-flex bg-white rounded-full p-1 shadow-lg border border-gray-200">
            <button
              onClick={() => setUserLanguage("en")}
              className={`px-5 sm:px-7 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all ${
                userLanguage === "en"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setUserLanguage("ur")}
              className={`px-5 sm:px-7 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all ${
                userLanguage === "ur"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              اردو
            </button>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="max-w-5xl mx-auto">
          {/* HERO SECTION with Search */}
          <section className="text-center mb-12 sm:mb-16">
            {/* Badge */}
            <div className="flex justify-center mb-5">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-xs sm:text-sm bg-green-50 text-green-700 border border-green-200 font-medium shadow-sm">
                <span className="mr-2">🩺</span>
                {isUrdu ? "صوت سے پہلے صحت کی جانچ" : "Voice-First Health Triage"}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
              {
                APP_TEXT.appName[
                  userLanguage as keyof typeof APP_TEXT.appName
                ]
              }
            </h1>

            {/* Tagline */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed font-medium">
              {
                APP_TEXT.tagline[
                  userLanguage as keyof typeof APP_TEXT.tagline
                ]
              }
            </p>

            {/* Search Card */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-8">
              <p className="text-sm sm:text-base text-gray-600 mb-5 text-left font-medium">
                {isUrdu
                  ? "اپنا شہر منتخب کریں اور ڈاکٹر، اسپیشلسٹ یا ہسپتال تلاش کریں"
                  : "Select your city and search for a doctor, specialist, or hospital"}
              </p>

              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                {/* City Dropdown */}
                <div className="lg:w-1/4 relative">
                  <button
                    type="button"
                    onClick={() => setIsCityOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm sm:text-base transition-all font-medium"
                  >
                    <span className="flex items-center gap-2 text-gray-800">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <span>{city || (isUrdu ? "شہر منتخب کریں" : "Select city")}</span>
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isCityOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsCityOpen(false)}
                      ></div>
                      <div className="absolute z-20 mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                        {CITY_OPTIONS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setCity(c);
                              setIsCityOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm sm:text-base hover:bg-green-50 transition-colors font-medium ${
                              c === city ? "bg-green-50 text-green-700" : "text-gray-700"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Search Input */}
                <div className="flex-1 flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3.5">
                  <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 bg-transparent outline-none text-sm sm:text-base text-gray-800 placeholder:text-gray-500 font-medium"
                    placeholder={
                      isUrdu
                        ? "ڈاکٹر، اسپیشلسٹ، ہسپتال یا بیماری تلاش کریں…"
                        : "Search by doctor, specialty, hospital or disease..."
                    }
                  />
                </div>

                {/* Find Doctor Button */}
                <button
                  onClick={handleSearch}
                  className="lg:w-auto w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-bold rounded-xl px-6 sm:px-8 py-3.5 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 whitespace-nowrap"
                >
                  <Search className="w-5 h-5" />
                  {isUrdu ? "ڈاکٹر تلاش کریں" : "Find Doctor"}
                </button>
              </div>

              {/* Popular Reasons */}
              <div className="mt-6">
                <p className="text-xs sm:text-sm text-gray-600 mb-3 text-left font-medium">
                  {isUrdu
                    ? "یا ان عام مسائل میں سے کسی کو منتخب کریں:"
                    : "Or choose from common health reasons:"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_REASONS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleReasonClick(r.en)}
                      className="px-4 py-2 rounded-full bg-green-50 hover:bg-green-100 border border-green-200 text-xs sm:text-sm text-green-700 font-medium hover:text-green-800 transition-all hover:shadow-md"
                    >
                      {isUrdu ? r.ur : r.en}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* HOW CAN WE HELP */}
          <section className="mb-12 sm:mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2">
                {isUrdu
                  ? "ہم آج آپ کی کیسے مدد کر سکتے ہیں؟"
                  : "How can we help you today?"}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {APP_FEATURES.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentModule(feature.module)}
                  className="bg-white w-full text-center p-6 sm:p-7 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100 group"
                >
                  <div className="text-4xl sm:text-5xl mb-4 transform group-hover:scale-110 transition-transform flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                    {isUrdu ? feature.titleUrdu : feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {isUrdu ? feature.descUrdu : feature.desc}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* QUICK START CTA */}
          <section className="mb-12 sm:mb-16">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                {isUrdu ? "فوری طور پر شروع کریں" : "Get Started Quickly"}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                {
                  APP_TEXT.moduleHelperText[
                    userLanguage as keyof typeof APP_TEXT.moduleHelperText
                  ]
                }
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => setCurrentModule("interview")}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 sm:px-10 py-4 rounded-xl text-base sm:text-lg font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 w-full sm:w-auto"
                >
                  <MdPsychology className="text-2xl" />
                  {
                    APP_TEXT.buttons.startInterview[
                      userLanguage as keyof typeof APP_TEXT.buttons.startInterview
                    ]
                  }
                </button>

                <button
                  onClick={() => setCurrentModule("tts")}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 sm:px-10 py-4 rounded-xl text-base sm:text-lg font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 w-full sm:w-auto"
                >
                  <MdRecordVoiceOver className="text-2xl" />
                  {
                    APP_TEXT.buttons.testVoice[
                      userLanguage as keyof typeof APP_TEXT.buttons.testVoice
                    ]
                  }
                </button>
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="mb-12 sm:mb-16">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
                {APP_STATISTICS.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div
                      className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${stat.color}`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-700 font-semibold">
                      {isUrdu ? stat.labelUrdu : stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* DISCLAIMER */}
          <section className="mb-8">
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="text-yellow-600 text-2xl sm:text-3xl flex-shrink-0">⚠️</div>
                <div>
                  <h4 className="font-bold text-yellow-900 mb-2 text-base sm:text-lg">
                    {
                      APP_TEXT.disclaimer.title[
                        userLanguage as keyof typeof APP_TEXT.disclaimer.title
                      ]
                    }
                  </h4>
                  <p className="text-sm sm:text-base text-yellow-900 leading-relaxed">
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

      <style>{`
        /* Custom scrollbar for dropdown */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </main>
  );
};

export default HomePage;