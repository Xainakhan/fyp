import React from "react";
import { Calendar, Clock, Edit2, Trash2 } from "lucide-react";
import type { SymptomEntry } from "../../utils/healthUtils";
import { getSeverityColor, getSeverityDotColor } from "../../utils/healthUtils";


interface Props {
  entry: SymptomEntry;
  locationLabel: string;
  relatedSymptomsLabel: string;
  actions: { edit: string; delete: string };
  onEdit: (entry: SymptomEntry) => void;
  onDelete: (id: string) => void;
}

const SymptomCard: React.FC<Props> = ({
  entry, locationLabel, relatedSymptomsLabel, actions, onEdit, onDelete,
}) => (
  <div className="relative pl-20">
    <div className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white shadow-md ${getSeverityDotColor(entry.severity)}`} />
    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-indigo-300 transition-colors">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{entry.symptom}</h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 flex-wrap">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(entry.date).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              })}
            </span>
            <Clock className="w-4 h-4 ml-2" />
            <span>{entry.duration}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(entry.severity)}`}>
            {entry.severity.toUpperCase()}
          </span>
          <button
            type="button"
            onClick={() => onEdit(entry)}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            <Edit2 className="w-3 h-3" /> {actions.edit}
          </button>
          <button
            type="button"
            onClick={() => onDelete(entry.id)}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
          >
            <Trash2 className="w-3 h-3" /> {actions.delete}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-3 mb-3">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">{locationLabel}</span> {entry.bodyPart}
        </p>
      </div>

      {entry.relatedSymptoms.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">{relatedSymptomsLabel}</p>
          <div className="flex flex-wrap gap-2">
            {entry.relatedSymptoms.map((related, idx) => (
              <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                {related}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default SymptomCard;