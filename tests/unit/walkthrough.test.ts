import { describe, expect, it } from "vitest";
import { fields, issues } from "../../src/content/data";
import {
  walkthroughPages,
  walkthroughPageForHash,
} from "../../src/content/walkthrough";

const entries = walkthroughPages.flatMap((page) =>
  page.groups.flatMap((group) => group.fields),
);

describe("walkthrough coverage and source boundaries", () => {
  it("covers guide fields once with unique anchors, omitting portal confirmations", () => {
    expect(new Set(entries.map((item) => item.id)).size).toBe(entries.length);
    const linked = entries.flatMap((item) =>
      item.fieldId ? [item.fieldId] : [],
    );
    expect([...linked].sort()).toEqual(
      fields
        .filter((field) => !["captcha", "instructions"].includes(field.id))
        .map((field) => field.id)
        .sort(),
    );
    for (const item of entries) {
      expect(item.label.trim()).not.toBe("");
      expect(item.hint.trim()).not.toBe("");
      for (const id of item.issueIds ?? [])
        expect(issues.some((issue) => issue.id === id)).toBe(true);
    }
  });
  it("keeps conditional prompts after their trigger and on its page", () => {
    for (const [trigger, dependent] of [
      ["nameChanged", "previousName"],
      ["religion", "religionOther"],
      ["otherPassport", "otherPassportIssued"],
      ["maritalStatus", "spouseName"],
      ["visitedIndia", "previousVisaNumber"],
      ["saarcVisited", "saarcDetails"],
      ["arrested", "arrestedDetails"],
    ]) {
      const page = walkthroughPageForHash(`#${trigger}`);
      expect(walkthroughPageForHash(`#${dependent}`)).toBe(page);
      const rows = walkthroughPages[page].groups.flatMap(
        (group) => group.fields,
      );
      expect(rows.findIndex((row) => row.id === dependent)).toBeGreaterThan(
        rows.findIndex((row) => row.id === trigger),
      );
      expect(rows.find((row) => row.id === dependent)?.when).toBeTruthy();
    }
  });
  it("omits review and keeps live pages separate from later sample-only coverage", () => {
    expect(walkthroughPages).toHaveLength(8);
    expect(walkthroughPages.some((page) => page.id === "review")).toBe(false);
    expect(entries.some((row) => row.id.startsWith("review"))).toBe(false);
    expect(
      walkthroughPages
        .slice(0, 6)
        .every((page) => page.evidenceStatus === "LIVE_VERIFIED"),
    ).toBe(true);
    expect(
      walkthroughPages
        .slice(6)
        .every((page) => page.evidenceStatus === "OFFICIAL"),
    ).toBe(true);
    const employment = walkthroughPages[2].groups.find(
      (group) => group.title === "Profession / Occupation Details of Applicant",
    )!;
    expect(employment.provisional).toBeUndefined();
    expect(
      employment.fields.some((field) => field.id === "employerPhone"),
    ).toBe(true);
  });
  it("resolves only known public page/field anchors and falls back safely", () => {
    expect(walkthroughPageForHash("#page-documents")).toBe(6);
    expect(walkthroughPageForHash("#religionOther")).toBe(1);
    expect(walkthroughPageForHash("#not-a-field")).toBe(0);
    expect(walkthroughPageForHash("")).toBe(0);
  });
});
