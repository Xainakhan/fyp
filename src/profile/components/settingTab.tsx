import React from "react";
import { User, Mail, Bell, Globe, Lock } from "lucide-react";
import { userData, notificationSettings } from "../../data/profileData";

interface SettingsTabProps {
  userLanguage: string;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ userLanguage }) => {
  const isUrdu = userLanguage === "ur";

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h2
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ color: "#1a6645" }}
        >
          {isUrdu ? "ترتیبات" : "Settings"}
        </h2>
        <p className="text-base" style={{ color: "#4a7a60" }}>
          {isUrdu
            ? "اپنے اکاؤنٹ کی ترتیبات کو منظم کریں"
            : "Manage your account settings"}
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <div
          className="p-6 rounded-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.60)",
            border: "1px solid rgba(255, 255, 255, 0.88)",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-lg"
              style={{ background: "rgba(45,158,107,0.12)" }}
            >
              <User className="w-5 h-5" style={{ color: "#2d9e6b" }} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: "#1a6645" }}>
              {isUrdu ? "پروفائل کی معلومات" : "Profile Information"}
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#2d6e4e" }}
              >
                {isUrdu ? "پورا نام" : "Full Name"}
              </label>
              <input
                type="text"
                defaultValue={userData.name}
                className="w-full px-4 py-3 rounded-xl transition-colors focus:outline-none"
                style={{
                  border: "1px solid rgba(45,158,107,0.3)",
                  background: "rgba(255, 255, 255, 0.8)",
                  color: "#1a6645",
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#2d6e4e" }}
              >
                {isUrdu ? "ای میل ایڈریس" : "Email Address"}
              </label>
              <input
                type="email"
                defaultValue={userData.email}
                className="w-full px-4 py-3 rounded-xl transition-colors focus:outline-none"
                style={{
                  border: "1px solid rgba(45,158,107,0.3)",
                  background: "rgba(255, 255, 255, 0.8)",
                  color: "#1a6645",
                }}
              />
            </div>

            <button
              className="px-6 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-md"
              style={{
                background: "#2d9e6b",
                color: "#ffffff",
              }}
            >
              {isUrdu ? "تبدیلیاں محفوظ کریں" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div
          className="p-6 rounded-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.60)",
            border: "1px solid rgba(255, 255, 255, 0.88)",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-lg"
              style={{ background: "rgba(45,158,107,0.12)" }}
            >
              <Bell className="w-5 h-5" style={{ color: "#2d9e6b" }} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: "#1a6645" }}>
              {isUrdu ? "اطلاعات" : "Notifications"}
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
                    {isUrdu
                      ? setting.descriptionUrdu
                      : setting.description}
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

        {/* Change Password */}
        <div
          className="p-6 rounded-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.60)",
            border: "1px solid rgba(255, 255, 255, 0.88)",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-lg"
              style={{ background: "rgba(45,158,107,0.12)" }}
            >
              <Lock className="w-5 h-5" style={{ color: "#2d9e6b" }} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: "#1a6645" }}>
              {isUrdu ? "پاس ورڈ تبدیل کریں" : "Change Password"}
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#2d6e4e" }}
              >
                {isUrdu ? "موجودہ پاس ورڈ" : "Current Password"}
              </label>
              <input
                type="password"
                placeholder={
                  isUrdu ? "موجودہ پاس ورڈ درج کریں" : "Enter current password"
                }
                className="w-full px-4 py-3 rounded-xl transition-colors focus:outline-none"
                style={{
                  border: "1px solid rgba(45,158,107,0.3)",
                  background: "rgba(255, 255, 255, 0.8)",
                  color: "#1a6645",
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#2d6e4e" }}
              >
                {isUrdu ? "نیا پاس ورڈ" : "New Password"}
              </label>
              <input
                type="password"
                placeholder={
                  isUrdu ? "نیا پاس ورڈ درج کریں" : "Enter new password"
                }
                className="w-full px-4 py-3 rounded-xl transition-colors focus:outline-none"
                style={{
                  border: "1px solid rgba(45,158,107,0.3)",
                  background: "rgba(255, 255, 255, 0.8)",
                  color: "#1a6645",
                }}
              />
            </div>

            <button
              className="px-6 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-md"
              style={{
                background: "#2d9e6b",
                color: "#ffffff",
              }}
            >
              {isUrdu ? "پاس ورڈ اپ ڈیٹ کریں" : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;