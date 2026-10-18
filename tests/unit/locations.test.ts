import { describe, expect, it } from "vitest";
import { arrivalPorts, portAliases } from "../../src/content/arrivalPorts";
import { searchArrivalPorts } from "../../src/lib/locations";
import { fields } from "../../src/content/data";
import { fieldError, formatForCopy } from "../../src/lib/schema";
const ids = (query: string) =>
  searchArrivalPorts(arrivalPorts, query).map((port) => port.id);
describe("arrival port identity and aliases", () => {
  it("keeps every observed port unique with source-backed mappings", () => {
    expect(arrivalPorts).toHaveLength(86);
    expect(new Set(arrivalPorts.map((port) => port.id)).size).toBe(86);
    expect(new Set(arrivalPorts.map((port) => port.label)).size).toBe(86);
    for (const [id, mapping] of Object.entries(portAliases)) {
      expect(arrivalPorts.some((port) => port.id === id)).toBe(true);
      expect(mapping.sources.length).toBeGreaterThan(0);
    }
  });
  it("resolves old/new names and codes to the same port without duplicate options", () => {
    for (const query of [
      "Thiruvananthapuram",
      "Trivandrum",
      "trv",
      "  TRÍVANDRUM, airport  ",
      "Thiruvananthapuram International Airport",
      "TRV Trivandrum",
    ])
      expect(ids(query)).toEqual(["I023"]);
    for (const query of ["Bangalore", "BLR", "Kempegowda"])
      expect(ids(query)).toEqual(["I085"]);
    expect(ids("Kochi")).toEqual(["I024"]);
    expect(ids("Kozhikode")).toEqual(["I010"]);
    expect(ids("Madras")).toEqual(["I008"]);
    expect(ids("Bombay")).toEqual(["I001"]);
    expect(ids("Calcutta")).toEqual(["I002"]);
    expect(ids("Trichy")).toEqual(["I003"]);
    expect(ids("Mangaluru")).toEqual(["I092"]);
    expect(
      searchArrivalPorts(
        [...arrivalPorts, arrivalPorts.find((port) => port.id === "I024")!],
        "Kochi",
      ),
    ).toHaveLength(1);
  });
  it("never collapses different airports or modes in one city", () => {
    expect(ids("Goa")).toEqual(["I033", "I034", "I283"]);
    expect(ids("GOI")).toEqual(["I033"]);
    expect(ids("GOX")).toEqual(["I034"]);
    expect(ids("Cochin")).toEqual(["I024", "I224"]);
    expect(ids("Vizhinjam")).toEqual(["I228", "I226"]);
    expect(ids("unknown imaginary port")).toEqual([]);
    expect(ids("Gurgaon")).toEqual([]);
  });
  it("requires a portal choice and preserves legacy or unmatched text literally", () => {
    const field = fields.find((field) => field.id === "arrivalPort")!;
    const answers = { arrivalPort: "  Trivandrum  " };
    expect(fieldError(field, answers)).toMatch(/dropdown/);
    expect(answers.arrivalPort).toBe("  Trivandrum  ");
    expect(formatForCopy(field, answers.arrivalPort)).toBe("  Trivandrum  ");
    expect(
      fieldError(field, { arrivalPort: "TRIVANDRUM AIRPORT" }),
    ).toBeUndefined();
    expect(fieldError(field, { arrivalPort: "" })).toBeDefined();
  });
});
