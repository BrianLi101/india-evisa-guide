import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { fields } from "../../src/content/data";
import { fieldGuideId } from "../../src/content/fieldHints";
import { walkthroughPages } from "../../src/content/walkthrough";

const helpIds = new Set(
  walkthroughPages.flatMap((page) =>
    page.groups.flatMap((group) =>
      group.fields.filter((field) => field.help).map((field) => field.id),
    ),
  ),
);

const steps = [
  ["registration", "Registration"],
  ["applicant", "Personal & passport"],
  ["address-family", "Address & family"],
  ["visa", "Visit & references"],
  ["background", "Additional questions"],
  ["photo", "Upload photograph"],
  ["documents", "Upload passport"],
  ["payment", "Payment"],
] as const;

async function fieldMarkup(content: Locator) {
  return content.evaluate((element) => {
    const copy = element.cloneNode(true) as HTMLElement;
    // Static hydration and client rendering differ in comments and attribute order.
    const walker = document.createTreeWalker(copy, NodeFilter.SHOW_COMMENT);
    const comments: Node[] = [];
    while (walker.nextNode()) comments.push(walker.currentNode);
    comments.forEach((comment) => comment.parentNode!.removeChild(comment));
    for (const node of copy.querySelectorAll("*")) {
      const attributes = [...node.attributes].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      attributes.forEach(({ name }) => node.removeAttribute(name));
      attributes.forEach(({ name, value }) => node.setAttribute(name, value));
    }
    return copy.innerHTML;
  });
}

async function fieldStyles(content: Locator) {
  return content.evaluate((element) =>
    [...element.querySelectorAll("*")].map((node) => {
      const style = getComputedStyle(node);
      return Object.fromEntries(
        [
          "font-family",
          "font-size",
          "font-weight",
          "line-height",
          "color",
          "background-color",
          "border-width",
          "border-radius",
          "padding",
          "margin",
        ].map((property) => [property, style.getPropertyValue(property)]),
      );
    }),
  );
}

async function jumpToStep(page: Page, index: number) {
  const [id, title] = steps[index];
  const link = page
    .getByRole("navigation", { name: "Application steps" })
    .getByRole("link", { name: `${index + 1}. ${title}`, exact: true });
  await link.click();
  await expect(page).toHaveURL(new RegExp(`#page-${id}$`));
  await expect(link).toHaveAttribute("aria-current", "step");
  await expect(page.locator(`#heading-${id}`)).toBeFocused();
  const navBox = await page.locator(".walkthrough-steps").boundingBox();
  const headingBox = await page.locator(`#heading-${id}`).boundingBox();
  expect(headingBox!.y).toBeGreaterThan(navBox!.y + navBox!.height);
}

async function openField(page: Page, id: string) {
  const field = page.locator(`#${id}`);
  if (
    !(await field.evaluate((element) => (element as HTMLDetailsElement).open))
  )
    await field.locator(":scope > summary").click();
  await expect(field).toHaveAttribute("open");
  return field;
}

