import type { LucideIcon } from "lucide-react";
import {
  User,
  Calendar,
  Settings,
  Award,
  TrendingUp,
  Stethoscope,
  Activity,
} from "lucide-react";

export interface UserData {
  name: string;
  role: string;
  email: string;
}

export interface MenuItem {
  id: string;
  label: string;
  labelUrdu: string;
  icon: LucideIcon;
}

export interface Stat {
  label: string;
  labelUrdu: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

export interface Appointment {
  id: number;
  doctorName: string;
  doctorNameUrdu: string;
  specialty: string;
  specialtyUrdu: string;
  date: string;
  dateUrdu: string;
  time: string;
  timeUrdu: string;
  status: string;
  statusUrdu: string;
  type?: string;
  typeUrdu?: string;
  location?: string;
  locationUrdu?: string;
}

export interface HealthRecord {
  id: number;
  type: string;
  typeUrdu: string;
  date: string;
  dateUrdu: string;
  result: string;
  resultUrdu: string;
  doctor: string;
  doctorUrdu: string;
}

export interface Prescription {
  id: number;
  medicine: string;
  medicineUrdu: string;
  dosage: string;
  dosageUrdu: string;
  duration: string;
  durationUrdu: string;
  doctor: string;
  doctorUrdu: string;
  date: string;
  dateUrdu: string;
}

export interface NotificationSetting {
  id: number;
  title: string;
  titleUrdu: string;
  description: string;
  descriptionUrdu: string;
  enabled: boolean;
}

export const userData: UserData = {
  name: "Dr. Ahmed Ali",
  role: "Patient",
  email: "ahmed.ali@example.com",
};

export const menuItems: MenuItem[] = [
  { id: "overview", label: "Overview", labelUrdu: "جائزہ", icon: User },
  { id: "appointments", label: "My Appointments", labelUrdu: "میری ملاقاتیں", icon: Calendar },
  { id: "health-records", label: "Health Records", labelUrdu: "صحت کے ریکارڈ", icon: Activity },
  { id: "prescriptions", label: "Prescriptions", labelUrdu: "نسخے", icon: Stethoscope },
  { id: "settings", label: "Settings", labelUrdu: "ترتیبات", icon: Settings },
];

export const stats: Stat[] = [
  {
    label: "Appointments",
    labelUrdu: "ملاقاتیں",
    value: "12",
    icon: Calendar,
    color: "text-green-600",
  },
  {
    label: "Completed",
    labelUrdu: "مکمل",
    value: "8",
    icon: Award,
    color: "text-blue-600",
  },
  {
    label: "Prescriptions",
    labelUrdu: "نسخے",
    value: "5",
    icon: Stethoscope,
    color: "text-purple-600",
  },
  {
    label: "Health Score",
    labelUrdu: "صحت سکور",
    value: "85%",
    icon: TrendingUp,
    color: "text-teal-600",
  },
];

export const upcomingAppointments: Appointment[] = [
  {
    id: 1,
    doctorName: "Dr. Sarah Ahmed",
    doctorNameUrdu: "ڈاکٹر سارہ احمد",
    specialty: "Cardiologist",
    specialtyUrdu: "دل کے ماہر",
    date: "Feb 18, 2026",
    dateUrdu: "18 فروری، 2026",
    time: "10:00 AM",
    timeUrdu: "صبح 10:00 بجے",
    status: "Confirmed",
    statusUrdu: "تصدیق شدہ",
  },
  {
    id: 2,
    doctorName: "Dr. Ali Hassan",
    doctorNameUrdu: "ڈاکٹر علی حسن",
    specialty: "General Physician",
    specialtyUrdu: "عام معالج",
    date: "Feb 22, 2026",
    dateUrdu: "22 فروری، 2026",
    time: "2:30 PM",
    timeUrdu: "دوپہر 2:30 بجے",
    status: "Pending",
    statusUrdu: "زیر التواء",
  },
];

export const healthRecords: HealthRecord[] = [
  {
    id: 1,
    type: "Blood Test",
    typeUrdu: "خون کا ٹیسٹ",
    date: "Jan 15, 2026",
    dateUrdu: "15 جنوری، 2026",
    result: "Normal",
    resultUrdu: "نارمل",
    doctor: "Dr. Fatima Khan",
    doctorUrdu: "ڈاکٹر فاطمہ خان",
  },
  {
    id: 2,
    type: "X-Ray",
    typeUrdu: "ایکسرے",
    date: "Dec 20, 2025",
    dateUrdu: "20 دسمبر، 2025",
    result: "Clear",
    resultUrdu: "صاف",
    doctor: "Dr. Omar Siddiqui",
    doctorUrdu: "ڈاکٹر عمر صدیقی",
  },
  {
    id: 3,
    type: "ECG",
    typeUrdu: "ای سی جی",
    date: "Nov 10, 2025",
    dateUrdu: "10 نومبر، 2025",
    result: "Normal",
    resultUrdu: "نارمل",
    doctor: "Dr. Sarah Ahmed",
    doctorUrdu: "ڈاکٹر سارہ احمد",
  },
];

export const prescriptions: Prescription[] = [
  {
    id: 1,
    medicine: "Paracetamol 500mg",
    medicineUrdu: "پیراسیٹامول 500mg",
    dosage: "1 tablet twice daily",
    dosageUrdu: "دن میں دو بار 1 گولی",
    duration: "5 days",
    durationUrdu: "5 دن",
    doctor: "Dr. Ali Hassan",
    doctorUrdu: "ڈاکٹر علی حسن",
    date: "Feb 1, 2026",
    dateUrdu: "1 فروری، 2026",
  },
  {
    id: 2,
    medicine: "Vitamin D3",
    medicineUrdu: "وٹامن ڈی 3",
    dosage: "1 capsule daily",
    dosageUrdu: "روزانہ 1 کیپسول",
    duration: "30 days",
    durationUrdu: "30 دن",
    doctor: "Dr. Fatima Khan",
    doctorUrdu: "ڈاکٹر فاطمہ خان",
    date: "Jan 15, 2026",
    dateUrdu: "15 جنوری، 2026",
  },
];

export const notificationSettings: NotificationSetting[] = [
  {
    id: 1,
    title: "Appointment Reminders",
    titleUrdu: "ملاقات کی یاد دہانی",
    description: "Get notified before appointments",
    descriptionUrdu: "ملاقات سے پہلے اطلاع حاصل کریں",
    enabled: true,
  },
  {
    id: 2,
    title: "Prescription Updates",
    titleUrdu: "نسخے کی تازہ کاری",
    description: "Receive prescription notifications",
    descriptionUrdu: "نسخے کی اطلاعات وصول کریں",
    enabled: true,
  },
  {
    id: 3,
    title: "Health Tips",
    titleUrdu: "صحت کے نکات",
    description: "Weekly health tips and advice",
    descriptionUrdu: "ہفتہ وار صحت کے نکات اور مشورے",
    enabled: false,
  },
];