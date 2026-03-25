import React, { useState } from "react";

const HelpSection: React.FC = () => {
  const [city, setCity] = useState("Islamabad");
  const [query, setQuery] = useState("");

  const cities = ["Islamabad", "Lahore", "Karachi"];

  return (
    <div className="w-full px-4 md:px-8 py-10 text-white">

      {/* MAIN WRAPPER */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-5 md:mb-6">
          How can we help you today?
        </h1>

        {/* TOP ROW */}
        <div className="flex flex-col lg:flex-row gap-4">

          {/* LEFT CARD */}
          <div className="lg:w-[280px] bg-white text-black rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-sm text-gray-600">Video</p>
              <h3 className="font-semibold text-lg">Consultation</h3>
              <p className="text-xs text-gray-500 mt-1">PMC Verified Doctors</p>
            </div>
            <img
              src="src/assets/hospital.png"
              alt="doctor"
              className="w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] object-contain flex-shrink-0"
            />
          </div>

          {/* SEARCH BOX */}
          <div className="flex-1 bg-white text-black rounded-2xl p-4 shadow-lg">

            <div className="flex flex-col sm:flex-row gap-3">

              {/* CITY */}
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-gray-100 border rounded-lg px-3 py-2 text-sm outline-none w-full sm:w-auto"
              >
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              {/* INPUT */}
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search doctor, specialty, hospital..."
                className="flex-1 border rounded-lg px-4 py-2 text-sm outline-none w-full"
              />

              {/* BUTTON */}
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm w-full sm:w-auto">
                🔍 {city}
              </button>
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2 mt-4">
              {["Flu & Fever", "Chest Pain", "Blood Pressure", "Headache", "Diabetes"].map((tag) => (
                <span
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1 text-xs bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 active:bg-gray-300 select-none"
                >
                  {tag}
                </span>
              ))}
              <span className="px-3 py-1 text-xs bg-gray-100 rounded-full cursor-pointer">+</span>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="flex flex-col lg:flex-row gap-4 mt-4 md:mt-6">

          {/* VIDEO / BIG IMAGE */}
          <div className="flex-1 relative rounded-2xl overflow-hidden">
            <img
              src="src/assets/home2.png"
              className="w-full h-[200px] sm:h-[220px] md:h-[260px] object-cover"
            />
          </div>

          {/* RIGHT PROMO CARD */}
          <div className="lg:w-[280px] relative rounded-2xl overflow-hidden min-h-[180px] sm:min-h-[220px] lg:min-h-0">
            <img
              src="src/assets/home3.png"
              alt="promo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default HelpSection;