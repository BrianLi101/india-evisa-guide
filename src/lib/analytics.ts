import type { BeforeSendEvent } from "@vercel/analytics/react";

// Count site visits without disclosing the visited page, query, or fragment.
// Custom events (including any future interaction tracking) are rejected.
export function visitorCountEvent(
  event: BeforeSendEvent,
): BeforeSendEvent | null {
  if (event.type !== "pageview") return null;
  try {
    const url = new URL(event.url);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return { type: "pageview", url: `${url.origin}/` };
  } catch {
    return null;
  }
}
