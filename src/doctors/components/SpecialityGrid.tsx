// doctors/components/SpecialtyGrid.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Heart, Activity, Brain, Thermometer, AlertTriangle, Stethoscope, User } from "lucide-react";
import { doctorDatabase } from "./Doctordata";

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

const SpecialtyGrid: React.FC<SpecialtyGridProps> = ({ onSelectSpecialty }) => {
  const { t, i18n } = useTranslation("doctors");
  const lang = i18n.language as "en" | "ur";

  return (
    <div className="bg-white/90 backdrop-blur p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-100 mb-8">
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-5 sm:mb-6 text-center">
        {t("specialty.browseTitle")}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {Object.keys(doctorDatabase).map((key) => {
          const specialty = doctorDatabase[key];
          const IconComponent = iconMap[key] || Stethoscope;
          return (
            <button key={key}
              onClick={() => onSelectSpecialty(key)}
              className="p-4 sm:p-5 bg-gradient-to-br from-green-50 to-green-50 hover:from-green-100 hover:to-green-100 rounded-2xl transition-all text-center group border border-green-100 hover:border-green-200 shadow-sm hover:shadow-md">
              <IconComponent className="mx-auto mb-2.5 sm:mb-3 text-green-600 group-hover:text-green-700" size={28} />
              <div className="font-medium text-gray-800 mb-0.5 text-xs sm:text-sm leading-tight">
                {specialty.name[lang]}
              </div>
              <div className="text-[11px] sm:text-xs text-green-600 font-medium">
                {specialty.doctors.length} {t("specialty.doctors")}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SpecialtyGrid;