import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";
async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory()
          ? walk(join(dir, e.name))
          : Promise.resolve([join(dir, e.name)]),
      ),
    )
  ).flat();
}
const hashes = new Set<string>();
const pages = [];
for (const path of (await walk("out")).filter((p) => p.endsWith(".html"))) {
  const html = await readFile(path, "utf8");
  for (const match of html.matchAll(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
  )) {
    if (!/\bsrc=/.test(match[1]))
      hashes.add(
        `'sha256-${createHash("sha256").update(match[2]).digest("base64")}'`,
      );
  }
  pages.push({ path, html });
}
const analyticsEnabled =
  (process.env.NEXT_PUBLIC_VISITOR_ANALYTICS ??
    (process.env.VERCEL_ENV === "production" ? "true" : "false")) === "true";
// Vercel serves the visitor-count endpoint on the deployment's own origin.
// CSP cannot express an origin-relative path, so analytics builds allow self.
const connections = analyticsEnabled ? "'self'" : "'none'";
const csp = `default-src 'none'; script-src 'self' ${[...hashes].join(" ")}; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; connect-src ${connections}; object-src 'none'; frame-src blob:; worker-src blob:; base-uri 'none'; form-action 'none';`;
for (const { path, html } of pages)
  await writeFile(
    path,
    html.replace(
      "<head>",
      `<head><meta http-equiv="Content-Security-Policy" content="${csp}"><meta name="referrer" content="no-referrer">`,
    ),
  );
await writeFile(
  "out/_headers",
  `/*\n  Content-Security-Policy: ${csp} frame-ancestors 'none';\n  Referrer-Policy: no-referrer\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n`,
);
await writeFile(
  "out/security-policy.json",
  JSON.stringify({ csp: `${csp} frame-ancestors 'none';` }),
);
console.log(
  `Hardened ${pages.length} static HTML pages. Runtime connections: ${connections}.`,
);
