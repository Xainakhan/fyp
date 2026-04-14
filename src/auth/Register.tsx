import { useState, useEffect, useRef } from "react";
import { useVoiceForm } from "../context/useVoiceForm";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;  // ✅ This is correct
  userLanguage?: string;
}

export default function RegisterModal({ open, onClose, onNavigate, userLanguage: _userLanguage }: RegisterModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Refs so voice can focus each field ──
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
  };

  // Helper function to handle navigation
  const handleNavigate = (page: string) => {
    onClose();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  // ── Register all 4 fields with VoiceControlProvider ──
  useVoiceForm({
    formId: "register-form",
    fields: [
      {
        id: "name",
        label: "Full Name",
        keywords: ["name", "full name", "my name"],
        urduKeywords: ["naam", "apna naam", "full name"],
        setValue: setName,
        ref: nameRef,
      },
      {
        id: "phone",
        label: "Phone Number",
        keywords: ["phone", "number", "mobile", "phone number"],
        urduKeywords: ["phone", "nambur", "mobile nambur"],
        setValue: setPhone,
        ref: phoneRef,
      },
      {
        id: "password",
        label: "Password",
        keywords: ["password", "pass"],
        urduKeywords: ["password", "pass word"],
        setValue: setPassword,
        ref: passwordRef,
      },
      {
        id: "confirm",
        label: "Confirm Password",
        keywords: ["confirm", "confirm password", "repeat password"],
        urduKeywords: ["confirm", "dobara password", "confirm password"],
        setValue: setConfirm,
        ref: confirmRef,
      },
    ],
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const EyeOpen = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
  const EyeOff = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap');

        .rm-root * { font-family: 'Instrument Sans', sans-serif !important; box-sizing: border-box; }

        .rm-backdrop {
          position: fixed; inset: 0; z-index: 9998;
          background: rgba(0,0,0,0.08);
          backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px);
        }
        @media (min-width: 481px) {
          .rm-backdrop { background: rgba(0,0,0,0.22); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
        }

        @keyframes rmSlideDown {
          from { opacity: 0; transform: translateY(-14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .rm-card {
          position: fixed; top: 68px; right: 20px;
          width: 420px; z-index: 9999;
          background: rgba(14,26,18,0.45);
          backdrop-filter: blur(32px); -webkit-backdrop-filter: blur(32px);
          border: 0.5px solid rgba(255,255,255,0.12); border-radius: 18px;
          padding: 28px 36px 28px;
          box-shadow: -4px 4px 4px 0px rgba(0,0,0,0.15), 0 24px 60px rgba(0,0,0,0.35);
          animation: rmSlideDown 0.28s cubic-bezier(0.22,1,0.36,1) forwards;
          max-height: 92vh; overflow-y: auto;
        }

        .rm-close {
          position: absolute; top: 14px; right: 14px;
          width: 26px; height: 26px; border-radius: 6px;
          background: rgba(255,255,255,0.08); border: 0.5px solid rgba(255,255,255,0.13);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(255,255,255,0.50); transition: background 0.15s, color 0.15s;
        }
        .rm-close:hover { background: rgba(255,255,255,0.14); color: white; }

        .rm-label {
          display: block; color: rgba(255,255,255,0.80); font-size: 11.5px;
          font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 6px;
        }

        .rm-input {
          width: 100%; background: transparent; border: none;
          border-bottom: 1px solid rgba(255,255,255,0.22);
          padding: 10px 0; color: white; font-size: 14px; outline: none;
          transition: border-color 0.2s;
          font-family: 'Instrument Sans', sans-serif !important;
          -webkit-text-fill-color: white; caret-color: white;
        }
        .rm-input:-webkit-autofill,
        .rm-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px transparent inset;
          -webkit-text-fill-color: white; transition: background-color 9999s ease;
        }
        .rm-input::placeholder { color: rgba(255,255,255,0.25); }
        .rm-input:focus { border-bottom-color: #22c55e; }

        .rm-eye {
          position: absolute; right: 0; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: rgba(255,255,255,0.35);
          cursor: pointer; display: flex; padding: 4px; transition: color 0.15s; z-index: 1;
        }
        .rm-eye:hover { color: rgba(255,255,255,0.75); }

        .rm-btn {
          width: 100%; background: #0a0a0a; border: none; color: white;
          font-weight: 600; font-size: 15px; padding: 16px 0; border-radius: 50px;
          cursor: pointer; transition: background 0.2s, transform 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: 'Instrument Sans', sans-serif !important;
          letter-spacing: 0.01em; margin-top: 8px;
        }
        .rm-btn:hover:not(:disabled) { background: #1c1c1c; transform: translateY(-1px); }
        .rm-btn:disabled { background: #2a2a2a; cursor: not-allowed; }

        @keyframes rm-spin { to { transform: rotate(360deg); } }
        .rm-spin { animation: rm-spin 0.8s linear infinite; }

        @media (max-width: 480px) {
          .rm-card { right: 12px; left: 12px; width: auto; top: 76px; }
        }
      `}</style>

      <div className="rm-backdrop"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }} />

      <div className="rm-card rm-root">
        <button className="rm-close" onClick={onClose} aria-label="Close">
          <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <h2 style={{ color: "white", fontSize: 26, fontWeight: 700, margin: "0 0 8px", textAlign: "center", letterSpacing: "-0.01em" }}>
          Create Account
        </h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13.5, margin: "0 0 14px", textAlign: "center" }}>
          Join SehatHub today.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Full Name */}
          <div>
            <label className="rm-label">Full Name</label>
            <input
              ref={nameRef}
              type="text" className="rm-input"
              placeholder="Enter your full name"
              value={name} onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="rm-label">Phone No</label>
            <input
              ref={phoneRef}
              type="tel" className="rm-input"
              placeholder="Enter your mobile number"
              value={phone} onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>

          {/* Password */}
          <div>
            <label className="rm-label">Password</label>
            <div style={{ position: "relative" }}>
              <input
                ref={passwordRef}
                type={showPassword ? "text" : "password"} className="rm-input"
                placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 32 }} autoComplete="new-password"
              />
              <button type="button" className="rm-eye"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="rm-label">Confirm Password</label>
            <div style={{ position: "relative" }}>
              <input
                ref={confirmRef}
                type={showConfirm ? "text" : "password"} className="rm-input"
                placeholder="••••••••" value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                style={{ paddingRight: 32 }} autoComplete="new-password"
              />
              <button type="button" className="rm-eye"
                onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>
          </div>

          {/* Passwords-match indicator */}
          {confirm.length > 0 && (
            <p style={{
              fontSize: 11.5, margin: "-6px 0 0",
              color: confirm === password ? "#22c55e" : "#f87171",
            }}>
              {confirm === password ? "✓ Passwords match" : "✗ Passwords do not match"}
            </p>
          )}

          <button type="submit" disabled={loading} className="rm-btn">
            {loading ? (
              <>
                <svg className="rm-spin" width="15" height="15" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account...
              </>
            ) : "Create Account"}
          </button>
        </form>

        <div style={{ minHeight: 8 }} />

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 12.5, marginTop: 12 }}>
          Already have an account?{" "}
          <button
            onClick={() => handleNavigate("login")}  // ✅ CHANGED THIS LINE
            style={{
              background: "none", border: "none", color: "white",
              fontWeight: 600, fontSize: 12.5, cursor: "pointer",
              fontFamily: "'Instrument Sans', sans-serif",
              textDecoration: "underline", textUnderlineOffset: 2,
            }}
          >
            Sign In.
          </button>
        </p>
      </div>
    </>
  );
}