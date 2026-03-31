// ─────────────────────────────────────────────────────────────────────────────
// severityChartData.ts
// Place this file in:  src/healthTimeline/components/severityChartData.ts
//
// Pure data layer — no React, no JSX, no imports from healthUtils needed.
// SeverityChart.tsx imports everything it needs from here.
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ─────────────────────────────────────────────────────────────────────

/** Mirrors only the fields SeverityChart actually needs from SymptomEntry */
export interface SymptomEntrySlice {
  id:       string;
  symptom:  string;
  severity: string;   // "mild" | "moderate" | "severe"  (loose string so it's compatible with healthUtils type)
  date:     string;   // "YYYY-MM-DD"
}

export type Severity = "mild" | "moderate" | "severe";

export interface ChartPoint {
  dateLabel: string;   // "11/20"  — shown on x-axis
  fullDate:  string;   // "2025-11-20" — shown in tooltip
  symptom:   string;
  severity:  Severity;
  value:     1 | 2 | 3;
}

export interface BreakdownItem {
  severity:   Severity;
  count:      number;
  percentage: number;  // already Math.round-ed
}

export interface PeakResult {
  severity: Severity;
  symptom:  string;
  date:     string;
}

export type TrendDirection = "worsening" | "improving" | "stable" | "insufficient";

export interface TrendResult {
  label:     string;
  color:     string;
  direction: TrendDirection;
}

export interface ChartStats {
  total:     number;
  peak:      PeakResult | null;
  trend:     TrendResult;
  avgValue:  number;   // 1-3, rounded to 1dp
  breakdown: BreakdownItem[];
}

// ── Constants (single source of truth for ALL severity styling) ───────────────

export const SEVERITY_VALUE: Record<Severity, 1 | 2 | 3> = {
  mild:     1,
  moderate: 2,
  severe:   3,
};

export const SEVERITY_LABEL: Record<number, string> = {
  1: "Mild",
  2: "Moderate",
  3: "Severe",
};

/** Bar / dot fill colors */
export const SEVERITY_COLOR: Record<Severity, string> = {
  mild:     "#4ade80",
  moderate: "#facc15",
  severe:   "#f87171",
};

/** Pill background */
export const SEVERITY_BG: Record<Severity, string> = {
  mild:     "#dcfce7",
  moderate: "#fef9c3",
  severe:   "#fee2e2",
};

/** Pill / stat text */
export const SEVERITY_TEXT: Record<Severity, string> = {
  mild:     "#15803d",
  moderate: "#a16207",
  severe:   "#b91c1c",
};

/** Pill border */
export const SEVERITY_BORDER: Record<Severity, string> = {
  mild:     "#86efac",
  moderate: "#fde047",
  severe:   "#fca5a5",
};

// ── Pure transform functions ──────────────────────────────────────────────────

function isSeverity(s: string): s is Severity {
  return s === "mild" || s === "moderate" || s === "severe";
}

/**
 * Sort entries by date, coerce severity, map to chart-ready points.
 * Entries with an unrecognised severity are silently skipped.
 */
export function buildChartPoints(symptoms: SymptomEntrySlice[]): ChartPoint[] {
  return [...symptoms]
    .sort((a, b) => a.date.localeCompare(b.date))
    .reduce<ChartPoint[]>((acc, s) => {
      if (!isSeverity(s.severity)) return acc;
      acc.push({
        dateLabel: s.date.slice(5).replace("-", "/"),   // "YYYY-MM-DD" → "MM/DD"
        fullDate:  s.date,
        symptom:   s.symptom,
        severity:  s.severity,
        value:     SEVERITY_VALUE[s.severity],
      });
      return acc;
    }, []);
}

/** Trend across the first and last visible point */
export function computeTrend(points: ChartPoint[]): TrendResult {
  if (points.length < 2)
    return { label: "Not enough data", color: "#888780", direction: "insufficient" };
  const diff = points[points.length - 1].value - points[0].value;
  if (diff > 0) return { label: "Worsening", color: "#b91c1c", direction: "worsening" };
  if (diff < 0) return { label: "Improving",  color: "#15803d", direction: "improving"  };
  return           { label: "Stable",    color: "#a16207", direction: "stable"    };
}

/** Entry with the highest severity value (last one wins on tie) */
export function computePeak(points: ChartPoint[]): PeakResult | null {
  if (!points.length) return null;
  const top = points.reduce((m, p) => p.value >= m.value ? p : m, points[0]);
  return { severity: top.severity, symptom: top.symptom, date: top.fullDate };
}

/** Per-severity counts + Math.round-ed percentages (always sum to ~100) */
export function computeBreakdown(points: ChartPoint[]): BreakdownItem[] {
  const counts: Record<Severity, number> = { mild: 0, moderate: 0, severe: 0 };
  points.forEach((p) => counts[p.severity]++);
  const total = points.length || 1;
  return (["mild", "moderate", "severe"] as Severity[]).map((sev) => ({
    severity:   sev,
    count:      counts[sev],
    percentage: Math.round((counts[sev] / total) * 100),
  }));
}

/**
 * Centred rolling moving average.
 * Returns null for endpoints that don't have a full window — Chart.js
 * spanGaps: false will leave a gap rather than draw a misleading line.
 */
export function computeMovingAverage(
  points: ChartPoint[],
  windowSize = 3
): (number | null)[] {
  const half = Math.floor(windowSize / 2);
  return points.map((_, i) => {
    const start = i - half;
    const end   = i + half + 1;
    if (start < 0 || end > points.length) return null;
    const slice = points.slice(start, end);
    const avg   = slice.reduce((s, p) => s + p.value, 0) / slice.length;
    return Math.round(avg * 10) / 10;
  });
}

/** Single call that returns every stat the UI needs */
export function computeChartStats(points: ChartPoint[]): ChartStats {
  const total    = points.length;
  const peak     = computePeak(points);
  const trend    = computeTrend(points);
  const avgValue = total
    ? Math.round((points.reduce((s, p) => s + p.value, 0) / total) * 10) / 10
    : 0;
  const breakdown = computeBreakdown(points);
  return { total, peak, trend, avgValue, breakdown };
}