// healthInterview/components/BasicInfoStep.tsx
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useVoiceForm } from "../../context/useVoiceForm";
import type { FormData } from "./types";

interface Props {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}

const BasicInfoStep: React.FC<Props> = ({ form, setForm }) => {
  const { t } = useTranslation("healthInterview");
  const set = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const nameRef   = useRef<HTMLInputElement>(null);
  const ageRef    = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const cityRef   = useRef<HTMLInputElement>(null);
  const phoneRef  = useRef<HTMLInputElement>(null);

  useVoiceForm({
    formId: "basic-info-step",
    fields: [
      {
        id: "fullName", label: "Full Name",
        keywords:     ["name", "full name", "my name"],
        urduKeywords: ["naam", "apna naam", "mera naam"],
        setValue: (v) => setForm((p) => ({ ...p, fullName: v })),
        ref: nameRef,
      },
      {
        id: "age", label: "Age",
        keywords:     ["age", "my age", "years old"],
        urduKeywords: ["umar", "meri umar", "saal"],
        setValue: (v) => setForm((p) => ({ ...p, age: v })),
        ref: ageRef,
      },
      {
        id: "gender", label: "Gender",
        keywords:     ["gender", "sex", "i am", "i'm"],
        urduKeywords: ["jins", "mard", "aurat", "khawateen"],
        // options let the voice system announce choices AND fuzzy-match spoken word
        options: [
          { value: "male",   label: "Male",   urduLabel: "مرد",   aliases: ["man", "boy", "mard", "larka"] },
          { value: "female", label: "Female", urduLabel: "عورت",  aliases: ["woman", "girl", "aurat", "larki", "khawateen"] },
          { value: "other",  label: "Other",  urduLabel: "دیگر",  aliases: ["prefer not", "non binary", "deegar"] },
        ],
        setValue: (v) => setForm((p) => ({ ...p, gender: v })),
        ref: genderRef,
      },
      {
        id: "city", label: "City",
        keywords:     ["city", "my city", "location", "from"],
        urduKeywords: ["shehar", "mera shehar"],
        setValue: (v) => setForm((p) => ({ ...p, city: v })),
        ref: cityRef,
      },
      {
        id: "phone", label: "Phone Number",
        keywords:     ["phone", "mobile", "number", "phone number", "contact"],
        urduKeywords: ["phone", "nambur", "mobile nambur"],
        setValue: (v) => setForm((p) => ({ ...p, phone: v })),
        ref: phoneRef,
      },
    ],
  });

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("basic.fullName")}</label>
          <input
            ref={nameRef}
            value={form.fullName} onChange={set("fullName")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            placeholder={t("basic.fullNamePlaceholder")}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("basic.age")}</label>
          <input
            ref={ageRef}
            type="number" min={0} max={120}
            value={form.age} onChange={set("age")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("basic.gender")}</label>
          <select
            ref={genderRef}
            value={form.gender} onChange={set("gender")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="">{t("common.select")}</option>
            <option value="male">{t("basic.male")}</option>
            <option value="female">{t("basic.female")}</option>
            <option value="other">{t("basic.other")}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("basic.city")}</label>
          <input
            ref={cityRef}
            value={form.city} onChange={set("city")}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            placeholder={t("basic.cityPlaceholder")}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t("basic.phone")}</label>
        <input
          ref={phoneRef}
          value={form.phone} onChange={set("phone")}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          placeholder={t("basic.phonePlaceholder")}
        />
      </div>
    </div>
  );
};

export default BasicInfoStep;