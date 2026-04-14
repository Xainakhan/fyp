import Header from "./components/Header";
import DoctorSearch from "./components/DoctorSearch";
import Testinomial from "./components/Testinomials";
import HospitalSection from "./components/Hospitals";
import LeadingExperts from "./components/LeadingExperts";

interface HomePageProps {
  userLanguage?: "en" | "ur";
  setUserLanguage?: (lang: "en" | "ur") => void;
}

export default function HomePage({ userLanguage: _userLanguage, setUserLanguage: _setUserLanguage }: HomePageProps) {
  return (
    <div>
      <Header />
      <DoctorSearch />
      <Testinomial />
      <HospitalSection />
      <LeadingExperts />
    </div>
  );
}