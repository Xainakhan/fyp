// components/HomePage/index.tsx
// All text comes from i18n  →  locales/en/home.json  |  locales/ur/home.json
// Import this page normally; make sure i18n.ts is imported once in main.tsx / App.tsx

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MdPsychology, MdRecordVoiceOver } from "react-icons/md";
import { Search, MapPin, ChevronDown } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface HomePageProps {
  userLanguage: string;
  setUserLanguage: (lang: string) => void;
  setCurrentModule: (module: string) => void;
}

// ─── Static data (non-translatable / structural) ──────────────────────────────
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

// reason.key maps to both the i18n key and the English query stored in session
const POPULAR_REASONS = [
  { id: "fever",     i18nKey: "popularReasons.fever",     enQuery: "Fever & Flu" },
  { id: "chestPain", i18nKey: "popularReasons.chestPain", enQuery: "Chest Pain" },
  { id: "bp",        i18nKey: "popularReasons.bp",        enQuery: "Blood Pressure" },
  { id: "sugar",     i18nKey: "popularReasons.sugar",     enQuery: "Diabetes / Sugar" },
  { id: "stomach",   i18nKey: "popularReasons.stomach",   enQuery: "Stomach Pain" },
  { id: "headache",  i18nKey: "popularReasons.headache",  enQuery: "Headache / Migraine" },
];

const APP_FEATURES = [
  { module: "interview",      icon: "🧠", i18nKey: "features.interview" },
  { module: "findDoctor",     icon: "🏥", i18nKey: "features.findDoctor" },
  { module: "tts",            icon: "🎙️", i18nKey: "features.tts" },
  { module: "healthTimeline", icon: "📋", i18nKey: "features.healthTimeline" },
];

const APP_STATISTICS = [
  { value: "500+",  i18nKey: "stats.doctors",   color: "text-green-600" },
  { value: "20+",   i18nKey: "stats.cities",    color: "text-blue-600" },
  { value: "2",     i18nKey: "stats.languages", color: "text-purple-600" },
  { value: "24/7",  i18nKey: "stats.available", color: "text-teal-600" },
];

// ══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

