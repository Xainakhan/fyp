import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navBar";
import Footer from "./components/footer";
import HomePage from "./homePage/homePage";
import VoiceConversation from "./pages/voiceConversation";
import HealthInterviewPage from "./healthInterview/HealthInterview";
import HealthTriageModule from "./healthTriage/RobodocChatbot";
import Doc from "./doctors/doctors";
import HealthTimeline from "./healthTimeline/HealthTimeline";
import PatientProfile from "./profile/patientProfile";
import BackgroundWrapper from "./components/wrapperbg";

function App() {
  const [userLanguage, setUserLanguage] = useState<"en" | "ur">("en");
  const [voiceModeOn, setVoiceModeOn] = useState(false);

  return (
    <Router>
      <BackgroundWrapper>
        {/* ✅ Navbar rendered ONCE here only — never inside page components */}
        <Navbar
          userLanguage={userLanguage}
          setUserLanguage={setUserLanguage}
          voiceModeOn={voiceModeOn}
          onToggleVoice={() => setVoiceModeOn((v) => !v)}
        />

        <main style={{ minHeight: "100vh" }}>
          <Routes>
            <Route path="/" element={<HomePage userLanguage={userLanguage} setUserLanguage={setUserLanguage} />} />
            <Route path="/tts" element={<VoiceConversation userLanguage={userLanguage} />} />
            <Route path="/interview" element={<HealthInterviewPage userLanguage={userLanguage} />} />
            <Route path="/triage" element={<HealthTriageModule onNavigateToDoctor={() => { window.history.pushState({}, "", "/doctor"); }} />} />
            <Route path="/doctor" element={<Doc />} />
            <Route path="/timeline" element={<HealthTimeline />} />
            <Route path="/profile" element={<PatientProfile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer userLanguage={userLanguage} />
      </BackgroundWrapper>
    </Router>
  );
}

export default App;