"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { matchesLocation } from "@/lib/locations";
import { formatChoiceAliases, formatChoiceLabel } from "@/lib/choiceLabels";

const noAliases: Record<string, readonly string[]> = {};

export default function SearchableChoicePreview({
  id,
  label,
  choices,
  aliases = noAliases,
  value,
  onChange,
}: {
  id: string;
  label: string;
  choices: readonly string[];
  aliases?: Record<string, readonly string[]>;
  value: string;
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [browse, setBrowse] = useState(true);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedAliases = formatChoiceAliases(aliases[value]);
  const results = choices.filter((choice) =>
    matchesLocation(browse ? "" : value || query, [
      choice,
      ...(aliases[choice] ?? []),
    ]),
  );
  const activeChoice = results[active];
  const optionId = (choice: string) =>
    `${id}-option-${choices.indexOf(choice)}`;

  useEffect(() => {
    if (value) inputRef.current?.setSelectionRange(0, 0);
  }, [value]);

  useEffect(() => {
    if (open && activeChoice)
      document
        .getElementById(`${id}-option-${choices.indexOf(activeChoice)}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [open, activeChoice, id, choices]);

  function choose(choice: string) {
    onChange(choice);
    setQuery("");
    inputRef.current?.focus({ preventScroll: true });
    setOpen(false);
    setActive(-1);
  }

  return (
    <div
      className="arrival-picker"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
          setActive(-1);
        }
      }}
    >
      <div className="arrival-input">
        <input
          ref={inputRef}
          id={`${id}-sample`}
          className="field-example"
          role="combobox"
          aria-label={label}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${id}-options`}
          aria-activedescendant={
            open && activeChoice ? optionId(activeChoice) : undefined
          }
          aria-describedby={
            selectedAliases ? `${id}-hint ${id}-selection-hint` : `${id}-hint`
          }
          autoComplete="off"
          spellCheck={false}
          placeholder="Search or choose an option"
          value={value ? formatChoiceLabel(value, aliases[value]) : query}
          onFocus={() => {
            setOpen(true);
            setBrowse(true);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            onChange("");
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
            } else if (event.key === "Enter" && open && activeChoice) {
              event.preventDefault();
              choose(activeChoice);
            } else if (event.key === "Escape" || event.key === "Tab") {
              setOpen(false);
              setActive(-1);
            }
          }}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={
            open ? `Close ${label} choices` : `Show all ${label} choices`
          }
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            const nextOpen = !open;
            inputRef.current?.focus({ preventScroll: true });
            setBrowse(true);
            setOpen(nextOpen);
            setActive(-1);
          }}
        >
          <ChevronDown size={18} aria-hidden="true" />
        </button>
      </div>
      {open && (
        <div className="arrival-menu">
          <ul
            id={`${id}-options`}
            role="listbox"
            aria-label={`${label} choices`}
          >
            {results.map((choice, index) => (
              <li
                key={choice}
                id={optionId(choice)}
                role="option"
                aria-selected={value === choice}
                className={index === active ? "active" : undefined}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(choice)}
              >
                <strong>{choice}</strong>
                {aliases[choice]?.length ? (
                  <span>{formatChoiceAliases(aliases[choice])}</span>
                ) : null}
              </li>
            ))}
          </ul>
          {!results.length && (
            <p role="status">No match. Try another term or show all choices.</p>
          )}
        </div>
      )}
      {selectedAliases && (
        <p id={`${id}-selection-hint`} className="compact-field-hint">
          {selectedAliases}
        </p>
      )}
    </div>
  );
}
