import { useTranslation } from "react-i18next";
import SeverityChart from "./components/SeverityChart";

const HealthTimeline = () => {
  const { t } = useTranslation();

  return <SeverityChart symptoms={[]} />;
};

export default HealthTimeline;
