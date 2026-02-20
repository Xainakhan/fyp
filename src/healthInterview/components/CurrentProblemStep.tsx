// healthInterview/components/CurrentProblemStep.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import type { FormData } from "./types";

interface Props {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}

const CurrentProblemStep: React.FC<Props> = ({ form, setForm }) => {
  const { t } = useTranslation("healthInterview");
  const setText = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t("current.mainConcern")}</label>
        <textarea value={form.mainConcern} onChange={setText("mainConcern")} rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          placeholder={t("current.mainConcernPlaceholder")} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("current.duration")}</label>
          <input value={form.symptomDuration} onChange={setText("symptomDuration")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            placeholder={t("current.durationPlaceholder")} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("current.pattern")}</label>
          <input value={form.symptomPattern} onChange={setText("symptomPattern")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            placeholder={t("current.patternPlaceholder")} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t("current.worseWhen")}</label>
        <input value={form.symptomWorseWhen} onChange={setText("symptomWorseWhen")}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t("current.otherSymptoms")}</label>
        <textarea value={form.associatedSymptoms} onChange={setText("associatedSymptoms")} rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          placeholder={t("current.otherSymptomsPlaceholder")} />
      </div>
    </div>
  );
};

export default CurrentProblemStep;