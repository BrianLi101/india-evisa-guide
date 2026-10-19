import AxeBuilder from "@axe-core/playwright";
import { test, expect, type Locator } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { PDFDocument } from "pdf-lib";
import path from "node:path";
import { encryptDraft, newSession } from "../../src/lib/draft";
const fixture = (name: string) => path.resolve("tests/fixtures", name);

async function expectInlineCopy(input: Locator, button: Locator) {
  const fieldBox = await input.boundingBox();
  const buttonBox = await button.boundingBox();
  expect(fieldBox).not.toBeNull();
  expect(buttonBox).not.toBeNull();
  expect(buttonBox!.x).toBeGreaterThanOrEqual(fieldBox!.x + fieldBox!.width);
  expect(Math.abs(buttonBox!.y - fieldBox!.y)).toBeLessThan(2);
  expect(buttonBox!.width).toBeGreaterThanOrEqual(44);
  await expect(button).toHaveText("");
  await expect(button.locator("svg")).toHaveCount(1);
}

test("search stays local and opens selectable field guidance", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.route("**/*", (r) => r.abort());
  const search = page.getByRole("searchbox");
  await search.fill("SYNTHETIC-PRIVATE-QUERY");
  await expect(page.getByRole("status")).toContainText("No matches");
  await search.fill("religion");
  await expect(page.locator(".search-results a").first()).toHaveAttribute(
    "href",
    "/#religion",
  );
  await search.fill("passport");
  await page.getByRole("button", { name: /Show all/ }).click();
  await expect(page.locator(".search-results a")).not.toHaveCount(8);
  expect(requests).toEqual([]);
  expect(page.url()).not.toContain("religion");
  expect(
    await page.evaluate(async () => ({
      local: { ...localStorage },
      session: { ...sessionStorage },
      cookies: document.cookie,
      databases: await indexedDB.databases(),
    })),
  ).toEqual({ local: {}, session: {}, cookies: "", databases: [] });
  await search.fill("religion");
  await page.locator(".search-results a").first().click();
  await expect(page).toHaveURL(/\/#religion$/);
  await expect(page.locator(".field-guide-entry")).toHaveCount(1);
  await expect(page.locator(".search-results")).toHaveCount(0);
  await expect(
    page.getByRole("navigation", { name: "Preparation tools" }),
  ).toBeHidden();
  await expect(
    page.getByRole("link", { name: "Browse all fields" }),
  ).toHaveCount(0);
  const religion = page.locator("article#religion");
  await expect(
    religion.getByRole("combobox", { name: "Religion", exact: true }),
  ).toBeVisible();
  await religion.getByRole("combobox").click();
  await expect(religion.getByRole("option").locator("strong")).toHaveText([
    "BAHAI",
    "BUDDHISM",
    "CHRISTIAN",
    "HINDU",
    "ISLAM",
    "JAINISM",
    "JUDAISM",
    "OTHERS",
    "PARSI",
    "SIKH",
    "ZOROASTRIAN",
  ]);
  await expect(religion.getByRole("option", { name: /OTHERS/ })).toContainText(
    "Agnostic · Atheist · Non-religious · Not religious",
  );
  await page.keyboard.press("Escape");
  await expect(religion.locator(".field-verified")).toBeHidden();
  await religion.getByText("Details & source", { exact: true }).click();
  await expect(religion.locator(".field-verified")).toBeVisible();
  await expect(
    religion.getByRole("link", { name: "Official source" }).first(),
  ).toHaveAttribute(
    "href",
    "https://indianvisaonline.gov.in/evisa/BasicDetails",
  );
  await expect(religion).toContainText("Verified At: 18 October 2026");
  await religion.screenshot({ path: "test-results/field-source-date.png" });
  await expect(page.locator('a[href^="/worksheet/"]')).toHaveCount(0);
  await page.screenshot({ path: "test-results/religion-guide.png" });
  expect(requests).toEqual([]);
  await search.fill("national id");
  await expect(religion).toHaveCount(0);
  await page.locator('.search-results a[href="/#nationalId"]').focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".field-guide-entry")).toHaveCount(1);
  await expect(page.locator("#nationalId")).toContainText("U.S. applicant");
  await expect(page.locator(".selected-field")).toBeFocused();
  expect(requests).toEqual([]);
  await page.screenshot({ path: "test-results/home-selected-field.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "test-results/home-selected-field-mobile.png",
    fullPage: true,
  });
  await search.fill("");
  await expect(page.locator(".field-guide-entry")).toHaveCount(0);
  await expect(
    page.getByRole("navigation", { name: "Preparation tools" }),
  ).toBeVisible();
  await page.unroute("**/*");
});

