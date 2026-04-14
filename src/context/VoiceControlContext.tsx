import React, {
  createContext, useContext, useState, useRef,
  useCallback, useEffect, 
} from "react";
import type { ReactNode } from "react";

import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
  /** Extra spoken aliases that should map to this value */
  aliases?: string[];
  urduLabel?: string;
}

export interface VoiceFormField {
  id: string;
  label: string;
  keywords: string[];
  urduKeywords?: string[];
  setValue: (value: string) => void;
  ref?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>;
  /** Provide for <select> fields so the system can announce & match options */
  options?: SelectOption[];
}

export interface VoiceFormHandle {
  formId: string;
  fields: VoiceFormField[];
  onSubmit?: () => void;
}

export interface VoiceAction {
  id: string;
  keywords: string[];
  urduKeywords?: string[];
  handler: () => void;
}

interface VoiceControlContextValue {
  voiceActive: boolean;
  toggleVoice: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  lastCommand: string;
  guidedFillActive: boolean;
  currentGuidedField: { label: string; options?: SelectOption[] } | null;
  registerForm:   (handle: VoiceFormHandle) => () => void;
  registerAction: (action: VoiceAction)     => () => void;
}

// ─────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────

const VoiceControlContext = createContext<VoiceControlContextValue>({
  voiceActive: false, toggleVoice: () => {},
  isListening: false, isSpeaking: false,
  transcript: "", lastCommand: "",
  guidedFillActive: false, currentGuidedField: null,
  registerForm: () => () => {},
  registerAction: () => () => {},
});

export const useVoiceControl = () => useContext(VoiceControlContext);

// ─────────────────────────────────────────────────────────────
// Built-in navigation commands
// ─────────────────────────────────────────────────────────────

const NAV_COMMANDS = [
  { path: "/",          keywords: ["home", "ghar", "main page", "wapis"],                       label: "Home" },
  { path: "/tts",       keywords: ["talk bot", "talkbot", "voice bot", "chatbot", "baat karo"], label: "Talk Bot" },
  { path: "/interview", keywords: ["health interview", "interview", "interview shuru"],           label: "Health Interview" },
  { path: "/triage",    keywords: ["triage", "symptom checker", "symptoms"],                    label: "Symptom Checker" },
  { path: "/timeline",  keywords: ["timeline", "health timeline"],                               label: "Health Timeline" },
  { path: "/doctor",    keywords: ["find doctor", "doctor", "doctor dhundho"],                  label: "Find Doctor" },
];

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function speak(text: string, lang: string): Promise<void> {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) { resolve(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "ur" ? "ur-PK" : "en-US";
    u.rate = 0.92;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    setTimeout(() => window.speechSynthesis.speak(u), 80);
  });
}

/** Strip field keyword prefix and connector words to extract the bare value */
function extractValue(transcript: string, fieldKeywords: string[]): string {
  const t = transcript.trim();

  // "... is/hai/ko/= value"
  const connMatch = t.match(/(?:is|are|hai|hain|ko|to|mein|=)\s+(.+)/i);
  if (connMatch) return connMatch[1].trim();

  // strip longest matching keyword prefix
  const lower  = t.toLowerCase();
  const sorted = [...fieldKeywords].sort((a, b) => b.length - a.length);
  for (const kw of sorted) {
    if (lower.startsWith(kw.toLowerCase())) {
      const after = t.slice(kw.length).replace(/^[\s,:-]+/, "");
      if (after.length > 0) return after.trim();
    }
  }

  // "set/fill/enter X to value"
  const cmdMatch = t.match(/^(?:set|fill|enter|type|likho|dalo)\s+\S+\s+(?:to|as|with|mein|se)?\s*(.+)/i);
  if (cmdMatch) return cmdMatch[1].trim();

  // drop first word (assumed field name)
  const words = t.split(/\s+/);
  if (words.length >= 2) return words.slice(1).join(" ").trim();

  return t;
}

/**
 * For select fields: fuzzy-match spoken text against option labels/aliases.
 * Returns the option.value if matched, otherwise the raw spoken text.
 */
