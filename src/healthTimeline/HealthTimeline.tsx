import { useTranslation } from "react-i18next";
import SeverityChart from "./components/SeverityChart";
import type { SymptomEntrySlice } from "./components/SeverityChartData";

const mockSymptoms: SymptomEntrySlice[] = [
  { id: "1",  symptom: "Headache",         severity: "mild",     date: "2025-03-01" },
  { id: "2",  symptom: "Fever",            severity: "moderate", date: "2025-03-03" },
  { id: "3",  symptom: "Body aches",       severity: "severe",   date: "2025-03-05" },
  { id: "4",  symptom: "Sore throat",      severity: "moderate", date: "2025-03-07" },
  { id: "5",  symptom: "Fatigue",          severity: "severe",   date: "2025-03-09" },
  { id: "6",  symptom: "Runny nose",       severity: "mild",     date: "2025-03-11" },
  { id: "7",  symptom: "Cough",            severity: "moderate", date: "2025-03-13" },
  { id: "8",  symptom: "Chills",           severity: "severe",   date: "2025-03-15" },
  { id: "9",  symptom: "Nausea",           severity: "mild",     date: "2025-03-17" },
  { id: "10", symptom: "Dizziness",        severity: "moderate", date: "2025-03-19" },
  { id: "11", symptom: "Chest tightness",  severity: "severe",   date: "2025-03-21" },
  { id: "12", symptom: "Mild cough",       severity: "mild",     date: "2025-03-23" },
];

const HealthTimeline = () => {
  const { t:_t } = useTranslation();

  return (
    <div className="px-4">  {/* px-4 = 16px, change to px-6 (24px) or px-8 (32px) as needed */}
      <SeverityChart symptoms={mockSymptoms} />
    </div>
  );
};

export default HealthTimeline;