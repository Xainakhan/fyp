// profile/components/overviewTab.tsx

import React from "react";
import { Calendar, Stethoscope } from "lucide-react";
import { stats, upcomingAppointments } from "../../data/profileData";
import { useTranslation } from "react-i18next";

interface OverviewTabProps {
  userLanguage: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ userLanguage }) => {
  const { t } = useTranslation("profile");
  const isUrdu = userLanguage === "ur";

  return (
    <div className="p-6 md:p-8">
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#1a6645" }}>
          {t("overview.heading")}
        </h2>
        <p className="text-base" style={{ color: "#4a7a60" }}>
          {t("overview.subheading")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="p-6 rounded-2xl transition-shadow hover:shadow-md"
              style={{
                background: "rgba(255, 255, 255, 0.60)",
                border: "1px solid rgba(255, 255, 255, 0.88)",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl" style={{ background: "rgba(45,158,107,0.12)" }}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-sm mb-1 font-medium" style={{ color: "#4a7a60" }}>
                  {isUrdu ? stat.labelUrdu : stat.label}
                </p>
                <p className="text-3xl font-bold" style={{ color: "#1a6645" }}>
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4" style={{ color: "#1a6645" }}>
          {t("overview.upcomingAppointments")}
        </h3>
        <div className="space-y-4">
          {upcomingAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-6 rounded-2xl transition-all cursor-pointer hover:shadow-md"
              style={{
                background: "rgba(255, 255, 255, 0.60)",
                border: "1px solid rgba(255, 255, 255, 0.88)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-lg font-semibold" style={{ color: "#1a6645" }}>
                    {isUrdu ? appointment.doctorNameUrdu : appointment.doctorName}
                  </h4>
                  <p className="text-sm" style={{ color: "#4a7a60" }}>
                    {isUrdu ? appointment.specialtyUrdu : appointment.specialty}
                  </p>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background:
                      appointment.status === "Confirmed"
                        ? "rgba(45,158,107,0.15)"
                        : "rgba(255,193,7,0.15)",
                    color:
                      appointment.status === "Confirmed" ? "#2d9e6b" : "#f57c00",
                  }}
                >
                  {isUrdu ? appointment.statusUrdu : appointment.status}
                </span>
              </div>
              <div className="flex gap-4 text-sm" style={{ color: "#4a7a60" }}>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {isUrdu ? appointment.dateUrdu : appointment.date}
                </span>
                <span>{isUrdu ? appointment.timeUrdu : appointment.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-2xl font-bold mb-4" style={{ color: "#1a6645" }}>
          {t("overview.quickActions")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            className="p-6 rounded-2xl text-center transition-all hover:shadow-md"
            style={{
              background: "rgba(255, 255, 255, 0.40)",
              border: "2px dashed rgba(45,158,107,0.3)",
              color: "#2d6e4e",
            }}
          >
            <Calendar className="w-8 h-8 mx-auto mb-2" style={{ color: "#2d9e6b" }} />
            <p className="font-semibold">{t("overview.bookAppointment")}</p>
          </button>
          <button
            className="p-6 rounded-2xl text-center transition-all hover:shadow-md"
            style={{
              background: "rgba(255, 255, 255, 0.40)",
              border: "2px dashed rgba(45,158,107,0.3)",
              color: "#2d6e4e",
            }}
          >
            <Stethoscope className="w-8 h-8 mx-auto mb-2" style={{ color: "#2d9e6b" }} />
            <p className="font-semibold">{t("overview.findDoctors")}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;