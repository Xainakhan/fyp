import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Stethoscope, ChevronUp, ChevronDown } from "lucide-react";

import { doctorDatabase } from "./components/DoctorData";
import type {
  DoctorWithMeta,
  Coordinates,
  SortBy,
  PriceRange,
} from "./components/types";

import HeroSection from "./components/DoctorHero";
import DoctorCard from "./components/DoctorCard";
import DoctorProfileModal from "./components/DoctorProfileModal";

import LeadingExperts from "../homePage/components/LeadingExperts";
import TestimonialSection from "../homePage/components/Testinomials";

const INITIAL_SHOW = 4;

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

  // ── Hero / search state (owned here, passed to HeroSection)
  const [heroCity, setHeroCity]           = useState("Islamabad");
  const [heroSpecialty, setHeroSpecialty] = useState("");
  const [heroQuery, setHeroQuery]         = useState("");

  // ── Filter state (also owned here so filtering happens in this component)
  const [sortBy, setSortBy]         = useState<SortBy>("rating");
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: "", max: "" });

  // ── Location state
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  // ── UI state
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorWithMeta | null>(null);
  const [showAll, setShowAll]               = useState(false);

  // ── Build flat doctor list
  const allDoctors: DoctorWithMeta[] = Object.entries(doctorDatabase).flatMap(
    ([key, cat]) =>
      cat.doctors.map((d) => ({
        ...d,
        specialty: cat.specialty,
        specialtyKey: key,
        distance: userLocation
          ? Math.round(haversineDistance(userLocation, d.coordinates) * 10) / 10
          : null,
      }))
  );

  // ── Filter + sort — all controlled by hero state + filter state
  const filtered = allDoctors
    .filter((d) => {
      // Text search
      const q = heroQuery.toLowerCase();
      if (
        q &&
        !d.name.toLowerCase().includes(q) &&
        !d.specialty[lang].toLowerCase().includes(q) &&
        !d.hospital.toLowerCase().includes(q)
      )
        return false;

      // Specialty
      if (heroSpecialty && d.specialtyKey !== heroSpecialty) return false;

      // City — "Islamabad" is the default/all value
      const city = heroCity.toLowerCase();
      if (city && city !== "islamabad" && !d.location.toLowerCase().includes(city))
        return false;

      // Price range
      if (priceRange.min && d.consultationFee < Number(priceRange.min)) return false;
      if (priceRange.max && d.consultationFee > Number(priceRange.max)) return false;

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

  // ── Called when user hits Search button in HeroSection
  const handleHeroSearch = () => {
    setShowAll(false);
    document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGetDirections = (doc: DoctorWithMeta) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${doc.coordinates.lat},${doc.coordinates.lng}`;
    window.open(url, "_blank");
  };

  const displayed = showAll ? filtered : filtered.slice(0, INITIAL_SHOW);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>

      {/* ── HERO + all filter controls ── */}
      <HeroSection
        // Controlled state from this page
        heroCity={heroCity}
        setHeroCity={setHeroCity}
        heroSpecialty={heroSpecialty}
        setHeroSpecialty={setHeroSpecialty}
        heroQuery={heroQuery}
        setHeroQuery={setHeroQuery}
        doctorDatabase={doctorDatabase}
        lang={lang}
        onSearch={handleHeroSearch}
        // Additional filter callbacks
        onSortChange={setSortBy}
        onPriceRangeChange={setPriceRange}
        onLocationChange={(city) => setHeroCity(city || "Islamabad")}
      />

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-[1200px] mx-auto px-5 pb-16">

        {/* Results Banner */}
        <div
          id="results-section"
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: "white" }}>
              {filtered.length}
            </span>
            <span style={{ fontSize: 17, fontWeight: 600, color: "white" }}>
              Doctors listed in |
            </span>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#16a34a", borderBottom: "2.5px solid #16a34a", paddingBottom: 1 }}>
              {heroSpecialty
                ? doctorDatabase[heroSpecialty]?.name[lang]
                : "All Specialties"}
            </span>
          </div>
        </div>

        {/* Doctor Cards */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 20, border: "1px solid #e5e7eb", marginBottom: 32 }}>
            <Stethoscope size={48} color="#d1d5db" style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 18, fontWeight: 600, color: "#374151", margin: "0 0 6px" }}>
              No doctors found
            </p>
            <p style={{ fontSize: 14, color: "#9ca3af", margin: 0 }}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.45)] p-4 md:p-5">
              {displayed.map((doc, index) => (
                <DoctorCard
                  key={doc.id}
                  doctor={doc}
                  onViewProfile={setSelectedDoctor}
                  onGetDirections={handleGetDirections}
                  isLast={index === displayed.length - 1}
                />
              ))}
            </div>

            {filtered.length > INITIAL_SHOW && (
              <div style={{ textAlign: "center", marginBottom: 36 }}>
                <button
                  onClick={() => setShowAll((v) => !v)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "white", border: "2px solid #16a34a", color: "#16a34a",
                    borderRadius: 50, padding: "13px 36px", fontSize: 14.5, fontWeight: 700,
                    cursor: "pointer", transition: "all 0.2s",
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
                  {showAll ? <><ChevronUp size={18} /> Show Less</> : <><ChevronDown size={18} /> View More Doctors ({filtered.length - INITIAL_SHOW} more)</>}
                </button>
              </div>
            )}
          </>
        )}

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