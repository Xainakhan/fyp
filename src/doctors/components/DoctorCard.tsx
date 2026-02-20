// doctors/components/DoctorCard.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Building, MapPin, Phone, Calendar, Star, Award,
  CheckCircle, Navigation, DollarSign, Route, User, Activity,
} from "lucide-react";
import type { DoctorWithMeta } from "./types";

interface DoctorCardProps {
  doctor: DoctorWithMeta;
  onViewProfile: (doctor: DoctorWithMeta) => void;
  onGetDirections: (doctor: DoctorWithMeta) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onViewProfile, onGetDirections }) => {
  const { t, i18n } = useTranslation("doctors");
  const lang = i18n.language as "en" | "ur";

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-md hover:shadow-xl border border-slate-100 transition-all p-5 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-4">
          {/* Name + badge */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h4 className="text-lg sm:text-xl font-bold text-gray-800">{doctor.name}</h4>
            {doctor.verified && (
              <div className="flex items-center bg-green-100 px-2 py-0.5 rounded-full">
                <CheckCircle className="text-green-600 mr-1" size={12} />
                <span className="text-[11px] font-medium text-green-700">{t("card.verified")}</span>
              </div>
            )}
          </div>

          <p className="text-sm sm:text-base text-green-600 font-semibold mb-1">{doctor.specialty[lang]}</p>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">{doctor.qualification}</p>

          {/* Rating */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mb-2">
            <div className="flex items-center">
              <Star className="text-yellow-500 mr-1" size={16} />
              <span className="font-semibold text-gray-800 mr-1">{doctor.rating}</span>
              <span className="text-gray-600">({doctor.reviews} {t("card.reviews")})</span>
            </div>
            {doctor.onlineConsultation && (
              <span className="inline-flex items-center bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[11px] font-medium">
                {t("card.onlineAvailable")}
              </span>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="space-y-2">
              <div className="flex items-center text-gray-600"><Building className="mr-2 text-gray-400" size={16} /><span className="font-medium">{doctor.hospital}</span></div>
              <div className="flex items-center text-gray-600"><MapPin className="mr-2 text-gray-400" size={16} /><span>{doctor.location}</span></div>
              <div className="flex items-center text-gray-600"><Award className="mr-2 text-gray-400" size={16} /><span>{doctor.experience} {t("card.experience")}</span></div>
              {doctor.distance != null && (
                <div className="flex items-center text-gray-600"><Route className="mr-2 text-green-500" size={16} /><span className="font-medium text-green-600">{doctor.distance} {t("card.kmAway")}</span></div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600"><DollarSign className="mr-2 text-gray-400" size={16} /><span className="font-medium">Rs. {doctor.consultationFee} {t("card.consultation")}</span></div>
              <div className="flex items-center text-gray-600"><Phone className="mr-2 text-gray-400" size={16} /><span>{doctor.phone}</span></div>
              {doctor.address && <div className="flex items-center text-gray-600"><MapPin className="mr-2 text-gray-400" size={16} /><span>{doctor.address}</span></div>}
            </div>
          </div>

          {/* Specializations */}
          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">{t("card.specializations")}:</p>
            <div className="flex flex-wrap gap-1.5">
              {doctor.specializations.map((spec, idx) => (
                <span key={idx} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium">{spec}</span>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">{t("card.availableDays")}:</p>
            <div className="flex flex-wrap gap-1.5">
              {doctor.availability.map((day, idx) => (
                <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium">{day}</span>
              ))}
            </div>
            <div className="text-[11px] sm:text-xs text-gray-600">{doctor.timeSlots.join(" | ")}</div>
          </div>

          {/* Languages */}
          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">{t("card.languages")}:</p>
            <div className="flex flex-wrap gap-1.5">
              {doctor.languages.map((l, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-[11px] sm:text-xs">{l}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 sm:gap-3">
          <button onClick={() => onViewProfile(doctor)}
            className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2">
            <User size={18} />{t("card.viewProfile")}
          </button>
          <a href={`tel:${doctor.phone}`}
            className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2">
            <Phone size={18} />{t("card.callNow")}
          </a>
          <button className="w-full bg-purple-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2">
            <Calendar size={18} />{t("card.bookAppointment")}
          </button>
          {doctor.onlineConsultation && (
            <button className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2">
              <Activity size={18} />{t("card.onlineConsult")}
            </button>
          )}
          <button onClick={() => onGetDirections(doctor)}
            className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
            <Navigation size={18} />{t("card.getDirections")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;