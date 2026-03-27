// doctors/components/EmergencyContacts.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Phone, Building, Heart, AlertTriangle } from "lucide-react";

const EmergencyContacts: React.FC = () => {
  const { t } = useTranslation("doctors");

  const contacts = [
    { icon: <Phone size={26} />, label: t("emergency.services"), number: "1122", sub: t("emergency.247"), color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
    { icon: <Building size={26} />, label: t("emergency.poison"), number: "1166", sub: t("emergency.poisonHelp"), color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
    { icon: <Heart size={26} />, label: t("emergency.ambulance"), number: "115", sub: t("emergency.medTransport"), color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
    { icon: <AlertTriangle size={26} />, label: t("emergency.police"), number: "15", sub: t("emergency.emergencyPolice"), color: "#b91c1c", bg: "#fef2f2", border: "#fecaca" },
  ];

  return (
    <div style={{
      background: "linear-gradient(135deg, #fff1f2 0%, #fef2f2 100%)",
      border: "1px solid #fecaca",
      borderRadius: 24,
      padding: "28px 28px",
      marginBottom: 28,
    }}>
      <h3 style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        fontSize: 20, fontWeight: 800, color: "#991b1b",
        margin: "0 0 22px", textAlign: "center",
      }}>
        <AlertTriangle size={22} color="#dc2626" />
        {t("emergency.title")}
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14 }}>
        {contacts.map((c, i) => (
          <a key={i} href={`tel:${c.number}`} style={{
            background: "white",
            border: `1px solid ${c.border}`,
            borderRadius: 16,
            padding: "20px 14px",
            textAlign: "center",
            textDecoration: "none",
            display: "block",
            boxShadow: "0 2px 8px rgba(220,38,38,0.07)",
            transition: "transform 0.15s, box-shadow 0.15s",
            cursor: "pointer",
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(220,38,38,0.15)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 8px rgba(220,38,38,0.07)";
            }}
          >
            <div style={{ color: c.color, display: "flex", justifyContent: "center", marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontWeight: 700, color: "#7f1d1d", fontSize: 13, marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: c.color, lineHeight: 1, marginBottom: 4 }}>{c.number}</div>
            <div style={{ fontSize: 11.5, color: "#b91c1c" }}>{c.sub}</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default EmergencyContacts;