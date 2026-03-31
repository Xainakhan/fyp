import React, { useEffect, useRef, useState, useMemo } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import {
  SEVERITY_VALUE,
  SEVERITY_LABEL,
  SEVERITY_COLOR,
  SEVERITY_BG,
  SEVERITY_TEXT,
  SEVERITY_BORDER,
  buildChartPoints,
  computeChartStats,
  computeMovingAverage,
} from "./SeverityChartData";
import type {
  Severity,
  SymptomEntrySlice,
  ChartStats,
  BreakdownItem as BreakdownItemType,
} from "./SeverityChartData";

// ── Shared styles ────────────────────────────────────────────────────────────

const glassPanel: React.CSSProperties = {
  background: "rgba(99,102,241,0.06)",
  border: "0.5px solid rgba(99,102,241,0.2)",
  borderRadius: 12,
  padding: "14px 16px",
};

const whiteCard: React.CSSProperties = {
  background: "#ffffff",
  border: "0.5px solid #e5e7eb",
  borderRadius: 10,
  padding: "10px 14px",
  flex: 1,
  minWidth: 0,
};

// ── SeverityPill ─────────────────────────────────────────────────────────────

interface PillProps {
  severity: Severity;
  active: boolean;
  onToggle: () => void;
}

const SeverityPill: React.FC<PillProps> = ({ severity, active, onToggle }) => {
  const label = severity.charAt(0).toUpperCase() + severity.slice(1);

  const activeStyle: React.CSSProperties = {
    background: SEVERITY_BG[severity],
    color: SEVERITY_TEXT[severity],
    borderColor: SEVERITY_BORDER[severity],
  };

  const inactiveStyle: React.CSSProperties = {
    background: "#f3f4f6",
    color: "#9ca3af",
    borderColor: "#e5e7eb",
    opacity: 0.65,
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        ...(active ? activeStyle : inactiveStyle),
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 12px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        border: "0.5px solid",
        transition: "all 0.15s",
        userSelect: "none",
        lineHeight: 1.4,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: active ? SEVERITY_COLOR[severity] : "#d1d5db",
          flexShrink: 0,
          display: "inline-block",
        }}
      />
      {label}
    </button>
  );
};

