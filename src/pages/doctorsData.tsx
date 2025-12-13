// pages/FindDoctorPage.tsx

import React, { useState, useEffect } from "react";
import {
  Users,
  Activity,
  Heart,
  Brain,
  Building,
  MapPin,
  Phone,
  Calendar,
  Star,
  AlertTriangle,
  Stethoscope,
  User,
  Thermometer,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Award,
  CheckCircle,
  Navigation,
  DollarSign,
  Locate,
  Map,
  Route,
} from "lucide-react";

type Language = "en" | "ur";

interface Coordinates {
  lat: number;
  lng: number;
}

interface DoctorBase {
  id: number;
  name: string;
  qualification: string;
  experience: string; // e.g. "15 years"
  hospital: string;
  location: string; // city name
  coordinates: Coordinates;
  address?: string;
  phone: string;
  rating: number;
  reviews: number;
  consultationFee: number;
  availability: string[];
  timeSlots: string[];
  languages: string[];
  specializations: string[];
  verified: boolean;
  onlineConsultation: boolean;
  distance: number | null;
}

interface SpecialtyName {
  en: string;
  ur: string;
}

interface SpecialtyData {
  name: SpecialtyName;
  specialty: SpecialtyName;
  conditions: string[];
  doctors: DoctorBase[];
}

type DoctorDatabase = Record<string, SpecialtyData>;

type DoctorWithMeta = DoctorBase & {
  specialty: SpecialtyName;
  specialtyKey: string;
};

type SortBy =
  | "distance"
  | "rating"
  | "experience"
  | "price_low"
  | "price_high"
  | "reviews";

interface PriceRange {
  min: string;
  max: string;
}

// ---------------- DOCTOR DATABASE (same as yours) ----------------

