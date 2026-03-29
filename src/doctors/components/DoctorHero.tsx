import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { MapPin, Search, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import drHero from "../../assets/doctors.png";

type SortBy = "rating" | "experience" | "price_low" | "price_high" | "reviews" | "distance";
type PriceRange = { min: string; max: string };

// ── Props match exactly what DoctorsPage passes in
interface HeroSectionProps {
  heroCity: string;
  setHeroCity: (city: string) => void;
  heroSpecialty: string;
  setHeroSpecialty: (specialty: string) => void;
  heroQuery: string;
  setHeroQuery: (query: string) => void;
  doctorDatabase: Record<string, { name: { en: string; ur: string }; doctors: any[] }>;
  lang: "en" | "ur";
  onSearch: () => void;
  // Optional extra filter callbacks (wired to DoctorsPage filter state)
  onSortChange?: (sort: SortBy) => void;
  onPriceRangeChange?: (range: PriceRange) => void;
  onLocationChange?: (location: string) => void;
}

const CITIES = [
  "Islamabad", "Karachi", "Lahore", "Peshawar",
  "Quetta", "Rawalpindi", "Faisalabad", "Multan",
];

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "rating",     label: "Highest Rated" },
  { value: "experience", label: "Most Experienced" },
  { value: "price_low",  label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "reviews",    label: "Most Reviewed" },
];

// ─────────────────────────────────────────────
// DropdownItem — pure inline styles, zero Tailwind
// ─────────────────────────────────────────────
const DropdownItem: React.FC<{
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "10px 16px",
        fontSize: 13,
        cursor: "pointer",
        userSelect: "none",
        backgroundColor: active ? "#f0fdf4" : hovered ? "#f9fafb" : "#ffffff",
        color: active ? "#1D9E75" : "#374151",
        fontWeight: active ? 600 : 400,
        transition: "background-color 0.12s",
        backgroundImage: "none",
        backdropFilter: "none",
      }}
    >
      {children}
    </div>
  );
};

// ─────────────────────────────────────────────
// PortalDropdown — renders into document.body
// immune to any ancestor overflow:hidden / backdrop
// ─────────────────────────────────────────────
interface PortalDropdownProps {
  anchorRef: React.RefObject<HTMLElement>;
  open: boolean;
  onClose: () => void;
  minWidth?: number;
  maxHeight?: number;
  children: React.ReactNode;
}

