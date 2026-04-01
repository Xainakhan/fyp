/**
 * VoiceControlContext.tsx  (v2 — guided fill mode)
 *
 * Key fix: when user says "let's fill form" / "form bharo" the provider
 * enters GUIDED FILL MODE:
 *   1. Focuses field[0] of the active form and speaks its label.
 *   2. The NEXT utterance — whatever it is — is written directly into that
 *      field (no keyword matching needed).
 *   3. Automatically advances to the next field, speaks its label, waits.
 *   4. "next" / "skip" / "chhordo" skips without writing.
 *   5. "submit" / "done" / "bhejo" exits guided mode and submits.
 *   6. "cancel" / "stop" exits guided mode.
 *
 * Outside guided mode the original keyword-based approach still works:
 *   "name is Ahmed"  |  "phone 03001234567"  |  "go to doctor"  etc.
 *
 * extractValue() is also smarter — it strips leading field keywords so
 * "name Zainab Batool" correctly yields "Zainab Batool".
 */

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface VoiceFormField {
  id: string;
  label: string;
  keywords: string[];
  urduKeywords?: string[];
  setValue: (value: string) => void;
  ref?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}

export interface VoiceFormHandle {
  formId: string;
  fields: VoiceFormField[];
  onSubmit?: () => void;
}

interface VoiceControlContextValue {
  voiceActive: boolean;
  toggleVoice: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  lastCommand: string;
  /** true while inside guided field-by-field fill */
  guidedFillActive: boolean;
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
  guidedFillActive: false,
  registerForm: () => () => {},
});

export const useVoiceControl = () => useContext(VoiceControlContext);

// ─────────────────────────────────────────────
// Navigation map
// ─────────────────────────────────────────────

const NAV_COMMANDS = [
  { path: "/",          keywords: ["home", "ghar", "main page", "wapis"],                         label: "Home" },
  { path: "/tts",       keywords: ["talk bot", "talkbot", "voice bot", "chatbot", "baat karo"],   label: "Talk Bot" },
  { path: "/interview", keywords: ["health interview", "interview", "interview shuru"],             label: "Health Interview" },
  { path: "/triage",    keywords: ["triage", "symptom checker", "symptoms", "check symptoms"],    label: "Symptom Checker" },
  { path: "/timeline",  keywords: ["timeline", "health timeline"],                                  label: "Health Timeline" },
  { path: "/doctor",    keywords: ["find doctor", "doctor", "doctor dhundho", "physician"],       label: "Find Doctor" },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function speak(text: string, lang: string): Promise<void> {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) { resolve(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang  = lang === "ur" ? "ur-PK" : "en-US";
    u.rate  = 0.92;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    setTimeout(() => window.speechSynthesis.speak(u), 80);
  });
}

/**
 * Strip leading field keywords from a transcript:
 *   "name Zainab Batool"        →  "Zainab Batool"
 *   "my name is Zainab Batool"  →  "Zainab Batool"
 *   "naam Zainab"               →  "Zainab"
 *   "phone number 03001234567"  →  "03001234567"
 */
function extractValue(transcript: string, fieldKeywords: string[]): string {
  const t = transcript.trim();

  // 1. Connector pattern: "... is/hai/ko/= value"
  const connMatch = t.match(/(?:is|are|hai|hain|ko|to|mein|=)\s+(.+)/i);
  if (connMatch) return connMatch[1].trim();

  // 2. Strip a leading keyword (longest match first to avoid partial strips)
  const lower = t.toLowerCase();
  const sorted = [...fieldKeywords].sort((a, b) => b.length - a.length);
  for (const kw of sorted) {
    const kwLower = kw.toLowerCase();
    if (lower.startsWith(kwLower)) {
      const after = t.slice(kw.length).replace(/^[\s,:-]+/, "");
      if (after.length > 0) return after.trim();
    }
  }

  // 3. "set/fill/enter/type X to value"
  const cmdMatch = t.match(/^(?:set|fill|enter|type|likho|dalo)\s+\S+\s+(?:to|as|with|mein|se)?\s*(.+)/i);
  if (cmdMatch) return cmdMatch[1].trim();

  // 4. Drop first word if multiple words (first word assumed to be the field name)
  const words = t.split(/\s+/);
  if (words.length >= 2) return words.slice(1).join(" ").trim();

  return t;
}

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

