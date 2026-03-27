// doctors/components/SpecialtyGrid.tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Heart, Activity, Brain, Thermometer,
  AlertTriangle, Stethoscope, User, ChevronDown, ChevronUp
} from "lucide-react";
import { doctorDatabase } from "./DoctorData";

interface SpecialtyGridProps {
  onSelectSpecialty: (key: string) => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  cardiology: Heart,
  pulmonology: Activity,
  neurology: Brain,
  gastroenterology: Activity,
  endocrinology: Thermometer,
  orthopedics: Activity,
  psychiatry: Brain,
  dermatology: User,
  oncology: AlertTriangle,
  generalMedicine: Stethoscope,
};

const INITIAL_SHOW = 8;

const SpecialtyGrid: React.FC<SpecialtyGridProps> = ({ onSelectSpecialty }) => {
  const { t, i18n } = useTranslation("doctors");
  const lang = i18n.language as "en" | "ur";

  const [showAll, setShowAll] = useState(false);

  const keys = Object.keys(doctorDatabase);
  const displayed = showAll ? keys : keys.slice(0, INITIAL_SHOW);

  return (
    <div className="glass-card p-6 mb-6 text-white">

      {/* Title */}
      <h3 className="text-xl font-bold text-center mb-6">
        {t("specialty.browseTitle")}
      </h3>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {displayed.map((key) => {
          const specialty = doctorDatabase[key];
          const IconComponent = iconMap[key] || Stethoscope;

          return (
            <button
              key={key}
              onClick={() => onSelectSpecialty(key)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl 
                         bg-white/10 border border-white/20 
                         hover:bg-white/20 transition-all duration-200 
                         hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <IconComponent size={20} className="text-white" />
              </div>

              {/* Name */}
              <div className="text-xs font-semibold text-center text-white">
                {specialty.name[lang]}
              </div>

              {/* Count */}
              <span className="text-[11px] px-2 py-[2px] rounded-full bg-white/10 border border-white/20 text-white/70">
                {specialty.doctors.length} {t("specialty.doctors")}
              </span>
            </button>
          );
        })}
      </div>

      {/* View More Button */}
      {keys.length > INITIAL_SHOW && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(v => !v)}
            className="flex items-center gap-2 px-6 py-2 rounded-full 
                       bg-white/10 border border-white/20 
                       text-white/80 text-sm font-semibold 
                       hover:bg-white/20 transition"
          >
            {showAll ? (
              <>
                <ChevronUp size={16} /> Show Less
              </>
            ) : (
              <>
                <ChevronDown size={16} /> View More
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SpecialtyGrid;