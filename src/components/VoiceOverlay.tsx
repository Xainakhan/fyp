/**
 * VoiceOverlay.tsx  (v2)
 *
 * Shows guided fill mode with a different colour + label so the user
 * always knows what mode they're in.
 */

import React from "react";
import { useVoiceControl } from "../context/VoiceControlContext";
import { Mic, Volume2, ClipboardList } from "lucide-react";

const BAR_COUNT = 5;

const VoiceOverlay: React.FC = () => {
  const {
    voiceActive,
    isListening,
    isSpeaking,
    transcript,
    lastCommand,
    guidedFillActive,
  } = useVoiceControl();

  if (!voiceActive) return null;

  // colour changes in guided fill mode
  const accentColor = guidedFillActive ? "#f59e0b" : "#22c55e";
  const borderColor = guidedFillActive
    ? "rgba(245,158,11,0.45)"
    : "rgba(34,197,94,0.35)";

  return (
    <>
      <style>{`
        @keyframes vc-bar {
          0%, 100% { transform: scaleY(0.3); }
          50%       { transform: scaleY(1); }
        }
        .vc-bar {
          width: 3px; border-radius: 2px;
          transform-origin: bottom;
          animation: vc-bar 0.9s ease-in-out infinite;
        }
        @keyframes vc-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .vc-speak-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #f59e0b;
          animation: vc-pulse 1s ease-in-out infinite;
        }
      `}</style>

      <div style={{
        position: "fixed", bottom: 20, left: "50%",
        transform: "translateX(-50%)", zIndex: 9999,
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 18px", borderRadius: 999,
        background: "rgba(10, 20, 14, 0.93)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${borderColor}`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        maxWidth: "90vw", minWidth: 240,
        transition: "border-color 0.3s",
      }}>

        {/* Mode icon */}
        {guidedFillActive ? (
          <ClipboardList size={14} color={accentColor} />
        ) : isSpeaking ? (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Volume2 size={14} color="#f59e0b" />
            <span className="vc-speak-dot" />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Mic size={14} color={isListening ? accentColor : "rgba(255,255,255,0.4)"} />
            {isListening && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 16 }}>
                {Array.from({ length: BAR_COUNT }).map((_, i) => (
                  <div
                    key={i}
                    className="vc-bar"
                    style={{
                      height: 14 + (i % 2) * 4,
                      background: accentColor,
                      animationDelay: `${i * 0.12}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Label */}
        {guidedFillActive && (
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: accentColor, letterSpacing: "0.05em",
            whiteSpace: "nowrap",
          }}>
            GUIDED FILL
          </span>
        )}

        {/* Text */}
        <div style={{ overflow: "hidden", maxWidth: 280 }}>
          {transcript ? (
            <p style={{
              margin: 0, fontSize: 13, color: "#d1fae5",
              fontStyle: "italic", whiteSpace: "nowrap",
              overflow: "hidden", textOverflow: "ellipsis",
            }}>
              "{transcript}"
            </p>
          ) : lastCommand ? (
            <p style={{
              margin: 0, fontSize: 12,
              color: "rgba(255,255,255,0.55)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              ✓ {lastCommand}
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              {guidedFillActive
                ? "Say the value…"
                : isListening
                  ? "Listening…"
                  : "Voice control on"}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default VoiceOverlay;