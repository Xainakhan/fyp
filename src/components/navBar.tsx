import React, { useState, useRef, useEffect } from "react";
import { Mic, ChevronDown, User, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useVoiceControl } from "../context/VoiceControlContext";
import LoginModal from "../auth/Login";
import RegisterModal from "../auth/Register";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import logoImg from "../assets/logo.png";
interface NavbarProps {
  userLanguage: "ur" | "en";
  setUserLanguage: (lang: "ur" | "en") => void;
}

// ── NavLink ──────────────────────────────────────────────────────────────────
const NavLink: React.FC<{ label: string; onClick: () => void; active?: boolean }> = ({
  label, onClick, active,
}) => (
  <button
    onClick={onClick}
    style={{
      padding: "5px 10px", borderRadius: 8,
      border: active ? "1px solid rgba(255,255,255,0.25)" : "1px solid transparent",
      background: active ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)",
      color: "white", fontSize: 13, fontWeight: 500, cursor: "pointer",
      backdropFilter: "blur(8px)", transition: "all 0.2s", whiteSpace: "nowrap",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.18)";
      e.currentTarget.style.border = "1px solid rgba(255,255,255,0.25)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = active ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)";
      e.currentTarget.style.border = active ? "1px solid rgba(255,255,255,0.25)" : "1px solid transparent";
    }}
  >
    {label}
  </button>
);

