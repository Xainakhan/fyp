import React, { type ChangeEvent, type KeyboardEvent, type FormEvent } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  inputValue: string;
  isTyping: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onInputChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  isTyping,
  textareaRef,
  onInputChange,
  onSubmit,
}) => {
  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <form onSubmit={onSubmit} className="relative">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              onInputChange(e.target.value)
            }
            onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e as any);
              }
            }}
            placeholder="Message RoboDoc..."
            rows={1}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-[15px]"
            style={{ minHeight: "52px", maxHeight: "200px" }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-2 bottom-2 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-center text-gray-500 mt-3">
          RoboDoc can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};