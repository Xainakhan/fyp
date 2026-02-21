import React from "react";
import { Bot, User } from "lucide-react";
import type { Message } from "../types/Types";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mr-3 flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div
        className={`max-w-[85%] ${
          isUser
            ? "bg-green-600 text-white rounded-2xl px-4 py-2.5"
            : "text-gray-800"
        }`}
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
          {message.text}
        </p>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center ml-3 flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};