function matchSelectOption(spoken: string, options: SelectOption[]): string {
  const s = spoken.toLowerCase().trim();
  // exact value match
  const exact = options.find((o) => o.value.toLowerCase() === s);
  if (exact) return exact.value;
  // label match
  const byLabel = options.find((o) =>
    o.label.toLowerCase().includes(s) || s.includes(o.label.toLowerCase())
  );
  if (byLabel) return byLabel.value;
  // urdu label match
  const byUrdu = options.find((o) =>
    o.urduLabel && (o.urduLabel.includes(spoken) || spoken.includes(o.urduLabel))
  );
  if (byUrdu) return byUrdu.value;
  // alias match
  const byAlias = options.find((o) =>
    o.aliases?.some((a) => a.toLowerCase().includes(s) || s.includes(a.toLowerCase()))
  );
  if (byAlias) return byAlias.value;
  // return raw — the field's own setValue can handle it
  return spoken;
}

/** Build the spoken options list string */
function optionsPrompt(options: SelectOption[], lang: string): string {
  const labels = options.map((o) => (lang === "ur" && o.urduLabel ? o.urduLabel : o.label));
  if (lang === "ur") return `اختیارات: ${labels.join("، ")}۔ بولیں۔`;
  return `Options are: ${labels.join(", ")}. Say your choice.`;
}

// ─────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────

