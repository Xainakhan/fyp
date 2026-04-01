// healthInterview/components/CurrentProblemStep.tsx
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useVoiceForm } from "../../context/useVoiceForm";
import type { FormData } from "./types";

interface Props {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}

const CurrentProblemStep: React.FC<Props> = ({ form, setForm }) => {
  const { t } = useTranslation("healthInterview");
  const setText = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // ── Refs ──
  const concernRef  = useRef<HTMLTextAreaElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);
  const patternRef  = useRef<HTMLInputElement>(null);
  const worseRef    = useRef<HTMLInputElement>(null);
  const symptomsRef = useRef<HTMLTextAreaElement>(null);

  useVoiceForm({
    formId: "current-problem-step",
    fields: [
      {
        id: "mainConcern", label: "Main Concern",
        keywords:     ["concern", "problem", "issue", "main concern", "complaint"],
        urduKeywords: ["masla", "takleef", "bemari", "shikayat"],
        setValue: (v) => setForm((p) => ({ ...p, mainConcern: v })),
        ref: concernRef,
      },
      {
        id: "symptomDuration", label: "Duration",
        keywords:     ["duration", "how long", "since when", "days"],
        urduKeywords: ["kitne din", "muddat", "kab se"],
        setValue: (v) => setForm((p) => ({ ...p, symptomDuration: v })),
        ref: durationRef,
      },
      {
        id: "symptomPattern", label: "Pattern",
        keywords:     ["pattern", "when it happens", "symptom pattern"],
        urduKeywords: ["pattern", "kab hota", "kaisa hota"],
        setValue: (v) => setForm((p) => ({ ...p, symptomPattern: v })),
        ref: patternRef,
      },
      {
        id: "symptomWorseWhen", label: "Worse When",
        keywords:     ["worse", "worse when", "triggers", "aggravate"],
        urduKeywords: ["kab zyada", "worse kab", "badtar kab"],
        setValue: (v) => setForm((p) => ({ ...p, symptomWorseWhen: v })),
        ref: worseRef,
      },
      {
        id: "associatedSymptoms", label: "Other Symptoms",
        keywords:     ["other symptoms", "also have", "associated", "additionally"],
        urduKeywords: ["aur bhi", "dosre symptoms", "saath saath"],
        setValue: (v) => setForm((p) => ({ ...p, associatedSymptoms: v })),
        ref: symptomsRef,
      },
    ],
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t("current.mainConcern")}</label>
        <textarea
          ref={concernRef}
          value={form.mainConcern} onChange={setText("mainConcern")} rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          placeholder={t("current.mainConcernPlaceholder")}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("current.duration")}</label>
          <input
            ref={durationRef}
            value={form.symptomDuration} onChange={setText("symptomDuration")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            placeholder={t("current.durationPlaceholder")}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("current.pattern")}</label>
          <input
            ref={patternRef}
            value={form.symptomPattern} onChange={setText("symptomPattern")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            placeholder={t("current.patternPlaceholder")}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t("current.worseWhen")}</label>
        <input
          ref={worseRef}
          value={form.symptomWorseWhen} onChange={setText("symptomWorseWhen")}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t("current.otherSymptoms")}</label>
        <textarea
          ref={symptomsRef}
          value={form.associatedSymptoms} onChange={setText("associatedSymptoms")} rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          placeholder={t("current.otherSymptomsPlaceholder")}
        />
      </div>
    </div>
  );
};

export default CurrentProblemStep;