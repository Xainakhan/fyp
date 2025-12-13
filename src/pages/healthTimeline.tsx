// src/pages/HealthTimeline.tsx
import React, { useState, useMemo } from "react";
import {
  Activity,
  AlertCircle,
  TrendingUp,
  Calendar,
  Clock,
  Info,
  Plus,
  X,
  Edit2,
  Trash2,
} from "lucide-react";

interface SymptomEntry {
  id: string;
  symptom: string;
  severity: "mild" | "moderate" | "severe";
  date: string; // yyyy-mm-dd
  duration: string;
  bodyPart: string;
  relatedSymptoms: string[];
}

interface HealthPrediction {
  risk: "low" | "medium" | "high";
  message: string;
  recommendation: string;
}

interface DiseaseSuggestion {
  id: string;
  name: string;
  likelihood: "low" | "medium" | "high";
  reason: string;
  urgencyNote: string;
}

// ---------- Simple rule-based “possible conditions” ----------
const generateDiseaseSuggestions = (symptoms: SymptomEntry[]): DiseaseSuggestion[] => {
  const list: DiseaseSuggestion[] = [];

  const allRelated = symptoms
    .map((s) => s.relatedSymptoms.join(" ").toLowerCase())
    .join(" ");
  const symptomNames = symptoms.map((s) => s.symptom.toLowerCase()).join(" ");

  const hasFever = symptomNames.includes("fever");
  const hasHeadache = symptomNames.includes("headache");
  const hasChestPain = symptomNames.includes("chest");
  const hasBreathlessness = allRelated.includes("shortness of breath");
  const hasBodyAche = allRelated.includes("body ache");
  const hasAnxiety = allRelated.includes("anxiety");

  if (hasFever && hasBodyAche) {
    list.push({
      id: "viral",
      name: "Viral infection (flu-like illness)",
      likelihood: "medium",
      reason: "Fever with body aches over a few days can fit a viral infection pattern.",
      urgencyNote:
        "If fever is high, continues more than 3 days, or you feel very weak, you should see a doctor urgently.",
    });
  }

  if (hasHeadache && !hasChestPain) {
    list.push({
      id: "headache",
      name: "Headache disorder (tension / migraine type)",
      likelihood: "low",
      reason: "Isolated headache without other red-flag signs can fit a primary headache pattern.",
      urgencyNote:
        "If headache is sudden, worst-ever, or with weakness, confusion or vision changes, treat as emergency.",
    });
  }

  if (hasChestPain && hasBreathlessness) {
    list.push({
      id: "cardiac",
      name: "Possible heart-related chest pain (angina type)",
      likelihood: "medium",
      reason: "Chest pain together with shortness of breath is concerning for heart or lung causes.",
      urgencyNote:
        "If pain is severe, crushing, or with sweating/nausea, seek emergency help immediately (e.g. 1122).",
    });
  }

  if (hasAnxiety) {
    list.push({
      id: "anxiety",
      name: "Stress / anxiety component",
      likelihood: "medium",
      reason: "Reported anxiety alongside physical symptoms can amplify how symptoms feel.",
      urgencyNote:
        "Mental health support plus proper medical review is usually most helpful.",
    });
  }

  if (list.length === 0) {
    list.push({
      id: "unspecified",
      name: "Non-specific symptom pattern",
      likelihood: "low",
      reason:
        "This combination of symptoms is too general for even a rough guess inside the app.",
      urgencyNote:
        "A proper in-person doctor assessment is needed to decide what this might be.",
    });
  }

  return list;
};

