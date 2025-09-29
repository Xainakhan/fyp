// components/Navbar.tsx
import React from "react";
import { APP_MODULES, APP_TEXT } from "../pages/data";

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
  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setCurrentModule("home")}
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              🏥 صحت Hub
            </div>
          </div>

          {/* Module Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {APP_MODULES.slice(1).map((module) => (
              <button
                key={module.id}
                onClick={() => setCurrentModule(module.id)}
                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  currentModule === module.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                {userLanguage === "ur" ? module.nameUrdu : module.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Language Toggle & Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() =>
                setUserLanguage(userLanguage === "en" ? "ur" : "en")
              }
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-all font-medium"
            >
              {userLanguage === "en" ? "اردو" : "English"}
            </button>

            {/* Emergency Button */}
            <button className="px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-all font-medium">
              🚨{" "}
              {
                APP_TEXT.buttons.emergency[
                  userLanguage as keyof typeof APP_TEXT.buttons.emergency
                ]
              }
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;