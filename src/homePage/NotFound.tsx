import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full px-4 md:px-8 py-10 text-white">
      {/* MAIN WRAPPER — identical glass card to HeroGlassCard */}
<div className="relative w-full max-w-[1300px] mx-auto glass-card">
        {/* dark green overlay — matches header card tint */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-[#0d2b1e]/70"
        />

        {/* content */}
        <div className="relative z-10 flex flex-col items-start gap-4 p-8 md:p-12">

          {/* Ghost 404 */}
          <p className="text-[90px] md:text-[120px] font-bold leading-none text-white/10 select-none -mb-2">
            404
          </p>

          {/* Headline */}
          <h1 className="text-[24px] sm:text-[30px] md:text-[36px] font-semibold leading-[1.25] text-white">
            Oops. This page Slipped
            <br />
            from Table!
          </h1>

          {/* Back to Home button */}
          <button
            onClick={() => navigate("/")}
            className="mt-2 inline-flex items-center gap-2
                       bg-[#6abf4b] hover:bg-[#5aad3b] active:scale-95
                       text-white text-[13px] font-medium
                       px-5 py-2.5 rounded-lg
                       transition-all duration-200
                       shadow-[0_4px_14px_rgba(106,191,75,0.35)]"
          >
            <ArrowLeft size={15} strokeWidth={2.5} />
            Back to Home
          </button>

        </div>
      </div>
    </div>
  );
};

export default NotFound;