const doctorDatabase: DoctorDatabase = {
  cardiology: {
    name: { en: "Cardiologist", ur: "دل کا ڈاکٹر" },
    specialty: {
      en: "Heart & Cardiovascular System",
      ur: "دل اور قلبی نظام",
    },
    conditions: [
      "heart_attack",
      "hypertension",
      "chest_pain",
      "arrhythmia",
      "heart_failure",
      "angina",
    ],
    doctors: [
      {
        id: 1,
        name: "Dr. Ahmed Hassan",
        qualification: "MBBS, MD Cardiology, FACC",
        experience: "15 years",
        hospital: "Services Hospital Lahore",
        location: "Lahore",
        coordinates: { lat: 31.5804, lng: 74.3587 },
        address: "Jail Road, Lahore",
        phone: "+92-42-99231441",
        rating: 4.8,
        reviews: 245,
        consultationFee: 3000,
        availability: ["Monday", "Wednesday", "Friday"],
        timeSlots: ["9:00 AM - 1:00 PM", "4:00 PM - 8:00 PM"],
        languages: ["English", "Urdu"],
        specializations: [
          "Interventional Cardiology",
          "Heart Failure",
          "Cardiac Catheterization",
        ],
        verified: true,
        onlineConsultation: true,
        distance: null,
      },
      {
        id: 2,
        name: "Dr. Fatima Khan",
        qualification: "MBBS, FCPS Cardiology, FESC",
        experience: "12 years",
        hospital: "Aga Khan University Hospital",
        location: "Karachi",
        coordinates: { lat: 24.8607, lng: 67.0011 },
        address: "Stadium Road, Karachi",
        phone: "+92-21-34864000",
        rating: 4.9,
        reviews: 189,
        consultationFee: 4500,
        availability: ["Tuesday", "Thursday", "Saturday"],
        timeSlots: ["10:00 AM - 2:00 PM", "5:00 PM - 9:00 PM"],
        languages: ["English", "Urdu"],
        specializations: [
          "Cardiac Surgery",
          "Valve Disease",
          "Congenital Heart Disease",
        ],
        verified: true,
        onlineConsultation: false,
        distance: null,
      },
      {
        id: 3,
        name: "Dr. Rizwan Ahmad",
        qualification: "MBBS, MS Cardiology",
        experience: "18 years",
        hospital: "Punjab Institute of Cardiology",
        location: "Lahore",
        coordinates: { lat: 31.5497, lng: 74.3436 },
        address: "Jail Road, Lahore",
        phone: "+92-42-99211441",
        rating: 4.7,
        reviews: 312,
        consultationFee: 2800,
        availability: ["Monday", "Tuesday", "Thursday", "Friday"],
        timeSlots: ["8:00 AM - 12:00 PM", "3:00 PM - 7:00 PM"],
        languages: ["English", "Urdu", "Punjabi"],
        specializations: [
          "Preventive Cardiology",
          "Lipid Disorders",
          "Hypertension",
        ],
        verified: true,
        onlineConsultation: true,
        distance: null,
      },
    ],
  },

  pulmonology: {
    name: { en: "Pulmonologist", ur: "پھیپھڑوں کا ڈاکٹر" },
    specialty: {
      en: "Respiratory & Lung Diseases",
      ur: "سانس اور پھیپھڑوں کی بیماریاں",
    },
    conditions: [
      "asthma",
      "pneumonia",
      "breathing_difficulty",
      "copd",
      "lung_infection",
      "tuberculosis",
    ],
    doctors: [
      {
        id: 4,
        name: "Dr. Muhammad Ali",
        qualification: "MBBS, FCPS Pulmonology, FRCP",
        experience: "18 years",
        hospital: "Mayo Hospital Lahore",
        location: "Lahore",
        coordinates: { lat: 31.5925, lng: 74.3095 },
        address: "Nila Gumbad, Lahore",
        phone: "+92-42-99212011",
        rating: 4.7,
        reviews: 178,
        consultationFee: 2500,
        availability: ["Monday", "Tuesday", "Thursday"],
        timeSlots: ["9:00 AM - 1:00 PM", "4:30 PM - 8:30 PM"],
        languages: ["English", "Urdu", "Punjabi"],
        specializations: [
          "Sleep Medicine",
          "Critical Care",
          "Interventional Pulmonology",
        ],
        verified: true,
        onlineConsultation: true,
        distance: null,
      },
      {
        id: 5,
        name: "Dr. Saira Malik",
        qualification: "MBBS, MD Chest Medicine",
        experience: "10 years",
        hospital: "Ziauddin Hospital",
        location: "Karachi",
        coordinates: { lat: 24.9056, lng: 67.0822 },
        address: "Clifton, Karachi",
        phone: "+92-21-35862937",
        rating: 4.6,
        reviews: 134,
        consultationFee: 3500,
        availability: ["Wednesday", "Friday", "Saturday"],
        timeSlots: ["10:00 AM - 2:00 PM", "6:00 PM - 10:00 PM"],
        languages: ["English", "Urdu"],
        specializations: ["Asthma Management", "Lung Cancer", "Bronchoscopy"],
        verified: true,
        onlineConsultation: false,
        distance: null,
      },
    ],
  },

  neurology: {
    name: { en: "Neurologist", ur: "اعصابی ڈاکٹر" },
    specialty: { en: "Brain & Nervous System", ur: "دماغ اور اعصابی نظام" },
    conditions: [
      "stroke",
      "migraine",
      "seizures",
      "headache",
      "epilepsy",
      "parkinsons",
      "alzheimers",
    ],
    doctors: [
      {
        id: 6,
        name: "Dr. Tariq Mahmood",
        qualification: "MBBS, FCPS Neurology, FRCP",
        experience: "20 years",
        hospital: "Lahore General Hospital",
        location: "Lahore",
        coordinates: { lat: 31.5656, lng: 74.3141 },
        address: "Ferozpur Road, Lahore",
        phone: "+92-42-99211441",
        rating: 4.9,
        reviews: 267,
        consultationFee: 4000,
        availability: ["Monday", "Wednesday", "Friday"],
        timeSlots: ["8:30 AM - 12:30 PM", "3:30 PM - 7:30 PM"],
        languages: ["English", "Urdu"],
        specializations: ["Stroke Medicine", "Movement Disorders", "Epilepsy"],
        verified: true,
        onlineConsultation: true,
        distance: null,
      },
      {
        id: 7,
        name: "Dr. Ayesha Siddique",
        qualification: "MBBS, MD Neurology, DNB",
        experience: "8 years",
        hospital: "Shaukat Khanum Hospital",
        location: "Lahore",
        coordinates: { lat: 31.5164, lng: 74.3493 },
        address: "7A Block R-3 M.A. Johar Town, Lahore",
        phone: "+92-42-35905000",
        rating: 4.8,
        reviews: 156,
        consultationFee: 5000,
        availability: ["Tuesday", "Thursday", "Saturday"],
        timeSlots: ["9:00 AM - 1:00 PM", "4:00 PM - 8:00 PM"],
        languages: ["English", "Urdu"],
        specializations: [
          "Pediatric Neurology",
          "Headache Medicine",
          "Neuromuscular Disorders",
        ],
        verified: true,
        onlineConsultation: true,
        distance: null,
      },
    ],
  },

  gastroenterology: {
    name: { en: "Gastroenterologist", ur: "معدے کا ڈاکٹر" },
    specialty: { en: "Digestive System", ur: "نظام ہاضمہ" },
    conditions: [
      "stomach_pain",
      "nausea",
      "vomiting",
      "diarrhea",
      "liver_disease",
      "ibs",
      "ulcers",
    ],
    doctors: [
      {
        id: 8,
        name: "Dr. Kashif Ahmad",
        qualification: "MBBS, FCPS Gastroenterology, MRCP",
        experience: "14 years",
        hospital: "Combined Military Hospital",
        location: "Rawalpindi",
        coordinates: { lat: 33.6844, lng: 73.0479 },
        address: "CMH Road, Rawalpindi Cantt",
        phone: "+92-51-9270012",
        rating: 4.7,
        reviews: 198,
        consultationFee: 3500,
        availability: ["Monday", "Tuesday", "Friday"],
        timeSlots: ["9:00 AM - 1:00 PM", "5:00 PM - 9:00 PM"],
        languages: ["English", "Urdu"],
        specializations: [
          "Hepatology",
          "Endoscopy",
          "Inflammatory Bowel Disease",
        ],
        verified: true,
        onlineConsultation: false,
        distance: null,
      },
      {
        id: 9,
        name: "Dr. Samina Khatoon",
        qualification: "MBBS, MD Gastroenterology",
        experience: "11 years",
        hospital: "Jinnah Hospital Lahore",
        location: "Lahore",
        coordinates: { lat: 31.5925, lng: 74.3095 },
        address: "Allama Iqbal Road, Lahore",
        phone: "+92-42-99203841",
        rating: 4.5,
        reviews: 143,
        consultationFee: 2800,
        availability: ["Wednesday", "Thursday", "Saturday"],
        timeSlots: ["10:00 AM - 2:00 PM", "4:30 PM - 8:30 PM"],
        languages: ["English", "Urdu", "Punjabi"],
        specializations: ["Pancreatic Disorders", "GERD", "Colonoscopy"],
        verified: true,
        onlineConsultation: true,
        distance: null,
      },
    ],
  },

  endocrinology: {
    name: { en: "Endocrinologist", ur: "ہارمون کا ڈاکٹر" },
    specialty: { en: "Diabetes & Hormones", ur: "ذیابیطس اور ہارمونز" },
    conditions: [
      "diabetes",
      "thyroid_disorders",
      "hormonal_imbalance",
      "obesity",
      "pcos",
      "osteoporosis",
    ],
    doctors: [
      {
        id: 10,
        name: "Dr. Nadia Bashir",
        qualification: "MBBS, FCPS Endocrinology, FACE",
        experience: "16 years",
        hospital: "Fatima Jinnah Medical University",
        location: "Lahore",
        coordinates: { lat: 31.5804, lng: 74.3587 },
        address: "Queens Road, Lahore",
        phone: "+92-42-99203801",
        rating: 4.8,
        reviews: 221,
        consultationFee: 3000,
        availability: ["Wednesday", "Thursday", "Saturday"],
        timeSlots: ["8:00 AM - 12:00 PM", "3:00 PM - 7:00 PM"],
        languages: ["English", "Urdu"],
        specializations: [
          "Diabetes Management",
          "Thyroid Disorders",
          "Reproductive Endocrinology",
        ],
        verified: true,
        onlineConsultation: true,
        distance: null,
      },
    ],
  },

  orthopedics: {
    name: { en: "Orthopedic Surgeon", ur: "ہڈیوں کا سرجن" },
    specialty: { en: "Bones, Joints & Muscles", ur: "ہڈیاں، جوڑ اور پٹھے" },
    conditions: [
      "fractures",
      "joint_pain",
      "back_pain",
      "sports_injuries",
      "arthritis",
    ],
    doctors: [
      {
        id: 11,
        name: "Dr. Imran Sheikh",
        qualification: "MBBS, MS Orthopedics, FRCS",
        experience: "22 years",
        hospital: "National Hospital Lahore",
        location: "Lahore",
        coordinates: { lat: 31.5497, lng: 74.3436 },
        address: "DHA Phase 1, Lahore",
        phone: "+92-42-35777441",
        rating: 4.9,
        reviews: 334,
        consultationFee: 4000,
        availability: ["Monday", "Wednesday", "Saturday"],
        timeSlots: ["7:00 AM - 11:00 AM", "2:00 PM - 6:00 PM"],
        languages: ["English", "Urdu", "Punjabi"],
        specializations: [
          "Joint Replacement",
          "Spine Surgery",
          "Sports Medicine",
        ],
        verified: true,
        onlineConsultation: false,
        distance: null,
      },
    ],
  },

  psychiatry: {
    name: { en: "Psychiatrist", ur: "ذہنی صحت کا ڈاکٹر" },
    specialty: { en: "Mental Health", ur: "ذہنی صحت" },
    conditions: [
      "depression",
      "anxiety",
      "mental_health",
      "stress_disorders",
      "bipolar_disorder",
      "schizophrenia",
    ],
    doctors: [
      {
        id: 12,
        name: "Dr. Sarah Ahmed",
        qualification: "MBBS, FCPS Psychiatry, MRCPsych",
        experience: "11 years",
        hospital: "Institute of Psychiatry",
        location: "Rawalpindi",
        coordinates: { lat: 33.6007, lng: 73.0679 },
        address: "Benazir Bhutto Hospital, Rawalpindi",
        phone: "+92-51-9290441",
        rating: 4.6,
        reviews: 167,
        consultationFee: 2800,
        availability: ["Monday", "Tuesday", "Thursday", "Friday"],
        timeSlots: ["9:00 AM - 1:00 PM", "4:00 PM - 8:00 PM"],
        languages: ["English", "Urdu"],
        specializations: [
          "Cognitive Behavioral Therapy",
          "Addiction Medicine",
          "Child Psychiatry",
        ],
        verified: true,
        onlineConsultation: true,
        distance: null,
      },
    ],
  },

  dermatology: {
    name: { en: "Dermatologist", ur: "جلدی امراض کا ڈاکٹر" },
    specialty: {
      en: "Skin, Hair & Nail Diseases",
      ur: "جلد، بال اور ناخن کی بیماریاں",
    },
    conditions: [
      "skin_rash",
      "allergies",
      "acne",
      "skin_infections",
      "eczema",
      "psoriasis",
      "hair_loss",
    ],
    doctors: [
      {
        id: 13,
        name: "Dr. Hina Altaf",
        qualification: "MBBS, FCPS Dermatology, DDV",
        experience: "9 years",
        hospital: "Hameed Latif Hospital",
        location: "Lahore",
        coordinates: { lat: 31.4504, lng: 74.2669 },
        address: "14 Abubakar Block, New Garden Town, Lahore",
        phone: "+92-42-35777441",
        rating: 4.7,
        reviews: 203,
        consultationFee: 2500,
        availability: ["Tuesday", "Thursday", "Saturday"],
        timeSlots: ["10:00 AM - 2:00 PM", "5:00 PM - 9:00 PM"],
        languages: ["English", "Urdu"],
        specializations: [
          "Cosmetic Dermatology",
          "Pediatric Dermatology",
          "Dermatopathology",
        ],
        verified: true,
        onlineConsultation: true,
        distance: null,
      },
    ],
  },

  oncology: {
    name: { en: "Oncologist", ur: "کینسر کا ڈاکٹر" },
    specialty: { en: "Cancer Treatment", ur: "کینسر کا علاج" },
    conditions: ["cancer", "tumors", "chemotherapy", "radiation_therapy"],
    doctors: [
      {
        id: 14,
        name: "Dr. Asim Jamal",
        qualification: "MBBS, FCPS Oncology, MD",
        experience: "17 years",
        hospital: "Shaukat Khanum Memorial Cancer Hospital",
        location: "Lahore",
        coordinates: { lat: 31.5164, lng: 74.3493 },
        address: "7A Block R-3 M.A. Johar Town, Lahore",
        phone: "+92-42-35905000",
        rating: 4.9,
        reviews: 289,
        consultationFee: 5500,
        availability: ["Monday", "Wednesday", "Friday"],
        timeSlots: ["8:00 AM - 12:00 PM", "2:00 PM - 6:00 PM"],
        languages: ["English", "Urdu"],
        specializations: [
          "Breast Cancer",
          "Lung Cancer",
          "Hematological Malignancies",
        ],
        verified: true,
        onlineConsultation: false,
        distance: null,
      },
    ],
  },

  generalMedicine: {
    name: { en: "General Physician", ur: "عام ڈاکٹر" },
    specialty: {
      en: "General Medicine & Family Care",
      ur: "عام طب اور خاندانی نگہداشت",
    },
    conditions: [
      "fever",
      "common_cold",
      "general_checkup",
      "minor_ailments",
      "flu",
      "infections",
    ],
    doctors: [
      {
        id: 15,
        name: "Dr. Hassan Raza",
        qualification: "MBBS, FCPS Medicine, MRCP",
        experience: "13 years",
        hospital: "Lahore Medical Complex",
        location: "Lahore",
        coordinates: { lat: 31.5656, lng: 74.3141 },
        address: "Ferozpur Road, Lahore",
        phone: "+92-42-99211221",
        rating: 4.4,
        reviews: 187,
        consultationFee: 1500,
        availability: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        timeSlots: ["9:00 AM - 1:00 PM", "4:00 PM - 8:00 PM"],
        languages: ["English", "Urdu", "Punjabi"],
        specializations: [
          "Family Medicine",
          "Preventive Care",
          "Chronic Disease Management",
        ],
        verified: true,
        onlineConsultation: true,
        distance: null,
      },
      {
        id: 16,
        name: "Dr. Rabia Jamil",
        qualification: "MBBS, MD Medicine",
        experience: "6 years",
        hospital: "Al-Shifa Trust Hospital",
        location: "Rawalpindi",
        coordinates: { lat: 33.6007, lng: 73.0679 },
        address: "G.T Road, Rawalpindi",
        phone: "+92-51-4443151",
        rating: 4.3,
        reviews: 124,
        consultationFee: 1200,
        availability: ["Monday", "Wednesday", "Friday", "Saturday"],
        timeSlots: ["10:00 AM - 2:00 PM", "5:00 PM - 9:00 PM"],
        languages: ["English", "Urdu"],
        specializations: [
          "Internal Medicine",
          "Geriatric Care",
          "Women's Health",
        ],
        verified: true,
        onlineConsultation: true,
        distance: null,
      },
    ],
  },
};

