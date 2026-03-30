import React from "react";
import { useTranslation } from "react-i18next";
import { User, Navigation } from "lucide-react";
import type { DoctorWithMeta } from "./types";

interface DoctorCardProps {
  doctor: DoctorWithMeta;
  onViewProfile: (doctor: DoctorWithMeta) => void;
  onGetDirections: (doctor: DoctorWithMeta) => void;
  isLast?: boolean;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onViewProfile,
  onGetDirections,
}) => {
  const { i18n } = useTranslation("doctors");
  const lang = i18n.language as "en" | "ur";

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 14,
        border: "1px solid #e5e7eb",
        padding: "16px 14px 14px",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box" as const,
        height: "100%",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "#d1d5db",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
          flexShrink: 0,
        }}
      >
        <User size={30} color="#9ca3af" strokeWidth={1.5} />
      </div>

      {/* Name */}
      <h3
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#111827",
          lineHeight: 1.3,
          margin: "0 0 4px",
        }}
      >
        {doctor.name}
      </h3>

      {/* Specialty + Qualification */}
      <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 1px", lineHeight: 1.4 }}>
        {doctor.specialty[lang]}
      </p>
      <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 6px" }}>
        {doctor.qualification}
      </p>

      {/* Hospital */}
      <p style={{ fontSize: 11, color: "#374151", margin: "0 0 10px", lineHeight: 1.4 }}>
        {doctor.hospital}
      </p>

      {/* Experience + Reviews */}
      <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 12px" }}>
        {doctor.experience} Experience &nbsp; {doctor.reviews} ({doctor.reviews} Reviews)
      </p>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* View Profile + Directions */}
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button
          onClick={() => onViewProfile(doctor)}
          style={{
            flex: 1,
            height: 36,
            borderRadius: 18,
            background: "transparent",
            border: "1.5px solid #d1d5db",
            color: "#111827",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.borderColor = "#3b6ef5")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.borderColor = "#d1d5db")
          }
        >
          View Profile
        </button>

        <button
          onClick={() => onGetDirections(doctor)}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#111827",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "#1d4ed8")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "#111827")
          }
          title="Get Directions"
        >
          <Navigation size={13} color="#fff" />
        </button>
      </div>

      {/* Book Appointment */}
      <button
        style={{
          width: "100%",
          height: 38,
          borderRadius: 18,
          background: "linear-gradient(90deg, #3b6ef5 0%, #5b8eff 100%)",
          border: "none",
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          transition: "opacity 0.15s",
          letterSpacing: 0.2,
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.opacity = "0.88")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
        }
      >
        Book Appointment
      </button>
    </div>
  );
};

export default DoctorCard;