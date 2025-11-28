// components/Navbar.tsx
import React, { useState } from "react";
import { APP_MODULES, APP_TEXT } from "../pages/navbarData";
import { Hospital, Menu, X, PhoneCall } from "lucide-react";

interface NavbarProps {
  currentModule: string;
  setCurrentModule: (module: string) => void;
  userLanguage: string;
  setUserLanguage: (lang: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  currentModule,
  setCurrentModule,
  userLanguage,
  setUserLanguage,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isUrdu = userLanguage === "ur";

  const toggleMobile = () => setIsMobileOpen((prev) => !prev);

  const handleModuleClick = (id: string) => {
    setCurrentModule(id);
    setIsMobileOpen(false);
  };

  const handleHomeClick = () => {
    setCurrentModule("home");
    setIsMobileOpen(false);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {/* TOP BAR */}
        <div className="flex items-center justify-between gap-3 py-3 sm:py-2">
          {/* Logo / Brand */}
          <div
            onClick={handleHomeClick}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-2xl bg-blue-600 text-white shadow-md">
              <Hospital className="w-5 h-5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base sm:text-lg font-bold text-slate-900">
                SehatHub
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500">
                {isUrdu ? "وائس فرسٹ ہیلتھ ٹریائج" : "Voice-First Health Triage"}
              </span>
            </div>
          </div>

          {/* Desktop module nav */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {APP_MODULES.slice(1).map((module) => (
              <button
                key={module.id}
                onClick={() => handleModuleClick(module.id)}
                className={`px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all
                  ${
                    currentModule === module.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-slate-100 hover:text-gray-900"
                  }`}
              >
                {isUrdu ? module.nameUrdu : module.name}
              </button>
            ))}
          </div>

          {/* Right side: language + emergency (desktop) + menu toggle (mobile) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language toggle */}
            <button
              onClick={() =>
                setUserLanguage(userLanguage === "en" ? "ur" : "en")
              }
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-100 rounded-full text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-200 transition-all"
            >
              {userLanguage === "en" ? "اردو" : "English"}
            </button>

            {/* Emergency button – desktop only here */}
            <button className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full text-xs sm:text-sm font-semibold hover:bg-red-600 transition-all shadow-sm">
              <PhoneCall className="w-4 h-4" />
              {
                APP_TEXT.buttons.emergency[
                  userLanguage as keyof typeof APP_TEXT.buttons.emergency
                ]
              }
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all"
              onClick={toggleMobile}
              aria-label="Toggle menu"
            >
              {isMobileOpen ? (
                <X className="w-5 h-5 text-slate-700" />
              ) : (
                <Menu className="w-5 h-5 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {isMobileOpen && (
          <div className="md:hidden pb-3 animate-in fade-in slide-in-from-top-1">
            <div className="border-t border-slate-100 pt-3 space-y-2">
              {/* Modules */}
              <div className="flex flex-col gap-2">
                {APP_MODULES.slice(1).map((module) => (
                  <button
                    key={module.id}
                    onClick={() => handleModuleClick(module.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${
                        currentModule === module.id
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-slate-50 text-gray-700 hover:bg-slate-100"
                      }`}
                  >
                    {isUrdu ? module.nameUrdu : module.name}
                  </button>
                ))}
              </div>

              {/* Emergency CTA – full width, clearer position */}
              <button className="mt-1 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold shadow-md hover:bg-red-600 transition-all">
                <PhoneCall className="w-4 h-4" />
                {
                  APP_TEXT.buttons.emergency[
                    userLanguage as keyof typeof APP_TEXT.buttons.emergency
                  ]
                }
              </button>

              {/* Hint */}
              <p className="text-[11px] text-slate-500 mt-1 px-1">
                {isUrdu
                  ? "کسی بھی فیچر پر جانے کے لیے اوپر سے منتخب کریں، ہنگامی صورتِ حال میں سرخ بٹن استعمال کریں۔"
                  : "Choose a tool above to navigate, or use the red button only in emergencies."}
              </p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
