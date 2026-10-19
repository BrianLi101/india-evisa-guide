import { describe, it, expect } from "vitest";
import { fields, sections, issues, locations } from "../../src/content/data";
import {
  fieldError,
  fieldWarning,
  formatForCopy,
  isVisible,
  isRequired,
  matches,
  type Answers,
} from "../../src/lib/schema";
const field = (id: string) => {
  const f = fields.find((f) => f.id === id);
  if (!f) throw new Error(id);
  return f;
};
describe("conditional worksheet", () => {
  it("requires the Other religion explanation without mutating user text", () => {
    const answers: Answers = { religion: " OTHERS ", religionOther: "" };
    expect(isVisible(field("religionOther"), answers)).toBe(true);
    expect(isRequired(field("religionOther"), answers)).toBe(true);
    expect(fieldError(field("religionOther"), answers)).toBeDefined();
    expect(answers.religion).toBe(" OTHERS ");
    answers.religion = "Buddhism";
    expect(fieldError(field("religionOther"), answers)).toBeUndefined();
  });
  it("retains hidden answers while excluding them from validation", () => {
    const answers = {
      visitedIndia: "No",
      previousVisaNumber: "SYNTHETIC-ETA-123",
    };
    expect(isVisible(field("previousVisaNumber"), answers)).toBe(false);
    expect(fieldError(field("previousVisaNumber"), answers)).toBeUndefined();
    expect(answers.previousVisaNumber).toBe("SYNTHETIC-ETA-123");
  });
  it("evaluates nested rules deterministically", () => {
    expect(
      matches(
        {
          all: [
            { field: "a", equals: "Yes" },
            {
              any: [
                { field: "b", equals: "No" },
                { field: "b", equals: "Other" },
              ],
            },
          ],
        },
        { a: "YES", b: "Other" },
      ),
    ).toBe(true);
    expect(matches({ field: "missing", equals: "Yes" }, {})).toBe(false);
  });
  it("warns about employer punctuation without rewriting it", () => {
    const value = "Example, Inc. — O’Sample";
    expect(fieldWarning(field("employer"), value)).toMatch(/Reported/);
    expect(formatForCopy(field("employer"), value)).toBe(value);
    expect(fieldError(field("employer"), { employer: value })).toBeUndefined();
  });
  it("rejects missing, impossible, inconsistent and mismatched values", () => {
    expect(fieldError(field("givenNames"), {})).toBeDefined();
    expect(fieldError(field("dob"), { dob: "2025-02-30" })).toMatch(
      /valid calendar/,
    );
    expect(fieldError(field("dob"), { dob: "2099-01-01" })).toMatch(/future/);
    expect(
      fieldError(field("emailConfirm"), {
        email: "a@example.test",
        emailConfirm: "b@example.test",
      }),
    ).toMatch(/match/);
    expect(
      fieldError(field("passportExpiry"), {
        passportIssued: "2030-01-01",
        passportExpiry: "2029-01-01",
      }),
    ).toMatch(/after/);
  });
  it("formats only explicitly typed dates for copying", () => {
    expect(formatForCopy(field("dob"), "1990-02-03")).toBe("03/02/1990");
    expect(formatForCopy(field("givenNames"), "  Nora. Éxample  ")).toBe(
      "  Nora. Éxample  ",
    );
  });
});
describe("content integrity and source boundaries", () => {
  it("has unique stable ids and valid issue/section references", () => {
    expect(new Set(fields.map((f) => f.id)).size).toBe(fields.length);
    for (const f of fields) {
      expect(sections.some((s) => s.id === f.sectionId)).toBe(true);
      for (const id of f.knownIssueIds)
        expect(issues.some((i) => i.id === id)).toBe(true);
    }
  });
  it("never presents unverified dropdown labels as observed", () => {
    for (const l of locations) {
      for (const label of l.liveDropdownLabels) {
        expect(label.source).toMatch(/^https:\/\/indianvisaonline.gov.in/);
        expect(label.observedAt).toBe("2026-10-17");
      }
      if (l.confidence === "NEEDS_VERIFICATION")
        expect(l.liveDropdownLabels).toEqual([]);
    }
    expect(
      fields
        .filter((f) => f.sectionId === "employment")
        .every(
          (f) =>
            f.evidenceStatus === "LIVE_VERIFIED" &&
            f.helpSources.includes(
              "https://indianvisaonline.gov.in/evisa/FamilyDetails",
            ),
        ),
    ).toBe(true);
  });
});
