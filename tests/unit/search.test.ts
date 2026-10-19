import { reportedChoices } from "../../src/content/fieldHints";
import { describe, expect, it } from "vitest";
import { searchGuides } from "../../src/lib/search";
import { fields } from "../../src/content/data";
import {
  nationalityLabels,
  portalObservations,
} from "../../src/content/portalObservations";

describe("field guide discovery and evidence", () => {
  it("ranks exact labels first and matches reordered words and aliases", () => {
    expect(searchGuides("religion")[0].url).toBe("/#religion");
    expect(
      searchGuides("arrival port").some((r) => r.url.endsWith("#arrivalPort")),
    ).toBe(true);
    expect(searchGuides("faith")[0].url).toBe("/#religion");
    expect(searchGuides("agnostic")[0].url).toBe("/#religion");
    expect(searchGuides("non religious")[0].url).toBe("/#religion");
    expect(
      searchGuides("previous visa number").some((r) =>
        r.url.endsWith("#previousVisaNumber"),
      ),
    ).toBe(true);
    expect(searchGuides("   ")).toEqual([]);
    expect(searchGuides("unfindable-xyz-739283")).toEqual([]);
  });
  it("finds the arrival field from every mapped airport name and code", () => {
    for (const query of [
      "Kempegowda",
      "BLR",
      "Thiruvananthapuram",
      "Kozhikode",
      "GOX",
      "BOM",
    ])
      expect(
        searchGuides(query).some((result) => result.url === "/#arrivalPort"),
      ).toBe(true);
  });
  it("keeps reported lists separate from live observations and searchable", () => {
    expect(reportedChoices.religion.evidenceStatus).toBe("REPORTED");
    expect(reportedChoices.religion.labels).toHaveLength(11);
    expect(reportedChoices.religion.labels).toContain("OTHERS");
    expect(reportedChoices.education.labels).toHaveLength(9);
    expect(portalObservations.religion.source).toContain("/BasicDetails");
    expect(searchGuides("JAINISM")[0].url).toBe("/#religion");
    expect(
      searchGuides("US national ID").some((r) => r.url.endsWith("#nationalId")),
    ).toBe(true);
  });
  it("keeps every observed fact scoped to an existing exact label", () => {
    for (const [id, observation] of Object.entries(portalObservations)) {
      expect(fields.find((f) => f.id === id)?.officialLabel).toBe(
        observation.label,
      );
      if (observation.control !== "Read-only")
        expect(observation.elementId).toBeTruthy();
      expect(observation.context).toBeTruthy();
      if (observation.maxLength)
        expect(observation.maxLength).toBeGreaterThan(0);
    }
    expect(portalObservations.religion.source).toContain("/BasicDetails");
    expect(portalObservations.passportNumber.source).toContain("/BasicDetails"); // independently observed later control
    expect(portalObservations.gatePassport.maxLength).toBe(14);
    expect(portalObservations.email.maxLength).toBe(50);
    expect(nationalityLabels).toHaveLength(179);
    expect(nationalityLabels).toContain("COTE D\\'IVOIRE");
    expect(portalObservations.arrivalPort.choices).toHaveLength(86);
  });
});
