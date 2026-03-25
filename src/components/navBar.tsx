import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, ChevronDown, User, Menu, X, Phone, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  userLanguage: string;
  setUserLanguage: (l: string) => void;
  setCurrentModule: (m: string) => void;
  voiceModeOn: boolean;
  onToggleVoice: () => void;
}

const SYMPTOM_CHECKER_ITEMS = [
  { label: "Health Triage", module: "triage" },
  { label: "Health Timeline", module: "timeline" },
  { label: "Disease Library", module: "triage" },
];

/* ─── Desktop Nav Link ─── */
const NavLink: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "6px 14px",
      borderRadius: 8,
      border: "1px solid rgba(255,255,255,0.25)",
      background: "rgba(255,255,255,0.08)",
      color: "white",
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
      backdropFilter: "blur(8px)",
      transition: "all 0.2s",
      whiteSpace: "nowrap",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
  >
    {label}
  </button>
);

/* ─── Symptom Checker Dropdown (desktop) ─── */
const SymptomCheckerDropdown: React.FC<{ setCurrentModule: (m: string) => void }> = ({
  setCurrentModule,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 14px",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.25)",
          background: open ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
          color: "white",
          fontSize: 14,
          fontWeight: 600,
          backdropFilter: "blur(8px)",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Symptom Checker
        <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            minWidth: 180,
            background: "white",
            borderRadius: 10,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            overflow: "hidden",
            zIndex: 200,
          }}
        >
          {SYMPTOM_CHECKER_ITEMS.map((item, i) => (
            <button
              key={item.module + i}
              onClick={() => { setCurrentModule(item.module); setOpen(false); }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 16px",
                border: "none",
                background: "white",
                fontSize: 14,
                cursor: "pointer",
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

/* ─── Drawer Symptom Checker Accordion ─── */
const SymptomAccordion: React.FC<{
  setCurrentModule: (m: string) => void;
  closeDrawer: () => void;
}> = ({ setCurrentModule, closeDrawer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "12px 14px",
          borderRadius: 12,
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: 15,
          fontWeight: 500,
          cursor: "pointer",
          fontFamily: "inherit",
          textAlign: "left",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        Symptom Checker
        <ChevronDown
          size={16}
          color="rgba(255,255,255,0.45)"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
            flexShrink: 0,
          }}
        />
      </button>

      <div
        style={{
          maxHeight: open ? 200 : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        {SYMPTOM_CHECKER_ITEMS.map((item, i) => (
          <button
            key={i}
            onClick={() => { setCurrentModule(item.module); closeDrawer(); }}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "9px 14px 9px 28px",
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.55)",
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "color 0.15s",
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

/* ════════════════════════════════
   MAIN NAVBAR
════════════════════════════════ */
const Navbar: React.FC<NavbarProps> = ({
  userLanguage,
  setUserLanguage,
  setCurrentModule,
  voiceModeOn,
  onToggleVoice,
}) => {
  const { i18n } = useTranslation("home");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLanguageToggle = () => {
    const newLang = userLanguage === "en" ? "ur" : "en";
    setUserLanguage(newLang);
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ur" ? "rtl" : "ltr";
    document.body.style.fontFamily =
      newLang === "ur" ? "'Noto Nastaliq Urdu', serif" : "";
  };

  const closeDrawer = () => setDrawerOpen(false);

  const navigate = (module: string) => {
    setCurrentModule(module);
    setTimeout(() => setDrawerOpen(false), 10);
  };

  return (
    <>
      {/* ─── Inject responsive styles ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap');

        .sh-desktop { display: flex !important; }
        .sh-mobile  { display: none  !important; }

        @media (max-width: 768px) {
          .sh-desktop { display: none  !important; }
          .sh-mobile  { display: flex  !important; }
        }

        /* Drawer slide-in */
        .sh-drawer {
          position: fixed;
          top: 0; right: 0;
          width: 78%;
          max-width: 280px;
          height: 100%;
          background: rgba(8, 16, 12, 0.97);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-left: 1px solid rgba(255,255,255,0.08);
          z-index: 1000;
          transform: translateX(110%);
          transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);
          display: flex;
          flex-direction: column;
          padding: 20px 18px 32px;
          gap: 4px;
        }
        .sh-drawer.open {
          transform: translateX(0);
        }

        .sh-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .sh-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        .sh-drawer-link {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          background: transparent;
          border: none;
          color: #c8dece;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
          font-family: inherit;
        }
        .sh-drawer-link:hover {
          background: rgba(255,255,255,0.06);
          color: #fff;
        }

        .sh-drawer-section {
          margin-top: 6px;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }

        .sh-drawer-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          padding: 0 14px 8px;
        }

        @keyframes sh-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.6); }
          50%       { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
        }
        .sh-emergency-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #fff;
          animation: sh-pulse 1.4s ease-in-out infinite;
        }

        @keyframes sh-mic-ring {
          0%  { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
          70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
          100%{ box-shadow: 0 0 0 0 rgba(34,197,94,0);   }
        }
        .sh-mic-active {
          animation: sh-mic-ring 1.1s ease-out infinite;
        }
      `}</style>

      {/* ════ DESKTOP NAVBAR ════ */}
      <nav
        className="sh-desktop"
        style={{
          background: "rgba(15, 23, 42, 0.45)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
          position: "sticky",
          top: 0,
          width: "100%",
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 20px",
            height: 64,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <button
            onClick={() => setCurrentModule("home")}
            style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}
          >
            <img src="src/assets/logo.png" alt="SehatHub" style={{ height: 49, objectFit: "contain" }} />
          </button>

          <div style={{ display: "flex", gap: 8, marginLeft: 20, flex: 1 }}>
            <NavLink label="Talk Bot" onClick={() => setCurrentModule("tts")} />
            <NavLink label="Health Interview" onClick={() => setCurrentModule("interview")} />
            <SymptomCheckerDropdown setCurrentModule={setCurrentModule} />
            <NavLink label="Find Doctor" onClick={() => setCurrentModule("doctor")} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                onClick={handleLanguageToggle}
                style={{
                  width: 36, height: 18, borderRadius: 10,
                  background: userLanguage === "en" ? "#22c55e" : "#4b5563",
                  position: "relative", cursor: "pointer",
                }}
              >
                <div style={{
                  position: "absolute", top: 2,
                  left: userLanguage === "en" ? 18 : 2,
                  width: 14, height: 14, borderRadius: "50%",
                  background: "white", transition: "0.2s",
                }} />
              </div>
              <span style={{ color: "white", fontSize: 13 }}>
                {userLanguage === "en" ? "English" : "اردو"}
              </span>
            </div>

            <a href="tel:1122" style={{
              background: "#ef4444", color: "white",
              padding: "5px 14px", borderRadius: 20,
              fontSize: 13, fontWeight: 600, textDecoration: "none",
            }}>
              Emergency
            </a>

            <button style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "white", padding: "5px 14px",
              borderRadius: 20, fontSize: 13, cursor: "pointer",
            }}>
              Login / Sign up
            </button>

            <button
              onClick={onToggleVoice}
              className={voiceModeOn ? "sh-mic-active" : ""}
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: voiceModeOn ? "#ef4444" : "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {voiceModeOn ? <MicOff size={14} color="white" /> : <Mic size={14} color="white" />}
            </button>

            <button
              onClick={() => setCurrentModule("profile")}
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg,#a78bfa,#7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "none", cursor: "pointer",
              }}
            >
              <User size={14} color="white" />
            </button>
          </div>
        </div>
      </nav>

      {/* ════ MOBILE NAVBAR ════ */}
      <div
        className="sh-mobile"
        style={{
          position: "fixed",
          top: 14,
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 28px)",
          maxWidth: 420,
          background: "rgba(14, 26, 18, 0.80)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 20,
          padding: "9px 12px",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 100,
          boxShadow: "0 4px 24px rgba(0,0,0,0.55)",
        }}
      >
        {/* Left: Logo */}
        <button
          onClick={() => setCurrentModule("home")}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "none", border: "none", cursor: "pointer",
            padding: 0,
          }}
        >
          <img
            src="src/assets/logo.png"
            alt="SehatHub"
            style={{ height: 36, objectFit: "contain" }}
          />
        </button>

        {/* Right: Emergency + Mic + Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a
            href="tel:1122"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#e03030",
              color: "white",
              padding: "7px 14px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 2px 10px rgba(224,48,48,0.5)",
              letterSpacing: 0.2,
            }}
          >
            <span
              className="sh-emergency-dot"
              style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", flexShrink: 0 }}
            />
            Emergency
          </a>

          <button
            onClick={onToggleVoice}
            className={voiceModeOn ? "sh-mic-active" : ""}
            title={voiceModeOn ? "Mic On" : "Mic Off"}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: voiceModeOn ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)",
              border: voiceModeOn ? "1.5px solid #22c55e" : "1.5px solid rgba(255,255,255,0.14)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            {voiceModeOn
              ? <Mic size={16} color="#22c55e" />
              : <Mic size={16} color="rgba(255,255,255,0.7)" />
            }
          </button>

          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(255,255,255,0.06)",
              border: "1.5px solid rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0,
            }}
          >
            <Menu size={18} color="rgba(255,255,255,0.85)" />
          </button>
        </div>
      </div>

      {/* ════ MOBILE SPACER — pushes page content below the fixed pill navbar ════ */}
      <div
        className="sh-mobile"
        style={{
          height: 80, // 14px top offset + ~54px navbar height + 12px breathing room
          flexShrink: 0,
          pointerEvents: "none",
        }}
      />

      {/* ════ MOBILE DRAWER OVERLAY ════ */}
      <div
        className={`sh-overlay${drawerOpen ? " open" : ""}`}
        onMouseDown={closeDrawer}
        onTouchStart={closeDrawer}
      />

      {/* ════ MOBILE DRAWER ════ */}
      <div className={`sh-drawer${drawerOpen ? " open" : ""}`}>
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "flex-end",
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}>
          <button
            onClick={closeDrawer}
            style={{
              width: 30, height: 30, borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={15} color="rgba(255,255,255,0.6)" />
          </button>
        </div>

        <button className="sh-drawer-link" onClick={() => navigate("tts")}>
          Talk Bot
        </button>
        <button className="sh-drawer-link" onClick={() => navigate("interview")}>
          Health Interview
        </button>

        <SymptomAccordion setCurrentModule={(m) => navigate(m)} closeDrawer={closeDrawer} />

        <button className="sh-drawer-link" onClick={() => navigate("doctor")}>
          Find Doctor
        </button>

        <div style={{ flex: 1 }} />

        <div style={{ padding: "0 14px 16px", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div
              onClick={handleLanguageToggle}
              style={{
                width: 40, height: 22, borderRadius: 11,
                background: userLanguage === "en" ? "#22c55e" : "#4b5563",
                position: "relative", cursor: "pointer", flexShrink: 0,
              }}
            >
              <div style={{
                position: "absolute", top: 3,
                left: userLanguage === "en" ? 21 : 3,
                width: 16, height: 16, borderRadius: "50%",
                background: "white", transition: "0.2s",
              }} />
            </div>
            <span style={{ color: "#c8dece", fontSize: 14 }}>
              {userLanguage === "en" ? "English" : "اردو"}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <a
              href="tel:1122"
              style={{
                flex: 1,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "#e03030",
                color: "white",
                padding: "9px 0",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 2px 10px rgba(224,48,48,0.4)",
              }}
            >
              Emergency
            </a>
            <button
              onClick={() => navigate("profile")}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "white",
                padding: "9px 0",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Login/ Sign up
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;