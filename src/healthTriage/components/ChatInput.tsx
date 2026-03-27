import React, { type ChangeEvent, type KeyboardEvent, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Mic, Send } from "lucide-react";

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
  const { t, i18n } = useTranslation("healthTriage");
  const isRTL = i18n.dir() === "rtl";
  const hasText = inputValue.trim().length > 0;

  return (
    <div
      className="flex-shrink-0 px-3 py-2.5"
      style={{
        background: "rgba(8, 18, 14, 0.70)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "0.5px solid rgba(255,255,255,0.07)",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <form onSubmit={onSubmit} className="flex items-center gap-2.5">
        {/* Input pill */}
        <div
          className="flex-1 flex items-center px-4 py-2 rounded-full transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "0.5px solid rgba(255,255,255,0.12)",
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(59,130,246,0.40)";
            (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.09)";
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.12)";
            (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.07)";
          }}
        >
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              onInputChange(e.target.value);
              // auto-grow
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
            }}
            onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e as unknown as FormEvent<HTMLFormElement>);
              }
            }}
            placeholder={t("chat.placeholder", "Type your message...")}
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              outline: "none",
              resize: "none",
              fontSize: "13.5px",
              color: "rgba(255,255,255,0.88)",
              minHeight: "22px",
              maxHeight: "100px",
              overflowY: "auto",
              lineHeight: "1.45",
              scrollbarWidth: "none",
              caretColor: "#3b82f6",
              direction: isRTL ? "rtl" : "ltr",
            }}
          />
        </div>

        {/* Send / Mic toggle button */}
        <button
          type={hasText ? "submit" : "button"}
          disabled={isTyping && hasText}
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: "none",
            cursor: isTyping && hasText ? "not-allowed" : "pointer",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: hasText
              ? "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)"
              : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            boxShadow: "0 2px 14px rgba(59,130,246,0.50)",
            transition: "transform 0.15s, opacity 0.2s, background 0.25s",
            opacity: isTyping && hasText ? 0.45 : 1,
          }}
          onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.90)"; }}
          onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
          aria-label={hasText ? "Send message" : "Voice input"}
        >
          {hasText
            ? <Send size={16} color="white" />
            : <Mic size={16} color="white" />
          }
        </button>
      </form>
    </div>
  );
};
