import { useState } from "react";

interface RegisterProps {
  onNavigate?: (page: "login") => void;
}

export default function Register({ onNavigate }: RegisterProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
  };

  const fields: { key: keyof typeof form; label: string; placeholder: string; type?: string }[] = [
    { key: "name", label: "Full Name", placeholder: "Enter your full name" },
    { key: "phone", label: "Phone No", placeholder: "e.g. 0311-xxx-xxxx", type: "tel" },
    { key: "email", label: "Email Address", placeholder: "you@example.com", type: "email" },
    { key: "password", label: "Password", placeholder: "Min. 8 characters", type: showPassword ? "text" : "password" },
    { key: "confirmPassword", label: "Confirm Password", placeholder: "Re-enter password", type: showPassword ? "text" : "password" },
  ];

  return (
    <div className="min-h-screen bg-[#0d1a14] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #14532d 0%, transparent 60%), radial-gradient(circle at 80% 20%, #052e16 0%, transparent 50%)`,
        }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-800/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-sm bg-[#111c16]/90 border border-emerald-900/40 rounded-2xl shadow-2xl shadow-black/60 backdrop-blur-sm p-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-7">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L10 6H15L11 9.5L12.5 15L8 11.5L3.5 15L5 9.5L1 6H6L8 1Z" fill="#0d1a14" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-wide">SehatHub</span>
        </div>

        <h2 className="text-white text-2xl font-bold mb-1">Create Account</h2>
        <p className="text-emerald-400/70 text-sm mb-7">Join SehatHub — your health, one roof.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="block text-emerald-300/80 text-xs font-semibold mb-1.5 tracking-wider uppercase">
                {label}
              </label>
              <div className="relative">
                <input
                  type={type || "text"}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={set(key)}
                  className="w-full bg-[#0d1a14] border border-emerald-900/60 rounded-lg px-4 py-2.5 text-white text-sm placeholder-emerald-900/70 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
                {(key === "password" || key === "confirmPassword") && key === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-700 hover:text-emerald-400 transition-colors"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </>
                      )}
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Password match indicator */}
          {form.confirmPassword && (
            <p className={`text-xs mt-1 ${form.password === form.confirmPassword ? "text-emerald-400" : "text-red-400"}`}>
              {form.password === form.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-center text-emerald-900 text-xs mt-6">
          Already have an account?{" "}
          <button
            onClick={() => onNavigate?.("login")}
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            Login Here.
          </button>
        </p>
      </div>
    </div>
  );
}