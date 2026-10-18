import ArrivalPortPreview from "./ArrivalPortPreview";
import FieldTextPreview from "./FieldTextPreview";
import FieldChoicePreview from "./FieldChoicePreview";
import { issues, REVIEWED_AT } from "@/content/data";
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

export default function FieldReference({ field }: { field: VisaField }) {
  const observation = portalObservations[field.id];
  const reported = reportedChoices[field.id];
  const choices = observation?.choices ?? reported?.labels;
  const choiceField =
    observation?.control === "Dropdown" ||
    !!field.options ||
    [
      "religion",
      "gender",
      "education",
      "birthCountry",
      "purpose",
      "occupation",
    ].includes(field.id);
  const label = observation?.label ?? field.officialLabel;
  const { hint, explanation, example, prompt } = fieldHint(field);
  const verifiedAt = observation
    ? OBSERVED_AT
    : (reported?.checkedAt ?? field.verifiedAt ?? REVIEWED_AT);
  const verifiedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${verifiedAt}T00:00:00Z`));
  return (
    <article id={field.id} className="field-guide-entry">
      <div className="compact-field-heading">
        <h2>
          <a href={`#${field.id}`}>{label}</a>
        </h2>
        {observation?.maxLength && (
          <span>{observation.maxLength} characters</span>
        )}
      </div>
      {field.id === "arrivalPort" ? (
        <ArrivalPortPreview label={label} />
      ) : choices ? (
        <FieldChoicePreview
          id={field.id}
          label={label}
          choices={choices}
          secondary={
            field.id === "religion"
              ? {
                  id: "religionOther",
                  label: "If Others, Please specify",
                  hint: "Enter your explanation, or NA if not applicable.",
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
      <p className="compact-field-hint" id={`${field.id}-hint`}>
        {hint}
      </p>
      {explanation && (
        <p className="compact-field-explanation">{explanation}</p>
      )}
      <details className="quiet-disclosure compact-field-details">
        <summary>Details & source</summary>
        <div>
          {observation ? (
            <a href={OBSERVED_SOURCE} target="_blank" rel="noreferrer">
              Official form ↗
            </a>
          ) : (
            <>
              {field.helpSources.map((url) => (
                <a key={url} href={url} target="_blank" rel="noreferrer">
                  Official source ↗
                </a>
              ))}
            </>
          )}
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
          {field.id === "arrivalPort" && (
            <a href="/reference/airports/">Find an airport by name or code →</a>
          )}
          {field.knownIssueIds.map((id) => (
            <a href={`/problems/${id}/`} key={id}>
              {issues.find((i) => i.id === id)?.title} →
            </a>
          ))}
        </div>
      </details>
      <p className="field-verified small muted">
        {observation ? "Verified At" : "Reviewed"}:{" "}
        <time dateTime={verifiedAt}>{verifiedDate}</time>
      </p>
    </article>
  );
}
