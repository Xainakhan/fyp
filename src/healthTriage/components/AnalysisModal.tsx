import React from "react";
import { useTranslation } from "react-i18next";
import {
  X, Activity, User, MessageSquare, Stethoscope,
  CheckCircle, AlertTriangle, Download, UserRound,
} from "lucide-react";
import type { Diagnosis, UserData } from "../types/Types";

interface AnalysisModalProps {
  diagnosis: Diagnosis;
  userData: UserData;
  symptoms: string[];
  onClose: () => void;
  onNavigateToDoctor?: () => void;
  onDownload: () => void;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  diagnosis, userData, symptoms, onClose, onNavigateToDoctor, onDownload,
}) => {
  const { t, i18n } = useTranslation("healthTriage");
  const isRTL = i18n.dir() === "rtl";

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div
        className="max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col rounded-2xl"
        style={{
          /* glass-modal from the CSS design system */
          background: "rgba(12, 22, 17, 0.93)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "0.5px solid rgba(255,255,255,0.13)",
          boxShadow: "-4px 4px 4px 0px rgba(0,0,0,0.30), 0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between flex-shrink-0"
          style={{
            background: "linear-gradient(90deg, rgba(16,185,129,0.20) 0%, rgba(99,102,241,0.15) 100%)",
            borderBottom: "0.5px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(16,185,129,0.25)", border: "0.5px solid rgba(16,185,129,0.4)" }}
            >
              <Activity className="w-4.5 h-4.5 text-emerald-400" style={{ width: 18, height: 18 }} />
            </div>
            <h2 className="text-base font-bold text-white">{t("modal.title", "Analysis Report")}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full transition-colors hover:bg-white/10"
          >
            <X className="w-5 h-5 text-white/50" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5" style={{ scrollbarWidth: "none" }}>

          {/* Patient Info */}
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)" }}
          >
            <h3 className="font-semibold text-white/80 mb-3 flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-emerald-400" />
              {t("modal.patientInfo", "Patient Info")}
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              {[
                { label: t("modal.name", "Name"), value: userData.name || t("modal.na", "N/A") },
                { label: t("modal.age", "Age"), value: `${userData.age || "—"} ${t("modal.ageUnit", "yrs")}` },
                { label: t("modal.gender", "Gender"), value: userData.gender || t("modal.na", "N/A") },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-white/30 text-[11px] mb-1">{item.label}</p>
                  <p className="font-semibold text-white/85 capitalize">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <h3 className="font-semibold text-white/80 mb-3 flex items-center gap-2 text-sm">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              {t("modal.reportedSymptoms", "Reported Symptoms")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium text-emerald-300"
                  style={{ background: "rgba(16,185,129,0.15)", border: "0.5px solid rgba(16,185,129,0.3)" }}
                >
                  {s.replace(/_/g, " ")}
                </span>
              ))}
            </div>
            <p className="text-xs text-white/35 mt-2">
              {t("modal.duration", { days: diagnosis.days })}
            </p>
          </div>

          {/* Diagnosis */}
          <div>
            <h3 className="font-semibold text-white/80 mb-3 flex items-center gap-2 text-sm">
              <Stethoscope className="w-4 h-4 text-indigo-400" />
              {t("modal.diagnosis", "Diagnosis")}
            </h3>
            <div
              className="rounded-xl p-4 space-y-2"
              style={{ background: "rgba(99,102,241,0.10)", border: "0.5px solid rgba(99,102,241,0.25)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-white">{diagnosis.prediction}</span>
                {diagnosis.confidence && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold text-indigo-300"
                    style={{ background: "rgba(99,102,241,0.20)" }}
                  >
                    {t("modal.confidence", { value: (diagnosis.confidence * 100).toFixed(1) })}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <AlertTriangle
                  className={`w-4 h-4 ${
                    diagnosis.severity === "high" ? "text-red-400"
                    : diagnosis.severity === "moderate" ? "text-yellow-400"
                    : "text-emerald-400"
                  }`}
                />
                <span className="capitalize font-medium text-white/70">
                  {t("modal.severity", { level: diagnosis.severity })}
                </span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {diagnosis.precautions?.length > 0 && (
            <div>
              <h3 className="font-semibold text-white/80 mb-3 flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                {t("modal.recommendations", "Recommendations")}
              </h3>
              <ul className="space-y-2">
                {diagnosis.precautions.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-emerald-300 mt-0.5"
                      style={{ background: "rgba(16,185,129,0.18)" }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-white/65 pt-0.5">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* High severity warning */}
          {diagnosis.severity === "high" && (
            <div
              className="p-4 rounded-xl flex items-start gap-3"
              style={{ background: "rgba(239,68,68,0.10)", borderLeft: "3px solid rgba(239,68,68,0.6)" }}
            >
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-300 text-sm mb-1">{t("modal.importantNotice", "Important")}</h4>
                <p className="text-xs text-red-300/70">{t("modal.highSeverityMsg")}</p>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div
            className="p-3 rounded-lg text-[11px] text-yellow-400/60"
            style={{ background: "rgba(234,179,8,0.07)", border: "0.5px solid rgba(234,179,8,0.15)" }}
          >
            {t("modal.disclaimer")}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 flex items-center justify-between flex-shrink-0"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
        >
          <p className="text-[11px] text-white/25">
            {t("modal.generatedOn", "Generated")} {new Date().toLocaleString()}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-white/50 transition-all hover:text-white/80"
              style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.10)" }}
            >
              {t("modal.close", "Close")}
            </button>
            <button
              onClick={onNavigateToDoctor}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
              style={{ background: "rgba(16,185,129,0.25)", border: "0.5px solid rgba(16,185,129,0.4)" }}
            >
              <UserRound className="w-4 h-4" />
              <span>{t("modal.consultDoctor", "Doctor")}</span>
            </button>
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
              style={{ background: "rgba(99,102,241,0.25)", border: "0.5px solid rgba(99,102,241,0.4)" }}
            >
              <Download className="w-4 h-4" />
              <span>{t("modal.download", "Download")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
