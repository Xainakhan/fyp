import React from "react";
import { Info } from "lucide-react";
import type { DiseaseSuggestion } from "../../utils/healthUtils";

interface Props {
  suggestions: DiseaseSuggestion[];
  title: string;
  disclaimer: string;
  likelyLabels: { low: string; medium: string; high: string };
}

const likelihoodStyle = {
  high:   "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low:    "bg-green-100 text-green-700",
};

const PossibleConditionsCard: React.FC<Props> = ({
  suggestions,
  title,
  disclaimer,
  likelyLabels,
}) => (
  <div className="bg-white rounded-2xl shadow-md p-5 mb-6 border border-amber-200">
    <div className="flex items-center gap-2 mb-3">
      <Info className="w-5 h-5 text-amber-500" />
      <h2 className="text-base md:text-lg font-semibold text-gray-900">{title}</h2>
    </div>
    <p className="text-xs text-gray-500 mb-4">{disclaimer}</p>
    <div className="grid md:grid-cols-2 gap-4">
      {suggestions.map((disease) => (
        <div key={disease.id} className="border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 text-sm md:text-base">{disease.name}</h3>
            <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${likelihoodStyle[disease.likelihood]}`}>
              {likelyLabels[disease.likelihood]}
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
);

export default PossibleConditionsCard;