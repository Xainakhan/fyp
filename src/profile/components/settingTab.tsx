// profile/components/settingTab.tsx

import React from "react";
import { User, Bell, Lock } from "lucide-react";
import { userData, notificationSettings } from "../../data/profileData";
import { useTranslation } from "react-i18next";

interface SettingsTabProps {
  userLanguage: string;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ userLanguage }) => {
  const { t } = useTranslation("profile");
  const isUrdu = userLanguage === "ur";

  const inputStyle = {
    border: "1px solid rgba(45,158,107,0.3)",
    background: "rgba(255, 255, 255, 0.8)",
    color: "#1a6645",
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.60)",
    border: "1px solid rgba(255, 255, 255, 0.88)",
  };

  const iconWrapStyle = { background: "rgba(45,158,107,0.12)" };
  const primaryBtnStyle = { background: "#2d9e6b", color: "#ffffff" };

  return (
    <div className="p-6 md:p-8">
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#1a6645" }}>
          {t("settings.heading")}
        </h2>
        <p className="text-base" style={{ color: "#4a7a60" }}>
          {t("settings.subheading")}
        </p>
      </div>

      <div className="space-y-6">

        {/* ── Profile Information ── */}
        <div className="p-6 rounded-2xl" style={cardStyle}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg" style={iconWrapStyle}>
              <User className="w-5 h-5" style={{ color: "#2d9e6b" }} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: "#1a6645" }}>
              {t("settings.profileInfo.heading")}
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#2d6e4e" }}>
                {t("settings.profileInfo.fullName")}
              </label>
              <input
                type="text"
                defaultValue={userData.name}
                className="w-full px-4 py-3 rounded-xl transition-colors focus:outline-none"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#2d6e4e" }}>
                {t("settings.profileInfo.email")}
              </label>
              <input
                type="email"
                defaultValue={userData.email}
                className="w-full px-4 py-3 rounded-xl transition-colors focus:outline-none"
                style={inputStyle}
              />
            </div>

            <button
              className="px-6 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-md"
              style={primaryBtnStyle}
            >
              {t("settings.profileInfo.saveChanges")}
            </button>
          </div>
        </div>

        {/* ── Notifications ── */}
        <div className="p-6 rounded-2xl" style={cardStyle}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg" style={iconWrapStyle}>
              <Bell className="w-5 h-5" style={{ color: "#2d9e6b" }} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: "#1a6645" }}>
              {t("settings.notifications.heading")}
            </h3>
          </div>

          <div className="space-y-4">
            {notificationSettings.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ border: "1px solid rgba(45,158,107,0.2)" }}
              >
                <div>
                  <p className="font-medium" style={{ color: "#1a6645" }}>
                    {isUrdu ? setting.titleUrdu : setting.title}
                  </p>
                  <p className="text-sm" style={{ color: "#4a7a60" }}>
                    {isUrdu ? setting.descriptionUrdu : setting.description}
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={setting.enabled}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: "#2d9e6b" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Change Password ── */}
        <div className="p-6 rounded-2xl" style={cardStyle}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg" style={iconWrapStyle}>
              <Lock className="w-5 h-5" style={{ color: "#2d9e6b" }} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: "#1a6645" }}>
              {t("settings.password.heading")}
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#2d6e4e" }}>
                {t("settings.password.current")}
              </label>
              <input
                type="password"
                placeholder={t("settings.password.currentPlaceholder")}
                className="w-full px-4 py-3 rounded-xl transition-colors focus:outline-none"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#2d6e4e" }}>
                {t("settings.password.new")}
              </label>
              <input
                type="password"
                placeholder={t("settings.password.newPlaceholder")}
                className="w-full px-4 py-3 rounded-xl transition-colors focus:outline-none"
                style={inputStyle}
              />
            </div>

            <button
              className="px-6 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-md"
              style={primaryBtnStyle}
            >
              {t("settings.password.update")}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsTab;