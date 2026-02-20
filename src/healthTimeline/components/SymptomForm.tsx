import React from "react";
import { Plus, Edit2 } from "lucide-react";

interface FormLabels {
  editingNotice: string; updateButton: string; cancelEdit: string;
  symptomName: string; symptomPlaceholder: string; severity: string;
  mild: string; moderate: string; severe: string; date: string;
  duration: string; durationPlaceholder: string; bodyPart: string;
  bodyPartPlaceholder: string; relatedSymptoms: string;
  relatedPlaceholder: string; saveButton: string;
}

interface Props {
  labels: FormLabels;
  editingId: string | null;
  symptom: string; severity: "mild" | "moderate" | "severe";
  date: string; duration: string; bodyPart: string; related: string;
  onSymptomChange: (v: string) => void;
  onSeverityChange: (v: "mild" | "moderate" | "severe") => void;
  onDateChange: (v: string) => void; onDurationChange: (v: string) => void;
  onBodyPartChange: (v: string) => void; onRelatedChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void; onCancelEdit: () => void;
}

const input = "w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
const label = "block text-xs font-semibold text-gray-600 mb-1";

const SymptomForm: React.FC<Props> = ({
  labels, editingId, symptom, severity, date, duration, bodyPart, related,
  onSymptomChange, onSeverityChange, onDateChange, onDurationChange,
  onBodyPartChange, onRelatedChange, onSubmit, onCancelEdit,
}) => (
  <form onSubmit={onSubmit} className="mb-6 border border-indigo-100 rounded-xl p-4 bg-indigo-50/40">
    {editingId && (
      <div className="mb-3 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md px-3 py-2 flex items-center justify-between">
        <span>{labels.editingNotice} <strong>{labels.updateButton}</strong>.</span>
        <button type="button" onClick={onCancelEdit} className="text-[11px] text-indigo-500 hover:text-indigo-700">
          {labels.cancelEdit}
        </button>
      </div>
    )}

    <div className="grid md:grid-cols-2 gap-4 mb-4">
      <div>
        <label className={label}>{labels.symptomName}</label>
        <input value={symptom} onChange={(e) => onSymptomChange(e.target.value)}
          className={input} placeholder={labels.symptomPlaceholder} />
      </div>
      <div>
        <label className={label}>{labels.severity}</label>
        <select value={severity} onChange={(e) => onSeverityChange(e.target.value as "mild" | "moderate" | "severe")} className={input}>
          <option value="mild">{labels.mild}</option>
          <option value="moderate">{labels.moderate}</option>
          <option value="severe">{labels.severe}</option>
        </select>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-4 mb-4">
      <div>
        <label className={label}>{labels.date}</label>
        <input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} className={input} />
      </div>
      <div>
        <label className={label}>{labels.duration}</label>
        <input value={duration} onChange={(e) => onDurationChange(e.target.value)}
          className={input} placeholder={labels.durationPlaceholder} />
      </div>
      <div>
        <label className={label}>{labels.bodyPart}</label>
        <input value={bodyPart} onChange={(e) => onBodyPartChange(e.target.value)}
          className={input} placeholder={labels.bodyPartPlaceholder} />
      </div>
    </div>

    <div className="mb-4">
      <label className={label}>{labels.relatedSymptoms}</label>
      <input value={related} onChange={(e) => onRelatedChange(e.target.value)}
        className={input} placeholder={labels.relatedPlaceholder} />
    </div>

    <button type="submit" className="w-full md:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center justify-center gap-2">
      {editingId ? (<><Edit2 className="w-4 h-4" />{labels.updateButton}</>) : (<><Plus className="w-4 h-4" />{labels.saveButton}</>)}
    </button>
  </form>
);

export default SymptomForm;