// ── SymptomCheckerDropdown ────────────────────────────────────────────────────
const SymptomCheckerDropdown: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { t } = useTranslation("navbar");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const active = ["/triage", "/timeline"].includes(location.pathname);

  const ITEMS = [
    { label: t("symptomCheckerItems.healthTriage"),   path: "/triage" },
    { label: t("symptomCheckerItems.healthTimeline"), path: "/timeline" },
    { label: t("symptomCheckerItems.diseaseLibrary"), path: "/triage" },
  ];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 4,
          padding: "5px 10px", borderRadius: 8,
          border: open || active ? "1px solid rgba(255,255,255,0.25)" : "1px solid transparent",
          background: open || active ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)",
          color: "white", fontSize: 14, fontWeight: 600,
          backdropFilter: "blur(8px)", cursor: "pointer",
          whiteSpace: "nowrap", transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.18)";
          e.currentTarget.style.border = "1px solid rgba(255,255,255,0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = open || active ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)";
          e.currentTarget.style.border = open || active ? "1px solid rgba(255,255,255,0.25)" : "1px solid transparent";
        }}
      >
        {t("links.symptomChecker")}
        <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          minWidth: 180, background: "white", borderRadius: 10,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)", overflow: "hidden", zIndex: 200,
        }}>
          {ITEMS.map((item, i) => (
            <button key={i} onClick={() => { navigate(item.path); setOpen(false); }}
              style={{
                width: "100%", textAlign: "left", padding: "10px 16px",
                border: "none", background: "white", fontSize: 14, cursor: "pointer",
                borderBottom: i !== ITEMS.length - 1 ? "1px solid #eee" : "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── SymptomAccordion (mobile drawer) ─────────────────────────────────────────
const SymptomAccordion: React.FC<{ navigate: (path: string) => void; closeDrawer: () => void }> = ({
  navigate, closeDrawer,
}) => {
  const { t } = useTranslation("navbar");
  const [open, setOpen] = useState(false);

  const ITEMS = [
    { label: t("symptomCheckerItems.healthTriage"),   path: "/triage" },
    { label: t("symptomCheckerItems.healthTimeline"), path: "/timeline" },
    { label: t("symptomCheckerItems.diseaseLibrary"), path: "/triage" },
  ];

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", padding: "12px 14px", borderRadius: 12,
          background: "transparent", border: "none", color: "#fff",
          fontSize: 15, fontWeight: 500, cursor: "pointer",
          fontFamily: "inherit", textAlign: "left", transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        {t("links.symptomChecker")}
        <ChevronDown size={16} color="rgba(255,255,255,0.45)"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease", flexShrink: 0 }} />
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
        {ITEMS.map((item, i) => (
          <button key={i} onClick={() => { navigate(item.path); closeDrawer(); }}
            style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "9px 14px 9px 28px", background: "transparent", border: "none",
              color: "rgba(255,255,255,0.55)", fontSize: 14, cursor: "pointer",
              fontFamily: "inherit", transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ── Navbar ────────────────────────────────────────────────────────────────────
const Navbar: React.FC<NavbarProps> = ({ userLanguage, setUserLanguage }) => {
  const { t, i18n } = useTranslation("navbar");
  const router = useNavigate();
  const location = useLocation();

  // ── Read voice state directly from context — no prop drilling ──
  const { voiceActive, toggleVoice, isListening } = useVoiceControl();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [loginOpen,    setLoginOpen]    = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [forgotOpen,   setForgotOpen]   = useState(false);
  const [resetOpen,    setResetOpen]    = useState(false);
  const [resetPhone,   _setResetPhone]   = useState("");

  const [isLoggedIn] = useState(false);

  const navigate = (path: string) => { router(path); setDrawerOpen(false); };

  const handleLanguageToggle = () => {
    const newLang = userLanguage === "en" ? "ur" : "en";
    setUserLanguage(newLang);
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir  = newLang === "ur" ? "rtl" : "ltr";
    document.body.style.fontFamily = newLang === "ur" ? "'Noto Nastaliq Urdu', serif" : "";
  };

  const closeDrawer  = () => setDrawerOpen(false);
  const openLogin    = () => { setDrawerOpen(false); setRegisterOpen(false); setForgotOpen(false); setResetOpen(false); setLoginOpen(true); };
  const openRegister = () => { setDrawerOpen(false); setLoginOpen(false); setForgotOpen(false); setRegisterOpen(true); };
  const openForgot   = () => { setLoginOpen(false); setRegisterOpen(false); setResetOpen(false); setForgotOpen(true); };
  // const _openReset    = (phone: string) => { setForgotOpen(false); setResetPhone(phone); setResetOpen(true); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap');

        .sh-drawer {
          position: fixed; top: 0; right: 0;
          width: 78%; max-width: 280px; height: 100%;
          background: rgba(8, 16, 12, 0.97);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border-left: 1px solid rgba(255,255,255,0.08);
          z-index: 1000; transform: translateX(110%);
          transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);
          display: flex; flex-direction: column;
          padding: 20px 18px 32px; gap: 4px;
        }
        .sh-drawer.open { transform: translateX(0); }

        .sh-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          z-index: 999; opacity: 0; pointer-events: none; transition: opacity 0.3s;
        }
        .sh-overlay.open { opacity: 1; pointer-events: all; }

        .sh-drawer-link {
          display: flex; align-items: center; gap: 12px;
          width: 100%; padding: 12px 14px; border-radius: 12px;
          background: transparent; border: none; color: #c8dece;
          font-size: 15px; font-weight: 500; cursor: pointer;
          text-align: left; transition: background 0.15s; font-family: inherit;
        }
        .sh-drawer-link:hover { background: rgba(255,255,255,0.06); color: #fff; }

        @keyframes sh-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.6); }
          50% { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
        }
        .sh-emergency-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #fff; animation: sh-pulse 1.4s ease-in-out infinite;
        }
        @keyframes sh-mic-ring {
          0%  { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
          70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
          100%{ box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        .sh-mic-active { animation: sh-mic-ring 1.1s ease-out infinite; }
      `}</style>

      {/* ── PILL NAV ── */}
      <div style={{
        position: "sticky", top: 14,
        width: "calc(100% - 28px)", maxWidth: isMobile ? 420 : 1100,
        margin: "14px auto 0",
        background: "rgba(14, 26, 18, 0.85)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.10)", borderRadius: 20,
        padding: "8px 12px", display: "flex", alignItems: "center",
        justifyContent: "space-between",
        zIndex: 100, boxShadow: "0 4px 24px rgba(0,0,0,0.55)", flexShrink: 0,
      }}>
        {/* Logo */}
        <button onClick={() => navigate("/")}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}>
          <img src={logoImg} alt="SehatHub" style={{ height: 36, objectFit: "contain" }} />
        </button>

        {/* Desktop nav links */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <NavLink label={t("links.talkBot")}        active={location.pathname === "/tts"}       onClick={() => navigate("/tts")} />
            <NavLink label={t("links.healthInterview")} active={location.pathname === "/interview"} onClick={() => navigate("/interview")} />
            <SymptomCheckerDropdown navigate={navigate} />
            <NavLink label={t("links.findDoctor")}     active={location.pathname === "/doctor"}    onClick={() => navigate("/doctor")} />
          </div>
        )}

        {/* Right-side actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {/* Language toggle — desktop */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div onClick={handleLanguageToggle}
                style={{
                  width: 36, height: 18, borderRadius: 10,
                  background: userLanguage === "en" ? "#22c55e" : "#4b5563",
                  position: "relative", cursor: "pointer", flexShrink: 0,
                }}>
                <div style={{
                  position: "absolute", top: 2,
                  left: userLanguage === "en" ? 18 : 2,
                  width: 14, height: 14, borderRadius: "50%",
                  background: "white", transition: "left 0.2s",
                }} />
              </div>
              <span style={{ color: "white", fontSize: 13, display: "inline-block", width: 52 }}>
                {userLanguage === "en" ? "English" : "اردو"}
              </span>
            </div>
          )}

          {/* Emergency */}
          <a href="tel:1122" style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#e03030", color: "white", padding: "7px 14px", borderRadius: 20,
            fontSize: 13, fontWeight: 700, textDecoration: "none",
            boxShadow: "0 2px 10px rgba(224,48,48,0.5)", flexShrink: 0,
          }}>
            <span className="sh-emergency-dot" />
            {t("emergency")}
          </a>

          {/* Login — desktop, logged out */}
          {!isMobile && !isLoggedIn && (
            <button onClick={openLogin}
              style={{
                background: "rgba(255,255,255,0.08)", color: "white",
                padding: "7px 14px", borderRadius: 20, fontSize: 13,
                cursor: "pointer", border: "1px solid transparent", flexShrink: 0,
              }}>
              {t("auth.loginSignup")}
            </button>
          )}

          {/* ── Mic button — calls context toggleVoice directly ── */}
          <button
            onClick={toggleVoice}
            className={voiceActive ? "sh-mic-active" : ""}
            title={voiceActive ? "Stop voice control" : "Start voice control"}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: voiceActive
                ? isListening ? "rgba(34,197,94,0.3)" : "rgba(34,197,94,0.2)"
                : "rgba(255,255,255,0.06)",
              border: voiceActive ? "1.5px solid #22c55e" : "1.5px solid transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
            }}>
            <Mic size={16} color={voiceActive ? "#22c55e" : "rgba(255,255,255,0.7)"} />
          </button>

          {/* Profile — when logged in */}
          {isLoggedIn && (
            <button onClick={() => navigate("/profile")}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg,#a78bfa,#7c3aed)", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
              }}>
              <User size={16} color="white" />
            </button>
          )}

          {/* Hamburger — mobile */}
          {isMobile && (
            <button onClick={() => setDrawerOpen(true)}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: "rgba(255,255,255,0.06)", border: "1.5px solid transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
              }}>
              <Menu size={18} color="rgba(255,255,255,0.85)" />
            </button>
          )}
        </div>
      </div>

      <div style={{ height: 14, flexShrink: 0, pointerEvents: "none" }} />

      <div className={`sh-overlay${drawerOpen ? " open" : ""}`}
        onMouseDown={closeDrawer} onTouchStart={closeDrawer} />

      {/* ── DRAWER ── */}
      <div className={`sh-drawer${drawerOpen ? " open" : ""}`}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          marginBottom: 20, paddingBottom: 16,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}>
          <button onClick={closeDrawer}
            style={{
              width: 30, height: 30, borderRadius: 8,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>
            <X size={15} color="rgba(255,255,255,0.6)" />
          </button>
        </div>

        <button className="sh-drawer-link" onClick={() => navigate("/tts")}>{t("links.talkBot")}</button>
        <button className="sh-drawer-link" onClick={() => navigate("/interview")}>{t("links.healthInterview")}</button>
        <SymptomAccordion navigate={navigate} closeDrawer={closeDrawer} />
        <button className="sh-drawer-link" onClick={() => navigate("/doctor")}>{t("links.findDoctor")}</button>

        {isLoggedIn && (
          <button className="sh-drawer-link" onClick={() => navigate("/profile")}>
            <User size={16} /> {t("auth.myProfile")}
          </button>
        )}

        <div style={{ flex: 1 }} />

        <div style={{ padding: "16px 14px 0", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div onClick={handleLanguageToggle}
              style={{
                width: 40, height: 22, borderRadius: 11,
                background: userLanguage === "en" ? "#22c55e" : "#4b5563",
                position: "relative", cursor: "pointer", flexShrink: 0,
              }}>
              <div style={{
                position: "absolute", top: 3,
                left: userLanguage === "en" ? 21 : 3,
                width: 16, height: 16, borderRadius: "50%",
                background: "white", transition: "left 0.2s",
              }} />
            </div>
            <span style={{ color: "#c8dece", fontSize: 14, display: "inline-block", width: 52 }}>
              {userLanguage === "en" ? "English" : "اردو"}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <a href="tel:1122" style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              background: "#e03030", color: "white", padding: "9px 0", borderRadius: 20,
              fontSize: 13, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 2px 10px rgba(224,48,48,0.4)",
            }}>
              {t("emergency")}
            </a>

            {!isLoggedIn ? (
              <button onClick={openLogin}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.07)",
                  border: "1px solid transparent", color: "white",
                  padding: "9px 0", borderRadius: 20,
                  fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}>
                {t("auth.loginSignup")}
              </button>
            ) : (
              <button onClick={() => { navigate("/profile"); closeDrawer(); }}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.07)",
                  border: "1px solid transparent", color: "white",
                  padding: "9px 0", borderRadius: 20,
                  fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}>
                {t("auth.myProfile")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── MODALS - UPDATED TO USE onNavigate ── */}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onNavigate={(page) => {
          if (page === "register") openRegister();
          if (page === "forgot-password") openForgot();
        }}
      />
      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onNavigate={(page) => {
          if (page === "login") openLogin();
        }}
      />
      <ForgotPassword
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        onNavigate={(page) => {
          if (page === "login") openLogin();
          if (page === "reset-password") {
            setForgotOpen(false);
            setResetOpen(true);
          }
        }}
      />
      <ResetPassword
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onSwitchToLogin={openLogin}
        phoneNumber={resetPhone}
      />
    </>
  );
};

export default Navbar;
export {};