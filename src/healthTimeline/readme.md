# SeverityChart — Health Timeline Component

A React + TypeScript chart component that visualises symptom severity over time using Chart.js. Built for the **SehatHub** health app (`healthTimeline` module).

---

## File Structure

```
src/
└── healthTimeline/
    ├── HealthTimeline.tsx          ← Page wrapper (entry point)
    └── components/
        ├── index.ts                ← Barrel export
        ├── SeverityChartData.ts    ← Pure data layer (types + functions)
        └── SeverityChart.tsx       ← React UI component
```

---

## How It Works

### Data Flow

```
HealthTimeline.tsx
      │
      │  symptoms: SymptomEntrySlice[]
      ▼
SeverityChart.tsx
      │
      ├── buildChartPoints()     → sorts + maps entries to ChartPoint[]
      ├── computeChartStats()    → peak, trend, average, breakdown
      ├── computeMovingAverage() → 3-point rolling average array
      │
      └── Chart.js canvas        → renders bar + line datasets
```

### Layer Responsibilities

| File | Role | Has React? | Has Chart.js? |
|---|---|---|---|
| `SeverityChartData.ts` | Pure data transforms, types, constants | No | No |
| `SeverityChart.tsx` | UI rendering, filters, chart lifecycle | Yes | Yes |
| `HealthTimeline.tsx` | Page entry point, passes symptom data | Yes | No |

---

## Component API

### `<SeverityChart symptoms={...} />`

| Prop | Type | Required | Description |
|---|---|---|---|
| `symptoms` | `SymptomEntrySlice[]` | Yes | Array of symptom entries to visualise |

### `SymptomEntrySlice` type

```ts
interface SymptomEntrySlice {
  id:       string;          // unique entry ID
  symptom:  string;          // e.g. "Headache"
  severity: string;          // "mild" | "moderate" | "severe"
  date:     string;          // "YYYY-MM-DD"
}
```

---

## Features

### Interactive Filters
- Three severity pills (Mild / Moderate / Severe) — click to toggle visibility
- "Avg line" button — shows/hides the 3-point moving average line

### Stat Cards
| Card | What it shows |
|---|---|
| Visible entries | Count of currently filtered entries |
| Peak severity | Highest severity entry + symptom name |
| Overall trend | Worsening ↑ / Stable → / Improving ↓ |
| Average level | Mean numeric severity (1–3 scale) |

### Chart
- **Bar chart** — one bar per symptom entry, coloured by severity
- **Line overlay** — 3-point centred moving average (dashed indigo line)
- **Tooltips** — show symptom name, full date, and severity label on hover
- **Y-axis labels** — Mild / Moderate / Severe (not raw numbers)

### Breakdown Panel
- Horizontal progress bars for each severity level
- Shows entry count + percentage of total

---

## Severity Scale

| Level | Numeric Value | Colour |
|---|---|---|
| Mild | 1 | `#4ade80` (green) |
| Moderate | 2 | `#facc15` (yellow) |
| Severe | 3 | `#f87171` (red) |

---

## Trend Logic

Trend is computed by comparing the **first** and **last** visible entry values:

```
last.value - first.value > 0  → Worsening (↑ red)
last.value - first.value < 0  → Improving  (↓ green)
last.value - first.value = 0  → Stable     (→ amber)
fewer than 2 entries          → Not enough data
```

---

## Moving Average

Uses a **centred 3-point window**:

```
For index i:  avg = mean(points[i-1], points[i], points[i+1])
```

Endpoints return `null` so Chart.js leaves a gap instead of drawing a misleading line at the edges (`spanGaps: false`).

---

## Setup & Installation

### 1. Install dependencies

```bash
npm install chart.js
```

### 2. Register Chart.js (required — add to top of `SeverityChart.tsx`)

```ts
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
```

### 3. Use in your page

```tsx
import SeverityChart from "./components/SeverityChart";
import type { SymptomEntrySlice } from "./components/SeverityChartData";

const symptoms: SymptomEntrySlice[] = [
  { id: "1", symptom: "Headache", severity: "mild",     date: "2025-03-01" },
  { id: "2", symptom: "Fever",    severity: "moderate", date: "2025-03-03" },
  { id: "3", symptom: "Chills",   severity: "severe",   date: "2025-03-05" },
];

<div className="px-4">
  <SeverityChart symptoms={symptoms} />
</div>
```

---

## Styling Notes

- All component styles use **inline `React.CSSProperties`** — no CSS modules or external stylesheets needed
- Horizontal padding is controlled by the **parent wrapper** (`px-[15px]` / `px-4` Tailwind class on `HealthTimeline.tsx`)
- The chart card sets `paddingLeft: 0 / paddingRight: 0` so it doesn't double-add padding on top of the parent
- Tailwind is only used in `HealthTimeline.tsx` for the outer wrapper padding

---

## Common Issues

| Symptom | Cause | Fix |
|---|---|---|
| Blank white page | `Chart` not imported/registered | Add `import { Chart, registerables } from "chart.js"` + `Chart.register(...registerables)` at top of `SeverityChart.tsx` |
| "Not enough data" trend | Fewer than 2 entries passed | Pass at least 2 symptom entries |
| Entries not showing | Unknown severity string | Ensure severity is exactly `"mild"`, `"moderate"`, or `"severe"` |
| Chart not resizing | `maintainAspectRatio: true` | Already set to `false` — wrap canvas in a `position: relative` div with explicit `height` |
| TypeScript error on `chartRef` | Wrong generic on `useRef` | Use `useRef<Chart<"bar" \| "line"> \| null>(null)` |

---

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | 18+ | UI framework |
| `chart.js` | 4+ | Bar + line chart rendering |
| `react-i18next` | any | Translation hook (used in wrapper) |
| `tailwindcss` | 3+ | Utility classes on wrapper `div` only |