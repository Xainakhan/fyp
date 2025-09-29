import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Phone,
  Calendar,
  Filter,
  User,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Zap,
  Shield,
  Award,
  Navigation,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Activity,
  Users,
  MessageSquare,
  Bot,
  RefreshCw,
  Hospital,
  UserCheck,
  Globe,
  Mail,
  X,
} from "lucide-react";

// Mock data for doctors and specializations
const medicalSpecialities = {
  "General Practitioner": { icon: Stethoscope, color: "blue", symptoms: ["fever", "headache", "fatigue", "general checkup"] },
  "Cardiologist": { icon: Heart, color: "red", symptoms: ["chest_pain", "rapid_heartbeat", "shortness_of_breath"] },
  "Neurologist": { icon: Brain, color: "purple", symptoms: ["headache", "dizziness", "seizures", "memory_loss"] },
  "Gastroenterologist": { icon: Activity, color: "green", symptoms: ["abdominal_pain", "nausea", "vomiting", "diarrhea"] },
  "Ophthalmologist": { icon: Eye, color: "indigo", symptoms: ["blurred_vision", "eye_pain", "vision_problems"] },
  "Dermatologist": { icon: Shield, color: "pink", symptoms: ["skin_rash", "itching", "skin_problems"] },
  "Pulmonologist": { icon: Zap, color: "teal", symptoms: ["cough", "shortness_of_breath", "breathing_difficulty"] },
  "Orthopedist": { icon: Award, color: "orange", symptoms: ["joint_pain", "back_pain", "muscle_aches"] },
};

const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.8,
    experience: 15,
    consultationFee: 150,
    location: "Heart Center, Downtown",
    distance: "2.1 km",
    availableSlots: ["2:00 PM", "4:30 PM", "6:00 PM"],
    languages: ["English", "Spanish"],
    qualifications: ["MD", "FACC"],
    phone: "+1 (555) 123-4567",
    email: "dr.johnson@heartcenter.com",
    image: "/api/placeholder/100/100",
    reviews: 342,
    nextAvailable: "Today",
    specializations: ["Heart Disease", "Hypertension", "Arrhythmia"],
    aboutMe: "Experienced cardiologist with expertise in preventive cardiology and heart disease management.",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    rating: 4.9,
    experience: 12,
    consultationFee: 180,
    location: "Neuro Clinic, Medical District",
    distance: "3.5 km",
    availableSlots: ["10:00 AM", "2:00 PM", "5:00 PM"],
    languages: ["English", "Mandarin"],
    qualifications: ["MD", "PhD"],
    phone: "+1 (555) 987-6543",
    email: "dr.chen@neuroclinic.com",
    image: "/api/placeholder/100/100",
    reviews: 289,
    nextAvailable: "Tomorrow",
    specializations: ["Headaches", "Epilepsy", "Stroke"],
    aboutMe: "Board-certified neurologist specializing in comprehensive neurological care and research.",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "General Practitioner",
    rating: 4.7,
    experience: 8,
    consultationFee: 100,
    location: "Family Health Center",
    distance: "1.2 km",
    availableSlots: ["9:00 AM", "11:30 AM", "3:00 PM", "7:00 PM"],
    languages: ["English", "Spanish", "Portuguese"],
    qualifications: ["MD", "MRCGP"],
    phone: "+1 (555) 456-7890",
    email: "dr.rodriguez@familyhealth.com",
    image: "/api/placeholder/100/100",
    reviews: 456,
    nextAvailable: "Today",
    specializations: ["Primary Care", "Preventive Medicine", "Chronic Disease Management"],
    aboutMe: "Dedicated family physician focused on comprehensive primary care for all ages.",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Gastroenterologist",
    rating: 4.6,
    experience: 20,
    consultationFee: 200,
    location: "Digestive Health Institute",
    distance: "4.1 km",
    availableSlots: ["8:00 AM", "1:00 PM", "4:00 PM"],
    languages: ["English", "French"],
    qualifications: ["MD", "FACG"],
    phone: "+1 (555) 234-5678",
    email: "dr.wilson@digestivehealth.com",
    image: "/api/placeholder/100/100",
    reviews: 178,
    nextAvailable: "In 2 days",
    specializations: ["IBD", "Liver Disease", "Endoscopy"],
    aboutMe: "Expert gastroenterologist with extensive experience in digestive disorders and liver diseases.",
  }
];

