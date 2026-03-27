import React from "react";
import { useNavigate } from "react-router-dom";
import RoboDocChatbot from "../healthTriage/RobodocChatbot"; // adjust path if needed

interface GlobalChatbotProps {
  /** Optional: logged-in user's display name */
  userName?: string;
  /** Optional: logged-in user's avatar URL */
  userAvatar?: string;
}

const GlobalChatbot: React.FC<GlobalChatbotProps> = ({ userName, userAvatar }) => {
  const navigate = useNavigate();

  return (
    <RoboDocChatbot
      userName={userName}
      userAvatar={userAvatar}
      onNavigateToDoctor={() => navigate("/doctor")}
    />
  );
};

export default GlobalChatbot;