// ---------- Helper to compute risk from symptoms ----------
const computePrediction = (symptoms: SymptomEntry[]): HealthPrediction => {
  if (symptoms.length === 0) {
    return {
      risk: "low",
      message: "No symptoms added yet. Add entries to see pattern and risk.",
      recommendation: "If you feel unwell, you should still talk to a real doctor.",
    };
  }

  const hasSevere = symptoms.some((s) => s.severity === "severe");
  const moderateCount = symptoms.filter((s) => s.severity === "moderate").length;

  let risk: HealthPrediction["risk"] = "low";
  if (hasSevere) risk = "high";
  else if (moderateCount >= 2) risk = "medium";

  const dates = symptoms
    .map((s) => new Date(s.date))
    .filter((d) => !isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  const days =
    dates.length >= 2
      ? Math.max(
          1,
          Math.round(
            (dates[dates.length - 1].getTime() - dates[0].getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 1;

  const message =
    risk === "high"
      ? `Your timeline includes at least one severe symptom over about ${days} day(s).`
      : risk === "medium"
      ? `You have multiple moderate or long-lasting symptoms over about ${days} day(s).`
      : `Current symptoms appear mild with limited duration (about ${days} day(s)).`;

  const recommendation =
    risk === "high"
      ? "Seek urgent medical care or call emergency services if symptoms worsen."
      : risk === "medium"
      ? "Consult a General Physician within 24–48 hours for proper examination."
      : "If symptoms persist, get a routine check-up with your doctor.";

  return { risk, message, recommendation };
};

// ---------- Helper to get severity trend ----------
const getSeverityTrend = (symptoms: SymptomEntry[]) => {
  if (symptoms.length < 2) return { label: "Not enough data", color: "text-gray-600" };

  const score = (s: SymptomEntry) =>
    s.severity === "mild" ? 1 : s.severity === "moderate" ? 2 : 3;

  const sorted = [...symptoms].sort((a, b) => a.date.localeCompare(b.date));
  const first = score(sorted[0]);
  const last = score(sorted[sorted.length - 1]);

  if (last > first) return { label: "↑ Worsening", color: "text-red-600" };
  if (last < first) return { label: "↓ Improving", color: "text-green-600" };
  return { label: "→ Stable", color: "text-yellow-600" };
};

const HealthTimeline: React.FC = () => {
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([
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
  ]);

  // form state for new / edit entry
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newSymptom, setNewSymptom] = useState("");
  const [newSeverity, setNewSeverity] = useState<"mild" | "moderate" | "severe">(
    "mild"
  );
  const [newDate, setNewDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [newDuration, setNewDuration] = useState("1 day");
  const [newBodyPart, setNewBodyPart] = useState("");
  const [newRelated, setNewRelated] = useState("");

  const prediction = useMemo(() => computePrediction(symptoms), [symptoms]);
  const diseaseSuggestions = useMemo(
    () => generateDiseaseSuggestions(symptoms),
    [symptoms]
  );
  const severityTrend = useMemo(() => getSeverityTrend(symptoms), [symptoms]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "bg-green-100 text-green-800 border-green-300";
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "severe":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-50 border-green-200 text-green-900";
      case "medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-900";
      case "high":
        return "bg-red-50 border-red-200 text-red-900";
      default:
        return "bg-gray-50 border-gray-200 text-gray-900";
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setNewSymptom("");
    setNewBodyPart("");
    setNewDuration("1 day");
    setNewRelated("");
    setNewSeverity("mild");
    setNewDate(new Date().toISOString().slice(0, 10));
  };

  const handleSubmitSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymptom.trim()) return;

    const payload: SymptomEntry = {
      id: editingId ?? Date.now().toString(),
      symptom: newSymptom.trim(),
      severity: newSeverity,
      date: newDate,
      duration: newDuration || "1 day",
      bodyPart: newBodyPart || "Not specified",
      relatedSymptoms: newRelated
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (editingId) {
      // update existing
      setSymptoms((prev) =>
        prev.map((s) => (s.id === editingId ? payload : s))
      );
    } else {
      // add new
      setSymptoms((prev) => [...prev, payload]);
    }

    resetForm();
    setShowForm(false);
  };

  const handleEditSymptom = (entry: SymptomEntry) => {
    setEditingId(entry.id);
    setShowForm(true);
    setNewSymptom(entry.symptom);
    setNewSeverity(entry.severity);
    setNewDate(entry.date);
    setNewDuration(entry.duration);
    setNewBodyPart(entry.bodyPart);
    setNewRelated(entry.relatedSymptoms.join(", "));
  };

  const handleDeleteSymptom = (id: string) => {
    setSymptoms((prev) => prev.filter((s) => s.id !== id));

    if (editingId === id) {
      resetForm();
      setShowForm(false);
    }
  };

  const durationText = useMemo(() => {
    if (!symptoms.length) return "0 days";
    const dates = symptoms
      .map((s) => new Date(s.date))
      .filter((d) => !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());
    if (dates.length < 2) return "1 day";
    const diffDays = Math.max(
      1,
      Math.round(
        (dates[dates.length - 1].getTime() - dates[0].getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  }, [symptoms]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Health Timeline</h1>
              <p className="text-gray-600 text-sm">
                Track your symptoms over time and see pattern-based insights (not diagnosis).
              </p>
            </div>
          </div>
        </div>

        {/* AI Prediction Card */}
        <div
          className={`${getRiskColor(
            prediction.risk
          )} border-2 rounded-2xl p-6 mb-4 shadow-md`}
        >
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className={`${getRiskBadgeColor(prediction.risk)} p-3 rounded-xl`}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h2 className="text-lg font-bold">AI Health Analysis</h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadgeColor(
                    prediction.risk
                  )} text-white`}
                >
                  {prediction.risk.toUpperCase()} RISK
                </span>
              </div>
              <p className="text-sm mb-3">{prediction.message}</p>
              <div className="bg-white bg-opacity-60 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm mb-1">Recommendation:</p>
                  <p className="text-sm">{prediction.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Possible Conditions */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6 border border-amber-200">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-amber-500" />
            <h2 className="text-base md:text-lg font-semibold text-gray-900">
              Possible Conditions (Not a Diagnosis)
            </h2>
          </div>

          <p className="text-xs text-gray-500 mb-4">
            These suggestions are generated from simple rules based on your symptom timeline.
            They are only for education and must NOT replace a real doctor&apos;s opinion.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {diseaseSuggestions.map((disease) => (
              <div
                key={disease.id}
                className="border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                    {disease.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-[11px] font-semibold ${
                      disease.likelihood === "high"
                        ? "bg-red-100 text-red-700"
                        : disease.likelihood === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {disease.likelihood.toUpperCase()} LIKELY
                  </span>
                </div>
                <p className="text-xs text-gray-700 mb-2">{disease.reason}</p>
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-md p-2">
                  {disease.urgencyNote}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline + Add/Edit form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Symptom Timeline</h2>
            <button
              onClick={() => {
                if (showForm && editingId) {
                  // cancel editing
                  resetForm();
                }
                setShowForm((v) => !v);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
            >
              {showForm ? (
                <>
                  <X className="w-4 h-4" /> Close Form
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Add New Symptom
                </>
              )}
            </button>
          </div>

          {/* Add / Edit Symptom Form */}
          {showForm && (
            <form
              onSubmit={handleSubmitSymptom}
              className="mb-6 border border-indigo-100 rounded-xl p-4 bg-indigo-50/40"
            >
              {editingId && (
                <div className="mb-3 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md px-3 py-2 flex items-center justify-between">
                  <span>
                    Editing existing symptom. Make changes and click{" "}
                    <strong>Update Symptom</strong>.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowForm(false);
                    }}
                    className="text-[11px] text-indigo-500 hover:text-indigo-700"
                  >
                    Cancel edit
                  </button>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Symptom name
                  </label>
                  <input
                    value={newSymptom}
                    onChange={(e) => setNewSymptom(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. Chest pain, Headache"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Severity
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) =>
                      setNewSeverity(e.target.value as "mild" | "moderate" | "severe")
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Duration
                  </label>
                  <input
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. 2 days"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Body part / area
                  </label>
                  <input
                    value={newBodyPart}
                    onChange={(e) => setNewBodyPart(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. chest, head"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Related symptoms (comma separated)
                </label>
                <input
                  value={newRelated}
                  onChange={(e) => setNewRelated(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. shortness of breath, dizziness"
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center justify-center gap-2"
              >
                {editingId ? (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Update Symptom
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Save Symptom
                  </>
                )}
              </button>
            </form>
          )}

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300 to-indigo-100" />
            <div className="space-y-6">
              {symptoms.map((entry) => (
                <div key={entry.id} className="relative pl-20">
                  <div
                    className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white shadow-md ${
                      entry.severity === "severe"
                        ? "bg-red-500"
                        : entry.severity === "moderate"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  />
                  <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-indigo-300 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {entry.symptom}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 flex-wrap">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(entry.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <Clock className="w-4 h-4 ml-2" />
                          <span>{entry.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(
                            entry.severity
                          )}`}
                        >
                          {entry.severity.toUpperCase()}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleEditSymptom(entry)}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSymptom(entry.id)}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Location:</span>{" "}
                        {entry.bodyPart}
                      </p>
                    </div>

                    {entry.relatedSymptoms.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Related Symptoms:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {entry.relatedSymptoms.map((related, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
                            >
                              {related}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {symptoms.length === 0 && (
                <div className="text-center text-sm text-gray-500 py-10">
                  No symptoms added yet. Click &quot;Add New Symptom&quot; to start your
                  timeline.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-gray-600 text-sm mb-1">Total Symptoms</p>
            <p className="text-2xl font-bold text-gray-900">{symptoms.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-gray-600 text-sm mb-1">Timeline Duration</p>
            <p className="text-2xl font-bold text-gray-900">{durationText}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-gray-600 text-sm mb-1">Severity Trend</p>
            <p className={`text-2xl font-bold ${severityTrend.color}`}>
              {severityTrend.label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTimeline;