test("observed choices and limits are exact and explicitly scoped", async ({
  page,
}) => {
  await page.goto("/#passportType");
  const passport = page.locator("#passportType");
  await passport.getByRole("combobox").click();
  await expect(passport.getByRole("option")).toHaveText([
    "ORDINARY PASSPORT",
    "OFFICIAL PASSPORT",
    "DIPLOMATIC PASSPORT",
    "SERVICE PASSPORT",
    "SPECIAL PASSPORT",
  ]);
  await page.goto("/#email");
  await expect(page.locator("#email")).toContainText("50 characters");
  await page.goto("/#gatePassport");
  await expect(page.locator("#gatePassport")).toContainText("14 characters");
  await expect(page.locator("#gatePassport .field-verified")).toBeHidden();
  await page.locator("#gatePassport").getByText("Details & source").click();
  await expect(page.locator("#gatePassport .field-verified")).toBeVisible();
  await expect(page.locator("#gatePassport")).toContainText(
    "Verified At: 17 October 2026",
  );
  await page.goto("/#nationality");
  await page.locator("#nationality").getByRole("combobox").click();
  await expect(page.locator("#nationality").getByRole("option")).toHaveCount(
    179,
  );
  await page.goto("/#arrivalPort");
  await page
    .getByRole("combobox", { name: "Port Of Arrival", exact: true })
    .click();
  await expect(page.getByRole("option")).toHaveCount(86);
  await expect(page.locator("#arrivalPort")).toContainText(
    "TRIVANDRUM AIRPORT",
  );
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/#passportType");
  await page.locator("#passportType").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/field-choices-mobile.png" });
});

test("compact hints support editable text and keep conditional NA guidance", async ({
  page,
}) => {
  await page.goto("/#nationalId");
  const nationalId = page.locator("article#nationalId");
  const example = nationalId.getByRole("textbox");
  await expect(example).toHaveValue("");
  await expect(example).toHaveAttribute("placeholder", "NA");
  await expect(example).toBeEditable();
  await expect(nationalId.locator(".compact-field-hint")).toHaveText(
    "U.S. applicant without a national ID? Enter NA.",
  );
  await expect(nationalId.locator("details")).not.toHaveAttribute("open", "");
  await expect(
    page.getByRole("navigation", { name: "Fields in this section" }),
  ).toBeHidden();
  await page.waitForLoadState("networkidle");
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.route("**/*", (r) => r.abort());
  await example.click();
  await page.keyboard.type("SYNTHETIC-LOCAL-ENTRY");
  await expect(example).toHaveValue("SYNTHETIC-LOCAL-ENTRY");
  await example.fill("NA");
  await nationalId.screenshot({ path: "test-results/national-id-hint.png" });
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await nationalId.screenshot({
    path: "test-results/national-id-hint-mobile.png",
  });
  await page.getByRole("searchbox").fill("education");
  await page.locator('.search-results a[href="/#education"]').click();
  const education = page.locator("#education");
  await education.getByRole("combobox").click();
  await expect(education.getByRole("option")).toHaveText([
    "BELOW MATRICULATION",
    "GRADUATE",
    "HIGHER SECONDARY",
    "ILLITERATE",
    "MATRICULATION",
    "NA BEING MINOR",
    "OTHERS",
    "POST GRADUATE",
    "PROFESSIONAL",
  ]);

  expect(requests).toEqual([]);
  expect(
    await page.evaluate(async () => ({
      local: { ...localStorage },
      session: { ...sessionStorage },
      cookie: document.cookie,
      databases: await indexedDB.databases(),
    })),
  ).toEqual({ local: {}, session: {}, cookie: "", databases: [] });
});