// ── StatCard ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  color?: string;
  subtext?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  color,
  subtext,
}) => (
  <div style={whiteCard}>
    <p
      style={{
        fontSize: 11,
        color: "#6b7280",
        margin: "0 0 3px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </p>
    <p
      style={{
        fontSize: 20,
        fontWeight: 600,
        color: color ?? "#111827",
        margin: 0,
        lineHeight: 1.2,
      }}
    >
      {value}
    </p>
    {subtext != null && (
      <p
        style={{
          fontSize: 11,
          color: "#9ca3af",
          margin: "2px 0 0",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {subtext}
      </p>
    )}
  </div>
);

// ── BreakdownBar ─────────────────────────────────────────────────────────────

const BreakdownBar: React.FC<BreakdownItemType> = ({
  severity,
  count,
  percentage,
}) => (
  <div style={{ marginBottom: 10 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 12,
        color: "#6b7280",
        marginBottom: 4,
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: SEVERITY_COLOR[severity],
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
      <span style={{ fontWeight: 500, color: "#374151" }}>
        {count} {count === 1 ? "entry" : "entries"} &middot; {percentage}%
      </span>
    </div>
    <div
      style={{
        background: "#f3f4f6",
        borderRadius: 4,
        height: 7,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: SEVERITY_COLOR[severity],
          width: `${percentage}%`,
          height: "100%",
          borderRadius: 4,
          transition: "width 0.5s ease",
          minWidth: percentage > 0 ? 4 : 0,
        }}
      />
    </div>
  </div>
);

// ── SeverityChart ─────────────────────────────────────────────────────────────

interface SeverityChartProps {
  symptoms: SymptomEntrySlice[];
}

const SEVERITIES: Severity[] = ["mild", "moderate", "severe"];

const TREND_ARROW: Record<string, string> = {
  worsening: "↑",
  improving: "↓",
  stable: "→",
  insufficient: "—",
};

const AVG_LABEL: Record<number, string> = {
  1: "Mild avg",
  2: "Moderate avg",
  3: "Severe avg",
};

const SeverityChart: React.FC<SeverityChartProps> = ({ symptoms }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  const [activeFilters, setActiveFilters] = useState<Record<Severity, boolean>>(
    {
      mild: true,
      moderate: true,
      severe: true,
    },
  );
  const [showMovingAvg, setShowMovingAvg] = useState<boolean>(true);

  const toggleFilter = (sev: Severity): void =>
    setActiveFilters((prev) => ({ ...prev, [sev]: !prev[sev] }));

  // ── Data pipeline ──────────────────────────────────────────────────────────
  const allPoints = useMemo(() => buildChartPoints(symptoms), [symptoms]);

  const visiblePoints = useMemo(
    () => allPoints.filter((p) => activeFilters[p.severity]),
    [allPoints, activeFilters],
  );

  const stats: ChartStats = useMemo(
    () => computeChartStats(visiblePoints),
    [visiblePoints],
  );

  const movingAvg = useMemo(
    () => computeMovingAverage(visiblePoints, 3),
    [visiblePoints],
  );

  // ── Chart.js ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current?.destroy();
    chartRef.current = null;

    if (visiblePoints.length === 0) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const datasets: any[] = [
      {
        type: "bar",
        label: "Severity",
        data: visiblePoints.map((p) => p.value),
        backgroundColor: visiblePoints.map(
          (p) => `${SEVERITY_COLOR[p.severity]}cc`,
        ),
        borderColor: visiblePoints.map((p) => SEVERITY_COLOR[p.severity]),
        borderWidth: 1.5,
        borderRadius: 6,
        order: 2,
      },
    ];

    if (showMovingAvg) {
      datasets.push({
        type: "line",
        label: "Moving avg",
        data: movingAvg,
        borderColor: "#6366f1",
        borderWidth: 2,
        borderDash: [4, 3],
        pointRadius: 0,
        tension: 0.4,
        fill: false,
        spanGaps: false,
        order: 1,
      });
    }

    chartRef.current = new Chart(canvasRef.current, {
      data: {
        labels: visiblePoints.map((p) => p.dateLabel),
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 300 },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (ctx) => {
                const pt = visiblePoints[ctx[0].dataIndex];
                return pt ? `${pt.symptom} — ${pt.fullDate}` : ctx[0].label;
              },
              label: (ctx) => {
                if (ctx.datasetIndex === 0) {
                  const pt = visiblePoints[ctx.dataIndex];
                  const label = SEVERITY_LABEL[ctx.raw as number] ?? "";
                  return pt ? ` ${label} (${pt.severity})` : ` ${label}`;
                }
                const v = ctx.raw as number | null;
                return v !== null ? ` Avg: ${v.toFixed(1)}` : "";
              },
            },
          },
        },
        scales: {
          y: {
            min: 0,
            max: 4,
            ticks: {
              stepSize: 1,
              callback: (v) => SEVERITY_LABEL[v as number] ?? "",
              color: "#9ca3af",
              font: { size: 11 },
            },
            grid: { color: "rgba(0,0,0,0.05)" },
          },
          x: {
            ticks: {
              color: "#9ca3af",
              font: { size: 11 },
              autoSkip: false,
              maxRotation: visiblePoints.length > 8 ? 45 : 0,
            },
            grid: { display: false },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [visiblePoints, showMovingAvg, movingAvg]);

  // ── Derived display values ─────────────────────────────────────────────────
  const peakLabel = stats.peak
    ? SEVERITY_LABEL[SEVERITY_VALUE[stats.peak.severity]]
    : "—";
  const peakColor = stats.peak ? SEVERITY_TEXT[stats.peak.severity] : "#9ca3af";
  const trendStr = `${TREND_ARROW[stats.trend.direction] ?? "—"} ${stats.trend.label}`;
  const avgStr = stats.avgValue > 0 ? stats.avgValue.toFixed(1) : "—";
  const avgSub =
    stats.avgValue > 0
      ? (AVG_LABEL[Math.round(stats.avgValue)] ?? "Mixed")
      : undefined;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.97)",
        border: "0.5px solid #e5e7eb",
        borderRadius: 16,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 0, // ← controlled by Tailwind px-[15px] on parent
        paddingRight: 0,
        marginBottom: 24,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 16,
          paddingLeft: 20, // inner sections keep their own horizontal padding
          paddingRight: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 4,
              height: 20,
              background: "#6366f1",
              borderRadius: 2,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>
            Symptom severity over time
          </span>
          <span
            style={{
              fontSize: 11,
              color: "#9ca3af",
              background: "#f3f4f6",
              borderRadius: 4,
              padding: "2px 7px",
            }}
          >
            {symptoms.length} total
          </span>
        </div>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {SEVERITIES.map((sev) => (
            <SeverityPill
              key={sev}
              severity={sev}
              active={activeFilters[sev]}
              onToggle={() => toggleFilter(sev)}
            />
          ))}
          <button
            type="button"
            onClick={() => setShowMovingAvg((v) => !v)}
            style={{
              fontSize: 11,
              color: showMovingAvg ? "#6366f1" : "#9ca3af",
              background: showMovingAvg ? "#eef2ff" : "#f9fafb",
              border: `0.5px solid ${showMovingAvg ? "#c7d2fe" : "#e5e7eb"}`,
              borderRadius: 6,
              padding: "4px 9px",
              cursor: "pointer",
              fontWeight: 500,
              transition: "all 0.15s",
              lineHeight: 1.4,
            }}
          >
            Avg line
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          flexWrap: "wrap",
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <StatCard label="Visible entries" value={String(stats.total)} />
        <StatCard
          label="Peak severity"
          value={peakLabel}
          color={peakColor}
          subtext={stats.peak?.symptom}
        />
        <StatCard
          label="Overall trend"
          value={trendStr}
          color={stats.trend.color}
        />
        <StatCard
          label="Average level"
          value={avgStr}
          color="#6366f1"
          subtext={avgSub}
        />
      </div>

      {/* Chart panel */}
      <div
        style={{
          ...glassPanel,
          marginBottom: 12,
          marginLeft: 20,
          marginRight: 20,
        }}
      >
        {visiblePoints.length === 0 ? (
          <div
            style={{
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
              fontSize: 13,
            }}
          >
            No data for selected filters
          </div>
        ) : (
          <div style={{ position: "relative", height: 240 }}>
            <canvas ref={canvasRef} />
          </div>
        )}

        {/* Custom legend */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 10,
            fontSize: 12,
            color: "#6b7280",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {SEVERITIES.map((sev) => (
            <span
              key={sev}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: SEVERITY_COLOR[sev],
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {sev.charAt(0).toUpperCase() + sev.slice(1)}
            </span>
          ))}
          {showMovingAvg && (
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span
                style={{
                  width: 18,
                  height: 2,
                  background: "#6366f1",
                  display: "inline-block",
                  borderRadius: 1,
                  flexShrink: 0,
                }}
              />
              Moving avg
            </span>
          )}
        </div>
      </div>

      {/* Breakdown panel */}
      <div style={{ ...glassPanel, marginLeft: 20, marginRight: 20 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#9ca3af",
            margin: "0 0 12px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Breakdown
        </p>
        {stats.breakdown.map((item) => (
          <BreakdownBar
            key={item.severity}
            severity={item.severity}
            count={item.count}
            percentage={item.percentage}
          />
        ))}
        {stats.total === 0 && (
          <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
            No entries visible
          </p>
        )}
      </div>
    </div>
  );
};

export default SeverityChart;
