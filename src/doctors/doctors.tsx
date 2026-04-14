import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Stethoscope, ChevronUp, ChevronDown, Filter } from "lucide-react";

import { doctorDatabase } from "./components/DoctorData";
import type { DoctorWithMeta, Coordinates, SortBy, PriceRange } from "./components/types";

import HeroSection        from "./components/DoctorHero";
import DoctorCard         from "./components/DoctorCard";
import DoctorFilters      from "./components/SearchFilter";
import DoctorProfileModal from "./components/DoctorProfilemodal";

import LeadingExperts     from "../homePage/components/LeadingExperts";
import TestimonialSection from "../homePage/components/Testinomials";

const INITIAL_SHOW = 8;

function haversineDistance(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

const DoctorsPage: React.FC = () => {
  const { t, i18n } = useTranslation("doctors");
  const lang = i18n.language as "en" | "ur";
  const isRTL = lang === "ur";

  const [heroCity,       setHeroCity]       = useState("Islamabad");
  const [heroSpecialty,  setHeroSpecialty]  = useState("");
  const [heroQuery,      setHeroQuery]      = useState("");

  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [filterLocation,  setFilterLocation]  = useState("");
  const [sortBy,          setSortBy]          = useState<SortBy>("rating");
  const [priceRange,      setPriceRange]      = useState<PriceRange>({ min: "", max: "" });
  const [filterOnline,    setFilterOnline]    = useState(false);
  const [filterVerified,  setFilterVerified]  = useState(false);

  const [userLocation]    = useState<Coordinates | null>(null);
  const [selectedDoctor,  setSelectedDoctor]  = useState<DoctorWithMeta | null>(null);
  const [showAll,         setShowAll]         = useState(false);

  const allDoctors: DoctorWithMeta[] = Object.entries(doctorDatabase).flatMap(
    ([key, cat]) =>
      cat.doctors.map((d) => ({
        ...d,
        specialty: cat.specialty,
        specialtyKey: key,
        specialtyName: cat.name.en,
        distance: userLocation
          ? Math.round(haversineDistance(userLocation, d.coordinates) * 10) / 10
          : null,
      }))
  );

  const filtered = allDoctors
    .filter((d) => {
      const q = heroQuery.toLowerCase();
      if (
        q &&
        !d.name.toLowerCase().includes(q) &&
        !d.specialty[lang].toLowerCase().includes(q) &&
        !d.hospital.toLowerCase().includes(q)
      ) return false;

      if (heroSpecialty && d.specialtyKey !== heroSpecialty) return false;

      const city = heroCity.toLowerCase();
      if (city && city !== "islamabad" && !d.location.toLowerCase().includes(city)) return false;

      if (filterSpecialty && d.specialtyKey !== filterSpecialty) return false;
      if (filterLocation  && !d.location.toLowerCase().includes(filterLocation)) return false;
      if (priceRange.min  && d.consultationFee < Number(priceRange.min)) return false;
      if (priceRange.max  && d.consultationFee > Number(priceRange.max)) return false;
      if (filterOnline    && !d.onlineConsultation) return false;
      if (filterVerified  && !d.verified) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating")     return b.rating - a.rating;
      if (sortBy === "experience") return parseInt(b.experience) - parseInt(a.experience);
      if (sortBy === "price_low")  return a.consultationFee - b.consultationFee;
      if (sortBy === "price_high") return b.consultationFee - a.consultationFee;
      if (sortBy === "reviews")    return b.reviews - a.reviews;
      if (sortBy === "distance" && a.distance != null && b.distance != null)
        return a.distance - b.distance;
      return 0;
    });

  const handleHeroSearch = () => {
    setShowAll(false);
    document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGetDirections = (doc: DoctorWithMeta) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${doc.coordinates.lat},${doc.coordinates.lng}`,
      "_blank"
    );
  };

  const handleResetFilters = () => {
    setFilterSpecialty("");
    setFilterLocation("");
    setSortBy("rating");
    setPriceRange({ min: "", max: "" });
    setFilterOnline(false);
    setFilterVerified(false);
    setShowAll(false);
  };

  const displayed = showAll ? filtered : filtered.slice(0, INITIAL_SHOW);

  const specialtyLabel =
    filterSpecialty
      ? doctorDatabase[filterSpecialty]?.name[lang]
      : heroSpecialty
        ? doctorDatabase[heroSpecialty]?.name[lang]
        : t("results.allSpecialities");

  // Sidebar
  const sidebar = (
    <div style={{
      width: 190,
      minWidth: 190,
      flexShrink: 0,
      background: "rgba(255,255,255,0.95)",
      borderRadius: 14,
      padding: "16px 14px",
      boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
    }}>
      <DoctorFilters
        selectedSpecialty={filterSpecialty}
        setSelectedSpecialty={(v) => { setFilterSpecialty(v); setShowAll(false); }}
        selectedLocation={filterLocation}
        setSelectedLocation={(v) => { setFilterLocation(v); setShowAll(false); }}
        sortBy={sortBy}
        setSortBy={(v) => { setSortBy(v); setShowAll(false); }}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        onlineOnly={filterOnline}
        setOnlineOnly={(v) => { setFilterOnline(v); setShowAll(false); }}
        verifiedOnly={filterVerified}
        setVerifiedOnly={(v) => { setFilterVerified(v); setShowAll(false); }}
        onApply={handleResetFilters}
        lang={lang}
      />
    </div>
  );

  // Cards grid
  const cards = (
    <div style={{ flex: 1, minWidth: 0 }}>
      {filtered.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.15)",
        }}>
          <Stethoscope size={48} color="#9ca3af" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 18, fontWeight: 600, color: "#1f2937", margin: "0 0 6px" }}>
            {t("results.noResults")}
          </p>
          <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
            {t("results.noResultsHint")}
          </p>
        </div>
      ) : (
        <>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))",
            gap: 14,
            marginBottom: 24,
            alignItems: "stretch",
          }}>
            {displayed.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onViewProfile={(doc) => setSelectedDoctor(doc)}
                onGetDirections={handleGetDirections}
              />
            ))}
          </div>

          {filtered.length > INITIAL_SHOW && (
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => setShowAll((v) => !v)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "white",
                  border: "2px solid #16a34a",
                  color: "#16a34a",
                  borderRadius: 50,
                  padding: "12px 32px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 2px 12px rgba(22,163,74,0.12)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#16a34a";
                  (e.currentTarget as HTMLButtonElement).style.color = "white";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "white";
                  (e.currentTarget as HTMLButtonElement).style.color = "#16a34a";
                }}
              >
                {showAll
                  ? <><ChevronUp size={17} /> {t("card.showLess")}</>
                  : <><ChevronDown size={17} /> {t("card.viewMore")} ({filtered.length - INITIAL_SHOW})</>
                }
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}
    >
      {/* HERO */}
      <HeroSection
        heroCity={heroCity}
        setHeroCity={setHeroCity}
        heroSpecialty={heroSpecialty}
        setHeroSpecialty={setHeroSpecialty}
        heroQuery={heroQuery}
        setHeroQuery={setHeroQuery}
        doctorDatabase={doctorDatabase}
        lang={lang}
        onSearch={handleHeroSearch}
        onSortChange={setSortBy}
        onPriceRangeChange={setPriceRange}
        onLocationChange={(city) => setHeroCity(city || "Islamabad")}
      />

      {/* MAIN CONTENT */}
      <div className="max-w-[1200px] mx-auto px-5 pb-16">

        {/* Results banner */}
        <div
          id="results-section"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
            flexWrap: "wrap",
            // Let dir="rtl" on outer div handle banner direction naturally
          }}
        >
          <Filter size={16} color="#9ca3af" />
          <span style={{ fontSize: 22, fontWeight: 800, color: "white" }}>{filtered.length}</span>
          <span style={{ fontSize: 17, fontWeight: 600, color: "white" }}>
            {t("results.doctorsListed")} |
          </span>
          <span style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#16a34a",
            borderBottom: "2.5px solid #16a34a",
            paddingBottom: 1,
          }}>
            {specialtyLabel}
          </span>
        </div>

        {/*
          GLASS WRAPPER
          ─────────────
          The outer <div dir="rtl"> already sets the RTL context for the
          whole page. A plain flex row here will have its children laid out
          right-to-left automatically:
            • sidebar  → first child in DOM → rendered on the RIGHT  ✓
            • cards    → second child in DOM → rendered on the LEFT   ✓
          No flexDirection override needed — that was causing the conflict.
        */}
        <div
          className="glass-card"
          style={{
            display: "flex",
            alignItems: "flex-start",
            padding: "20px",
            gap: 20,
          }}
        >
          {sidebar}
          {cards}
        </div>

        <LeadingExperts />
        <TestimonialSection />
      </div>

      {selectedDoctor && (
        <DoctorProfileModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onGetDirections={handleGetDirections}
        />
      )}
    </div>
  );
};

export default DoctorsPage;