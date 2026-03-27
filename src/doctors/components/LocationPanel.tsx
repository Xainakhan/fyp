// doctors/components/LocationPanel.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Locate, Map, AlertTriangle, Navigation, Star, DollarSign, Route, Phone, ChevronDown } from "lucide-react";
import type { Coordinates, DoctorWithMeta } from "./types";

interface LocationPanelProps {
  userLocation: Coordinates | null;
  isLoadingLocation: boolean;
  locationError: string;
  showMap: boolean;
  mapCenter: Coordinates;
  nearbyDoctors: DoctorWithMeta[];
  selectedRadius: number;
  onGetLocation: () => void;
  onToggleMap: () => void;
  onRadiusChange: (r: number) => void;
  onViewDoctor: (d: DoctorWithMeta) => void;
  onGetDirections: (d: DoctorWithMeta) => void;
  onViewAll: () => void;
}

const LocationPanel: React.FC<LocationPanelProps> = ({
  userLocation, isLoadingLocation, locationError,
  showMap, mapCenter, nearbyDoctors, selectedRadius,
  onGetLocation, onToggleMap, onRadiusChange,
  onViewDoctor, onGetDirections, onViewAll,
}) => {
  const { t, i18n } = useTranslation("doctors");
  const lang = i18n.language as "en" | "ur";

  return (
    <>
      {/* Location bar */}
      <div style={{
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        border: "1px solid #bbf7d0",
        borderRadius: 20,
        padding: "20px 24px",
        marginBottom: 20,
        display: "flex", flexWrap: "wrap",
        alignItems: "center", justifyContent: "space-between", gap: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "white", border: "1px solid #bbf7d0",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(22,163,74,0.1)",
          }}>
            <MapPin size={20} color="#16a34a" />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#14532d", margin: 0 }}>{t("location.findNearest")}</p>
            <p style={{ fontSize: 12.5, color: "#16a34a", margin: 0 }}>
              {userLocation ? t("location.enabled") : t("location.disabled")}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          {!userLocation && (
            <button onClick={onGetLocation} disabled={isLoadingLocation}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 18px", borderRadius: 10,
                background: "#16a34a", color: "white", border: "none",
                fontSize: 13, fontWeight: 600, cursor: isLoadingLocation ? "not-allowed" : "pointer",
                opacity: isLoadingLocation ? 0.7 : 1, transition: "all 0.15s",
              }}>
              <Locate size={16} />
              {isLoadingLocation ? t("location.getting") : t("location.useMyLocation")}
            </button>
          )}

          <button onClick={onToggleMap}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "9px 18px", borderRadius: 10,
              background: showMap ? "#15803d" : "white",
              color: showMap ? "white" : "#16a34a",
              border: "1.5px solid #bbf7d0",
              fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
            }}>
            <Map size={16} />
            {showMap ? t("location.hideMap") : t("location.showMap")}
          </button>

          {userLocation && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#15803d" }}>{t("location.radius")}:</span>
              <div style={{ position: "relative" }}>
                <select value={selectedRadius}
                  onChange={e => onRadiusChange(parseInt(e.target.value, 10))}
                  style={{
                    padding: "8px 32px 8px 12px",
                    border: "1.5px solid #bbf7d0",
                    borderRadius: 10, fontSize: 13,
                    background: "white", color: "#14532d",
                    fontWeight: 600, outline: "none", cursor: "pointer",
                    appearance: "none", WebkitAppearance: "none",
                  }}>
                  {[5, 10, 15, 25, 50].map(r => <option key={r} value={r}>{r} km</option>)}
                </select>
                <ChevronDown size={13} color="#16a34a" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {locationError && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#fef2f2", border: "1px solid #fecaca",
          borderRadius: 12, padding: "12px 16px", marginBottom: 16,
        }}>
          <AlertTriangle size={16} color="#dc2626" />
          <p style={{ color: "#dc2626", fontSize: 13, margin: 0 }}>{locationError}</p>
        </div>
      )}

      {/* Map */}
      {showMap && (
        <div style={{
          background: "white", borderRadius: 20,
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          overflow: "hidden", marginBottom: 20,
        }}>
          <div style={{
            height: 320,
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            <Map size={48} color="#86efac" style={{ marginBottom: 12 }} />
            <p style={{ color: "#15803d", fontWeight: 600, fontSize: 15, margin: "0 0 4px" }}>{t("map.title")}</p>
            <p style={{ color: "#16a34a", fontSize: 13, margin: "0 0 4px" }}>
              {t("map.center")}: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
            </p>
            {userLocation && (
              <>
                <p style={{ color: "#15803d", fontSize: 12.5, fontWeight: 600, margin: "0 0 4px" }}>
                  {t("map.yourLocation")}: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 18, height: 18, borderRadius: "50%",
                  background: "#16a34a", border: "4px solid white",
                  boxShadow: "0 0 0 6px rgba(22,163,74,0.2)",
                  animation: "pulse 2s ease-in-out infinite",
                }} />
                <style>{`@keyframes pulse { 0%,100%{box-shadow:0 0 0 6px rgba(22,163,74,0.2)} 50%{box-shadow:0 0 0 12px rgba(22,163,74,0.05)} }`}</style>
              </>
            )}
            <p style={{ color: "#86efac", fontSize: 11.5, margin: "8px 0 0" }}>{t("map.note")}</p>
          </div>
        </div>
      )}

      {/* Nearby doctors */}
      {userLocation && nearbyDoctors.length > 0 && (
        <div style={{
          background: "linear-gradient(135deg, #f0fdf4 0%, #f9fafb 100%)",
          border: "1px solid #bbf7d0",
          borderRadius: 20, padding: "24px", marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#14532d", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Navigation size={18} color="#16a34a" />
              {t("location.nearbyCount", { count: nearbyDoctors.length })}
            </h3>
            <span style={{ fontSize: 12.5, color: "#16a34a", fontWeight: 600 }}>
              {t("location.withinRadius", { radius: selectedRadius })}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
            {nearbyDoctors.slice(0, 4).map(doctor => (
              <div key={doctor.id} style={{
                background: "white", borderRadius: 16,
                border: "1px solid #dcfce7",
                padding: "16px",
                boxShadow: "0 2px 8px rgba(22,163,74,0.07)",
                transition: "box-shadow 0.15s",
              }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>{doctor.name}</h4>
                <p style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, margin: "0 0 2px" }}>{doctor.specialty[lang]}</p>
                <p style={{ fontSize: 11.5, color: "#6b7280", margin: "0 0 10px" }}>{doctor.hospital}</p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                  <Chip icon={<Route size={11} color="#16a34a"/>} text={`${doctor.distance} km`} />
                  <Chip icon={<Star size={11} color="#f59e0b"/>} text={String(doctor.rating)} />
                  <Chip icon={<DollarSign size={11} color="#9ca3af"/>} text={`Rs. ${doctor.consultationFee}`} />
                </div>

                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => onViewDoctor(doctor)} style={{
                    flex: 1, background: "#16a34a", color: "white", border: "none",
                    borderRadius: 8, padding: "7px 0", fontSize: 12, fontWeight: 600,
                    cursor: "pointer",
                  }}>
                    {t("card.view")}
                  </button>
                  <a href={`tel:${doctor.phone}`} style={{
                    background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0",
                    borderRadius: 8, padding: "7px 10px",
                    display: "flex", alignItems: "center", textDecoration: "none",
                  }}>
                    <Phone size={14} />
                  </a>
                  <button onClick={() => onGetDirections(doctor)} style={{
                    background: "#f5f3ff", color: "#7c3aed", border: "1px solid #e9d5ff",
                    borderRadius: 8, padding: "7px 10px",
                    display: "flex", alignItems: "center", cursor: "pointer",
                  }}>
                    <Navigation size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {nearbyDoctors.length > 4 && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button onClick={onViewAll} style={{
                background: "none", border: "none",
                color: "#16a34a", fontWeight: 600, fontSize: 13.5,
                cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3,
              }}>
                {t("location.viewAll", { count: nearbyDoctors.length })}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const Chip: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    background: "#f9fafb", border: "1px solid #e5e7eb",
    borderRadius: 8, padding: "3px 8px", fontSize: 11.5, color: "#374151",
  }}>
    {icon} {text}
  </span>
);

export default LocationPanel;