export const VoiceControlProvider: React.FC<{
  children: ReactNode;
  userLanguage?: "en" | "ur";
}> = ({ children, userLanguage = "en" }) => {
  const navigate = useNavigate();

  const [voiceActive,        setVoiceActive]        = useState(false);
  const [isListening,        setIsListening]         = useState(false);
  const [isSpeaking,         setIsSpeaking]          = useState(false);
  const [transcript,         setTranscript]          = useState("");
  const [lastCommand,        setLastCommand]         = useState("");
  const [guidedFillActive,   setGuidedFillActive]    = useState(false);
  const [currentGuidedField, setCurrentGuidedField]  = useState<{ label: string; options?: SelectOption[] } | null>(null);

  const recognitionRef  = useRef<any>(null);
  const formsRef        = useRef<VoiceFormHandle[]>([]);
  const actionsRef      = useRef<VoiceAction[]>([]);
  const guidedRef       = useRef<{ formId: string; fieldIndex: number } | null>(null);
  const lastResponseRef = useRef<string>("");

  // ── Register form ──
  const registerForm = useCallback((handle: VoiceFormHandle) => {
    formsRef.current = [...formsRef.current, handle];
    return () => {
      formsRef.current = formsRef.current.filter((f) => f.formId !== handle.formId);
      if (guidedRef.current?.formId === handle.formId) {
        guidedRef.current = null;
        setGuidedFillActive(false);
        setCurrentGuidedField(null);
      }
    };
  }, []);

  // ── Register action ──
  const registerAction = useCallback((action: VoiceAction) => {
    actionsRef.current = [...actionsRef.current, action];
    return () => {
      actionsRef.current = actionsRef.current.filter((a) => a.id !== action.id);
    };
  }, []);

  // ── TTS ──
  const say = useCallback(async (text: string) => {
    lastResponseRef.current = text;
    setIsSpeaking(true);
    await speak(text, userLanguage);
    setIsSpeaking(false);
  }, [userLanguage]);

  // ── Announce a field (used when entering it during guided fill) ──
  const announceField = useCallback(async (field: VoiceFormField, prefix = "") => {
    setCurrentGuidedField({ label: field.label, options: field.options });
    field.ref?.current?.focus();

    if (field.options && field.options.length > 0) {
      const prompt = userLanguage === "ur"
        ? `${prefix}${field.label}۔ ${optionsPrompt(field.options, "ur")}`
        : `${prefix}${field.label}. ${optionsPrompt(field.options, "en")}`;
      await say(prompt);
    } else {
      const prompt = userLanguage === "ur"
        ? `${prefix}${field.label}۔ بولیں۔`
        : `${prefix}${field.label}. Please say the value.`;
      await say(prompt);
    }
  }, [say, userLanguage]);

  // ── Guided fill: start ──
  const startGuidedFill = useCallback(async () => {
    // Find the most-recently-mounted form that actually has fields
    const form = [...formsRef.current].reverse().find((f) => f.fields.length > 0);
    if (!form) {
      await say(userLanguage === "ur" ? "کوئی فارم نہیں ملا۔" : "No fillable form found on this page.");
      return;
    }
    guidedRef.current = { formId: form.formId, fieldIndex: 0 };
    setGuidedFillActive(true);
    const first = form.fields[0];
    await announceField(
      first,
      userLanguage === "ur" ? "فارم شروع۔ پہلا خانہ: " : "Guided fill started. First field: "
    );
  }, [say, announceField, userLanguage]);

  // ── Guided fill: write value and advance ──
  const guidedFillCurrent = useCallback(async (rawValue: string) => {
    const state = guidedRef.current;
    if (!state) return;
    const form  = formsRef.current.find((f) => f.formId === state.formId);
    if (!form)  { guidedRef.current = null; setGuidedFillActive(false); setCurrentGuidedField(null); return; }
    const field = form.fields[state.fieldIndex];
    if (!field) { guidedRef.current = null; setGuidedFillActive(false); setCurrentGuidedField(null); return; }

    // Resolve value — fuzzy match for selects
    const value = field.options?.length
      ? matchSelectOption(rawValue, field.options)
      : rawValue;

    field.setValue(value);
    field.ref?.current?.focus();

    const nextIndex = state.fieldIndex + 1;
    if (nextIndex >= form.fields.length) {
      guidedRef.current = null;
      setGuidedFillActive(false);
      setCurrentGuidedField(null);
      await say(
        userLanguage === "ur"
          ? `${field.label} مکمل۔ تمام خانے بھر گئے۔ "submit" کہیں جمع کرنے کے لیے۔`
          : `${field.label} done. All fields filled. Say "submit" to send.`
      );
    } else {
      const next = form.fields[nextIndex];
      guidedRef.current = { formId: state.formId, fieldIndex: nextIndex };
      await announceField(
        next,
        userLanguage === "ur" ? `${field.label} مکمل۔ اگلا: ` : `${field.label} done. Next: `
      );
    }
  }, [say, announceField, userLanguage]);

  // ── Guided fill: skip ──
  const guidedSkipCurrent = useCallback(async () => {
    const state = guidedRef.current;
    if (!state) return;
    const form = formsRef.current.find((f) => f.formId === state.formId);
    if (!form) return;

    const nextIndex = state.fieldIndex + 1;
    if (nextIndex >= form.fields.length) {
      guidedRef.current = null;
      setGuidedFillActive(false);
      setCurrentGuidedField(null);
      await say(userLanguage === "ur" ? "چھوڑ دیا۔ تمام خانے مکمل۔" : "Skipped. All fields done.");
    } else {
      const next = form.fields[nextIndex];
      guidedRef.current = { formId: state.formId, fieldIndex: nextIndex };
      await announceField(next, userLanguage === "ur" ? "چھوڑ دیا۔ اگلا: " : "Skipped. Next: ");
    }
  }, [say, announceField, userLanguage]);

  // ── Core command handler ──
  const handleCommand = useCallback(async (raw: string) => {
    const text = raw.trim();
    const tl   = text.toLowerCase();
    setLastCommand(text);

    // STOP
    if (/\b(stop|ruk jao|bas|quiet|chup)\b/.test(tl)) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      guidedRef.current = null;
      setGuidedFillActive(false);
      setCurrentGuidedField(null);
      recognitionRef.current?.stop();
      await say(userLanguage === "ur" ? "رک گیا۔" : "Stopped.");
      return;
    }

    // REPEAT
    if (/\b(repeat|dobara|again|phir se)\b/.test(tl)) {
      if (lastResponseRef.current) await say(lastResponseRef.current);
      return;
    }

    // CANCEL
    if (/\b(cancel|band karo|hatao|clear|exit|bahar)\b/.test(tl)) {
      guidedRef.current = null;
      setGuidedFillActive(false);
      setCurrentGuidedField(null);
      await say(userLanguage === "ur" ? "منسوخ۔" : "Cancelled.");
      return;
    }

    // ── REGISTERED ACTIONS (modals, drawers, buttons) ──
    for (const action of actionsRef.current) {
      const allKw = [...action.keywords, ...(action.urduKeywords ?? [])];
      if (allKw.some((kw) => tl.includes(kw.toLowerCase()))) {
        action.handler();
        await say(
          userLanguage === "ur"
            ? `${action.id} کھل رہا ہے۔`
            : `Opening ${action.id.replace(/-/g, " ")}.`
        );
        return;
      }
    }

    // START GUIDED FILL (fuzzy: fil/fill/feel/phil + form)
    const isGuidedTrigger =
      /\b(fill|fil|feel|phil|pheel)\b.*\bform\b/.test(tl) ||
      /\bform\b.*\b(fill|bharo|shuru|start|karo)\b/.test(tl) ||
      /\b(form bharo|form shuru|start form|guided fill|field by field|ek ek field)\b/.test(tl);
    if (isGuidedTrigger) {
      await startGuidedFill();
      return;
    }

    // ─────────────────────────────────────────────
    // INSIDE GUIDED FILL MODE
    // ─────────────────────────────────────────────
    if (guidedRef.current) {

      // Skip
      if (/\b(skip|next|chhordo|agla|aage|pass|chhor)\b/.test(tl)) {
        await guidedSkipCurrent();
        return;
      }

      // Submit while guided
      if (/\b(submit|bhejo|send|confirm|done|haan|jama karo|finish|mukamal)\b/.test(tl)) {
        guidedRef.current = null;
        setGuidedFillActive(false);
        setCurrentGuidedField(null);
        const forms = formsRef.current;
        if (forms.length > 0) {
          forms[forms.length - 1].onSubmit?.();
          await say(userLanguage === "ur" ? "فارم جمع ہو رہا ہے۔" : "Submitting form.");
        }
        return;
      }

      // Anything else → value for current field
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

    // ─────────────────────────────────────────────
    // OUTSIDE GUIDED MODE
    // ─────────────────────────────────────────────

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
      const forms = formsRef.current.filter((f) => f.fields.length > 0);
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
      const form = [...formsRef.current].reverse().find((f) => f.fields.length > 0);
      if (!form) { await say(userLanguage === "ur" ? "کوئی فارم نہیں۔" : "No form active."); return; }
      const cur = guidedRef.current;
      let   idx = cur?.formId === form.formId ? cur.fieldIndex + 1 : 0;
      if (idx >= form.fields.length) idx = 0;
      guidedRef.current = { formId: form.formId, fieldIndex: idx };
      await announceField(form.fields[idx]);
      return;
    }

    // Keyword-based field fill (search all forms with fields)
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
          const rawValue = extractValue(text, allKw);
          const value    = field.options?.length
            ? matchSelectOption(rawValue, field.options)
            : rawValue;
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
  }, [navigate, say, announceField, userLanguage, startGuidedFill, guidedFillCurrent, guidedSkipCurrent]);

  // ── SpeechRecognition lifecycle ──
  useEffect(() => {
    if (!voiceActive) { recognitionRef.current?.stop(); return; }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { console.warn("SpeechRecognition not supported"); return; }

    const rec = new SR();
    recognitionRef.current = rec;
    rec.continuous = true; rec.interimResults = true;
    rec.lang = userLanguage === "ur" ? "ur-PK" : "en-US";

    rec.onstart  = () => setIsListening(true);
    rec.onend    = () => { setIsListening(false); if (voiceActive) { try { rec.start(); } catch (_) {} } };
    rec.onresult = (e: any) => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t; else interim += t;
      }
      setTranscript(interim || final);
      if (final.trim()) handleCommand(final.trim());
    };
    rec.onerror = (e: any) => { if (e.error !== "no-speech") console.error("VoiceControl:", e.error); };

    try { rec.start(); } catch (_) {}
    say(userLanguage === "ur" ? "آواز کنٹرول فعال۔ حکم دیں۔" : "Voice control active. Say a command.");

    return () => { rec.onend = null; try { rec.stop(); } catch (_) {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceActive, userLanguage]);

  const toggleVoice = useCallback(() => {
    setVoiceActive((v) => {
      if (v) { window.speechSynthesis.cancel(); guidedRef.current = null; setGuidedFillActive(false); setCurrentGuidedField(null); }
      return !v;
    });
  }, []);

  return (
    <VoiceControlContext.Provider value={{
      voiceActive, toggleVoice, isListening, isSpeaking,
      transcript, lastCommand, guidedFillActive, currentGuidedField,
      registerForm, registerAction,
    }}>
      {children}
    </VoiceControlContext.Provider>
  );
};

export default VoiceControlContext;