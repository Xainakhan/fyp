import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, ChevronDown, User, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import LoginModal from "../auth/Login";
import RegisterModal from "../auth/Register";

interface NavbarProps {
  userLanguage: string;
  setUserLanguage: (l: string) => void;
  voiceModeOn: boolean;
  onToggleVoice: () => void;
}

const SYMPTOM_CHECKER_ITEMS = [
  { label: "Health Triage", path: "/triage" },
  { label: "Health Timeline", path: "/timeline" },
  { label: "Disease Library", path: "/triage" },
];

const NavLink: React.FC<{ label: string; onClick: () => void; active?: boolean }> = ({
  label, onClick, active,
}) => (
  <button
    onClick={onClick}
    style={{
      padding: "6px 14px", borderRadius: 8,
      border: active ? "1px solid rgba(255,255,255,0.25)" : "1px solid transparent",
      background: active ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)",
      color: "white", fontSize: 14, fontWeight: 500, cursor: "pointer",
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

const SymptomCheckerDropdown: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const active = ["/triage", "/timeline"].includes(location.pathname);

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
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", borderRadius: 8,
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
        Symptom Checker
        <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          minWidth: 180, background: "white", borderRadius: 10,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)", overflow: "hidden", zIndex: 200,
        }}>
          {SYMPTOM_CHECKER_ITEMS.map((item, i) => (
            <button key={i} onClick={() => { navigate(item.path); setOpen(false); }}
              style={{
                width: "100%", textAlign: "left", padding: "10px 16px",
                border: "none", background: "white", fontSize: 14, cursor: "pointer",
                borderBottom: i !== SYMPTOM_CHECKER_ITEMS.length - 1 ? "1px solid #eee" : "none",
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

const SymptomAccordion: React.FC<{ navigate: (path: string) => void; closeDrawer: () => void }> = ({
  navigate, closeDrawer,
}) => {
  const [open, setOpen] = useState(false);
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
        Symptom Checker
        <ChevronDown size={16} color="rgba(255,255,255,0.45)"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease", flexShrink: 0 }} />
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
        {SYMPTOM_CHECKER_ITEMS.map((item, i) => (
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

const Navbar: React.FC<NavbarProps> = ({
  userLanguage, setUserLanguage, voiceModeOn, onToggleVoice,
}) => {
  const { i18n } = useTranslation("home");
  const router = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Modal states ──
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // ── Auth state — replace with your real auth context ──
  const [isLoggedIn] = useState(false);

  const navigate = (path: string) => { router(path); setDrawerOpen(false); };

  const handleLanguageToggle = () => {
    const newLang = userLanguage === "en" ? "ur" : "en";
    setUserLanguage(newLang);
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ur" ? "rtl" : "ltr";
    document.body.style.fontFamily = newLang === "ur" ? "'Noto Nastaliq Urdu', serif" : "";
  };

  const closeDrawer = () => setDrawerOpen(false);

  // Helpers to open/switch between modals
  const openLogin    = () => { setDrawerOpen(false); setRegisterOpen(false); setLoginOpen(true); };
  const openRegister = () => { setDrawerOpen(false); setLoginOpen(false); setRegisterOpen(true); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap');

        .sh-desktop { display: flex !important; }
        .sh-mobile  { display: none  !important; }
        @media (max-width: 768px) {
          .sh-desktop { display: none  !important; }
          .sh-mobile  { display: flex  !important; }
        }

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

        .sh-icon-btn {
          border: 1px solid transparent !important;
          transition: border-color 0.2s, background 0.2s !important;
        }
        .sh-icon-btn:hover { border-color: rgba(255,255,255,0.25) !important; }

        @keyframes sh-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.6); }
          50% { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
        }
        .sh-emergency-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #fff; animation: sh-pulse 1.4s ease-in-out infinite;
        }
        @keyframes sh-mic-ring {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
          70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        .sh-mic-active { animation: sh-mic-ring 1.1s ease-out infinite; }
      `}</style>

      {/* ── DESKTOP NAV ── */}
      <nav className="sh-desktop fixed top-0 w-full z-50 border-b border-white/20 backdrop-blur bg-gray-900/60 shadow-lg">
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 20px", height: 64,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <button onClick={() => navigate("/")}
            style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
            <img src="src/assets/logo.png" alt="SehatHub" style={{ height: 49, objectFit: "contain" }} />
          </button>

          <div style={{ display: "flex", gap: 8, marginLeft: 20, flex: 1 }}>
            <NavLink label="Talk Bot" active={location.pathname === "/tts"} onClick={() => navigate("/tts")} />
            <NavLink label="Health Interview" active={location.pathname === "/interview"} onClick={() => navigate("/interview")} />
            <SymptomCheckerDropdown navigate={navigate} />
            <NavLink label="Find Doctor" active={location.pathname === "/doctor"} onClick={() => navigate("/doctor")} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Language */}
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
              <span style={{ color: "white", fontSize: 13, display: "inline-block", width: 52, textAlign: "left" }}>
                {userLanguage === "en" ? "English" : "اردو"}
              </span>
            </div>

            {/* Emergency */}
            <a href="tel:1122" style={{
              background: "#ef4444", color: "white", padding: "5px 14px",
              borderRadius: 20, fontSize: 13, fontWeight: 600, textDecoration: "none",
            }}>
              Emergency
            </a>

            {/* Login — only when logged out */}
            {!isLoggedIn && (
              <button className="sh-icon-btn" onClick={openLogin}
                style={{
                  background: "rgba(255,255,255,0.08)", color: "white",
                  padding: "5px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                }}>
                Login / Sign up
              </button>
            )}

            {/* Mic */}
            <button onClick={onToggleVoice}
              className={`sh-icon-btn${voiceModeOn ? " sh-mic-active" : ""}`}
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: voiceModeOn ? "#ef4444" : "rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}>
              {voiceModeOn ? <MicOff size={14} color="white" /> : <Mic size={14} color="white" />}
            </button>

            {/* Profile — only when logged in */}
            {isLoggedIn && (
              <button onClick={() => navigate("/profile")} className="sh-icon-btn"
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "linear-gradient(135deg,#a78bfa,#7c3aed)",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                }}>
                <User size={14} color="white" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── MOBILE NAV ── */}
      <div className="sh-mobile"
        style={{
          position: "fixed", top: 14, left: "50%", transform: "translateX(-50%)",
          width: "calc(100% - 28px)", maxWidth: 420,
          background: "rgba(14, 26, 18, 0.80)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.10)", borderRadius: 20,
          padding: "9px 12px", alignItems: "center", justifyContent: "space-between",
          zIndex: 100, boxShadow: "0 4px 24px rgba(0,0,0,0.55)",
        }}>
        <button onClick={() => navigate("/")}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <img src="src/assets/logo.png" alt="SehatHub" style={{ height: 36, objectFit: "contain" }} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a href="tel:1122" style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#e03030", color: "white", padding: "7px 14px", borderRadius: 20,
            fontSize: 13, fontWeight: 700, textDecoration: "none",
            boxShadow: "0 2px 10px rgba(224,48,48,0.5)",
          }}>
            <span className="sh-emergency-dot" />
            Emergency
          </a>

          <button onClick={onToggleVoice} className={voiceModeOn ? "sh-mic-active" : ""}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: voiceModeOn ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)",
              border: voiceModeOn ? "1.5px solid #22c55e" : "1.5px solid transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
            }}>
            <Mic size={16} color={voiceModeOn ? "#22c55e" : "rgba(255,255,255,0.7)"} />
          </button>

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

          <button onClick={() => setDrawerOpen(true)}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(255,255,255,0.06)", border: "1.5px solid transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0,
            }}>
            <Menu size={18} color="rgba(255,255,255,0.85)" />
          </button>
        </div>
      </div>

      <div className="sh-mobile" style={{ height: 80, flexShrink: 0, pointerEvents: "none" }} />

      <div className={`sh-overlay${drawerOpen ? " open" : ""}`} onMouseDown={closeDrawer} onTouchStart={closeDrawer} />

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

        <button className="sh-drawer-link" onClick={() => navigate("/tts")}>Talk Bot</button>
        <button className="sh-drawer-link" onClick={() => navigate("/interview")}>Health Interview</button>
        <SymptomAccordion navigate={navigate} closeDrawer={closeDrawer} />
        <button className="sh-drawer-link" onClick={() => navigate("/doctor")}>Find Doctor</button>

        {isLoggedIn && (
          <button className="sh-drawer-link" onClick={() => navigate("/profile")}>
            <User size={16} /> My Profile
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
              Emergency
            </a>

            {!isLoggedIn ? (
              <button onClick={openLogin}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.07)",
                  border: "1px solid transparent", color: "white",
                  padding: "9px 0", borderRadius: 20,
                  fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}>
                Login / Sign up
              </button>
            ) : (
              <button onClick={() => { navigate("/profile"); closeDrawer(); }}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.07)",
                  border: "1px solid transparent", color: "white",
                  padding: "9px 0", borderRadius: 20,
                  fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}>
                My Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={openRegister}
      />
      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={openLogin}
      />
    </>
  );
};

export default Navbar;