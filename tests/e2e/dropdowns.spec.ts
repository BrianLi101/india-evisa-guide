import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("all available field lists support search, keyboard selection and memory-only state", async ({
  page,
}) => {
  await page.goto("/walkthrough/");
  await page.waitForLoadState("networkidle");
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.route("**/*", (route) => route.abort());

  for (const [pageTitle, fields] of [
    [
      "Registration",
      [
        ["gateNationality", 179, "canad", "CANADA"],
        ["nationality", 179, "canad", "CANADA"],
        ["passportType", 5, "ordinary", "ORDINARY PASSPORT"],
      ],
    ],
    [
      "Personal & passport",
      [
        ["religion", 11, "agnostic", "OTHERS"],
        ["gender", 3, "transgender", "TRANSGENDER"],
        ["education", 9, "professional", "PROFESSIONAL"],
        ["nationalityAcquired", 2, "natural", "Naturalization"],
      ],
    ],
    ["Address & family", [["maritalStatus", 3, "single", "SINGLE"]]],
  ] as const) {
    await page
      .getByRole("navigation", { name: "Application steps", exact: true })
      .getByRole("link", {
        name: new RegExp(pageTitle + "$"),
      })
      .click();
    for (const [id, count, query, selected] of fields) {
      const field = page.locator(`#${id}`);
      await field.locator(":scope > summary").click();
      const input = field.getByRole("combobox");
      await input.focus();
      await expect(field.getByRole("option")).toHaveCount(count);
      await input.fill(query);
      await expect(field.getByRole("option").locator("strong")).toHaveText([
        selected,
      ]);
      await input.press("ArrowDown");
      await input.press("Enter");
      const selectedDisplay =
        id === "religion"
          ? "OTHERS (Agnostic · Atheist · Non-religious · Not religious)"
          : selected;
      await expect(input).toHaveValue(selectedDisplay);
      await expect(input).toHaveAttribute("aria-expanded", "false");
      await field.getByRole("button", { name: /^Show all/ }).click();
      await expect(field.getByRole("option")).toHaveCount(count);
      await expect(
        field.getByRole("option", { name: selected, exact: id !== "religion" }),
      ).toHaveAttribute("aria-selected", "true");
      await input.press("Escape");
      await expect(input).toHaveValue(selectedDisplay);
      await expect(input).toHaveAttribute("aria-expanded", "false");
    }
  }

  await page
    .getByRole("navigation", { name: "Application steps", exact: true })
    .getByRole("link", { name: "1. Registration", exact: true })
    .click();
  const nationality = page.locator("#nationality");
  const input = nationality.getByRole("combobox");
  await expect(input).toHaveValue("CANADA");
  await expect(page.locator("#passportType").getByRole("combobox")).toHaveValue(
    "ORDINARY PASSPORT",
  );
  await input.fill("SYNTHETIC-PRIVATE-QUERY");
  await expect(nationality.getByRole("status")).toContainText("No match");
  await input.press("Enter");
  await expect(input).toHaveValue("SYNTHETIC-PRIVATE-QUERY");
  await input.press("Tab");
  await expect(input).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("select")).toHaveCount(0);
  expect(requests).toEqual([]);
  expect(page.url()).toMatch(/#page-registration$/);
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
  await nationality.locator(":scope > summary").click();
  await expect(input).toHaveValue("");
});

test("open nationality and passport menus fit narrow windows and remain accessible", async ({
  page,
}) => {
  await page.goto("/walkthrough/#nationality");
  for (const [name, width, id] of [
    ["desktop", 1440, "nationality"],
    ["side-by-side", 720, "passportType"],
    ["mobile", 390, "nationality"],
    ["small-mobile", 320, "passportType"],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    const field = page.locator(`#${id}`);
    if (
      !(await field.evaluate((element) => (element as HTMLDetailsElement).open))
    )
      await field.locator(":scope > summary").click();
    const input = field.getByRole("combobox");
    await field.scrollIntoViewIfNeeded();
    await input.focus();
    await input.press("ArrowDown");
    await expect(page.getByRole("listbox")).toHaveCount(1);
    const menuBox = await field.getByRole("listbox").boundingBox();
    expect(menuBox!.x).toBeGreaterThanOrEqual(0);
    expect(menuBox!.x + menuBox!.width).toBeLessThanOrEqual(width);
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
    await page.screenshot({ path: `test-results/dropdown-${name}.png` });
    await input.press("Escape");
  }
});

test("live purpose help, passport limit and both arrival pickers work independently", async ({
  page,
}) => {
  await page.goto("/walkthrough/#purpose");
  const purpose = page.locator("#purpose");
  await purpose.getByRole("combobox").fill("e-Tourist Visa 30 days");
  await purpose
    .getByRole("option", {
      name: "e-Tourist Visa 30 days (e-T1 V) - TOURISM,RECREATION,SIGHT-SEEING",
      exact: true,
    })
    .click();
  await expect(purpose.getByRole("combobox")).toHaveValue(
    "e-Tourist Visa 30 days (e-T1 V) - TOURISM,RECREATION,SIGHT-SEEING",
  );
  await page.goto("/walkthrough/#visaService");
  await expect(page.locator("#visaService")).toContainText(
    "filled automatically",
  );
  await expect(page.locator("#visaService input")).toHaveCount(0);
  await page.goto("/walkthrough/#passportPlace");
  const place = page.locator("#passportPlace");
  await place.getByRole("textbox").fill("A".repeat(21));
  await expect(place.getByRole("textbox")).toHaveValue("A".repeat(21));
  await expect(place).toContainText("1 character over the 20-character limit");
  for (const [id, query, expected] of [
    [
      "arrivalPort",
      "TRV",
      "TRIVANDRUM AIRPORT (TRV · Thiruvananthapuram · Trivandrum · Thiruvananthapuram International Airport)",
    ],
    [
      "visaArrival",
      "BLR",
      "BENGALURU AIRPORT (BLR · Bengaluru · Bangalore · Kempegowda · Kempegowda International Airport)",
    ],
  ]) {
    await page.goto(`/walkthrough/#${id}`);
    const input = page.locator(`#${id}`).getByRole("combobox");
    await input.fill(query);
    await input.press("ArrowDown");
    await input.press("Enter");
    await expect(input).toHaveValue(expected);
  }
  await expect(page.locator("#arrivalPort").getByRole("combobox")).toHaveValue(
    "TRIVANDRUM AIRPORT (TRV · Thiruvananthapuram · Trivandrum · Thiruvananthapuram International Airport)",
  );
  expect(
    await page.evaluate(() => {
      const ids = [...document.querySelectorAll("[id]")].map(
        (element) => element.id,
      );
      return ids.filter((id, index) => ids.indexOf(id) !== index);
    }),
  ).toEqual([]);
  await page.locator("#visaArrival").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/live-portal-arrival-help.png" });
});
