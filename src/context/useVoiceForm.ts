/**
 * useVoiceForm.ts
 *
 * Call this hook inside any form component to register its fields
 * with the global VoiceControlProvider. Once registered, the user can
 * fill each field by saying its keyword followed by the value:
 *
 *   "name is Ahmed"
 *   "email hai ahmed@example.com"
 *   "phone 03001234567"
 *
 * Or navigate field-by-field with "next field" / "agla field".
 *
 * Usage:
 *
 *   const nameRef = useRef<HTMLInputElement>(null);
 *   const [name, setName] = useState("");
 *
 *   useVoiceForm({
 *     formId: "login-form",
 *     fields: [
 *       {
 *         id: "name",
 *         label: "Name",
 *         keywords: ["name", "my name"],
 *         urduKeywords: ["naam"],
 *         setValue: setName,
 *         ref: nameRef,
 *       },
 *     ],
 *     onSubmit: handleSubmit,
 *   });
 */

import { useEffect, useRef } from "react";
import { useVoiceControl } from "./VoiceControlContext";
import type { VoiceFormHandle, VoiceFormField } from "./VoiceControlContext";

interface UseVoiceFormOptions {
  formId: string;
  fields: VoiceFormField[];
  onSubmit?: () => void;
}

export function useVoiceForm({ formId, fields, onSubmit }: UseVoiceFormOptions) {
  const { registerForm } = useVoiceControl();

  // Keep a stable ref to the latest fields/onSubmit so we don't
  // need to re-register every render.
  const handleRef = useRef<VoiceFormHandle>({ formId, fields, onSubmit });
  useEffect(() => {
    handleRef.current = { formId, fields, onSubmit };
  });

  useEffect(() => {
    // Proxy object — always delegates to the latest snapshot
    const proxy: VoiceFormHandle = {
      get formId() { return handleRef.current.formId; },
      get fields()  { return handleRef.current.fields; },
      get onSubmit(){ return handleRef.current.onSubmit; },
    };

    const unregister = registerForm(proxy);
    return unregister;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]); // only re-register if formId changes
}