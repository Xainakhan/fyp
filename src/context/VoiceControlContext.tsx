/**
 * VoiceControlContext.tsx
 *
 * Global voice controller. Wrap your entire app with <VoiceControlProvider>.
 * The Navbar mic button toggles voiceActive on/off.
 *
 * Supported commands (English + Urdu):
 *   Navigation : "go to doctor" | "doctor page" | "doctor page kholein"
 *   Form fill  : "name is Ahmed" | "email hai ahmed@x.com" | "phone number 03001234567"
 *   Next field : "next field" | "agla field"
 *   Submit     : "submit" | "submit karo" | "send" | "bhejo"
 *   Cancel     : "cancel" | "band karo"
 *   Repeat     : "repeat" | "dobara"
 *   Stop       : "stop" | "ruk jao" | "bas"
 */

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface VoiceFormField {
  /** Unique id for the field, e.g. "name", "email" */
  id: string;
  /** Human-readable label spoken in feedback, e.g. "Name" */
  label: string;
  /** English keywords that identify this field in speech */
  keywords: string[];
  /** Urdu keywords that identify this field in speech */
  urduKeywords?: string[];
  /** Callback to set the field value */
  setValue: (value: string) => void;
  /** Optional ref so we can focus the element */
  ref?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}

export interface VoiceFormHandle {
  formId: string;
  fields: VoiceFormField[];
  /** Called when user says "submit" */
  onSubmit?: () => void;
}

interface VoiceControlContextValue {
  voiceActive: boolean;
  toggleVoice: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  lastCommand: string;
  /** Forms call this to register themselves */
  registerForm: (handle: VoiceFormHandle) => () => void;
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

const VoiceControlContext = createContext<VoiceControlContextValue>({
  voiceActive: false,
  toggleVoice: () => {},
  isListening: false,
  isSpeaking: false,
  transcript: "",
  lastCommand: "",
  registerForm: () => () => {},
});

export const useVoiceControl = () => useContext(VoiceControlContext);

// ─────────────────────────────────────────────
// Navigation map  (path → keywords)
// ─────────────────────────────────────────────

const NAV_COMMANDS: { path: string; keywords: string[]; label: string }[] = [
  {
    path: "/",
    keywords: ["home", "ghar", "main page", "home page", "wapis"],
    label: "Home",
  },
  {
    path: "/tts",
    keywords: ["talk bot", "talkbot", "voice bot", "chat bot", "chatbot", "baat karo"],
    label: "Talk Bot",
  },
  {
    path: "/interview",
    keywords: ["health interview", "interview", "interview shuru"],
    label: "Health Interview",
  },
  {
    path: "/triage",
    keywords: ["triage", "symptom checker", "symptoms", "check symptoms", "ailment"],
    label: "Symptom Checker",
  },
  {
    path: "/timeline",
    keywords: ["timeline", "health timeline", "history"],
    label: "Health Timeline",
  },
  {
    path: "/doctor",
    keywords: ["find doctor", "doctor", "doctor dhundho", "physician", "hospital"],
    label: "Find Doctor",
  },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function speak(text: string, lang: string): Promise<void> {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) { resolve(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "ur" ? "ur-PK" : "en-US";
    u.rate = 0.95;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    setTimeout(() => window.speechSynthesis.speak(u), 80);
  });
}

function extractValue(transcript: string): string {
  // Patterns: "name is Ahmed", "name hai Ahmed", "set name to Ahmed", "naam Ahmed hai"
  const patterns = [
    /(?:is|are|hai|hain|ko|to|=)\s+(.+)/i,
    /(?:set|fill|enter|type|likho|dalo)\s+\w+\s+(?:to|as|with|mein|se)?\s*(.+)/i,
  ];
  for (const p of patterns) {
    const m = transcript.match(p);
    if (m) return m[1].trim();
  }
  // Fallback: take everything after the first two words
  const words = transcript.trim().split(/\s+/);
  if (words.length > 2) return words.slice(2).join(" ");
  return transcript.trim();
}

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

export const VoiceControlProvider: React.FC<{
  children: ReactNode;
  userLanguage?: "en" | "ur";
}> = ({ children, userLanguage = "en" }) => {
  const navigate = useNavigate();

  const [voiceActive, setVoiceActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastCommand, setLastCommand] = useState("");

  const recognitionRef = useRef<any>(null);
  const formsRef = useRef<VoiceFormHandle[]>([]);
  const activeFocusIndexRef = useRef<{ formId: string; fieldIndex: number } | null>(null);
  const lastResponseRef = useRef<string>("");

  // ── Register / unregister forms ──
  const registerForm = useCallback((handle: VoiceFormHandle) => {
    formsRef.current = [...formsRef.current, handle];
    return () => {
      formsRef.current = formsRef.current.filter((f) => f.formId !== handle.formId);
    };
  }, []);

  // ── TTS wrapper that updates isSpeaking ──
  const say = useCallback(
    async (text: string) => {
      lastResponseRef.current = text;
      setIsSpeaking(true);
      await speak(text, userLanguage);
      setIsSpeaking(false);
    },
    [userLanguage]
  );

  // ── Core command handler ──
  const handleCommand = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      const tl = text.toLowerCase();
      setLastCommand(text);

      // ── STOP ──
      if (/\b(stop|ruk jao|bas|quiet|chup)\b/.test(tl)) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        recognitionRef.current?.stop();
        await say(userLanguage === "ur" ? "ٹھیک ہے، رک گیا۔" : "Stopped.");
        return;
      }

      // ── REPEAT ──
      if (/\b(repeat|dobara|again|phir)\b/.test(tl)) {
        if (lastResponseRef.current) await say(lastResponseRef.current);
        return;
      }

