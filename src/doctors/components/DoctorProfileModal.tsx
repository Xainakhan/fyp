// doctors/components/DoctorProfileModal.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Star, Navigation, Route, Phone } from "lucide-react";
import type { DoctorWithMeta } from "./types";

interface DoctorProfileModalProps {
  doctor: DoctorWithMeta;
  onClose: () => void;
  onGetDirections: (d: DoctorWithMeta) => void;
}

const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({ doctor, onClose, onGetDirections }) => {
  const { t, i18n } = useTranslation("doctors");
  const lang = i18n.language as "en" | "ur";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-2xl font-bold text-gray-800">{t("modal.title")}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
          </div>

          <div className="space-y-5 sm:space-y-6">
            {/* Header info */}
            <div className="text-center">
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-1.5">{doctor.name}</h4>
              <p className="text-sm sm:text-base text-green-600 font-medium mb-3">{doctor.specialty[lang]}</p>
              <div className="flex items-center justify-center mb-3">
                <Star className="text-yellow-500 mr-1" size={20} />
                <span className="text-base sm:text-lg font-semibold text-gray-800 mr-1">{doctor.rating}</span>
                <span className="text-xs sm:text-sm text-gray-600">({doctor.reviews} {t("card.reviews")})</span>
              </div>
              {doctor.distance != null && (
                <div className="flex items-center justify-center text-sm">
                  <Route className="text-green-500 mr-1" size={16} />
                  <span className="text-green-600 font-medium">{doctor.distance} {t("card.kmAway")}</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-2">
                <p><span className="font-medium">{t("modal.qualification")}:</span> {doctor.qualification}</p>
                <p><span className="font-medium">{t("modal.experience")}:</span> {doctor.experience}</p>
                <p><span className="font-medium">{t("modal.hospital")}:</span> {doctor.hospital}</p>
                <p><span className="font-medium">{t("modal.location")}:</span> {doctor.location}</p>
              </div>
              <div className="space-y-2">
                <p><span className="font-medium">{t("modal.fee")}:</span> Rs. {doctor.consultationFee}</p>
                <p><span className="font-medium">{t("modal.phone")}:</span> {doctor.phone}</p>
                <p><span className="font-medium">{t("modal.online")}:</span> {doctor.onlineConsultation ? t("modal.available") : t("modal.notAvailable")}</p>
                {doctor.address && <p><span className="font-medium">{t("modal.address")}:</span> {doctor.address}</p>}
              </div>
            </div>

            {/* Specializations */}
            <div>
              <h5 className="font-medium text-gray-800 mb-2 text-sm">{t("card.specializations")}:</h5>
              <div className="flex flex-wrap gap-1.5">
                {doctor.specializations.map((spec, idx) => (
                  <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">{spec}</span>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h5 className="font-medium text-gray-800 mb-2 text-sm">{t("card.availableDays")}:</h5>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {doctor.availability.map((day, idx) => (
                  <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">{day}</span>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">{doctor.timeSlots.join(" | ")}</p>
            </div>

            {/* Languages */}
            <div>
              <h5 className="font-medium text-gray-800 mb-2 text-sm">{t("card.languages")}:</h5>
              <div className="flex flex-wrap gap-1.5">
                {doctor.languages.map((l, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs">{l}</span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <a href={`tel:${doctor.phone}`}
                className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-green-700 transition-all text-center">
                {t("card.callNow")}
              </a>
              <button className="flex-1 bg-purple-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-all">
                {t("card.bookAppointment")}
              </button>
              <button onClick={() => onGetDirections(doctor)}
                className="flex items-center justify-center bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-all">
                <Navigation size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileModal;