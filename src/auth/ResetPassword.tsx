import { useState, useRef, useEffect } from "react";

interface ResetPasswordProps {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  phoneNumber?: string;
}

export default function ResetPassword({ open, onClose, onSwitchToLogin, phoneNumber = "0311-xxx-xxxx" }: ResetPasswordProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"otp" | "new-password" | "success">("otp");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join("").length < 6) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStep("new-password");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword || newPassword.length < 8) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setStep("success");
  };

  const passwordStrength = () => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    return score;
  };

  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["", "#ef4444", "#eab308", "#3b82f6", "#22c55e"];
  const strength = passwordStrength();

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

        .rp-root * {
          font-family: 'Instrument Sans', sans-serif !important;
          box-sizing: border-box;
        }

        .rp-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9998;
          background: rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
        }
        @media (min-width: 481px) {
          .rp-backdrop {
            background: rgba(0, 0, 0, 0.22);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
          }
        }

        @keyframes rpSlideDown {
          from { opacity: 0; transform: translateY(-14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .rp-card {
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
          animation: rpSlideDown 0.28s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .rp-close {
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
        .rp-close:hover { background: rgba(255,255,255,0.14); color: white; }

        .rp-label {
          display: block;
          color: rgba(255,255,255,0.80);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .rp-input {
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
        .rp-input:-webkit-autofill,
        .rp-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px transparent inset;
          -webkit-text-fill-color: white;
          transition: background-color 9999s ease;
        }
        .rp-input::placeholder { color: rgba(255,255,255,0.25); }
        .rp-input:focus { border-bottom-color: rgba(255,255,255,0.55); }

        .rp-otp-input {
          width: 48px;
          height: 52px;
          text-align: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 10px;
          color: white;
          font-size: 20px;
          font-weight: 700;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          caret-color: white;
          font-family: 'Instrument Sans', sans-serif !important;
        }
        .rp-otp-input:focus {
          border-color: rgba(255,255,255,0.55);
          background: rgba(255,255,255,0.09);
        }

        .rp-eye {
          position: absolute; right: 0; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          color: rgba(255,255,255,0.35);
          cursor: pointer; display: flex; padding: 4px;
          transition: color 0.15s; z-index: 1;
        }
        .rp-eye:hover { color: rgba(255,255,255,0.75); }

        .rp-btn {
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
        .rp-btn:hover:not(:disabled) { background: #1c1c1c; transform: translateY(-1px); }
        .rp-btn:disabled { background: #2a2a2a; cursor: not-allowed; opacity: 0.6; }

        .rp-strength-bar {
          display: flex; gap: 4px; margin-top: 8px; margin-bottom: 4px;
        }
        .rp-strength-segment {
          height: 3px; flex: 1; border-radius: 99px;
          background: rgba(255,255,255,0.10);
          transition: background 0.3s;
        }

        @keyframes rp-spin { to { transform: rotate(360deg); } }
        .rp-spin { animation: rp-spin 0.8s linear infinite; }

        @media (max-width: 480px) {
          .rp-card { right: 12px; left: 12px; width: auto; top: 76px; }
          .rp-otp-input { width: 40px; height: 46px; font-size: 18px; }
        }
      `}</style>

      <div
        className="rp-backdrop"
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      />

      <div className="rp-card rp-root">
        <button className="rp-close" onClick={onClose} aria-label="Close">
          <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* ── OTP Step ── */}
        {step === "otp" && (
          <>
            <h2 style={{
              color: "white", fontSize: 26, fontWeight: 700,
              margin: "0 0 8px", textAlign: "center", letterSpacing: "-0.01em",
            }}>
              Enter OTP
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.45)", fontSize: 13.5,
              margin: "0 0 20px", textAlign: "center", lineHeight: 1.5,
            }}>
              We sent a 6-digit code to{" "}
              <span style={{ color: "rgba(255,255,255,0.80)", fontWeight: 600 }}>{phoneNumber}</span>
            </p>

            <form onSubmit={handleOtpSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="rp-otp-input"
                  />
                ))}
              </div>

              <button type="submit" disabled={loading || otp.join("").length < 6} className="rp-btn">
                {loading ? (
                  <>
                    <svg className="rp-spin" width="15" height="15" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verifying...
                  </>
                ) : "Verify Code"}
              </button>

              <p style={{ textAlign: "center", color: "rgba(255,255,255,0.30)", fontSize: 12.5, margin: 0 }}>
                Didn't receive code?{" "}
                <button
                  type="button"
                  style={{
                    background: "none", border: "none",
                    color: "white", fontWeight: 600, fontSize: 12.5,
                    cursor: "pointer", fontFamily: "'Instrument Sans', sans-serif",
                    textDecoration: "underline", textUnderlineOffset: 2,
                  }}
                >
                  Resend
                </button>
              </p>
            </form>
          </>
        )}

        {/* ── New Password Step ── */}
        {step === "new-password" && (
          <>
            <h2 style={{
              color: "white", fontSize: 26, fontWeight: 700,
              margin: "0 0 8px", textAlign: "center", letterSpacing: "-0.01em",
            }}>
              New Password
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.45)", fontSize: 13.5,
              margin: "0 0 20px", textAlign: "center",
            }}>
              Create a strong new password for your account.
            </p>

            <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* New Password */}
              <div>
                <label className="rp-label">New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="rp-input"
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ paddingRight: 32 }}
                    autoComplete="new-password"
                  />
                  <button type="button" className="rp-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide" : "Show"}>
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
                {/* Strength bar */}
                {newPassword && (
                  <>
                    <div className="rp-strength-bar">
                      {[1, 2, 3, 4].map((s) => (
                        <div
                          key={s}
                          className="rp-strength-segment"
                          style={{ background: strength >= s ? strengthColors[strength] : undefined }}
                        />
                      ))}
                    </div>
                    <p style={{ fontSize: 11.5, margin: 0, color: strengthColors[strength] }}>
                      {strengthLabels[strength]}
                    </p>
                  </>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="rp-label">Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    className="rp-input"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ paddingRight: 32 }}
                    autoComplete="new-password"
                  />
                  <button type="button" className="rp-eye"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? "Hide" : "Show"}>
                    {showConfirm ? (
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
                {confirmPassword && (
                  <p style={{
                    fontSize: 11.5, margin: "4px 0 0",
                    color: newPassword === confirmPassword ? "#22c55e" : "#ef4444",
                  }}>
                    {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || newPassword !== confirmPassword || newPassword.length < 8}
                className="rp-btn"
              >
                {loading ? (
                  <>
                    <svg className="rp-spin" width="15" height="15" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Resetting...
                  </>
                ) : "Reset Password"}
              </button>
            </form>
          </>
        )}

        {/* ── Success Step ── */}
        {step === "success" && (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{
              width: 64, height: 64,
              borderRadius: "50%",
              border: "1.5px solid rgba(255,255,255,0.20)",
              background: "rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <svg width="28" height="28" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 style={{
              color: "white", fontSize: 26, fontWeight: 700,
              margin: "0 0 8px", letterSpacing: "-0.01em",
            }}>
              Password Reset!
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.45)", fontSize: 13.5,
              margin: "0 0 20px", lineHeight: 1.5,
            }}>
              Your password has been successfully updated. You can now log in with your new password.
            </p>
            <button
              className="rp-btn"
              style={{ marginTop: 0 }}
              onClick={() => { onClose(); onSwitchToLogin(); }}
            >
              Back to Login
            </button>
          </div>
        )}

        <div style={{ minHeight: 8 }} />

        {step !== "success" && (
          <p style={{
            textAlign: "center", color: "rgba(255,255,255,0.35)",
            fontSize: 12.5, marginTop: 12,
          }}>
            Remember your password?{" "}
            <button
              onClick={() => { onClose(); onSwitchToLogin(); }}
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
        )}
      </div>
    </>
  );
}