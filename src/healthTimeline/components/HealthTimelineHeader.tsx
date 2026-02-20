import React from "react";
import { Activity } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
}

const HealthTimelineHeader: React.FC<Props> = ({ title, subtitle }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
    <div className="flex items-center gap-3 mb-2">
      <div className="bg-indigo-100 p-3 rounded-xl">
        <Activity className="w-6 h-6 text-indigo-600" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 text-sm">{subtitle}</p>
      </div>
    </div>
  </div>
);

export default HealthTimelineHeader;