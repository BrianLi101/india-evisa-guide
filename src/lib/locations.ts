import type { ArrivalPort } from "@/content/arrivalPorts";
// Search keys only: never apply this normalization to applicant answers.
export function locationSearchKey(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}
export function matchesLocation(query: string, names: string[]): boolean {
  const tokens = locationSearchKey(query).split(/\s+/).filter(Boolean);
  const haystack = locationSearchKey(names.join(" "));
  return tokens.every((token) => haystack.includes(token));
}
export function searchArrivalPorts(
  ports: ArrivalPort[],
  query: string,
): ArrivalPort[] {
  // One result per port ID, not per alias or city. Two airports in Goa and
  // airport/seaport entries for the same city must remain distinct choices.
  const unique = new Map<string, ArrivalPort>();
  for (const port of ports) {
    if (matchesLocation(query, [port.label, ...port.names, port.code ?? ""]))
      unique.set(port.id, port);
  }
  return [...unique.values()];
}
