// components/Navbar.tsx
import React, { useState } from "react";
import { APP_MODULES, APP_TEXT } from "../pages/navbarData";
import { Hospital, Menu, X } from "lucide-react";

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
    <nav className="backdrop-blur-md sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div
            onClick={handleHomeClick}
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 text-white shadow-md">
              <Hospital className="w-6 h-6" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-gray-900">
                SehatHub
              </span>
              <span className="text-xs text-gray-600 hidden sm:block">
                Voice-First Health
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {APP_MODULES.slice(1).map((module) => {
              const isActive = currentModule === module.id;
              return (
                <button
                  key={module.id}
                  onClick={() => handleModuleClick(module.id)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-green-600 text-white shadow-lg"
                      : "text-gray-800 hover:bg-white/50 hover:shadow-md"
                  }`}
                >
                  {isUrdu ? module.nameUrdu : module.name}
                </button>
              );
            })}
          </div>

          {/* Right Side: Language + Emergency */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() =>
                setUserLanguage(userLanguage === "en" ? "ur" : "en")
              }
              className="px-4 py-2 bg-white/70 hover:bg-white/90 rounded-lg text-sm font-medium text-gray-800 transition-all hidden sm:block shadow-sm"
            >
              {userLanguage === "en" ? "اردو" : "English"}
            </button>

            {/* Emergency Button - Desktop */}
            <a
              href="tel:1122"
              className="hidden sm:flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-bold transition-all shadow-md"
            >
              <span>🚨</span>
              {
                APP_TEXT.buttons.emergency[
                  userLanguage as keyof typeof APP_TEXT.buttons.emergency
                ]
              }
            </a>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg bg-white/70 hover:bg-white/90 transition-all shadow-sm"
              onClick={toggleMobile}
              aria-label="Toggle menu"
            >
              {isMobileOpen ? (
                <X className="w-6 h-6 text-gray-800" />
              ) : (
                <Menu className="w-6 h-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileOpen && (
          <div className="lg:hidden bg-white/90 backdrop-blur-md border-t border-gray-200 py-4 animate-in fade-in slide-in-from-top-2 shadow-lg">
            <div className="space-y-2">
              {/* Language Toggle Mobile */}
              <button
                onClick={() => {
                  setUserLanguage(userLanguage === "en" ? "ur" : "en");
                  setIsMobileOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-all"
              >
                {userLanguage === "en" ? "اردو" : "English"}
              </button>

              {/* Module Links */}
              {APP_MODULES.slice(1).map((module) => {
                const isActive = currentModule === module.id;
                return (
                  <button
                    key={module.id}
                    onClick={() => handleModuleClick(module.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {isUrdu ? module.nameUrdu : module.name}
                  </button>
                );
              })}

              {/* Emergency Button Mobile */}
              <a
                href="tel:1122"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-all shadow-md mt-3"
                onClick={() => setIsMobileOpen(false)}
              >
                <span>🚨</span>
                {
                  APP_TEXT.buttons.emergency[
                    userLanguage as keyof typeof APP_TEXT.buttons.emergency
                  ]
                }
              </a>

              {/* Helper Text */}
              <p className="text-xs text-gray-500 text-center mt-3 px-4">
                {isUrdu
                  ? "کسی بھی فیچر پر جانے کے لیے اوپر سے منتخب کریں"
                  : "Select any feature above to navigate"}
              </p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;