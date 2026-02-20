import React from "react";
import { FileText, Download, Eye } from "lucide-react";
import { healthRecords } from "../../data/profileData";

interface HealthRecordsTabProps {
  userLanguage: string;
}

const HealthRecordsTab: React.FC<HealthRecordsTabProps> = ({ userLanguage }) => {
  const isUrdu = userLanguage === "ur";

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h2
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ color: "#1a6645" }}
        >
          {isUrdu ? "صحت کے ریکارڈ" : "Health Records"}
        </h2>
        <p className="text-base" style={{ color: "#4a7a60" }}>
          {isUrdu
            ? "اپنے طبی ریکارڈ اور ٹیسٹ کے نتائج دیکھیں"
            : "View your medical records and test results"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {healthRecords.map((record) => (
          <div
            key={record.id}
            className="rounded-2xl overflow-hidden transition-all hover:shadow-md"
            style={{
              background: "rgba(255, 255, 255, 0.60)",
              border: "1px solid rgba(255, 255, 255, 0.88)",
            }}
          >
            <div
              className="h-24 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #2d9e6b 0%, #3aaa72 100%)",
              }}
            >
              <FileText className="w-12 h-12 text-white" />
            </div>

            <div className="p-6">
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "#1a6645" }}
              >
                {isUrdu ? record.typeUrdu : record.type}
              </h3>

              <div
                className="space-y-2 mb-4 text-sm"
                style={{ color: "#4a7a60" }}
              >
                <div className="flex justify-between">
                  <span className="font-medium">
                    {isUrdu ? "تاریخ:" : "Date:"}
                  </span>
                  <span>{isUrdu ? record.dateUrdu : record.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">
                    {isUrdu ? "ڈاکٹر:" : "Doctor:"}
                  </span>
                  <span>{isUrdu ? record.doctorUrdu : record.doctor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">
                    {isUrdu ? "نتیجہ:" : "Result:"}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      background: "rgba(45,158,107,0.15)",
                      color: "#2d9e6b",
                    }}
                  >
                    {isUrdu ? record.resultUrdu : record.result}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: "#2d9e6b",
                    color: "#ffffff",
                  }}
                >
                  <Eye className="w-4 h-4" />
                  {isUrdu ? "دیکھیں" : "View"}
                </button>
                <button
                  className="flex items-center justify-center px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: "rgba(45,158,107,0.1)",
                    color: "#2d9e6b",
                  }}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthRecordsTab;