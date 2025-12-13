// components/Footer.tsx
import React from "react";
import { APP_MODULES, EMERGENCY_CONTACTS, APP_TEXT } from "../pages/navbarData";

interface FooterProps {
  setCurrentModule: (module: string) => void;
  userLanguage: string;
}

const Footer: React.FC<FooterProps> = ({ setCurrentModule, userLanguage }) => {
  const isUrdu = userLanguage === "ur";

  return (
    <footer className="bg-[#080E2A] text-white mt-20">
      {/* Emergency Alert Banner */}
      <div className="w-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-white text-sm font-medium">
            <span className="h-8 w-8 flex items-center justify-center rounded-full bg-white/20 text-lg shadow">
              🚨
            </span>
            <span className="leading-tight">
              {isUrdu
                ? "سینے میں درد یا شدید سانس کی تکلیف ہو تو فوراً 1122 پر کال کریں۔"
                : "For chest pain or severe breathing problems, call 1122 immediately."}
            </span>
          </div>

          <a
            href="tel:1122"
            className="px-5 py-2 rounded-full bg-white text-red-600 text-xs sm:text-sm font-bold shadow hover:bg-gray-100 transition"
          >
            {isUrdu ? "فوری کال" : "Call Now"} – 1122
          </a>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-5 py-14">
        <div className="grid gap-12 md:grid-cols-3">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-500/20 shadow text-xl">
                🏥
              </span>
              <h3 className="text-xl font-bold">
                {
                  APP_TEXT.footer.about.title[
                    userLanguage as keyof typeof APP_TEXT.footer.about.title
                  ]
                }
              </h3>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              {
                APP_TEXT.footer.about.content[
                  userLanguage as keyof typeof APP_TEXT.footer.about.content
                ]
              }
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-5 text-center">
            <h3 className="text-xl font-bold">
              {
                APP_TEXT.footer.quickLinks[
                  userLanguage as keyof typeof APP_TEXT.footer.quickLinks
                ]
              }
            </h3>

            <div className="flex flex-wrap justify-center gap-3">
              {/* Health Interview */}
              <button
                onClick={() => setCurrentModule("interview")}
                className="px-5 py-2 rounded-full bg-[#0F1A46] text-gray-200 text-sm shadow hover:bg-blue-600 hover:text-white transition-all"
              >
                {
                  APP_MODULES.find((m) => m.id === "interview")?.[
                    isUrdu ? "nameUrdu" : "name"
                  ]
                }
              </button>

              {/* Voice Conversation */}
              <button
                onClick={() => setCurrentModule("tts")}
                className="px-5 py-2 rounded-full bg-[#0F1A46] text-gray-200 text-sm shadow hover:bg-blue-600 hover:text-white transition-all"
              >
                {
                  APP_MODULES.find((m) => m.id === "tts")?.[
                    isUrdu ? "nameUrdu" : "name"
                  ]
                }
              </button>

              {/* Emergency Link */}
              <a
                href="tel:1122"
                className="px-5 py-2 rounded-full bg-red-600/20 border border-red-500/50 text-red-300 text-sm shadow hover:bg-red-600 hover:text-white transition"
              >
                {isUrdu ? "ایمرجنسی - 1122" : "Emergency – 1122"}
              </a>
            </div>

            <p className="text-[11px] text-gray-400 max-w-xs mx-auto leading-relaxed">
              {isUrdu
                ? "یہ پلیٹ فارم صرف معلوماتی معاونت فراہم کرتا ہے۔ شدید علامات میں ہمیشہ ڈاکٹر سے رجوع کریں۔"
                : "These tools support preparation, but serious symptoms must always be seen by a real doctor."}
            </p>
          </div>

          {/* Emergency Contacts */}
          <div className="space-y-4 md:text-right text-center">
            <h3 className="text-xl font-bold">
              {
                APP_TEXT.footer.emergencyContacts[
                  userLanguage as keyof typeof APP_TEXT.footer.emergencyContacts
                ]
              }
            </h3>

            <div className="space-y-3">
              {EMERGENCY_CONTACTS.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center md:justify-end justify-center gap-3 bg-[#0F1A46] px-4 py-3 rounded-xl shadow"
                >
                  <span className="text-lg">{contact.icon}</span>
                  <div className="text-left">
                    <p className="text-gray-200 text-sm font-semibold">
                      {isUrdu ? contact.labelUrdu : contact.label}
                    </p>
                    <a
                      href={`tel:${contact.number}`}
                      className="text-blue-300 hover:text-blue-400 text-sm transition"
                    >
                      {contact.number}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-14 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            {
              APP_TEXT.footer.copyright[
                userLanguage as keyof typeof APP_TEXT.footer.copyright
              ]
            }
          </p>
          <p className="text-[11px] text-gray-500 mt-2">
            {
              APP_TEXT.footer.educationalNote[
                userLanguage as keyof typeof APP_TEXT.footer.educationalNote
              ]
            }
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
