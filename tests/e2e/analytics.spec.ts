import { test, expect } from "@playwright/test";

test("local builds do not load analytics", async ({ page }) => {
  test.skip(
    process.env.NEXT_PUBLIC_VISITOR_ANALYTICS === "true",
    "Analytics-enabled build",
  );
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(requests.some((url) => url.includes("/_vercel/insights/"))).toBe(
    false,
  );
  await expect(page.locator('script[src*="/_vercel/insights/"]')).toHaveCount(
    0,
  );
});

test("visitor counts omit page details and never track search or file interactions", async ({
  page,
}) => {
  test.skip(
    process.env.NEXT_PUBLIC_VISITOR_ANALYTICS !== "true",
    "Run against an analytics-enabled build",
  );
  const payloads: unknown[] = [];
  await page.route("**/_vercel/insights/view", async (route) => {
    payloads.push(route.request().postDataJSON());
    await route.fulfill({ status: 200, body: "{}" });
  });
  // Model the SDK script's beforeSend and route handling without sending telemetry.
  await page.route("**/_vercel/insights/script.js", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: `(() => {
      let beforeSend = (event) => event;
      window.va = (type, properties) => {
        if (type === 'beforeSend') beforeSend = properties;
        if (type === 'pageview' || type === 'event') {
          const event = beforeSend({type, url: location.href});
          if (event) fetch('/_vercel/insights/view', {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({...event, route: properties.route, path: properties.path})
          });
        }
      };
      (window.vaq || []).forEach(([type, properties]) => window.va(type, properties));
    })();`,
    }),
  );
  await page.goto("/?private=SYNTHETIC#passportNumber");
  await expect.poll(() => payloads.length).toBe(1);
  expect(payloads[0]).toEqual({
    type: "pageview",
    url: "http://127.0.0.1:4173/",
    route: "/",
    path: "/",
  });
  await page
    .getByLabel("Search fields and common problems")
    .fill("SYNTHETIC private search");
  await page.evaluate(() =>
    window.va?.("event", { name: "forbidden", data: { answer: "SYNTHETIC" } }),
  );
  await page.waitForLoadState("networkidle");
  expect(payloads).toHaveLength(1);

  await page.goto("/tools/passport-pdf/?private=SYNTHETIC");
  await expect.poll(() => payloads.length).toBe(2);
  expect(payloads[1]).toEqual(payloads[0]);
  await page
    .getByLabel("Choose passport file")
    .setInputFiles("tests/fixtures/synthetic-passport.png");
  await expect(
    page.getByRole("button", { name: "Download PDF" }),
  ).toBeEnabled();
  await page.waitForLoadState("networkidle");
  expect(payloads).toHaveLength(2);
});
