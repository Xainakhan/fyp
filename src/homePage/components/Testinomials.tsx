import React from "react";
import { useTranslation } from "react-i18next";

const TESTIMONIALS_EN = [
  { name: "Misbah Khan", text: "My first appointment today. It was a very smooth experience and the skin specialist was very helpful and professional.", tag: "Good" },
  { name: "Mudassar Irfan", text: "It is really a good initiative to connect with healthcare personnel. Overall, a very good experience.", tag: "Satisfied" },
  { name: "Umair Ali", text: "Got late for my appointment, but after 10 minutes, the doctor called me and prescribed medicines.", tag: "Good" },
  { name: "Ayesha Noor", text: "Loved the interface and ease of use.", tag: "Excellent" },
  { name: "Hamza Tariq", text: "Quick consultation and reliable system.", tag: "Good" },
];

const TESTIMONIALS_UR = [
  { name: "مصباح خان", text: "آج میری پہلی ملاقات تھی۔ یہ ایک بہت ہموار تجربہ رہا اور جلد کے ماہر بہت مددگار اور پیشہ ور تھے۔", tag: "اچھا" },
  { name: "مدثر عرفان", text: "صحت کے اہلکاروں سے جڑنے کے لیے یہ واقعی ایک اچھا اقدام ہے۔ مجموعی طور پر بہت اچھا تجربہ رہا۔", tag: "مطمئن" },
  { name: "عمیر علی", text: "اپنی ملاقات کے لیے دیر ہو گئی، لیکن 10 منٹ بعد ڈاکٹر نے خود کال کی اور دوائیں تجویز کیں۔", tag: "اچھا" },
  { name: "عائشہ نور", text: "انٹرفیس اور استعمال میں آسانی بہت پسند آئی۔", tag: "بہترین" },
  { name: "حمزہ طارق", text: "فوری مشاورت اور قابل اعتماد نظام۔", tag: "اچھا" },
];

const CARD_WIDTH = 270;
const CARD_GAP = 16;
const CARD_STEP = CARD_WIDTH + CARD_GAP;

const TestimonialSection: React.FC = () => {
  const { t, i18n } = useTranslation("home");
  const isRTL = i18n.language === "ur";

  const testimonials = isRTL ? TESTIMONIALS_UR : TESTIMONIALS_EN;
  const totalWidth = testimonials.length * CARD_STEP;

  // CSS keyframes: LTR scrolls left→right, RTL scrolls right→left
  const keyframes = isRTL
    ? `@keyframes scroll-rtl {
        0%   { transform: translateX(0); }
        100% { transform: translateX(${totalWidth}px); }
      }`
    : `@keyframes scroll-ltr {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-${totalWidth}px); }
      }`;

  const animationName = isRTL ? "scroll-rtl" : "scroll-ltr";
  // speed: ~12s per set of 5 cards feels smooth
  const duration = `${testimonials.length * 3}s`;

  // Duplicate cards for seamless loop
  const doubled = [...testimonials, ...testimonials];

  return (
    <div className="w-full px-4 md:px-8 py-10 text-white overflow-hidden">
      <style>{`
        ${keyframes}
        .sh-track {
          animation: ${animationName} ${duration} linear infinite;
        }
        .sh-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <h2
        className={`text-2xl md:text-4xl font-semibold mb-6 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {t("testimonialSection.title")}
      </h2>

      <div style={{ overflow: "hidden", width: "100%" }}>
        <div
          className="sh-track"
          style={{
            display: "flex",
            gap: CARD_GAP,
            width: "max-content",
          }}
        >
          {doubled.map((item, i) => (
            <div
              key={`${isRTL ? "ur" : "en"}-${i}`}
              style={{
                minWidth: CARD_WIDTH,
                maxWidth: CARD_WIDTH,
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 16,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <div>
                <h3
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    color: "white",
                    textAlign: isRTL ? "right" : "left",
                    margin: 0,
                  }}
                >
                  {item.name}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.75)",
                    marginTop: 8,
                    lineHeight: 1.6,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {item.text}
                </p>
              </div>

              <div
                style={{
                  marginTop: 16,
                  background: "white",
                  color: "black",
                  borderRadius: 12,
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: isRTL ? "row-reverse" : "row",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600 }}>{item.tag}</span>
                <span style={{ fontSize: 13 }}>☆☆☆☆☆</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;