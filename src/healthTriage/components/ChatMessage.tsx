import React from "react";
import { useTranslation } from "react-i18next";
import type { Message } from "../types/Types";

/* ── RoboDoc bot icon — blue robot circle ── */
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

/* ── Generic user avatar silhouette ── */
const UserAvatar: React.FC = () => (
  <div
    style={{
      width: 30,
      height: 30,
      borderRadius: "50%",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(255,255,255,0.11)",
      border: "0.5px solid rgba(255,255,255,0.15)",
    }}
  >
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.55)" />
      <path
        d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { i18n } = useTranslation("healthTriage");
  const isUser = message.sender === "user";
  const isRTL = i18n.dir() === "rtl";

  const timeStr = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 7,
        flexDirection: isUser ? "row-reverse" : "row",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      {/* Avatar */}
      {isUser ? <UserAvatar /> : <RoboDocIcon />}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          maxWidth: "72%",
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
      >
        {/* Timestamp + seen — above bubble, like screenshot */}
        {timeStr && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              paddingInline: 2,
              flexDirection: isUser ? "row-reverse" : "row",
            }}
          >
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.32)" }}>{timeStr}</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>seen</span>
          </div>
        )}

        {/* Bubble */}
        <div
          style={{
            padding: "9px 13px",
            borderRadius: 16,
            fontSize: 13.5,
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            ...(isUser
              ? {
                  /* user — slightly lighter dark, screenshot right side */
                  background: "rgba(50,62,55,0.80)",
                  backdropFilter: "blur(10px)",
                  border: "0.5px solid rgba(255,255,255,0.10)",
                  color: "rgba(255,255,255,0.90)",
                  borderBottomRightRadius: 4,
                }
              : {
                  /* bot — white bubble like screenshot left side */
                  background: "rgba(240,245,242,0.93)",
                  color: "#1a2e24",
                  borderBottomLeftRadius: 4,
                }),
          }}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
};
