import React, { useState } from 'react';
import { Activity, AlertCircle, TrendingUp, Calendar, Clock } from 'lucide-react';

interface SymptomEntry {
  id: string;
  symptom: string;
  severity: 'mild' | 'moderate' | 'severe';
  date: string;
  duration: string;
  bodyPart: string;
  relatedSymptoms: string[];
}

interface HealthPrediction {
  risk: 'low' | 'medium' | 'high';
  message: string;
  recommendation: string;
}

const HealthTimeline: React.FC = () => {
  const [symptoms] = useState<SymptomEntry[]>([
    {
      id: '1',
      symptom: 'Headache',
      severity: 'mild',
      date: '2025-11-20',
      duration: '2 days',
      bodyPart: 'head',
      relatedSymptoms: ['dizziness']
    },
    {
      id: '2',
      symptom: 'Fever',
      severity: 'moderate',
      date: '2025-11-22',
      duration: '3 days',
      bodyPart: 'whole body',
      relatedSymptoms: ['fatigue', 'body ache']
    },
    {
      id: '3',
      symptom: 'Chest Pain',
      severity: 'severe',
      date: '2025-11-24',
      duration: '1 day',
      bodyPart: 'chest',
      relatedSymptoms: ['shortness of breath', 'anxiety']
    }
  ]);

  const [prediction] = useState<HealthPrediction>({
    risk: 'medium',
    message: 'Your symptoms show a progressive pattern over 6 days',
    recommendation: 'Consult a General Physician within 24-48 hours'
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'severe':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'high':
        return 'bg-red-50 border-red-200 text-red-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Health Timeline</h1>
              <p className="text-gray-600 text-sm">Track your symptom progression and patterns</p>
            </div>
          </div>
        </div>

        {/* AI Prediction Card */}
        <div className={`${getRiskColor(prediction.risk)} border-2 rounded-2xl p-6 mb-6 shadow-md`}>
          <div className="flex items-start gap-4">
            <div className={`${getRiskBadgeColor(prediction.risk)} p-3 rounded-xl`}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-bold">AI Health Analysis</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadgeColor(prediction.risk)} text-white`}>
                  {prediction.risk.toUpperCase()} RISK
                </span>
              </div>
              <p className="text-sm mb-3">{prediction.message}</p>
              <div className="bg-white bg-opacity-60 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm mb-1">Recommendation:</p>
                  <p className="text-sm">{prediction.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Symptom Timeline</h2>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300 to-indigo-100"></div>

            {/* Timeline Items */}
            <div className="space-y-6">
              {symptoms.map((entry) => (
                <div key={entry.id} className="relative pl-20">
                  {/* Timeline Dot */}
                  <div className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white shadow-md ${
                    entry.severity === 'severe' ? 'bg-red-500' :
                    entry.severity === 'moderate' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}></div>

                  {/* Card */}
                  <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-indigo-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{entry.symptom}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(entry.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                          <Clock className="w-4 h-4 ml-2" />
                          <span>{entry.duration}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(entry.severity)}`}>
                        {entry.severity.toUpperCase()}
                      </span>
                    </div>

                    <div className="bg-white rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Location:</span> {entry.bodyPart}
                      </p>
                    </div>

                    {entry.relatedSymptoms.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Related Symptoms:</p>
                        <div className="flex flex-wrap gap-2">
                          {entry.relatedSymptoms.map((related, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
                            >
                              {related}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Entry Button */}
          <button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
            <Activity className="w-5 h-5" />
            Add New Symptom Entry
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-gray-600 text-sm mb-1">Total Symptoms</p>
            <p className="text-2xl font-bold text-gray-900">{symptoms.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-gray-600 text-sm mb-1">Duration</p>
            <p className="text-2xl font-bold text-gray-900">6 Days</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-gray-600 text-sm mb-1">Severity Trend</p>
            <p className="text-2xl font-bold text-red-600">↑ Increasing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTimeline;