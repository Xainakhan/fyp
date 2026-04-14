/**
 * VoiceOverlay.tsx (v3)
 *
 * When a select/dropdown field is active in guided fill, a row of
 * option chips appears above the pill so the user can see choices visually.
 */

import React from "react";
import { useVoiceControl } from "../context/VoiceControlContext";
import { Mic, Volume2, ClipboardList } from "lucide-react";

const BAR_COUNT = 5;

const VoiceOverlay: React.FC = () => {
  const {
    voiceActive, isListening, isSpeaking,
    transcript, lastCommand,
    guidedFillActive, currentGuidedField,
  } = useVoiceControl();

  if (!voiceActive) return null;

  const accentColor = guidedFillActive ? "#f59e0b" : "#22c55e";
  const borderColor = guidedFillActive ? "rgba(245,158,11,0.45)" : "rgba(34,197,94,0.35)";
  const hasOptions  = guidedFillActive && (currentGuidedField?.options?.length ?? 0) > 0;

  return (
    <>
      <style>{`
        @keyframes vc-bar { 0%,100%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} }
        .vc-bar { width:3px; border-radius:2px; transform-origin:bottom; animation:vc-bar 0.9s ease-in-out infinite; }
        @keyframes vc-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .vc-dot { width:8px;height:8px;border-radius:50%;background:#f59e0b;animation:vc-pulse 1s ease-in-out infinite; }
        .vc-chip { padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600;
          background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);
          color:rgba(255,255,255,0.8);white-space:nowrap;cursor:default;transition:background 0.15s; }
        .vc-chip:hover { background:rgba(255,255,255,0.18); }
      `}</style>

      <div style={{
        position: "fixed", bottom: 20, left: "50%",
        transform: "translateX(-50%)", zIndex: 9999,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        maxWidth: "90vw",
      }}>

        {/* Option chips row (only for select fields) */}
        {hasOptions && (
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 5,
            justifyContent: "center",
            padding: "6px 12px",
            background: "rgba(10,20,14,0.88)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${borderColor}`,
            borderRadius: 14,
          }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", alignSelf: "center", marginRight: 4 }}>
              SAY:
            </span>
            {currentGuidedField!.options!.map((opt) => (
              <span key={opt.value} className="vc-chip">
                {opt.label}
                {opt.urduLabel ? ` / ${opt.urduLabel}` : ""}
              </span>
            ))}
          </div>
        )}

        {/* Main pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 18px", borderRadius: 999,
          background: "rgba(10,20,14,0.93)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${borderColor}`,
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
          minWidth: 240, transition: "border-color 0.3s",
        }}>

          {/* Icon */}
          {guidedFillActive ? (
            <ClipboardList size={14} color={accentColor} />
          ) : isSpeaking ? (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Volume2 size={14} color="#f59e0b" /><span className="vc-dot" />
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Mic size={14} color={isListening ? accentColor : "rgba(255,255,255,0.4)"} />
              {isListening && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 16 }}>
                  {Array.from({ length: BAR_COUNT }).map((_, i) => (
                    <div key={i} className="vc-bar" style={{
                      height: 14 + (i % 2) * 4,
                      background: accentColor,
                      animationDelay: `${i * 0.12}s`,
                    }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Guided fill badge */}
          {guidedFillActive && (
            <span style={{
              fontSize: 10, fontWeight: 700, color: accentColor,
              letterSpacing: "0.06em", whiteSpace: "nowrap",
            }}>
              {currentGuidedField ? currentGuidedField.label.toUpperCase() : "GUIDED FILL"}
            </span>
          )}

          {/* Text */}
          <div style={{ overflow: "hidden", maxWidth: 260 }}>
            {transcript ? (
              <p style={{ margin:0, fontSize:13, color:"#d1fae5", fontStyle:"italic", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                "{transcript}"
              </p>
            ) : lastCommand ? (
              <p style={{ margin:0, fontSize:12, color:"rgba(255,255,255,0.55)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                ✓ {lastCommand}
              </p>
            ) : (
              <p style={{ margin:0, fontSize:12, color:"rgba(255,255,255,0.4)" }}>
                {guidedFillActive ? "Say the value…" : isListening ? "Listening…" : "Voice control on"}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VoiceOverlay;