export const VoiceControlProvider: React.FC<{
  children: ReactNode;
  userLanguage?: "en" | "ur";
}> = ({ children, userLanguage = "en" }) => {
  const navigate = useNavigate();

  const [voiceActive,      setVoiceActive]      = useState(false);
  const [isListening,      setIsListening]       = useState(false);
  const [isSpeaking,       setIsSpeaking]        = useState(false);
  const [transcript,       setTranscript]        = useState("");
  const [lastCommand,      setLastCommand]       = useState("");
  const [guidedFillActive, setGuidedFillActive]  = useState(false);

  const recognitionRef  = useRef<any>(null);
  const formsRef        = useRef<VoiceFormHandle[]>([]);
  const guidedRef       = useRef<{ formId: string; fieldIndex: number } | null>(null);
  const lastResponseRef = useRef<string>("");

  // ── registerForm ──
  const registerForm = useCallback((handle: VoiceFormHandle) => {
    formsRef.current = [...formsRef.current, handle];
    return () => {
      formsRef.current = formsRef.current.filter((f) => f.formId !== handle.formId);
      if (guidedRef.current?.formId === handle.formId) {
        guidedRef.current = null;
        setGuidedFillActive(false);
      }
    };
  }, []);

  // ── TTS wrapper ──
  const say = useCallback(async (text: string) => {
    lastResponseRef.current = text;
    setIsSpeaking(true);
    await speak(text, userLanguage);
    setIsSpeaking(false);
  }, [userLanguage]);

  // ── Guided fill: start ──
  const startGuidedFill = useCallback(async () => {
    const forms = formsRef.current;
    if (forms.length === 0) {
      await say(userLanguage === "ur" ? "کوئی فارم نہیں ملا۔" : "No active form found.");
      return;
    }

    // Pick the registered form that has the most fields (skip nav-only forms with 0 fields)
    const form = [...forms]
      .reverse()
      .find((f) => f.fields.length > 0);

    if (!form) {
      await say(userLanguage === "ur" ? "فارم میں کوئی خانہ نہیں۔" : "No fillable fields found on this page.");
      return;
    }
    guidedRef.current = { formId: form.formId, fieldIndex: 0 };
    setGuidedFillActive(true);
    const first = form.fields[0];
    first.ref?.current?.focus();
    await say(
      userLanguage === "ur"
        ? `فارم بھرنا شروع۔ پہلا خانہ: ${first.label}۔ بولیں۔`
        : `Guided fill started. First field: ${first.label}. Please say the value.`
    );
  }, [say, userLanguage]);

  // ── Guided fill: write value and advance ──
  const guidedFillCurrent = useCallback(async (value: string) => {
    const state = guidedRef.current;
    if (!state) return;
    const form  = formsRef.current.find((f) => f.formId === state.formId);
    if (!form)  { guidedRef.current = null; setGuidedFillActive(false); return; }
    const field = form.fields[state.fieldIndex];
    if (!field) { guidedRef.current = null; setGuidedFillActive(false); return; }

    field.setValue(value);
    field.ref?.current?.focus();

    const nextIndex = state.fieldIndex + 1;
    if (nextIndex >= form.fields.length) {
      guidedRef.current = null;
      setGuidedFillActive(false);
      await say(
        userLanguage === "ur"
          ? `${field.label} مکمل۔ تمام خانے بھر گئے۔ "submit" کہیں جمع کرنے کے لیے۔`
          : `${field.label} done. All fields filled. Say "submit" to send.`
      );
    } else {
      const next = form.fields[nextIndex];
      guidedRef.current = { formId: state.formId, fieldIndex: nextIndex };
      next.ref?.current?.focus();
      await say(
        userLanguage === "ur"
          ? `${field.label} مکمل۔ اگلا: ${next.label}۔ بولیں۔`
          : `${field.label} done. Next: ${next.label}. Please say the value.`
      );
    }
  }, [say, userLanguage]);

  // ── Guided fill: skip current field ──
  const guidedSkipCurrent = useCallback(async () => {
    const state = guidedRef.current;
    if (!state) return;
    const form = formsRef.current.find((f) => f.formId === state.formId);
    if (!form) return;

    const nextIndex = state.fieldIndex + 1;
    if (nextIndex >= form.fields.length) {
      guidedRef.current = null;
      setGuidedFillActive(false);
      await say(userLanguage === "ur" ? "چھوڑ دیا۔ تمام خانے مکمل۔" : "Skipped. All fields done.");
    } else {
      const next = form.fields[nextIndex];
      guidedRef.current = { formId: state.formId, fieldIndex: nextIndex };
      next.ref?.current?.focus();
      await say(
        userLanguage === "ur"
          ? `چھوڑ دیا۔ اگلا: ${next.label}۔ بولیں۔`
          : `Skipped. Next field: ${next.label}. Please say the value.`
      );
    }
  }, [say, userLanguage]);

  // ── Core command handler ──
  const handleCommand = useCallback(async (raw: string) => {
    const text = raw.trim();
    const tl   = text.toLowerCase();
    setLastCommand(text);

    // ── STOP ──
    if (/\b(stop|ruk jao|bas|quiet|chup)\b/.test(tl)) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      guidedRef.current = null;
      setGuidedFillActive(false);
      recognitionRef.current?.stop();
      await say(userLanguage === "ur" ? "رک گیا۔" : "Stopped.");
      return;
    }

    // ── REPEAT ──
    if (/\b(repeat|dobara|again|phir se)\b/.test(tl)) {
      if (lastResponseRef.current) await say(lastResponseRef.current);
      return;
    }

    // ── CANCEL — exits guided mode too ──
    if (/\b(cancel|band karo|hatao|clear|exit|bahar)\b/.test(tl)) {
      guidedRef.current = null;
      setGuidedFillActive(false);
      await say(userLanguage === "ur" ? "منسوخ۔" : "Cancelled.");
      return;
    }

    // ── START GUIDED FILL ──
    // Fuzzy: catches "fill form", "fil form", "feel form", "phil form",
    // "fill the form", "form fill", "form bharo", "form shuru" etc.
    const isGuidedTrigger =
      /\b(fill|fil|feel|phil)\b.*\bform\b/.test(tl) ||
      /\bform\b.*\b(fill|bharo|shuru|start|karo)\b/.test(tl) ||
      /\b(form bharo|form shuru|start form|guided fill|field by field|ek ek field)\b/.test(tl);
    if (isGuidedTrigger) {
      await startGuidedFill();
      return;
    }

    // ─────────────────────────────────────────
    // INSIDE GUIDED FILL MODE
    // ─────────────────────────────────────────
    if (guidedRef.current) {

      // Skip this field
      if (/\b(skip|next|chhordo|agla|aage|pass|chhor)\b/.test(tl)) {
        await guidedSkipCurrent();
        return;
      }

      // Submit while in guided mode
      if (/\b(submit|bhejo|send|confirm|done|haan|jama karo|finish|mukamal)\b/.test(tl)) {
        guidedRef.current = null;
        setGuidedFillActive(false);
        const forms = formsRef.current;
        if (forms.length > 0) {
          forms[forms.length - 1].onSubmit?.();
          await say(userLanguage === "ur" ? "فارم جمع ہو رہا ہے۔" : "Submitting form.");
        }
        return;
      }

      // Everything else → value for the current field
      const state = guidedRef.current;
      const form  = formsRef.current.find((f) => f.formId === state.formId);
      if (form) {
        const field  = form.fields[state.fieldIndex];
        const allKw  = [...field.keywords, ...(field.urduKeywords ?? [])];
        const value  = extractValue(text, allKw);
        await guidedFillCurrent(value);
        return;
      }
    }

    // ─────────────────────────────────────────
    // OUTSIDE GUIDED MODE — keyword-based fill
    // ─────────────────────────────────────────

    // Navigation
    for (const cmd of NAV_COMMANDS) {
      if (cmd.keywords.some((kw) => tl.includes(kw))) {
        navigate(cmd.path);
        await say(userLanguage === "ur" ? `${cmd.label} کھل رہا ہے۔` : `Opening ${cmd.label}.`);
        return;
      }
    }

    // Submit
    if (/\b(submit|bhejo|send|confirm|haan|jama karo)\b/.test(tl)) {
      const forms = formsRef.current;
      if (forms.length > 0) {
        forms[forms.length - 1].onSubmit?.();
        await say(userLanguage === "ur" ? "فارم جمع ہو رہا ہے۔" : "Submitting form.");
      } else {
        await say(userLanguage === "ur" ? "کوئی فارم نہیں ملا۔" : "No active form.");
      }
      return;
    }

    // Next field (manual)
    if (/\b(next field|agla field|next|agla|tab)\b/.test(tl)) {
      const forms = formsRef.current;
      if (forms.length === 0) {
        await say(userLanguage === "ur" ? "کوئی فارم نہیں۔" : "No form is active.");
        return;
      }
      const form = forms[forms.length - 1];
      const cur  = guidedRef.current;
      let   idx  = cur?.formId === form.formId ? cur.fieldIndex + 1 : 0;
      if (idx >= form.fields.length) idx = 0;
      guidedRef.current = { formId: form.formId, fieldIndex: idx };
      const field = form.fields[idx];
      field.ref?.current?.focus();
      await say(
        userLanguage === "ur"
          ? `${field.label} درج کریں۔`
          : `Please say your ${field.label}.`
      );
      return;
    }

    // Keyword-based field fill: "name Zainab" / "phone 0300..."
    // Search all registered forms that have fields (skip nav-only forms)
    const formsWithFields = formsRef.current.filter((f) => f.fields.length > 0);
    for (const form of [...formsWithFields].reverse()) {
      for (const field of form.fields) {
        const allKw   = [...field.keywords, ...(field.urduKeywords ?? [])];
        const matched = allKw.some(
          (kw) =>
            tl.startsWith(kw.toLowerCase()) ||
            tl.includes(` ${kw.toLowerCase()} `) ||
            tl.includes(`${kw.toLowerCase()} `)
        );
        if (matched) {
          const value = extractValue(text, allKw);
          if (value) {
            field.setValue(value);
            field.ref?.current?.focus();
            guidedRef.current = { formId: form.formId, fieldIndex: form.fields.indexOf(field) };
            await say(
              userLanguage === "ur"
                ? `${field.label} میں "${value}" لکھا۔`
                : `${field.label} set to "${value}".`
            );
            return;
          }
        }
      }
    }

    // Fallback
    await say(
      userLanguage === "ur"
        ? "سمجھ نہیں آیا۔ 'form bharo' کہیں فارم شروع کرنے کے لیے۔"
        : `I heard: "${text}". Say "fill form" to start guided fill.`
    );
  }, [navigate, say, userLanguage, startGuidedFill, guidedFillCurrent, guidedSkipCurrent]);

  // ── SpeechRecognition lifecycle ──
  useEffect(() => {
    if (!voiceActive) {
      recognitionRef.current?.stop();
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { console.warn("SpeechRecognition not supported"); return; }

    const rec = new SR();
    recognitionRef.current = rec;
    rec.continuous     = true;
    rec.interimResults = true;
    rec.lang           = userLanguage === "ur" ? "ur-PK" : "en-US";

    rec.onstart  = () => setIsListening(true);
    rec.onend    = () => {
      setIsListening(false);
      if (voiceActive) { try { rec.start(); } catch (_) {} }
    };
    rec.onresult = (e: any) => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      setTranscript(interim || final);
      if (final.trim()) handleCommand(final.trim());
    };
    rec.onerror  = (e: any) => {
      if (e.error !== "no-speech") console.error("VoiceControl:", e.error);
    };

    try { rec.start(); } catch (_) {}
    say(userLanguage === "ur" ? "آواز کنٹرول فعال۔ حکم دیں۔" : "Voice control active. Say a command.");

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
        guidedRef.current = null;
        setGuidedFillActive(false);
      }
      return !v;
    });
  }, []);

  return (
    <VoiceControlContext.Provider value={{
      voiceActive, toggleVoice, isListening, isSpeaking,
      transcript, lastCommand, guidedFillActive, registerForm,
    }}>
      {children}
    </VoiceControlContext.Provider>
  );
};

export default VoiceControlContext;