"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Copy, ClipboardCheck, Undo2, LoaderCircle } from "lucide-react";
import type { VisaField } from "@/lib/schema";
import { textFeedback, textLimit } from "@/lib/fieldFeedback";

export default function FieldTextPreview({
  field,
  label,
  placeholder,
  state,
}: {
  field: VisaField;
  label: string;
  placeholder?: string;
  state?: { value: string; onChange: (value: string) => void };
}) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [localValue, setLocalValue] = useState("");
  const value = state?.value ?? localValue;
  const setValue = state?.onChange ?? setLocalValue;
  const revision = useRef(0);
  const [copying, setCopying] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [copyTarget, setCopyTarget] = useState<"primary" | "original">(
    "primary",
  );
  const copied =
    copyStatus === "Copied" || copyStatus === "Formatted and copied";
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopyStatus(""), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);
  const [original, setOriginal] = useState<string>();
  const { errors, warnings, suggestion } = textFeedback(field, value);
  const limit = textLimit(field);
  async function copyValue(format: boolean) {
    const copiedValue = format && suggestion ? suggestion.value : value;
    const currentRevision = revision.current;
    setCopyTarget(!format && suggestion ? "original" : "primary");
    setCopying(true);
    setCopyStatus("");
    try {
      await navigator.clipboard.writeText(copiedValue);
      if (revision.current !== currentRevision) return;
      if (format && copiedValue !== value) {
        setOriginal(value);
        setValue(copiedValue);
        inputRef.current?.focus();
      }
      setCopyStatus(format ? "Formatted and copied" : "Copied");
    } catch {
      if (revision.current === currentRevision)
        setCopyStatus(
          "Couldn’t copy. Select the text or preview and copy it manually.",
        );
    } finally {
      setCopying(false);
    }
  }

  const props = {
    ref: (node: HTMLInputElement | HTMLTextAreaElement | null) => {
      inputRef.current = node;
    },
    id: `${field.id}-sample`,
    className: "field-example",
    "aria-label": label,
    "aria-describedby": `${field.id}-hint ${field.id}-rules ${field.id}-feedback`,
    "aria-invalid": errors.length > 0,
    value,
    placeholder,
    autoComplete: "off",
    spellCheck: false,
    autoCapitalize: "none",
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      revision.current += 1;
      setCopyStatus("");
      setValue(event.target.value);
      setOriginal(undefined);
    },
  };
  return (
    <>
      <div className="field-input-row">
        {field.type === "textarea" ? (
          <textarea {...props} rows={3} />
        ) : (
          <input
            {...props}
            type="text"
            inputMode={field.type === "email" ? "email" : "text"}
          />
        )}
        <div className="field-copy-actions">
          <button
            type="button"
            className={`field-icon-button ${copied && copyTarget === "primary" ? "is-copied" : ""}`}
            aria-label={suggestion ? "Format & copy" : "Copy"}
            title={suggestion ? "Format & copy" : "Copy"}
            disabled={!value.trim() || copying}
            onClick={() => copyValue(!!suggestion)}
          >
            {copied && copyTarget === "primary" ? (
              <Check size={18} aria-hidden="true" />
            ) : copying ? (
              <LoaderCircle size={18} aria-hidden="true" />
            ) : suggestion ? (
              <ClipboardCheck size={18} aria-hidden="true" />
            ) : (
              <Copy size={18} aria-hidden="true" />
            )}
          </button>
          {suggestion && (
            <button
              type="button"
              className={`field-icon-button ${copied && copyTarget === "original" ? "is-copied" : ""}`}
              aria-label="Copy original"
              title="Copy original"
              disabled={copying}
              onClick={() => copyValue(false)}
            >
              {copied && copyTarget === "original" ? (
                <Check size={18} aria-hidden="true" />
              ) : (
                <Copy size={18} aria-hidden="true" />
              )}
            </button>
          )}
          {original !== undefined && (
            <button
              type="button"
              className="field-icon-button"
              aria-label="Undo formatting"
              title="Undo formatting"
              onClick={() => {
                revision.current += 1;
                setValue(original);
                setCopyStatus("");
                inputRef.current?.focus();
                setOriginal(undefined);
              }}
            >
              <Undo2 size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <p className="field-rules" id={`${field.id}-rules`}>
        {limit?.perLine
          ? `${value.length} characters · aim for ${limit.max} per line`
          : limit
            ? `${value.length} / ${limit.max} characters`
            : `${value.length} characters`}
        {field.type === "date" && " · DD/MM/YYYY"}
      </p>
      <div
        id={`${field.id}-feedback`}
        className="field-feedback"
        aria-live="polite"
        aria-atomic="true"
      >
        {errors.map((error) => (
          <p className="field-input-error" key={error}>
            {error}
          </p>
        ))}
        {warnings.map((warning) => (
          <p key={warning}>{warning}</p>
        ))}
      </div>
      {suggestion && (
        <div className="field-suggestion">
          <p>{suggestion.reason}</p>
          <output>{suggestion.value}</output>
        </div>
      )}
      <p
        className={
          copied || !copyStatus
            ? "sr-only field-copy-status"
            : "field-copy-status"
        }
        role="status"
      >
        {copyStatus}
      </p>
    </>
  );
}
