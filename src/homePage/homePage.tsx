import React, { useState } from "react";
import Navbar from "../components/navBar";
import Header from "./components/Header";
import DoctorSearch from "./components/DoctorSearch";
import Testinomial from "./components/Testinomials";
import HospitalSection from "./components/Hospitals";
import LeadingExperts from "./components/LeadingExperts";
import footer from "../components/footer";
import Footer from "../components/footer";
const HomePage = () => {
  const [userLanguage, setUserLanguage] = useState("en");
  const [currentModule, setCurrentModule] = useState("home");
  const [voiceModeOn, setVoiceModeOn] = useState(false);

  return (
    <div>
      <Navbar
        userLanguage={userLanguage}
        setUserLanguage={setUserLanguage}
        setCurrentModule={setCurrentModule}
        voiceModeOn={voiceModeOn}
        onToggleVoice={() => setVoiceModeOn(!voiceModeOn)}
      />

      <Header />
      <DoctorSearch />
      <Testinomial />
      <HospitalSection />
        <LeadingExperts />
       <Footer setCurrentModule={function (module: string): void {
              throw new Error("Function not implemented.");
          } }/>
    </div>
  );
};

export default HomePage;