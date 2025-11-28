// components/HomePage.tsx

import React from "react";
import {
  APP_FEATURES,
  APP_STATISTICS,
  APP_TEXT,
} from "../pages/navbarData";

// Icons just for the main CTA buttons.
// (Feature icons come from APP_FEATURES so you can define those there.)
import { MdPsychology, MdRecordVoiceOver } from "react-icons/md";

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
  const isUrdu = userLanguage === "ur";

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-50 via-blue-50 to-indigo-100 flex">
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">
        {/* Glass card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
          {/* HERO */}
          <section className="px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10 lg:pt-12 pb-6 sm:pb-8 lg:pb-10 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-3 sm:mb-4 leading-tight">
              {APP_TEXT.appName[userLanguage as keyof typeof APP_TEXT.appName]}
            </h1>
            <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-2xl mx-auto">
              {APP_TEXT.tagline[userLanguage as keyof typeof APP_TEXT.tagline]}
            </p>

            {/* Language toggle */}
            <div className="mt-6 sm:mt-8">
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
          </section>

          {/* FEATURES */}
          <section className="px-4 sm:px-8 lg:px-12 pb-6 sm:pb-8 lg:pb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {APP_FEATURES.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentModule(feature.module)}
                  className="bg-white/90 w-full text-left p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer border border-slate-100"
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

          {/* QUICK START CTA */}
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
