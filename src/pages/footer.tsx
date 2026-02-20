// components/Footer.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  FileText,
  HelpCircle,
  ScrollText,
  ShieldCheck,
  MessageSquare,
  LifeBuoy,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Bot,
} from "lucide-react";

interface FooterProps {
  setCurrentModule: (module: string) => void;
  userLanguage: string;
}

const Footer: React.FC<FooterProps> = ({ setCurrentModule }) => {
  const { t } = useTranslation("footer");

  const quickLinks = [
    { icon: <LayoutDashboard size={16} />, label: t("quickLinks.dashboard"),   action: () => setCurrentModule("home") },
    { icon: <Users size={16} />,           label: t("quickLinks.manageUsers"), action: () => setCurrentModule("users") },
    { icon: <Stethoscope size={16} />,     label: t("quickLinks.manageDoctors"), action: () => setCurrentModule("doctor") },
    { icon: <CalendarDays size={16} />,    label: t("quickLinks.manageAppointments"), action: () => setCurrentModule("interview") },
  ];

  const resources = [
    { icon: <FileText size={16} />,    label: t("resources.articles") },
    { icon: <HelpCircle size={16} />,  label: t("resources.faq") },
    { icon: <ScrollText size={16} />,  label: t("resources.terms") },
    { icon: <ShieldCheck size={16} />, label: t("resources.privacy") },
  ];

  const support = [
    { icon: <MessageSquare size={16} />, label: t("support.contact") },
    { icon: <LifeBuoy size={16} />,      label: t("support.helpCenter") },
    { icon: <MessageCircle size={16} />, label: t("support.feedback") },
  ];

  const socialIcons = [
    { icon: <Facebook size={16} />, label: "Facebook" },
    { icon: <Twitter size={16} />,  label: "Twitter" },
    { icon: <Linkedin size={16} />, label: "LinkedIn" },
    { icon: <Youtube size={16} />,  label: "YouTube" },
  ];

  return (
    <footer
      className="relative mt-16 sm:mt-20 px-4 sm:px-6 lg:px-8 pb-10 pt-6"
      style={{
        background: "linear-gradient(135deg, #e6f4ed 0%, #f0f9f4 35%, #e2f2ea 65%, #edf8f3 100%)",
      }}
    >
      <div
        className="max-w-7xl mx-auto rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.70)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255, 255, 255, 0.88)",
          boxShadow: "0 4px 40px rgba(34, 120, 80, 0.09), 0 1px 6px rgba(34,120,80,0.06)",
        }}
      >
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 px-8 sm:px-10 lg:px-14 py-10 sm:py-12">

          {/* Brand */}
          <div
            className="flex flex-col items-center md:items-start justify-center gap-3 pb-8 md:pb-0 md:pr-10"
            style={{ borderRight: "1px solid rgba(34,120,80,0.13)" }}
          >
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full flex items-center justify-center shadow-sm flex-shrink-0"
                style={{ background: "rgba(45,158,107,0.12)" }}>
                <Bot size={32} color="#2d9e6b" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xl font-bold leading-tight tracking-tight"
                  style={{ color: "#1a6645", fontFamily: "'Georgia', serif" }}>
                  SehatHub
                </p>
                <p className="text-xs font-medium mt-0.5" style={{ color: "#4aaa7a" }}>
                  {t("brand.tagline")}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-5 pl-0 md:pl-10 pt-8 md:pt-0">
            <h4 className="text-base font-bold" style={{ color: "#1a6645" }}>
              {t("sections.quickLinks")}
            </h4>
            <ul className="flex flex-col gap-3.5">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <button
                    onClick={link.action}
                    className="flex items-center gap-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1 group w-full text-left"
                    style={{ color: "#2d6e4e" }}
                  >
                    <span className="flex-shrink-0 transition-colors duration-200 group-hover:text-green-600"
                      style={{ color: "#3aaa72" }}>
                      {link.icon}
                    </span>
                    <span className="group-hover:text-green-700">{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-5 pt-8 md:pt-0">
            <h4 className="text-base font-bold" style={{ color: "#1a6645" }}>
              {t("sections.resources")}
            </h4>
            <ul className="flex flex-col gap-3.5">
              {resources.map((item, i) => (
                <li key={i}>
                  <button
                    className="flex items-center gap-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1 group w-full text-left"
                    style={{ color: "#2d6e4e" }}
                  >
                    <span className="flex-shrink-0 group-hover:text-green-600"
                      style={{ color: "#3aaa72" }}>
                      {item.icon}
                    </span>
                    <span className="group-hover:text-green-700">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-5 pt-8 md:pt-0">
            <h4 className="text-base font-bold" style={{ color: "#1a6645" }}>
              {t("sections.support")}
            </h4>
            <ul className="flex flex-col gap-3.5">
              {support.map((item, i) => (
                <li key={i}>
                  <button
                    className="flex items-center gap-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1 group w-full text-left"
                    style={{ color: "#2d6e4e" }}
                  >
                    <span className="flex-shrink-0 group-hover:text-green-600"
                      style={{ color: "#3aaa72" }}>
                      {item.icon}
                    </span>
                    <span className="group-hover:text-green-700">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-8 sm:mx-10 lg:mx-14"
          style={{ borderTop: "1px solid rgba(34,120,80,0.15)" }} />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 sm:px-10 lg:px-14 py-5">

          {/* Brand repeat */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(45,158,107,0.12)" }}>
              <Bot size={20} color="#2d9e6b" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight"
                style={{ color: "#1a6645", fontFamily: "'Georgia', serif" }}>
                SehatHub
              </p>
              <p className="text-xs" style={{ color: "#4aaa7a" }}>
                {t("brand.tagline")}
              </p>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-sm text-center" style={{ color: "#4a7a60" }}>
            © 2024{" "}
            <span className="font-semibold" style={{ color: "#1a6645" }}>SehatHub</span>
            {t("bottom.copyright")}
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-2">
            {socialIcons.map((social) => (
              <button
                key={social.label}
                aria-label={social.label}
                className="h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-md"
                style={{ background: "#2d9e6b" }}
              >
                <span className="text-white flex items-center justify-center">
                  {social.icon}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;