// ─── Types ────────────────────────────────────────────────────────────────────
export interface SymptomEntry {
  id: string;
  symptom: string;
  severity: "mild" | "moderate" | "severe";
  date: string;
  duration: string;
  bodyPart: string;
  relatedSymptoms: string[];
}

export interface HealthPrediction {
  risk: "low" | "medium" | "high";
  message: string;
  recommendation: string;
}

export interface DiseaseSuggestion {
  id: string;
  name: string;
  likelihood: "low" | "medium" | "high";
  reason: string;
  urgencyNote: string;
}

export interface SeverityTrend {
  label: string;
  color: string;
}

// ─── Color helpers ────────────────────────────────────────────────────────────
export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "mild":     return "bg-green-100 text-green-800 border-green-300";
    case "moderate": return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "severe":   return "bg-red-100 text-red-800 border-red-300";
    default:         return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const getRiskColor = (risk: string) => {
  switch (risk) {
    case "low":    return "bg-green-50 border-green-200 text-green-900";
    case "medium": return "bg-yellow-50 border-yellow-200 text-yellow-900";
    case "high":   return "bg-red-50 border-red-200 text-red-900";
    default:       return "bg-gray-50 border-gray-200 text-gray-900";
  }
};

export const getRiskBadgeColor = (risk: string) => {
  switch (risk) {
    case "low":    return "bg-green-500";
    case "medium": return "bg-yellow-500";
    case "high":   return "bg-red-500";
    default:       return "bg-gray-500";
  }
};

export const getSeverityDotColor = (severity: string) => {
  switch (severity) {
    case "severe":   return "bg-red-500";
    case "moderate": return "bg-yellow-500";
    default:         return "bg-green-500";
  }
};

// ─── Duration text ────────────────────────────────────────────────────────────
export const computeDurationText = (symptoms: SymptomEntry[]): string => {
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
};

const getSpreadDays = (symptoms: SymptomEntry[]): number => {
  const dates = symptoms
    .map((s) => new Date(s.date))
    .filter((d) => !isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());
  if (dates.length < 2) return 1;
  return Math.max(
    1,
    Math.round(
      (dates[dates.length - 1].getTime() - dates[0].getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
};

// ─── Risk prediction ──────────────────────────────────────────────────────────
export const computePrediction = (
  symptoms: SymptomEntry[],
  t: (key: string, opts?: Record<string, string | number>) => string
): HealthPrediction => {
  if (symptoms.length === 0) {
    return {
      risk: "low",
      message: t("prediction.noSymptoms"),
      recommendation: t("prediction.noSymptomsRecommendation"),
    };
  }

  const hasSevere = symptoms.some((s) => s.severity === "severe");
  const moderateCount = symptoms.filter((s) => s.severity === "moderate").length;

  let risk: HealthPrediction["risk"] = "low";
  if (hasSevere) risk = "high";
  else if (moderateCount >= 2) risk = "medium";

  const days = getSpreadDays(symptoms);

  const message =
    risk === "high"   ? t("prediction.severeMessage", { days }) :
    risk === "medium" ? t("prediction.moderateMessage", { days }) :
                        t("prediction.mildMessage", { days });

  const recommendation =
    risk === "high"   ? t("prediction.highRecommendation") :
    risk === "medium" ? t("prediction.mediumRecommendation") :
                        t("prediction.lowRecommendation");

  return { risk, message, recommendation };
};

// ─── Severity trend ───────────────────────────────────────────────────────────
export const getSeverityTrend = (
  symptoms: SymptomEntry[],
  t: (key: string) => string
): SeverityTrend => {
  if (symptoms.length < 2)
    return { label: t("stats.notEnoughData"), color: "text-gray-600" };

  const score = (s: SymptomEntry) =>
    s.severity === "mild" ? 1 : s.severity === "moderate" ? 2 : 3;

  const sorted = [...symptoms].sort((a, b) => a.date.localeCompare(b.date));
  const first = score(sorted[0]);
  const last  = score(sorted[sorted.length - 1]);

  if (last > first) return { label: t("stats.worsening"), color: "text-red-600" };
  if (last < first) return { label: t("stats.improving"), color: "text-green-600" };
  return { label: t("stats.stable"), color: "text-yellow-600" };
};

// ─── Disease suggestions ──────────────────────────────────────────────────────
export const generateDiseaseSuggestions = (
  symptoms: SymptomEntry[],
  t: (key: string) => string
): DiseaseSuggestion[] => {
  const list: DiseaseSuggestion[] = [];

  const allRelated   = symptoms.map((s) => s.relatedSymptoms.join(" ").toLowerCase()).join(" ");
  const symptomNames = symptoms.map((s) => s.symptom.toLowerCase()).join(" ");

  const hasFever          = symptomNames.includes("fever")   || symptomNames.includes("بخار");
  const hasHeadache       = symptomNames.includes("headache") || symptomNames.includes("سر درد");
  const hasChestPain      = symptomNames.includes("chest")   || symptomNames.includes("سینہ");
  const hasBreathlessness = allRelated.includes("shortness of breath") || allRelated.includes("سانس");
  const hasBodyAche       = allRelated.includes("body ache") || allRelated.includes("جسم میں درد");
  const hasAnxiety        = allRelated.includes("anxiety")   || allRelated.includes("اضطراب");

  if (hasFever && hasBodyAche) {
    list.push({ id: "viral", name: t("diseases.viral.name"), likelihood: "medium",
      reason: t("diseases.viral.reason"), urgencyNote: t("diseases.viral.urgencyNote") });
  }
  if (hasHeadache && !hasChestPain) {
    list.push({ id: "headache", name: t("diseases.headache.name"), likelihood: "low",
      reason: t("diseases.headache.reason"), urgencyNote: t("diseases.headache.urgencyNote") });
  }
  if (hasChestPain && hasBreathlessness) {
    list.push({ id: "cardiac", name: t("diseases.cardiac.name"), likelihood: "medium",
      reason: t("diseases.cardiac.reason"), urgencyNote: t("diseases.cardiac.urgencyNote") });
  }
  if (hasAnxiety) {
    list.push({ id: "anxiety", name: t("diseases.anxiety.name"), likelihood: "medium",
      reason: t("diseases.anxiety.reason"), urgencyNote: t("diseases.anxiety.urgencyNote") });
  }
  if (list.length === 0) {
    list.push({ id: "unspecified", name: t("diseases.unspecified.name"), likelihood: "low",
      reason: t("diseases.unspecified.reason"), urgencyNote: t("diseases.unspecified.urgencyNote") });
  }

  return list;
};