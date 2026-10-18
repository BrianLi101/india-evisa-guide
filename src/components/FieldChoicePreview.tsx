"use client";
import { useEffect, useRef, useState } from "react";
import { fields } from "@/content/data";
import FieldTextPreview from "./FieldTextPreview";
import SearchableChoicePreview from "./SearchableChoicePreview";
import { religionAliases } from "@/content/fieldHints";

type SecondaryField = { id: string; label: string; hint: string };

export default function FieldChoicePreview({
  id,
  label,
  choices,
  secondary,
}: {
  id: string;
  label: string;
  choices: readonly string[];
  secondary?: SecondaryField;
}) {
  const [selected, setSelected] = useState("");
  const [explanation, setExplanation] = useState("");
  const secondaryRef = useRef<HTMLDivElement>(null);
  const secondaryField = fields.find((field) => field.id === secondary?.id);
  const showSecondary = !!secondary && selected === "OTHERS";

  // Preserve existing direct links to the dependent field without putting answers in URLs.
  useEffect(() => {
    function revealLinkedField() {
      if (secondary && window.location.hash === `#${secondary.id}`) {
        setSelected("OTHERS");
      }
    }
    revealLinkedField();
    window.addEventListener("hashchange", revealLinkedField);
    return () => window.removeEventListener("hashchange", revealLinkedField);
  }, [secondary]);

  useEffect(() => {
    if (showSecondary && window.location.hash === `#${secondary?.id}`) {
      secondaryRef.current?.scrollIntoView({ block: "start" });
    }
  }, [showSecondary, secondary?.id]);

  return (
    <>
      {id === "religion" ? (
        <SearchableChoicePreview
          id={id}
          label={label}
          choices={choices}
          aliases={religionAliases}
          value={selected}
          onChange={setSelected}
        />
      ) : (
        <select
          id={`${id}-sample`}
          className="field-example field-select"
          aria-label={label}
          aria-describedby={`${id}-hint`}
          autoComplete="off"
          value={selected}
          onChange={(event) => setSelected(event.target.value)}
        >
          <option value="">Select an option</option>
          {choices.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      )}
      {showSecondary && secondary && secondaryField && (
        <div id={secondary.id} ref={secondaryRef} className="secondary-field">
          <label htmlFor={`${secondary.id}-sample`}>{secondary.label}</label>
          <FieldTextPreview
            field={secondaryField}
            label={secondary.label}
            placeholder="e.g. NA, if applicable"
            state={{ value: explanation, onChange: setExplanation }}
          />
          <p className="compact-field-hint" id={`${secondary.id}-hint`}>
            {secondary.hint}
          </p>
        </div>
      )}
    </>
  );
}
