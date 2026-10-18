import { describe, expect, it } from "vitest";
import { fields } from "../../src/content/data";
import {
  formatCompanyName,
  textFeedback,
  textLimit,
} from "../../src/lib/fieldFeedback";
const field = (id: string) => fields.find((item) => item.id === id)!;

describe("single-field text feedback", () => {
  it("scopes observed limits to the gate rather than all passport fields", () => {
    expect(textLimit(field("gatePassport"))?.max).toBe(14);
    expect(textFeedback(field("gatePassport"), "A".repeat(14)).errors).toEqual(
      [],
    );
    expect(textFeedback(field("gatePassport"), "A".repeat(15)).errors).toEqual([
      "1 character over the 14-character limit.",
    ]);
    expect(textLimit(field("passportNumber"))).toBeUndefined();
    expect(
      textFeedback(field("passportNumber"), "A".repeat(15)).errors,
    ).toEqual([]);
  });
  it("warns per address line based on the sample without rejecting a multi-line address", () => {
    expect(
      textFeedback(
        field("addressStreet"),
        `${"A".repeat(35)}\n${"B".repeat(35)}`,
      ).warnings,
    ).toEqual([]);
    const result = textFeedback(
      field("addressStreet"),
      `Short\n${"B".repeat(36)}`,
    );
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([
      "Line 2 is over 35 characters. Split the address across lines without omitting details.",
    ]);
    expect(textLimit(field("employerAddress"))).toBeUndefined();
  });
  it("offers explicit employer cleanup while preserving letters and the original input", () => {
    const value = "  SYNTHETIC O’Bríen, Inc.  ";
    const result = textFeedback(field("employer"), value);
    expect(result.errors).toEqual([]);
    expect(result.warnings[0]).toContain("reported");
    expect(result.suggestion?.value).toBe("SYNTHETIC OBríen Inc");
    expect(value).toBe("  SYNTHETIC O’Bríen, Inc.  ");
    expect(textFeedback(field("surname"), value).suggestion).toBeUndefined();
    expect(textFeedback(field("employer"), "...").suggestion).toBeUndefined();
    expect(
      textFeedback(field("employer"), "O’Bríen & Sons-Ltd").warnings,
    ).toEqual([]);
  });
  it("cleans company punctuation and spacing without inventing a length limit", () => {
    expect(formatCompanyName("  SYNTHETIC  O’Bríen & Sons-Ltd.  ")).toBe(
      "SYNTHETIC OBríen AND Sons Ltd",
    );
    expect(formatCompanyName("A/B (Europe), Inc. #2")).toBe("A B Europe Inc 2");
    expect(formatCompanyName("Société 東京 １２３")).toBe(
      "Société 東京 １２３",
    );
    expect(formatCompanyName("e\u0301")).toBe("e\u0301");
    expect(formatCompanyName("A".repeat(200))).toHaveLength(200);
    expect(formatCompanyName(" .!? ")).toBe("");
    expect(
      textFeedback(field("employer"), "  Example  Company ").suggestion?.value,
    ).toBe("Example Company");
  });
  it("checks email syntax without applying cross-field worksheet requirements", () => {
    expect(textFeedback(field("email"), "bad address").errors).toHaveLength(1);
    expect(
      textFeedback(field("emailConfirm"), "synthetic@example.test").errors,
    ).toEqual([]);
    expect(textFeedback(field("email"), "").errors).toEqual([]);
  });
  it("validates actual calendar dates and previews unambiguous ISO formatting", () => {
    expect(textFeedback(field("dob"), "29/02/2024").errors).toEqual([]);
    for (const value of [
      "29/02/2023",
      "31/04/2024",
      "01/13/2024",
      "00/01/2024",
      "01/01/0000",
      "03/04/24",
    ])
      expect(textFeedback(field("dob"), value).errors).toHaveLength(1);
    expect(textFeedback(field("dob"), "2024-02-29").suggestion?.value).toBe(
      "29/02/2024",
    );
    expect(textFeedback(field("dob"), "2023-02-29").suggestion).toBeUndefined();
    expect(textFeedback(field("dob"), "03/04/2024").suggestion).toBeUndefined();
  });
});
