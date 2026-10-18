import { fieldHint, reportedChoices } from "../src/content/fieldHints";
import {
  portalObservations,
  OBSERVED_AT,
  OBSERVED_SOURCE,
} from "../src/content/portalObservations";
import {
  arrivalPorts,
  PORTS_OBSERVED_AT,
  PORTS_SOURCE,
} from "../src/content/arrivalPorts";
import { mkdir, writeFile } from "node:fs/promises";
import {
  fields,
  sections,
  issues,
  locations,
  REVIEWED_AT,
  CONTENT_VERSION,
} from "../src/content/data";
await mkdir("public/reference", { recursive: true });
await mkdir("public/agents", { recursive: true });
for (const [file, records] of [
  [
    "fields",
    {
      sections,
      fields: fields.map((field) => ({
        id: field.id,
        sectionId: field.sectionId,
        label: portalObservations[field.id]?.label ?? field.officialLabel,
        description: field.description,
        evidenceStatus: portalObservations[field.id]
          ? "LIVE_VERIFIED"
          : field.evidenceStatus,
        helpSources: field.helpSources,
        knownIssueIds: field.knownIssueIds,
        observed: portalObservations[field.id],
        hint: fieldHint(field),
        reportedChoices: reportedChoices[field.id],
        currentOptionsVerified: !!portalObservations[field.id]?.choices,
        currentRequirednessVerified: false,
      })),
      portalObservations,
      observationDate: OBSERVED_AT,
      observationSource: OBSERVED_SOURCE,
      caveat:
        "Labels and guidance may be sample-based or provisional. Observed records contain directly checked choices and limits. Reported choices are separately sourced and have not been live verified. Unverified preparation options and validation rules are not exported. No complete live-form mapping is claimed.",
    },
  ],
  ["known-issues", issues],
  ["airports", locations],
] as const)
  await writeFile(
    `public/reference/${file}.json`,
    JSON.stringify(
      { version: CONTENT_VERSION, reviewedAt: REVIEWED_AT, records },
      null,
      2,
    ) + "\n",
  );
await writeFile(
  "public/reference/arrival-ports.json",
  JSON.stringify(
    {
      observedAt: PORTS_OBSERVED_AT,
      source: PORTS_SOURCE,
      context: "Registration before applicant gate; not an eligibility list",
      records: arrivalPorts,
    },
    null,
    2,
  ) + "\n",
);
await writeFile(
  "public/agents/index.md",
  `# India e-Visa Companion public reference\n\nSearchable field guidance. No applicant answer entry. Not a government service.\n\n- [Field schema](/reference/fields.json)\n- [Known issues](/reference/known-issues.json)\n- [Location aliases](/reference/airports.json)\n- [Observed arrival choices](/reference/arrival-ports.json)\n\nReviewed ${REVIEWED_AT}. OFFICIAL denotes published government guidance (often the sample form, not the current UI). LIVE_VERIFIED denotes an observed interface detail. REPORTED is user research. NEEDS_VERIFICATION is unresolved. Preserve those distinctions.\n\nPublic registration labels, nationality/passport-type/arrival choices and selected HTML input limits were observed on 17 October 2026. Religion choices are unverified; no applicant session was entered. Alternate-name/code mappings have separate primary sources; unmapped aliases and district research remain incomplete. Later screens are sample-based and occupation fields are provisional. Nothing here proves eligibility or acceptance. Applicant answers and files must never be transmitted to a server.\n`,
);
await writeFile(
  "public/robots.txt",
  "User-agent: *\nAllow: /\nDisallow: /worksheet/\n",
);
const routes = [
  "/",
  "/before-you-start/",
  "/after-approval/",
  "/guide/",
  "/problems/",
  "/tools/passport-pdf/",
  "/tools/photo-jpeg/",
  "/reference/airports/",
  "/privacy/",
  ...sections.map((s) => `/guide/${s.id}/`),
  ...issues.map((i) => `/problems/${i.id}/`),
];
// Relative locations are a local-preview artifact. Deployment requires a canonical SITE_URL.
const origin = process.env.SITE_URL;
if (origin) {
  const url = new URL(origin);
  if (!["https:", "http:"].includes(url.protocol))
    throw new Error("SITE_URL must be HTTP(S).");
  await writeFile(
    "public/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((path) => `<url><loc>${new URL(path, origin).href.replaceAll("&", "&amp;")}</loc><lastmod>${REVIEWED_AT}</lastmod></url>`).join("")}</urlset>`,
  );
  await writeFile(
    "public/robots.txt",
    `User-agent: *\nAllow: /\nDisallow: /worksheet/\nSitemap: ${new URL("/sitemap.xml", origin).href}\n`,
  );
} else
  await writeFile(
    "public/sitemap.xml",
    '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Local prototype: set SITE_URL to generate canonical public URLs before publishing. -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>\n',
  );
