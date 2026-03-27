// doctors/components/HeroSection.tsx
import React from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";
import type { DoctorDatabase } from "./types";

interface HeroSectionProps {
  heroCity: string;
  setHeroCity: (city: string) => void;
  heroSpecialty: string;
  setHeroSpecialty: (key: string) => void;
  heroQuery: string;
  setHeroQuery: (q: string) => void;
  doctorDatabase: DoctorDatabase;
  lang: "en" | "ur";
  onSearch: () => void;
}

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
}) => {
  return (
    <div className="glass-card p-6 mb-6 text-white relative overflow-hidden">

      {/* Overlay effect */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 70%), " +
            "radial-gradient(circle at bottom right, rgba(0,0,0,0.08), transparent 70%)",
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl mb-2 text-white drop-shadow-lg">
          Find the best doctors<br />in Pakistan
        </h1>
        <p className="text-sm sm:text-base mb-7 text-white drop-shadow-md">
          Track your heart rate, blood pressure, and more with just your phone's front
          <br />
          camera — anytime, anywhere.
        </p>

        {/* Search bar */}
        <div className="flex items-center bg-white/95 rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto">
          
          {/* City dropdown */}
          <div className="flex items-center gap-2 border-r border-gray-200 px-3 min-w-[130px] relative">
            <MapPin size={15} className="text-gray-500" />
            <select
              value={heroCity}
              onChange={(e) => setHeroCity(e.target.value)}
              className="bg-transparent border-none outline-none text-gray-700 text-sm font-medium pl-1 pr-6 py-3 w-full cursor-pointer appearance-none"
            >
              {["Islamabad", "Lahore", "Karachi", "Rawalpindi", "Faisalabad", "Multan", "Peshawar"].map(
                (c) => (
                  <option key={c}>{c}</option>
                )
              )}
            </select>
            <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>

          {/* Specialty dropdown */}
          <div className="flex items-center gap-2 border-r border-gray-200 px-3 min-w-[130px] relative">
            <select
              value={heroSpecialty}
              onChange={(e) => setHeroSpecialty(e.target.value)}
              className={`bg-transparent border-none outline-none text-sm font-medium pl-1 pr-6 py-3 w-full cursor-pointer appearance-none ${
                heroSpecialty ? "text-gray-700" : "text-gray-400"
              }`}
            >
              <option value="">Specialities</option>
              {Object.keys(doctorDatabase).map((key) => (
                <option key={key} value={key}>
                  {doctorDatabase[key].name[lang]}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>

          {/* Search input */}
          <input
            type="text"
            placeholder="Search by doctor, Speciality, hospital, or disease"
            value={heroQuery}
            onChange={(e) => setHeroQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="flex-1 border-none outline-none text-gray-700 text-sm px-3 py-3 bg-transparent"
          />

          {/* Search button */}
          <button
            onClick={onSearch}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 flex items-center justify-center"
          >
            <Search size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;