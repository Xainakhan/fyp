// App.tsx
import { useState } from "react";
import "./App.css";
// --- Page modules ---
import VoiceConversation from "./pages/voiceConversation";
import HealthTriageModule from "./pages/heathTriage";
import Doc from "./pages/doctorsData";
// --- Layout components ---
import Navbar from "./pages/navBar";
import Footer from "./pages/footer";
import HomePage from "./pages/homePage";
import SymptomCheckerPage from "./pages/symptomChecker";
import HealthInterviewPage from "./pages/healthInterview";
import HealthTimeline from "./pages/healthTimeline";

function App() {
  // which screen is active
  const [currentModule, setCurrentModule] = useState<
    | "home"
    | "tts"
    | "interview"
    | "doctor"
    | "triage"
    | "specialty"
    | "symptom"
    | "timeline"
  >("home");

  // app language
  const [userLanguage, setUserLanguage] = useState<"en" | "ur">("en");

  const renderCurrentModule = () => {
    switch (currentModule) {
      case "tts":
        return <VoiceConversation />;

      // 🔵 This is  DOCTOR PAGE
      case "doctor":
        return <Doc />;

      // 🔵 Health triage (chatbot)
      case "triage":
        return (
          <HealthTriageModule
            onNavigateToDoctor={() => setCurrentModule("doctor")}
          />
        );
      case "timeline":
        return <HealthTimeline />;
      case "symptom":
        return <SymptomCheckerPage userLanguage={userLanguage} />;

      // 🔵 Health interview page
      case "interview":
        return (
          <div className="w-full min-h-screen bg-white p-8">
            <HealthInterviewPage userLanguage={userLanguage as "en" | "ur"} />
          </div>
        );

      case "home":
      default:
        return (
          <HomePage
            userLanguage={userLanguage}
            setUserLanguage={(lang: string) =>
              setUserLanguage(lang as "en" | "ur")
            }
            setCurrentModule={(module: string) =>
              setCurrentModule(
                module as
                  | "home"
                  | "tts"
                  | "interview"
                  | "doctor"
                  | "triage"
                  | "specialty"
                  | "symptom"
              )
            }
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar appears on every screen except home */}
      {currentModule !== "home" && (
        <Navbar
          currentModule={currentModule}
          setCurrentModule={(module: string) =>
            setCurrentModule(
              module as
                | "home"
                | "tts"
                | "interview"
                | "doctor"
                | "triage"
                | "specialty"
                | "symptom"
            )
          }
          userLanguage={userLanguage}
          setUserLanguage={(lang: string) =>
            setUserLanguage(lang as "en" | "ur")
          }
        />
      )}

      {/* Main content */}
      <main className="w-full">{renderCurrentModule()}</main>

      {/* Footer appears on every screen except home */}
      {currentModule !== "home" && (
        <Footer
          setCurrentModule={(module: string) =>
            setCurrentModule(
              module as
                | "home"
                | "tts"
                | "interview"
                | "doctor"
                | "triage"
                | "specialty"
                | "symptom"
            )
          }
          userLanguage={userLanguage}
        />
      )}
    </div>
  );
}

export default App;