// ─── LanguageToggle ────────────────────────────────────────────────────────
const LanguageToggle: React.FC<{
  userLanguage: string;
  setUserLanguage: (l: string) => void;
}> = ({ userLanguage, setUserLanguage }) => {
  const { i18n } = useTranslation("home");

  const handleChange = (lang: string) => {
    setUserLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex justify-end mb-6 sm:mb-8">
      <div className="inline-flex bg-white rounded-full p-1 shadow-lg border border-gray-200">
        {[
          { code: "en", label: "English" },
          { code: "ur", label: "اردو" },
        ].map(({ code, label }) => (
          <button
            key={code}
            onClick={() => handleChange(code)}
            className={`px-5 sm:px-7 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all ${
              userLanguage === code
                ? "bg-green-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── HeroBadge ────────────────────────────────────────────────────────────
const HeroBadge: React.FC = () => {
  const { t } = useTranslation("home");
  return (
    <div className="flex justify-center mb-5">
      <span className="inline-flex items-center px-4 py-2 rounded-full text-xs sm:text-sm bg-green-50 text-green-700 border border-green-200 font-medium shadow-sm">
        <span className="mr-2">🩺</span>
        {t("badge")}
      </span>
    </div>
  );
};

// ─── SearchCard ───────────────────────────────────────────────────────────
const SearchCard: React.FC<{
  onSearch: (city: string, query: string) => void;
}> = ({ onSearch }) => {
  const { t } = useTranslation("home");

  const [city, setCity] = useState<string>(() => {
    try { return sessionStorage.getItem("sehatHub-findDoctor-city") || "Islamabad"; }
    catch { return "Islamabad"; }
  });
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>(() => {
    try { return sessionStorage.getItem("sehatHub-findDoctor-query") || ""; }
    catch { return ""; }
  });

  useEffect(() => {
    try { sessionStorage.setItem("sehatHub-findDoctor-city", city); } catch { /* ignore */ }
  }, [city]);

  useEffect(() => {
    try { sessionStorage.setItem("sehatHub-findDoctor-query", searchTerm); } catch { /* ignore */ }
  }, [searchTerm]);

  const commitSearch = (q: string) => {
    try {
      sessionStorage.setItem("sehatHub-findDoctor-city", city);
      sessionStorage.setItem("sehatHub-findDoctor-query", q.trim());
    } catch { /* ignore */ }
    onSearch(city, q.trim());
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-8">
      {/* Label */}
      <p className="text-sm sm:text-base text-gray-600 mb-5 text-left font-medium">
        {t("hero.searchLabel")}
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
              <span>{city || t("hero.cityPlaceholder")}</span>
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${isCityOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isCityOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsCityOpen(false)} />
              <div className="absolute z-20 mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                {CITY_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { setCity(c); setIsCityOpen(false); }}
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
            onKeyPress={(e) => e.key === "Enter" && commitSearch(searchTerm)}
            className="flex-1 bg-transparent outline-none text-sm sm:text-base text-gray-800 placeholder:text-gray-500 font-medium"
            placeholder={t("hero.searchPlaceholder")}
          />
        </div>

        {/* Find Doctor Button */}
        <button
          onClick={() => commitSearch(searchTerm)}
          className="lg:w-auto w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-bold rounded-xl px-6 sm:px-8 py-3.5 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 whitespace-nowrap"
        >
          <Search className="w-5 h-5" />
          {t("hero.findDoctorBtn")}
        </button>
      </div>

      {/* Popular Reasons */}
      <div className="mt-6">
        <p className="text-xs sm:text-sm text-gray-600 mb-3 text-left font-medium">
          {t("hero.quickReasonsLabel")}
        </p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_REASONS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setSearchTerm(r.enQuery); // always store English query value
                commitSearch(r.enQuery);
              }}
              className="px-4 py-2 rounded-full bg-green-50 hover:bg-green-100 border border-green-200 text-xs sm:text-sm text-green-700 font-medium hover:text-green-800 transition-all hover:shadow-md"
            >
              {t(r.i18nKey)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── FeaturesGrid ─────────────────────────────────────────────────────────
const FeaturesGrid: React.FC<{
  setCurrentModule: (m: string) => void;
}> = ({ setCurrentModule }) => {
  const { t } = useTranslation("home");

  return (
    <section className="mb-12 sm:mb-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2">
          {t("howWeHelp.heading")}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {APP_FEATURES.map((feature) => (
          <button
            key={feature.module}
            onClick={() => setCurrentModule(feature.module)}
            className="bg-white w-full text-center p-6 sm:p-7 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100 group"
          >
            <div className="text-4xl sm:text-5xl mb-4 transform group-hover:scale-110 transition-transform flex justify-center">
              {feature.icon}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
              {t(`${feature.i18nKey}.title`)}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t(`${feature.i18nKey}.desc`)}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
};

// ─── QuickStartCTA ────────────────────────────────────────────────────────
const QuickStartCTA: React.FC<{
  setCurrentModule: (m: string) => void;
}> = ({ setCurrentModule }) => {
  const { t } = useTranslation("home");

  return (
    <section className="mb-12 sm:mb-16">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
          {t("quickStart.heading")}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          {t("moduleHelperText")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => setCurrentModule("interview")}
            className="bg-green-600 hover:bg-green-700 text-white px-8 sm:px-10 py-4 rounded-xl text-base sm:text-lg font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            <MdPsychology className="text-2xl" />
            {t("quickStart.startInterviewBtn")}
          </button>

          <button
            onClick={() => setCurrentModule("tts")}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 sm:px-10 py-4 rounded-xl text-base sm:text-lg font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            <MdRecordVoiceOver className="text-2xl" />
            {t("quickStart.testVoiceBtn")}
          </button>
        </div>
      </div>
    </section>
  );
};

// ─── StatsSection ─────────────────────────────────────────────────────────
const StatsSection: React.FC = () => {
  const { t } = useTranslation("home");

  return (
    <section className="mb-12 sm:mb-16">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {APP_STATISTICS.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-700 font-semibold">
                {t(stat.i18nKey)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Disclaimer ───────────────────────────────────────────────────────────
const Disclaimer: React.FC = () => {
  const { t } = useTranslation("home");

  return (
    <section className="mb-8">
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="text-yellow-600 text-2xl sm:text-3xl flex-shrink-0">⚠️</div>
          <div>
            <h4 className="font-bold text-yellow-900 mb-2 text-base sm:text-lg">
              {t("disclaimer.title")}
            </h4>
            <p className="text-sm sm:text-base text-yellow-900 leading-relaxed">
              {t("disclaimer.content")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
const HomePage: React.FC<HomePageProps> = ({
  userLanguage,
  setUserLanguage,
  setCurrentModule,
}) => {
  const { t } = useTranslation("home");

  const handleSearch = (_city: string, _query: string) => {
    setCurrentModule("findDoctor");
  };

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Language Toggle */}
      <LanguageToggle userLanguage={userLanguage} setUserLanguage={setUserLanguage} />

      <div className="max-w-5xl mx-auto">

        {/* ── HERO ── */}
        <section className="text-center mb-12 sm:mb-16">
          <HeroBadge />

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
            {t("appName")}
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed font-medium">
            {t("tagline")}
          </p>

          <SearchCard onSearch={handleSearch} />
        </section>

        {/* ── HOW CAN WE HELP ── */}
        <FeaturesGrid setCurrentModule={setCurrentModule} />

        {/* ── QUICK START CTA ── */}
        <QuickStartCTA setCurrentModule={setCurrentModule} />

        {/* ── STATS ── */}
        <StatsSection />

        {/* ── DISCLAIMER ── */}
        <Disclaimer />
      </div>

      {/* Custom scrollbar for city dropdown */}
      <style>{`
        .overflow-y-auto::-webkit-scrollbar { width: 6px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </main>
  );
};

export default HomePage;