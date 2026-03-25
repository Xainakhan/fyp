import React from "react";
import Header from "./components/Header";
import DoctorSearch from "./components/DoctorSearch";
import Testinomial from "./components/Testinomials";
import HospitalSection from "./components/Hospitals";
import LeadingExperts from "./components/LeadingExperts";


const HomePage = () => {
  return (
    <div>
      <Header />
      <DoctorSearch />
      <Testinomial />
      <HospitalSection />
      <LeadingExperts />
    </div>
  );
};

export default HomePage;