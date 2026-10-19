import { arrivalPorts } from "../content/arrivalPorts";
import { fieldHint, reportedChoices } from "../content/fieldHints";
import { fields, issues, sections } from "../content/data";
import { portalObservations } from "../content/portalObservations";
const aliases: Record<string, string> = {
  religion: "faith belief multiple choice dropdown other",
  previousVisaNumber: "previous visa number eta number application id",
  nationalId:
    "national identity citizenship id number usa us united states ssn social security na",
  employer: "company business punctuation reset",
  arrivalPort: `airport entry port landing ${arrivalPorts.flatMap((port) => [port.label, ...port.names, port.code ?? ""]).join(" ")}`,
  education: "education degree qualification dropdown",
};
export function normalizeSearch(value: string) {
  return value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}
const records = [
  ...fields.map((f) => ({
    title:
      portalObservations[f.id]?.displayLabel ??
      portalObservations[f.id]?.label ??
      f.officialLabel,
    kind: "Field guide",
    section: sections.find((s) => s.id === f.sectionId)?.title ?? "",
    url: `/#${f.id}`,
    terms: `${f.id.replace(/([a-z])([A-Z])/g, "$1 $2")} ${f.description} ${fieldHint(f).hint} ${fieldHint(f).explanation ?? ""} ${reportedChoices[f.id]?.labels.join(" ") ?? ""} ${aliases[f.id] ?? ""} ${portalObservations[f.id]?.choices?.join(" ") ?? ""}`,
  })),
  ...issues.map((i) => ({
    title: i.title,
    kind: "FAQ",
    section: "Common problems",
    url: `/problems/${i.id}/`,
    terms: `${i.symptoms} ${i.answer} ${i.workaround}`,
  })),
  {
    title: "After you’re approved",
    kind: "Travel preparation",
    section: "Before you fly",
    url: "/after-approval/",
    terms:
      "approval status print status eta pdf download airline airport travel application id passport number",
  },
];
export function searchGuides(query: string) {
  const q = normalizeSearch(query);
  if (!q) return [];
  const words = q.split(/\s+/);
  return records
    .map((record) => {
      const title = normalizeSearch(record.title);
      const haystack = `${title} ${normalizeSearch(record.terms)}`;
      const score =
        title === q
          ? 100
          : title.includes(q)
            ? 50
            : words.every((word) => haystack.includes(word))
              ? 10
              : 0;
      return { ...record, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}
