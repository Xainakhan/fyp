import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

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

// Auth imports
import { Login, Register, ForgotPassword, ResetPassword } from "./auth/authExports";

function AppContent() {
  const [userLanguage, setUserLanguage] = useState<"en" | "ur">("en");
  const [voiceModeOn, setVoiceModeOn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect auth pages
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password";

  return (
    <>
      {/* Auth pages should NOT use app layout */}
      {!isAuthPage ? (
        <BackgroundWrapper>
          <Navbar
            userLanguage={userLanguage}
            setUserLanguage={setUserLanguage}
            voiceModeOn={voiceModeOn}
            onToggleVoice={() => setVoiceModeOn((v) => !v)}
          />

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
              <Route path="/doctor" element={<Doc />} />
              <Route path="/timeline" element={<HealthTimeline />} />
              <Route path="/profile" element={<PatientProfile />} />

              {/* Auth routes (handled here too for direct URL access) */}
              <Route
                path="/login"
                element={
                  <Login
                    onNavigate={(page) => {
                      if (page === "register") navigate("/register");
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

              {/* 404 — replaces the old <Navigate to="/" /> */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer userLanguage={userLanguage} />
        </BackgroundWrapper>
      ) : (
        // Auth pages only (no Navbar / Footer / BackgroundWrapper)
        <Routes>
          <Route
            path="/login"
            element={
              <Login
                onNavigate={(page) => {
                  if (page === "register") navigate("/register");
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
    </>
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