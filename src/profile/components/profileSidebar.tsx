// profile/components/profileSidebar.tsx

import React from "react";
import { LogOut, User } from "lucide-react";
import { userData, menuItems } from "../../data/profileData";
import { useTranslation } from "react-i18next";

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userLanguage: string;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeTab,
  setActiveTab,
  userLanguage,
}) => {
  const { t } = useTranslation("profile");
  const isUrdu = userLanguage === "ur";

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.70)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255, 255, 255, 0.88)",
          boxShadow: "0 4px 40px rgba(34, 120, 80, 0.09), 0 1px 6px rgba(34,120,80,0.06)",
        }}
      >
        {/* Profile Header */}
        <div className="p-6" style={{ borderBottom: "1px solid rgba(34,120,80,0.13)" }}>
          <div className="flex flex-col items-center text-center">
            <div
              className="h-20 w-20 rounded-full flex items-center justify-center mb-4 shadow-sm"
              style={{ background: "rgba(45,158,107,0.12)" }}
            >
              <User className="w-10 h-10" style={{ color: "#2d9e6b" }} />
            </div>
            <h3 className="text-xl font-bold leading-tight mb-1" style={{ color: "#1a6645" }}>
              {userData.name}
            </h3>
            <p className="text-sm font-medium" style={{ color: "#4aaa7a" }}>
              {t("sidebar.role")}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                      isActive ? "shadow-md" : "hover:translate-x-1"
                    }`}
                    style={{
                      background: isActive ? "#2d9e6b" : "transparent",
                      color: isActive ? "#ffffff" : "#2d6e4e",
                    }}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{isUrdu ? item.labelUrdu : item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4" style={{ borderTop: "1px solid rgba(34,120,80,0.13)" }}>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm hover:translate-x-1"
            style={{ color: "#d32f2f", background: "rgba(211, 47, 47, 0.05)" }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>{t("sidebar.logout")}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;