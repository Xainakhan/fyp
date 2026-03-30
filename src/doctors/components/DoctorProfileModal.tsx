import React from "react";
import {
  X,
  User,
  Star,
  Award,
  MapPin,
  Phone,
  CheckCircle,
  Wifi,
  Navigation,
  Calendar,
  Clock,
  Languages,
  Stethoscope,
  DollarSign,
  Route,
} from "lucide-react";
import type { DoctorWithMeta } from "./types";

interface DoctorProfileModalProps {
  doctor: DoctorWithMeta;
  onClose: () => void;
  onGetDirections: (doctor: DoctorWithMeta) => void;
}

const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor,
  onClose,
  onGetDirections,
}) => {
  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const lang = "en";
  const specialtyName =
    typeof doctor.specialty === "object" ? doctor.specialty[lang] : doctor.specialty;

  return (
    // Backdrop
    <div
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        padding: "16px",
      }}
    >
      {/* Modal panel — uses glass-modal style */}
      <div
        style={{
          background: "rgba(18, 28, 22, 0.95)",
          backdropFilter: "blur(25px)",
          WebkitBackdropFilter: "blur(25px)",
          border: "0.5px solid rgba(255, 255, 255, 0.18)",
          borderRadius: 20,
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
          width: "100%",
          maxWidth: 560,
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)")
          }
        >
          <X size={16} />
        </button>

        {/* ── TOP SECTION: Avatar + Name + Core Info ── */}
        <div
          style={{
            padding: "28px 28px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 10,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              border: "2px solid rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 4,
            }}
          >
            <User size={38} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />
          </div>

          {/* Name */}
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
            {doctor.name}
          </h2>

          {/* Qualification */}
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, margin: 0 }}>
            {doctor.qualification}
          </p>

          {/* Hospital */}
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0 }}>
            {doctor.hospital}
          </p>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: 4,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#f59e0b" }}>
              <Star size={14} fill="#f59e0b" />
              <span style={{ fontWeight: 700 }}>{doctor.rating}</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              <Award size={14} />
              {doctor.experience}
            </span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              {doctor.reviews} reviews
            </span>
          </div>

          {/* Fee */}
          <p style={{ fontSize: 18, fontWeight: 700, color: "#16a34a", margin: "4px 0 0" }}>
            Rs. {doctor.consultationFee.toLocaleString()}
          </p>

          {/* Badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {doctor.verified && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "4px 12px",
                  borderRadius: 20,
                  border: "1.5px solid #16a34a",
                  color: "#16a34a",
                }}
              >
                <CheckCircle size={11} /> Verified
              </span>
            )}
            {doctor.onlineConsultation && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "4px 12px",
                  borderRadius: 20,
                  border: "1.5px solid rgba(96,165,250,0.6)",
                  color: "#60a5fa",
                }}
              >
                <Wifi size={11} /> Online Consultation
              </span>
            )}
          </div>
        </div>

        {/* ── DETAILS SECTION ── */}
        <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Specialty */}
          <InfoRow icon={<Stethoscope size={15} />} label="Specialty" value={specialtyName} />

          {/* Location & Address */}
          <InfoRow icon={<MapPin size={15} />} label="Location" value={`${doctor.location}${doctor.address ? ` — ${doctor.address}` : ""}`} />

          {/* Phone */}
          <InfoRow icon={<Phone size={15} />} label="Phone" value={doctor.phone} isLink={`tel:${doctor.phone}`} />

          {/* Distance */}
          {doctor.distance != null && (
            <InfoRow icon={<Route size={15} />} label="Distance" value={`${doctor.distance} km away`} accent="#16a34a" />
          )}

          {/* Fee */}
          <InfoRow icon={<DollarSign size={15} />} label="Consultation Fee" value={`Rs. ${doctor.consultationFee.toLocaleString()}`} accent="#16a34a" />

          {/* Availability */}
          {doctor.availability?.length > 0 && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", marginTop: 1, flexShrink: 0 }}>
                <Calendar size={15} />
              </span>
              <div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" }}>
                  Available Days
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {doctor.availability.map((day) => (
                    <span
                      key={day}
                      style={{
                        fontSize: 12,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: "rgba(22,163,74,0.15)",
                        border: "1px solid rgba(22,163,74,0.3)",
                        color: "#4ade80",
                        fontWeight: 500,
                      }}
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Time Slots */}
          {doctor.timeSlots?.length > 0 && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", marginTop: 1, flexShrink: 0 }}>
                <Clock size={15} />
              </span>
              <div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" }}>
                  Time Slots
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {doctor.timeSlots.map((slot) => (
                    <span key={slot} style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Languages */}
          {doctor.languages?.length > 0 && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", marginTop: 1, flexShrink: 0 }}>
                <Languages size={15} />
              </span>
              <div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" }}>
                  Languages
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {doctor.languages.map((lang) => (
                    <span
                      key={lang}
                      style={{
                        fontSize: 12,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Specializations */}
          {doctor.specializations?.length > 0 && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", marginTop: 1, flexShrink: 0 }}>
                <Stethoscope size={15} />
              </span>
              <div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" }}>
                  Specializations
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {doctor.specializations.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: 12,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: "rgba(59,110,245,0.15)",
                        border: "1px solid rgba(59,110,245,0.3)",
                        color: "#93c5fd",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div
          style={{
            padding: "16px 28px 24px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            gap: 10,
          }}
        >
          {/* Call */}
          <a
            href={`tel:${doctor.phone}`}
            style={{
              flex: 1,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              borderRadius: 12,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.13)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)")
            }
          >
            <Phone size={14} /> Call Now
          </a>

          {/* Directions */}
          <button
            onClick={() => onGetDirections(doctor)}
            style={{
              flex: 1,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              borderRadius: 12,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.13)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)")
            }
          >
            <Navigation size={14} /> Directions
          </button>

          {/* Book */}
          <button
            style={{
              flex: 1.5,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              borderRadius: 12,
              background: "linear-gradient(90deg, #3b6ef5 0%, #5b8eff 100%)",
              border: "none",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              transition: "opacity 0.15s",
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
      </div>
    </div>
  );
};

// Reusable info row
const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  isLink?: string;
  accent?: string;
}> = ({ icon, label, value, isLink, accent }) => (
  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
    <span style={{ color: "rgba(255,255,255,0.4)", marginTop: 1, flexShrink: 0 }}>{icon}</span>
    <div style={{ minWidth: 0 }}>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 2px" }}>
        {label}
      </p>
      {isLink ? (
        <a href={isLink} style={{ color: accent || "rgba(255,255,255,0.85)", fontSize: 13, textDecoration: "none" }}>
          {value}
        </a>
      ) : (
        <p style={{ color: accent || "rgba(255,255,255,0.85)", fontSize: 13, margin: 0, lineHeight: 1.4 }}>
          {value}
        </p>
      )}
    </div>
  </div>
);

export default DoctorProfileModal;