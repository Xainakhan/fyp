import React from "react";
import { TrendingUp, AlertCircle } from "lucide-react";
import type { HealthPrediction } from "../../utils/healthUtils";
import { getRiskColor, getRiskBadgeColor } from "../../utils/healthUtils";

interface Props {
  prediction: HealthPrediction;
  title: string;
  recommendationLabel: string;
  riskLabel: string;
}

const AIAnalysisCard: React.FC<Props> = ({
  prediction,
  title,
  recommendationLabel,
  riskLabel,
}) => (
  <div className={`${getRiskColor(prediction.risk)} border-2 rounded-2xl p-6 mb-4 shadow-md`}>
    <div className="flex flex-col md:flex-row items-start gap-4">
      <div className={`${getRiskBadgeColor(prediction.risk)} p-3 rounded-xl`}>
        <TrendingUp className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <h2 className="text-lg font-bold">{title}</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadgeColor(prediction.risk)} text-white`}>
            {riskLabel}
          </span>
        </div>
        <p className="text-sm mb-3">{prediction.message}</p>
        <div className="bg-white bg-opacity-60 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm mb-1">{recommendationLabel}</p>
            <p className="text-sm">{prediction.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AIAnalysisCard;