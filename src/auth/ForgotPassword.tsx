import { useState } from "react";

interface ForgotPasswordProps {
  onNavigate?: (page: "login" | "reset-password") => void;
}

type Step = "input" | "sent";

export default function ForgotPassword({ onNavigate }: ForgotPasswordProps) {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setStep("sent");
  };

  return (
    <div className="min-h-screen bg-[#0d1a14] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-800/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm bg-[#111c16]/90 border border-emerald-900/40 rounded-2xl shadow-2xl shadow-black/60 backdrop-blur-sm p-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L10 6H15L11 9.5L12.5 15L8 11.5L3.5 15L5 9.5L1 6H6L8 1Z" fill="#0d1a14" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-wide">SehatHub</span>
        </div>

        {step === "input" ? (
          <>
            {/* Lock icon */}
            <div className="w-14 h-14 bg-emerald-900/40 border border-emerald-800/40 rounded-2xl flex items-center justify-center mb-6">
              <svg width="24" height="24" fill="none" stroke="#4ade80" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <h2 className="text-white text-2xl font-bold mb-1">Forgot Password?</h2>
            <p className="text-emerald-400/70 text-sm mb-7">
              No worries. Enter your registered phone number and we'll send you a reset code.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-emerald-300/80 text-xs font-semibold mb-1.5 tracking-wider uppercase">
                  Phone No
                </label>
                <input
                  type="tel"
                  placeholder="Enter your registered mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0d1a14] border border-emerald-900/60 rounded-lg px-4 py-2.5 text-white text-sm placeholder-emerald-900/70 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !phone}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Reset Code"
                )}
              </button>
            </form>
          </>
        ) : (
          /* Success state */
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" fill="none" stroke="#4ade80" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold mb-2">Code Sent!</h2>
            <p className="text-emerald-400/70 text-sm mb-8 leading-relaxed">
              We've sent a reset code to <span className="text-emerald-400 font-medium">{phone}</span>. Check your SMS.
            </p>
            <button
              onClick={() => onNavigate?.("reset-password")}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-emerald-900/40"
            >
              Enter Reset Code
            </button>
            <button
              onClick={() => setStep("input")}
              className="w-full mt-3 text-emerald-500/70 hover:text-emerald-400 text-sm transition-colors py-2"
            >
              Try a different number
            </button>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-emerald-900/30">
          <button
            onClick={() => onNavigate?.("login")}
            className="flex items-center gap-1.5 text-emerald-500/70 hover:text-emerald-400 text-xs transition-colors mx-auto"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}