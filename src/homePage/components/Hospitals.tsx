import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const hospitals = [
  { name: "Fauji Foundation Hospital", desc: "Northeast Healthcare, Phase 2, Islamabad." },
  { name: "Shifa International Hospital", desc: "Sector H-8/4, Islamabad." },
  { name: "PIMS Hospital", desc: "G-8/3, Islamabad." },
  { name: "Kulsum International", desc: "Blue Area, Islamabad." },
  { name: "Ali Medical Center", desc: "F-8 Markaz, Islamabad." },
  { name: "Maroof International", desc: "F-10 Markaz, Islamabad." },
  { name: "Medicsi Hospital", desc: "G-8/3, Islamabad." },
  { name: "CDA Hospital", desc: "G-6, Islamabad." },
  { name: "Poly Clinic", desc: "G-6/2, Islamabad." },
  { name: "Rawal Institute", desc: "Lehtrar Road, Islamabad." },
];

const HospitalSection: React.FC = () => {
  const { t, i18n } = useTranslation("home");
  const isRTL = i18n.language === "ur";
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrame: number;

    const scroll = () => {
      if (!isHovered.current) {
        // ✅ LEFT → RIGHT movement
        el.scrollLeft -= 0.6;

        // ✅ seamless loop
        if (el.scrollLeft <= 0) {
          el.scrollLeft = el.scrollWidth / 2;
        }
      }
      animationFrame = requestAnimationFrame(scroll);
    };

    scroll();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="w-full px-4 md:px-8 py-6">
      <div className="bg-[#c7d5ec] rounded-2xl p-6 shadow-xl">

        <h2
          className={`text-2xl md:text-3xl font-semibold text-black mb-6 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("hospitalSection.title")}
        </h2>

        <div
          ref={scrollRef}
          onMouseEnter={() => (isHovered.current = true)}
          onMouseLeave={() => (isHovered.current = false)}
          className="flex gap-4 overflow-hidden"
        >
          {[...hospitals, ...hospitals].map((h, i) => (
            <div
              key={i}
              className="min-w-[300px] max-w-[300px] bg-white rounded-xl p-4 shadow-md hover:scale-[1.03] transition flex items-center"
            >
              {isRTL ? (
                <>
                  {/* IMAGE LEFT (Urdu) */}
                  <img
                    src="src/assets/hospital.png"
                    alt="doctor"
                    className="w-[120px] h-[120px] object-contain mr-4 flex-shrink-0"
                  />
                  <div className="flex-1 text-right">
                    <h3 className="font-semibold text-sm text-black leading-tight">
                      {h.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 leading-snug">
                      {h.desc}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* TEXT LEFT (English) */}
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-sm text-black leading-tight">
                      {h.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 leading-snug">
                      {h.desc}
                    </p>
                  </div>
                  <img
                    src="src/assets/hospital.png"
                    alt="doctor"
                    className="w-[120px] h-[120px] object-contain ml-4 flex-shrink-0"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalSection;