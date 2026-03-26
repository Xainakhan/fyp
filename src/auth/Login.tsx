import { useState, useEffect } from "react";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
}

export default function LoginModal({ open, onClose, onSwitchToRegister, onSwitchToForgot }: LoginModalProps) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap');

        .lm-root * {
          font-family: 'Instrument Sans', sans-serif !important;
          box-sizing: border-box;
        }

        .lm-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9998;
          background: rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
        }
        @media (min-width: 481px) {
          .lm-backdrop {
            background: rgba(0, 0, 0, 0.22);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
          }
        }

        @keyframes lmSlideDown {
          from { opacity: 0; transform: translateY(-14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .lm-card {
          position: fixed;
          top: 68px;
          right: 20px;
          width: 420px;
          min-height: 520px;
          z-index: 9999;
          background: rgba(14, 26, 18, 0.45);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border: 0.5px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          padding: 48px 36px 40px;
          box-shadow:
            -4px 4px 4px 0px rgba(0, 0, 0, 0.15),
            0 24px 60px rgba(0, 0, 0, 0.35);
          animation: lmSlideDown 0.28s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .lm-close {
          position: absolute;
          top: 14px; right: 14px;
          width: 26px; height: 26px;
          border-radius: 6px;
          background: rgba(255,255,255,0.08);
          border: 0.5px solid rgba(255,255,255,0.13);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: rgba(255,255,255,0.50);
          transition: background 0.15s, color 0.15s;
        }
        .lm-close:hover { background: rgba(255,255,255,0.14); color: white; }

        .lm-label {
          color: rgba(255,255,255,0.80);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .lm-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.22);
          padding: 10px 0;
          color: white;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          font-family: 'Instrument Sans', sans-serif !important;
          -webkit-text-fill-color: white;
          caret-color: white;
        }
        .lm-input:-webkit-autofill,
        .lm-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px transparent inset;
          -webkit-text-fill-color: white;
          transition: background-color 9999s ease;
        }
        .lm-input::placeholder { color: rgba(255,255,255,0.25); }
        .lm-input:focus { border-bottom-color: rgba(255,255,255,0.55); }

        .lm-btn {
          width: 100%;
          background: #0a0a0a;
          border: none;
          color: white;
          font-weight: 600;
          font-size: 15px;
          padding: 16px 0;
          border-radius: 50px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: 'Instrument Sans', sans-serif !important;
          letter-spacing: 0.01em;
          margin-top: 8px;
        }
        .lm-btn:hover:not(:disabled) { background: #1c1c1c; transform: translateY(-1px); }
        .lm-btn:disabled { background: #2a2a2a; cursor: not-allowed; }

        .lm-eye {
          position: absolute; right: 0; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          color: rgba(255,255,255,0.35);
          cursor: pointer; display: flex; padding: 4px;
          transition: color 0.15s; z-index: 1;
        }
        .lm-eye:hover { color: rgba(255,255,255,0.75); }

        @keyframes lm-spin { to { transform: rotate(360deg); } }
        .lm-spin { animation: lm-spin 0.8s linear infinite; }

        @media (max-width: 480px) {
          .lm-card { right: 12px; left: 12px; width: auto; top: 76px; min-height: auto; }
        }
      `}</style>

      <div
        className="lm-backdrop"
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      />

      <div className="lm-card lm-root">

        <button className="lm-close" onClick={onClose} aria-label="Close">
          <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <h2 style={{
          color: "white", fontSize: 26, fontWeight: 700,
          margin: "0 0 8px", textAlign: "center", letterSpacing: "-0.01em",
        }}>
          Welcome Back
        </h2>
        <p style={{
          color: "rgba(255,255,255,0.45)", fontSize: 13.5,
          margin: "0 0 36px", textAlign: "center",
        }}>
          Please enter your details.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 26 }}>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label className="lm-label">Phone No</label>
            <input
              type="tel"
              className="lm-input"
              placeholder="Enter your registered mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label className="lm-label">Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="lm-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 32 }}
                autoComplete="current-password"
              />
              <button type="button" className="lm-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ width: 15, height: 15, accentColor: "#22c55e", cursor: "pointer" }}
              />
              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>Remember Me</span>
            </label>
            <button
              type="button"
onClick={() => { onClose(); onSwitchToForgot(); }}
              style={{
                background: "none", border: "none",
                color: "rgba(255,255,255,0.55)", fontSize: 13,
                cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            >
              Forgot Password
            </button>
          </div>

          <button type="submit" disabled={loading} className="lm-btn">
            {loading ? (
              <>
                <svg className="lm-spin" width="15" height="15" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </>
            ) : "Proceed"}
          </button>
        </form>

        <div style={{ minHeight: 24 }} />

        <p style={{
          textAlign: "center", color: "rgba(255,255,255,0.35)",
          fontSize: 12.5, marginTop: 28,
        }}>
          Don't Have an Account?{" "}
          {/* ← closes login, opens register modal */}
          <button
            onClick={() => { onClose(); onSwitchToRegister(); }}
            style={{
              background: "none", border: "none",
              color: "white", fontWeight: 600, fontSize: 12.5,
              cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif",
              textDecoration: "underline", textUnderlineOffset: 2,
            }}
          >
            Register Here.
          </button>
        </p>

      </div>
    </>
  );
}