      // ── CANCEL ──
      if (/\b(cancel|band karo|hatao|clear)\b/.test(tl)) {
        activeFocusIndexRef.current = null;
        await say(userLanguage === "ur" ? "منسوخ ہو گیا۔" : "Cancelled.");
        return;
      }

      // ── NAVIGATION ──
      for (const cmd of NAV_COMMANDS) {
        if (cmd.keywords.some((kw) => tl.includes(kw))) {
          navigate(cmd.path);
          await say(
            userLanguage === "ur"
              ? `${cmd.label} کھل رہا ہے۔`
              : `Opening ${cmd.label}.`
          );
          return;
        }
      }

      // ── SUBMIT ──
      if (/\b(submit|bhejo|send|confirm|ok|haan|yes|jama karo)\b/.test(tl)) {
        const forms = formsRef.current;
        if (forms.length > 0) {
          forms[forms.length - 1].onSubmit?.();
          await say(userLanguage === "ur" ? "فارم جمع ہو رہا ہے۔" : "Submitting form.");
        } else {
          await say(userLanguage === "ur" ? "کوئی فارم نہیں ملا۔" : "No active form to submit.");
        }
        return;
      }

      // ── NEXT FIELD ──
      if (/\b(next|agla|next field|agla field|tab)\b/.test(tl)) {
        const forms = formsRef.current;
        if (forms.length === 0) {
          await say(userLanguage === "ur" ? "کوئی فارم نہیں ملا۔" : "No form is active.");
          return;
        }
        const form = forms[forms.length - 1];
        let cur = activeFocusIndexRef.current;
        if (!cur || cur.formId !== form.formId) {
          cur = { formId: form.formId, fieldIndex: 0 };
        } else {
          cur = { formId: form.formId, fieldIndex: cur.fieldIndex + 1 };
        }
        if (cur.fieldIndex >= form.fields.length) {
          cur.fieldIndex = 0;
          await say(
            userLanguage === "ur"
              ? "پہلے خانے پر واپس آ گئے۔"
              : "Wrapping back to first field."
          );
        }
        activeFocusIndexRef.current = cur;
        const field = form.fields[cur.fieldIndex];
        field.ref?.current?.focus();
        await say(
          userLanguage === "ur"
            ? `${field.label} درج کریں۔`
            : `Please say your ${field.label}.`
        );
        return;
      }

      // ── FILL FIELD ──
      // Try to match "field-name is/hai value"
      const forms = formsRef.current;
      if (forms.length > 0) {
        const form = forms[forms.length - 1];
        for (const field of form.fields) {
          const allKw = [...field.keywords, ...(field.urduKeywords ?? [])];
          const matched = allKw.some((kw) => tl.includes(kw.toLowerCase()));
          if (matched) {
            const value = extractValue(text);
            if (value) {
              field.setValue(value);
              field.ref?.current?.focus();
              activeFocusIndexRef.current = {
                formId: form.formId,
                fieldIndex: form.fields.indexOf(field),
              };
              await say(
                userLanguage === "ur"
                  ? `${field.label} میں "${value}" لکھا گیا۔`
                  : `${field.label} set to "${value}".`
              );
              return;
            }
          }
        }

        // ── Focused-field fill (value only, no keyword needed) ──
        if (activeFocusIndexRef.current?.formId === form.formId) {
          const idx = activeFocusIndexRef.current.fieldIndex;
          const field = form.fields[idx];
          if (field) {
            field.setValue(text);
            field.ref?.current?.focus();
            await say(
              userLanguage === "ur"
                ? `${field.label} میں "${text}" لکھا گیا۔`
                : `${field.label} set to "${text}".`
            );
            return;
          }
        }
      }

      // ── FALLBACK ──
      await say(
        userLanguage === "ur"
          ? "سمجھ نہیں آیا، دوبارہ کہیں۔"
          : `I heard: "${text}". Please try again.`
      );
    },
    [navigate, say, userLanguage]
  );

  // ── Set up / tear down SpeechRecognition when voiceActive changes ──
  useEffect(() => {
    if (!voiceActive) {
      recognitionRef.current?.stop();
      return;
    }

    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      console.warn("SpeechRecognition not supported");
      return;
    }

    const rec = new SR();
    recognitionRef.current = rec;
    rec.continuous = true;        // keeps listening after each phrase
    rec.interimResults = true;
    rec.lang = userLanguage === "ur" ? "ur-PK" : "en-US";

    rec.onstart = () => setIsListening(true);
    rec.onend = () => {
      setIsListening(false);
      // Auto-restart while voice is still active
      if (voiceActive) {
        try { rec.start(); } catch (_) {}
      }
    };

    rec.onresult = (e: any) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      setTranscript(interim || final);
      if (final.trim()) handleCommand(final.trim());
    };

    rec.onerror = (e: any) => {
      if (e.error !== "no-speech") console.error("VoiceControl error:", e.error);
    };

    try { rec.start(); } catch (_) {}

    say(
      userLanguage === "ur"
        ? "آواز کنٹرول فعال ہے۔ حکم دیں۔"
        : "Voice control active. Say a command."
    );

    return () => {
      rec.onend = null;
      try { rec.stop(); } catch (_) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceActive, userLanguage]);

  const toggleVoice = useCallback(() => {
    setVoiceActive((v) => {
      if (v) {
        window.speechSynthesis.cancel();
        say(userLanguage === "ur" ? "آواز کنٹرول بند ہو گیا۔" : "Voice control off.");
      }
      return !v;
    });
  }, [say, userLanguage]);

  return (
    <VoiceControlContext.Provider
      value={{
        voiceActive,
        toggleVoice,
        isListening,
        isSpeaking,
        transcript,
        lastCommand,
        registerForm,
      }}
    >
      {children}
    </VoiceControlContext.Provider>
  );
};

export default VoiceControlContext;