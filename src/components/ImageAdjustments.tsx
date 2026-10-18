"use client";
import { useEffect, useId, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

export default function ImageAdjustments({
  brightness,
  contrast,
  disabled,
  onAdjust,
}: {
  brightness: number;
  contrast: number;
  disabled: boolean;
  onAdjust: (key: "brightness" | "contrast", value: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  return (
    <div
      className="image-adjust-menu"
      ref={container}
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          event.preventDefault();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        className="button small-button image-adjust-trigger"
        ref={trigger}
        disabled={disabled}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
      >
        <SlidersHorizontal size={16} />
        Adjust
      </button>
      <fieldset
        id={panelId}
        className="image-adjust-panel"
        disabled={disabled}
        hidden={!open}
      >
        <legend className="sr-only">Image adjustments</legend>
        <div className="range-controls">
          {(["brightness", "contrast"] as const).map((key) => (
            <label key={key}>
              {key === "brightness" ? "Brightness" : "Contrast"}
              <span>{key === "brightness" ? brightness : contrast}%</span>
              <input
                type="range"
                aria-label={key === "brightness" ? "Brightness" : "Contrast"}
                min={70}
                max={130}
                value={key === "brightness" ? brightness : contrast}
                onChange={(event) => onAdjust(key, Number(event.target.value))}
              />
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
