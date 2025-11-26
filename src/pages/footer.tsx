// components/Footer.tsx
import React from "react";
import { APP_MODULES, EMERGENCY_CONTACTS, APP_TEXT } from "../pages/navbarData";

interface FooterProps {
  setCurrentModule: (module: string) => void;
  userLanguage: string;
}

const Footer: React.FC<FooterProps> = ({ setCurrentModule, userLanguage }) => {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              🏥{" "}
              {
                APP_TEXT.footer.about.title[
                  userLanguage as keyof typeof APP_TEXT.footer.about.title
                ]
              }
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {
                APP_TEXT.footer.about.content[
                  userLanguage as keyof typeof APP_TEXT.footer.about.content
                ]
              }
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {
                APP_TEXT.footer.quickLinks[
                  userLanguage as keyof typeof APP_TEXT.footer.quickLinks
                ]
              }
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setCurrentModule("interview")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {
                    APP_MODULES.find((m) => m.id === "interview")?.[
                      userLanguage === "ur" ? "nameUrdu" : "name"
                    ]
                  }
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentModule("tts")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {
                    APP_MODULES.find((m) => m.id === "tts")?.[
                      userLanguage === "ur" ? "nameUrdu" : "name"
                    ]
                  }
                </button>
              </li>
              <li>
                <a
                  href="tel:1122"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {userLanguage === "ur"
                    ? "ایمرجنسی - 1122"
                    : "Emergency - 1122"}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Emergency */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {
                APP_TEXT.footer.emergencyContacts[
                  userLanguage as keyof typeof APP_TEXT.footer.emergencyContacts
                ]
              }
            </h3>
            <div className="space-y-2 text-sm">
              {EMERGENCY_CONTACTS.map((contact, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span>{contact.icon}</span>
                  <span>
                    {userLanguage === "ur" ? contact.labelUrdu : contact.label}{" "}
                    {contact.number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            {
              APP_TEXT.footer.copyright[
                userLanguage as keyof typeof APP_TEXT.footer.copyright
              ]
            }
          </p>
          <p className="text-xs text-gray-500 mt-2">
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