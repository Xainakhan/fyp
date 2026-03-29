// doctors/components/SearchFilters.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Search, SlidersHorizontal, ChevronDown, ChevronUp, MapPin, Star
} from "lucide-react";
import { doctorDatabase } from "./DoctorData";
import type { SortBy, PriceRange } from "./types";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedSpecialty: string;
  setSelectedSpecialty: (v: string) => void;
  selectedLocation: string;
  setSelectedLocation: (v: string) => void;
  sortBy: SortBy;
  setSortBy: (v: SortBy) => void;
  priceRange: PriceRange;
  setPriceRange: (v: PriceRange) => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  hasUserLocation: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchQuery, setSearchQuery,
  selectedSpecialty, setSelectedSpecialty,
  selectedLocation, setSelectedLocation,
  sortBy, setSortBy,
  priceRange, setPriceRange,
  showFilters, setShowFilters,
  hasUserLocation,
}) => {
  const { t, i18n } = useTranslation("doctors");
  const lang = i18n.language as "en" | "ur";

  const sanitizeFee = (v: string) =>
    v.replace(/[^\d]/g, "").replace(/^0+(?=\d)/, "");

  return (
    <div className="glass-card p-6 mb-6 text-white">

      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-lg font-bold text-white">
          {t("filters.title")}
        </h2>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition
            ${showFilters
              ? "bg-green-500/20 border border-green-400/30 text-green-300"
              : "bg-white/10 border border-white/20 text-white/80"
            }`}
        >
          <SlidersHorizontal size={15} />
          {t("filters.filters")}
          {showFilters ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />

        <input
          type="text"
          placeholder={t("filters.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder-white/50 outline-none focus:border-green-400"
        />
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        {/* Specialty */}
        <div>
          <label className="text-xs font-semibold text-white/60 uppercase mb-1 block">
            {t("filters.specialty")}
          </label>

          <div className="relative">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-white/10 border border-white/20 text-sm text-white outline-none appearance-none"
            >
              <option value="" className="text-black">
                {t("filters.allSpecialties")}
              </option>
              {Object.keys(doctorDatabase).map((key) => (
                <option key={key} value={key} className="text-black">
                  {doctorDatabase[key].name[lang]}
                </option>
              ))}
            </select>

            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50" />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-xs font-semibold text-white/60 uppercase mb-1 block">
            {t("filters.location")}
          </label>

          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full py-2.5 pl-8 pr-3 rounded-xl bg-white/10 border border-white/20 text-sm text-white outline-none appearance-none"
            >
              <option value="" className="text-black">
                {t("filters.allCities")}
              </option>
              {["lahore","karachi","rawalpindi","islamabad","faisalabad","multan","peshawar"].map(c => (
                <option key={c} value={c} className="text-black">
                  {c}
                </option>
              ))}
            </select>

            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50" />
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="text-xs font-semibold text-white/60 uppercase mb-1 block">
            {t("filters.sortBy")}
          </label>

          <div className="relative">
            <Star size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="w-full py-2.5 pl-8 pr-3 rounded-xl bg-white/10 border border-white/20 text-sm text-white outline-none appearance-none"
            >
              <option value="rating" className="text-black">{t("filters.sort.rating")}</option>
              {hasUserLocation && <option value="distance" className="text-black">{t("filters.sort.distance")}</option>}
              <option value="experience" className="text-black">{t("filters.sort.experience")}</option>
              <option value="price_low" className="text-black">{t("filters.sort.priceLow")}</option>
              <option value="price_high" className="text-black">{t("filters.sort.priceHigh")}</option>
              <option value="reviews" className="text-black">{t("filters.sort.reviews")}</option>
            </select>

            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50" />
          </div>
        </div>
      </div>

      {/* Advanced */}
      {showFilters && (
        <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Price */}
          <div>
            <label className="text-xs font-semibold text-white/60 uppercase mb-1 block">
              {t("filters.feeRange")}
            </label>

            <div className="flex items-center gap-2">
              <input
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: sanitizeFee(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm outline-none"
              />

              <span className="text-white/50 text-sm">{t("filters.to")}</span>

              <input
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: sanitizeFee(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm outline-none"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div>
            <label className="text-xs font-semibold text-white/60 uppercase mb-2 block">
              {t("filters.additionalFilters")}
            </label>

            <div className="flex flex-col gap-2 text-sm text-white/80">
              {[t("filters.onlineOnly"), t("filters.availableToday")].map((lbl, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-green-500" />
                  {lbl}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;