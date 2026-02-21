import React from "react";
import {
  Plus,
  MessageSquare,
  UserRound,
  Settings,
  Wifi,
  WifiOff,
} from "lucide-react";

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
  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-0"
      } flex-shrink-0 transition-all duration-300 overflow-hidden flex flex-col`}
      style={{
        background:
          "linear-gradient(180deg, #b8d4e8 0%, #9ec4d8 25%, #82b4c8 55%, #8dbfaa 100%)",
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/30">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors text-sm font-medium text-white"
          style={{ background: "rgba(59, 100, 150, 0.75)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(40, 80, 130, 0.85)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(59, 100, 150, 0.75)")
          }
        >
          <Plus className="w-4 h-4" />
          <span>New chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="text-xs px-3 py-2 font-semibold text-blue-900/60">
          Recent
        </div>

        <button
          className="w-full text-left px-3 py-2.5 rounded-lg transition-colors text-sm flex items-center space-x-2 text-white font-medium"
          style={{ background: "rgba(59, 100, 160, 0.65)" }}
        >
          <MessageSquare className="w-4 h-4 text-white/80" />
          <span className="flex-1 truncate">Symptom Analysis</span>
        </button>

        <button className="w-full text-left px-3 py-2.5 rounded-lg transition-colors text-sm flex items-center space-x-2 text-blue-950/80 hover:bg-white/25">
          <MessageSquare className="w-4 h-4 text-blue-900/50" />
          <span className="flex-1 truncate">Medical Consultation</span>
        </button>

        <button className="w-full text-left px-3 py-2.5 rounded-lg transition-colors text-sm flex items-center space-x-2 text-blue-950/80 hover:bg-white/25">
          <MessageSquare className="w-4 h-4 text-blue-900/50" />
          <span className="flex-1 truncate">Health Checkup</span>
        </button>
      </div>

      {/* Footer */}
      <div className="border-t border-white/30 p-3 space-y-1">
        <button
          onClick={onNavigateToDoctor}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm text-blue-950/80 hover:bg-white/25"
        >
          <UserRound className="w-4 h-4 text-blue-900/60" />
          <span>Find Doctor</span>
        </button>

        <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm text-blue-950/80 hover:bg-white/25">
          <Settings className="w-4 h-4 text-blue-900/60" />
          <span>Settings</span>
        </button>

        <div className="px-3 py-2 flex items-center space-x-2 text-xs">
          {backendConnected ? (
            <>
              <Wifi className="w-3 h-3 text-green-600" />
              <span className="text-green-700 font-medium">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-blue-900/40" />
              <span className="text-blue-900/50">Offline Mode</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};