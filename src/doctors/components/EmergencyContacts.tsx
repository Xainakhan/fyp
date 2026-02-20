// doctors/components/EmergencyContacts.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Phone, Building, Heart, AlertTriangle } from "lucide-react";

const EmergencyContacts: React.FC = () => {
  const { t } = useTranslation("doctors");

  const contacts = [
    { icon: <Phone size={28} />, label: t("emergency.services"), number: "1122", sub: t("emergency.247") },
    { icon: <Building size={28} />, label: t("emergency.poison"), number: "1166", sub: t("emergency.poisonHelp") },
    { icon: <Heart size={28} />, label: t("emergency.ambulance"), number: "115", sub: t("emergency.medTransport") },
    { icon: <AlertTriangle size={28} />, label: t("emergency.police"), number: "15", sub: t("emergency.emergencyPolice") },
  ];

  return (
    <div className="bg-red-50/90 border border-red-200 p-6 sm:p-8 rounded-3xl mb-8">
      <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-5 sm:mb-6 flex items-center justify-center gap-2">
        <AlertTriangle className="text-red-600" />
        {t("emergency.title")}
      </h3>
      <div className="grid md:grid-cols-4 gap-4 sm:gap-6">
        {contacts.map((c, i) => (
          <div key={i} className="bg-white/90 p-5 rounded-2xl border border-red-200 text-center shadow-sm">
            <div className="flex justify-center mb-2.5 text-red-600">{c.icon}</div>
            <div className="font-bold text-red-800 mb-0.5 text-sm sm:text-base">{c.label}</div>
            <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-0.5">{c.number}</div>
            <div className="text-xs sm:text-sm text-red-600">{c.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyContacts;