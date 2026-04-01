// healthInterview/components/LifestyleStep.tsx
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useVoiceForm } from "../../context/useVoiceForm";
import type { FormData } from "./types";

interface Props {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}

const LifestyleStep: React.FC<Props> = ({ form, setForm }) => {
  const { t } = useTranslation("healthInterview");

  const setVal = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // ── Refs ──
  const sleepRef = useRef<HTMLInputElement>(null);
  const moodRef  = useRef<HTMLTextAreaElement>(null);

  useVoiceForm({
    formId: "lifestyle-step",
    fields: [
      {
        id: "smokingStatus", label: "Smoking Status",
        keywords:     ["smoking", "smoke", "cigarette", "do you smoke"],
        urduKeywords: ["smoking", "sigret", "tambaaku"],
        // select — setValue maps spoken word to option value
        setValue: (v) => {
          const val = v.toLowerCase();
          const mapped =
            val.includes("never") || val.includes("no") || val.includes("nahi") ? "never" :
            val.includes("past")  || val.includes("pehle") ? "past" :
            val.includes("current") || val.includes("haan") || val.includes("yes") ? "current" : v;
          setForm((p) => ({ ...p, smokingStatus: mapped }));
        },
      },
      {
        id: "alcoholUse", label: "Alcohol Use",
        keywords:     ["alcohol", "drinking", "drink"],
        urduKeywords: ["alcohol", "sharab"],
        setValue: (v) => {
          const val = v.toLowerCase();
          const mapped =
            val.includes("none") || val.includes("no") || val.includes("nahi") ? "none" :
            val.includes("occasional") || val.includes("kabhi kabhi") ? "occasionally" :
            val.includes("regular") || val.includes("rozana") ? "regular" : v;
          setForm((p) => ({ ...p, alcoholUse: mapped }));
        },
      },
      {
        id: "exercise", label: "Exercise",
        keywords:     ["exercise", "workout", "physical activity"],
        urduKeywords: ["exercise", "kasrat", "workout"],
        setValue: (v) => {
          const val = v.toLowerCase();
          const mapped =
            val.includes("none") || val.includes("no") || val.includes("nahi") ? "none" :
            val.includes("1") || val.includes("2") || val.includes("one") || val.includes("two") ? "1-2" :
            val.includes("3") || val.includes("more") || val.includes("zyada") ? "3+" : v;
          setForm((p) => ({ ...p, exercise: mapped }));
        },
      },
      {
        id: "sleepHours", label: "Sleep Hours",
        keywords:     ["sleep", "hours of sleep", "sleep hours"],
        urduKeywords: ["neend", "neend ke ghante", "kitne ghante sota"],
        setValue: (v) => setForm((p) => ({ ...p, sleepHours: v })),
        ref: sleepRef,
      },
      {
        id: "stressLevel", label: "Stress Level",
        keywords:     ["stress", "stress level", "anxiety level"],
        urduKeywords: ["stress", "tension", "pareshan"],
        setValue: (v) => {
          const val = v.toLowerCase();
          const mapped =
            val.includes("low") || val.includes("kam") ? "low" :
            val.includes("moderate") || val.includes("medium") || val.includes("theek") ? "moderate" :
            val.includes("high") || val.includes("zyada") || val.includes("bohat") ? "high" : v;
          setForm((p) => ({ ...p, stressLevel: mapped }));
        },
      },
      {
        id: "moodNotes", label: "Mood Notes",
        keywords:     ["mood", "mood notes", "how are you feeling", "feeling"],
        urduKeywords: ["mood", "kaisa feel", "mizaj"],
        setValue: (v) => setForm((p) => ({ ...p, moodNotes: v })),
        ref: moodRef,
      },
    ],
  });

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("lifestyle.smoking")}</label>
          <select
            value={form.smokingStatus} onChange={setVal("smokingStatus")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="">{t("common.select")}</option>
            <option value="never">{t("lifestyle.never")}</option>
            <option value="past">{t("lifestyle.past")}</option>
            <option value="current">{t("lifestyle.current")}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("lifestyle.alcohol")}</label>
          <select
            value={form.alcoholUse} onChange={setVal("alcoholUse")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="">{t("common.select")}</option>
            <option value="none">{t("lifestyle.none")}</option>
            <option value="occasionally">{t("lifestyle.occasionally")}</option>
            <option value="regular">{t("lifestyle.regular")}</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("lifestyle.exercise")}</label>
          <select
            value={form.exercise} onChange={setVal("exercise")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="">{t("common.select")}</option>
            <option value="none">{t("lifestyle.exerciseNone")}</option>
            <option value="1-2">{t("lifestyle.exercise12")}</option>
            <option value="3+">{t("lifestyle.exercise3plus")}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("lifestyle.sleep")}</label>
          <input
            ref={sleepRef}
            value={form.sleepHours} onChange={setVal("sleepHours")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            placeholder={t("lifestyle.sleepPlaceholder")}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t("lifestyle.stress")}</label>
        <select
          value={form.stressLevel} onChange={setVal("stressLevel")}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
        >
          <option value="">{t("common.select")}</option>
          <option value="low">{t("lifestyle.low")}</option>
          <option value="moderate">{t("lifestyle.moderate")}</option>
          <option value="high">{t("lifestyle.high")}</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t("lifestyle.moodNotes")}</label>
        <textarea
          ref={moodRef}
          value={form.moodNotes} onChange={setVal("moodNotes")} rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>
  );
};

export default LifestyleStep;