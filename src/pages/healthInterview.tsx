// src/pages/healthInterview.tsx
import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  User,
  Activity,
  HeartPulse,
  Moon,
  SmilePlus,
  ChevronLeft,
  ChevronRight,
  FileDown,
} from "lucide-react";

const API_BASE = "http://localhost:5000";

type Lang = "en" | "ur";

interface HealthInterviewPageProps {
  userLanguage?: Lang;
}

type StepId = "basic" | "current" | "history" | "lifestyle" | "summary";

interface Step {
  id: StepId;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const STEPS: Step[] = [
  { id: "basic", icon: User },
  { id: "current", icon: ClipboardList },
  { id: "history", icon: HeartPulse },
  { id: "lifestyle", icon: Activity },
  { id: "summary", icon: SmilePlus },
];

const TEXT = {
  title: {
    en: "Health Interview",
    ur: "صحت کا انٹرویو",
  },
  subtitle: {
    en: "Answer a few structured questions to prepare a clean summary for your doctor.",
    ur: "کچھ سوالات کے جوابات دیں تاکہ ڈاکٹر کے لیے صاف اور مکمل سمری تیار ہو سکے۔",
  },
  stepLabels: {
    basic: {
      en: "Basic Info",
      ur: "بنیادی معلومات",
    },
    current: {
      en: "Current Issue",
      ur: "موجودہ مسئلہ",
    },
    history: {
      en: "Medical History",
      ur: "طبی تاریخ",
    },
    lifestyle: {
      en: "Lifestyle & Mental Health",
      ur: "طرزِ زندگی اور ذہنی صحت",
    },
    summary: {
      en: "Summary",
      ur: "خلاصہ",
    },
  },
};

interface TriageResponse {
  primary_prediction: {
    disease: string;
    confidence: number; // 0–1
    info?: {
      precautions?: string[];
    };
  };
  severity: {
    level: string;
    score: number;
    recommendation: string;
  };
  input_symptoms?: string[];
  duration_days?: number;
}

const HealthInterviewPage: React.FC<HealthInterviewPageProps> = ({
  userLanguage = "en",
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Lang>(userLanguage);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // --- NEW: backend state ---
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [triageResult, setTriageResult] = useState<TriageResponse | null>(null);

  useEffect(() => {
    setCurrentLanguage(userLanguage);
  }, [userLanguage]);

  // --- FORM STATE ---

  // Step 1 – basic info
  const [fullName, setFullName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  // Step 2 – current problem
  const [mainConcern, setMainConcern] = useState<string>("");
  const [symptomDuration, setSymptomDuration] = useState<string>("");
  const [symptomPattern, setSymptomPattern] = useState<string>("");
  const [symptomWorseWhen, setSymptomWorseWhen] = useState<string>("");
  const [associatedSymptoms, setAssociatedSymptoms] = useState<string>("");

  // Step 3 – history
  const [chronicConditions, setChronicConditions] = useState<string[]>([]);
  const [otherConditions, setOtherConditions] = useState<string>("");
  const [currentMedicines, setCurrentMedicines] = useState<string>("");
  const [allergies, setAllergies] = useState<string>("");

  const CHRONIC_OPTIONS = [
    "Diabetes",
    "High blood pressure",
    "Heart disease",
    "Asthma / lung disease",
    "Kidney disease",
    "Liver disease",
    "Thyroid / hormone problems",
  ];

  const toggleChronic = (item: string) => {
    setChronicConditions((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  // Step 4 – lifestyle
  const [smokingStatus, setSmokingStatus] = useState<string>("");
  const [alcoholUse, setAlcoholUse] = useState<string>("");
  const [exercise, setExercise] = useState<string>("");
  const [sleepHours, setSleepHours] = useState<string>("");
  const [stressLevel, setStressLevel] = useState<string>("");
  const [moodNotes, setMoodNotes] = useState<string>("");

  // --- NAVIGATION ---

  const goNext = () => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const goPrev = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const currentStep = STEPS[currentStepIndex];

  // --- HELPERS FOR BACKEND PAYLOAD ---

  const parseDurationToDays = (input: string): number => {
    if (!input) return 0;
    const lower = input.toLowerCase();
    const numMatch = lower.match(/(\d+)/);
    const n = numMatch ? parseInt(numMatch[1], 10) : 0;
    if (!n) return 0;
    if (lower.includes("week")) return n * 7;
    if (lower.includes("month")) return n * 30;
    if (lower.includes("day")) return n;
    return n; // fallback
  };

  const buildSymptomsArray = (): string[] => {
    // Take associated symptoms as comma-separated, fallback to mainConcern text
    if (associatedSymptoms.trim().length > 0) {
      return associatedSymptoms
        .split(/,|;|\n/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (mainConcern.trim().length > 0) {
      return [mainConcern.trim()];
    }
    return [];
  };

  const buildMedicalHistoryText = (): string => {
    const parts: string[] = [];
    if (chronicConditions.length > 0) {
      parts.push(`Chronic conditions: ${chronicConditions.join(", ")}`);
    }
    if (otherConditions) {
      parts.push(`Other history: ${otherConditions}`);
    }
    if (currentMedicines) {
      parts.push(`Current medicines: ${currentMedicines}`);
    }
    if (allergies) {
      parts.push(`Allergies: ${allergies}`);
    }
    return parts.join(" | ");
  };

  const buildLifestyleText = (): string => {
    const parts: string[] = [];
    if (smokingStatus) parts.push(`Smoking/tobacco: ${smokingStatus}`);
    if (alcoholUse) parts.push(`Alcohol/substances: ${alcoholUse}`);
    if (exercise) parts.push(`Exercise: ${exercise}`);
    if (sleepHours) parts.push(`Sleep (hrs): ${sleepHours}`);
    if (stressLevel) parts.push(`Stress level: ${stressLevel}`);
    if (moodNotes) parts.push(`Mood notes: ${moodNotes}`);
    return parts.join(" | ");
  };

  // --- DOWNLOAD SUMMARY (unchanged) ---

  const handleDownloadSummary = () => {
    const date = new Date();

    const lines: string[] = [];

    lines.push("SehatHub – Health Interview Summary");
    lines.push("");
    lines.push(`Generated on: ${date.toLocaleString()}`);
    lines.push("----------------------------------------------");
    lines.push("BASIC INFORMATION");
    lines.push(`Name: ${fullName || "Not provided"}`);
    lines.push(`Age: ${age || "Not provided"}`);
    lines.push(`Gender: ${gender || "Not provided"}`);
    lines.push(`City: ${city || "Not provided"}`);
    lines.push(`Phone: ${phone || "Not provided"}`);
    lines.push("");
    lines.push("CURRENT PROBLEM");
    lines.push(
      `Main concern / reason for visit: ${mainConcern || "Not provided"}`
    );
    lines.push(`Duration of problem: ${symptomDuration || "Not provided"}`);
    lines.push(`Pattern (better/worse): ${symptomPattern || "Not provided"}`);
    lines.push(
      `Worse when / triggers: ${symptomWorseWhen || "Not provided"}`
    );
    lines.push(
      `Other associated symptoms: ${associatedSymptoms || "Not provided"}`
    );
    lines.push("");
    lines.push("MEDICAL HISTORY");
    lines.push(
      `Chronic conditions: ${
        chronicConditions.length > 0
          ? chronicConditions.join(", ")
          : "None mentioned"
      }`
    );
    lines.push(
      `Other past illnesses / surgeries: ${
        otherConditions || "Not provided"
      }`
    );
    lines.push(
      `Regular medicines: ${
        currentMedicines || "Not provided (patient may not remember)"
      }`
    );
    lines.push(`Allergies (drugs/food/etc.): ${allergies || "Not provided"}`);
    lines.push("");
    lines.push("LIFESTYLE & MENTAL HEALTH");
    lines.push(`Smoking / tobacco: ${smokingStatus || "Not provided"}`);
    lines.push(`Alcohol / substances: ${alcoholUse || "Not provided"}`);
    lines.push(`Exercise / activity: ${exercise || "Not provided"}`);
    lines.push(`Average sleep (hours): ${sleepHours || "Not provided"}`);
    lines.push(`Stress level: ${stressLevel || "Not provided"}`);
    lines.push(`Mood / mental health notes: ${moodNotes || "Not provided"}`);
    lines.push("");
    lines.push(
      "NOTE: This summary is generated automatically for consultation support. It is NOT a medical report or diagnosis."
    );

    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SehatHub_Health_Interview_Summary.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- NEW: SUBMIT TO BACKEND / AI TRIAGE ---

  const handleSubmitInterview = async () => {
    setSubmitError(null);
    setTriageResult(null);

    if (!fullName.trim()) {
      setSubmitError(
        currentLanguage === "en"
          ? "Please enter your full name before submitting."
          : "براہ کرم جمع کروانے سے پہلے اپنا مکمل نام درج کریں۔"
      );
      return;
    }

    const symptomsArray = buildSymptomsArray();
    if (symptomsArray.length === 0) {
      setSubmitError(
        currentLanguage === "en"
          ? "Please mention at least one symptom in the current problem section."
          : "براہ کرم موجودہ مسئلے میں کم از کم ایک علامت ضرور لکھیں۔"
      );
      return;
    }

    const durationDays = parseDurationToDays(symptomDuration);

    const payload = {
      basic_info: {
        full_name: fullName,
        age: age ? Number(age) : null,
        gender,
        city,
        phone,
      },
      current_issue: {
        symptoms: symptomsArray,
        duration_days: durationDays,
        description: mainConcern,
      },
      medical_history: buildMedicalHistoryText(),
      lifestyle: buildLifestyleText(),
    };

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/interview/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to submit interview.");
      }

      setTriageResult(data.triage as TriageResponse);
    } catch (err: any) {
      console.error(err);
      setSubmitError(
        err?.message ||
          (currentLanguage === "en"
            ? "Something went wrong while submitting. Please try again."
            : "جمع کرواتے ہوئے مسئلہ آیا، دوبارہ کوشش کریں۔")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --- RENDER HELPERS FOR EACH STEP ---

  const renderBasicStep = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            {currentLanguage === "en" ? "Full name" : "مکمل نام"}
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder={
              currentLanguage === "en"
                ? "Your full name"
                : "اپنا پورا نام لکھیں"
            }
          />
        </div>
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
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            {currentLanguage === "en" ? "Gender" : "صنف"}
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            {currentLanguage === "en" ? "City / Area" : "شہر / علاقہ"}
          </label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder={
              currentLanguage === "en"
                ? "e.g. Lahore, Faisalabad"
                : "مثلاً لاہور، فیصل آباد"
            }
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          {currentLanguage === "en"
            ? "Contact number (optional)"
            : "فون نمبر (اختیاری)"}
        </label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder={
            currentLanguage === "en"
              ? "Phone / WhatsApp number"
              : "فون یا واٹس ایپ نمبر"
          }
        />
      </div>
    </div>
  );

  const renderCurrentProblemStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          {currentLanguage === "en"
            ? "What is the main problem or reason you want to talk to a doctor?"
            : "آپ کا بنیادی مسئلہ کیا ہے؟ کس وجہ سے ڈاکٹر سے بات کرنا چاہتے ہیں؟"}
        </label>
        <textarea
          value={mainConcern}
          onChange={(e) => setMainConcern(e.target.value)}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder={
            currentLanguage === "en"
              ? "Example: I have had chest pain and shortness of breath when walking."
              : "مثال: چلتے وقت سینے میں درد اور سانس پھولتی ہے۔"
          }
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            {currentLanguage === "en"
              ? "Since when is this problem?"
              : "یہ مسئلہ کب سے ہے؟"}
          </label>
          <input
            value={symptomDuration}
            onChange={(e) => setSymptomDuration(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder={
              currentLanguage === "en"
                ? "e.g. 3 days, 2 weeks, 6 months"
                : "مثلاً 3 دن، 2 ہفتے، 6 مہینے"
            }
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            {currentLanguage === "en"
              ? "Is it getting better, worse, or staying same?"
              : "علامات بہتر ہو رہی ہیں، خراب ہو رہی ہیں یا ویسی ہی ہیں؟"}
          </label>
          <input
            value={symptomPattern}
            onChange={(e) => setSymptomPattern(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder={
              currentLanguage === "en"
                ? "e.g. Worse in last 2 days, slowly improving, no change"
                : "مثلاً پچھلے دو دن سے زیادہ خراب، آہستہ آہستہ بہتر، کوئی خاص فرق نہیں"
            }
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          {currentLanguage === "en"
            ? "When does it get worse? (e.g. at night, during exercise, after food)"
            : "یہ کب زیادہ بڑھ جاتا ہے؟ (جیسے رات کو، چلنے سے، کھانے کے بعد)"}
        </label>
        <input
          value={symptomWorseWhen}
          onChange={(e) => setSymptomWorseWhen(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          {currentLanguage === "en"
            ? "Any other symptoms along with this?"
            : "اس کے ساتھ کوئی اور علامت بھی ہے؟"}
        </label>
        <textarea
          value={associatedSymptoms}
          onChange={(e) => setAssociatedSymptoms(e.target.value)}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder={
            currentLanguage === "en"
              ? "Example: fever, cough, weight loss, vomiting, dizziness etc."
              : "مثال: بخار، کھانسی، وزن میں کمی، الٹی، چکر آنا وغیرہ"
          }
        />
      </div>
    </div>
  );

  const renderHistoryStep = () => (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-2">
          {currentLanguage === "en"
            ? "Do you have any of these long-term conditions? (tick all that apply)"
            : "کیا آپ کو ان میں سے کوئی پرانی بیماری ہے؟ (جو جو ہیں ان پر ✔ لگائیں)"}
        </p>
        <div className="grid md:grid-cols-2 gap-2">
          {CHRONIC_OPTIONS.map((item) => {
            const checked = chronicConditions.includes(item);
            return (
              <button
                type="button"
                key={item}
                onClick={() => toggleChronic(item)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs text-left ${
                  checked
                    ? "bg-green-50 border-green-500 text-green-700"
                    : "border-gray-200 hover:border-green-400"
                }`}
              >
                <span>{item}</span>
                <span className="text-[10px]">
                  {checked ? "✓" : currentLanguage === "en" ? "Tap" : "کلک"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          {currentLanguage === "en"
            ? "Any other important past illness, surgery, or hospital admission?"
            : "کوئی اور اہم پرانی بیماری، آپریشن یا ہسپتال میں داخلہ؟"}
        </label>
        <textarea
          value={otherConditions}
          onChange={(e) => setOtherConditions(e.target.value)}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          {currentLanguage === "en"
            ? "Medicines you are currently taking (regular or as needed)"
            : "وہ دوائیں جو آپ اس وقت لے رہے ہیں (روزانہ یا کبھی کبھار)"}
        </label>
        <textarea
          value={currentMedicines}
          onChange={(e) => setCurrentMedicines(e.target.value)}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder={
            currentLanguage === "en"
              ? "Example: Panadol 500mg, once daily. Blood pressure tablet (don’t remember name)."
              : "مثال: پیناڈول 500mg روزانہ ایک بار۔ بلڈ پریشر کی گولی (نام یاد نہیں)۔"
          }
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          {currentLanguage === "en"
            ? "Allergies to any medicine, food, or other things?"
            : "کسی دوا، کھانے یا کسی چیز سے الرجی؟"}
        </label>
        <textarea
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          rows={2}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
    </div>
  );

  const renderLifestyleStep = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            {currentLanguage === "en"
              ? "Smoking / tobacco use"
              : "سگریٹ / نسوار / تمباکو"}
          </label>
          <select
            value={smokingStatus}
            onChange={(e) => setSmokingStatus(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">
              {currentLanguage === "en" ? "Select" : "منتخب کریں"}
            </option>
            <option value="never">
              {currentLanguage === "en" ? "Never" : "کبھی نہیں"}
            </option>
            <option value="past">
              {currentLanguage === "en" ? "Used in past" : "پہلے استعمال کرتے تھے"}
            </option>
            <option value="current">
              {currentLanguage === "en"
                ? "Currently using"
                : "اس وقت استعمال کر رہے ہیں"}
            </option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            {currentLanguage === "en"
              ? "Alcohol or other substances"
              : "الکوحل یا دیگر نشہ آور چیزیں"}
          </label>
          <select
            value={alcoholUse}
            onChange={(e) => setAlcoholUse(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">
              {currentLanguage === "en" ? "Select" : "منتخب کریں"}
            </option>
            <option value="none">
              {currentLanguage === "en" ? "None" : "کوئی نہیں"}
            </option>
            <option value="occasionally">
              {currentLanguage === "en" ? "Occasionally" : "کبھی کبھار"}
            </option>
            <option value="regular">
              {currentLanguage === "en" ? "Regularly" : "باقاعدگی سے"}
            </option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            {currentLanguage === "en"
              ? "Physical activity / exercise"
              : "ورزش / جسمانی سرگرمی"}
          </label>
          <select
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">
              {currentLanguage === "en" ? "Select" : "منتخب کریں"}
            </option>
            <option value="none">
              {currentLanguage === "en" ? "Very little / none" : "بہت کم / نہیں"}
            </option>
            <option value="1-2">
              {currentLanguage === "en"
                ? "1–2 days a week"
                : "ہفتے میں 1–2 دن"}
            </option>
            <option value="3+">
              {currentLanguage === "en"
                ? "3 or more days a week"
                : "ہفتے میں 3 یا زیادہ دن"}
            </option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            {currentLanguage === "en"
              ? "Average sleep per night (hours)"
              : "روزانہ نیند کے گھنٹے (تقریباً)"}
          </label>
          <input
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder={currentLanguage === "en" ? "e.g. 5–6" : "مثلاً 5–6"}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          {currentLanguage === "en"
            ? "How is your stress level in general?"
            : "عمومی طور پر آپ کا ذہنی دباؤ (اسٹریس) کیسا رہتا ہے؟"}
        </label>
        <select
          value={stressLevel}
          onChange={(e) => setStressLevel(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">
            {currentLanguage === "en" ? "Select" : "منتخب کریں"}
          </option>
          <option value="low">
            {currentLanguage === "en" ? "Low" : "کم"}
          </option>
          <option value="moderate">
            {currentLanguage === "en" ? "Moderate" : "درمیانہ"}
          </option>
          <option value="high">
            {currentLanguage === "en" ? "High" : "زیادہ"}
          </option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          {currentLanguage === "en"
            ? "Anything about mood, anxiety, sadness, or sleep that you want the doctor to know?"
            : "موڈ، پریشانی، اداسی، یا نیند کے بارے میں کوئی ایسی بات جو آپ ڈاکٹر کو بتانا چاہتے ہیں؟"}
        </label>
        <textarea
          value={moodNotes}
          onChange={(e) => setMoodNotes(e.target.value)}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
    </div>
  );

  const renderSummaryStep = () => (
    <div className="space-y-4 text-sm text-gray-700">
      <p className="text-xs text-gray-500 mb-1">
        {currentLanguage === "en"
          ? "Review this summary. You can show or send it to your doctor."
          : "اس خلاصے کو دیکھ لیں۔ آپ اسے اپنے ڈاکٹر کو دکھا سکتے ہیں یا بھیج سکتے ہیں۔"}
      </p>

      {/* Error message from backend */}
      {submitError && (
        <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-2">
          {submitError}
        </div>
      )}

      <div className="bg-white rounded-xl border p-4 space-y-3 max-h-[420px] overflow-auto">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <User size={16} className="text-green-600" />
          {currentLanguage === "en" ? "Basic Info" : "بنیادی معلومات"}
        </h3>
        <ul className="list-disc list-inside">
          <li>
            <strong>{currentLanguage === "en" ? "Name:" : "نام:"}</strong>{" "}
            {fullName || "-"}
          </li>
          <li>
            <strong>{currentLanguage === "en" ? "Age:" : "عمر:"}</strong>{" "}
            {age || "-"}
          </li>
          <li>
            <strong>{currentLanguage === "en" ? "Gender:" : "صنف:"}</strong>{" "}
            {gender || "-"}
          </li>
          <li>
            <strong>{currentLanguage === "en" ? "City:" : "شہر:"}</strong>{" "}
            {city || "-"}
          </li>
          <li>
            <strong>{currentLanguage === "en" ? "Phone:" : "فون:"}</strong>{" "}
            {phone || "-"}
          </li>
        </ul>

        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <ClipboardList size={16} className="text-purple-600" />
          {currentLanguage === "en" ? "Current Problem" : "موجودہ مسئلہ"}
        </h3>
        <ul className="list-disc list-inside">
          <li>
            <strong>
              {currentLanguage === "en"
                ? "Main concern:"
                : "بنیادی مسئلہ:"}
            </strong>{" "}
            {mainConcern || "-"}
          </li>
          <li>
            <strong>
              {currentLanguage === "en"
                ? "Duration:"
                : "مسئلہ کب سے ہے:"}
            </strong>{" "}
            {symptomDuration || "-"}
          </li>
          <li>
            <strong>
              {currentLanguage === "en"
                ? "Pattern:"
                : "بہتر / بدتر ہونے کی کیفیت:"}
            </strong>{" "}
            {symptomPattern || "-"}
          </li>
          <li>
            <strong>
              {currentLanguage === "en"
                ? "Worse when:"
                : "کب زیادہ بڑھتا ہے:"}
            </strong>{" "}
            {symptomWorseWhen || "-"}
          </li>
          <li>
            <strong>
              {currentLanguage === "en"
                ? "Other symptoms:"
                : "دیگر علامات:"}
            </strong>{" "}
            {associatedSymptoms || "-"}
          </li>
        </ul>

        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <HeartPulse size={16} className="text-red-500" />
          {currentLanguage === "en" ? "Medical History" : "طبی تاریخ"}
        </h3>
        <ul className="list-disc list-inside">
          <li>
            <strong>
              {currentLanguage === "en"
                ? "Chronic conditions:"
                : "پرانی بیماریاں:"}
            </strong>{" "}
            {chronicConditions.length > 0
              ? chronicConditions.join(", ")
              : "-"}
          </li>
          <li>
            <strong>
              {currentLanguage === "en"
                ? "Other past illnesses / surgery:"
                : "دیگر بیماریاں / آپریشن:"}
            </strong>{" "}
            {otherConditions || "-"}
          </li>
          <li>
            <strong>
              {currentLanguage === "en"
                ? "Current medicines:"
                : "موجودہ دوائیں:"}
            </strong>{" "}
            {currentMedicines || "-"}
          </li>
          <li>
            <strong>
              {currentLanguage === "en" ? "Allergies:" : "الرجیز:"}</strong>{" "}
            {allergies || "-"}
          </li>
        </ul>

        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Moon size={16} className="text-indigo-500" />
          {currentLanguage === "en"
            ? "Lifestyle & Mental Health"
            : "طرزِ زندگی اور ذہنی صحت"}
        </h3>
        <ul className="list-disc list-inside">
          <li>
            <strong>
              {currentLanguage === "en" ? "Smoking / tobacco:" : "تمباکو:"}
            </strong>{" "}
            {smokingStatus || "-"}
          </li>
          <li>
            <strong>
              {currentLanguage === "en"
                ? "Alcohol / substances:"
                : "الکوحل:"}
            </strong>{" "}
            {alcoholUse || "-"}
          </li>
          <li>
            <strong>
              {currentLanguage === "en"
                ? "Exercise:"
                : "ورزش / سرگرمی:"}
            </strong>{" "}
            {exercise || "-"}
          </li>
          <li>
            <strong>
              {currentLanguage === "en"
                ? "Sleep per night:"
                : "نیند فی رات:"}
            </strong>{" "}
            {sleepHours || "-"}
          </li>
          <li>
            <strong>
              {currentLanguage === "en"
                ? "Stress level:"
                : "اسٹریس کی سطح:"}
            </strong>{" "}
            {stressLevel || "-"}
          </li>
          <li>
            <strong>
              {currentLanguage === "en"
                ? "Mood / notes:"
                : "موڈ / نوٹس:"}
            </strong>{" "}
            {moodNotes || "-"}
          </li>
        </ul>
      </div>

      {/* NEW: AI triage result card */}
      {triageResult && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
          <h3 className="font-semibold text-green-900 flex items-center gap-2">
            <Activity size={16} className="text-green-600" />
            {currentLanguage === "en"
              ? "AI Triage Summary"
              : "AI ٹرائیج خلاصہ"}
          </h3>
          <p className="text-sm">
            <strong>
              {currentLanguage === "en" ? "Possible condition: " : "ممکنہ بیماری: "}
            </strong>
            {triageResult.primary_prediction.disease}{" "}
            <span className="text-xs text-gray-600">
              ({Math.round(triageResult.primary_prediction.confidence * 100)}%
              confidence)
            </span>
          </p>
          <p className="text-sm">
            <strong>
              {currentLanguage === "en" ? "Risk level: " : "خطرے کی سطح: "}
            </strong>
            {triageResult.severity.level}{" "}
            <span className="text-xs text-gray-600">
              (score {triageResult.severity.score})
            </span>
          </p>
          <p className="text-sm">
            <strong>
              {currentLanguage === "en"
                ? "Recommendation: "
                : "سفارش:"}
            </strong>
            {triageResult.severity.recommendation}
          </p>
          {triageResult.primary_prediction.info?.precautions &&
            triageResult.primary_prediction.info.precautions.length > 0 && (
              <div className="text-xs text-gray-700 mt-1">
                <strong>
                  {currentLanguage === "en"
                    ? "General precautions:"
                    : "احتیاطی تدابیر:"}
                </strong>
                <ul className="list-disc list-inside">
                  {triageResult.primary_prediction.info.precautions.map(
                    (p, idx) => (
                      <li key={idx}>{p}</li>
                    )
                  )}
                </ul>
              </div>
            )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          type="button"
          onClick={handleDownloadSummary}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          <FileDown size={18} />
          {currentLanguage === "en"
            ? "Download Interview Summary"
            : "انٹرویو سمری ڈاؤن لوڈ کریں"}
        </button>

        <button
          type="button"
          onClick={handleSubmitInterview}
          disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition"
        >
          {submitting
            ? currentLanguage === "en"
              ? "Submitting..."
              : "جمع ہو رہا ہے..."
            : currentLanguage === "en"
            ? "Submit to RoboDoc AI"
            : "RoboDoc AI کو بھیجیں"}
        </button>
      </div>

      <p className="text-[11px] text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
        {currentLanguage === "en"
          ? "This summary is only to help communicate with your doctor. It is not a medical certificate or diagnosis."
          : "یہ خلاصہ صرف ڈاکٹر سے بات آسان بنانے کے لیے ہے۔ یہ کسی بھی قسم کا میڈیکل سرٹیفکیٹ یا حتمی تشخیص نہیں ہے۔"}
      </p>
    </div>
  );

  // --- MAIN RENDER ---

  const StepIcon = currentStep.icon;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <ClipboardList className="text-green-600" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {TEXT.title[currentLanguage]}
            </h1>
            <p className="text-sm text-gray-600 max-w-xl">
              {TEXT.subtitle[currentLanguage]}
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

      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isDone = index < currentStepIndex;

            return (
              <div key={step.id} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-1 ${
                    isActive
                      ? "border-green-600 bg-green-50"
                      : isDone
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-green-600"
                        : isDone
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  />
                </div>
                <span className="text-[11px] text-gray-600 text-center">
                  {
                    TEXT.stepLabels[step.id][
                      currentLanguage as keyof (typeof TEXT.stepLabels)["basic"]
                    ]
                  }
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <StepIcon size={20} className="text-green-600" />
          <h2 className="text-lg font-semibold text-gray-800">
            {
              TEXT.stepLabels[currentStep.id][
                currentLanguage as keyof (typeof TEXT.stepLabels)["basic"]
              ]
            }
          </h2>
        </div>

        {currentStep.id === "basic" && renderBasicStep()}
        {currentStep.id === "current" && renderCurrentProblemStep()}
        {currentStep.id === "history" && renderHistoryStep()}
        {currentStep.id === "lifestyle" && renderLifestyleStep()}
        {currentStep.id === "summary" && renderSummaryStep()}

        {/* Navigation buttons */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border ${
              currentStepIndex === 0
                ? "border-gray-200 text-gray-300 cursor-default"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={16} />
            {currentLanguage === "en" ? "Back" : "واپس"}
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={currentStepIndex === STEPS.length - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
              currentStepIndex === STEPS.length - 1
                ? "bg-gray-200 text-gray-400 cursor-default"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {currentLanguage === "en" ? "Next" : "اگلا"}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthInterviewPage;