test("walkthrough keeps simple labels and selective help with working anchors and history", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("searchbox")).toBeVisible();
  await page
    .getByRole("navigation", { name: "Preparation tools" })
    .getByRole("link", { name: "Walk through the form" })
    .click();
  await expect(page.locator(".walkthrough-section")).toHaveCount(8);
  await expect(
    page.locator(".walkthrough-section[hidden], .walkthrough-field[open]"),
  ).toHaveCount(0);
  await expect(page.locator(".walkthrough-field input:visible")).toHaveCount(0);
  await expect(
    page
      .getByRole("navigation", { name: "Application steps" })
      .getByRole("link"),
  ).toHaveCount(8);
  await expect(
    page.locator(
      ".walkthrough-pagination, .walkthrough-sidebar, .walkthrough-bottom-nav",
    ),
  ).toHaveCount(0);
  await expect(
    page.locator("#page-registration .walkthrough-field-label"),
  ).toHaveText([
    "Passport No",
    "Select Country/Region",
    "Name as in passport",
    "Nationality/Region",
    "Passport Type",
    "Port Of Arrival",
    "Date of Birth",
    "Email ID",
    "Re-enter Email ID",
    "Visiting India for",
    "Purpose",
    "Visa Service",
    "Expected Date of Arrival",
  ]);
  for (let index = 0; index < steps.length; index++)
    await jumpToStep(page, index);
  await expect(page.locator(".walkthrough-field[open]")).toHaveCount(0);
  await page.goBack();
  await expect(page.locator("#heading-documents")).toBeFocused();
  await page.goForward();
  await expect(page.locator("#heading-payment")).toBeFocused();
  await expect(
    page.getByRole("button", {
      name: /Save draft|Continue|Pay Now/,
      exact: true,
    }),
  ).toHaveCount(0);
  for (const [label, url, heading] of [
    ["Open photo tool", "/tools/photo-jpeg/", "Prepare your photo"],
    ["Open passport PDF tool", "/tools/passport-pdf/", "Passport PDF"],
  ]) {
    const link = page.getByRole("link", { name: `${label} (opens a new tab)` });
    await expect(link).toHaveAttribute("target", "_blank");
    const popupPromise = page.waitForEvent("popup");
    await link.click();
    const toolPage = await popupPromise;
    await expect(toolPage).toHaveURL(url);
    await expect(toolPage.getByRole("heading", { level: 1 })).toHaveText(heading);
    await toolPage.close();
  }
  await expect(page.locator(".walkthrough-group-provisional")).toHaveCount(0);

  await page.goto("/walkthrough/#religionOther");
  await expect(page.locator("#religion")).toHaveAttribute("open");
  await expect(page.locator(".walkthrough-field[open]")).toHaveCount(1);
  await expect(page.locator("#religion > summary")).toBeFocused();
  await expect(
    page.locator("#religionOther").getByRole("textbox"),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator("#religion")).toHaveAttribute("open");
  await page.goto("/walkthrough/#not-a-field");
  await expect(page.locator(".walkthrough-section")).toHaveCount(8);
  await expect(page.locator("#religion")).toHaveAttribute("open");
  await page.reload();
  await expect(page.locator(".walkthrough-field[open]")).toHaveCount(0);
  for (const id of ["email", "emailConfirm", "birthCity"]) {
    await page.goto(`/walkthrough/#${id}`);
    const field = page.locator(`#${id}`);
    await expect(field).toHaveClass(/walkthrough-field-static/);
    await expect(field).toBeFocused();
    await expect(field.locator("summary, button, input, svg")).toHaveCount(0);
    await expect(page.locator(".walkthrough-field[open]")).toHaveCount(0);
  }
});

test("opening help and retaining scratch text stays local through collapsing and section jumps", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/walkthrough/");
  await page.waitForLoadState("networkidle");
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.route("**/*", (route) => route.abort());
  await jumpToStep(page, 1);
  const surname = await openField(page, "surname");
  const input = surname.getByRole("textbox");
  await input.fill("  SYNTHETIC, O’EXAMPLE  ");
  await surname.getByRole("button", { name: "Copy", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "  SYNTHETIC, O’EXAMPLE  ",
  );
  await surname.locator(":scope > summary").click();
  await expect(input).toBeHidden();
  await openField(page, "surname");
  await expect(input).toHaveValue("  SYNTHETIC, O’EXAMPLE  ");
  const religion = await openField(page, "religion");
  await religion.getByRole("combobox").fill("agnostic");
  await religion.getByRole("combobox").press("ArrowDown");
  await religion.getByRole("combobox").press("Enter");
  const explanation = religion.getByRole("textbox");
  await expect(explanation).toBeVisible();
  await explanation.fill("SYNTHETIC EXPLANATION");
  await religion.locator(":scope > summary").click();
  for (let index = 0; index < steps.length; index++)
    await jumpToStep(page, index);
  await jumpToStep(page, 1);
  await openField(page, "religion");
  await expect(religion.getByRole("combobox")).toHaveValue(
    "OTHERS (Agnostic · Atheist · Non-religious · Not religious)",
  );
  await expect(explanation).toHaveValue("SYNTHETIC EXPLANATION");
  await expect(input).toHaveValue("  SYNTHETIC, O’EXAMPLE  ");
  expect(requests).toEqual([]);
  expect(
    await page.evaluate(async () => ({
      local: { ...localStorage },
      session: { ...sessionStorage },
      cookies: document.cookie,
      databases: await indexedDB.databases(),
    })),
  ).toEqual({ local: {}, session: {}, cookies: "", databases: [] });
  expect(
    await page.evaluate(() => {
      const ids = [...document.querySelectorAll("[id]")].map(
        (element) => element.id,
      );
      return ids.filter((id, index) => ids.indexOf(id) !== index);
    }),
  ).toEqual([]);
  await page.unroute("**/*");
  await page.reload();
  await expect(page.locator(".walkthrough-field[open]")).toHaveCount(0);
  await openField(page, "surname");
  await expect(input).toHaveValue("");
});

