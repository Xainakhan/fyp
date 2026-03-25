import React, { type ReactNode } from 'react';

interface BackgroundWrapperProps {
  children: ReactNode;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children }) => {
  return (
    <>
      {/* Background Layer - Fixed with original image */}
      <div 
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: "url(src/assets/bg.jpeg), url(/src/assets/bg.jpeg), url(./assets/bg.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Content Layer - Scrollable */}
      <div className="relative z-10 min-h-screen w-full">
        {children}
      </div>
    </>
  );
};

export default BackgroundWrapper;