const PortalDropdown: React.FC<PortalDropdownProps> = ({
  anchorRef, open, onClose, minWidth = 180, maxHeight, children,
}) => {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (!open || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target as Node))
        onClose();
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 10);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, [open, anchorRef, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        minWidth: Math.max(minWidth, pos.width),
        maxHeight: maxHeight ?? undefined,
        overflowY: maxHeight ? "auto" : undefined,
        overflow: maxHeight ? "auto" : "hidden",
        zIndex: 999999,
        backgroundColor: "#ffffff",
        background: "#ffffff",
        backgroundImage: "none",
        color: "#374151",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        isolation: "isolate" as React.CSSProperties["isolation"],
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}
    >
      {children}
    </div>,
    document.body
  );
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{
    fontSize: 11, color: "#9ca3af", textTransform: "uppercase",
    fontWeight: 600, letterSpacing: "0.05em",
    padding: "12px 16px 6px", margin: 0, backgroundColor: "#ffffff",
  }}>
    {children}
  </p>
);

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
const HeroSection: React.FC<HeroSectionProps> = ({
  heroCity,
  setHeroCity,
  heroSpecialty,
  setHeroSpecialty,
  heroQuery,
  setHeroQuery,
  doctorDatabase,
  lang,
  onSearch,
  onSortChange,
  onPriceRangeChange,
  onLocationChange,
}) => {
  const [sortBy, setSortBy]           = useState<SortBy>("rating");
  const [priceRange, setPriceRange]   = useState<PriceRange>({ min: "", max: "" });
  const [openDropdown, setOpenDropdown] = useState<"city" | "specialty" | "price" | "more" | null>(null);

  const cityRef      = useRef<HTMLButtonElement>(null);
  const specialtyRef = useRef<HTMLButtonElement>(null);
  const priceRef     = useRef<HTMLButtonElement>(null);
  const moreRef      = useRef<HTMLButtonElement>(null);

  const toggle = (name: "city" | "specialty" | "price" | "more") =>
    setOpenDropdown((v) => (v === name ? null : name));
  const close = useCallback(() => setOpenDropdown(null), []);

  const sanitizeFee = (v: string) =>
    v.replace(/[^\d]/g, "").replace(/^0+(?=\d)/, "");

  // City selection — updates heroCity AND calls optional onLocationChange
  const handleCitySelect = (city: string) => {
    setHeroCity(city);
    onLocationChange?.(city.toLowerCase());
    close();
  };

  // Specialty selection — updates heroSpecialty
  const handleSpecialtySelect = (key: string) => {
    setHeroSpecialty(key);
    close();
  };

  // Price range — local state + optional callback
  const handlePriceChange = (field: "min" | "max", value: string) => {
    const updated = { ...priceRange, [field]: sanitizeFee(value) };
    setPriceRange(updated);
    onPriceRangeChange?.(updated);
  };

  // Sort — local state + optional callback
  const handleSortChange = (value: SortBy) => {
    setSortBy(value);
    onSortChange?.(value);
    close();
  };

  // Clear all filters
  const clearAll = () => {
    setHeroCity("Islamabad");
    setHeroSpecialty("");
    setHeroQuery("");
    setPriceRange({ min: "", max: "" });
    setSortBy("rating");
    onLocationChange?.("");
    onPriceRangeChange?.({ min: "", max: "" });
    onSortChange?.("rating");
  };

  // Count active filters for "Clear all" badge
  const activeFiltersCount = [
    heroSpecialty,
    heroCity !== "Islamabad" ? heroCity : "",
    priceRange.min,
    priceRange.max,
  ].filter(Boolean).length;

  const selectedSpecialtyLabel =
    heroSpecialty && doctorDatabase[heroSpecialty]
      ? doctorDatabase[heroSpecialty].name[lang]
      : "";

  // Pill styles (on dark hero bg)
  const pillBase = "flex items-center gap-1.5 border backdrop-blur-md rounded-lg px-3 py-2 text-[12px] text-white cursor-pointer transition-all whitespace-nowrap";
  const pillOn   = "bg-green-500/25 border-green-400/40 text-green-200";
  const pillOff  = "bg-white/15 hover:bg-white/22 border-white/25";

  // Build specialties list from doctorDatabase
  const specialtyEntries = Object.entries(doctorDatabase).map(([key, val]) => ({
    key,
    label: val.name[lang],
    count: val.doctors.length,
  }));

  return (
    <div className="w-full px-4 md:px-16 pt-1 md:pt-13 pb-10 text-white flex justify-center">
      <div className="glass-card relative w-full max-w-[1300px] p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-4">

          {/* ── LEFT ── */}
          <div className="flex-1 min-w-0">
            <h1 className="text-[28px] sm:text-[32px] md:text-[38px] font-semibold leading-[1.2] text-white mb-3">
              Find the best doctors
              <br className="hidden sm:block" />
              in Pakistan
            </h1>
            <p className="text-white/75 text-[13px] md:text-[14px] leading-relaxed mb-6 max-w-[420px]">
              Track your heart rate, blood pressure, and more with just your
              phone's front camera — anytime, anywhere.
            </p>

            {/* ── SEARCH BAR ── */}
            <div className="flex items-center bg-white rounded-xl mb-5 h-[46px] max-w-[580px]">

              {/* CITY trigger */}
              <button
                ref={cityRef}
                onClick={() => toggle("city")}
                className="flex items-center gap-1.5 px-3 border-r border-gray-200 h-full cursor-pointer select-none shrink-0"
              >
                <MapPin size={14} color="#1D9E75" />
                <span className="text-[13px] font-medium text-[#1D9E75]">
                  {heroCity || "All Cities"}
                </span>
                <ChevronDown size={12} color="#9ca3af"
                  className={`transition-transform duration-200 ${openDropdown === "city" ? "rotate-180" : ""}`} />
              </button>

              <PortalDropdown anchorRef={cityRef} open={openDropdown === "city"} onClose={close} minWidth={180}>
                <DropdownItem active={heroCity === "Islamabad" || !heroCity} onClick={() => handleCitySelect("Islamabad")}>
                  All Cities
                </DropdownItem>
                {CITIES.map((c) => (
                  <DropdownItem key={c} active={heroCity === c} onClick={() => handleCitySelect(c)}>
                    {c}
                  </DropdownItem>
                ))}
              </PortalDropdown>

              {/* TEXT INPUT — bound to heroQuery */}
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") onSearch(); }}
                placeholder="Search by doctor, hospital, or disease..."
                className="flex-1 h-full border-none outline-none text-[13px] text-gray-600 placeholder-gray-400 px-3 bg-transparent"
              />
              {heroQuery && (
                <button onClick={() => setHeroQuery("")} className="px-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={14} />
                </button>
              )}

              {/* SEARCH BUTTON */}
              <button
                onClick={onSearch}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors h-[46px] w-[46px] flex items-center justify-center rounded-r-xl shrink-0"
              >
                <Search size={18} color="white" strokeWidth={2.5} />
              </button>
            </div>

            {/* ── FILTER PILLS ── */}
            <div className="flex gap-2 flex-wrap items-center">

              {/* SPECIALITIES pill */}
              <div>
                <button
                  ref={specialtyRef}
                  onClick={() => toggle("specialty")}
                  className={`${pillBase} ${heroSpecialty ? pillOn : pillOff}`}
                >
                  <MapPin size={13} />
                  {selectedSpecialtyLabel || "Specialities"}
                  <ChevronDown size={11} className={`opacity-70 transition-transform duration-200 ${openDropdown === "specialty" ? "rotate-180" : ""}`} />
                </button>
                <PortalDropdown anchorRef={specialtyRef} open={openDropdown === "specialty"} onClose={close} minWidth={220} maxHeight={210}>
                  <DropdownItem active={!heroSpecialty} onClick={() => handleSpecialtySelect("")}>
                    All Specialities
                  </DropdownItem>
                  {specialtyEntries.map((s) => (
                    <DropdownItem key={s.key} active={heroSpecialty === s.key} onClick={() => handleSpecialtySelect(s.key)}>
                      <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                        <span>{s.label}</span>
                        <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 400 }}>{s.count}</span>
                      </span>
                    </DropdownItem>
                  ))}
                </PortalDropdown>
              </div>

              {/* PRICE RANGE pill */}
              <div>
                <button
                  ref={priceRef}
                  onClick={() => toggle("price")}
                  className={`${pillBase} ${priceRange.min || priceRange.max ? pillOn : pillOff}`}
                >
                  Price Range
                  {(priceRange.min || priceRange.max) && (
                    <span className="text-green-300 text-[11px] ml-1">
                      {priceRange.min || "0"} – {priceRange.max || "∞"}
                    </span>
                  )}
                  <ChevronDown size={11} className={`opacity-70 transition-transform duration-200 ${openDropdown === "price" ? "rotate-180" : ""}`} />
                </button>
                <PortalDropdown anchorRef={priceRef} open={openDropdown === "price"} onClose={close} minWidth={240}>
                  <SectionLabel>Consultation Fee (PKR)</SectionLabel>
                  <div style={{ padding: "4px 16px 16px", display: "flex", alignItems: "center", gap: 8, backgroundColor: "#ffffff" }}>
                    <input
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => handlePriceChange("min", e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, color: "#374151", outline: "none", background: "#f9fafb" }}
                    />
                    <span style={{ color: "#9ca3af", fontSize: 13, flexShrink: 0 }}>–</span>
                    <input
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange("max", e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, color: "#374151", outline: "none", background: "#f9fafb" }}
                    />
                  </div>
                  {(priceRange.min || priceRange.max) && (
                    <div style={{ borderTop: "1px solid #f3f4f6", padding: "8px 16px 12px", backgroundColor: "#ffffff" }}>
                      <button
                        onClick={() => { handlePriceChange("min", ""); handlePriceChange("max", ""); close(); }}
                        style={{ width: "100%", fontSize: 12, color: "#ef4444", cursor: "pointer", background: "none", border: "none", textAlign: "center", fontWeight: 500 }}
                      >
                        Clear price range
                      </button>
                    </div>
                  )}
                </PortalDropdown>
              </div>

              {/* MORE FILTERS pill */}
              <div>
                <button
                  ref={moreRef}
                  onClick={() => toggle("more")}
                  className={`${pillBase} ${openDropdown === "more" || sortBy !== "rating" ? pillOn : pillOff}`}
                >
                  <SlidersHorizontal size={13} />
                  {sortBy !== "rating"
                    ? SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "More Filters"
                    : "More Filters"}
                  <ChevronDown size={11} className={`opacity-70 transition-transform duration-200 ${openDropdown === "more" ? "rotate-180" : ""}`} />
                </button>
                <PortalDropdown anchorRef={moreRef} open={openDropdown === "more"} onClose={close} minWidth={240}>
                  <SectionLabel>Sort By</SectionLabel>
                  <div style={{ padding: "4px 8px 8px", display: "flex", flexDirection: "column", gap: 2, backgroundColor: "#ffffff" }}>
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleSortChange(opt.value)}
                        style={{
                          textAlign: "left", padding: "8px 12px", borderRadius: 8, fontSize: 13,
                          cursor: "pointer", border: "none",
                          backgroundColor: sortBy === opt.value ? "#f0fdf4" : "transparent",
                          color: sortBy === opt.value ? "#16a34a" : "#374151",
                          fontWeight: sortBy === opt.value ? 600 : 400,
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { if (sortBy !== opt.value) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f9fafb"; }}
                        onMouseLeave={(e) => { if (sortBy !== opt.value) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <div style={{ borderTop: "1px solid #f3f4f6", backgroundColor: "#ffffff" }}>
                    <SectionLabel>Availability</SectionLabel>
                    <div style={{ padding: "4px 16px 12px", display: "flex", flexDirection: "column", gap: 8, backgroundColor: "#ffffff" }}>
                      {["Online Consultation Only", "Available Today"].map((lbl, i) => (
                        <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#374151" }}>
                          <input type="checkbox" style={{ accentColor: "#16a34a", width: 14, height: 14, cursor: "pointer" }} />
                          {lbl}
                        </label>
                      ))}
                    </div>
                  </div>
                </PortalDropdown>
              </div>

              {/* CLEAR ALL */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 bg-red-500/20 border border-red-400/30 text-red-300 rounded-lg px-3 py-2 text-[12px] cursor-pointer hover:bg-red-500/30 transition-colors whitespace-nowrap"
                >
                  <X size={12} />
                  Clear all ({activeFiltersCount})
                </button>
              )}
            </div>
          </div>

          {/* ── RIGHT: Doctor Image ── */}
          <div className="hidden md:flex items-end justify-center self-stretch shrink-0 w-[320px] pointer-events-none">
            <img
              src={drHero}
              alt="Doctor"
              className="h-full max-h-[420px] w-auto object-contain object-bottom drop-shadow-2xl"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;