test("step bar follows scrolling and collapsed help is accessible on desktop and mobile", async ({
  page,
}) => {
  await page.goto("/walkthrough/");
  for (const [name, width, height] of [
    ["desktop", 1440, 1100],
    ["side-by-side", 720, 1000],
    ["mobile", 390, 844],
    ["small-mobile", 320, 740],
  ] as const) {
    await page.setViewportSize({ width, height });
    await jumpToStep(page, 0);
    await page.screenshot({
      path: `test-results/walkthrough-collapsed-${name}.png`,
    });
    if (name === "desktop" || name === "mobile") {
      await page
        .locator("#page-registration .walkthrough-group")
        .last()
        .screenshot({
          path: `test-results/walkthrough-registration-${name}.png`,
        });
    }
    await page
      .locator("#page-address-family")
      .evaluate((element) =>
        element.scrollIntoView({ block: "start", behavior: "instant" }),
      );
    await expect(
      page
        .getByRole("navigation", { name: "Application steps" })
        .getByRole("link", { name: "3. Address & family", exact: true }),
    ).toHaveAttribute("aria-current", "step");
    await jumpToStep(page, 0);
    const arrival = page.locator("#arrivalPort");
    const toggle = arrival.locator(":scope > summary");
    await toggle.focus();
    await toggle.press("Enter");
    await expect(arrival.getByRole("combobox")).toBeVisible();
    await expect(arrival.locator("#arrivalPort-hint")).toBeVisible();
    await arrival.getByRole("combobox").fill("Thiruvananthapuram");
    await arrival.getByRole("combobox").press("ArrowDown");
    await arrival.getByRole("combobox").press("Enter");
    await expect(arrival.getByRole("combobox")).toHaveValue(
      "TRIVANDRUM AIRPORT (TRV · Thiruvananthapuram · Trivandrum · Thiruvananthapuram International Airport)",
    );
    await expect(arrival.locator(".field-verified")).toBeHidden();
    await arrival.getByText("Details & source", { exact: true }).click();
    await expect(arrival.locator(".field-verified")).toBeVisible();
    await expect(
      arrival.getByRole("link", { name: "Official source ↗" }).first(),
    ).toBeVisible();
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
    await page
      .locator("#nationality")
      .evaluate((element) =>
        element.scrollIntoView({ block: "start", behavior: "instant" }),
      );
    await page.screenshot({
      path: `test-results/walkthrough-expanded-${name}.png`,
    });
    await arrival.getByText("Details & source", { exact: true }).click();
    await toggle.focus();
    await toggle.press("Space");
    await expect(arrival.getByRole("combobox")).toBeHidden();
  }
});

test("search and walkthrough render the same field content and conditional controls", async ({
  page,
  context,
}) => {
  const walkthrough = await context.newPage();
  await walkthrough.goto("/walkthrough/");
  await expect(walkthrough.locator(".walkthrough-field[open]")).toHaveCount(0);
  for (const field of fields.filter(
    (item) =>
      !["captcha", "instructions"].includes(item.id) &&
      fieldGuideId(item.id) === item.id,
  )) {
    await page.goto(`/#${field.id}`);
    const searchContent = page.locator(
      `article#${field.id} .field-reference-content`,
    );
    await expect(searchContent).toBeVisible();
    const walkthroughContent = walkthrough.locator(
      `#${field.id} .field-reference-content`,
    );
    if (!helpIds.has(field.id)) {
      await expect(walkthrough.locator(`#${field.id}`)).toHaveClass(
        /walkthrough-field-static/,
      );
      await expect(walkthroughContent).toHaveCount(0);
      continue;
    }
    // Compare the full content, including controls, labels, hints, sources and dates.
    expect(await fieldMarkup(walkthroughContent), field.id).toBe(
      await fieldMarkup(searchContent),
    );
    expect(await fieldStyles(walkthroughContent), field.id).toEqual(
      await fieldStyles(searchContent),
    );
  }
  await page.goto("/#religionOther");
  await walkthrough.goto("/walkthrough/#religionOther");
  for (const view of [page, walkthrough]) {
    await expect(view.locator("#religionOther")).toHaveCount(1);
    const explanation = view.locator("#religionOther").getByRole("textbox");
    await expect(explanation).toBeVisible();
    await explanation.fill("SYNTHETIC EXPLANATION");
  }
  expect(
    await fieldMarkup(
      walkthrough.locator("#religion .field-reference-content"),
    ),
  ).toBe(await fieldMarkup(page.locator("#religion .field-reference-content")));
  await page
    .locator("#religion")
    .screenshot({ path: "test-results/shared-field-search.png" });
  await walkthrough
    .locator("#religion")
    .screenshot({ path: "test-results/shared-field-walkthrough.png" });
  await walkthrough.close();
});
