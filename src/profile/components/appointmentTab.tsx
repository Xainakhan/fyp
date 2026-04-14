// profile/components/appointmentTab.tsx

import React from "react";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AppointmentsTabProps {
  userLanguage: string;
}

interface AppointmentDetail {
  id: number;
  doctor: string;
  doctorUrdu: string;
  specialty: string;
  specialtyUrdu: string;
  date: string;
  dateUrdu: string;
  time: string;
  timeUrdu: string;
  type: string;
  location: string;
  locationUrdu: string;
  status: string;
}

const AppointmentsTab: React.FC<AppointmentsTabProps> = ({ userLanguage }) => {
  const { t } = useTranslation("profile");
  const isUrdu = userLanguage === "ur";

  const appointments: AppointmentDetail[] = [
    {
      id: 1,
      doctor: "Dr. Sarah Ahmed",
      doctorUrdu: "ڈاکٹر سارہ احمد",
      specialty: "Cardiologist",
      specialtyUrdu: "دل کے ماہر",
      date: "Feb 18, 2026",
      dateUrdu: "18 فروری، 2026",
      time: "10:00 AM",
      timeUrdu: "صبح 10:00 بجے",
      type: "In-Person",
      location: "SehatHub Clinic, Islamabad",
      locationUrdu: "صحت حب کلینک، اسلام آباد",
      status: "Confirmed",
    },
    {
      id: 2,
      doctor: "Dr. Ali Hassan",
      doctorUrdu: "ڈاکٹر علی حسن",
      specialty: "General Physician",
      specialtyUrdu: "عام معالج",
      date: "Feb 22, 2026",
      dateUrdu: "22 فروری، 2026",
      time: "2:30 PM",
      timeUrdu: "دوپہر 2:30 بجے",
      type: "Video Call",
      location: "Online",
      locationUrdu: "آن لائن",
      status: "Pending",
    },
  ];

  // resolve status label via i18n
  const getStatusLabel = (status: string) =>
    status === "Confirmed"
      ? t("appointments.status.confirmed")
      : t("appointments.status.pending");

  // resolve type label via i18n
  // const _getTypeLabel = (type: string) =>
  //   type === "Video Call"
  //     ? t("appointments.type.videoCall")
  //     : t("appointments.type.inPerson");

  return (
    <div className="p-6 md:p-8">
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#1a6645" }}>
          {t("appointments.heading")}
        </h2>
        <p className="text-base" style={{ color: "#4a7a60" }}>
          {t("appointments.subheading")}
        </p>
      </div>

      <div className="space-y-6">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="rounded-2xl overflow-hidden transition-all hover:shadow-md"
            style={{
              background: "rgba(255, 255, 255, 0.60)",
              border: "1px solid rgba(255, 255, 255, 0.88)",
            }}
          >
            <div className="p-6">
              {/* Header row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1" style={{ color: "#1a6645" }}>
                    {isUrdu ? appointment.doctorUrdu : appointment.doctor}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: "#4a7a60" }}>
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
                  {getStatusLabel(appointment.status)}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4 text-sm" style={{ color: "#2d6e4e" }}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: "#3aaa72" }} />
                  <span>{isUrdu ? appointment.dateUrdu : appointment.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: "#3aaa72" }} />
                  <span>{isUrdu ? appointment.timeUrdu : appointment.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  {appointment.type === "Video Call" ? (
                    <Video className="w-4 h-4" style={{ color: "#3aaa72" }} />
                  ) : (
                    <MapPin className="w-4 h-4" style={{ color: "#3aaa72" }} />
                  )}
                  <span>{isUrdu ? appointment.locationUrdu : appointment.location}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-md"
                  style={{ background: "#2d9e6b", color: "#ffffff" }}
                >
                  {t("appointments.viewDetails")}
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: "rgba(211, 47, 47, 0.1)", color: "#d32f2f" }}
                >
                  {t("appointments.cancel")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsTab;