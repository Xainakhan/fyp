import React from "react";

/* Same RoboDoc icon */
const RoboDocIcon: React.FC = () => (
  <div
    style={{
      width: 30,
      height: 30,
      borderRadius: "50%",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      boxShadow: "0 2px 10px rgba(59,130,246,0.40)",
      border: "1px solid rgba(59,130,246,0.30)",
    }}
  >
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="8" width="16" height="12" rx="3" fill="white" fillOpacity="0.95" />
      <rect x="9" y="2" width="6" height="4" rx="1.5" fill="white" fillOpacity="0.95" />
      <line x1="12" y1="6" x2="12" y2="8" stroke="white" strokeWidth="1.5" />
      <circle cx="9" cy="13" r="1.5" fill="#3b82f6" />
      <circle cx="15" cy="13" r="1.5" fill="#3b82f6" />
      <rect x="9" y="16" width="6" height="1.5" rx="0.75" fill="#3b82f6" />
      <rect x="2" y="10" width="2" height="4" rx="1" fill="white" fillOpacity="0.9" />
      <rect x="20" y="10" width="2" height="4" rx="1" fill="white" fillOpacity="0.9" />
    </svg>
  </div>
);

export const TypingIndicator: React.FC = () => (
  <>
    <style>{`
      @keyframes rdc-dot-bounce {
        0%, 80%, 100% { transform: scale(0.65); opacity: 0.45; }
        40%           { transform: scale(1);    opacity: 1; }
      }
      .rdc-dot {
        width: 7px; height: 7px; border-radius: 50%;
        background: #4b5563;
        animation: rdc-dot-bounce 1.1s ease-in-out infinite both;
      }
      .rdc-dot:nth-child(2) { animation-delay: 0.18s; }
      .rdc-dot:nth-child(3) { animation-delay: 0.36s; }
    `}</style>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 7 }}>
      <RoboDocIcon />
      <div
        style={{
          padding: "11px 14px",
          borderRadius: 16,
          borderBottomLeftRadius: 4,
          background: "rgba(240,245,242,0.93)",
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <div className="rdc-dot" />
        <div className="rdc-dot" />
        <div className="rdc-dot" />
      </div>
    </div>
  </>
);
