// doctors/doctors.tsx  ← main entry point
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";

import { doctorDatabase } from "./components/Doctordata";
import type { DoctorWithMeta, Coordinates, SortBy, PriceRange } from "./components/types";

import SearchFilters from "./components/Searchfilter";
import LocationPanel from "./components/Locationpanel";
import DoctorCard from "./components/Doctorcard";
import DoctorProfileModal from "./components/Doctorprofilemodal";
import SpecialtyGrid from "./components/Specialitygrid";
import EmergencyContacts from "./components/EmergencyContacts";

const FindDoctorPage: React.FC = () => {
  const { t } = useTranslation("doctors");

  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorResults, setDoctorResults] = useState<DoctorWithMeta[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("rating");
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: "", max: "" });
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorWithMeta | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [nearbyDoctors, setNearbyDoctors] = useState<DoctorWithMeta[]>([]);
  const [mapCenter, setMapCenter] = useState<Coordinates>({ lat: 31.5804, lng: 74.3587 });
  const [selectedRadius, setSelectedRadius] = useState(10);

  const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    return Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 100) / 100;
  };

  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError("");
    if (!navigator.geolocation) { setLocationError("Geolocation not supported"); setIsLoadingLocation(false); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setMapCenter(loc);
        setIsLoadingLocation(false);
        findNearbyDoctors(loc, selectedRadius);
      },
      (err) => {
        const msgs: Record<number, string> = {
          1: "Location access denied",
          2: "Location unavailable",
          3: "Location request timed out",
        };
        setLocationError(msgs[err.code] || "Unable to retrieve location");
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
    );
  };

  const findNearbyDoctors = (loc: Coordinates, radius: number) => {
    const nearby: DoctorWithMeta[] = [];
    Object.keys(doctorDatabase).forEach((key) => {
      doctorDatabase[key].doctors.forEach((doc) => {
        const dist = calcDistance(loc.lat, loc.lng, doc.coordinates.lat, doc.coordinates.lng);
        if (dist <= radius) nearby.push({ ...doc, distance: dist, specialty: doctorDatabase[key].name, specialtyKey: key });
      });
    });
    nearby.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    setNearbyDoctors(nearby);
  };

  const getDirections = (doctor: DoctorWithMeta) => {
    const url = userLocation
      ? `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${doctor.coordinates.lat},${doctor.coordinates.lng}`
      : `https://www.google.com/maps/search/${encodeURIComponent((doctor.address || "") + ", " + doctor.location)}`;
    window.open(url, "_blank");
  };

  const searchDoctors = () => {
    let results: DoctorWithMeta[] = [];
    const q = searchQuery.trim().toLowerCase();

    // Reason → specialty mapping
    const reasonMap: Record<string, string[]> = {
      "blood pressure": ["cardiology", "endocrinology", "generalMedicine"],
      "fever": ["generalMedicine", "pulmonology"],
      "chest pain": ["cardiology", "pulmonology"],
      "diabetes": ["endocrinology"],
      "stomach": ["gastroenterology", "generalMedicine"],
      "headache": ["neurology", "generalMedicine"],
    };
    const specialtiesFromReason = Object.keys(reasonMap).find((k) => q.includes(k))
      ? reasonMap[Object.keys(reasonMap).find((k) => q.includes(k))!]
      : [];

    // Build base list
    const keys = selectedSpecialty ? [selectedSpecialty] : Object.keys(doctorDatabase);
    keys.forEach((key) => {
      doctorDatabase[key].doctors.forEach((doc) => {
        results.push({ ...doc, specialty: doctorDatabase[key].name, specialtyKey: key });
      });
    });

    if (specialtiesFromReason.length > 0)
      results = results.filter((d) => specialtiesFromReason.includes(d.specialtyKey));

    if (userLocation)
      results = results.map((d) => ({ ...d, distance: calcDistance(userLocation.lat, userLocation.lng, d.coordinates.lat, d.coordinates.lng) }));

    if (selectedLocation) {
      const loc = selectedLocation.toLowerCase();
      const byCIty = results.filter((d) => d.location.toLowerCase().includes(loc));
      if (byCIty.length > 0) results = byCIty;
    }

    if (q && specialtiesFromReason.length === 0)
      results = results.filter((d) =>
        d.name.toLowerCase().includes(q) ||
        d.hospital.toLowerCase().includes(q) ||
        d.specializations.some((s) => s.toLowerCase().includes(q))
      );

    const minFee = priceRange.min ? parseInt(priceRange.min) : 0;
    const maxFee = priceRange.max ? parseInt(priceRange.max) : Infinity;
    results = results.filter((d) => d.consultationFee >= minFee && d.consultationFee <= maxFee);

    const sorters: Record<SortBy, (a: DoctorWithMeta, b: DoctorWithMeta) => number> = {
      distance: (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity),
      rating: (a, b) => b.rating - a.rating,
      experience: (a, b) => parseInt(b.experience) - parseInt(a.experience),
      price_low: (a, b) => a.consultationFee - b.consultationFee,
      price_high: (a, b) => b.consultationFee - a.consultationFee,
      reviews: (a, b) => b.reviews - a.reviews,
    };
    results.sort(sorters[sortBy] || sorters.rating);
    setDoctorResults(results);
  };

  useEffect(() => {
    try {
      const city = sessionStorage.getItem("sehatHub-findDoctor-city");
      const query = sessionStorage.getItem("sehatHub-findDoctor-query");
      if (city) setSelectedLocation(city.toLowerCase());
      if (query) setSearchQuery(query);
    } catch { }
  }, []);

  useEffect(() => { searchDoctors(); }, [selectedSpecialty, selectedLocation, searchQuery, sortBy, priceRange, userLocation]);
  useEffect(() => { if (userLocation) findNearbyDoctors(userLocation, selectedRadius); }, [userLocation, selectedRadius]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
              <Users className="text-green-600" size={32} />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1">{t("header.title")}</h1>
              <p className="text-sm sm:text-lg text-gray-600">{t("header.subtitle")}</p>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <SearchFilters
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          selectedSpecialty={selectedSpecialty} setSelectedSpecialty={setSelectedSpecialty}
          selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation}
          sortBy={sortBy} setSortBy={setSortBy}
          priceRange={priceRange} setPriceRange={setPriceRange}
          showFilters={showFilters} setShowFilters={setShowFilters}
          hasUserLocation={!!userLocation}
        />

        {/* Location panel inside the search card */}
        <LocationPanel
          userLocation={userLocation}
          isLoadingLocation={isLoadingLocation}
          locationError={locationError}
          showMap={showMap}
          mapCenter={mapCenter}
          nearbyDoctors={nearbyDoctors}
          selectedRadius={selectedRadius}
          onGetLocation={getUserLocation}
          onToggleMap={() => setShowMap((p) => !p)}
          onRadiusChange={(r) => { setSelectedRadius(r); if (userLocation) findNearbyDoctors(userLocation, r); }}
          onViewDoctor={setSelectedDoctor}
          onGetDirections={getDirections}
          onViewAll={() => setSortBy("distance")}
        />

        {/* Results */}
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {t("results.title")} ({doctorResults.length})
          </h3>
        </div>

        <div className="space-y-5 sm:space-y-6 mb-8">
          {doctorResults.length > 0 ? (
            doctorResults.map((doctor, i) => (
              <DoctorCard key={doctor.id ?? i} doctor={doctor}
                onViewProfile={setSelectedDoctor}
                onGetDirections={getDirections}
              />
            ))
          ) : (
            <div className="text-center py-10 bg-white/90 rounded-2xl shadow-md border border-slate-100">
              <Users className="mx-auto mb-3 text-gray-400" size={48} />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-1.5">{t("results.noResults")}</h3>
              <p className="text-xs sm:text-sm text-gray-500">{t("results.noResultsHint")}</p>
            </div>
          )}
        </div>

        <SpecialtyGrid onSelectSpecialty={(key) => { setSelectedSpecialty(key); setSearchQuery(""); }} />
        <EmergencyContacts />
      </div>

      {/* Profile modal */}
      {selectedDoctor && (
        <DoctorProfileModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onGetDirections={getDirections}
        />
      )}
    </div>
  );
};

export default FindDoctorPage;