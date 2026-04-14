import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import { doctorDatabase } from "./DoctorData";
import DoctorCard from "./DoctorCard";
import SearchFilters from "./SearchFilter";
import type { DoctorWithMeta, SortBy, PriceRange } from "./types";

// ✅ MOVE INTERFACE TO THE TOP (before it's used)
interface DoctorfinderProps {
  userLanguage?: "en" | "ur";
}

const Doctorfinder = ({ userLanguage = "en" }: DoctorfinderProps) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("rating");
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: "", max: "" });
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    specialty: "",
    location: "",
    sort: "rating" as SortBy,
    price: { min: "", max: "" } as PriceRange,
    online: false,
    verified: false,
  });

  const handleApply = () => {
    setAppliedFilters({
      specialty: selectedSpecialty,
      location: selectedLocation,
      sort: sortBy,
      price: priceRange,
      online: onlineOnly,
      verified: verifiedOnly,
    });
  };

  const allDoctors = useMemo((): DoctorWithMeta[] => {
    const all: DoctorWithMeta[] = [];
    for (const key in doctorDatabase) {
      const entry = doctorDatabase[key];
      entry.doctors.forEach((d) =>
        all.push({
          ...d,
          specialty: entry.specialty,
          specialtyName: entry.name.en,
          specialtyKey: key,
          distance: null,
        })
      );
    }
    return all;
  }, []);

  const filteredDoctors = useMemo(() => {
    let docs = [...allDoctors];

    if (appliedFilters.specialty) {
      docs = docs.filter((d) => d.specialtyKey === appliedFilters.specialty);
    }
    if (appliedFilters.location) {
      docs = docs.filter(
        (d) => d.location.toLowerCase() === appliedFilters.location.toLowerCase()
      );
    }

    const minFee = parseInt(appliedFilters.price.min) || 0;
    const maxFee = parseInt(appliedFilters.price.max) || Infinity;
    docs = docs.filter((d) => d.consultationFee >= minFee && d.consultationFee <= maxFee);

    if (appliedFilters.online) docs = docs.filter((d) => d.onlineConsultation);
    if (appliedFilters.verified) docs = docs.filter((d) => d.verified);

    switch (appliedFilters.sort) {
      case "rating":
        docs.sort((a, b) => b.rating - a.rating);
        break;
      case "price_low":
        docs.sort((a, b) => a.consultationFee - b.consultationFee);
        break;
      case "price_high":
        docs.sort((a, b) => b.consultationFee - a.consultationFee);
        break;
      case "experience":
        docs.sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
        break;
      case "reviews":
        docs.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return docs;
  }, [allDoctors, appliedFilters]);

  const queryLabel = [
    appliedFilters.specialty ? doctorDatabase[appliedFilters.specialty]?.name.en : "",
    appliedFilters.location
      ? appliedFilters.location.charAt(0).toUpperCase() + appliedFilters.location.slice(1)
      : "",
  ]
    .filter(Boolean)
    .join(", ") || "All Specialities";

  const handleViewProfile = (doctor: DoctorWithMeta) => {
    console.log("View profile:", doctor);
  };

  const handleGetDirections = (doctor: DoctorWithMeta) => {
    if (doctor.coordinates) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${doctor.coordinates.lat},${doctor.coordinates.lng}`,
        "_blank"
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        background: "#0f1117",
        minHeight: "100vh",
        padding: 16,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Sidebar Filters - ADD lang prop here */}
      <SearchFilters
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        sortBy={sortBy}
        setSortBy={setSortBy}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        onlineOnly={onlineOnly}
        setOnlineOnly={setOnlineOnly}
        verifiedOnly={verifiedOnly}
        setVerifiedOnly={setVerifiedOnly}
        onApply={handleApply}
        lang={userLanguage}  // ✅ ADD THIS LINE
      />

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Results Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          <Filter size={16} color="#888" />
          <span style={{ color: "#3b6ef5" }}>{filteredDoctors.length}</span>
          <span style={{ color: "#aaa", fontWeight: 400 }}>
            {" "}Doctors listed in |{" "}
          </span>
          <span style={{ color: "#aaa", fontWeight: 400 }}>{queryLabel}</span>
        </div>

        {/* Cards Grid */}
        {filteredDoctors.length === 0 ? (
          <div
            style={{
              color: "#888",
              fontSize: 14,
              padding: "60px 20px",
              textAlign: "center",
              background: "#1a1d27",
              borderRadius: 12,
              border: "1px solid #23263a",
            }}
          >
            No doctors found matching your filters.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
              gap: 14,
            }}
          >
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onViewProfile={handleViewProfile}
                onGetDirections={handleGetDirections}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctorfinder;