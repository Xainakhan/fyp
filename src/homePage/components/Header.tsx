import React from "react";

const HeroGlassCard: React.FC = () => {
  return (
    <div className="w-full px-4 md:px-8 pt-1 md:pt-13 pb-10 text-white">
      {/* MAIN WRAPPER */}
      <div className="relative w-full max-w-[1300px] mx-auto 
                      bg-white/10 backdrop-blur-xl border border-white/20 
                      rounded-2xl p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">

        {/* CONTENT */}
        <div className="flex flex-col md:flex-row items-center h-full gap-8 md:gap-16">

          {/* IMAGE */}
          <div className="w-[200px] md:w-[320px] flex-shrink-0">
            <img
              src="src/assets/header.png"
              alt="person"
              className="w-full h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="max-w-[520px] text-center md:text-left text-white">
            <h1 className="text-[28px] sm:text-[34px] md:text-[40px] font-semibold leading-[1.2]">
              Pakistan's First <br className="hidden sm:block" /> AI Enabled App
            </h1>

            <p className="mt-4 text-white/80 text-[14px] md:text-[15px] leading-relaxed">
              Track your heart rate, blood pressure, and more with just your
              phone's front camera — anytime, anywhere.
            </p>

            {/* STORE BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 items-center md:items-start justify-center md:justify-start">
              {/* Google Play */}
              <div className="flex items-center gap-3 bg-black px-4 py-2 rounded-lg cursor-pointer hover:scale-105 transition w-full sm:w-auto justify-center sm:justify-start">
                <svg width="28" height="28" viewBox="0 0 24 24" className="flex-shrink-0">
                  <path fill="#34A853" d="M3 2.5c-.4.2-.7.6-.7 1.1v16.8c0 .5.3.9.7 1.1l9.6-9.5L3 2.5z" />
                  <path fill="#EA4335" d="M13.3 11.3l2.3-2.3L4.5 2.5l8.8 8.8z" />
                  <path fill="#FBBC04" d="M13.3 12.7l-8.8 8.8 11.1-6.5-2.3-2.3z" />
                  <path fill="#4285F4" d="M16.7 8.3l-1.1.7-2.3 2.3 2.3 2.3 1.1.7c.9.5 2 .5 2.9 0 1.3-.7 1.3-2.6 0-3.3-.9-.5-2-.5-2.9 0z" />
                </svg>
                <div className="text-left leading-tight">
                  <p className="text-[10px] text-white/70">GET IT ON</p>
                  <p className="text-sm font-semibold">Google Play</p>
                </div>
              </div>

              {/* App Store */}
              <div className="flex items-center gap-3 bg-black px-4 py-2 rounded-lg cursor-pointer hover:scale-105 transition w-full sm:w-auto justify-center sm:justify-start">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="flex-shrink-0">
                  <path d="M16.365 1.43c0 1.14-.47 2.19-1.24 2.97-.77.78-1.85 1.27-2.97 1.2-.09-1.11.44-2.26 1.21-3.03.78-.78 2.06-1.34 3-1.14zM20.5 17.05c-.4.9-.6 1.3-1.12 2.1-.72 1.13-1.74 2.55-3 2.56-1.11.01-1.4-.72-2.92-.72-1.52 0-1.86.71-2.95.73-1.26.02-2.2-1.27-2.92-2.4-2.01-3.12-2.23-6.78-.98-8.75.88-1.4 2.27-2.28 3.54-2.28 1.33 0 2.17.73 3.27.73 1.06 0 1.7-.74 3.25-.74.99 0 2.03.54 2.9 1.46-2.56 1.4-2.14 5.06.93 6.21z" />
                </svg>
                <div className="text-left leading-tight">
                  <p className="text-[10px] text-white/70">Download on the</p>
                  <p className="text-sm font-semibold">App Store</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default HeroGlassCard;