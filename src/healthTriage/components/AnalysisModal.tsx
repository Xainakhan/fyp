import React from "react";
import {
  X,
  Activity,
  User,
  MessageSquare,
  Stethoscope,
  CheckCircle,
  AlertTriangle,
  Download,
  UserRound,
} from "lucide-react";
import type { Diagnosis, UserData } from "../types/Types";

interface AnalysisModalProps {
  diagnosis: Diagnosis;
  userData: UserData;
  symptoms: string[];
  onClose: () => void;
  onNavigateToDoctor?: () => void;
  onDownload: () => void;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  diagnosis,
  userData,
  symptoms,
  onClose,
  onNavigateToDoctor,
  onDownload,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6" />
            <h2 className="text-xl font-bold">Medical Analysis Report</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Patient Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-green-500" />
              Patient Information
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Name</p>
                <p className="font-medium">{userData.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Age</p>
                <p className="font-medium">{userData.age || "N/A"} years</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Gender</p>
                <p className="font-medium capitalize">
                  {userData.gender || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-green-500" />
              Reported Symptoms
            </h3>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  {s.replace(/_/g, " ")}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Duration: {diagnosis.days} days
            </p>
          </div>

          {/* Diagnosis */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Stethoscope className="w-5 h-5 mr-2 text-indigo-500" />
              Diagnosis
            </h3>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-indigo-900">
                  {diagnosis.prediction}
                </span>
                {diagnosis.confidence && (
                  <span className="px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full text-sm font-medium">
                    {(diagnosis.confidence * 100).toFixed(1)}% confidence
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <AlertTriangle
                    className={`w-4 h-4 ${
                      diagnosis.severity === "high"
                        ? "text-red-500"
                        : diagnosis.severity === "moderate"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  />
                  <span className="capitalize font-medium">
                    {diagnosis.severity} Severity
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {diagnosis.precautions && diagnosis.precautions.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Recommendations
              </h3>
              <ul className="space-y-2">
                {diagnosis.precautions.map((precaution, i) => (
                  <li key={i} className="flex items-start space-x-2 text-sm">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 font-medium text-xs">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 pt-0.5">{precaution}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* High severity warning */}
          {diagnosis.severity === "high" && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">
                    Important Notice
                  </h4>
                  <p className="text-sm text-red-700">
                    This condition requires immediate medical attention. Please
                    consult a healthcare professional as soon as possible.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
            <strong>Disclaimer:</strong> This is an AI-assisted preliminary
            analysis and should NOT replace professional medical advice. Always
            consult qualified healthcare providers for accurate diagnosis and
            treatment.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Generated on {new Date().toLocaleString()}
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
            >
              Close
            </button>
            <button
              onClick={onNavigateToDoctor}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition text-sm"
            >
              <UserRound className="w-4 h-4" />
              <span>Consult Doctor</span>
            </button>
            <button
              onClick={onDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};