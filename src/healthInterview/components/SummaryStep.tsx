// healthInterview/components/LifestyleStep.tsx
import React from "react";
import { useTranslation } from "react-i18next";
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

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("lifestyle.smoking")}</label>
          <select value={form.smokingStatus} onChange={setVal("smokingStatus")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500">
            <option value="">{t("common.select")}</option>
            <option value="never">{t("lifestyle.never")}</option>
            <option value="past">{t("lifestyle.past")}</option>
            <option value="current">{t("lifestyle.current")}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("lifestyle.alcohol")}</label>
          <select value={form.alcoholUse} onChange={setVal("alcoholUse")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500">
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
          <select value={form.exercise} onChange={setVal("exercise")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500">
            <option value="">{t("common.select")}</option>
            <option value="none">{t("lifestyle.exerciseNone")}</option>
            <option value="1-2">{t("lifestyle.exercise12")}</option>
            <option value="3+">{t("lifestyle.exercise3plus")}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("lifestyle.sleep")}</label>
          <input value={form.sleepHours} onChange={setVal("sleepHours")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            placeholder={t("lifestyle.sleepPlaceholder")} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t("lifestyle.stress")}</label>
        <select value={form.stressLevel} onChange={setVal("stressLevel")}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500">
          <option value="">{t("common.select")}</option>
          <option value="low">{t("lifestyle.low")}</option>
          <option value="moderate">{t("lifestyle.moderate")}</option>
          <option value="high">{t("lifestyle.high")}</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t("lifestyle.moodNotes")}</label>
        <textarea value={form.moodNotes} onChange={setVal("moodNotes")} rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500" />
      </div>
    </div>
  );
};

export default LifestyleStep;