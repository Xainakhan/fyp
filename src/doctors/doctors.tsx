import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Stethoscope, ChevronUp, ChevronDown, Filter } from "lucide-react";

import { doctorDatabase } from "./components/DoctorData";
import type {
  DoctorWithMeta,
  Coordinates,
  SortBy,
  PriceRange,
} from "./components/types";

import HeroSection from "./components/DoctorHero";
import DoctorCard from "./components/DoctorCard";
import DoctorFilters from "./components/SearchFilter";
import DoctorProfileModal from "./components/DoctorProfileModal";

import LeadingExperts from "../homePage/components/LeadingExperts";
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
  const { i18n } = useTranslation("doctors");
  const lang = i18n.language as "en" | "ur";

  // Hero / search state
  const [heroCity, setHeroCity]           = useState("Islamabad");
  const [heroSpecialty, setHeroSpecialty] = useState("");
  const [heroQuery, setHeroQuery]         = useState("");

  // Sidebar filter state (pending — applied on "Find Again")
  const [pendingSpecialty, setPendingSpecialty] = useState("");
  const [pendingLocation, setPendingLocation]   = useState("");
  const [pendingSortBy, setPendingSortBy]       = useState<SortBy>("rating");
  const [pendingPrice, setPendingPrice]         = useState<PriceRange>({ min: "", max: "" });
  const [pendingOnline, setPendingOnline]       = useState(false);
  const [pendingVerified, setPendingVerified]   = useState(false);

  // Applied filter state (committed on Find Again)
  const [sortBy, setSortBy]         = useState<SortBy>("rating");
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: "", max: "" });
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [filterLocation, setFilterLocation]   = useState("");
  const [filterOnline, setFilterOnline]       = useState(false);
  const [filterVerified, setFilterVerified]   = useState(false);

  // Location state
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  // UI state
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorWithMeta | null>(null);
  const [showAll, setShowAll]               = useState(false);

  // Commit pending filters
  const handleApplyFilters = () => {
    setSortBy(pendingSortBy);
    setPriceRange(pendingPrice);
    setFilterSpecialty(pendingSpecialty);
    setFilterLocation(pendingLocation);
    setFilterOnline(pendingOnline);
    setFilterVerified(pendingVerified);
    setShowAll(false);
  };

  // Build flat list with distance
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

  // Combined filter: hero search + sidebar filters
  const filtered = allDoctors
    .filter((d) => {
      // Hero text search
      const q = heroQuery.toLowerCase();
      if (
        q &&
        !d.name.toLowerCase().includes(q) &&
        !d.specialty[lang].toLowerCase().includes(q) &&
        !d.hospital.toLowerCase().includes(q)
      )
        return false;

      // Hero specialty
      if (heroSpecialty && d.specialtyKey !== heroSpecialty) return false;

      // Hero city
      const city = heroCity.toLowerCase();
      if (city && city !== "islamabad" && !d.location.toLowerCase().includes(city))
        return false;

      // Sidebar specialty
      if (filterSpecialty && d.specialtyKey !== filterSpecialty) return false;

      // Sidebar location
      if (filterLocation && !d.location.toLowerCase().includes(filterLocation)) return false;

      // Price range
      if (priceRange.min && d.consultationFee < Number(priceRange.min)) return false;
      if (priceRange.max && d.consultationFee > Number(priceRange.max)) return false;

      // Online / verified
      if (filterOnline && !d.onlineConsultation) return false;
      if (filterVerified && !d.verified) return false;

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
    const url = `https://www.google.com/maps/dir/?api=1&destination=${doc.coordinates.lat},${doc.coordinates.lng}`;
    window.open(url, "_blank");
  };

  const displayed = showAll ? filtered : filtered.slice(0, INITIAL_SHOW);

  const specialtyLabel =
    filterSpecialty
      ? doctorDatabase[filterSpecialty]?.name[lang]
      : heroSpecialty
        ? doctorDatabase[heroSpecialty]?.name[lang]
        : "All Specialties";

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>

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
          }}
        >
          <Filter size={16} color="#9ca3af" />
          <span style={{ fontSize: 22, fontWeight: 800, color: "white" }}>
            {filtered.length}
          </span>
          <span style={{ fontSize: 17, fontWeight: 600, color: "white" }}>
            Doctors listed in |
          </span>
          <span
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#16a34a",
              borderBottom: "2.5px solid #16a34a",
              paddingBottom: 1,
            }}
          >
            {specialtyLabel}
          </span>
        </div>

        {/* ── GLASS WRAPPER: one glass-card panel holds both sidebar + cards ── */}
        <div
          className="glass-card"
          style={{ display: "flex", alignItems: "flex-start", padding: "20px", gap: 20 }}
        >
          {/* LEFT: Filter sidebar — solid white panel */}
          <div
            style={{
              width: 190,
              minWidth: 190,
              flexShrink: 0,
              background: "rgba(255,255,255,0.95)",
              borderRadius: 14,
              padding: "16px 14px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
            }}
          >
            <DoctorFilters
              selectedSpecialty={pendingSpecialty}
              setSelectedSpecialty={setPendingSpecialty}
              selectedLocation={pendingLocation}
              setSelectedLocation={setPendingLocation}
              sortBy={pendingSortBy}
              setSortBy={setPendingSortBy}
              priceRange={pendingPrice}
              setPriceRange={setPendingPrice}
              onlineOnly={pendingOnline}
              setOnlineOnly={setPendingOnline}
              verifiedOnly={pendingVerified}
              setVerifiedOnly={setPendingVerified}
              onApply={handleApplyFilters}
              lang={lang}
            />
          </div>

          {/* RIGHT: Cards or empty state */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {filtered.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <Stethoscope size={48} color="#9ca3af" style={{ marginBottom: 16 }} />
                <p style={{ fontSize: 18, fontWeight: 600, color: "#1f2937", margin: "0 0 6px" }}>
                  No doctors found
                </p>
                <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <>
                {/* Cards grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))",
                    gap: 14,
                    marginBottom: 24,
                    alignItems: "stretch",
                  }}
                >
                  {displayed.map((doc) => (
                    <DoctorCard
                      key={doc.id}
                      doctor={doc}
                      onViewProfile={setSelectedDoctor}
                      onGetDirections={handleGetDirections}
                    />
                  ))}
                </div>

                {/* Show more / less */}
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
                        ? <><ChevronUp size={17} /> Show Less</>
                        : <><ChevronDown size={17} /> View More Doctors ({filtered.length - INITIAL_SHOW} more)</>}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
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