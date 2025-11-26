// pages/homePage.tsx
// components/HomePage.tsx
import React from "react";
import {
  APP_FEATURES,
  APP_STATISTICS,
  APP_TEXT,
} from "../pages/navbarData";
 

interface HomePageProps {
  userLanguage: string;
  setUserLanguage: (lang: string) => void;
  setCurrentModule: (module: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  userLanguage,
  setUserLanguage,
  setCurrentModule,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            {APP_TEXT.appName[userLanguage as keyof typeof APP_TEXT.appName]}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {APP_TEXT.tagline[userLanguage as keyof typeof APP_TEXT.tagline]}
          </p>

          {/* Language Toggle */}
          <div className="mt-8">
            <div className="inline-flex bg-white rounded-full p-1 shadow-lg">
              <button
                onClick={() => setUserLanguage("en")}
                className={`px-6 py-2 rounded-full transition-all ${
                  userLanguage === "en"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setUserLanguage("ur")}
                className={`px-6 py-2 rounded-full transition-all ${
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

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {APP_FEATURES.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
              onClick={() => setCurrentModule(feature.module)}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {userLanguage === "ur" ? feature.titleUrdu : feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {userLanguage === "ur" ? feature.descUrdu : feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Start Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setCurrentModule("interview")}
              className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              🧠{" "}
              {
                APP_TEXT.buttons.startInterview[
                  userLanguage as keyof typeof APP_TEXT.buttons.startInterview
                ]
              }
            </button>

            <button
              onClick={() => setCurrentModule("tts")}
              className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              🎤{" "}
              {
                APP_TEXT.buttons.testVoice[
                  userLanguage as keyof typeof APP_TEXT.buttons.testVoice
                ]
              }
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            {
              APP_TEXT.moduleHelperText[
                userLanguage as keyof typeof APP_TEXT.moduleHelperText
              ]
            }
          </p>
        </div>

        {/* App Statistics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {APP_STATISTICS.map((stat, index) => (
            <div key={index}>
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {userLanguage === "ur" ? stat.labelUrdu : stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-xl max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 text-2xl">⚠️</div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">
                {
                  APP_TEXT.disclaimer.title[
                    userLanguage as keyof typeof APP_TEXT.disclaimer.title
                  ]
                }
              </h4>
              <p className="text-sm text-yellow-800">
                {
                  APP_TEXT.disclaimer.content[
                    userLanguage as keyof typeof APP_TEXT.disclaimer.content
                  ]
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
