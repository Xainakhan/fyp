import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ClipboardList, ChevronLeft, ChevronRight } from "lucide-react";
import { useVoiceControl } from "../context/VoiceControlContext";

import type { FormData, TriageResponse } from "./components/types";
import { STEPS, API_BASE } from "./components/constants";
import {
  buildSymptomsArray,
  buildMedicalHistoryText,
  buildLifestyleText,
  parseDurationToDays,
} from "./components/Helpers";

import StepIndicator      from "./components/StepIndicator";
import BasicInfoStep      from "./components/BasicInfoStep";
import CurrentProblemStep from "./components/CurrentProblemStep";
import MedicalHistoryStep from "./components/MedicalHistroyStep";
import LifestyleStep      from "./components/lifestyleStep";
import SummaryStep        from "./components/SummaryStep";
interface HealthInterviewPageProps {
  userLanguage?: "en" | "ur"; 
}
const INITIAL_FORM: FormData = {
  fullName: "", age: "", gender: "", city: "", phone: "",
  mainConcern: "", symptomDuration: "", symptomPattern: "", symptomWorseWhen: "", associatedSymptoms: "",
  chronicConditions: [], otherConditions: "", currentMedicines: "", allergies: "",
  smokingStatus: "", alcoholUse: "", exercise: "", sleepHours: "", stressLevel: "", moodNotes: "",
};

const HealthInterviewPage: React.FC<HealthInterviewPageProps> = ({ userLanguage: _userLanguage }) => {
  const { t, i18n } = useTranslation("healthInterview");
  const isRTL  = i18n.dir() === "rtl";
  const isUrdu = i18n.language === "ur";

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [form,             setForm]             = useState<FormData>(INITIAL_FORM);
  const [submitting,       setSubmitting]       = useState(false);
  const [submitError,      setSubmitError]      = useState<string | null>(null);
  const [triageResult,     setTriageResult]     = useState<TriageResponse | null>(null);

  const currentStep = STEPS[currentStepIndex];
  const StepIcon    = currentStep.icon;

  const goNext = () => setCurrentStepIndex((p) => Math.min(p + 1, STEPS.length - 1));
  const goPrev = () => setCurrentStepIndex((p) => Math.max(p - 1, 0));

  const handleSubmitInterview = async () => {
    setSubmitError(null);
    setTriageResult(null);

    if (!form.fullName.trim()) { setSubmitError(t("errors.noName")); return; }
    const symptomsArray = buildSymptomsArray(form.associatedSymptoms, form.mainConcern);
    if (symptomsArray.length === 0) { setSubmitError(t("errors.noSymptoms")); return; }

    const payload = {
      basic_info: {
        full_name: form.fullName,
        age:    form.age ? Number(form.age) : null,
        gender: form.gender, city: form.city, phone: form.phone,
      },
      current_issue: {
        symptoms:      symptomsArray,
        duration_days: parseDurationToDays(form.symptomDuration),
        description:   form.mainConcern,
      },
      medical_history: buildMedicalHistoryText(form),
      lifestyle:       buildLifestyleText(form),
    };

    try {
      setSubmitting(true);
      const res  = await fetch(`${API_BASE}/api/interview/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.error || "Failed to submit interview.");
      setTriageResult(data.triage as TriageResponse);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : t("errors.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Voice step-navigation via lastCommand (no form registration needed) ──
  // This listens to commands like "next step", "back", "peeche" without
  // polluting the form registry with an empty-fields entry.
  const { lastCommand, guidedFillActive } = useVoiceControl();

  useEffect(() => {
    if (guidedFillActive) return; // guided fill owns the mic right now
    const tl = lastCommand.toLowerCase();

    if (/\b(next step|agla step|next page|aage|next)\b/.test(tl)) {
      goNext();
    } else if (/\b(back|peeche|previous|previous step|pichla)\b/.test(tl)) {
      goPrev();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastCommand]);

  const handleDownload = () => {
    const report = {
      generated_at: new Date().toISOString(),
      basic_info: { full_name: form.fullName, age: form.age, gender: form.gender, city: form.city, phone: form.phone },
      current_problem: { main_concern: form.mainConcern, duration: form.symptomDuration, pattern: form.symptomPattern, worse_when: form.symptomWorseWhen, associated_symptoms: form.associatedSymptoms },
      medical_history: { chronic_conditions: form.chronicConditions, other_conditions: form.otherConditions, current_medicines: form.currentMedicines, allergies: form.allergies },
      lifestyle: { smoking: form.smokingStatus, alcohol: form.alcoholUse, exercise: form.exercise, sleep_hours: form.sleepHours, stress_level: form.stressLevel, mood_notes: form.moodNotes },
      triage_result: triageResult ?? null,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `health-interview-${form.fullName.replace(/\s+/g, "_") || "report"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-1">

      {/* Header */}
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="flex items-center gap-3 mb-4 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md w-full overflow-hidden"
        style={{ padding: "10px 15px", minHeight: "64px" }}
      >
        <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
          <ClipboardList className="text-white" size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-white leading-snug break-words" style={{ fontSize: "clamp(1.1rem, 3vw, 1.75rem)" }}>
            {t("header.title")}
          </h1>
          <p className="text-m text-white break-words leading-snug mt-0.5">
            {t("header.subtitle")}
          </p>
        </div>
      </div>

      <StepIndicator currentStepIndex={currentStepIndex} />

      {/* Card */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <StepIcon size={20} className="text-green-600" />
          <h2 className="text-lg font-semibold text-gray-800">{t(`steps.${currentStep.id}`)}</h2>
        </div>

        {currentStep.id === "basic"     && <BasicInfoStep      form={form} setForm={setForm} />}
        {currentStep.id === "current"   && <CurrentProblemStep form={form} setForm={setForm} />}
        {currentStep.id === "history"   && <MedicalHistoryStep form={form} setForm={setForm} />}
        {currentStep.id === "lifestyle" && <LifestyleStep      form={form} setForm={setForm} />}
        {currentStep.id === "summary"   && (
          <SummaryStep
            form={form} triageResult={triageResult}
            submitError={submitError} submitting={submitting}
            onSubmit={handleSubmitInterview} onDownload={handleDownload}
          />
        )}

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button
            type="button" onClick={goPrev}
            disabled={currentStepIndex === 0}
            className={`flex items-center gap-2 px-4 py-1 rounded-lg text-sm border ${
              currentStepIndex === 0
                ? "border-gray-200 text-gray-300 cursor-default"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={16} />
            {t("nav.back")}
          </button>

          <button
            type="button" onClick={goNext}
            disabled={currentStepIndex === STEPS.length - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
              currentStepIndex === STEPS.length - 1
                ? "bg-gray-200 text-gray-400 cursor-default"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isUrdu ? "آگے چلیں" : t("nav.next")}
            {isUrdu ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthInterviewPage;