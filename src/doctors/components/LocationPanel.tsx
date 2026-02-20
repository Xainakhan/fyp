// doctors/components/LocationPanel.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Locate, Map, AlertTriangle, Navigation, Star, DollarSign, Route, Phone } from "lucide-react";
import type { Coordinates, DoctorWithMeta } from "./types";

interface LocationPanelProps {
  userLocation: Coordinates | null;
  isLoadingLocation: boolean;
  locationError: string;
  showMap: boolean;
  mapCenter: Coordinates;
  nearbyDoctors: DoctorWithMeta[];
  selectedRadius: number;
  onGetLocation: () => void;
  onToggleMap: () => void;
  onRadiusChange: (r: number) => void;
  onViewDoctor: (d: DoctorWithMeta) => void;
  onGetDirections: (d: DoctorWithMeta) => void;
  onViewAll: () => void;
}

const LocationPanel: React.FC<LocationPanelProps> = ({
  userLocation, isLoadingLocation, locationError,
  showMap, mapCenter, nearbyDoctors, selectedRadius,
  onGetLocation, onToggleMap, onRadiusChange,
  onViewDoctor, onGetDirections, onViewAll,
}) => {
  const { t, i18n } = useTranslation("doctors");
  const lang = i18n.language as "en" | "ur";

  return (
    <>
      {/* Location section */}
      <div className="bg-green-50/90 p-4 sm:p-5 rounded-2xl border border-green-200 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-3">
            <MapPin className="text-green-600 mt-1" size={24} />
            <div>
              <h4 className="font-semibold text-green-800 text-sm sm:text-base">{t("location.findNearest")}</h4>
              <p className="text-xs sm:text-sm text-green-600">
                {userLocation ? t("location.enabled") : t("location.disabled")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {!userLocation && (
              <button onClick={onGetLocation} disabled={isLoadingLocation}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-all text-sm">
                <Locate size={18} />
                {isLoadingLocation ? t("location.getting") : t("location.useMyLocation")}
              </button>
            )}
            <button onClick={onToggleMap}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm">
              <Map size={18} />
              {showMap ? t("location.hideMap") : t("location.showMap")}
            </button>
            {userLocation && (
              <div className="flex items-center gap-2">
                <label className="text-xs sm:text-sm font-medium text-green-700">{t("location.radius")}:</label>
                <select value={selectedRadius}
                  onChange={(e) => onRadiusChange(parseInt(e.target.value, 10))}
                  className="px-3 py-1.5 border border-green-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-green-500 bg-white">
                  {[5, 10, 15, 25, 50].map((r) => <option key={r} value={r}>{r} km</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {locationError && (
          <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded-lg">
            <p className="text-red-700 text-xs sm:text-sm flex items-center gap-2">
              <AlertTriangle size={16} />{locationError}
            </p>
          </div>
        )}
      </div>

      {/* Map mock */}
      {showMap && (
        <div className="mb-6 bg-white/90 rounded-2xl shadow-md border border-slate-100 p-4">
          <div className="h-80 sm:h-96 bg-gray-100 rounded-xl relative overflow-hidden flex items-center justify-center">
            <div className="text-center">
              <Map className="mx-auto mb-2 text-gray-400" size={48} />
              <p className="text-gray-600 mb-2 text-sm">{t("map.title")}</p>
              <p className="text-xs text-gray-500">
                {t("map.center")}: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
              </p>
              {userLocation && (
                <p className="text-green-600 text-xs font-medium mt-1">
                  {t("map.yourLocation")}: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              )}
              <p className="text-[11px] text-gray-400 mt-2">{t("map.note")}</p>
            </div>
            {userLocation && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-green-600 w-4 h-4 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nearby doctors */}
      {userLocation && nearbyDoctors.length > 0 && (
        <div className="bg-green-50/90 p-5 sm:p-6 rounded-2xl border border-green-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-green-800 flex items-center gap-2">
              <Navigation className="text-green-600" size={20} />
              {t("location.nearbyCount", { count: nearbyDoctors.length })}
            </h3>
            <span className="text-xs sm:text-sm text-green-700">
              {t("location.withinRadius", { radius: selectedRadius })}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {nearbyDoctors.slice(0, 4).map((doctor) => (
              <div key={doctor.id} className="bg-white/90 p-4 rounded-xl border border-green-200 hover:shadow-md transition-all">
                <h4 className="font-semibold text-gray-800 text-sm mb-1">{doctor.name}</h4>
                <p className="text-xs text-green-600 font-medium mb-1">{doctor.specialty[lang]}</p>
                <p className="text-[11px] text-gray-600 mb-2">{doctor.hospital}</p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 mb-3">
                  <div className="flex items-center gap-1"><Route className="text-green-500" size={12} /><span>{doctor.distance} km</span></div>
                  <div className="flex items-center gap-1"><Star className="text-yellow-500" size={12} /><span>{doctor.rating}</span></div>
                  <div className="flex items-center gap-1"><DollarSign className="text-gray-400" size={12} /><span>Rs. {doctor.consultationFee}</span></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onViewDoctor(doctor)}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-green-700 transition-all">
                    {t("card.view")}
                  </button>
                  <a href={`tel:${doctor.phone}`}
                    className="flex items-center justify-center bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-all">
                    <Phone size={16} />
                  </a>
                  <button onClick={() => onGetDirections(doctor)}
                    className="flex items-center justify-center bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-all">
                    <Navigation size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {nearbyDoctors.length > 4 && (
            <div className="text-center mt-4">
              <button onClick={onViewAll} className="text-green-700 hover:text-green-800 font-medium text-xs sm:text-sm">
                {t("location.viewAll", { count: nearbyDoctors.length })}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default LocationPanel;