test("Religion OTHERS reveals an editable explanation and stays private", async ({
  page,
}) => {
  await page.goto("/#religion");
  const religion = page.getByRole("combobox", {
    name: "Religion",
    exact: true,
  });
  const explanation = page.getByRole("textbox", {
    name: "If Others, Please specify",
    exact: true,
  });
  await expect(religion).toHaveValue("");
  await expect(explanation).toHaveCount(0);
  await page.waitForLoadState("networkidle");
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.route("**/*", (r) => r.abort());
  await religion.fill("agnostic");
  await expect(page.getByRole("option")).toHaveCount(1);
  await expect(page.getByRole("option")).toContainText("OTHERS");
  await expect(explanation).toHaveCount(0);
  const openAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(openAudit.violations).toEqual([]);
  await page.locator("article#religion").screenshot({
    path: "test-results/religion-search-agnostic.png",
  });
  await religion.press("ArrowDown");
  await religion.press("Enter");
  await expect(religion).toHaveValue("OTHERS");
  await expect(explanation).toBeVisible();
  await expect(explanation).toBeEditable();
  await expect(explanation).toHaveValue("");
  await expect(page.locator("#religionOther-hint")).toContainText(
    "NA if not applicable",
  );
  await religion.focus();
  await page.keyboard.press("Tab");
  await expect(explanation).toBeFocused();
  await explanation.fill("NA");
  await page
    .locator("article#religion")
    .screenshot({ path: "test-results/religion-others-sample.png" });
  await explanation.fill("SYNTHETIC-PRIVATE-EXPLANATION");
  await religion.fill("buddh");
  await page.getByRole("option", { name: "BUDDHISM", exact: true }).click();
  await expect(explanation).toHaveCount(0);
  await religion.fill("non religious");
  await expect(page.getByRole("option")).toHaveCount(1);
  await page.getByRole("option", { name: /OTHERS/ }).click();
  await expect(religion).toHaveValue("OTHERS");
  await expect(explanation).toHaveValue("SYNTHETIC-PRIVATE-EXPLANATION");
  await explanation.fill("NA");
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await religion.fill("SYNTHETIC-NO-MATCH");
  await expect(page.getByRole("option")).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("No match");
  await religion.press("Escape");
  await page.getByRole("button", { name: "Show all Religion choices" }).click();
  await expect(page.getByRole("option")).toHaveCount(11);
  await page.getByRole("option", { name: /OTHERS/ }).click();
  await expect(explanation).toHaveValue("NA");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .locator("article#religion")
    .screenshot({ path: "test-results/religion-others-mobile.png" });
  expect(requests).toEqual([]);
  expect(page.url()).toMatch(/#religion$/);
  expect(
    await page.evaluate(async () => ({
      local: { ...localStorage },
      session: { ...sessionStorage },
      cookies: document.cookie,
      databases: await indexedDB.databases(),
    })),
  ).toEqual({ local: {}, session: {}, cookies: "", databases: [] });
  await page.unroute("**/*");
  await page.reload();
  await expect(religion).toHaveValue("");
  await expect(explanation).toHaveCount(0);
  await page.goto("/#religionOther");
  await expect(religion).toHaveValue("OTHERS");
  await expect(explanation).toBeVisible();
  await expect(explanation).toHaveValue("");
  await expect(page.locator("#religionOther")).toHaveCount(1);
});

test("text feedback preserves input, offers undoable formatting and stays local", async ({
  page,
}) => {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#employer");
  await page.waitForLoadState("networkidle");
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.route("**/*", (route) => route.abort());
  const employer = page.getByRole("textbox", {
    name: "Employer Name/business",
    exact: true,
  });
  const original = "SYNTHETIC O’Bríen, Inc.";
  await employer.fill(original);
  await expect(employer).toHaveValue(original);
  await expect(page.locator("#employer-feedback")).toContainText(
    "Periods and commas have been reported",
  );
  await expect(page.locator(".field-suggestion output")).toHaveText(
    "SYNTHETIC OBríen Inc",
  );
  await expect(employer).toHaveAttribute("aria-invalid", "false");
  await expect(page.locator("#employer-rules")).toHaveText(
    "23 / 50 characters",
  );
  await expect(page.locator("article#employer")).not.toContainText(
    "not verified",
  );
  await expectInlineCopy(
    employer,
    page.getByRole("button", { name: "Format & copy" }),
  );
  await page.screenshot({
    path: "test-results/employer-text-feedback.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Format & copy" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "SYNTHETIC OBríen Inc",
  );
  await expect(page.getByRole("status")).toHaveText("Formatted and copied");
  await expect(employer).toHaveValue("SYNTHETIC OBríen Inc");
  await expect(employer).toBeFocused();
  await page.getByRole("button", { name: "Undo formatting" }).click();
  await expect(employer).toHaveValue(original);
  const beforeCopy = await page.locator("article#employer").boundingBox();
  await page
    .getByRole("button", { name: "Copy original", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Copy original", exact: true }),
  ).toHaveClass(/is-copied/);
  await expect(
    page.getByRole("button", { name: "Format & copy" }),
  ).not.toHaveClass(/is-copied/);
  await expect(page.locator(".field-copy-status")).toHaveClass(/sr-only/);
  expect(await page.locator("article#employer").boundingBox()).toEqual(
    beforeCopy,
  );
  await page.screenshot({
    path: "test-results/copy-icon-feedback.png",
    fullPage: true,
  });
  await expect(
    page.getByRole("button", { name: "Copy original", exact: true }),
  ).not.toHaveClass(/is-copied/, { timeout: 3000 });
  expect(await page.locator("article#employer").boundingBox()).toEqual(
    beforeCopy,
  );
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    original,
  );
  await expect(employer).toHaveValue(original);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await expectInlineCopy(
    employer,
    page.getByRole("button", { name: "Format & copy" }),
  );
  await page.screenshot({
    path: "test-results/employer-text-feedback-mobile.png",
    fullPage: true,
  });

  const search = page.getByRole("searchbox");
  await search.fill("Passport No");
  await page.locator('.search-results a[href="/#gatePassport"]').click();
  const passport = page.getByRole("textbox", {
    name: "Passport No",
    exact: true,
  });
  await passport.fill("SYNTHETIC123456789");
  await expect(passport).toHaveValue("SYNTHETIC123456789");
  await expect(passport).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#gatePassport-feedback")).toContainText(
    "4 characters over the 14-character limit",
  );
  await page.getByRole("button", { name: "Copy", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "SYNTHETIC123456789",
  );
  await passport.fill("SYNTHETIC123");
  await expect(passport).toHaveAttribute("aria-invalid", "false");

  await search.fill("House No");
  await page.locator('.search-results a[href="/#addressStreet"]').click();
  const address = page.getByRole("textbox", {
    name: "House No./Street",
    exact: true,
  });
  await address.fill("A".repeat(36));
  await expectInlineCopy(
    address,
    page.getByRole("button", { name: "Copy", exact: true }),
  );
  await expect(address).toHaveValue("A".repeat(36));
  await expect(page.locator("#addressStreet-feedback")).toContainText(
    "1 character over the 35-character limit",
  );

  await search.fill("Email ID");
  await page.locator('.search-results a[href="/#email"]').click();
  const email = page.getByRole("textbox", { name: "Email ID", exact: true });
  await email.fill("bad address");
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await email.fill("synthetic@example.test");
  await expect(email).toHaveAttribute("aria-invalid", "false");

  await search.fill("Date of Birth");
  await page.locator('.search-results a[href="/#dob"]').click();
  const date = page.getByRole("textbox", {
    name: "Date of Birth",
    exact: true,
  });
  await date.fill("2024-02-29");
  await page.getByRole("button", { name: "Format & copy" }).click();
  await expect(date).toHaveValue("29/02/2024");
  await expect(date).toHaveAttribute("aria-invalid", "false");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "29/02/2024",
  );
  await date.fill("31/02/2024");
  await expect(date).toHaveAttribute("aria-invalid", "true");

  await search.fill("employer");
  await page.locator('.search-results a[href="/#employer"]').click();
  await expect(employer).toHaveValue("");
  expect(requests).toEqual([]);
  expect(page.url()).toMatch(/#employer$/);
  expect(
    await page.evaluate(async () => ({
      local: { ...localStorage },
      session: { ...sessionStorage },
      cookies: document.cookie,
      databases: await indexedDB.databases(),
    })),
  ).toEqual({ local: {}, session: {}, cookies: "", databases: [] });
  await employer.fill(original);
  await page.unroute("**/*");
  await page.reload();
  await expect(employer).toHaveValue("");
});

test("copy failure keeps the original and offers manual copying", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw new Error("Denied in test");
        },
      },
    });
  });
  await page.goto("/#employer");
  const input = page.getByRole("textbox", {
    name: "Employer Name/business",
    exact: true,
  });
  await expect(
    page.getByRole("button", { name: "Copy", exact: true }),
  ).toBeDisabled();
  await input.fill("SYNTHETIC & Co., Ltd.");
  await page.getByRole("button", { name: "Format & copy" }).click();
  await expect(page.locator(".field-copy-status")).toContainText(
    "Couldn’t copy",
  );
  await expect(input).toHaveValue("SYNTHETIC & Co., Ltd.");
  await expect(page.locator(".field-suggestion output")).toHaveText(
    "SYNTHETIC AND Co Ltd",
  );
  await expect(
    page.getByRole("button", { name: "Undo formatting" }),
  ).toHaveCount(0);
  await input.fill("Different synthetic text");
  await expect(page.locator(".field-copy-status")).toBeEmpty();
  await expect(
    page.getByRole("button", { name: "Copy", exact: true }),
  ).toBeEnabled();
});

