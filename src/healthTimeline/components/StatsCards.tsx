import React from "react";
import type { SeverityTrend } from "../../utils/healthUtils";

interface Props {
  totalSymptoms: number;
  durationText: string;
  severityTrend: SeverityTrend;
  labels: { totalSymptoms: string; timelineDuration: string; severityTrend: string; };
}

const StatsCards: React.FC<Props> = ({ totalSymptoms, durationText, severityTrend, labels }) => (
  <div className="grid md:grid-cols-3 gap-4 mt-6">
    <div className="bg-white rounded-xl shadow-md p-4">
      <p className="text-gray-600 text-sm mb-1">{labels.totalSymptoms}</p>
      <p className="text-2xl font-bold text-gray-900">{totalSymptoms}</p>
    </div>
    <div className="bg-white rounded-xl shadow-md p-4">
      <p className="text-gray-600 text-sm mb-1">{labels.timelineDuration}</p>
      <p className="text-2xl font-bold text-gray-900">{durationText}</p>
    </div>
    <div className="bg-white rounded-xl shadow-md p-4">
      <p className="text-gray-600 text-sm mb-1">{labels.severityTrend}</p>
      <p className={`text-2xl font-bold ${severityTrend.color}`}>{severityTrend.label}</p>
    </div>
  </div>
);

export default StatsCards;