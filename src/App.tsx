import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { VoiceControlProvider } from "./context/VoiceControlContext";
import VoiceOverlay from "./components/VoiceOverlay";

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
import NotFound from "./homePage/NotFound";
import GlobalChatbot from "./components/GlobalChatbot";

import { Login, Register, ForgotPassword, ResetPassword } from "./auth/authExports";

function AppContent() {
  const [userLanguage, setUserLanguage] = useState<"en" | "ur">("en");
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password";

  return (
    // ── VoiceControlProvider wraps everything so all pages + Navbar share the same voice state ──
    <VoiceControlProvider userLanguage={userLanguage}>
      {!isAuthPage ? (
        <BackgroundWrapper>
          {/* Navbar reads voiceActive/toggleVoice directly from context — no prop drilling */}
          <Navbar
            userLanguage={userLanguage}
            setUserLanguage={setUserLanguage}
          />

          {/* Voice overlay shown when mic is active */}
          <VoiceOverlay />

          <main style={{ minHeight: "100vh", paddingTop: "80px" }}>
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    userLanguage={userLanguage}
                    setUserLanguage={setUserLanguage}
                  />
                }
              />
              <Route
                path="/tts"
                element={<VoiceConversation userLanguage={userLanguage} />}
              />
              <Route
                path="/interview"
                element={<HealthInterviewPage userLanguage={userLanguage} />}
              />
              <Route
                path="/triage"
                element={
                  <HealthTriageModule
                    onNavigateToDoctor={() => navigate("/doctor")}
                  />
                }
              />
              <Route path="/doctor"    element={<Doc />} />
              <Route path="/timeline"  element={<HealthTimeline />} />
              <Route path="/profile"   element={<PatientProfile />} />
              <Route
                path="/login"
                element={
                  <Login
                    onNavigate={(page) => {
                      if (page === "register")        navigate("/register");
                      if (page === "forgot-password") navigate("/forgot-password");
                    }}
                  />
                }
              />
              <Route
                path="/register"
                element={
                  <Register
                    onNavigate={(page) => {
                      if (page === "login") navigate("/login");
                    }}
                  />
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <ForgotPassword
                    onNavigate={(page) => {
                      if (page === "login") navigate("/login");
                    }}
                  />
                }
              />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer userLanguage={userLanguage} />
        </BackgroundWrapper>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={
              <Login
                onNavigate={(page) => {
                  if (page === "register")        navigate("/register");
                  if (page === "forgot-password") navigate("/forgot-password");
                }}
              />
            }
          />
          <Route
            path="/register"
            element={
              <Register
                onNavigate={(page) => {
                  if (page === "login") navigate("/login");
                }}
              />
            }
          />
          <Route
            path="/forgot-password"
            element={
              <ForgotPassword
                onNavigate={(page) => {
                  if (page === "login") navigate("/login");
                }}
              />
            }
          />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      )}
      <GlobalChatbot />
    </VoiceControlProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;