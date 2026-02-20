// healthInterview/constants.ts
import { User, ClipboardList, HeartPulse, Activity, SmilePlus } from "lucide-react";
import type { StepId } from "./types";

export const API_BASE = "http://localhost:5000";

export const CHRONIC_OPTIONS = [
  "Diabetes",
  "High blood pressure",
  "Heart disease",
  "Asthma / lung disease",
  "Kidney disease",
  "Liver disease",
  "Thyroid / hormone problems",
];

export const STEPS: { id: StepId; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "basic",     icon: User },
  { id: "current",  icon: ClipboardList },
  { id: "history",  icon: HeartPulse },
  { id: "lifestyle",icon: Activity },
  { id: "summary",  icon: SmilePlus },
];