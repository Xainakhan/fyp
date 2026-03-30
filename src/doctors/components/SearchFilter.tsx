import React, { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Star } from "lucide-react";
import { doctorDatabase } from "./DoctorData";
import type { SortBy, PriceRange } from "./types";

interface DoctorFiltersProps {
  selectedSpecialty: string;
  setSelectedSpecialty: (v: string) => void;
  selectedLocation: string;
  setSelectedLocation: (v: string) => void;
  sortBy: SortBy;
  setSortBy: (v: SortBy) => void;
  priceRange: PriceRange;
  setPriceRange: (v: PriceRange) => void;
  onlineOnly: boolean;
  setOnlineOnly: (v: boolean) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (v: boolean) => void;
  onApply: () => void;
  lang: "en" | "ur";
}

interface SectionProps {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Section: React.FC<SectionProps> = ({ label, icon, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: open ? 10 : 0, marginBottom: 8 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 0",
          background: "transparent",
          border: "none",
          color: "#374151",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          textAlign: "left",
          gap: 6,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {icon && <span style={{ color: "#9ca3af" }}>{icon}</span>}
          {label}
        </span>
        {open
          ? <ChevronUp size={14} color="#9ca3af" />
          : <ChevronDown size={14} color="#9ca3af" />}
      </button>
      {open && (
        <div style={{ paddingBottom: 6 }}>
          {children}
        </div>
      )}
    </div>
  );
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  color: "#374151",
  fontSize: 12,
  padding: "7px 10px",
  borderRadius: 8,
  outline: "none",
  appearance: "none" as const,
  cursor: "pointer",
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  width: 0,
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  color: "#374151",
  fontSize: 12,
  padding: "7px 8px",
  borderRadius: 8,
  outline: "none",
};

const DoctorFilters: React.FC<DoctorFiltersProps> = ({
  selectedSpecialty, setSelectedSpecialty,
  selectedLocation, setSelectedLocation,
  sortBy, setSortBy,
  priceRange, setPriceRange,
  onlineOnly, setOnlineOnly,
  verifiedOnly, setVerifiedOnly,
  onApply,
  lang,
}) => {
  const sanitize = (v: string) => v.replace(/[^\d]/g, "").replace(/^0+(?=\d)/, "");

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <p style={{ color: "#111827", fontSize: 14, fontWeight: 700, margin: "0 0 12px 0" }}>
        Apply Filters
      </p>

      {/* Specialities */}
      <Section label="Specialities" icon={<MapPin size={13} />} defaultOpen>
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Specialities</option>
          {Object.keys(doctorDatabase).map((key) => (
            <option key={key} value={key}>
              {doctorDatabase[key].name[lang]}
            </option>
          ))}
        </select>
      </Section>

      {/* Price Range */}
      <Section label="Price Range" icon={<Star size={13} />}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="text"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: sanitize(e.target.value) })}
            style={inputStyle}
          />
          <span style={{ color: "#9ca3af", fontSize: 11 }}>–</span>
          <input
            type="text"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: sanitize(e.target.value) })}
            style={inputStyle}
          />
        </div>
      </Section>

      {/* Location */}
      <Section label="Location" icon={<MapPin size={13} />}>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Cities</option>
          {["lahore", "karachi", "rawalpindi", "islamabad", "faisalabad", "multan", "peshawar"].map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </Section>

      {/* Sort By */}
      <Section label="Sort By" icon={<Star size={13} />}>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          style={selectStyle}
        >
          <option value="rating">Highest Rating</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="experience">Most Experience</option>
          <option value="reviews">Most Reviews</option>
        </select>
      </Section>

      {/* Availability */}
      <Section label="Availability" icon={<MapPin size={13} />}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Online Consultation", val: onlineOnly, set: setOnlineOnly },
            { label: "Verified Only", val: verifiedOnly, set: setVerifiedOnly },
          ].map(({ label, val, set }) => (
            <label
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                color: "#374151",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={val}
                onChange={(e) => set(e.target.checked)}
                style={{ accentColor: "#3b6ef5", width: 13, height: 13 }}
              />
              {label}
            </label>
          ))}
        </div>
      </Section>

      {/* Find Again */}
      <button
        onClick={onApply}
        style={{
          marginTop: 10,
          width: "100%",
          padding: "11px 0",
          background: "#3b6ef5",
          border: "none",
          borderRadius: 10,
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background = "#2d5ee0")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background = "#3b6ef5")
        }
      >
        Find Again
      </button>
    </div>
  );
};

export default DoctorFilters;