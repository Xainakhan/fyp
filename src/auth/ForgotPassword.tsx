import { useState, useEffect } from "react";

interface ForgotPasswordProps {
  open?: boolean;
  onClose?: () => void;
  onNavigate?: (page: string) => void;
  userLanguage?: string;
}

export default function ForgotPassword({ open, onClose, onNavigate, userLanguage: _userLanguage }: ForgotPasswordProps) {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"input" | "sent">("input");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setStep("sent");
  };

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { 
      if (e.key === "Escape" && onClose) onClose(); 
    };
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

        .fp-root * {
          font-family: 'Instrument Sans', sans-serif !important;
          box-sizing: border-box;
        }

        .fp-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9998;
          background: rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
        }
        @media (min-width: 481px) {
          .fp-backdrop {
            background: rgba(0, 0, 0, 0.22);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
          }
        }

        @keyframes fpSlideDown {
          from { opacity: 0; transform: translateY(-14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .fp-card {
          position: fixed;
          top: 68px;
          right: 20px;
          width: 420px;
          z-index: 9999;
          background: rgba(14, 26, 18, 0.45);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border: 0.5px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          padding: 28px 36px 28px;
          box-shadow:
            -4px 4px 4px 0px rgba(0, 0, 0, 0.15),
            0 24px 60px rgba(0, 0, 0, 0.35);
          animation: fpSlideDown 0.28s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .fp-close {
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
        .fp-close:hover { background: rgba(255,255,255,0.14); color: white; }

        .fp-label {
          display: block;
          color: rgba(255,255,255,0.80);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .fp-input {
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
        .fp-input:-webkit-autofill,
        .fp-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px transparent inset;
          -webkit-text-fill-color: white;
          transition: background-color 9999s ease;
        }
        .fp-input::placeholder { color: rgba(255,255,255,0.25); }
        .fp-input:focus { border-bottom-color: rgba(255,255,255,0.55); }

        .fp-btn {
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
        .fp-btn:hover:not(:disabled) { background: #1c1c1c; transform: translateY(-1px); }
        .fp-btn:disabled { background: #2a2a2a; cursor: not-allowed; opacity: 0.6; }

        @keyframes fp-spin { to { transform: rotate(360deg); } }
        .fp-spin { animation: fp-spin 0.8s linear infinite; }

        @media (max-width: 480px) {
          .fp-card { right: 12px; left: 12px; width: auto; top: 76px; }
        }
      `}</style>

      <div
        className="fp-backdrop"
        onMouseDown={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
      />

      <div className="fp-card fp-root">
        <button className="fp-close" onClick={onClose} aria-label="Close">
          <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {step === "input" ? (
          <>
            <h2 style={{
              color: "white", fontSize: 26, fontWeight: 700,
              margin: "0 0 8px", textAlign: "center", letterSpacing: "-0.01em",
            }}>
              Forgot Password?
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.45)", fontSize: 13.5,
              margin: "0 0 20px", textAlign: "center", lineHeight: 1.5,
            }}>
              Enter your registered phone number and we'll send you a reset code.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="fp-label">Phone No</label>
                <input
                  type="tel"
                  className="fp-input"
                  placeholder="Enter your registered mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>

              <button type="submit" disabled={loading || !phone} className="fp-btn">
                {loading ? (
                  <>
                    <svg className="fp-spin" width="15" height="15" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </>
                ) : "Send Reset Code"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 style={{
              color: "white", fontSize: 26, fontWeight: 700,
              margin: "0 0 8px", textAlign: "center", letterSpacing: "-0.01em",
            }}>
              Code Sent!
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.45)", fontSize: 13.5,
              margin: "0 0 20px", textAlign: "center", lineHeight: 1.5,
            }}>
              We've sent a reset code to{" "}
              <span style={{ color: "rgba(255,255,255,0.80)", fontWeight: 600 }}>{phone}</span>.
              {" "}Check your SMS.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                className="fp-btn"
                style={{ marginTop: 0 }}
                onClick={() => handleNavigate("reset-password")}
              >
                Enter Reset Code
              </button>
              <button
                onClick={() => setStep("input")}
                style={{
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.40)", fontSize: 13,
                  cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif",
                  padding: "8px 0", textAlign: "center",
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.70)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.40)")}
              >
                Try a different number
              </button>
            </div>
          </>
        )}

        <div style={{ minHeight: 8 }} />

        <p style={{
          textAlign: "center", color: "rgba(255,255,255,0.35)",
          fontSize: 12.5, marginTop: 12,
        }}>
          Remember your password?{" "}
          <button
            onClick={() => handleNavigate("login")}
            style={{
              background: "none", border: "none",
              color: "white", fontWeight: 600, fontSize: 12.5,
              cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif",
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