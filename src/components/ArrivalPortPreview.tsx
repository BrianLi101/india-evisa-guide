"use client";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { arrivalPorts, type ArrivalPort } from "@/content/arrivalPorts";
import { searchArrivalPorts } from "@/lib/locations";

const alternateNames = (port: ArrivalPort) =>
  [port.code, ...port.names.slice(0, 3)].filter(Boolean).join(" · ");

export default function ArrivalPortPreview({ label }: { label: string }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ArrivalPort>();
  const [open, setOpen] = useState(false);
  const [browse, setBrowse] = useState(false);
  const [active, setActive] = useState(-1);
  const [copyStatus, setCopyStatus] = useState("");
  const copied = copyStatus === "Copied";
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopyStatus(""), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);
  const inputRef = useRef<HTMLInputElement>(null);
  const revision = useRef(0);
  const results = searchArrivalPorts(arrivalPorts, browse ? "" : query);
  const activePort = results[active];

  useEffect(() => {
    if (open && activePort)
      document
        .getElementById(`arrival-option-${activePort.id}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [open, activePort]);

  function choose(port: ArrivalPort) {
    revision.current += 1;
    setSelected(port);
    setQuery(port.label);
    setCopyStatus("");
    setBrowse(false);
    inputRef.current?.focus({ preventScroll: true });
    setOpen(false);
    setActive(-1);
  }

  async function copy() {
    if (!selected) return;
    const currentRevision = revision.current;
    setCopyStatus("");
    try {
      await navigator.clipboard.writeText(selected.label);
      if (revision.current === currentRevision) setCopyStatus("Copied");
    } catch {
      if (revision.current === currentRevision)
        setCopyStatus("Couldn’t copy. Select the text and copy it manually.");
    }
  }

  return (
    <div
      className="arrival-picker"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setOpen(false);
      }}
    >
      <div className="field-input-row">
        <div className="arrival-input">
          <input
            ref={inputRef}
            id="arrivalPort-sample"
            className="field-example"
            role="combobox"
            aria-label={label}
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls="arrival-port-options"
            aria-activedescendant={
              open && activePort ? `arrival-option-${activePort.id}` : undefined
            }
            aria-describedby="arrivalPort-hint arrival-selection-hint"
            autoComplete="off"
            spellCheck={false}
            placeholder="Try Thiruvananthapuram, TRV or Bangalore"
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              revision.current += 1;
              setQuery(event.target.value);
              setSelected(undefined);
              setCopyStatus("");
              setBrowse(false);
              setOpen(true);
              setActive(-1);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                if (!open) {
                  setOpen(true);
                  setActive(event.key === "ArrowDown" ? 0 : results.length - 1);
                } else {
                  setActive((current) =>
                    event.key === "ArrowDown"
                      ? Math.min(current + 1, results.length - 1)
                      : current <= 0
                        ? results.length - 1
                        : current - 1,
                  );
                }
              } else if (event.key === "Enter" && open && activePort) {
                event.preventDefault();
                choose(activePort);
              } else if (event.key === "Escape") {
                setOpen(false);
                setActive(-1);
              } else if (event.key === "Tab") {
                setOpen(false);
              }
            }}
          />
          <button
            type="button"
            aria-label={
              open ? "Close arrival choices" : "Show all arrival choices"
            }
            tabIndex={-1}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              const nextOpen = !open;
              inputRef.current?.focus({ preventScroll: true });
              setBrowse(true);
              setActive(-1);
              setOpen(nextOpen);
            }}
          >
            <ChevronDown size={18} />
          </button>
        </div>
        {selected && (
          <button
            type="button"
            className={`field-icon-button ${copied ? "is-copied" : ""}`}
            aria-label="Copy portal name"
            title="Copy portal name"
            onClick={copy}
          >
            {copied ? (
              <Check size={18} aria-hidden="true" />
            ) : (
              <Copy size={18} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      {open && (
        <div className="arrival-menu">
          <ul
            id="arrival-port-options"
            role="listbox"
            aria-label="Arrival ports"
          >
            {results.map((port, index) => (
              <li
                id={`arrival-option-${port.id}`}
                key={port.id}
                role="option"
                aria-selected={selected?.id === port.id}
                className={index === active ? "active" : undefined}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(port)}
              >
                <strong>{port.label}</strong>
                {alternateNames(port) && <span>{alternateNames(port)}</span>}
              </li>
            ))}
          </ul>
          {!results.length && (
            <p role="status">No match. Try another name or airport code.</p>
          )}
        </div>
      )}
      <p id="arrival-selection-hint" className="compact-field-hint">
        {selected
          ? alternateNames(selected)
          : query.trim() && !open
            ? "Choose a matching entry from the list."
            : ""}
      </p>
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
    </div>
  );
}
