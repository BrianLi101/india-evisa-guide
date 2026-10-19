import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  liveCapture,
  liveFields,
  liveScreens,
} from "../../src/content/livePortal";
import choices from "../../src/content/livePortalChoices.json" with { type: "json" };
import { arrivalPorts } from "../../src/content/arrivalPorts";
import { portalObservations } from "../../src/content/portalObservations";
import { fields } from "../../src/content/data";
import { isVisible } from "../../src/lib/schema";
const hash = (value: string) => {
  let h = 2166136261;
  for (const c of value) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16);
};
describe("live portal capture", () => {
  it("preserves complete catalogs against checksums from browser observations", () => {
    expect(choices.countries).toHaveLength(263);
    expect(hash(JSON.stringify(choices.countries))).toBe("74e760de");
    expect(hash(JSON.stringify(choices.countriesVisited))).toBe("a8108406");
    const districts = readFileSync(
      "reference/portal/district-labels-2026-10-18.txt",
      "utf8",
    ).trim();
    expect(districts.split("\n")).toHaveLength(821);
    expect(hash(districts)).toBe("46b37b4e");
    expect(hash(arrivalPorts.map((port) => port.label).join("\n"))).toBe(
      "73aa878",
    );
    expect(choices.gender.map((choice) => choice.label)).toEqual([
      "MALE",
      "FEMALE",
      "TRANSGENDER",
    ]);
    expect(choices.education.map((choice) => choice.label)).toContain(
      "POST GRADUATE",
    );
    expect(choices.occupation).toHaveLength(41);
    expect(choices.previousVisaType).toHaveLength(24);
  });
  it("retains metadata for plain rows and distinguishes markers from HTML enforcement", () => {
    expect(liveFields.find((field) => field.id === "birthCity")).toMatchObject({
      maxLength: 50,
      requiredMarker: true,
      htmlRequired: false,
    });
    expect(
      liveFields.find((field) => field.id === "employerPhone"),
    ).toMatchObject({
      maxLength: 15,
      requiredMarker: false,
      htmlRequired: false,
    });
    expect(portalObservations.visaArrival.control).toBe("Read-only");
    expect(portalObservations.exitPort.choices).toHaveLength(86);
    expect(portalObservations.visaService.choices).toBeUndefined();
    expect(liveCapture.photo.stoppingPoint).toContain("No file uploaded");
    expect(
      liveCapture.validationObservations.some(
        (observation) => observation.message === "Mobile number is required",
      ),
    ).toBe(true);
  });
  it("keeps section hierarchy and tested conditional fields without losing answers", () => {
    expect(liveScreens[1].groups[0].headings).toEqual([
      "Applicant's Address Details",
      "Present Address",
    ]);
    for (const [id, trigger, value] of [
      ["occupationOther", "occupation", "OTHERS"],
      ["spousePreviousNationality", "maritalStatus", "MARRIED"],
      ["militaryRank", "military", "Yes"],
      ["operatorHotel", "tourOperator", "Yes"],
      ["saarcYear", "saarcVisited", "Yes"],
    ]) {
      const field = fields.find((field) => field.id === id)!;
      const answers = { [trigger]: value, [id]: "SYNTHETIC" };
      expect(isVisible(field, answers)).toBe(true);
      expect(isVisible(field, { ...answers, [trigger]: "No" })).toBe(false);
      expect(answers[id]).toBe("SYNTHETIC");
    }
  });
});
