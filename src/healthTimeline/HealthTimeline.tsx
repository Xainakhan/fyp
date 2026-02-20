import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { SymptomEntry } from "../utils/healthUtils";
import {
  computePrediction,
  generateDiseaseSuggestions,
  getSeverityTrend,
  computeDurationText,
} from "../utils/healthUtils";

import HealthTimelineHeader from "./components/HealthTimelineHeader";
import AIAnalysisCard from "./components/AIAnalysisCard";
import PossibleConditionsCard from "./components/PossibleConditionsCard";
import SymptomTimeline from "./components/SymptomTimeline";
import SymptomForm from "./components/SymptomForm";
import StatsCards from "./components/StatsCards";

const DEFAULT_SYMPTOMS: SymptomEntry[] = [
  {
    id: "1",
    symptom: "Headache",
    severity: "mild",
    date: "2025-11-20",
    duration: "2 days",
    bodyPart: "Head",
    relatedSymptoms: ["dizziness"],
  },
  {
    id: "2",
    symptom: "Fever",
    severity: "moderate",
    date: "2025-11-22",
    duration: "3 days",
    bodyPart: "Whole body",
    relatedSymptoms: ["fatigue", "body ache"],
  },
  {
    id: "3",
    symptom: "Chest Pain",
    severity: "severe",
    date: "2025-11-24",
    duration: "1 day",
    bodyPart: "Chest",
    relatedSymptoms: ["shortness of breath", "anxiety"],
  },
];

const blankForm = () => ({
  symptom: "",
  severity: "mild" as SymptomEntry["severity"],
  date: new Date().toISOString().slice(0, 10),
  duration: "1 day",
  bodyPart: "",
  related: "",
});

const HealthTimeline: React.FC = () => {
  const { t } = useTranslation("healthTimeline");

  const [symptoms, setSymptoms] = useState<SymptomEntry[]>(DEFAULT_SYMPTOMS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(blankForm());

  const prediction         = useMemo(() => computePrediction(symptoms, t), [symptoms, t]);
  const diseaseSuggestions = useMemo(() => generateDiseaseSuggestions(symptoms, t), [symptoms, t]);
  const severityTrend      = useMemo(() => getSeverityTrend(symptoms, t), [symptoms, t]);
  const durationText       = useMemo(() => computeDurationText(symptoms), [symptoms]);

  const resetForm = () => {
    setEditingId(null);
    setForm(blankForm());
  };

  const handleToggleForm = () => {
    if (showForm && editingId) resetForm();
    setShowForm((v) => !v);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.symptom.trim()) return;

    const payload: SymptomEntry = {
      id: editingId ?? Date.now().toString(),
      symptom: form.symptom.trim(),
      severity: form.severity,
      date: form.date,
      duration: form.duration || "1 day",
      bodyPart: form.bodyPart || "Not specified",
      relatedSymptoms: form.related
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (editingId) {
      setSymptoms((prev) => prev.map((s) => (s.id === editingId ? payload : s)));
    } else {
      setSymptoms((prev) => [...prev, payload]);
    }

    resetForm();
    setShowForm(false);
  };

  const handleEdit = (entry: SymptomEntry) => {
    setEditingId(entry.id);
    setShowForm(true);
    setForm({
      symptom: entry.symptom,
      severity: entry.severity,
      date: entry.date,
      duration: entry.duration,
      bodyPart: entry.bodyPart,
      related: entry.relatedSymptoms.join(", "),
    });
  };

  const handleDelete = (id: string) => {
    setSymptoms((prev) => prev.filter((s) => s.id !== id));
    if (editingId === id) {
      resetForm();
      setShowForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        <HealthTimelineHeader
          title={t("header.title")}
          subtitle={t("header.subtitle")}
        />

        <AIAnalysisCard
          prediction={prediction}
          title={t("aiAnalysis.title")}
          recommendationLabel={t("aiAnalysis.recommendation")}
          riskLabel={t(`risk.${prediction.risk}`)}
        />

        <PossibleConditionsCard
          suggestions={diseaseSuggestions}
          title={t("possibleConditions.title")}
          disclaimer={t("possibleConditions.disclaimer")}
          likelyLabels={{
            low: t("possibleConditions.likely.low"),
            medium: t("possibleConditions.likely.medium"),
            high: t("possibleConditions.likely.high"),
          }}
        />

        <SymptomTimeline
          symptoms={symptoms}
          showForm={showForm}
          onToggleForm={handleToggleForm}
          onEdit={handleEdit}
          onDelete={handleDelete}
          labels={{
            title: t("timeline.title"),
            addButton: t("timeline.addButton"),
            closeForm: t("timeline.closeForm"),
            noSymptoms: t("timeline.noSymptoms"),
            location: t("timeline.location"),
            relatedSymptoms: t("timeline.relatedSymptoms"),
          }}
          actionLabels={{
            edit: t("actions.edit"),
            delete: t("actions.delete"),
          }}
          formSlot={
            <SymptomForm
              labels={{
                editingNotice: t("form.editingNotice"),
                updateButton: t("form.updateButton"),
                cancelEdit: t("form.cancelEdit"),
                symptomName: t("form.symptomName"),
                symptomPlaceholder: t("form.symptomPlaceholder"),
                severity: t("form.severity"),
                mild: t("form.mild"),
                moderate: t("form.moderate"),
                severe: t("form.severe"),
                date: t("form.date"),
                duration: t("form.duration"),
                durationPlaceholder: t("form.durationPlaceholder"),
                bodyPart: t("form.bodyPart"),
                bodyPartPlaceholder: t("form.bodyPartPlaceholder"),
                relatedSymptoms: t("form.relatedSymptoms"),
                relatedPlaceholder: t("form.relatedPlaceholder"),
                saveButton: t("form.saveButton"),
              }}
              editingId={editingId}
              symptom={form.symptom}
              severity={form.severity}
              date={form.date}
              duration={form.duration}
              bodyPart={form.bodyPart}
              related={form.related}
              onSymptomChange={(v) => setForm((f) => ({ ...f, symptom: v }))}
              onSeverityChange={(v) => setForm((f) => ({ ...f, severity: v }))}
              onDateChange={(v) => setForm((f) => ({ ...f, date: v }))}
              onDurationChange={(v) => setForm((f) => ({ ...f, duration: v }))}
              onBodyPartChange={(v) => setForm((f) => ({ ...f, bodyPart: v }))}
              onRelatedChange={(v) => setForm((f) => ({ ...f, related: v }))}
              onSubmit={handleSubmit}
              onCancelEdit={() => {
                resetForm();
                setShowForm(false);
              }}
            />
          }
        />

        <StatsCards
          totalSymptoms={symptoms.length}
          durationText={durationText}
          severityTrend={severityTrend}
          labels={{
            totalSymptoms: t("stats.totalSymptoms"),
            timelineDuration: t("stats.timelineDuration"),
            severityTrend: t("stats.severityTrend"),
          }}
        />

      </div>
    </div>
  );
};

export default HealthTimeline;