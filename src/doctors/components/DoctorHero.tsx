import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { MapPin, Search, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import drHero from "../../assets/doctors.png";

type SortBy = "rating" | "experience" | "price_low" | "price_high" | "reviews" | "distance";
type PriceRange = { min: string; max: string };

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
  onSortChange?: (sort: SortBy) => void;
  onPriceRangeChange?: (range: PriceRange) => void;
  onLocationChange?: (location: string) => void;
}

const CITIES = [
  "Islamabad", "Karachi", "Lahore", "Peshawar",
  "Quetta", "Rawalpindi", "Faisalabad", "Multan",
];

// ─────────────────────────────────────────────
// DropdownItem
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
// PortalDropdown
// ─────────────────────────────────────────────
interface PortalDropdownProps {
  anchorRef: React.RefObject<HTMLElement>;
  open: boolean;
  onClose: () => void;
  minWidth?: number;
  maxHeight?: number;
  alignRight?: boolean; // when true, dropdown right-edge aligns with anchor right-edge
  children: React.ReactNode;
}

const PortalDropdown: React.FC<PortalDropdownProps> = ({
  anchorRef, open, onClose, minWidth = 180, maxHeight, alignRight = false, children,
}) => {
  const [pos, setPos] = useState({ top: 0, left: 0, right: 0, width: 0 });

  useEffect(() => {
    if (!open || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
      right: window.innerWidth - rect.right - window.scrollX,
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
        ...(alignRight
          ? { right: pos.right }
          : { left: pos.left }),
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
  const { t, i18n } = useTranslation("doctors");
  const isRTL = i18n.language === "ur";

  const SORT_OPTIONS: { value: SortBy; label: string }[] = [
    { value: "rating",     label: t("hero.sortBy.highestRated") },
    { value: "experience", label: t("hero.sortBy.mostExperienced") },
    { value: "price_low",  label: t("hero.sortBy.priceLow") },
    { value: "price_high", label: t("hero.sortBy.priceHigh") },
    { value: "reviews",    label: t("hero.sortBy.mostReviewed") },
  ];

  const [sortBy, setSortBy]             = useState<SortBy>("rating");
  const [priceRange, setPriceRange]     = useState<PriceRange>({ min: "", max: "" });
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

  const handleCitySelect = (city: string) => {
    setHeroCity(city);
    onLocationChange?.(city.toLowerCase());
    close();
  };

  const handleSpecialtySelect = (key: string) => {
    setHeroSpecialty(key);
    close();
  };

  const handlePriceChange = (field: "min" | "max", value: string) => {
    const updated = { ...priceRange, [field]: sanitizeFee(value) };
    setPriceRange(updated);
    onPriceRangeChange?.(updated);
  };

  const handleSortChange = (value: SortBy) => {
    setSortBy(value);
    onSortChange?.(value);
    close();
  };

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

  const pillBase = `flex items-center gap-1.5 border backdrop-blur-md rounded-lg px-3 py-2 text-[12px] text-white cursor-pointer transition-all whitespace-nowrap`;
  const pillOn   = "bg-green-500/25 border-green-400/40 text-green-200";
  const pillOff  = "bg-white/15 hover:bg-white/22 border-white/25";

  const specialtyEntries = Object.entries(doctorDatabase).map(([key, val]) => ({
    key,
    label: val.name[lang],
    count: val.doctors.length,
  }));

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? t("hero.moreFilters");

  return (
    <div
      className="w-full px-4 md:px-16 pt-1 md:pt-13 pb-10 text-white flex justify-center"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="glass-card relative w-full max-w-[1300px] p-8 md:p-12">
        {/*
          Layout:
          - LTR (English): image LEFT  | content RIGHT  → flex-row
          - RTL (Urdu):    image RIGHT | content LEFT   → flex-row-reverse
          We always render the image first in DOM so it naturally sits on
          the physical left in LTR. In RTL, flex-row-reverse flips it to
          the physical right — which is the reading-start side (correct).
        */}
        <div className={`flex flex-col items-center gap-8 md:gap-4 md:flex-row ${isRTL ? "md:flex-row-reverse" : ""}`}>

          {/* ── DOCTOR IMAGE (always first child → left in LTR, right in RTL) ── */}
          <div className="hidden md:flex items-end justify-center self-stretch shrink-0 w-[300px] pointer-events-none">
            <img
              src={drHero}
              alt="Doctor"
              className="h-full max-h-[400px] w-auto object-contain object-bottom drop-shadow-2xl"
            />
          </div>

          {/* ── RIGHT CONTENT ── */}
          <div className="flex-1 min-w-0">
            {/* Heading */}
            <h1
              className={`text-[28px] sm:text-[32px] md:text-[38px] font-semibold leading-[1.2] text-white mb-3 ${isRTL ? "text-right" : "text-left"}`}
            >
              {t("hero.title")}
              <br className="hidden sm:block" />
              {t("hero.titleLine2")}
            </h1>

            <p
              className={`text-white/75 text-[13px] md:text-[14px] leading-relaxed mb-6 max-w-[420px] ${isRTL ? "text-right mr-0 ml-auto" : "text-left"}`}
            >
              {t("hero.description")}
            </p>

            {/* ── SEARCH BAR ── */}
            {/*
              RTL search bar order (right → left visually):
                [Search btn] [text input] [City dropdown]
              We achieve this by keeping DOM order as:
                City | Input | SearchBtn
              and letting dir="rtl" on the bar reverse the visual flow.
            */}
            <div
              className="flex items-center bg-white rounded-xl mb-5 h-[46px] max-w-[580px]"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {/* CITY trigger – sits at the reading-start edge */}
              <button
                ref={cityRef}
                onClick={() => toggle("city")}
                className={`flex items-center gap-1.5 px-3 h-full cursor-pointer select-none shrink-0 border-e border-gray-200`}
                // border-e = border on the inline-end side → right in LTR, left in RTL
              >
                <MapPin size={14} color="#1D9E75" />
                <span className="text-[13px] font-medium text-[#1D9E75]">
                  {heroCity || t("hero.allCities")}
                </span>
                <ChevronDown
                  size={12}
                  color="#9ca3af"
                  className={`transition-transform duration-200 ${openDropdown === "city" ? "rotate-180" : ""}`}
                />
              </button>

              <PortalDropdown anchorRef={cityRef} open={openDropdown === "city"} onClose={close} minWidth={180}>
                <DropdownItem active={heroCity === "Islamabad" || !heroCity} onClick={() => handleCitySelect("Islamabad")}>
                  {t("hero.allCities")}
                </DropdownItem>
                {CITIES.map((c) => (
                  <DropdownItem key={c} active={heroCity === c} onClick={() => handleCitySelect(c)}>
                    {c}
                  </DropdownItem>
                ))}
              </PortalDropdown>

              {/* TEXT INPUT */}
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") onSearch(); }}
                placeholder={t("hero.searchPlaceholder")}
                dir={isRTL ? "rtl" : "ltr"}
                className="flex-1 h-full border-none outline-none text-[13px] text-gray-600 placeholder-gray-400 px-3 bg-transparent"
              />
              {heroQuery && (
                <button onClick={() => setHeroQuery("")} className="px-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={14} />
                </button>
              )}

              {/* SEARCH BUTTON – sits at the reading-end edge */}
              <button
                onClick={onSearch}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors h-[46px] w-[46px] flex items-center justify-center shrink-0 rounded-e-xl"
                // rounded-e = rounds the inline-end corners → right in LTR, left in RTL
              >
                <Search size={18} color="white" strokeWidth={2.5} />
              </button>
            </div>

            {/* ── FILTER PILLS ── */}
            <div
              className={`flex gap-2 flex-wrap items-center ${isRTL ? "flex-row-reverse justify-end" : ""}`}
            >
              {/* SPECIALITIES pill */}
              <div>
                <button
                  ref={specialtyRef}
                  onClick={() => toggle("specialty")}
                  className={`${pillBase} ${isRTL ? "flex-row-reverse" : ""} ${heroSpecialty ? pillOn : pillOff}`}
                >
                  <MapPin size={13} />
                  {selectedSpecialtyLabel || t("hero.specialities")}
                  <ChevronDown size={11} className={`opacity-70 transition-transform duration-200 ${openDropdown === "specialty" ? "rotate-180" : ""}`} />
                </button>
                <PortalDropdown anchorRef={specialtyRef} open={openDropdown === "specialty"} onClose={close} minWidth={220} maxHeight={210}>
                  <DropdownItem active={!heroSpecialty} onClick={() => handleSpecialtySelect("")}>
                    {t("filters.allSpecialities")}
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
                  className={`${pillBase} ${isRTL ? "flex-row-reverse" : ""} ${priceRange.min || priceRange.max ? pillOn : pillOff}`}
                >
                  {t("hero.priceRange")}
                  {(priceRange.min || priceRange.max) && (
                    <span className="text-green-300 text-[11px] ml-1">
                      {priceRange.min || t("hero.priceFrom")} – {priceRange.max || t("hero.priceInfinity")}
                    </span>
                  )}
                  <ChevronDown size={11} className={`opacity-70 transition-transform duration-200 ${openDropdown === "price" ? "rotate-180" : ""}`} />
                </button>
                <PortalDropdown anchorRef={priceRef} open={openDropdown === "price"} onClose={close} minWidth={240}>
                  <SectionLabel>{t("hero.consultationFeePKR")}</SectionLabel>
                  <div style={{ padding: "4px 16px 16px", display: "flex", alignItems: "center", gap: 8, backgroundColor: "#ffffff" }}>
                    <input
                      placeholder={t("filters.min")}
                      value={priceRange.min}
                      onChange={(e) => handlePriceChange("min", e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, color: "#374151", outline: "none", background: "#f9fafb" }}
                    />
                    <span style={{ color: "#9ca3af", fontSize: 13, flexShrink: 0 }}>–</span>
                    <input
                      placeholder={t("filters.max")}
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
                        {t("hero.clearPriceRange")}
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
                  className={`${pillBase} ${isRTL ? "flex-row-reverse" : ""} ${openDropdown === "more" || sortBy !== "rating" ? pillOn : pillOff}`}
                >
                  <SlidersHorizontal size={13} />
                  {sortBy !== "rating" ? activeSortLabel : t("hero.moreFilters")}
                  <ChevronDown size={11} className={`opacity-70 transition-transform duration-200 ${openDropdown === "more" ? "rotate-180" : ""}`} />
                </button>
                <PortalDropdown anchorRef={moreRef} open={openDropdown === "more"} onClose={close} minWidth={240} alignRight>
                  <SectionLabel>{t("filters.sortBy")}</SectionLabel>
                  <div style={{ padding: "4px 8px 8px", display: "flex", flexDirection: "column", gap: 2, backgroundColor: "#ffffff" }}>
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleSortChange(opt.value)}
                        style={{
                          textAlign: isRTL ? "right" : "left",
                          padding: "8px 12px", borderRadius: 8, fontSize: 13,
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
                    <SectionLabel>{t("filters.availability")}</SectionLabel>
                    <div style={{ padding: "4px 16px 12px", display: "flex", flexDirection: "column", gap: 8, backgroundColor: "#ffffff" }}>
                      {[t("hero.onlineConsultationOnly"), t("hero.availableToday")].map((lbl, i) => (
                        <label
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            cursor: "pointer",
                            fontSize: 13,
                            color: "#374151",
                            flexDirection: isRTL ? "row-reverse" : "row",
                          }}
                        >
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
                  className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""} bg-red-500/20 border border-red-400/30 text-red-300 rounded-lg px-3 py-2 text-[12px] cursor-pointer hover:bg-red-500/30 transition-colors whitespace-nowrap`}
                >
                  <X size={12} />
                  {t("hero.clearAll")} ({activeFiltersCount})
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;