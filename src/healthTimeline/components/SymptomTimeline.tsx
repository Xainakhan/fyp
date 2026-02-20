import React from "react";
import { Plus, X } from "lucide-react";
import type { SymptomEntry } from "../../utils/healthUtils";
import SymptomCard from "./SymptomCard";

interface Props {
  symptoms: SymptomEntry[];
  labels: { title: string; addButton: string; closeForm: string; noSymptoms: string; location: string; relatedSymptoms: string; };
  actionLabels: { edit: string; delete: string };
  showForm: boolean;
  onToggleForm: () => void;
  onEdit: (entry: SymptomEntry) => void;
  onDelete: (id: string) => void;
  formSlot: React.ReactNode;
}

const SymptomTimeline: React.FC<Props> = ({
  symptoms, labels, actionLabels, showForm, onToggleForm, onEdit, onDelete, formSlot,
}) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
      <h2 className="text-xl font-bold text-gray-900">{labels.title}</h2>
      <button onClick={onToggleForm}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold">
        {showForm
          ? <><X className="w-4 h-4" /> {labels.closeForm}</>
          : <><Plus className="w-4 h-4" /> {labels.addButton}</>}
      </button>
    </div>

    {showForm && formSlot}

    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300 to-indigo-100" />
      <div className="space-y-6">
        {symptoms.map((entry) => (
          <SymptomCard key={entry.id} entry={entry}
            locationLabel={labels.location}
            relatedSymptomsLabel={labels.relatedSymptoms}
            actions={actionLabels}
            onEdit={onEdit} onDelete={onDelete} />
        ))}
        {symptoms.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-10">{labels.noSymptoms}</div>
        )}
      </div>
    </div>
  </div>
);

export default SymptomTimeline;