// ------------------------- COMPONENT -----------------------------

const FindDoctorPage: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [doctorSearchResults, setDoctorSearchResults] = useState<
    DoctorWithMeta[]
  >([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortBy>("rating");

  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: "",
    max: "",
  });

  const [selectedDoctor, setSelectedDoctor] = useState<DoctorWithMeta | null>(
    null
  );

  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [nearbyDoctors, setNearbyDoctors] = useState<DoctorWithMeta[]>([]);
  const [mapCenter, setMapCenter] = useState<Coordinates>({
    lat: 31.5804,
    lng: 74.3587,
  });
  const [selectedRadius, setSelectedRadius] = useState<number>(10);

  // --------- helpers ---------

  const sanitizeFeeInput = (value: string): string => {
    let v = value.replace(/[^\d]/g, "");
    v = v.replace(/^0+(?=\d)/, "");
    return v;
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 100) / 100;
  };

  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setMapCenter(location);
        setIsLoadingLocation(false);
        findNearbyDoctors(location);
      },
      (error) => {
        let errorMessage = "Unable to retrieve location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000,
      }
    );
  };

  const findNearbyDoctors = (location: Coordinates) => {
    const nearbyList: DoctorWithMeta[] = [];

    Object.keys(doctorDatabase).forEach((specialtyKey) => {
      const specialtyData = doctorDatabase[specialtyKey];
      specialtyData.doctors.forEach((doctor) => {
        const distance = calculateDistance(
          location.lat,
          location.lng,
          doctor.coordinates.lat,
          doctor.coordinates.lng
        );

        if (distance <= selectedRadius) {
          nearbyList.push({
            ...doctor,
            distance,
            specialty: specialtyData.name,
            specialtyKey,
          });
        }
      });
    });

    nearbyList.sort(
      (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity)
    );
    setNearbyDoctors(nearbyList);
  };

  const getDirections = (doctor: DoctorWithMeta) => {
    if (userLocation && doctor.coordinates) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${doctor.coordinates.lat},${doctor.coordinates.lng}`;
      window.open(url, "_blank");
    } else if (doctor.address) {
      const url = `https://www.google.com/maps/search/${encodeURIComponent(
        doctor.address + ", " + doctor.location
      )}`;
      window.open(url, "_blank");
    }
  };

  // -------------- MAIN SEARCH LOGIC (fixed) -----------------

  const searchDoctors = () => {
    let results: DoctorWithMeta[] = [];

    // 1) Normalize query
    const normalizedQuery = searchQuery.trim().toLowerCase();

    // 2) Map "reason words" to specialties
    let specialtiesFromReason: string[] = [];

    if (normalizedQuery.includes("blood pressure") || normalizedQuery === "bp") {
      specialtiesFromReason = ["cardiology", "endocrinology", "generalMedicine"];
    } else if (
      normalizedQuery.includes("fever") ||
      normalizedQuery.includes("flu")
    ) {
      specialtiesFromReason = ["generalMedicine", "pulmonology"];
    } else if (normalizedQuery.includes("chest pain")) {
      specialtiesFromReason = ["cardiology", "pulmonology"];
    } else if (
      normalizedQuery.includes("diabetes") ||
      normalizedQuery.includes("sugar")
    ) {
      specialtiesFromReason = ["endocrinology"];
    } else if (
      normalizedQuery.includes("stomach") ||
      normalizedQuery.includes("abdomen")
    ) {
      specialtiesFromReason = ["gastroenterology", "generalMedicine"];
    } else if (
      normalizedQuery.includes("headache") ||
      normalizedQuery.includes("migraine")
    ) {
      specialtiesFromReason = ["neurology", "generalMedicine", "psychiatry"];
    }

    // 3) Base list — either selected specialty or all
    if (selectedSpecialty && doctorDatabase[selectedSpecialty]) {
      const specialtyData = doctorDatabase[selectedSpecialty];
      results = specialtyData.doctors.map<DoctorWithMeta>((doctor) => ({
        ...doctor,
        specialty: specialtyData.name,
        specialtyKey: selectedSpecialty,
      }));
    } else {
      Object.keys(doctorDatabase).forEach((specialtyKey) => {
        const specialtyData = doctorDatabase[specialtyKey];
        const docsForSpecialty = specialtyData.doctors.map<DoctorWithMeta>(
          (doctor) => ({
            ...doctor,
            specialty: specialtyData.name,
            specialtyKey,
          })
        );
        results.push(...docsForSpecialty);
      });
    }

    // 4) Restrict to specialties from "reason" if any
    if (specialtiesFromReason.length > 0) {
      results = results.filter((doctor) =>
        specialtiesFromReason.includes(doctor.specialtyKey)
      );
    }

    // 5) Add distance if we have location
    if (userLocation) {
      results = results.map((doctor) => ({
        ...doctor,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          doctor.coordinates.lat,
          doctor.coordinates.lng
        ),
      }));
    }

    // 6) City filter (with fallback if no match)
    if (selectedLocation) {
      const loc = selectedLocation.toLowerCase();
      const byCity = results.filter((doctor) =>
        doctor.location.toLowerCase().includes(loc)
      );
      if (byCity.length > 0) {
        results = byCity;
      }
    }

    // 7) Generic free-text filter (ONLY when query is not a mapped reason)
    if (normalizedQuery && specialtiesFromReason.length === 0) {
      results = results.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(normalizedQuery) ||
          doctor.hospital.toLowerCase().includes(normalizedQuery) ||
          doctor.specializations.some((spec) =>
            spec.toLowerCase().includes(normalizedQuery)
          ) ||
          doctor.qualification.toLowerCase().includes(normalizedQuery)
      );
    }

    // 8) Fee range
    const minFee = priceRange.min ? parseInt(priceRange.min, 10) : 0;
    const maxFee = priceRange.max
      ? parseInt(priceRange.max, 10)
      : Number.POSITIVE_INFINITY;

    results = results.filter(
      (doctor) =>
        doctor.consultationFee >= minFee &&
        doctor.consultationFee <= maxFee
    );

    // 9) Sorting
    switch (sortBy) {
      case "distance":
        if (userLocation) {
          results.sort(
            (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity)
          );
        }
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "experience":
        results.sort(
          (a, b) => parseInt(b.experience, 10) - parseInt(a.experience, 10)
        );
        break;
      case "price_low":
        results.sort((a, b) => a.consultationFee - b.consultationFee);
        break;
      case "price_high":
        results.sort((a, b) => b.consultationFee - a.consultationFee);
        break;
      case "reviews":
        results.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        results.sort((a, b) => b.rating - a.rating);
    }

    setDoctorSearchResults(results);
  };

  // --------- EFFECTS ---------

  // Read filters from HomePage (sessionStorage)
  useEffect(() => {
    try {
      const storedCity = sessionStorage.getItem("sehatHub-findDoctor-city");
      const storedQuery = sessionStorage.getItem("sehatHub-findDoctor-query");

      if (storedCity) {
        setSelectedLocation(storedCity.toLowerCase());
      }
      if (storedQuery) {
        setSearchQuery(storedQuery);
      }
    } catch {
      // ignore if sessionStorage not available
    }
  }, []);

  // Run search when any filter changes
  useEffect(() => {
    searchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedSpecialty,
    selectedLocation,
    searchQuery,
    sortBy,
    priceRange,
    userLocation,
  ]);

  // Update nearby when location / radius changes
  useEffect(() => {
    if (userLocation) {
      findNearbyDoctors(userLocation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, selectedRadius]);

  // --------------- RENDER DOCTOR CARD -----------------

  const renderDoctorCard = (doctor: DoctorWithMeta, index: number) => (
    <div
      key={doctor.id ?? index}
      className="bg-white/90 backdrop-blur rounded-2xl shadow-md hover:shadow-xl border border-slate-100 transition-all p-5 sm:p-6"
    >
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h4 className="text-lg sm:text-xl font-bold text-gray-800">
                  {doctor.name}
                </h4>
                {doctor.verified && (
                  <div className="flex items-center bg-green-100 px-2 py-0.5 rounded-full">
                    <CheckCircle className="text-green-600 mr-1" size={12} />
                    <span className="text-[11px] font-medium text-green-700">
                      Verified
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm sm:text-base text-blue-600 font-semibold mb-1">
                {doctor.specialty[currentLanguage]}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                {doctor.qualification}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mb-2">
                <div className="flex items-center">
                  <Star className="text-yellow-500 mr-1" size={16} />
                  <span className="font-semibold text-gray-800 mr-1">
                    {doctor.rating}
                  </span>
                  <span className="text-gray-600">
                    ({doctor.reviews} reviews)
                  </span>
                </div>
                {doctor.onlineConsultation && (
                  <span className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[11px] font-medium">
                    Online Available
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <Building className="mr-2 text-gray-400" size={16} />
                <span className="font-medium">{doctor.hospital}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="mr-2 text-gray-400" size={16} />
                <span>{doctor.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Award className="mr-2 text-gray-400" size={16} />
                <span>{doctor.experience} experience</span>
              </div>
              {doctor.distance != null && (
                <div className="flex items-center text-gray-600">
                  <Route className="mr-2 text-green-500" size={16} />
                  <span className="font-medium text-green-600">
                    {doctor.distance} km away
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <DollarSign className="mr-2 text-gray-400" size={16} />
                <span className="font-medium">
                  Rs. {doctor.consultationFee} consultation
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="mr-2 text-gray-400" size={16} />
                <span>{doctor.phone}</span>
              </div>
              {doctor.address && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-2 text-gray-400" size={16} />
                  <span>{doctor.address}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">
              Specializations:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {doctor.specializations.map((spec, idx) => (
                <span
                  key={idx}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">
              Available Days:
            </p>
            <div className="flex flex-wrap gap-1.5 mb-1">
              {doctor.availability.map((day, idx) => (
                <span
                  key={idx}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium"
                >
                  {day}
                </span>
              ))}
            </div>
            <div className="text-[11px] sm:text-xs text-gray-600">
              {doctor.timeSlots.join(" | ")}
            </div>
          </div>

          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
              Languages:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {doctor.languages.map((lang, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-[11px] sm:text-xs"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3">
          <button
            onClick={() => setSelectedDoctor(doctor)}
            className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <User size={18} />
            View Profile
          </button>

          <a
            href={`tel:${doctor.phone}`}
            className="w-full bg-green-600 text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
          >
            <Phone size={18} />
            Call Now
          </a>

          <button className="w-full bg-purple-600 text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2">
            <Calendar size={18} />
            Book Appointment
          </button>

          {doctor.onlineConsultation && (
            <button className="w-full bg-indigo-600 text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
              <Activity size={18} />
              Online Consult
            </button>
          )}

          <button
            onClick={() => getDirections(doctor)}
            className="w-full bg-gray-100 text-gray-700 py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <Navigation size={18} />
            Get Directions
          </button>
        </div>
      </div>
    </div>
  );

  // ------------------- JSX -------------------

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-4 sm:mb-5">
            <div className="w-16 h-16 sm:w-18 sm:h-18 bg-blue-100 rounded-full flex items-center justify-center shadow-inner">
              <Users className="text-blue-600" size={32} />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1">
                {currentLanguage === "en"
                  ? "Find Healthcare Specialists"
                  : "ہیلتھ کیئر ماہرین تلاش کریں"}
              </h1>
              <p className="text-sm sm:text-lg text-gray-600">
                {currentLanguage === "en"
                  ? "Connect with qualified doctors across Pakistan"
                  : "پاکستان بھر میں قابل ڈاکٹرز سے رابطہ کریں"}
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setCurrentLanguage(
                currentLanguage === "en" ? "ur" : ("en" as Language)
              )
            }
            className="inline-flex items-center gap-2 mb-2 sm:mb-0 px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-all text-sm font-medium"
          >
            {currentLanguage === "en" ? "اردو میں" : "English"}
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl shadow-lg border border-slate-100 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              {currentLanguage === "en"
                ? "Search & Filter Doctors"
                : "ڈاکٹرز کو سرچ اور فلٹر کریں"}
            </h2>
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="self-start sm:self-auto flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
            >
              <Filter size={18} />
              {currentLanguage === "en" ? "Filters" : "فلٹرز"}
              {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {/* Search bar */}
          <div className="mb-5 sm:mb-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder={
                  currentLanguage === "en"
                    ? "Search by doctor name, hospital, or specialization..."
                    : "ڈاکٹر کے نام، ہسپتال، یا تخصص کے ذریعے تلاش کریں..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                dir="auto"
              />
            </div>
          </div>

          {/* Basic filters */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                {currentLanguage === "en" ? "Medical Specialty" : "طبی تخصص"}
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">
                  {currentLanguage === "en"
                    ? "All Specialties"
                    : "تمام تخصصات"}
                </option>
                {Object.keys(doctorDatabase).map((key) => (
                  <option key={key} value={key}>
                    {doctorDatabase[key].name[currentLanguage]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                {currentLanguage === "en" ? "Location/City" : "مقام/شہر"}
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">
                  {currentLanguage === "en" ? "All Cities" : "تمام شہر"}
                </option>
                <option value="lahore">Lahore</option>
                <option value="karachi">Karachi</option>
                <option value="rawalpindi">Rawalpindi</option>
                <option value="islamabad">Islamabad</option>
                <option value="faisalabad">Faisalabad</option>
                <option value="multan">Multan</option>
                <option value="peshawar">Peshawar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                {currentLanguage === "en" ? "Sort By" : "ترتیب دیں"}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="rating">
                  {currentLanguage === "en"
                    ? "Highest Rating"
                    : "سب سے زیادہ ریٹنگ"}
                </option>
                {userLocation && (
                  <option value="distance">
                    {currentLanguage === "en"
                      ? "Nearest First"
                      : "سب سے قریب پہلے"}
                  </option>
                )}
                <option value="experience">
                  {currentLanguage === "en"
                    ? "Most Experienced"
                    : "سب سے زیادہ تجربہ کار"}
                </option>
                <option value="price_low">
                  {currentLanguage === "en" ? "Lowest Fee" : "کم سے کم فیس"}
                </option>
                <option value="price_high">
                  {currentLanguage === "en" ? "Highest Fee" : "سب سے زیادہ فیس"}
                </option>
                <option value="reviews">
                  {currentLanguage === "en"
                    ? "Most Reviews"
                    : "سب سے زیادہ جائزے"}
                </option>
              </select>
            </div>
          </div>

          {/* Location section */}
          <div className="bg-blue-50/90 p-4 sm:p-5 rounded-2xl border border-blue-200 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 text-sm sm:text-base">
                    {currentLanguage === "en"
                      ? "Find Nearest Doctors"
                      : "قریب ترین ڈاکٹرز تلاش کریں"}
                  </h4>
                  <p className="text-xs sm:text-sm text-blue-600">
                    {userLocation
                      ? currentLanguage === "en"
                        ? "Location enabled - showing nearest doctors"
                        : "مقام فعال ہے - قریب ترین ڈاکٹرز دکھائے جا رہے ہیں"
                      : currentLanguage === "en"
                      ? "Enable location to find doctors near you"
                      : "اپنے قریب کے ڈاکٹرز تلاش کرنے کے لیے مقام کو فعال کریں"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {!userLocation && (
                  <button
                    onClick={getUserLocation}
                    disabled={isLoadingLocation}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-all text-sm"
                  >
                    <Locate size={18} />
                    {isLoadingLocation
                      ? currentLanguage === "en"
                        ? "Getting Location..."
                        : "مقام حاصل کر رہے ہیں..."
                      : currentLanguage === "en"
                      ? "Use My Location"
                      : "میرا مقام استعمال کریں"}
                  </button>
                )}

                <button
                  onClick={() => setShowMap((prev) => !prev)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm"
                >
                  <Map size={18} />
                  {showMap
                    ? currentLanguage === "en"
                      ? "Hide Map"
                      : "نقشہ چھپائیں"
                    : currentLanguage === "en"
                    ? "Show Map"
                    : "نقشہ دکھائیں"}
                </button>

                {userLocation && (
                  <div className="flex items-center gap-2">
                    <label className="text-xs sm:text-sm font-medium text-blue-700">
                      {currentLanguage === "en" ? "Radius:" : "دائرہ:"}
                    </label>
                    <select
                      value={selectedRadius}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        setSelectedRadius(value);
                        if (userLocation) findNearbyDoctors(userLocation);
                      }}
                      className="px-3 py-1.5 border border-blue-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value={5}>5 km</option>
                      <option value={10}>10 km</option>
                      <option value={15}>15 km</option>
                      <option value={25}>25 km</option>
                      <option value={50}>50 km</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {locationError && (
              <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded-lg">
                <p className="text-red-700 text-xs sm:text-sm flex items-center gap-2">
                  <AlertTriangle size={16} />
                  {locationError}
                </p>
              </div>
            )}
          </div>

          {/* Map mock */}
          {showMap && (
            <div className="mb-6 bg-white/90 rounded-2xl shadow-md border border-slate-100 p-4">
              <div className="h-80 sm:h-96 bg-gray-100 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Map className="mx-auto mb-2 text-gray-400" size={48} />
                    <p className="text-gray-600 mb-2 text-sm sm:text-base">
                      Interactive Map View
                    </p>
                    <div className="space-y-1.5 text-xs sm:text-sm text-gray-500">
                      <p>
                        Map Center: {mapCenter.lat.toFixed(4)},{" "}
                        {mapCenter.lng.toFixed(4)}
                      </p>
                      {userLocation && (
                        <p className="text-blue-600 font-medium">
                          Your Location: {userLocation.lat.toFixed(4)},{" "}
                          {userLocation.lng.toFixed(4)}
                        </p>
                      )}
                      <p className="text-[11px]">
                        {currentLanguage === "en"
                          ? "In a real implementation, this would show an interactive map with doctor locations marked as pins"
                          : "حقیقی implementation میں، یہ ڈاکٹر کے مقامات کے ساتھ ایک interactive map دکھائے گا"}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute top-4 left-4 bg-red-500 w-3 h-3 rounded-full border-2 border-white shadow-lg"
                  title="Dr. Ahmed Hassan"
                ></div>
                <div
                  className="absolute top-12 right-8 bg-blue-500 w-3 h-3 rounded-full border-2 border-white shadow-lg"
                  title="Dr. Muhammad Ali"
                ></div>
                <div
                  className="absolute bottom-8 left-12 bg-green-500 w-3 h-3 rounded-full border-2 border-white shadow-lg"
                  title="Dr. Rizwan Ahmad"
                ></div>
                {userLocation && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-blue-600 w-4 h-4 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                    <div className="absolute -bottom-6 -left-8 bg-blue-600 text-white px-2 py-1 rounded text-[10px] whitespace-nowrap">
                      Your Location
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                  <span className="text-gray-700">Cardiologists</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                  <span className="text-gray-700">Pulmonologists</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  <span className="text-gray-700">General Medicine</span>
                </div>
                {userLocation && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                    <span className="text-blue-700 font-medium">
                      Your Location
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Nearby doctors */}
          {userLocation && nearbyDoctors.length > 0 && (
            <div className="bg-green-50/90 p-5 sm:p-6 rounded-2xl border border-green-200 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-green-800 flex items-center gap-2">
                  <Navigation className="text-green-600" size={20} />
                  {currentLanguage === "en"
                    ? `Doctors Near You (${nearbyDoctors.length})`
                    : `آپ کے قریب ڈاکٹرز (${nearbyDoctors.length})`}
                </h3>
                <span className="text-xs sm:text-sm text-green-700">
                  {currentLanguage === "en"
                    ? `Within ${selectedRadius} km`
                    : `${selectedRadius} کلومیٹر کے اندر`}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {nearbyDoctors.slice(0, 4).map((doctor) => (
                  <div
                    key={doctor.id}
                    className="bg-white/90 p-4 rounded-xl border border-green-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">
                          {doctor.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-green-600 font-medium mb-1">
                          {doctor.specialty[currentLanguage]}
                        </p>
                        <p className="text-[11px] sm:text-xs text-gray-600 mb-2">
                          {doctor.hospital}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                          <div className="flex items-center gap-1">
                            <Route className="text-green-500" size={12} />
                            <span className="font-medium">
                              {doctor.distance} km
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="text-yellow-500" size={12} />
                            <span>{doctor.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="text-gray-400" size={12} />
                            <span>Rs. {doctor.consultationFee}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedDoctor(doctor)}
                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-700 transition-all"
                      >
                        {currentLanguage === "en" ? "View" : "دیکھیں"}
                      </button>
                      <a
                        href={`tel:${doctor.phone}`}
                        className="flex items-center justify-center bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all"
                      >
                        <Phone size={16} />
                      </a>
                      <button
                        onClick={() => getDirections(doctor)}
                        className="flex items-center justify-center bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-all"
                        title={
                          currentLanguage === "en"
                            ? "Get Directions"
                            : "سمت حاصل کریں"
                        }
                      >
                        <Navigation size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {nearbyDoctors.length > 4 && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => {
                      setSortBy("distance");
                      setShowMap(false);
                    }}
                    className="text-green-700 hover:text-green-800 font-medium text-xs sm:text-sm"
                  >
                    {currentLanguage === "en"
                      ? `View all ${nearbyDoctors.length} nearby doctors`
                      : `تمام ${nearbyDoctors.length} قریبی ڈاکٹرز دیکھیں`}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Advanced filters */}
          {showFilters && (
            <div className="border-t border-slate-200 pt-5 sm:pt-6 mt-2">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">
                    {currentLanguage === "en"
                      ? "Consultation Fee Range"
                      : "مشاورے کی فیس کی حد"}
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            min: sanitizeFeeInput(e.target.value),
                          }))
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <span className="text-gray-500 text-xs sm:text-sm">
                        to
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            max: sanitizeFeeInput(e.target.value),
                          }))
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Rs. {priceRange.min || 0}</span>
                      <span>Rs. {priceRange.max || 10000}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">
                    {currentLanguage === "en"
                      ? "Additional Filters"
                      : "اضافی فلٹرز"}
                  </label>
                  <div className="space-y-2.5">
                    <label className="flex items-center text-xs sm:text-sm text-gray-700">
                      <input type="checkbox" className="mr-2" />
                      {currentLanguage === "en"
                        ? "Online Consultation Available"
                        : "آن لائن مشاورہ دستیاب"}
                    </label>
                    <label className="flex items-center text-xs sm:text-sm text-gray-700">
                      <input type="checkbox" className="mr-2" />
                      {currentLanguage === "en"
                        ? "Verified Doctors Only"
                        : "صرف تصدیق شدہ ڈاکٹرز"}
                    </label>
                    <label className="flex items-center text-xs sm:text-sm text-gray-700">
                      <input type="checkbox" className="mr-2" />
                      {currentLanguage === "en"
                        ? "Available Today"
                        : "آج دستیاب"}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {currentLanguage === "en" ? "Search Results" : "تلاش کے نتائج"} (
            {doctorSearchResults.length})
          </h3>
        </div>

        {/* Doctor cards */}
        <div className="space-y-5 sm:space-y-6 mb-8">
          {doctorSearchResults.length > 0 ? (
            doctorSearchResults.map((doctor, index) =>
              renderDoctorCard(doctor, index)
            )
          ) : (
            <div className="text-center py-10 sm:py-12 bg-white/90 rounded-2xl shadow-md border border-slate-100">
              <Users className="mx-auto mb-3 sm:mb-4 text-gray-400" size={48} />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-1.5">
                {currentLanguage === "en"
                  ? "No doctors found"
                  : "کوئی ڈاکٹر نہیں ملا"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                {currentLanguage === "en"
                  ? "Try adjusting your search criteria or filters"
                  : "اپنے تلاش کے معیار یا فلٹرز کو تبدیل کرنے کی کوشش کریں"}
              </p>
            </div>
          )}
        </div>

        {/* Quick access by specialty */}
        <div className="bg-white/90 backdrop-blur p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-100 mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-5 sm:mb-6 text-center">
            {currentLanguage === "en"
              ? "Browse by Medical Specialty"
              : "طبی تخصص کے ذریعے براؤز کریں"}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {Object.keys(doctorDatabase).map((key) => {
              const specialty = doctorDatabase[key];
              const iconMap: Record<string, React.ComponentType<any>> = {
                cardiology: Heart,
                pulmonology: Activity,
                neurology: Brain,
                gastroenterology: Activity,
                endocrinology: Thermometer,
                orthopedics: Activity,
                psychiatry: Brain,
                dermatology: User,
                oncology: AlertTriangle,
                generalMedicine: Stethoscope,
              };
              const IconComponent = iconMap[key] || Stethoscope;

              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedSpecialty(key);
                    setSearchQuery("");
                  }}
                  className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl transition-all text-center group border border-blue-100 hover:border-blue-200 shadow-sm hover:shadow-md"
                >
                  <IconComponent
                    className="mx-auto mb-2.5 sm:mb-3 text-blue-600 group-hover:text-blue-700"
                    size={28}
                  />
                  <div className="font-medium text-gray-800 mb-0.5 text-xs sm:text-sm leading-tight">
                    {specialty.name[currentLanguage]}
                  </div>
                  <div className="text-[11px] sm:text-xs text-blue-600 font-medium">
                    {specialty.doctors.length}{" "}
                    {currentLanguage === "en" ? "doctors" : "ڈاکٹرز"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Emergency contacts */}
        <div className="bg-red-50/90 border border-red-200 p-6 sm:p-8 rounded-3xl mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-5 sm:mb-6 flex items-center justify-center gap-2">
            <AlertTriangle className="text-red-600" />
            {currentLanguage === "en"
              ? "Emergency Medical Contacts"
              : "ایمرجنسی طبی رابطے"}
          </h3>

          <div className="grid md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white/90 p-5 rounded-2xl border border-red-200 text-center shadow-sm">
              <Phone className="mx-auto mb-2.5 text-red-600" size={28} />
              <div className="font-bold text-red-800 mb-0.5 text-sm sm:text-base">
                Emergency Services
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-0.5">
                1122
              </div>
              <div className="text-xs sm:text-sm text-red-600">
                24/7 Emergency
              </div>
            </div>

            <div className="bg-white/90 p-5 rounded-2xl border border-red-200 text-center shadow-sm">
              <Building className="mx-auto mb-2.5 text-red-600" size={28} />
              <div className="font-bold text-red-800 mb-0.5 text-sm sm:text-base">
                Poison Control
              </div>
              <div className="text-xl sm:text-2xl font-bold text-red-600 mb-0.5">
                1166
              </div>
              <div className="text-xs sm:text-sm text-red-600">
                Poison Help
              </div>
            </div>

            <div className="bg-white/90 p-5 rounded-2xl border border-red-200 text-center shadow-sm">
              <Heart className="mx-auto mb-2.5 text-red-600" size={28} />
              <div className="font-bold text-red-800 mb-0.5 text-sm sm:text-base">
                Ambulance
              </div>
              <div className="text-xl sm:text-2xl font-bold text-red-600 mb-0.5">
                115
              </div>
              <div className="text-xs sm:text-sm text-red-600">
                Medical Transport
              </div>
            </div>

            <div className="bg-white/90 p-5 rounded-2xl border border-red-200 text-center shadow-sm">
              <AlertTriangle
                className="mx-auto mb-2.5 text-red-600"
                size={28}
              />
              <div className="font-bold text-red-800 mb-0.5 text-sm sm:text-base">
                Police
              </div>
              <div className="text-xl sm:text-2xl font-bold text-red-600 mb-0.5">
                15
              </div>
              <div className="text-xs sm:text-sm text-red-600">
                Emergency Police
              </div>
            </div>
          </div>
        </div>

        {/* Popular hospitals */}
        <div className="bg-white/90 p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-100">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-5 sm:mb-6">
            {currentLanguage === "en"
              ? "Popular Hospitals & Medical Centers"
              : "مشہور ہسپتال اور طبی مراکز"}
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                name: "Shaukat Khanum Memorial Cancer Hospital",
                location: "Lahore",
                type: "Cancer Specialist",
                phone: "+92-42-35905000",
              },
              {
                name: "Aga Khan University Hospital",
                location: "Karachi",
                type: "Multi-specialty",
                phone: "+92-21-34864000",
              },
              {
                name: "Services Hospital",
                location: "Lahore",
                type: "Government Hospital",
                phone: "+92-42-99231441",
              },
              {
                name: "Mayo Hospital",
                location: "Lahore",
                type: "Government Hospital",
                phone: "+92-42-99212011",
              },
              {
                name: "Combined Military Hospital",
                location: "Rawalpindi",
                type: "Military Hospital",
                phone: "+92-51-9270012",
              },
              {
                name: "Ziauddin Hospital",
                location: "Karachi",
                type: "Private Hospital",
                phone: "+92-21-35862937",
              },
            ].map((hospital, index) => (
              <div
                key={index}
                className="p-4 sm:p-5 border border-gray-200 rounded-2xl bg-white/90 hover:shadow-md transition-all"
              >
                <h4 className="font-semibold text-gray-800 mb-1.5 text-sm sm:text-base">
                  {hospital.name}
                </h4>
                <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="mr-2" size={14} />
                    {hospital.location}
                  </div>
                  <div className="flex items-center">
                    <Building className="mr-2" size={14} />
                    {hospital.type}
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-2" size={14} />
                    {hospital.phone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor profile modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-800">
                    Doctor Profile
                  </h3>
                  <button
                    onClick={() => setSelectedDoctor(null)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-5 sm:space-y-6">
                  <div className="text-center">
                    <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-1.5">
                      {selectedDoctor.name}
                    </h4>
                    <p className="text-sm sm:text-base text-blue-600 font-medium mb-3">
                      {selectedDoctor.specialty[currentLanguage]}
                    </p>
                    <div className="flex items-center justify-center mb-3 sm:mb-4">
                      <Star className="text-yellow-500 mr-1" size={20} />
                      <span className="text-base sm:text-lg font-semibold text-gray-800 mr-1">
                        {selectedDoctor.rating}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600">
                        ({selectedDoctor.reviews} reviews)
                      </span>
                    </div>
                    {selectedDoctor.distance != null && (
                      <div className="flex items-center justify-center mb-3 sm:mb-4 text-sm">
                        <Route className="text-green-500 mr-1" size={16} />
                        <span className="text-green-600 font-medium">
                          {selectedDoctor.distance} km away
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Qualification:</span>{" "}
                        {selectedDoctor.qualification}
                      </p>
                      <p>
                        <span className="font-medium">Experience:</span>{" "}
                        {selectedDoctor.experience}
                      </p>
                      <p>
                        <span className="font-medium">Hospital:</span>{" "}
                        {selectedDoctor.hospital}
                      </p>
                      <p>
                        <span className="font-medium">Location:</span>{" "}
                        {selectedDoctor.location}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Fee:</span> Rs.{" "}
                        {selectedDoctor.consultationFee}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {selectedDoctor.phone}
                      </p>
                      <p>
                        <span className="font-medium">Online:</span>{" "}
                        {selectedDoctor.onlineConsultation
                          ? "Available"
                          : "Not Available"}
                      </p>
                      {selectedDoctor.address && (
                        <p>
                          <span className="font-medium">Address:</span>{" "}
                          {selectedDoctor.address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-800 mb-2 text-sm">
                      Specializations:
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDoctor.specializations.map((spec, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-800 mb-2 text-sm">
                      Available Days:
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDoctor.availability.map((day, idx) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                      {selectedDoctor.timeSlots.join(" | ")}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-800 mb-2 text-sm">
                      Languages:
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDoctor.languages.map((lang, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <a
                      href={`tel:${selectedDoctor.phone}`}
                      className="flex-1 bg-green-600 text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-green-700 transition-all text-center"
                    >
                      Call Now
                    </a>
                    <button className="flex-1 bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transition-all">
                      Book Appointment
                    </button>
                    <button
                      onClick={() => getDirections(selectedDoctor)}
                      className="flex items-center justify-center bg-purple-600 text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-purple-700 transition-all"
                      title="Get Directions"
                    >
                      <Navigation size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindDoctorPage;
