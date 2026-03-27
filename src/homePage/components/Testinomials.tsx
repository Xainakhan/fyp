import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const testimonials = [
  {
    name: "Misbah Khan",
    text: "My first appointment today. It was a very smooth experience and the skin specialist was very helpful and professional. Experiences so far — facility is also very good.",
    tag: "Good",
  },
  {
    name: "Mudassar Irfan",
    text: "It is really a good initiative to connect with healthcare personnel. If you feel a need for help, the helpline is there to take care of it. Overall, a very good experience.",
    tag: "Satisfied",
  },
  {
    name: "Umair Ali",
    text: "Got late for my appointment, but after 10 minutes, the doctor called me and prescribed medicines.",
    tag: "Good",
  },
  {
    name: "Ayesha Noor",
    text: "Loved the interface and ease of use.",
    tag: "Excellent",
  },
  {
    name: "Hamza Tariq",
    text: "Quick consultation and reliable system.",
    tag: "Good",
  },
  {
    name: "Ali Raza",
    text: "Best healthcare experience online.",
    tag: "Satisfied",
  },
  { name: "Sara Khan", text: "Very smooth and modern UI.", tag: "Excellent" },
];

const TestimonialSection: React.FC = () => {
  const { t, i18n } = useTranslation("home");
  const isRTL = i18n.language === "ur";

  const trackRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);

  useEffect(() => {
    let frame: number;
    const speed = 0.8; // smooth & fast

    const track = trackRef.current;
    if (!track) return;

    // Start from left side (for smooth loop)
    let pos = -track.scrollWidth / 2;

    const animate = () => {
      if (!isHovered.current && trackRef.current) {
        pos += speed;

        // ALWAYS move LEFT → RIGHT
        trackRef.current.style.transform = `translateX(${pos}px)`;

        const width = trackRef.current.scrollWidth / 2;

        // Reset seamlessly
        if (pos >= 0) {
          pos = -width;
        }
      }
      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  const ordered = isRTL ? [...testimonials].reverse() : testimonials;

  return (
    <div className="w-full px-4 md:px-8 py-10 text-white overflow-hidden">
      <h2
        className={`text-2xl md:text-4xl font-semibold mb-6 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {t("testimonialSection.title")}
      </h2>

      <div
        className="overflow-hidden"
        onMouseEnter={() => (isHovered.current = true)}
        onMouseLeave={() => (isHovered.current = false)}
      >
        <div ref={trackRef} className="flex gap-4 w-max">
          {[...ordered, ...ordered].map((t_item, i) => (
            <div
              key={i}
              className="min-w-[270px] max-w-[270px]
              bg-white/10 backdrop-blur-xl
              border border-white/20
              rounded-2xl p-4
              shadow-xl
              flex flex-col justify-between
              hover:scale-[1.03] transition"
            >
              <div>
                <h3
                  className={`font-semibold ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t_item.name}
                </h3>

                <p
                  className={`text-sm text-white/80 mt-2 leading-relaxed ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t_item.text}
                </p>
              </div>

              <div
                className={`mt-4 bg-white text-black rounded-xl px-3 py-2 flex items-center justify-between ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <span className="text-sm font-medium">{t_item.tag}</span>
                <span className="text-sm">☆☆☆☆☆</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;