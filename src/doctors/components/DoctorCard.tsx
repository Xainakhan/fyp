import React from "react";
import { useTranslation } from "react-i18next";
import {
  Building,
  MapPin,
  Phone,
  Calendar,
  Award,
  CheckCircle,
  Navigation,
  DollarSign,
  Route,
  User,
  Star,
} from "lucide-react";
import type { DoctorWithMeta } from "./types";

interface DoctorCardProps {
  doctor: DoctorWithMeta;
  onViewProfile: (doctor: DoctorWithMeta) => void;
  onGetDirections: (doctor: DoctorWithMeta) => void;
  isLast?: boolean;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onViewProfile,
  onGetDirections,
  isLast = false,
}) => {
  const { t, i18n } = useTranslation("doctors");
  const lang = i18n.language as "en" | "ur";

  return (
    <div className={`${!isLast ? "mb-4" : ""}`}>
      <div className="rounded-[24px] bg-white/95 text-[#111827] shadow-[0_12px_35px_rgba(0,0,0,0.18)] border border-black/5 px-4 py-4 md:px-5 md:py-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* LEFT SECTION */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Avatar */}
            <div className="w-[78px] h-[78px] rounded-[18px] bg-[#d9d9d9] flex items-center justify-center shrink-0 overflow-hidden">
              <User size={42} className="text-[#b0b0b0]" />
            </div>

            {/* Doctor Main Info */}
            <div className="flex-1 min-w-0">
              {/* Name */}
              <h3 className="text-[20px] md:text-[22px] font-bold text-[#111827] leading-tight mb-1">
                {doctor.name}
              </h3>

              {/* Specialty */}
              <p className="text-[14px] md:text-[15px] text-[#6b7280] leading-snug">
                {doctor.specialty[lang]}
              </p>

              {/* Qualification */}
              <p className="text-[13px] md:text-[14px] text-[#6b7280] leading-snug mb-2">
                {doctor.qualification}
              </p>

              {/* Hospital */}
              <div className="flex items-start gap-2 text-[13px] md:text-[14px] text-[#111827]">
                <Building size={15} className="mt-[2px] text-[#9ca3af] shrink-0" />
                <span className="leading-snug">{doctor.hospital}</span>
              </div>

              {/* Optional Tags */}
              {doctor.specializations?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {doctor.specializations.slice(0, 3).map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-[5px] rounded-full bg-[#f3f4f6] border border-[#e5e7eb] text-[11px] font-medium text-[#4b5563]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MIDDLE STATS */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:gap-2 lg:min-w-[160px] text-sm text-[#6b7280]">
            {/* Reviews */}
            <div className="flex items-center gap-2">
              <Star size={14} className="text-[#f59e0b] fill-[#f59e0b]" />
              <span className="font-semibold text-[#111827]">{doctor.rating}</span>
              <span className="text-[#6b7280]">
                ({doctor.reviews} {t("card.reviews")})
              </span>
            </div>

            {/* Experience */}
            <div className="flex items-center gap-2">
              <Award size={14} className="text-[#9ca3af]" />
              <span className="text-[#6b7280]">
                {doctor.experience} {t("card.experience")}
              </span>
            </div>

            {/* Distance */}
            {doctor.distance != null && (
              <div className="flex items-center gap-2">
                <Route size={14} className="text-[#9ca3af]" />
                <span className="text-[#16a34a] font-semibold">
                  {doctor.distance} {t("card.kmAway")}
                </span>
              </div>
            )}

            {/* Fee */}
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-[#9ca3af]" />
              <span className="font-semibold text-[#111827]">
                Rs. {doctor.consultationFee}
              </span>
            </div>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[170px] shrink-0">
            <button
              onClick={() => onViewProfile(doctor)}
              className="h-[44px] px-5 rounded-full border border-[#9ca3af] text-[#111827] bg-white hover:bg-[#f9fafb] text-sm font-semibold transition"
            >
              {t("card.viewProfile")}
            </button>

            <button
              className="h-[44px] px-5 rounded-full bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-semibold transition"
            >
              {t("card.bookAppointment")}
            </button>
          </div>
        </div>

        {/* BOTTOM EXTRA INFO */}
        <div className="mt-4 pt-4 border-t border-[#e5e7eb] flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
          {/* Left Info */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-[#6b7280]">
            <InfoItem icon={<MapPin size={14} />} text={doctor.location} />
            <InfoItem icon={<Phone size={14} />} text={doctor.phone} />
            {doctor.address && <InfoItem icon={<MapPin size={14} />} text={doctor.address} />}
          </div>

          {/* Right Actions */}
          <div className="flex flex-wrap gap-2">
            {doctor.verified && (
              <span className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
                <CheckCircle size={13} /> {t("card.verified")}
              </span>
            )}

            {doctor.onlineConsultation && (
              <span className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                {t("card.onlineAvailable")}
              </span>
            )}

            <a
              href={`tel:${doctor.phone}`}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-[#f3f4f6] border border-[#e5e7eb] text-[#374151] text-xs font-semibold hover:bg-[#e5e7eb] transition"
            >
              <Phone size={13} /> {t("card.callNow")}
            </a>

            <button
              onClick={() => onGetDirections(doctor)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-[#f3f4f6] border border-[#e5e7eb] text-[#374151] text-xs font-semibold hover:bg-[#e5e7eb] transition"
            >
              <Navigation size={13} /> {t("card.getDirections")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{
  icon: React.ReactNode;
  text: string;
}> = ({ icon, text }) => (
  <div className="flex items-center gap-2 min-w-0">
    <span className="text-[#9ca3af] shrink-0">{icon}</span>
    <span className="truncate">{text}</span>
  </div>
);

export default DoctorCard;