import { describe, expect, it } from "vitest";
import { visitorCountEvent } from "../../src/lib/analytics";

describe("visitor counts", () => {
  it.each([
    "/",
    "/walkthrough/",
    "/tools/passport-pdf/",
    "/unknown-private-path/",
  ])("removes all page and applicant context from %s", (path) => {
    expect(
      visitorCountEvent({
        type: "pageview",
        url: `https://example.test${path}?answer=SYNTHETIC#private`,
      }),
    ).toEqual({ type: "pageview", url: "https://example.test/" });
  });
  it("rejects custom events and malformed URLs", () => {
    expect(
      visitorCountEvent({ type: "event", url: "https://example.test/" }),
    ).toBeNull();
    expect(visitorCountEvent({ type: "pageview", url: "invalid" })).toBeNull();
    expect(
      visitorCountEvent({ type: "pageview", url: "file:///private" }),
    ).toBeNull();
  });
});
