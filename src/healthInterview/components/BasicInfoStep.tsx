// healthInterview/components/BasicInfoStep.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import type { FormData } from "./types";

interface Props {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}

const BasicInfoStep: React.FC<Props> = ({ form, setForm }) => {
  const { t } = useTranslation("healthInterview");
  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("basic.fullName")}</label>
          <input value={form.fullName} onChange={set("fullName")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            placeholder={t("basic.fullNamePlaceholder")} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("basic.age")}</label>
          <input type="number" min={0} max={120} value={form.age} onChange={set("age")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("basic.gender")}</label>
          <select value={form.gender} onChange={set("gender")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500">
            <option value="">{t("common.select")}</option>
            <option value="male">{t("basic.male")}</option>
            <option value="female">{t("basic.female")}</option>
            <option value="other">{t("basic.other")}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("basic.city")}</label>
          <input value={form.city} onChange={set("city")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            placeholder={t("basic.cityPlaceholder")} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t("basic.phone")}</label>
        <input value={form.phone} onChange={set("phone")}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          placeholder={t("basic.phonePlaceholder")} />
      </div>
    </div>
  );
};

export default BasicInfoStep;