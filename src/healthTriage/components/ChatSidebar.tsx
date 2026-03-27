import React from "react";
import { useTranslation } from "react-i18next";
import { Plus, MessageSquare, UserRound, Settings, Wifi, WifiOff, Globe } from "lucide-react";

interface ChatSidebarProps {
  sidebarOpen: boolean;
  backendConnected: boolean;
  onNewChat: () => void;
  onNavigateToDoctor?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sidebarOpen,
  backendConnected,
  onNewChat,
  onNavigateToDoctor,
}) => {
  const { t, i18n } = useTranslation("healthTriage");

  const toggleLanguage = () => {
    const next = i18n.language.startsWith("ar") ? "en" : "ar";
    i18n.changeLanguage(next);
  };

  return (
    <div
      className={`${sidebarOpen ? "w-60" : "w-0"} flex-shrink-0 transition-all duration-300 overflow-hidden flex flex-col relative z-20`}
      style={{
        background: "rgba(8, 20, 15, 0.78)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRight: "0.5px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {/* RoboDoc brand */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="8" width="16" height="12" rx="3" fill="white" fillOpacity="0.95" />
              <rect x="9" y="2" width="6" height="4" rx="1.5" fill="white" fillOpacity="0.95" />
              <line x1="12" y1="6" x2="12" y2="8" stroke="white" strokeWidth="1.5" />
              <circle cx="9" cy="13" r="1.5" fill="#3b82f6" />
              <circle cx="15" cy="13" r="1.5" fill="#3b82f6" />
              <rect x="9" y="16" width="6" height="1.5" rx="0.75" fill="#3b82f6" />
            </svg>
          </div>
          <span className="text-white font-bold text-sm tracking-wide">RoboDoc</span>
        </div>

        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{
            background: "rgba(16,185,129,0.2)",
            border: "0.5px solid rgba(16,185,129,0.35)",
          }}
        >
          <Plus className="w-4 h-4" />
          <span>{t("sidebar.newChat", "New Chat")}</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1" style={{ scrollbarWidth: "none" }}>
        <p className="text-[10px] px-3 py-2 font-semibold uppercase tracking-widest text-white/25">
          {t("sidebar.recent", "Recent")}
        </p>

        {[
          { label: t("sidebar.symptomAnalysis", "Symptom Analysis"), active: true },
          { label: t("sidebar.medicalConsultation", "Medical Consultation"), active: false },
          { label: t("sidebar.healthCheckup", "Health Checkup"), active: false },
        ].map((item, i) => (
          <button
            key={i}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center gap-2.5 transition-all"
            style={
              item.active
                ? {
                    background: "rgba(16,185,129,0.18)",
                    border: "0.5px solid rgba(16,185,129,0.25)",
                    color: "rgba(255,255,255,0.92)",
                  }
                : {
                    background: "transparent",
                    color: "rgba(255,255,255,0.45)",
                  }
            }
          >
            <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 space-y-0.5" style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
        {/* Language toggle — bilingual support */}
        <button
          onClick={toggleLanguage}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-white/50 hover:text-white/80 hover:bg-white/6"
        >
          <Globe className="w-4 h-4" />
          <span>{i18n.language.startsWith("ar") ? "English" : "العربية"}</span>
        </button>

        <button
          onClick={onNavigateToDoctor}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-white/50 hover:text-white/80"
        >
          <UserRound className="w-4 h-4" />
          <span>{t("sidebar.findDoctor", "Find Doctor")}</span>
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-white/50 hover:text-white/80">
          <Settings className="w-4 h-4" />
          <span>{t("sidebar.settings", "Settings")}</span>
        </button>

        <div className="px-3 py-2 flex items-center gap-2 text-xs">
          {backendConnected ? (
            <>
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400/70">{t("sidebar.connected", "Connected")}</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-white/25" />
              <span className="text-white/25">{t("sidebar.offlineMode", "Offline")}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
