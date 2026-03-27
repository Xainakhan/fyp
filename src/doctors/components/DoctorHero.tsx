import React from "react";

const HeroGlassCard: React.FC = () => {
  return (
    <div className="w-full px-4 md:px-16 pt-1 md:pt-13 pb-10 text-white flex justify-center">
      {/* MAIN WRAPPER */}
      <div
        className="relative w-full max-w-[1300px] 
                    bg-white/10 backdrop-blur-xl border border-white/20 
                    rounded-2xl p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                    flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
      >
        {/* RIGHT CONTENT */}
        <div className="max-w-[520px] text-center text-white">
          <h1 className="text-[28px] sm:text-[34px] md:text-[40px] font-semibold leading-[1.2]">
            Find the best doctors
            <br className="hidden sm:block" /> in Pakistan
          </h1>

          <p className="mt-4 text-white/80 text-[14px] md:text-[15px] leading-relaxed">
            Track your heart rate, blood pressure, and more with just your
            phone’s front camera — anytime, anywhere.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroGlassCard;