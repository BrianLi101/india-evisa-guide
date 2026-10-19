import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const faqIds = [
  "employer-punctuation",
  "religion-other",
  "selections-reset",
  "saved-application-fields",
  "eta-or-application-id",
  "visa-place-of-issue",
  "airport-names",
  "address-mapping",
  "reference-in-india",
  "national-id",
  "upload-action",
  "document-requirements",
  "payment-pending",
];
const removedCopy =
  /SPEC\.md|initial user research|not official evidence|What we know|Your next step|Keep in mind|Sources & review/i;

test("all FAQs show a concise answer and recorded date, inline and at their existing URLs", async ({
  page,
}) => {
  await page.goto("/problems/");
  await expect(page.locator(".faq-item")).toHaveCount(faqIds.length);
  await expect(page.locator(".faq-item[open]")).toHaveCount(0);
  await expect(page.getByRole("main")).not.toContainText(removedCopy);
  await expect(page.locator(".evidence, .problem-filters")).toHaveCount(0);
  const answers = new Map<string, string>();
  const dates = new Map<string, string>();
  for (const id of faqIds) {
    const faq = page.locator(`#${id}`);
    await faq.locator(":scope > summary").click();
    const answer = faq.locator(".faq-answer");
    await expect(answer).toBeVisible();
    await expect(answer).not.toBeEmpty();
    const text = await answer.innerText();
    const introduction = await answer.locator("p").innerText();
    expect(introduction.trim().split(/\s+/).length).toBeLessThanOrEqual(40);
    if (id === "airport-names") {
      await expect(answer.getByRole("listitem")).toHaveText([
        "Thiruvananthapuram / Trivandrum (TRV) — TRIVANDRUM AIRPORT.",
        "Bengaluru / Bangalore / Kempegowda (BLR) — BENGALURU AIRPORT.",
        "Kochi / Cochin (COK) — COCHIN AIRPORT.",
        "Kozhikode / Calicut (CCJ) — CALICUT AIRPORT.",
        "Mangaluru / Mangalore (IXE) — MANGALORE AIRPORT.",
      ]);
    } else {
      await expect(answer.getByRole("listitem")).toHaveCount(0);
    }
    const date = faq.locator(".faq-verified time");
    await expect(date).toHaveAttribute(
      "datetime",
      id === "reference-in-india" ? "2026-10-19" : /^2026-10-1[67]$/,
    );
    const dateBox = await date.boundingBox();
    const answerBox = await answer.boundingBox();
    expect(dateBox!.y).toBeGreaterThan(answerBox!.y + answerBox!.height);
    answers.set(id, text);
    dates.set(id, await date.innerText());
  }
  for (const id of faqIds) {
    await page.goto(`/problems/${id}/`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator(".faq-answer")).toHaveText(answers.get(id)!, {
      useInnerText: true,
    });
    await expect(page.locator(".faq-verified")).toHaveText(
      `Verified: ${dates.get(id)}`,
    );
    await expect(page.locator("article p")).toHaveCount(2);
    await expect(page.locator("article h2, article .evidence")).toHaveCount(0);
    await expect(page.getByRole("main")).not.toContainText(removedCopy);
  }
  await page.getByRole("link", { name: "All common problems" }).click();
  await expect(page.locator(".faq-item")).toHaveCount(faqIds.length);
});

test("FAQ search and keyboard help stay local and fit desktop and mobile", async ({
  page,
}) => {
  await page.goto("/problems/");
  await page.waitForLoadState("networkidle");
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.route("**/*", (route) => route.abort());
  const search = page.getByRole("searchbox", {
    name: "Search common problems",
  });
  await search.fill("SYNTHETIC-PRIVATE-QUERY");
  await expect(page.getByRole("status")).toHaveText("0 questions");
  await expect(
    page.getByText("No matching questions. Try another word or phrase."),
  ).toBeVisible();
  for (const query of ["Bangalore", "Kochi", "CCJ", "IXE"]) {
    await search.fill(query);
    await expect(page.locator("#airport-names")).toBeVisible();
  }
  await search.fill("hotel");
  await expect(page.getByRole("status")).toHaveText("1 question");
  await page.locator("#reference-in-india > summary").click();
  await expect(page.locator("#reference-in-india .faq-answer")).toHaveText(
    "You can provide the name of a family member or friend in India, or the hotel where you’re staying.",
  );
  await search.fill("save exit");
  await expect(page.getByRole("status")).toHaveText("1 question");
  await page.locator("#saved-application-fields > summary").click();
  await expect(page.locator(".faq-answer")).toContainText(
    "does not always save every field",
  );
  await page.screenshot({ path: "test-results/faq-saved-application.png" });
  await search.fill("cleared employer");
  await expect(page.getByRole("status")).toHaveText("1 question");
  const toggle = page.locator("#employer-punctuation > summary");
  await toggle.focus();
  await toggle.press("Enter");
  await expect(page.locator(".faq-answer")).toBeVisible();
  await toggle.press("Space");
  await expect(page.locator(".faq-answer")).toBeHidden();
  await search.fill("");
  await page.locator("#airport-names > summary").click();
  for (const [name, width] of [
    ["desktop", 1440],
    ["mobile", 390],
    ["small-mobile", 320],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    await toggle.click();
    await expect(
      page.locator("#employer-punctuation .faq-answer"),
    ).toBeVisible();
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({ path: `test-results/faq-list-${name}.png` });
    await toggle.click();
  }
  expect(requests).toEqual([]);
  expect(page.url()).toMatch(/\/problems\/$/);
  expect(
    await page.evaluate(async () => ({
      local: { ...localStorage },
      session: { ...sessionStorage },
      cookies: document.cookie,
      databases: await indexedDB.databases(),
    })),
  ).toEqual({ local: {}, session: {}, cookies: "", databases: [] });
  await page.unroute("**/*");
  await page.goto("/problems/airport-names/");
  for (const [name, width] of [
    ["desktop", 1440],
    ["mobile", 390],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({ path: `test-results/faq-answer-${name}.png` });
  }
  await page.goto("/");
  await page.getByRole("searchbox").fill("Bangalore");
  await page
    .getByRole("link", {
      name: "FAQ Why is my arrival airport listed under a different name?",
    })
    .click();
  await expect(page.getByRole("listitem")).toHaveCount(5);
  await page.goto("/");
  await page.getByRole("searchbox").fill("reference India");
  await page
    .getByRole("link", { name: "FAQ Who do I use as my reference in India?" })
    .click();
  await expect(page).toHaveURL("/problems/reference-in-india/");
  await expect(page.locator(".faq-answer")).toContainText("hotel where you’re staying");
});
