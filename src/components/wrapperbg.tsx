// components/BackgroundWrapper.tsx

import React, { type ReactNode } from 'react';

interface BackgroundWrapperProps {
  children: ReactNode;
  overlay?: boolean; // Optional: control overlay visibility
  overlayIntensity?: 'light' | 'medium' | 'strong'; // Optional: control overlay strength
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ 
  children, 
  overlay = true,
  overlayIntensity = 'medium'
}) => {
  const overlayStyles = {
    light: 'from-green-50/40 via-white/30 to-green-50/40',
    medium: 'from-green-50/60 via-white/50 to-green-50/60',
    strong: 'from-green-50/80 via-white/70 to-green-50/80',
  };

  return (
    <>
      {/* Background Layer - Fixed */}
      <div 
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: "url(src/assets/bg.jpeg), url(/src/assets/bg.jpeg), url(./assets/bg.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Light overlay for readability with greenish tint */}
        {overlay && (
          <div className={`absolute inset-0 bg-gradient-to-b ${overlayStyles[overlayIntensity]}`}></div>
        )}
      </div>

      {/* Content Layer - Scrollable */}
      <div className="relative z-10 min-h-screen w-full">
        {children}
      </div>
    </>
  );
};

export default BackgroundWrapper;