test("arrival field resolves airport aliases inline and copies only a selected portal label", async ({
  page,
}) => {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.route("**/*", (route) => route.abort());
  await page.getByRole("searchbox").fill("Kempegowda");
  await page.locator('.search-results a[href="/#arrivalPort"]').click();
  const input = page.getByRole("combobox", {
    name: "Port Of Arrival",
    exact: true,
  });
  await expect(page.locator(".field-guide-entry")).toHaveCount(1);
  await input.click();
  await expect(page.getByRole("option")).toHaveCount(86);
  await input.press("Escape");
  await expect(input).toHaveAttribute("aria-expanded", "false");
  for (const query of [
    "TRV",
    "Trivandrum",
    "Thiruvananthapuram",
    "  TRÍVANDRUM, airport ",
  ]) {
    await input.fill(query);
    await expect(page.getByRole("option")).toHaveCount(1);
    await expect(page.getByRole("option")).toContainText("TRIVANDRUM AIRPORT");
    await expect(page.getByRole("option")).toContainText("Thiruvananthapuram");
  }
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(input).toHaveValue("TRIVANDRUM AIRPORT");
  await expect(input).toHaveAttribute("aria-expanded", "false");
  const arrivalBeforeCopy = await page
    .locator("article#arrivalPort")
    .boundingBox();
  await page.getByRole("button", { name: "Copy portal name" }).click();
  await expect(
    page.getByRole("button", { name: "Copy portal name" }),
  ).toHaveClass(/is-copied/);
  await expect(page.locator(".field-copy-status")).toHaveClass(/sr-only/);
  expect(await page.locator("article#arrivalPort").boundingBox()).toEqual(
    arrivalBeforeCopy,
  );
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "TRIVANDRUM AIRPORT",
  );

  for (const query of ["Bangalore", "Kempegowda", "BLR"]) {
    await input.fill(query);
    await expect(page.getByRole("option")).toHaveCount(1);
    await expect(page.getByRole("option")).toContainText("BENGALURU AIRPORT");
  }
  await page.getByRole("option").click();
  await expect(input).toHaveValue("BENGALURU AIRPORT");
  await input.fill("Goa");
  await expect(page.getByRole("option")).toHaveCount(3);
  await expect(page.getByRole("option").nth(0)).toContainText(
    "GOA AIRPORT(DABOLIM)",
  );
  await expect(page.getByRole("option").nth(1)).toContainText(
    "GOA AIRPORT (MOPA)",
  );
  await expect(page.getByRole("option").nth(2)).toContainText("GOA SEAPORT");
  await expect(
    page.getByRole("button", { name: "Copy portal name" }),
  ).toHaveCount(0);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.screenshot({
    path: "test-results/arrival-alias-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/arrival-alias-mobile.png",
    fullPage: true,
  });
  await input.fill("GOX");
  await page.getByRole("option").click();
  await expect(input).toHaveValue("GOA AIRPORT (MOPA)");
  await expectInlineCopy(
    input,
    page.getByRole("button", { name: "Copy portal name" }),
  );
  await input.fill("Cochin");
  await expect(page.getByRole("option")).toHaveCount(2);
  await input.fill("COK");
  await expect(page.getByRole("option")).toHaveCount(1);
  await expect(page.getByRole("option")).toContainText("COCHIN AIRPORT");
  await input.fill("Unknown synthetic airport");
  await expect(page.getByRole("option")).toHaveCount(0);
  await expect(
    page.getByText("No match. Try another name or airport code."),
  ).toBeVisible();
  await input.press("Escape");
  await expect(input).toHaveValue("Unknown synthetic airport");
  await expect(
    page.getByRole("button", { name: "Copy portal name" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Show all arrival choices" }).click();
  await expect(page.getByRole("option")).toHaveCount(86);
  expect(requests).toEqual([]);
  expect(page.url()).toMatch(/#arrivalPort$/);
  expect(
    await page.evaluate(async () => ({
      local: { ...localStorage },
      session: { ...sessionStorage },
      cookies: document.cookie,
      databases: await indexedDB.databases(),
    })),
  ).toEqual({ local: {}, session: {}, cookies: "", databases: [] });
  await page.unroute("**/*");
  await page.reload();
  await expect(input).toHaveValue("");
});

test("old guide links open only the selected field on home", async ({
  page,
}) => {
  await page.goto("/guide/identity/#religionOther");
  await expect(page).toHaveURL(/\/#religionOther$/);
  await expect(page.locator(".field-guide-entry")).toHaveCount(1);
  await expect(
    page.getByRole("combobox", { name: "Religion", exact: true }),
  ).toHaveValue("OTHERS");
  await expect(
    page.getByRole("textbox", {
      name: "If Others, Please specify",
      exact: true,
    }),
  ).toBeVisible();
  await page.goto("/guide/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("searchbox")).toBeVisible();
  await expect(page.locator(".guide-grid, .field-guide-entry")).toHaveCount(0);
});

test("old worksheet links preserve field destination and allow encrypted backup recovery", async ({
  page,
}) => {
  const envelope = await encryptDraft(
    {
      version: 1,
      answers: { givenNames: "SYNTHETIC-OLDER-SECRET" },
      transferred: [],
    },
    await newSession("synthetic-legacy-passphrase"),
  );
  await page.goto("/worksheet/#religion");
  await expect(
    page.getByRole("link", { name: "Open field guidance" }),
  ).toHaveAttribute("href", "/#religion");
  await page.evaluate(
    async (value) =>
      new Promise<void>((resolve, reject) => {
        const request = indexedDB.open("evisa-private-draft", 1);
        request.onupgradeneeded = () =>
          request.result.createObjectStore("drafts");
        request.onerror = () => reject(new Error("test setup failed"));
        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction("drafts", "readwrite");
          tx.objectStore("drafts").put(value, "active");
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
        };
      }),
    envelope,
  );
  await page.getByRole("button", { name: "Check for an older draft" }).click();
  const event = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export encrypted backup" }).click();
  const file = await event;
  const exported = await readFile((await file.path())!, "utf8");
  expect(JSON.parse(exported)).toEqual(envelope);
  expect(exported).not.toContain("SYNTHETIC-OLDER-SECRET");
  await page
    .getByRole("button", { name: "Delete saved draft", exact: true })
    .click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Export encrypted backup" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete saved draft", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirm delete saved draft" })
    .click();
  await expect(page.getByRole("status")).toContainText("Saved draft deleted");
  await page.reload();
  await page.getByRole("button", { name: "Check for an older draft" }).click();
  await expect(page.getByRole("status")).toContainText("No saved draft found");
});

for (const mode of ["passport", "photo"] as const) {
  const route =
    mode === "passport" ? "/tools/passport-pdf/" : "/tools/photo-jpeg/";
  const button = mode === "passport" ? "Download PDF" : "Download JPEG";
  test(`${mode} conversion works offline with no upload or storage`, async ({
    page,
  }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const requests: string[] = [];
    page.on("request", (r) => requests.push(r.url()));
    await page.route("**/*", (r) => r.abort());
    await page
      .getByLabel(`Choose ${mode} file`)
      .setInputFiles(fixture(`synthetic-${mode}.png`));
    const event = page.waitForEvent("download");
    await page.getByRole("button", { name: button }).click();
    const bytes = await readFile((await (await event).path())!);
    expect(bytes.length).toBeGreaterThanOrEqual(10240);
    expect(bytes.length).toBeLessThanOrEqual(
      mode === "passport" ? 300000 : 1_000_000,
    );
    if (mode === "passport")
      expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1);
    else expect([...bytes.subarray(0, 2)]).toEqual([255, 216]);
    expect(requests).toEqual([]);
    expect(
      await page.evaluate(async () => ({
        local: { ...localStorage },
        cookies: document.cookie,
        databases: await indexedDB.databases(),
      })),
    ).toEqual({ local: {}, cookies: "", databases: [] });
  });
  test(`${mode} HEIC decoder downloads only local code then works offline`, async ({
    page,
  }) => {
    test.setTimeout(60000);
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const origin = new URL(page.url()).origin;
    const requests: { url: string; method: string; body: string | null }[] = [];
    page.on("request", (r) =>
      requests.push({ url: r.url(), method: r.method(), body: r.postData() }),
    );
    await page.route("**/*", (r) => {
      const request = r.request();
      const url = new URL(request.url());
      if (
        request.method() === "GET" &&
        request.resourceType() === "script" &&
        url.origin === origin &&
        /^\/_next\/static\/chunks\/[^/]+\.js$/.test(url.pathname) &&
        !url.search
      )
        return r.continue();
      return r.abort();
    });
    const workerEvent = page.waitForEvent("worker");
    await page
      .getByLabel(`Choose ${mode} file`)
      .setInputFiles(fixture(`synthetic-${mode}.heic`));
    const worker = await workerEvent;
    await expect(page.getByRole("button", { name: button })).toBeEnabled({
      timeout: 20000,
    });
    expect(requests.length).toBeGreaterThan(0);
    for (const request of requests) {
      expect(request.method).toBe("GET");
      expect(request.body).toBeNull();
      expect(new URL(request.url).origin).toBe(origin);
      expect(new URL(request.url).pathname).toMatch(
        /^\/_next\/static\/chunks\/[^/]+\.js$/,
      );
    }
    expect(
      await worker.evaluate(async (url) => {
        try {
          await fetch(url);
          return false;
        } catch {
          return true;
        }
      }, `${origin}/HEIC-PRIVACY-TEST`),
    ).toBe(true);
    await page.unroute("**/*");
    await page.route("**/*", (r) => r.abort());
    requests.length = 0;
    await page.getByRole("button", { name: "Clear file" }).click();
    await page.getByLabel(`Choose ${mode} file`).setInputFiles({
      name: `synthetic-${mode}.HEIF`,
      mimeType: "",
      buffer: await readFile(fixture(`synthetic-${mode}.heic`)),
    });
    const event = page.waitForEvent("download");
    await page.getByRole("button", { name: button }).click();
    const bytes = await readFile((await (await event).path())!);
    expect(bytes.length).toBeGreaterThanOrEqual(10240);
    expect(bytes.length).toBeLessThanOrEqual(
      mode === "passport" ? 300000 : 1_000_000,
    );
    if (mode === "passport")
      expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1);
    else expect([...bytes.subarray(0, 2)]).toEqual([255, 216]);
    await page.getByRole("button", { name: "Clear file" }).click();
    await expect(page.locator("canvas")).toHaveCount(0);
    expect(requests).toEqual([]);
  });
}
