// App.tsx
import { useState } from "react";
import "./App.css";
// --- Page modules ---
import VoiceConversation from "./pages/voiceConversation";
import HealthTriageModule from "./pages/heathTriage";
import Doc from "./doctors/doctors";
// --- Layout components ---
import Navbar from "./pages/navBar";
import Footer from "./pages/footer";
import HomePage from "./pages/homePage";
import SymptomCheckerPage from "./pages/symptomChecker";
import HealthInterviewPage from "./healthInterview/HealthInterview";
import HealthTimeline from "./healthTimeline/HealthTimeline";
// --- Profile ---
import PatientProfile from "./profile/patientProfile" ;
// --- Background Wrapper ---
import BackgroundWrapper from "./components/wrapperbg";

type Module =
  | "home"
  | "tts"
  | "interview"
  | "doctor"
  | "triage"
  | "specialty"
  | "symptom"
  | "timeline"
  | "profile";

function App() {
  const [currentModule, setCurrentModule] = useState<Module>("home");
  const [userLanguage, setUserLanguage] = useState<"en" | "ur">("en");

  // Helper to cast string → Module safely
  const navigate = (module: string) => setCurrentModule(module as Module);

  const renderCurrentModule = () => {
    switch (currentModule) {
      case "tts":
        return (
          <VoiceConversation
            userLanguage={userLanguage}
            setCurrentModule={navigate}
          />
        );

      case "doctor":
        return <Doc />;

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

      case "interview":
        return (
          <div className="w-full min-h-screen p-8">
            <HealthInterviewPage userLanguage={userLanguage as "en" | "ur"} />
          </div>
        );

      // ✅ Profile case added
      case "profile":
        return <PatientProfile />;

      case "home":
      default:
        return (
          <HomePage
            userLanguage={userLanguage}
            setUserLanguage={(lang: string) =>
              setUserLanguage(lang as "en" | "ur")
            }
            setCurrentModule={navigate}
          />
        );
    }
  };

  return (
    <BackgroundWrapper overlay={true} overlayIntensity="medium">
      <div className="min-h-screen">
        {/* ✅ Navbar hidden only on home */}
        {currentModule !== "home" && (
          <Navbar
            currentModule={currentModule}
            setCurrentModule={navigate}
            userLanguage={userLanguage}
            setUserLanguage={(lang: string) =>
              setUserLanguage(lang as "en" | "ur")
            }
          />
        )}

        {/* Main content */}
        <main className="w-full">{renderCurrentModule()}</main>

        {/* ✅ Footer hidden only on home */}
        {currentModule !== "home" && (
          <Footer
            setCurrentModule={navigate}
            userLanguage={userLanguage}
          />
        )}
      </div>
    </BackgroundWrapper>
  );
}

export default App;