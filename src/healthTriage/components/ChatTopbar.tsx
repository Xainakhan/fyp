import React from "react";
import { useTranslation } from "react-i18next";
import { Menu, Activity, UserRound, X } from "lucide-react";
import type { Diagnosis } from "../types/Types";

interface ChatTopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  diagnosis: Diagnosis | null;
  onViewReport: () => void;
  onNavigateToDoctor?: () => void;
  onClose?: () => void;
  userName?: string;
  userAvatar?: string;
}

export const ChatTopBar: React.FC<ChatTopBarProps> = ({
  sidebarOpen:_sidebarOpen,
  onToggleSidebar,
  diagnosis,
  onViewReport,
  onNavigateToDoctor,
  onClose,
  userName,
  userAvatar,
}) => {
  const { t, i18n } = useTranslation("healthTriage");
  const isRTL = i18n.dir() === "rtl";

  const greeting = isRTL ? "مرحباً" : "Hola";
  const displayName = userName || t("defaultUser", "Ali");

  return (
    <div
      className="flex items-center justify-between px-5 py-4 flex-shrink-0"
      style={{
        background: "rgba(10, 22, 18, 0.55)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "0.5px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Left: hamburger + greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
        >
          <Menu className="w-5 h-5 text-white/70" />
        </button>

        {/* User avatar (like screenshot — circular photo top-left area) */}
        <div className="relative">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={displayName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-400/40"
            />
          ) : (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-emerald-400/30"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #6366f1 100%)",
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          {/* Online dot */}
          <span
            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0a1612]"
            style={{ background: "#22c55e" }}
          />
        </div>

        <div>
          <h1 className="text-[17px] font-bold text-white leading-tight">
            {greeting} {displayName},
          </h1>
          <p className="text-[11px] text-emerald-400/80 leading-none mt-0.5">
            {t("subtitle", "AI Health Assistant")}
          </p>
        </div>
      </div>

      {/* Right: action buttons + close */}
      <div className="flex items-center gap-2">
        {diagnosis && (
          <>
            <button
              onClick={onViewReport}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
              style={{
                background: "rgba(16,185,129,0.25)",
                border: "0.5px solid rgba(16,185,129,0.4)",
              }}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{t("topBar.viewReport", "Report")}</span>
            </button>

            <button
              onClick={onNavigateToDoctor}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
              style={{
                background: "rgba(99,102,241,0.25)",
                border: "0.5px solid rgba(99,102,241,0.4)",
              }}
            >
              <UserRound className="w-3.5 h-3.5" />
              <span>{t("topBar.findDoctor", "Doctor")}</span>
            </button>
          </>
        )}

        {/* X close button — like screenshot */}
        <button
          onClick={onClose ?? onToggleSidebar}
          className="p-1.5 rounded-full transition-colors hover:bg-white/10"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>
      </div>
    </div>
  );
};