// Mock chatbot analysis data
const mockChatbotAnalysis = {
  totalConversations: 1247,
  successfulDiagnoses: 1089,
  averageAccuracy: 87.3,
  commonSymptoms: [
    { symptom: "Headache", count: 234, percentage: 18.8 },
    { symptom: "Fever", count: 198, percentage: 15.9 },
    { symptom: "Cough", count: 167, percentage: 13.4 },
    { symptom: "Fatigue", count: 143, percentage: 11.5 },
    { symptom: "Nausea", count: 98, percentage: 7.9 }
  ],
  satisfactionRating: 4.2,
  avgResponseTime: "2.3s",
  voiceUsageRate: 68,
  textUsageRate: 32,
  topDiagnoses: [
    { condition: "Common Cold", count: 156, accuracy: 92 },
    { condition: "Migraine", count: 89, accuracy: 89 },
    { condition: "Flu", count: 67, accuracy: 85 },
    { condition: "Gastroenteritis", count: 45, accuracy: 91 }
  ]
};

const SymptomAnalysisDoctorFinder = () => {
  const [activeTab, setActiveTab] = useState("analysis");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState(mockDoctors);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    email: "",
    reason: ""
  });
  
  // Symptom options for manual entry
  const symptomOptions = [
    "fever", "headache", "cough", "fatigue", "nausea", "chest_pain",
    "shortness_of_breath", "abdominal_pain", "diarrhea", "vomiting",
    "muscle_aches", "sore_throat", "runny_nose", "dizziness", "joint_pain",
    "back_pain", "skin_rash", "itching", "blurred_vision", "rapid_heartbeat"
  ];

  // Filter doctors based on symptoms and other criteria
  useEffect(() => {
    let filtered = [...mockDoctors];

    // Filter by symptoms
    if (selectedSymptoms.length > 0) {
      filtered = filtered.filter(doctor => {
        const specialtyInfo = medicalSpecialities[doctor.specialty];
        if (!specialtyInfo) return false;
        return selectedSymptoms.some(symptom => 
          specialtyInfo.symptoms.some(s => s.includes(symptom) || symptom.includes(s))
        );
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specialty
    if (selectedSpecialty !== "all") {
      filtered = filtered.filter(doctor => doctor.specialty === selectedSpecialty);
    }

    // Sort doctors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "experience":
          return b.experience - a.experience;
        case "fee":
          return a.consultationFee - b.consultationFee;
        case "distance":
          return parseFloat(a.distance) - parseFloat(b.distance);
        default:
          return b.rating - a.rating;
      }
    });

    setFilteredDoctors(filtered);
  }, [selectedSymptoms, searchTerm, selectedSpecialty, sortBy]);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const getRecommendedSpecialty = (symptoms) => {
    const specialtyScores = {};
    
    symptoms.forEach(symptom => {
      Object.entries(medicalSpecialities).forEach(([specialty, info]) => {
        if (info.symptoms.some(s => s.includes(symptom) || symptom.includes(s))) {
          specialtyScores[specialty] = (specialtyScores[specialty] || 0) + 1;
        }
      });
    });

    const topSpecialty = Object.entries(specialtyScores)
      .sort(([,a], [,b]) => b - a)[0];
    
    return topSpecialty ? topSpecialty[0] : "General Practitioner";
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // Simulate booking process
    alert(`Appointment booked successfully with ${selectedDoctor?.name} at ${selectedSlot}!`);
    setShowBookingModal(false);
    setBookingForm({ name: "", phone: "", email: "", reason: "" });
    setSelectedSlot("");
  };

  const BookingModal = () => {
    if (!showBookingModal || !selectedDoctor) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Book Appointment</h3>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Doctor Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{selectedDoctor.name}</h4>
                  <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                  <p className="text-sm font-medium text-blue-600">${selectedDoctor.consultationFee} consultation</p>
                </div>
              </div>
            </div>

            {/* Available Slots */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Available Time Slots:</label>
              <div className="grid grid-cols-2 gap-2">
                {selectedDoctor.availableSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      selectedSlot === slot
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                <textarea
                  value={bookingForm.reason}
                  onChange={(e) => setBookingForm({...bookingForm, reason: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of your concern..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedSlot}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const AnalysisTab = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-white/20 rounded-xl">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Chatbot Performance Analysis</h2>
            <p className="text-blue-100 mt-2">Comprehensive insights into RoboDoc's diagnostic accuracy and user engagement</p>
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-blue-200" />
              <span className="text-sm text-blue-200">Total Consultations</span>
            </div>
            <div className="text-2xl font-bold">{mockChatbotAnalysis.totalConversations.toLocaleString()}</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-200" />
              <span className="text-sm text-blue-200">Success Rate</span>
            </div>
            <div className="text-2xl font-bold">{mockChatbotAnalysis.averageAccuracy}%</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-200" />
              <span className="text-sm text-blue-200">Avg Response</span>
            </div>
            <div className="text-2xl font-bold">{mockChatbotAnalysis.avgResponseTime}</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-5 h-5 text-yellow-200" />
              <span className="text-sm text-blue-200">Satisfaction</span>
            </div>
            <div className="text-2xl font-bold">{mockChatbotAnalysis.satisfactionRating}/5</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Common Symptoms */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Most Common Symptoms</h3>
          </div>
          
          <div className="space-y-4">
            {mockChatbotAnalysis.commonSymptoms.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900 capitalize">{item.symptom}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage * 5}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-600 w-12">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Communication Preferences</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">Voice Communication</span>
                <span className="font-bold text-green-600">{mockChatbotAnalysis.voiceUsageRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${mockChatbotAnalysis.voiceUsageRate}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">Text Communication</span>
                <span className="font-bold text-blue-600">{mockChatbotAnalysis.textUsageRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${mockChatbotAnalysis.textUsageRate}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mt-4">
              <p className="text-sm text-gray-700">
                <strong className="text-green-600">68%</strong> of users prefer voice communication for faster symptom reporting and more natural interaction.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Diagnoses Accuracy */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Activity className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Diagnostic Accuracy by Condition</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockChatbotAnalysis.topDiagnoses.map((diagnosis, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{diagnosis.condition}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  diagnosis.accuracy >= 90 ? 'bg-green-100 text-green-700' :
                  diagnosis.accuracy >= 85 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {diagnosis.accuracy}%
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{diagnosis.count}</div>
              <div className="text-sm text-gray-600">cases analyzed</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DoctorFinderTab = () => (
    <div className="space-y-8">
      {/* Header & Symptom Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Search className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Find the Right Doctor</h2>
            <p className="text-gray-600 mt-1">Select your symptoms to get matched with the best specialists</p>
          </div>
        </div>

        {/* Symptom Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Your Symptoms:</label>
          <div className="flex flex-wrap gap-2">
            {symptomOptions.map((symptom) => (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedSymptoms.includes(symptom)
                    ? 'bg-blue-500 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {symptom.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Specialty */}
        {selectedSymptoms.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">
                Recommended Specialty: <span className="text-blue-600">{getRecommendedSpecialty(selectedSymptoms)}</span>
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Based on your symptoms, we recommend consulting with a {getRecommendedSpecialty(selectedSymptoms).toLowerCase()}.
            </p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search doctors, specialties, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-3">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Specialties</option>
              {Object.keys(medicalSpecialities).map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="rating">Sort by Rating</option>
              <option value="experience">Sort by Experience</option>
              <option value="fee">Sort by Fee</option>
              <option value="distance">Sort by Distance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDoctors.map((doctor) => {
          const SpecialtyIcon = medicalSpecialities[doctor.specialty]?.icon || Stethoscope;
          const specialtyColor = medicalSpecialities[doctor.specialty]?.color || 'blue';
          
          return (
            <div key={doctor.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                      <UserCheck className="w-8 h-8 text-gray-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                      {doctor.rating >= 4.5 && (
                        <div className="flex items-center space-x-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{doctor.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <SpecialtyIcon className={`w-4 h-4 text-${specialtyColor}-500`} />
                      <span className="text-sm font-medium text-gray-700">{doctor.specialty}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4" />
                        <span>{doctor.experience} years</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{doctor.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{doctor.nextAvailable}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">${doctor.consultationFee}</span> consultation
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setShowBookingModal(true);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>

                {/* Doctor Details Expandable Section */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Languages:</span>
                      <p className="font-medium text-gray-900">{doctor.languages.join(', ')}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Qualifications:</span>
                      <p className="font-medium text-gray-900">{doctor.qualifications.join(', ')}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className="text-gray-500 text-sm">Specializations:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {doctor.specializations.map((spec, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{doctor.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{doctor.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or symptoms</p>
          <button 
            onClick={() => {
              setSelectedSymptoms([]);
              setSearchTerm("");
              setSelectedSpecialty("all");
            }}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RoboDoc Analytics</h1>
                <p className="text-sm text-gray-600">Medical Analysis & Doctor Finder</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("analysis")}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "analysis"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Analytics Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab("finder")}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "finder"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Find Doctors</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "analysis" ? <AnalysisTab /> : <DoctorFinderTab />}
      </div>

      {/* Booking Modal */}
      <BookingModal />
    </div>
  );
};

export default SymptomAnalysisDoctorFinder;