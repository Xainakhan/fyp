// doctors/components/SearchFilters.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { doctorDatabase } from "./Doctordata";
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

  const sanitizeFee = (v: string) => v.replace(/[^\d]/g, "").replace(/^0+(?=\d)/, "");

  return (
    <div className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl shadow-lg border border-slate-100 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{t("filters.title")}</h2>
        <button onClick={() => setShowFilters(!showFilters)}
          className="self-start sm:self-auto flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium">
          <Filter size={18} />
          {t("filters.filters")}
          {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-5 sm:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text"
            placeholder={t("filters.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
            dir="auto"
          />
        </div>
      </div>

      {/* Basic filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">{t("filters.specialty")}</label>
          <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm">
            <option value="">{t("filters.allSpecialties")}</option>
            {Object.keys(doctorDatabase).map((key) => (
              <option key={key} value={key}>{doctorDatabase[key].name[lang]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">{t("filters.location")}</label>
          <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm">
            <option value="">{t("filters.allCities")}</option>
            <option value="lahore">Lahore</option>
            <option value="karachi">Karachi</option>
            <option value="rawalpindi">Rawalpindi</option>
            <option value="islamabad">Islamabad</option>
            <option value="faisalabad">Faisalabad</option>
            <option value="multan">Multan</option>
            <option value="peshawar">Peshawar</option>
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">{t("filters.sortBy")}</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm">
            <option value="rating">{t("filters.sort.rating")}</option>
            {hasUserLocation && <option value="distance">{t("filters.sort.distance")}</option>}
            <option value="experience">{t("filters.sort.experience")}</option>
            <option value="price_low">{t("filters.sort.priceLow")}</option>
            <option value="price_high">{t("filters.sort.priceHigh")}</option>
            <option value="reviews">{t("filters.sort.reviews")}</option>
          </select>
        </div>
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="border-t border-slate-200 pt-5 sm:pt-6 mt-2">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">{t("filters.feeRange")}</label>
              <div className="flex items-center gap-3">
                <input type="text" inputMode="numeric" placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: sanitizeFee(e.target.value) })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm" />
                <span className="text-gray-500 text-xs sm:text-sm">{t("filters.to")}</span>
                <input type="text" inputMode="numeric" placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: sanitizeFee(e.target.value) })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">{t("filters.additionalFilters")}</label>
              <div className="space-y-2.5">
                <label className="flex items-center text-xs sm:text-sm text-gray-700">
                  <input type="checkbox" className="mr-2" />{t("filters.onlineOnly")}
                </label>
                <label className="flex items-center text-xs sm:text-sm text-gray-700">
                  <input type="checkbox" className="mr-2" />{t("filters.verifiedOnly")}
                </label>
                <label className="flex items-center text-xs sm:text-sm text-gray-700">
                  <input type="checkbox" className="mr-2" />{t("filters.availableToday")}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;