// src/pages/symptomChecker.tsx
import React, { useState, useEffect, type KeyboardEvent } from "react";
import {
  Activity,
  AlertTriangle,
  Brain,
  Heart,
  Stethoscope,
  Thermometer,
  Smile,
  Search,
} from "lucide-react";

type Lang = "en" | "ur";

interface SymptomCheckerProps {
  userLanguage?: Lang;
}

type Severity = "mild" | "moderate" | "severe" | "";

interface AnalysisResult {
  riskLevel: "low" | "medium" | "high" | "emergency";
  title: string;
  message: string;
  suggestedSpecialties: string[];
  homeCare: string[];
  redFlags: string[];
}

const COMMON_SYMPTOMS = [
  "fever",
  "cough",
  "shortness of breath",
  "chest pain",
  "headache",
  "dizziness",
  "nausea",
  "vomiting",
  "diarrhea",
  "abdominal pain",
  "back pain",
  "joint pain",
  "rash",
  "anxiety",
  "low mood",
  "palpitations",
];

const SymptomCheckerPage: React.FC<SymptomCheckerProps> = ({
  userLanguage = "en",
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Lang>(userLanguage);

  useEffect(() => {
    setCurrentLanguage(userLanguage);
  }, [userLanguage]);

  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [symptomInput, setSymptomInput] = useState<string>("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>("");
  const [severity, setSeverity] = useState<Severity>("");
  const [bodyArea, setBodyArea] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [touched, setTouched] = useState(false);

  const addSymptom = (value?: string) => {
    const trimmed = (value ?? symptomInput).trim().toLowerCase();
    if (!trimmed) return;
    if (!symptoms.includes(trimmed)) {
      setSymptoms((prev) => [...prev, trimmed]);
    }
    setSymptomInput("");
  };

  const onSymptomKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSymptom();
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms((prev) => prev.filter((s) => s !== symptom));
  };

  const analyze = () => {
    setTouched(true);

    if (!age || symptoms.length === 0) {
      setResult(null);
      return;
    }

    const ageNum = Number(age);
    const symptomText = symptoms.join(", ");
    const lowerSymptoms = symptoms.join(" ").toLowerCase();

    const flags: string[] = [];
    const specialties: string[] = [];
    const homeCare: string[] = [];
    let risk: AnalysisResult["riskLevel"] = "low";

    const hasChestPain = lowerSymptoms.includes("chest pain");
    const hasBreath =
      lowerSymptoms.includes("shortness of breath") ||
      lowerSymptoms.includes("breathing") ||
      lowerSymptoms.includes("difficulty breathing");
    const hasStroke =
      lowerSymptoms.includes("weakness") ||
      lowerSymptoms.includes("numbness") ||
      lowerSymptoms.includes("face droop") ||
      lowerSymptoms.includes("slurred speech");
    const hasSevereHeadache =
      lowerSymptoms.includes("worst headache") ||
      (lowerSymptoms.includes("headache") && severity === "severe");
    const hasBleeding = lowerSymptoms.includes("bleeding");
    const hasSuicidal =
      lowerSymptoms.includes("suicidal") ||
      lowerSymptoms.includes("want to die") ||
      lowerSymptoms.includes("self harm");

    if (hasChestPain || hasBreath || hasStroke || hasSevereHeadache || hasBleeding) {
      risk = "emergency";
      flags.push(
        "Chest pain, breathing difficulty, sudden weakness/numbness, severe headache, or heavy bleeding can be medical emergencies."
      );
    } else if (severity === "severe" || hasSuicidal) {
      risk = "high";
      if (hasSuicidal) {
        flags.push(
          "Thoughts of self-harm or suicide require immediate mental-health support."
        );
      } else {
        flags.push(
          "Severe symptoms or rapid worsening should be checked by a doctor urgently."
        );
      }
    } else if (severity === "moderate" || ageNum < 5 || ageNum > 65) {
      risk = risk === "low" ? "medium" : risk;
      flags.push(
        "Very young or older age, or moderate symptoms, increase the need for medical review."
      );
    }

    if (hasChestPain || lowerSymptoms.includes("palpitations")) {
      specialties.push("Cardiology (Heart Specialist)");
    }
    if (hasBreath || lowerSymptoms.includes("cough")) {
      specialties.push("Pulmonology / Chest Medicine");
    }
    if (lowerSymptoms.includes("headache") || lowerSymptoms.includes("seizure")) {
      specialties.push("Neurology (Brain & Nerves)");
    }
    if (
      lowerSymptoms.includes("abdominal") ||
      lowerSymptoms.includes("stomach") ||
      lowerSymptoms.includes("diarrhea") ||
      lowerSymptoms.includes("vomiting")
    ) {
      specialties.push("Gastroenterology (Stomach & Digestive System)");
    }
    if (
      lowerSymptoms.includes("fever") ||
      lowerSymptoms.includes("infection") ||
      lowerSymptoms.includes("flu")
    ) {
      specialties.push("General Medicine / Family Physician");
    }
    if (lowerSymptoms.includes("rash") || lowerSymptoms.includes("itching")) {
      specialties.push("Dermatology (Skin Specialist)");
    }
    if (
      lowerSymptoms.includes("anxiety") ||
      lowerSymptoms.includes("panic") ||
      lowerSymptoms.includes("depression") ||
      lowerSymptoms.includes("sleep")
    ) {
      specialties.push("Psychiatry / Mental Health");
    }
    if (lowerSymptoms.includes("joint") || lowerSymptoms.includes("back pain")) {
      specialties.push("Orthopedics / Rheumatology");
    }

    if (specialties.length === 0) {
      specialties.push("General Physician / Family Doctor");
    }

    if (lowerSymptoms.includes("fever")) {
      homeCare.push(
        "Keep hydrated, wear light clothes, and use paracetamol as advised by a doctor."
      );
    }
    if (lowerSymptoms.includes("cough") || lowerSymptoms.includes("sore throat")) {
      homeCare.push(
        "Warm fluids, throat lozenges, and steam inhalation may give temporary relief."
      );
    }
    if (lowerSymptoms.includes("diarrhea") || lowerSymptoms.includes("vomiting")) {
      homeCare.push(
        "Take oral rehydration solution (ORS) in small, frequent sips to avoid dehydration."
      );
    }
    if (
      lowerSymptoms.includes("anxiety") ||
      lowerSymptoms.includes("panic") ||
      lowerSymptoms.includes("stress")
    ) {
      homeCare.push(
        "Practice slow deep breathing, grounding exercises, and avoid caffeine or energy drinks."
      );
    }
    if (homeCare.length === 0) {
      homeCare.push(
        "Monitor your symptoms, rest as needed, and avoid self-medicating with strong drugs without a doctor’s advice."
      );
    }

    const resultEn: AnalysisResult = {
      riskLevel: risk,
      title:
        risk === "emergency"
          ? "Possible Emergency – Seek Urgent Help"
          : risk === "high"
          ? "High-Priority Medical Review Recommended"
          : risk === "medium"
          ? "Medical Check-Up Recommended"
          : "Likely Mild – Monitor & Consult If Needed",
      message: `Based on the information you entered (age ${ageNum}, symptoms: ${symptomText}), this is a preliminary guidance only – not a diagnosis.`,
      suggestedSpecialties: [...new Set(specialties)],
      homeCare,
      redFlags: flags,
    };

    if (currentLanguage === "en") {
      setResult(resultEn);
    } else {
      setResult({
        ...resultEn,
        title:
          risk === "emergency"
            ? "ممکنہ ایمرجنسی – فوری طبی مدد حاصل کریں"
            : risk === "high"
            ? "زیادہ خطرہ – جلد ڈاکٹر سے رجوع کریں"
            : risk === "medium"
            ? "ڈاکٹر سے معائنہ کروانے کی تجویز"
            : "ہلکی نوعیت کی علامات – نظر رکھیں اور ضرورت پر ڈاکٹر سے رابطہ کریں",
        message:
          "یہ صرف ابتدائی رہنمائی ہے، تشخیص نہیں۔ ہمیشہ حتمی رائے کے لیے ڈاکٹر سے مشورہ کریں۔",
      });
    }
  };

  // 🔽 NEW: helper to download “prescription / summary”
  const handleDownloadPrescription = () => {
    if (!result || !age || symptoms.length === 0) return;

    const date = new Date();
    const severityLabelEn =
      severity === "mild"
        ? "Mild"
        : severity === "moderate"
        ? "Moderate"
        : severity === "severe"
        ? "Severe"
        : "Not specified";

    const contentLines: string[] = [];

    contentLines.push("SehatHub – Symptom Summary / Prescription\n");
    contentLines.push(`Date & Time: ${date.toLocaleString()}`);
    contentLines.push("----------------------------------------");
    contentLines.push(`Age: ${age}`);
    contentLines.push(`Gender: ${gender || "Not specified"}`);
    contentLines.push(`Body Area: ${bodyArea || "Not specified"}`);
    contentLines.push("");
    contentLines.push(`Symptoms: ${symptoms.join(", ")}`);
    contentLines.push(
      `Duration: ${
        duration || "Not specified"
      } | Severity: ${severityLabelEn} | Risk level: ${result.riskLevel.toUpperCase()}`
    );
    contentLines.push("");
    contentLines.push("Suggested Specialties:");
    result.suggestedSpecialties.forEach((s, i) =>
      contentLines.push(`${i + 1}. ${s}`)
    );
    contentLines.push("");
    contentLines.push("Home-care / Self-care Advice:");
    result.homeCare.forEach((h, i) => contentLines.push(`${i + 1}. ${h}`));
    if (result.redFlags.length > 0) {
      contentLines.push("");
      contentLines.push("Warning / Red Flags:");
      result.redFlags.forEach((f, i) => contentLines.push(`${i + 1}. ${f}`));
    }
    if (notes.trim()) {
      contentLines.push("");
      contentLines.push("Patient Notes:");
      contentLines.push(notes.trim());
    }
    contentLines.push("");
    contentLines.push(
      "IMPORTANT: This document is automatically generated for informational use only. It is NOT a medical prescription and NOT a substitute for a consultation with a licensed doctor."
    );

    const blob = new Blob([contentLines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SehatHub_Symptom_Summary.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const riskColor =
    result?.riskLevel === "emergency"
      ? "border-red-500 bg-red-50"
      : result?.riskLevel === "high"
      ? "border-orange-500 bg-orange-50"
      : result?.riskLevel === "medium"
      ? "border-yellow-400 bg-yellow-50"
      : "border-green-500 bg-green-50";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
            <Activity className="text-blue-600" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {currentLanguage === "en"
                ? "Symptom Checker"
                : "علامات کا تجزیہ (Symptom Checker)"}
            </h1>
            <p className="text-sm text-gray-600 max-w-xl">
              {currentLanguage === "en"
                ? "Answer a few quick questions to understand how urgent your symptoms may be and which type of doctor could be suitable."
                : "چند سوالات کے جواب دیں تاکہ اندازہ ہو سکے کہ علامات کتنی سنگین ہیں اور کس قسم کے ڈاکٹر سے رجوع کرنا بہتر ہو سکتا ہے۔"}
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setCurrentLanguage((prev) => (prev === "en" ? "ur" : "en"))
          }
          className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium"
        >
          {currentLanguage === "en" ? "اردو" : "English"}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT: form */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-6">
          {/* Basic details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                {currentLanguage === "en" ? "Age (years)" : "عمر (سال)"}
              </label>
              <input
                type="number"
                min={0}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {touched && !age && (
                <p className="text-xs text-red-500 mt-1">
                  {currentLanguage === "en"
                    ? "Please enter age."
                    : "براہ کرم عمر درج کریں۔"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                {currentLanguage === "en" ? "Gender" : "صنف"}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">
                  {currentLanguage === "en" ? "Select" : "منتخب کریں"}
                </option>
                <option value="male">
                  {currentLanguage === "en" ? "Male" : "مرد"}
                </option>
                <option value="female">
                  {currentLanguage === "en" ? "Female" : "عورت"}
                </option>
                <option value="other">
                  {currentLanguage === "en" ? "Other" : "دیگر"}
                </option>
              </select>
            </div>
          </div>

          {/* Symptoms input */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              {currentLanguage === "en"
                ? "Main symptoms"
                : "اہم علامات (انگلش میں لکھیں)"}
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                onKeyDown={onSymptomKeyDown}
                placeholder={
                  currentLanguage === "en"
                    ? "Type a symptom and press Enter (e.g. chest pain, fever)"
                    : "علامت انگلش میں لکھیں اور Enter دبائیں (مثلاً chest pain, fever)"
                }
                className="w-full border rounded-lg pl-9 pr-24 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => addSymptom()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs rounded-full bg-blue-600 text-white hover:bg-blue-700"
              >
                {currentLanguage === "en" ? "Add" : "شامل کریں"}
              </button>
            </div>
            {touched && symptoms.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                {currentLanguage === "en"
                  ? "Add at least one symptom."
                  : "کم از کم ایک علامت ضرور شامل کریں۔"}
              </p>
            )}

            {symptoms.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {symptoms.map((sym) => (
                  <span
                    key={sym}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs"
                  >
                    {sym}
                    <button
                      type="button"
                      onClick={() => removeSymptom(sym)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick add */}
          <div>
            <p className="text-[11px] text-gray-500 mb-1">
              {currentLanguage === "en"
                ? "Quick add common symptoms:"
                : "عام علامات فوراً شامل کریں:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {COMMON_SYMPTOMS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => addSymptom(item)}
                  className="px-3 py-1 rounded-full border text-[11px] text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Duration + severity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                {currentLanguage === "en"
                  ? "How long have you had these symptoms?"
                  : "یہ علامات کب سے ہیں؟"}
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">
                  {currentLanguage === "en" ? "Select" : "منتخب کریں"}
                </option>
                <option value="<24h">
                  {currentLanguage === "en"
                    ? "Less than 24 hours"
                    : "کم از کم 24 گھنٹے"}
                </option>
                <option value="1-3d">
                  {currentLanguage === "en" ? "1–3 days" : "1–3 دن"}
                </option>
                <option value="4-7d">
                  {currentLanguage === "en" ? "4–7 days" : "4–7 دن"}
                </option>
                <option value=">7d">
                  {currentLanguage === "en" ? "More than a week" : "ایک ہفتے سے زائد"}
                </option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                {currentLanguage === "en"
                  ? "How severe is it?"
                  : "شدت کتنی ہے؟"}
              </label>
              <div className="flex gap-2">
                {(["mild", "moderate", "severe"] as Severity[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSeverity(level)}
                    className={`flex-1 px-2 py-2 rounded-lg text-xs border transition ${
                      severity === level
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-200 text-gray-700 hover:border-blue-400"
                    }`}
                  >
                    {currentLanguage === "en"
                      ? level.charAt(0).toUpperCase() + level.slice(1)
                      : level === "mild"
                      ? "ہلکی"
                      : level === "moderate"
                      ? "درمیانی"
                      : "زیادہ"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Body area & notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              {currentLanguage === "en"
                ? "Where in the body is the problem mainly?"
                : "مسئلہ زیادہ تر جسم کے کس حصے میں ہے؟"}
            </label>
            <input
              type="text"
              value={bodyArea}
              onChange={(e) => setBodyArea(e.target.value)}
              placeholder={
                currentLanguage === "en"
                  ? "e.g. chest, lower abdomen, left leg, whole body"
                  : "مثال: سینہ، نچلا پیٹ، بایاں ٹانگ وغیرہ"
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              {currentLanguage === "en"
                ? "Anything else important the doctor should know?"
                : "کوئی اور اہم بات جو ڈاکٹر کو پتہ ہونی چاہیے؟"}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-2">
            <button
              type="button"
              onClick={analyze}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              <Stethoscope size={18} />
              {currentLanguage === "en"
                ? "Analyze Symptoms"
                : "علامات کا تجزیہ کریں"}
            </button>

            {/* 🔽 NEW: Download prescription / summary button */}
            <button
              type="button"
              onClick={handleDownloadPrescription}
              disabled={!result}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:bg-green-300 transition"
            >
              📄{" "}
              {currentLanguage === "en"
                ? "Download Summary / Prescription"
                : "سمری / پریسکرپشن ڈاؤن لوڈ کریں"}
            </button>
          </div>

          <div className="mt-4 flex gap-2 text-[11px] text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <AlertTriangle size={14} className="text-yellow-600 mt-[2px]" />
            <p>
              {currentLanguage === "en"
                ? "This tool is for information only and does not replace a doctor. If you feel your condition is worsening or life-threatening, seek emergency care immediately."
                : "یہ ٹول صرف معلوماتی مقصد کے لیے ہے، ڈاکٹر کا متبادل نہیں۔ اگر آپ کی حالت بگڑ رہی ہو یا جان کو خطرہ لگے تو فوراً ایمرجنسی پر جائیں۔"}
            </p>
          </div>
        </div>

        {/* RIGHT: result */}
        <div className="space-y-4">
          {result ? (
            <div
              className={`border-2 rounded-2xl p-6 shadow-sm ${riskColor} transition-all`}
            >
              <div className="flex items-center gap-3 mb-3">
                {result.riskLevel === "emergency" ? (
                  <AlertTriangle className="text-red-600" size={24} />
                ) : result.riskLevel === "high" ? (
                  <Thermometer className="text-orange-500" size={24} />
                ) : result.riskLevel === "medium" ? (
                  <Brain className="text-yellow-500" size={24} />
                ) : (
                  <Smile className="text-green-600" size={24} />
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {result.title}
                  </h2>
                  <p className="text-sm text-gray-600">{result.message}</p>
                </div>
              </div>

              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white text-gray-700 border">
                  {currentLanguage === "en" ? "Risk level:" : "خطرے کی سطح:"}{" "}
                  <span className="ml-1 capitalize">
                    {result.riskLevel.toString()}
                  </span>
                </span>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2">
                  <Heart size={16} className="text-pink-600" />
                  {currentLanguage === "en"
                    ? "Possible doctor specialties:"
                    : "ممکنہ متعلقہ ڈاکٹرز:"}
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {result.suggestedSpecialties.map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2">
                  <Smile size={16} className="text-green-600" />
                  {currentLanguage === "en"
                    ? "General self-care tips:"
                    : "عام خود نگہداشت کی تجاویز:"}
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {result.homeCare.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              {result.redFlags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-red-700 mb-1 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-600" />
                    {currentLanguage === "en"
                      ? "Warning signs:"
                      : "خطرے کی نشانیاں:"}
                  </h3>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {result.redFlags.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500 text-sm max-w-sm">
                <Stethoscope className="mx-auto mb-3 text-gray-400" size={32} />
                <p>
                  {currentLanguage === "en"
                    ? "Fill the information on the left and click “Analyze Symptoms” to see guidance here."
                    : "بائیں طرف معلومات درج کریں اور \"علامات کا تجزیہ کریں\" پر کلک کریں، نتیجہ یہاں دکھایا جائے گا۔"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomCheckerPage;
