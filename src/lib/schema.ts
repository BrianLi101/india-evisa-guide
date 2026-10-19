export type EvidenceStatus =
  "OFFICIAL" | "LIVE_VERIFIED" | "REPORTED" | "NEEDS_VERIFICATION";
export type Answers = Record<string, string>;
export type Condition =
  | { field: string; equals: string }
  | { all: Condition[] }
  | { any: Condition[] };
export type VisaSection = {
  id: string;
  title: string;
  order: number;
  officialPageTitle: string;
  description: string;
  evidenceStatus: EvidenceStatus;
  sourceUrls: string[];
  verifiedAt?: string;
};
export type VisaField = {
  id: string;
  sectionId: string;
  order: number;
  officialLabel: string;
  type: "text" | "email" | "date" | "textarea" | "select" | "port";
  description: string;
  placeholder?: string;
  required: boolean;
  visibleWhen?: Condition;
  requiredWhen?: Condition;
  options?: { label: string; evidenceStatus: EvidenceStatus }[];
  validationRules: ("email" | "date" | "past" | "future" | "punctuation")[];
  knownIssueIds: string[];
  helpSources: string[];
  evidenceStatus: EvidenceStatus;
  verifiedAt?: string;
};
export type KnownIssue = {
  id: string;
  title: string;
  answer: string;
  sectionIds: string[];
  fieldIds: string[];
  symptoms: string;
  explanation: string;
  workaround: string;
  evidenceStatus: EvidenceStatus;
  officialUrls: string[];
  otherSources: string[];
  lastVerifiedAt?: string;
  lastReviewedAt: string;
  caveats: string;
};
export type LocationAlias = {
  id: string;
  canonicalName: string;
  aliases: string[];
  airportCode?: string;
  region: string;
  locationKind: "airport" | "seaport" | "landport" | "district";
  aliasSources?: string[];
  publishedName?: string;
  publishedSource?: string;
  liveDropdownLabels: {
    label: string;
    context: string;
    observedAt: string;
    source: string;
  }[];
  confidence: EvidenceStatus;
  caveat: string;
};

export function matches(
  condition: Condition | undefined,
  answers: Answers,
): boolean {
  if (!condition) return true;
  if ("all" in condition)
    return condition.all.every((c) => matches(c, answers));
  if ("any" in condition) return condition.any.some((c) => matches(c, answers));
  return (
    (answers[condition.field] ?? "").trim().toLocaleLowerCase("en") ===
    condition.equals.toLocaleLowerCase("en")
  );
}
export const isVisible = (field: VisaField, answers: Answers) =>
  matches(field.visibleWhen, answers);
export const isRequired = (field: VisaField, answers: Answers) =>
  isVisible(field, answers) &&
  (field.required ||
    (!!field.requiredWhen && matches(field.requiredWhen, answers)));
export function fieldError(
  field: VisaField,
  answers: Answers,
  today = new Date().toISOString().slice(0, 10),
): string | undefined {
  if (!isVisible(field, answers)) return;
  const value = answers[field.id] ?? "";
  if (!value.trim())
    return isRequired(field, answers)
      ? "Add an answer before marking this section ready."
      : undefined;
  if (
    field.type === "port" &&
    !field.options?.some((option) => option.label === value)
  )
    return "Choose a matching port from the dropdown. Your typed or saved text has been kept.";
  if (field.options && !field.options.some((option) => option.label === value))
    return "This saved choice is not in the current preparation options. Check the live form and choose again.";
  if (
    field.validationRules.includes("email") &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  )
    return "Enter a complete email address. Your text has not been changed.";
  if (field.validationRules.includes("date")) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      Number.isNaN(Date.parse(value)) ||
      new Date(value).toISOString().slice(0, 10) !== value
    )
      return "Enter a valid calendar date.";
    if (field.validationRules.includes("past") && value > today)
      return "This date cannot be in the future.";
    if (field.validationRules.includes("future") && value < today)
      return "Check this date; it is in the past.";
  }
  if (field.id === "emailConfirm" && value !== answers.email)
    return "The two email addresses do not match.";
  if (
    field.id === "passportExpiry" &&
    answers.passportIssued &&
    value <= answers.passportIssued
  )
    return "Expiry must be after the passport issue date.";
  if (field.id === "passportIssued" && answers.dob && value < answers.dob)
    return "Issue date is before your birth date. Please check it.";
}
export function fieldWarning(
  field: VisaField,
  value: string,
): string | undefined {
  if (field.validationRules.includes("punctuation") && /[.,]/.test(value))
    return "Reported issue: periods or commas in an employer name may cause the official form to clear fields. Your answer is preserved exactly. Check the punctuation guide before changing a legal name.";
}
export function formatForCopy(field: VisaField, value: string): string {
  // Date inputs have an explicit, visible portal-format preview. Text is never normalized.
  if (field.type === "date" && /^\d{4}-\d{2}-\d{2}$/.test(value))
    return value.split("-").reverse().join("/");
  return value;
}
