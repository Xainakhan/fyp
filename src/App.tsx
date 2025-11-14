// App.tsx - Final version with separate components
import { useState } from "react";
import "./App.css";
// Import page components
// import TextToSpeechModule from "./pages/TextToSpeech";
// import AdvancedVoiceAnalysisEngine from "./pages/healthcareSystem";
import VoiceModule from "./pages/voiceModule";
import VoiceConversation from "./pages/voiceConversation";
import SymptomAnalysisDoctorFinder from "./pages/healthJournal";
// Import layout components
import Navbar from "./pages/navBar";
import Footer from "./pages/footer";
import HomePage from "./pages/homePage";

// Import data constants
import { APP_TEXT } from "./pages/data";
import HealthTriageModule from "./pages/heathTriage";
import FindDoctorPage from "./pages/findDoctor";

function App() {
  const [currentModule, setCurrentModule] = useState<string>("home");
  const [userLanguage, setUserLanguage] = useState<string>("en");

  const renderCurrentModule = () => {
    switch (currentModule) {
      case "tts":
        return <VoiceConversation />;

      // case "interview":
      // return <AdvancedVoiceAnalysisEngine />;

      case "voice":
        return <VoiceModule userLanguage={userLanguage} />;

      case "triage":
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl mb-4">
              {APP_TEXT.placeholders.triageModule.title}
            </h2>
            <HealthTriageModule />
          </div>
        );

      case "assessment":
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl mb-4">
              {APP_TEXT.placeholders.specialtyModule.title}
            </h2>
            <SymptomAnalysisDoctorFinder />
          </div>
        );

      case "specialty":
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl mb-4">
              {APP_TEXT.placeholders.specialtyModule.title}
            </h2>
            <FindDoctorPage />
          </div>
        );

      default:
        return (
          <HomePage
            userLanguage={userLanguage}
            setUserLanguage={setUserLanguage}
            setCurrentModule={setCurrentModule}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation - Only show when not on home page */}
      {currentModule !== "home" && (
        <Navbar
          currentModule={currentModule}
          setCurrentModule={setCurrentModule}
          userLanguage={userLanguage}
          setUserLanguage={setUserLanguage}
        />
      )}

      {/* Main Content */}
      <main className="min-h-screen">{renderCurrentModule()}</main>

      {/* Footer - Only show when not on home page */}
      {currentModule !== "home" && (
        <Footer
          setCurrentModule={setCurrentModule}
          userLanguage={userLanguage}
        />
      )}
    </div>
  );
}

export default App;
