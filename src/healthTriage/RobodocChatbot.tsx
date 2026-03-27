import React, { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from "react";
import { useChatbot } from "./types/UseChatbot";
import { ChatMessage } from "./components/ChatMessage";
import { TypingIndicator } from "./components/TypingIndicator";
import { AnalysisModal } from "./components/AnalysisModal";
import {
  Activity, UserRound, Mic, MicOff, Send,
  Paperclip, X, FileText, ImageIcon, Bot,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface RoboDocChatbotProps {
  onNavigateToDoctor?: () => void;
  userName?: string;
  userAvatar?: string;
}

/* ─────────────────────────────────────────────
   Floating Action Button
───────────────────────────────────────────── */
const BotFAB: React.FC<{ onClick: () => void; hasUnread: boolean }> = ({ onClick, hasUnread }) => (
  <>
    <style>{`
      @keyframes fab-ring {
        0%,100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.55), 0 4px 20px rgba(59,130,246,0.35); }
        60%      { box-shadow: 0 0 0 10px rgba(59,130,246,0.0), 0 4px 20px rgba(59,130,246,0.35); }
      }
      @keyframes fab-dot-bounce {
        0%,100% { transform: translateY(0); }
        50%     { transform: translateY(-3px); }
      }
      .rdc-fab {
        position: fixed;
        bottom: 28px; right: 24px;
        width: 52px; height: 52px;
        border-radius: 50%; border: none; cursor: pointer;
        z-index: 8000;
        display: flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%);
        animation: fab-ring 2.6s ease-in-out infinite;
        transition: transform 0.18s;
        -webkit-tap-highlight-color: transparent;
      }
      .rdc-fab:hover  { transform: scale(1.09); }
      .rdc-fab:active { transform: scale(0.93); }
      .rdc-fab-unread {
        position: absolute; top: 5px; right: 5px;
        width: 11px; height: 11px; border-radius: 50%;
        background: #ef4444; border: 2px solid #0f172a;
        animation: fab-dot-bounce 1.5s ease-in-out infinite;
      }
    `}</style>
    <button className="rdc-fab" onClick={onClick} aria-label="Open Assistant">
      <Bot size={22} color="white" />
      {hasUnread && <span className="rdc-fab-unread" />}
    </button>
  </>
);

/* ─────────────────────────────────────────────
   File attachment pill
───────────────────────────────────────────── */
const FilePill: React.FC<{ file: File; onRemove: () => void }> = ({ file, onRemove }) => {
  const isImage = file.type.startsWith("image/");
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 8px 3px 6px", borderRadius: 20,
      background: "rgba(59,130,246,0.18)",
      border: "0.5px solid rgba(59,130,246,0.35)",
      maxWidth: 170,
    }}>
      {isImage
        ? <ImageIcon size={11} color="#93c5fd" />
        : <FileText size={11} color="#93c5fd" />
      }
      <span style={{
        fontSize: 11, color: "rgba(255,255,255,0.75)",
        overflow: "hidden", textOverflow: "ellipsis",
        whiteSpace: "nowrap", maxWidth: 108,
      }}>
        {file.name}
      </span>
      <button
        onClick={onRemove}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", color: "rgba(255,255,255,0.45)", flexShrink: 0 }}
      >
        <X size={11} />
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const RoboDocChatbot: React.FC<RoboDocChatbotProps> = ({
  onNavigateToDoctor,
  userName = "Ali",
  userAvatar,
}) => {
  const { t, i18n } = useTranslation("healthTriage");
  const isRTL = i18n.dir() === "rtl";

  const [open, setOpen]                 = useState(false);
  const [hasUnread, setHasUnread]       = useState(true);
  const [micActive, setMicActive]       = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    messages, inputValue, setInputValue, isTyping,
    diagnosis, userData, symptoms,
    showAnalysis, setShowAnalysis,
    chatContainerRef, textareaRef, messagesEndRef,
    handleSubmit, generatePDF,
  } = useChatbot();

  /* lock scroll on mobile */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* Escape */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    if (open) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open]);

  /* focus on open */
  useEffect(() => {
    if (open) {
      setHasUnread(false);
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [open]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setAttachedFile(f);
    e.target.value = "";
  };

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() && !attachedFile) return;
    handleSubmit(e);
    setAttachedFile(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const hasText    = inputValue.trim().length > 0;
  const canSend    = hasText || !!attachedFile;
  const greeting   = isRTL ? "مرحباً" : "Hola";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap');

        .rdc-root * { font-family:'Instrument Sans',sans-serif!important; box-sizing:border-box; }

        /* Backdrop */
        .rdc-backdrop {
          position:fixed; inset:0; z-index:8998;
          background:rgba(0,0,0,0.10);
          backdrop-filter:blur(2px); -webkit-backdrop-filter:blur(2px);
        }
        @media(min-width:481px){
          .rdc-backdrop{ background:rgba(0,0,0,0.24); backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px); }
        }

        /* Panel */
        @keyframes rdcSlide {
          from{ opacity:0; transform:translateY(-18px) scale(0.96); }
          to  { opacity:1; transform:translateY(0) scale(1); }
        }
        .rdc-panel {
          position:fixed; top:68px; right:20px;
          width:378px; height:620px; z-index:8999;
          background:rgba(10,20,14,0.62);
          backdrop-filter:blur(32px); -webkit-backdrop-filter:blur(32px);
          border:0.5px solid rgba(255,255,255,0.12); border-radius:18px;
          box-shadow:-4px 4px 4px 0 rgba(0,0,0,0.20),0 24px 60px rgba(0,0,0,0.55);
          animation:rdcSlide 0.28s cubic-bezier(0.22,1,0.36,1) forwards;
          display:flex; flex-direction:column; overflow:hidden;
        }
        @media(max-width:480px){
          .rdc-panel{ top:76px; right:10px; left:10px; width:auto; height:calc(100dvh - 98px); border-radius:16px; }
        }

        /* Header */
        .rdc-header {
          display:flex; align-items:center; gap:9px; padding:11px 13px;
          border-bottom:0.5px solid rgba(255,255,255,0.08); flex-shrink:0;
          background:rgba(10,22,18,0.55);
          backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
          position:relative; z-index:1;
        }
        .rdc-ava {
          width:35px; height:35px; border-radius:50%;
          background:linear-gradient(135deg,#10b981,#6366f1);
          display:flex; align-items:center; justify-content:center;
          font-size:13px; font-weight:700; color:white;
          flex-shrink:0; position:relative;
          border:1.5px solid rgba(16,185,129,0.35); overflow:hidden;
        }
        .rdc-online {
          position:absolute; bottom:0; right:0;
          width:9px; height:9px; border-radius:50%;
          background:#22c55e; border:2px solid rgba(10,20,14,0.9);
        }
        .rdc-close {
          margin-left:auto; width:30px; height:30px; border-radius:8px;
          background:rgba(255,255,255,0.08); border:0.5px solid rgba(255,255,255,0.13);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:rgba(255,255,255,0.55);
          transition:background 0.15s,color 0.15s; flex-shrink:0;
        }
        .rdc-close:hover{ background:rgba(255,255,255,0.16); color:white; }

        .rdc-pill-btn {
          display:flex; align-items:center; gap:4px;
          padding:3px 9px; border-radius:50px; font-size:11px;
          font-weight:600; color:white; cursor:pointer; border:none;
          white-space:nowrap; transition:opacity 0.15s;
        }
        .rdc-pill-btn:hover{ opacity:0.80; }

        /* Messages */
        .rdc-msgs {
          flex:1; overflow-y:auto; padding:12px 12px 6px;
          display:flex; flex-direction:column; gap:10px;
          scrollbar-width:none; position:relative; z-index:1;
        }
        .rdc-msgs::-webkit-scrollbar{ display:none; }

        /* Footer links */
        .rdc-ftr {
          display:flex; justify-content:center; gap:22px;
          padding:5px 0 4px;
          border-top:0.5px solid rgba(255,255,255,0.06);
          flex-shrink:0; position:relative; z-index:1;
        }
        .rdc-ftr span{ font-size:10.5px; color:rgba(255,255,255,0.27); cursor:pointer; transition:color 0.15s; }
        .rdc-ftr span:hover{ color:rgba(255,255,255,0.60); }

        /* Input */
        .rdc-input-wrap {
          flex-shrink:0; padding:8px 10px 10px;
          background:rgba(8,18,14,0.72);
          backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
          border-top:0.5px solid rgba(255,255,255,0.07);
          position:relative; z-index:1;
          display:flex; flex-direction:column; gap:6px;
        }
        .rdc-input-row{ display:flex; align-items:center; gap:7px; }
        .rdc-pill-input {
          flex:1; display:flex; align-items:center; gap:6px;
          padding:8px 12px; border-radius:50px;
          background:rgba(255,255,255,0.07);
          border:0.5px solid rgba(255,255,255,0.12);
          transition:border-color 0.2s,background 0.2s; min-width:0;
        }
        .rdc-pill-input:focus-within{
          border-color:rgba(59,130,246,0.40);
          background:rgba(255,255,255,0.09);
        }
        .rdc-clip {
          background:none; border:none; padding:0; cursor:pointer;
          color:rgba(255,255,255,0.35); display:flex; align-items:center; flex-shrink:0;
          transition:color 0.15s;
        }
        .rdc-clip:hover{ color:rgba(255,255,255,0.78); }
        .rdc-textarea {
          flex:1; background:transparent; outline:none; resize:none;
          font-size:13.5px; line-height:1.45; color:rgba(255,255,255,0.88);
          min-height:22px; max-height:96px; overflow-y:auto;
          scrollbar-width:none; caret-color:#3b82f6; min-width:0;
        }
        .rdc-textarea::-webkit-scrollbar{ display:none; }
        .rdc-textarea::placeholder{ color:rgba(255,255,255,0.27); }

        /* Circle buttons */
        .rdc-icon-btn {
          width:38px; height:38px; border-radius:50%; border:none;
          cursor:pointer; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          transition:transform 0.14s,opacity 0.18s;
          -webkit-tap-highlight-color:transparent;
        }
        .rdc-icon-btn:active{ transform:scale(0.88); }
        .rdc-icon-btn:disabled{ opacity:0.35; cursor:not-allowed; }

        @keyframes mic-ring {
          0%  { box-shadow:0 0 0 0   rgba(239,68,68,0.65),0 2px 12px rgba(239,68,68,0.35); }
          70% { box-shadow:0 0 0 8px rgba(239,68,68,0.0), 0 2px 12px rgba(239,68,68,0.35); }
          100%{ box-shadow:0 0 0 0   rgba(239,68,68,0.0), 0 2px 12px rgba(239,68,68,0.35); }
        }
        .rdc-mic-active{ animation:mic-ring 1.1s ease-out infinite; }

        /* Ambient */
        .rdc-glow {
          position:absolute; inset:0; pointer-events:none; z-index:0;
          background:
            radial-gradient(ellipse 70% 50% at 15% 70%,rgba(16,185,129,0.08) 0%,transparent 65%),
            radial-gradient(ellipse 50% 40% at 85% 15%,rgba(99,102,241,0.06) 0%,transparent 65%);
        }
      `}</style>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* FAB — always rendered */}
      <BotFAB onClick={() => setOpen((v) => !v)} hasUnread={hasUnread} />

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="rdc-backdrop"
            onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          />

          {/* Chat panel */}
          <div className="rdc-panel rdc-root" role="dialog" aria-modal="true" aria-label="AI Assistant">
            <div className="rdc-glow" />

            {/* ── Header ── */}
            <div className="rdc-header">
              <div className="rdc-ava">
                {userAvatar
                  ? <img src={userAvatar} alt={userName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : userName.charAt(0).toUpperCase()
                }
                <span className="rdc-online" />
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ color: "white", fontWeight: 700, fontSize: 14.5, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {greeting} {userName},
                </div>
                <div style={{ color: "rgba(52,211,153,0.80)", fontSize: 10.5, fontWeight: 500, marginTop: 1 }}>
                  AI Health Assistant • Online
                </div>
              </div>

              {diagnosis && (
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  <button
                    className="rdc-pill-btn"
                    style={{ background: "rgba(16,185,129,0.25)", border: "0.5px solid rgba(16,185,129,0.4)" }}
                    onClick={() => setShowAnalysis(true)}
                  >
                    <Activity size={10} /> Report
                  </button>
                  <button
                    className="rdc-pill-btn"
                    style={{ background: "rgba(99,102,241,0.25)", border: "0.5px solid rgba(99,102,241,0.4)" }}
                    onClick={onNavigateToDoctor}
                  >
                    <UserRound size={10} /> Doctor
                  </button>
                </div>
              )}

              <button className="rdc-close" onClick={() => setOpen(false)} aria-label="Close">
                <X size={14} strokeWidth={2.2} />
              </button>
            </div>

            {/* ── Messages ── */}
            <div className="rdc-msgs" ref={chatContainerRef}>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* ── Footer links ── */}
            <div className="rdc-ftr">
              <span>Chat Support</span>
              <span>Privacy Policy</span>
            </div>

            {/* ── Input area ── */}
            <div className="rdc-input-wrap">
              {/* Attached file badge */}
              {attachedFile && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingInline: 2 }}>
                  <FilePill file={attachedFile} onRemove={() => setAttachedFile(null)} />
                </div>
              )}

              <form className="rdc-input-row" onSubmit={onFormSubmit}>
                {/* Input pill with paperclip */}
                <div className="rdc-pill-input">
                  <button
                    type="button"
                    className="rdc-clip"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach file"
                    aria-label="Attach file"
                  >
                    <Paperclip size={15} />
                  </button>

                  <textarea
                    ref={textareaRef}
                    className="rdc-textarea"
                    rows={1}
                    placeholder={t("chat.placeholder", "Type your message...")}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px";
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        (e.currentTarget.closest("form") as HTMLFormElement)?.requestSubmit();
                      }
                    }}
                    style={{ direction: isRTL ? "rtl" : "ltr" }}
                  />
                </div>

                {/* Mic */}
                <button
                  type="button"
                  className={`rdc-icon-btn${micActive ? " rdc-mic-active" : ""}`}
                  onClick={() => setMicActive((v) => !v)}
                  aria-label={micActive ? "Stop recording" : "Voice input"}
                  style={{
                    background: micActive
                      ? "linear-gradient(135deg,#ef4444,#dc2626)"
                      : "linear-gradient(135deg,#3b82f6,#2563eb)",
                    boxShadow: micActive
                      ? "0 2px 12px rgba(239,68,68,0.45)"
                      : "0 2px 12px rgba(59,130,246,0.45)",
                  }}
                >
                  {micActive ? <MicOff size={16} color="white" /> : <Mic size={16} color="white" />}
                </button>

                {/* Send */}
                <button
                  type="submit"
                  className="rdc-icon-btn"
                  disabled={isTyping || !canSend}
                  aria-label="Send message"
                  style={{
                    background: canSend
                      ? "linear-gradient(135deg,#10b981,#3b82f6)"
                      : "rgba(255,255,255,0.09)",
                    boxShadow: canSend ? "0 2px 12px rgba(16,185,129,0.40)" : "none",
                    border: canSend ? "none" : "0.5px solid rgba(255,255,255,0.11)",
                  }}
                >
                  <Send size={15} color={canSend ? "white" : "rgba(255,255,255,0.32)"} />
                </button>
              </form>
            </div>
          </div>

          {/* Analysis modal */}
          {showAnalysis && diagnosis && (
            <AnalysisModal
              diagnosis={diagnosis}
              userData={userData}
              symptoms={symptoms}
              onClose={() => setShowAnalysis(false)}
              onNavigateToDoctor={onNavigateToDoctor}
              onDownload={() => generatePDF(userData, symptoms, diagnosis)}
            />
          )}
        </>
      )}
    </>
  );
};

export default RoboDocChatbot;
