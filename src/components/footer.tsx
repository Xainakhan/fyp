import React, { useState } from "react";
import { FaGooglePlay, FaApple, FaInstagram, FaFacebook, FaYoutube, FaLinkedin, FaTwitter } from "react-icons/fa";
import { IoMdArrowUp } from "react-icons/io";
import { ChevronDown } from "lucide-react";

/* ── Accordion section (mobile only) ── */
const AccordionSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 0",
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {title}
        <ChevronDown
          size={18}
          color="rgba(255,255,255,0.5)"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
          }}
        />
      </button>

      <div
        style={{
          maxHeight: open ? 400 : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <div style={{ paddingBottom: 16 }}>{children}</div>
      </div>
    </div>
  );
};

const FooterLink: React.FC<{ label: string }> = ({ label }) => (
  <li
    style={{
      padding: "6px 0",
      fontSize: 14,
      color: "rgba(255,255,255,0.65)",
      cursor: "pointer",
      transition: "color 0.15s",
      listStyle: "none",
      textAlign: "left",
      width: "100%", // ✅ alignment fix
    }}
    onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
  >
    {label}
  </li>
);

const Footer: React.FC = () => {
  return (
    <>
      <style>{`
        .sh-footer-desktop { display: block; }
        .sh-footer-mobile  { display: none;  }

        @media (max-width: 768px) {
          .sh-footer-desktop { display: none;  }
          .sh-footer-mobile  { display: block; }
        }
      `}</style>

      {/* ════ DESKTOP FOOTER (FIXED) ════ */}
      <footer className="sh-footer-desktop w-screen relative left-1/2 right-1/2 bg-[#021a14] text-white"
        style={{ marginLeft: "calc(-50vw)", marginRight: "calc(-50vw)", width: "100vw" }}>

        <div style={{ padding: "40px 80px 0" }}>
          
          {/* Top Bar */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: 24
          }}>
            <img src="src/assets/logo.png" alt="logo" style={{ height: 64 }} />

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,0.3)", padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}>
                <FaGooglePlay size={20} />
                <div>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>ANDROID APP ON</p>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>Google Play</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,0.3)", padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}>
                <FaApple size={18} />
                <div>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>Available on the</p>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>App Store</p>
                </div>
              </div>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                style={{
                  border: "1px solid rgba(255,255,255,0.3)",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  cursor: "pointer",
                  color: "white"
                }}
              >
                <IoMdArrowUp size={18} />
              </button>
            </div>
          </div>

          {/* GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 1fr 1fr 1fr",
              gap: 40,
              padding: "40px 0",
              alignItems: "flex-start", // ✅ fix
            }}
          >
            {/* COLUMN 1 */}
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
                <strong style={{ color: "white" }}>SehatHub</strong> — Everything health under one roof. SehatHub blends voice technology and intelligent care to help you understand, track, and improve your well-being effortlessly.
              </p>
              <p style={{ marginTop: 16, fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
                UAN: 021-111-xxx-xxx<br />
                Email: help@sehathub.pk
              </p>
            </div>

            {/* COLUMN 2 */}
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: 14, textAlign: "left" }}>What We Offer</h4>
              <ul style={{ padding: 0, margin: 0 }}>
                {["Talk Bot","Health Interview","Symptom Checker","Health Triage","Find Doctor","Health Timeline"]
                  .map(l => <FooterLink key={l} label={l} />)}
              </ul>
            </div>

            {/* COLUMN 3 */}
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: 14, textAlign: "left" }}>Quick Links</h4>
              <ul style={{ padding: 0, margin: 0 }}>
                {["Disease Library","Doctor Login","Chat Support","Contribute with Us"]
                  .map(l => <FooterLink key={l} label={l} />)}
              </ul>
            </div>

            {/* COLUMN 4 */}
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: 14, textAlign: "left" }}>About Us</h4>
              <ul style={{ padding: 0, margin: 0 }}>
                {["Contact Us","Downloads","Privacy Policy","Return Policy","Disclaimer","Cookie Policy","Acceptable Use Policy"]
                  .map(l => <FooterLink key={l} label={l} />)}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          background: "#031f18",
          padding: "16px 80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", gap: 16 }}>
            {[FaInstagram, FaFacebook, FaYoutube, FaLinkedin].map((Icon, i) => (
              <Icon key={i} size={20} style={{ cursor: "pointer", color: "rgba(255,255,255,0.8)" }} />
            ))}
          </div>

          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
            © 2026 SehatHub. All Rights Reserved to PawDev.
          </p>
        </div>
      </footer>

      {/* ════ MOBILE FOOTER ════ */}
      <footer
        className="sh-footer-mobile"
        style={{
          background: "#021a14",
          color: "white",
          width: "100vw",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "calc(-50vw)",
          marginRight: "calc(-50vw)",
        }}
      >
        {/* Top row: Logo + Back to Top */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 20px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="src/assets/logo.png" alt="SehatHub" style={{ height: 36, objectFit: "contain" }} />
            <span style={{ fontSize: 18, fontWeight: 700, color: "white" }}>SehatHub</span>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              border: "1px solid rgba(255,255,255,0.25)",
              background: "transparent",
              color: "white",
              padding: "6px 12px",
              borderRadius: 20,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Back to Top <IoMdArrowUp size={14} />
          </button>
        </div>

        {/* Description + contact */}
        <div style={{ padding: "20px 20px 4px" }}>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.65 }}>
            <strong style={{ color: "white" }}>SehatHub</strong> — Everything health under one roof.
            SehatHub blends voice technology and intelligent care to help you understand,
            track, and improve your well-being effortlessly.
          </p>
          <p style={{ marginTop: 14, fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
            UAN: 021-111-xxx-xxx<br />
            Email: help@sehathub.pk
          </p>
        </div>

        {/* Accordion sections */}
        <div style={{ padding: "0 20px" }}>
          <AccordionSection title="What We Offer">
            <ul style={{ padding: 0 }}>
              {["Talk Bot","Health Interview","Symptom Checker","Health Triage","Find Doctor","Health Timeline"].map(l => <FooterLink key={l} label={l} />)}
            </ul>
          </AccordionSection>

          <AccordionSection title="Quick Links">
            <ul style={{ padding: 0 }}>
              {["Disease Library","Doctor Login","Chat Support","Contribute with Us"].map(l => <FooterLink key={l} label={l} />)}
            </ul>
          </AccordionSection>

          <AccordionSection title="About Us">
            <ul style={{ padding: 0 }}>
              {["Contact Us","Downloads","Privacy Policy","Return Policy","Disclaimer","Cookie Policy","Acceptable Use Policy"].map(l => <FooterLink key={l} label={l} />)}
            </ul>
          </AccordionSection>
        </div>

        {/* App store buttons */}
        <div style={{ display: "flex", gap: 10, padding: "20px 20px 0", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,0.2)", padding: "8px 14px", borderRadius: 8, cursor: "pointer", flex: 1, justifyContent: "center" }}>
            <FaGooglePlay size={18} />
            <div>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", margin: 0 }}>ANDROID APP ON</p>
              <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Google Play</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,0.2)", padding: "8px 14px", borderRadius: 8, cursor: "pointer", flex: 1, justifyContent: "center" }}>
            <FaApple size={18} />
            <div>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", margin: 0 }}>Available on the</p>
              <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>App Store</p>
            </div>
          </div>
        </div>

        {/* Bottom bar: socials + copyright */}
        <div
          style={{
            background: "#031f18",
            marginTop: 24,
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <FaInstagram size={20} style={{ cursor: "pointer" }} />
            <FaFacebook  size={20} style={{ cursor: "pointer" }} />
            <FaYoutube   size={22} style={{ cursor: "pointer" }} />
            <FaLinkedin  size={20} style={{ cursor: "pointer" }} />
            <FaTwitter   size={20} style={{ cursor: "pointer" }} />
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: 0 }}>
            © 2026 SehatHub. All Rights Reserved to{" "}
            <span style={{ textDecoration: "underline", cursor: "pointer" }}>PawDev</span>.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
