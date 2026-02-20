import React, { useState } from "react";
import ProfileSidebar from "./components/profileSidebar";
import OverviewTab from "./components/overviewTab";
import AppointmentsTab from "./components/appointmentTab";
import HealthRecordsTab from "./components/healthrecordTab";
import SettingsTab from "./components/settingTab";

interface ProfilePageProps {
  userLanguage?: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userLanguage = "en" }) => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <div
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-8"
      style={{
        background:
          "linear-gradient(135deg, #e6f4ed 0%, #f0f9f4 35%, #e2f2ea 65%, #edf8f3 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <ProfileSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userLanguage={userLanguage}
          />

          {/* Main Content Area */}
          <div className="flex-1">
            <div
              className="rounded-2xl overflow-hidden min-h-[600px]"
              style={{
                background: "rgba(255, 255, 255, 0.70)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                border: "1px solid rgba(255, 255, 255, 0.88)",
                boxShadow:
                  "0 4px 40px rgba(34, 120, 80, 0.09), 0 1px 6px rgba(34,120,80,0.06)",
              }}
            >
              {activeTab === "overview" && <OverviewTab userLanguage={userLanguage} />}
              {activeTab === "appointments" && <AppointmentsTab userLanguage={userLanguage} />}
              {activeTab === "health-records" && <HealthRecordsTab userLanguage={userLanguage} />}
              {activeTab === "prescriptions" && <PrescriptionsTab userLanguage={userLanguage} />}
              {activeTab === "settings" && <SettingsTab userLanguage={userLanguage} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;