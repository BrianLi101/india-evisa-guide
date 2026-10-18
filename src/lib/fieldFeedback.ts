import { portalObservations } from "../content/portalObservations";
import type { VisaField } from "./schema";

export function textLimit(field: VisaField) {
  const observed = portalObservations[field.id]?.maxLength;
  if (observed)
    return { max: observed, perLine: false, source: "live" as const };
  if (field.id === "addressStreet")
    return { max: 35, perLine: true, source: "sample" as const };
}

export function textFeedback(field: VisaField, value: string) {
  const errors: string[] = [];
  const warnings: string[] = [];
  let suggestion: { value: string; reason: string } | undefined;
  const limit = textLimit(field);
  if (limit?.perLine) {
    const lines = value.split(/\r\n|\r|\n/);
    const longLines = lines.flatMap((line, index) =>
      line.length > limit.max ? [index + 1] : [],
    );
    if (longLines.length)
      warnings.push(
        `Line ${longLines.join(", ")} is over ${limit.max} characters. Split the address across lines without omitting details.`,
      );
  } else if (limit && value.length > limit.max) {
    errors.push(
      `${value.length - limit.max} ${value.length - limit.max === 1 ? "character" : "characters"} over the ${limit.max}-character limit.`,
    );
  }
  if (!value) return { errors, warnings, suggestion };

  if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    errors.push("Use a complete email address, like name@example.com.");

  if (field.type === "date") {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
    const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (iso && isCalendarDate(Number(iso[1]), Number(iso[2]), Number(iso[3]))) {
      errors.push("Use DD/MM/YYYY.");
      suggestion = {
        value: `${iso[3]}/${iso[2]}/${iso[1]}`,
        reason: "Day / month / year",
      };
    } else if (
      !match ||
      !isCalendarDate(Number(match[3]), Number(match[2]), Number(match[1]))
    ) {
      errors.push("Enter a valid date as DD/MM/YYYY.");
    }
  }

  if (field.id === "employer") {
    if (/[.,]/.test(value))
      warnings.push("Periods and commas have been reported to reset the form.");
    const formatted = formatCompanyName(value);
    if (formatted && formatted !== value)
      suggestion = {
        value: formatted,
        reason:
          "Punctuation removed; & → AND. Check the name is still accurate.",
      };
  }
  return { errors, warnings, suggestion };
}

function isCalendarDate(year: number, month: number, day: number) {
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return (
    day <=
    [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]
  );
}

// User-requested cleanup, not a claim about the portal’s accepted character set.
// Keep letters (including non-Latin scripts and accents) and numbers; never truncate.
export function formatCompanyName(value: string): string {
  return value
    .replace(/&/g, " AND ")
    .replace(/['’‘ʼ]/g, "")
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
