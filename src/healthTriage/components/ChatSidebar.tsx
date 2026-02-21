import React from "react";
import { useTranslation } from "react-i18next";
import { Plus, MessageSquare, UserRound, Settings, Wifi, WifiOff } from "lucide-react";

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
  const { t } = useTranslation("healthTriage");

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-0"
      } flex-shrink-0 transition-all duration-300 overflow-hidden flex flex-col bg-gradient-to-b from-[#b8d4e8] via-[#82b4c8] to-[#8dbfaa]`}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/30">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium text-white bg-blue-700/75 hover:bg-blue-800/85 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{t("sidebar.newChat")}</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="text-xs px-3 py-2 font-semibold text-blue-900/60">
          {t("sidebar.recent")}
        </div>

        <button className="w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center space-x-2 text-white font-medium bg-blue-700/65">
          <MessageSquare className="w-4 h-4 text-white/80" />
          <span className="flex-1 truncate">{t("sidebar.symptomAnalysis")}</span>
        </button>

        <button className="w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center space-x-2 text-blue-950/80 hover:bg-white/25 transition-colors">
          <MessageSquare className="w-4 h-4 text-blue-900/50" />
          <span className="flex-1 truncate">{t("sidebar.medicalConsultation")}</span>
        </button>

        <button className="w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center space-x-2 text-blue-950/80 hover:bg-white/25 transition-colors">
          <MessageSquare className="w-4 h-4 text-blue-900/50" />
          <span className="flex-1 truncate">{t("sidebar.healthCheckup")}</span>
        </button>
      </div>

      {/* Footer */}
      <div className="border-t border-white/30 p-3 space-y-1">
        <button
          onClick={onNavigateToDoctor}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-blue-950/80 hover:bg-white/25 transition-colors"
        >
          <UserRound className="w-4 h-4 text-blue-900/60" />
          <span>{t("sidebar.findDoctor")}</span>
        </button>

        <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-blue-950/80 hover:bg-white/25 transition-colors">
          <Settings className="w-4 h-4 text-blue-900/60" />
          <span>{t("sidebar.settings")}</span>
        </button>

        <div className="px-3 py-2 flex items-center space-x-2 text-xs">
          {backendConnected ? (
            <>
              <Wifi className="w-3 h-3 text-green-600" />
              <span className="text-green-700 font-medium">{t("sidebar.connected")}</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-blue-900/40" />
              <span className="text-blue-900/50">{t("sidebar.offlineMode")}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};