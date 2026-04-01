// healthInterview/components/MedicalHistoryStep.tsx
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useVoiceForm } from "../../context/useVoiceForm";
import { CHRONIC_OPTIONS } from "./constants";
import type { FormData } from "./types";

interface Props {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}

const MedicalHistoryStep: React.FC<Props> = ({ form, setForm }) => {
  const { t } = useTranslation("healthInterview");

  const toggleChronic = (item: string) => {
    setForm((prev) => ({
      ...prev,
      chronicConditions: prev.chronicConditions.includes(item)
        ? prev.chronicConditions.filter((x) => x !== item)
        : [...prev.chronicConditions, item],
    }));
  };

  const setText = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // ── Refs ──
  const otherRef    = useRef<HTMLTextAreaElement>(null);
  const medRef      = useRef<HTMLTextAreaElement>(null);
  const allergyRef  = useRef<HTMLTextAreaElement>(null);

  useVoiceForm({
    formId: "medical-history-step",
    fields: [
      {
        id: "otherConditions", label: "Other Conditions",
        keywords:     ["other conditions", "other diseases", "other illness"],
        urduKeywords: ["aur bimarian", "dosri bimarian", "aur conditions"],
        setValue: (v) => setForm((p) => ({ ...p, otherConditions: v })),
        ref: otherRef,
      },
      {
        id: "currentMedicines", label: "Current Medicines",
        keywords:     ["medicine", "medicines", "medication", "drugs", "tablets"],
        urduKeywords: ["dawai", "dawa", "medicine", "tablet"],
        setValue: (v) => setForm((p) => ({ ...p, currentMedicines: v })),
        ref: medRef,
      },
      {
        id: "allergies", label: "Allergies",
        keywords:     ["allergy", "allergies", "allergic to"],
        urduKeywords: ["allergy", "allergy hai", "kisi cheez se allergy"],
        setValue: (v) => setForm((p) => ({ ...p, allergies: v })),
        ref: allergyRef,
      },
    ],
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-2">{t("history.chronicLabel")}</p>
        <div className="grid md:grid-cols-2 gap-2">
          {CHRONIC_OPTIONS.map((item) => {
            const checked = form.chronicConditions.includes(item);
            return (
              <button
                type="button" key={item} onClick={() => toggleChronic(item)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs text-left ${
                  checked
                    ? "bg-green-50 border-green-500 text-green-700"
                    : "border-gray-200 hover:border-green-400"
                }`}
              >
                <span>{item}</span>
                <span className="text-[10px]">{checked ? "✓" : t("common.tap")}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t("history.otherConditions")}</label>
        <textarea
          ref={otherRef}
          value={form.otherConditions} onChange={setText("otherConditions")} rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t("history.medicines")}</label>
        <textarea
          ref={medRef}
          value={form.currentMedicines} onChange={setText("currentMedicines")} rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          placeholder={t("history.medicinesPlaceholder")}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t("history.allergies")}</label>
        <textarea
          ref={allergyRef}
          value={form.allergies} onChange={setText("allergies")} rows={2}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>
  );
};

export default MedicalHistoryStep;