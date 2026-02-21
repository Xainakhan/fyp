import React from "react";
import { useTranslation } from "react-i18next";
import { Menu, Stethoscope, Activity, UserRound } from "lucide-react";
import type { Diagnosis } from "../types/Types";

interface ChatTopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  diagnosis: Diagnosis | null;
  onViewReport: () => void;
  onNavigateToDoctor?: () => void;
}

export const ChatTopBar: React.FC<ChatTopBarProps> = ({
  sidebarOpen,
  onToggleSidebar,
  diagnosis,
  onViewReport,
  onNavigateToDoctor,
}) => {
  const { t } = useTranslation("healthTriage");

  return (
    <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">{t("appName")}</h1>
            <p className="text-xs text-gray-500">{t("subtitle")}</p>
          </div>
        </div>
      </div>

      {diagnosis && (
        <div className="flex items-center space-x-2">
          <button
            onClick={onViewReport}
            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center space-x-1.5"
          >
            <Activity className="w-4 h-4" />
            <span>{t("topBar.viewReport")}</span>
          </button>

          <button
            onClick={onNavigateToDoctor}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm flex items-center space-x-1.5"
          >
            <UserRound className="w-4 h-4" />
            <span>{t("topBar.findDoctor")}</span>
          </button>
        </div>
      )}
    </div>
  );
};