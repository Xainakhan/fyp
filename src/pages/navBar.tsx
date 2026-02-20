import React, { useState } from "react";
import { APP_MODULES } from "../data/navbarData";
import { Hospital, Menu, X, User } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation("navbar");
  const isUrdu = userLanguage === "ur";

  // ── Handlers ────────────────────────────────────────────────────────────────
  const toggleMobile = () => setIsMobileOpen((prev) => !prev);

  const handleModuleClick = (id: string) => {
    setCurrentModule(id);
    setIsMobileOpen(false);
  };

  const handleHomeClick = () => {
    setCurrentModule("home");
    setIsMobileOpen(false);
  };

  const handleProfileClick = () => {
    setCurrentModule("profile");
    setIsMobileOpen(false);
  };

  const handleLanguageToggle = (closeMobile = false) => {
    const newLang = userLanguage === "en" ? "ur" : "en";
    setUserLanguage(newLang);
    i18n.changeLanguage(newLang);
    document.documentElement.dir  = newLang === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
    if (closeMobile) setIsMobileOpen(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <nav className="backdrop-blur-md sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo / Brand ── */}
          <div
            onClick={handleHomeClick}
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 text-white shadow-md">
              <Hospital className="w-6 h-6" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-gray-900">
                {t("brand.name")}
              </span>
              <span className="text-xs text-gray-600 hidden sm:block">
                {t("brand.tagline")}
              </span>
            </div>
          </div>

          {/* ── Desktop Navigation ── */}
          {/* APP_MODULES.slice(1) preserves original behaviour — index 0 is "home" */}
          <div className="hidden lg:flex items-center gap-1 max-w-[55vw]">
            {APP_MODULES.slice(1).map((module) => {
              const isActive = currentModule === module.id;
              return (
                <button
                  key={module.id}
                  onClick={() => handleModuleClick(module.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? "bg-green-600 text-white shadow-lg"
                      : "text-gray-800 hover:bg-white/50 hover:shadow-md"
                  }`}
                >
                  {t(`modules.${module.id}`)}
                </button>
              );
            })}
          </div>

          {/* ── Right Side Controls ── */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Emergency Button — Desktop */}
            <a
              href="tel:1122"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-bold transition-all shadow-md whitespace-nowrap"
            >
              🚨 {t("emergency.desktop")}
            </a>

            {/* Language Toggle — Desktop */}
            <button
              onClick={() => handleLanguageToggle()}
              className="hidden sm:flex items-center justify-center px-3 h-9 bg-white/70 hover:bg-white/90 rounded-full text-sm font-bold text-gray-800 transition-all shadow-sm"
              title={isUrdu ? t("languageToggle.titleToEnglish") : t("languageToggle.titleToUrdu")}
            >
              {isUrdu
                ? t("languageToggle.desktopAlt")   // show "En" when currently Urdu
                : t("languageToggle.desktop")}       {/* show "اردو" when currently English */}
            </button>

            {/* Profile Icon */}
            <button
              onClick={handleProfileClick}
              className={`p-2.5 rounded-full transition-all shadow-sm ${
                currentModule === "profile"
                  ? "bg-green-600 text-white"
                  : "bg-white/70 hover:bg-white/90 text-gray-800"
              }`}
              title={t("profile.title")}
            >
              <User className="w-5 h-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg bg-white/70 hover:bg-white/90 transition-all shadow-sm"
              onClick={toggleMobile}
              aria-label={t("mobileMenu.ariaLabel")}
            >
              {isMobileOpen ? (
                <X    className="w-6 h-6 text-gray-800" />
              ) : (
                <Menu className="w-6 h-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu Dropdown ── */}
        {isMobileOpen && (
          <div className="lg:hidden bg-white/90 backdrop-blur-md border-t border-gray-200 py-4 animate-in fade-in slide-in-from-top-2 shadow-lg">
            <div className="space-y-2">

              {/* Language Toggle — Mobile */}
              <button
                onClick={() => handleLanguageToggle(true)}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-all"
              >
                {isUrdu
                  ? t("languageToggle.mobileAlt")   // "Switch to English" when in Urdu
                  : t("languageToggle.mobile")}       {/* "Switch to Urdu" when in English */}
              </button>

              {/* Module Links — all modules from APP_MODULES.slice(1) */}
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
                    {t(`modules.${module.id}`)}
                  </button>
                );
              })}

              {/* Emergency Button — Mobile */}
              <a
                href="tel:1122"
                onClick={() => setIsMobileOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-all shadow-md"
              >
                🚨 {t("emergency.mobile")}
              </a>

              {/* Profile Button — Mobile */}
              <button
                onClick={handleProfileClick}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  currentModule === "profile"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <User className="w-5 h-5" />
                {t("profile.label")}
              </button>

              {/* Helper Text */}
              <p className="text-xs text-gray-500 text-center mt-3 px-4">
                {t("mobileMenu.helperText")}
              </p>

            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;