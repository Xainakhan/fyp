import React from "react";

const ExpertSection: React.FC = () => {
  return (
    <div className="w-full px-4 md:px-8 pt-25 md:pt-20
     pb-12 text-white">
      {/* Glass Container */}
      <div
        className="relative max-w-[1300px] mx-auto rounded-2xl overflow-hidden
                   bg-white/10 backdrop-blur-xl border border-white/20
                   shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_20px_60px_rgba(0,0,0,0.5)]
                   p-6 md:p-10"
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
          {/* LEFT CONTENT */}
          <div className="flex-1 max-w-[520px] text-left">
            <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
              Care you can trust – Backed by leading experts
            </h2>

            <p className="mt-4 text-white/80 text-sm md:text-[15px] leading-relaxed">
              Our team of 120+ technical and medical experts across Pakistan, 
              as well as our health clinics, are committed to making Pakistan 
              healthier and happier. With over 10,000+ patients, we blend 
              compassionate healthcare with cutting-edge Artificial Intelligence technology.
            </p>

            <button className="mt-6 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg text-sm font-medium shadow-lg">
              Try Free Scan Now
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex-1 flex justify-start lg:justify-end">
            <img
              src="src/assets/leading-expert.png"
              alt="Leading Experts"
              className="w-full max-w-[460px] h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertSection;