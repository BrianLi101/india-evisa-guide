import ArrivalPortPreview from "./ArrivalPortPreview";
import FieldTextPreview from "./FieldTextPreview";
import FieldChoicePreview from "./FieldChoicePreview";
import { fields, issues, REVIEWED_AT } from "@/content/data";
import {
  OBSERVED_AT,
  OBSERVED_SOURCE,
  portalObservations,
} from "@/content/portalObservations";
import {
  fieldHint,
  reportedChoices,
  US_WALKTHROUGH,
} from "@/content/fieldHints";
import type { VisaField } from "@/lib/schema";

export default function FieldReference({
  field,
  embedded = false,
}: {
  field: VisaField;
  embedded?: boolean;
}) {
  const observation = portalObservations[field.id];
  const secondary =
    field.id === "religion"
      ? fields.find((item) => item.id === "religionOther")
      : undefined;
  const reported = observation?.choices ? undefined : reportedChoices[field.id];
  const choices = observation?.choices ?? reported?.labels;
  const choiceField =
    observation?.control === "Dropdown" ||
    field.type === "select" ||
    !!field.options ||
    [
      "religion",
      "gender",
      "education",
      "birthCountry",
      "purpose",
      "occupation",
    ].includes(field.id);
  const label =
    observation?.displayLabel ?? observation?.label ?? field.officialLabel;
  const { hint, explanation, example, prompt } = fieldHint(field);
  const verifiedAt = observation
    ? (observation.observedAt ?? OBSERVED_AT)
    : (reported?.checkedAt ?? field.verifiedAt ?? REVIEWED_AT);
  const verifiedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${verifiedAt}T00:00:00Z`));
  const help = (
    <>
      <p className="compact-field-hint" id={`${field.id}-hint`}>
        {hint}
      </p>
      {explanation && (
        <p className="compact-field-explanation">{explanation}</p>
      )}
    </>
  );
  const sources = (
    <>
      {[
        ...new Set([
          ...(observation ? [observation.source ?? OBSERVED_SOURCE] : []),
          ...field.helpSources,
        ]),
      ].map((url) => (
        <a key={url} href={url} target="_blank" rel="noreferrer">
          Official source ↗
        </a>
      ))}
      {reported && (
        <a href={reported.source} target="_blank" rel="noreferrer">
          Option-list source ↗
        </a>
      )}
      {field.id === "nationalId" && (
        <a href={US_WALKTHROUGH} target="_blank" rel="noreferrer">
          U.S. applicant walkthrough ↗
        </a>
      )}
      {field.type === "port" && (
        <a href="/reference/airports/">Find an airport by name or code →</a>
      )}
      {field.knownIssueIds.map((id) => (
        <a href={`/problems/${id}/`} key={id}>
          {issues.find((item) => item.id === id)?.title} →
        </a>
      ))}
    </>
  );
  const date = (
    <p className="field-verified small muted">
      {observation ? "Verified At" : "Reviewed"}:{" "}
      <time dateTime={verifiedAt}>{verifiedDate}</time>
    </p>
  );
  return (
    <article
      id={embedded ? undefined : field.id}
      className="field-guide-entry field-reference"
    >
      {!embedded && (
        <div className="compact-field-heading">
          <h2>
            <a href={`#${field.id}`}>{label}</a>
          </h2>
          {observation?.maxLength && (
            <span>{observation.maxLength} characters</span>
          )}
        </div>
      )}
      <div className="field-reference-content">
        {field.type === "port" ? (
          <ArrivalPortPreview id={field.id} label={label} />
        ) : observation?.control === "Read-only" ? (
          <div className="field-preview field-preview-muted">
            Filled from your earlier choices on the official form
          </div>
        ) : observation?.multiple ? (
          <div className="field-preview field-preview-muted">
            Select all applicable countries on the official form
          </div>
        ) : choices ? (
          <FieldChoicePreview
            id={field.id}
            label={label}
            choices={choices}
            secondary={
              secondary
                ? {
                    id: secondary.id,
                    label: secondary.officialLabel,
                    hint: fieldHint(secondary).hint,
                  }
                : undefined
            }
          />
        ) : choiceField ? (
          <div className="field-preview field-preview-muted">
            Choose on the official form
          </div>
        ) : observation?.control === "Checkbox" ? (
          <div className="field-preview field-preview-muted">
            ☐ Confirm on the official form
          </div>
        ) : (
          <FieldTextPreview
            field={field}
            label={label}
            placeholder={
              example ??
              prompt ??
              (field.type === "date" ? "DD/MM/YYYY" : "Try your text here")
            }
          />
        )}
        {help}
        <details className="quiet-disclosure compact-field-details">
          <summary>Details &amp; source</summary>
          <div>
            {!observation && field.evidenceStatus === "NEEDS_VERIFICATION" && (
              <p>Provisional field · compare with your form.</p>
            )}
            {observation?.note && <p>{observation.note}</p>}
            {sources}
            {date}
          </div>
        </details>
      </div>
    </article>
  );
}
