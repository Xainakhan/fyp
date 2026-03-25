// healthInterview/components/SummaryStep.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Send, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import type { FormData, TriageResponse } from "./types";

interface SummaryStepProps {
  form: FormData;
  triageResult: TriageResponse | null;
  submitError: string | null;
  submitting: boolean;
  onSubmit: () => void;
  onDownload: () => void;
}

const Row = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <div className="flex gap-2 text-sm">
      <span className="text-gray-500 w-40 shrink-0">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  ) : null;

const SummaryStep: React.FC<SummaryStepProps> = ({
  form, triageResult, submitError, submitting, onSubmit, onDownload,
}) => {
  const { t } = useTranslation("healthInterview");

  return (
    <div className="space-y-6">

      {/* Hint */}
      <p className="text-sm text-gray-500 italic">{t("summary.hint")}</p>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Basic info */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            {t("steps.basic")}
          </p>
          <Row label={t("basic.fullName")}  value={form.fullName} />
          <Row label={t("basic.age")}       value={form.age} />
          <Row label={t("basic.gender")}    value={form.gender} />
          <Row label={t("basic.city")}      value={form.city} />
          <Row label={t("basic.phone")}     value={form.phone} />
        </div>

        {/* Current problem */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            {t("steps.current")}
          </p>
          <Row label={t("current.mainConcern")}   value={form.mainConcern} />
          <Row label={t("current.duration")}      value={form.symptomDuration} />
          <Row label={t("current.pattern")}       value={form.symptomPattern} />
          <Row label={t("current.worseWhen")}     value={form.symptomWorseWhen} />
          <Row label={t("current.otherSymptoms")} value={form.associatedSymptoms} />
        </div>

        {/* Medical history */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            {t("steps.history")}
          </p>
          <Row label={t("history.chronicLabel")}    value={form.chronicConditions.join(", ")} />
          <Row label={t("history.otherConditions")} value={form.otherConditions} />
          <Row label={t("history.medicines")}       value={form.currentMedicines} />
          <Row label={t("history.allergies")}       value={form.allergies} />
        </div>

        {/* Lifestyle */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            {t("steps.lifestyle")}
          </p>
          <Row label={t("lifestyle.smoking")}   value={form.smokingStatus} />
          <Row label={t("lifestyle.alcohol")}   value={form.alcoholUse} />
          <Row label={t("lifestyle.exercise")}  value={form.exercise} />
          <Row label={t("lifestyle.sleep")}     value={form.sleepHours ? `${form.sleepHours} hrs` : ""} />
          <Row label={t("lifestyle.stress")}    value={form.stressLevel} />
          <Row label={t("lifestyle.moodNotes")} value={form.moodNotes} />
        </div>
      </div>

      {/* Error banner */}
      {submitError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Triage result */}
      {triageResult && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 space-y-3">
          <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
            <CheckCircle2 size={18} />
            {t("summary.aiTitle")}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {triageResult.possible_condition && (
              <div className="bg-white rounded-lg border border-green-100 px-4 py-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t("summary.possibleCondition")}</p>
                <p className="text-gray-800 font-medium">{triageResult.possible_condition}</p>
              </div>
            )}
            {triageResult.risk_level && (
              <div className="bg-white rounded-lg border border-green-100 px-4 py-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t("summary.riskLevel")}</p>
                <p className="text-gray-800 font-medium">{triageResult.risk_level}</p>
              </div>
            )}
            {triageResult.recommendation && (
              <div className="bg-white rounded-lg border border-green-100 px-4 py-3 sm:col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t("summary.recommendation")}</p>
                <p className="text-gray-800">{triageResult.recommendation}</p>
              </div>
            )}
            {triageResult.precautions && (
              <div className="bg-white rounded-lg border border-green-100 px-4 py-3 sm:col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t("summary.precautions")}</p>
                <p className="text-gray-800">{triageResult.precautions}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">

        {/* SUBMIT button */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className={`flex items-center justify-center gap-2 flex-1 px-6 py-3 rounded-xl text-sm font-semibold transition-colors ${
            submitting
              ? "bg-green-300 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 active:bg-green-800"
          }`}
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {t("summary.submitting")}
            </>
          ) : (
            <>
              <Send size={18} />
              {t("summary.submit")}
            </>
          )}
        </button>

        {/* DOWNLOAD button */}
        <button
          type="button"
          onClick={onDownload}
          disabled={submitting}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border transition-colors ${
            submitting
              ? "border-gray-200 text-gray-300 cursor-not-allowed"
              : "border-green-600 text-green-700 hover:bg-green-50 active:bg-green-100"
          }`}
        >
          <Download size={18} />
          {t("summary.download")}
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center">
        {t("summary.disclaimer")}
      </p>
    </div>
  );
};

export default SummaryStep;