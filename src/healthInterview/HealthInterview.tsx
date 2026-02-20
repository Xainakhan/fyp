// healthInterview/healthInterview.tsx  ← main entry point
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ClipboardList, ChevronLeft, ChevronRight } from "lucide-react";

import type { FormData, TriageResponse } from "./components/types";
import { STEPS, API_BASE } from "./components/Constants";
import { buildSymptomsArray, buildMedicalHistoryText, buildLifestyleText, parseDurationToDays } from "./components/Helpers";

import StepIndicator from "./components/StepIndicator";
import BasicInfoStep from "./components/BasicInfoStep";
import CurrentProblemStep from "./components/CurrentProblemStep";
import MedicalHistoryStep from "./components/MedicalHistroyStep";
import LifestyleStep from "./components/lifestyleStep";
import SummaryStep from "./components/SummaryStep";

const INITIAL_FORM: FormData = {
  fullName: "", age: "", gender: "", city: "", phone: "",
  mainConcern: "", symptomDuration: "", symptomPattern: "", symptomWorseWhen: "", associatedSymptoms: "",
  chronicConditions: [], otherConditions: "", currentMedicines: "", allergies: "",
  smokingStatus: "", alcoholUse: "", exercise: "", sleepHours: "", stressLevel: "", moodNotes: "",
};

const HealthInterviewPage: React.FC = () => {
  const { t } = useTranslation("healthInterview");

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [triageResult, setTriageResult] = useState<TriageResponse | null>(null);

  const currentStep = STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;

  const goNext = () => setCurrentStepIndex((p) => Math.min(p + 1, STEPS.length - 1));
  const goPrev = () => setCurrentStepIndex((p) => Math.max(p - 1, 0));

  const handleSubmitInterview = async () => {
    setSubmitError(null);
    setTriageResult(null);

    if (!form.fullName.trim()) {
      setSubmitError(t("errors.noName"));
      return;
    }
    const symptomsArray = buildSymptomsArray(form.associatedSymptoms, form.mainConcern);
    if (symptomsArray.length === 0) {
      setSubmitError(t("errors.noSymptoms"));
      return;
    }

    const payload = {
      basic_info: { full_name: form.fullName, age: form.age ? Number(form.age) : null, gender: form.gender, city: form.city, phone: form.phone },
      current_issue: { symptoms: symptomsArray, duration_days: parseDurationToDays(form.symptomDuration), description: form.mainConcern },
      medical_history: buildMedicalHistoryText(form),
      lifestyle: buildLifestyleText(form),
    };

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/interview/submit`, {
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <ClipboardList className="text-green-600" size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t("header.title")}</h1>
          <p className="text-sm text-gray-600 max-w-xl">{t("header.subtitle")}</p>
        </div>
      </div>

      {/* Step indicator */}
      <StepIndicator currentStepIndex={currentStepIndex} />

      {/* Card */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <StepIcon size={20} className="text-green-600" />
          <h2 className="text-lg font-semibold text-gray-800">{t(`steps.${currentStep.id}`)}</h2>
        </div>

        {currentStep.id === "basic"     && <BasicInfoStep form={form} setForm={setForm} />}
        {currentStep.id === "current"   && <CurrentProblemStep form={form} setForm={setForm} />}
        {currentStep.id === "history"   && <MedicalHistoryStep form={form} setForm={setForm} />}
        {currentStep.id === "lifestyle" && <LifestyleStep form={form} setForm={setForm} />}
        {currentStep.id === "summary"   && (
          <SummaryStep form={form} triageResult={triageResult}
            submitError={submitError} submitting={submitting}
            onSubmit={handleSubmitInterview} />
        )}

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button type="button" onClick={goPrev} disabled={currentStepIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border ${
              currentStepIndex === 0 ? "border-gray-200 text-gray-300 cursor-default" : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}>
            <ChevronLeft size={16} />{t("nav.back")}
          </button>
          <button type="button" onClick={goNext} disabled={currentStepIndex === STEPS.length - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
              currentStepIndex === STEPS.length - 1 ? "bg-gray-200 text-gray-400 cursor-default" : "bg-green-600 text-white hover:bg-green-700"
            }`}>
            {t("nav.next")}<ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthInterviewPage;