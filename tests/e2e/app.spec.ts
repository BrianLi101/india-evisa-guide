import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile, writeFile } from "node:fs/promises";
import { PDFDocument, PDFName, PDFRawStream } from "pdf-lib";
import path from "node:path";
const fixture = (name: string) => path.resolve("tests/fixtures", name);
async function rotateImage(page: Page) {
  await page.getByRole("button", { name: "Rotate 90°" }).click();
}
async function reselectImage(page: Page, mode: "photo" | "passport") {
  await page.getByRole("button", { name: "Clear file" }).click();
  await page
    .getByLabel(`Choose ${mode} file`)
    .setInputFiles(fixture(`synthetic-${mode}.png`));
  await expect(page.locator(".image-crop-selection")).toBeVisible();
}

test("missing HEIC decoder reports a local error and allows another image", async ({
  page,
}) => {
  await page.goto("/tools/passport-pdf/");
  await page.waitForLoadState("networkidle");
  await page.route("**/*", (route) => route.abort());
  await page
    .getByLabel("Choose passport file")
    .setInputFiles(fixture("synthetic-passport.heic"));
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "local HEIC decoder could not load",
  );
  await expect(page.getByRole("button", { name: "Download PDF" })).toHaveCount(
    0,
  );
  await page
    .getByLabel("Choose passport file")
    .setInputFiles(fixture("synthetic-passport.png"));
  await expect(
    page.getByRole("button", { name: "Download PDF" }),
  ).toBeEnabled();
});

test("image adjustments stay compact and open without moving the crop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1100, height: 1000 });
  await page.goto("/tools/passport-pdf/");
  await page
    .getByLabel("Choose passport file")
    .setInputFiles(fixture("synthetic-passport.png"));
  const adjust = page.getByRole("button", { name: "Adjust", exact: true });
  const brightness = page.getByRole("slider", {
    name: "Brightness",
    exact: true,
  });
  const contrast = page.getByRole("slider", { name: "Contrast", exact: true });
  const area = page.locator(".image-crop-view");
  await expect(adjust).toHaveAttribute("aria-expanded", "false");
  await expect(brightness).toBeHidden();
  await expect(page.getByRole("button", { name: "Rotate 90°" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Reset crop" })).toHaveCount(0);
  await expect(page.getByText("Local preview", { exact: true })).toHaveCount(0);
  await expect(
    page.getByText(/Drag the edges|Drag inside to move/),
  ).toHaveCount(0);
  const note = (await page.locator(".local-note").boundingBox())!;
  const tabs = (await page.locator(".tool-tabs").boundingBox())!;
  expect(note.y + note.height).toBeLessThanOrEqual(tabs.y);
  const controls = (await page.locator(".tool-toolbar-actions").boundingBox())!;
  const create = (await page
    .getByRole("button", { name: "Download PDF", exact: true })
    .boundingBox())!;
  const imageBounds = (await area.boundingBox())!;
  expect(create.x).toBeGreaterThan(controls.x + controls.width);
  expect(create.y + create.height).toBeLessThan(imageBounds.y);
  expect(
    Math.abs(create.y + create.height / 2 - controls.y - controls.height / 2),
  ).toBeLessThan(1);
  await page.waitForLoadState("networkidle");
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.route("**/*", (route) => route.abort());
  await adjust.scrollIntoViewIfNeeded();
  const before = await area.boundingBox();
  await page.screenshot({ path: "test-results/passport-adjust-collapsed.png" });
  await adjust.focus();
  await page.keyboard.press("Enter");
  await expect(adjust).toHaveAttribute("aria-expanded", "true");
  await expect(brightness).toBeVisible();
  await expect(contrast).toBeVisible();
  expect(await area.boundingBox()).toEqual(before);
  const original = await page
    .locator(".image-crop-view canvas")
    .evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
  await brightness.fill("110");
  await contrast.fill("105");
  await expect
    .poll(() =>
      page
        .locator(".image-crop-view canvas")
        .evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL()),
    )
    .not.toBe(original);
  await contrast.press("Escape");
  await expect(adjust).toBeFocused();
  await expect(adjust).toHaveAttribute("aria-expanded", "false");
  await adjust.click();
  await expect(brightness).toHaveValue("110");
  await expect(contrast).toHaveValue("105");
  await page.screenshot({ path: "test-results/passport-adjust-expanded.png" });
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  const adjustedDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PDF", exact: true }).click();
  await adjustedDownload;
  await expect(adjust).toHaveAttribute("aria-expanded", "false");
  await adjust.click();
  await brightness.fill("100");
  await expect(
    page.getByRole("button", { name: "Download PDF" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Rotate 90°" }).click();
  const rotated = (await area.boundingBox())!;
  expect(rotated.height / rotated.width).toBeCloseTo(1.6, 2);
  // Tabbing out also dismisses the panel without trapping keyboard focus.
  await adjust.click();
  await contrast.press("Tab");
  await expect(adjust).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("button", { name: "Rotate 90°" })).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileCreate = (await page
    .getByRole("button", { name: "Download PDF", exact: true })
    .boundingBox())!;
  const mobileControls = (await page
    .locator(".tool-toolbar-actions")
    .boundingBox())!;
  expect(mobileCreate.x).toBeGreaterThan(
    mobileControls.x + mobileControls.width,
  );
  expect(
    Math.abs(
      mobileCreate.y +
        mobileCreate.height / 2 -
        mobileControls.y -
        mobileControls.height / 2,
    ),
  ).toBeLessThan(1);
  await adjust.click();
  const panel = (await page.locator(".image-adjust-panel").boundingBox())!;
  expect(panel.x).toBeGreaterThanOrEqual(0);
  expect(panel.x + panel.width).toBeLessThanOrEqual(390);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "test-results/passport-adjust-mobile.png" });
  await page.getByRole("button", { name: "Clear file" }).click();
  await expect(adjust).toHaveCount(0);
  expect(requests).toEqual([]);
});

test("passport crop handles move, resize and export the selected area", async ({
  page,
  context,
}) => {
  await page.goto("/tools/passport-pdf/");
  await page
    .getByLabel("Choose passport file")
    .setInputFiles(fixture("synthetic-passport.png"));
  const selection = page.locator(".image-crop-selection");
  await expect(selection).toBeVisible();
  await expect(
    page.getByRole("slider", { name: /Keep area|crop position/ }),
  ).toHaveCount(0);
  await page.waitForLoadState("networkidle");
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.route("**/*", (route) => route.abort());
  const area = page.locator(".image-crop-view");
  const corner = page.getByRole("button", {
    name: "Resize crop bottom right corner",
    exact: true,
  });
  await corner.scrollIntoViewIfNeeded();
  const imageBounds = (await area.boundingBox())!;
  const cornerBounds = (await corner.boundingBox())!;
  await page.mouse.move(
    cornerBounds.x + cornerBounds.width / 2,
    cornerBounds.y + cornerBounds.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    imageBounds.x + imageBounds.width * 0.8,
    imageBounds.y + imageBounds.height * 0.9,
    { steps: 8 },
  );
  await page.mouse.up();
  let bounds = (await selection.boundingBox())!;
  expect(bounds.width / imageBounds.width).toBeCloseTo(0.8, 2);
  expect(bounds.height / imageBounds.height).toBeCloseTo(0.9, 2);
  // Move without changing the size, then verify the actual PDF dimensions.
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    bounds.x + bounds.width / 2 + imageBounds.width * 0.1,
    bounds.y + bounds.height / 2 + imageBounds.height * 0.05,
    { steps: 5 },
  );
  await page.mouse.up();
  bounds = (await selection.boundingBox())!;
  expect((bounds.x - imageBounds.x) / imageBounds.width).toBeCloseTo(0.1, 2);
  expect((bounds.y - imageBounds.y) / imageBounds.height).toBeCloseTo(0.05, 2);
  const expectedWidth = Math.round((1600 * bounds.width) / imageBounds.width);
  const expectedHeight = Math.round(
    (1000 * bounds.height) / imageBounds.height,
  );
  const event = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PDF" }).click();
  const download = await event;
  await download.saveAs("test-results/cropped-passport.pdf");
  const pdf = await PDFDocument.load(await readFile((await download.path())!));
  expect(pdf.getPage(0).getWidth()).toBeCloseTo(expectedWidth * 0.36, 1);
  expect(pdf.getPage(0).getHeight()).toBeCloseTo(expectedHeight * 0.36, 1);
  await corner.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(
    page.getByRole("button", { name: "Download PDF" }),
  ).toBeEnabled();
  await reselectImage(page, "passport");
  await page
    .getByRole("button", { name: "Resize crop top left corner" })
    .focus();
  await page.keyboard.press("Shift+ArrowRight");
  await page.keyboard.press("Shift+ArrowDown");
  await rotateImage(page);
  const rotatedArea = (await area.boundingBox())!;
  bounds = (await selection.boundingBox())!;
  expect(rotatedArea.height / rotatedArea.width).toBeCloseTo(1.6, 2);
  expect(bounds.width / rotatedArea.width).toBeCloseTo(0.95, 2);
  expect((bounds.y - rotatedArea.y) / rotatedArea.height).toBeCloseTo(0.05, 2);
  // Return upright; the same selection survives a complete turn.
  for (let i = 0; i < 3; i++) await rotateImage(page);
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.setViewportSize({ width: 1100, height: 1050 });
  await area.scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/passport-visual-crop.png" });

  await page.setViewportSize({ width: 390, height: 844 });
  await reselectImage(page, "passport");
  await corner.scrollIntoViewIfNeeded();
  const mobileImage = (await area.boundingBox())!;
  const mobileCorner = (await corner.boundingBox())!;
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [
      {
        x: mobileCorner.x + mobileCorner.width / 2,
        y: mobileCorner.y + mobileCorner.height / 2,
      },
    ],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [
      {
        x: mobileImage.x + mobileImage.width * 0.85,
        y: mobileImage.y + mobileImage.height * 0.8,
      },
    ],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  bounds = (await selection.boundingBox())!;
  expect(bounds.width / mobileImage.width).toBeCloseTo(0.85, 1);
  expect(bounds.height / mobileImage.height).toBeCloseTo(0.8, 1);
  await cdp.detach();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/passport-visual-crop-mobile.png",
  });
  expect(requests).toEqual([]);
});

test("photo square can be resized and moved with mouse, keyboard and touch", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 1100, height: 1000 });
  await page.goto("/tools/photo-jpeg/");
  await page
    .getByLabel("Choose photo file")
    .setInputFiles(fixture("synthetic-photo.png"));
  const area = page.locator(".image-crop-view");
  const selection = page.locator(".image-crop-selection");
  const corner = page.getByRole("button", {
    name: "Resize crop bottom right corner",
    exact: true,
  });
  await expect(selection).toBeVisible();
  await expect(page.getByRole("slider")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Resize crop/ })).toHaveCount(
    4,
  );
  await expect(selection.locator(".composition-guide")).toBeVisible();
  await expect(page.getByText(/Drag the square to move/)).toHaveCount(0);
  await page.waitForLoadState("networkidle");
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.route("**/*", (route) => route.abort());
  await corner.scrollIntoViewIfNeeded();
  const image = (await area.boundingBox())!;
  let bounds = (await selection.boundingBox())!;
  expect(bounds.width).toBeCloseTo(bounds.height, 1);
  expect((bounds.y - image.y) / image.height).toBeCloseTo(0.1, 2);
  const handle = (await corner.boundingBox())!;
  await page.mouse.move(
    handle.x + handle.width / 2,
    handle.y + handle.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    image.x + image.width * 0.75,
    image.y + image.height * 0.7,
    { steps: 6 },
  );
  await page.mouse.up();
  bounds = (await selection.boundingBox())!;
  expect(bounds.width).toBeCloseTo(bounds.height, 1);
  expect(bounds.width / image.width).toBeCloseTo(0.75, 2);
  const center = {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2,
  };
  await page.mouse.move(center.x, center.y);
  await page.mouse.down();
  await page.mouse.move(
    center.x + image.width * 0.1,
    center.y + image.height * 0.05,
    { steps: 6 },
  );
  await page.mouse.up();
  bounds = (await selection.boundingBox())!;
  expect((bounds.x - image.x) / image.width).toBeCloseTo(0.1, 2);
  expect((bounds.y - image.y) / image.height).toBeCloseTo(0.15, 2);
  const crop = {
    x: (bounds.x - image.x) / image.width,
    y: (bounds.y - image.y) / image.height,
    width: bounds.width / image.width,
    height: bounds.height / image.height,
  };
  const expectedSize = Math.round(1200 * crop.width);
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download JPEG" }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("evisa-photo.jpg");
  await download.saveAs("test-results/photo-square-crop.jpg");
  const bytes = await readFile((await download.path())!);
  const jpeg = await (await PDFDocument.create()).embedJpg(bytes);
  expect([jpeg.width, jpeg.height]).toEqual([expectedSize, expectedSize]);
  expect(bytes.length).toBeGreaterThanOrEqual(10240);
  expect(bytes.length).toBeLessThanOrEqual(1_000_000);
  await expect(page.locator(".output-panel, .output-preview")).toHaveCount(0);
  await expect(page.getByText("File prepared locally")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Create JPEG" })).toHaveCount(
    0,
  );
  // Sample the exported JPEG against the selected region of the full-image preview.
  // This catches a correct-size export of the wrong part of the photo.
  const pixelDifference = await page.evaluate(
    async ({ crop, base64 }) => {
      const full = document.querySelector<HTMLCanvasElement>(
        ".image-crop-view canvas",
      )!;
      const img = new Image();
      img.src = `data:image/jpeg;base64,${base64}`;
      await img.decode();
      const encoded = document.createElement("canvas");
      encoded.width = img.naturalWidth;
      encoded.height = img.naturalHeight;
      const result = encoded.getContext("2d")!;
      result.drawImage(img, 0, 0);
      const original = full.getContext("2d")!;
      let difference = 0;
      for (let x = 0; x < 10; x++)
        for (let y = 0; y < 10; y++) {
          const u = (x + 0.5) / 10,
            v = (y + 0.5) / 10;
          const a = original.getImageData(
            Math.floor((crop.x + crop.width * u) * full.width),
            Math.floor((crop.y + crop.height * v) * full.height),
            1,
            1,
          ).data;
          const b = result.getImageData(
            Math.floor(u * encoded.width),
            Math.floor(v * encoded.height),
            1,
            1,
          ).data;
          for (let c = 0; c < 3; c++) difference += Math.abs(a[c] - b[c]);
        }
      return difference / 300;
    },
    { crop, base64: bytes.toString("base64") },
  );
  expect(pixelDifference).toBeLessThan(12);
  await page
    .getByRole("button", { name: "Resize crop top left corner" })
    .press("Shift+ArrowRight");
  await expect(
    page.getByRole("button", { name: "Download JPEG" }),
  ).toBeEnabled();
  const editedEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download JPEG" }).click();
  const editedBytes = await readFile((await (await editedEvent).path())!);
  const editedJpeg = await (await PDFDocument.create()).embedJpg(editedBytes);
  expect(editedJpeg.width).toBeLessThan(jpeg.width);
  expect(editedJpeg.height).toBe(editedJpeg.width);
  expect(editedBytes).not.toEqual(bytes);
  bounds = (await selection.boundingBox())!;
  expect(bounds.width / image.width).toBeCloseTo(0.7, 2);
  expect(bounds.width).toBeCloseTo(bounds.height, 1);
  await rotateImage(page);
  const landscape = (await area.boundingBox())!;
  bounds = (await selection.boundingBox())!;
  expect(landscape.width / landscape.height).toBeCloseTo(1.25, 2);
  expect(bounds.width).toBeCloseTo(bounds.height, 1);
  expect(bounds.width / landscape.width).toBeCloseTo(crop.height - 0.04, 2);
  await reselectImage(page, "photo");
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await area.scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/photo-square-crop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await corner.scrollIntoViewIfNeeded();
  const mobileImage = (await area.boundingBox())!;
  const mobileHandle = (await corner.boundingBox())!;
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [
      {
        x: mobileHandle.x + mobileHandle.width / 2,
        y: mobileHandle.y + mobileHandle.height / 2,
      },
    ],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [
      {
        x: mobileImage.x + mobileImage.width * 0.8,
        y: mobileImage.y + mobileImage.height * 0.74,
      },
    ],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  bounds = (await selection.boundingBox())!;
  expect(bounds.width / mobileImage.width).toBeCloseTo(0.8, 1);
  expect(bounds.width).toBeCloseTo(bounds.height, 1);
  const touchCenter = {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2,
  };
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [touchCenter],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [
      {
        x: touchCenter.x + mobileImage.width * 0.1,
        y: touchCenter.y + mobileImage.height * 0.05,
      },
    ],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  bounds = (await selection.boundingBox())!;
  expect((bounds.x - mobileImage.x) / mobileImage.width).toBeCloseTo(0.1, 1);
  expect((bounds.y - mobileImage.y) / mobileImage.height).toBeCloseTo(0.15, 1);
  await cdp.detach();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "test-results/photo-square-crop-mobile.png" });
  await page.getByRole("button", { name: "Clear file" }).click();
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(requests).toEqual([]);
});

test("passport PDF uses more of the size allowance with less JPEG distortion", async ({
  page,
}) => {
  await page.goto("/tools/passport-pdf/");
  await page.waitForLoadState("networkidle");
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.route("**/*", (route) => route.abort());
  const original = await readFile(fixture("synthetic-passport.png"));
  await page
    .getByLabel("Choose passport file")
    .setInputFiles(fixture("synthetic-passport.png"));
  const event = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PDF" }).click();
  const download = await event;
  await download.saveAs("test-results/passport-higher-quality.pdf");
  const bytes = await readFile((await download.path())!);
  expect(bytes.length).toBeLessThanOrEqual(300_000);
  expect(bytes.length).toBeGreaterThan(270_000);
  const pdf = await PDFDocument.load(bytes);
  const stream = pdf.context
    .enumerateIndirectObjects()
    .map(([, object]) => object)
    .find(
      (object) =>
        object instanceof PDFRawStream &&
        object.dict.get(PDFName.of("Filter"))?.toString() === "/DCTDecode",
    ) as PDFRawStream;
  expect(stream).toBeDefined();
  const metrics = await page.evaluate(
    async ({ source, encoded }) => {
      const original = new Image();
      original.src = `data:image/png;base64,${source}`;
      await original.decode();
      const canvas = document.createElement("canvas");
      canvas.width = original.naturalWidth;
      canvas.height = original.naturalHeight;
      const context = canvas.getContext("2d")!;
      context.drawImage(original, 0, 0);
      const reference = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      ).data;
      // Reproduce the previous converter's coarse 0.90 -> 0.82 fallback.
      const oldCanvas = document.createElement("canvas");
      oldCanvas.width = canvas.width;
      oldCanvas.height = canvas.height;
      const oldContext = oldCanvas.getContext("2d")!;
      oldContext.fillStyle = "white";
      oldContext.fillRect(0, 0, canvas.width, canvas.height);
      oldContext.filter = "brightness(100%) contrast(100%)";
      oldContext.drawImage(original, 0, 0);
      context.drawImage(oldCanvas, 0, 0);
      const oversized = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.9),
      );
      const oldBlob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.82),
      );
      const oldUrl = URL.createObjectURL(oldBlob);
      async function error(src: string) {
        const img = new Image();
        img.src = src;
        await img.decode();
        context.drawImage(img, 0, 0);
        const data = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        ).data;
        let squared = 0;
        for (let i = 0; i < data.length; i++)
          if (i % 4 !== 3) squared += (data[i] - reference[i]) ** 2;
        return squared / (canvas.width * canvas.height * 3);
      }
      const previousError = await error(oldUrl);
      URL.revokeObjectURL(oldUrl);
      return {
        rejectedJpegBytes: oversized.size,
        previousJpegBytes: oldBlob.size,
        previousError,
        updatedError: await error(`data:image/jpeg;base64,${encoded}`),
      };
    },
    {
      source: original.toString("base64"),
      encoded: Buffer.from(stream.getContents()).toString("base64"),
    },
  );
  expect(metrics.rejectedJpegBytes).toBeGreaterThan(300_000);
  expect(metrics.previousJpegBytes).toBeLessThan(298_000);
  await writeFile(
    "test-results/passport-quality-metrics.json",
    JSON.stringify({ ...metrics, updatedPdfBytes: bytes.length }, null, 2),
  );
  expect(metrics.updatedError).toBeLessThan(metrics.previousError * 0.95);
  await page.locator(".tool-toolbar").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/passport-higher-quality.png" });
  expect(requests).toEqual([]);
});

for (const noisy of [false, true])
  test(`large passport scan ${noisy ? "reduces resolution only when needed" : "keeps full resolution losslessly"}`, async ({
    page,
  }) => {
    await page.goto("/tools/passport-pdf/");
    await page.waitForLoadState("networkidle");
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));
    await page.route("**/*", (route) => route.abort());
    const base64 = await page.evaluate((noisy) => {
      const canvas = document.createElement("canvas");
      canvas.width = 3200;
      canvas.height = 2000;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#f7f5ef";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (noisy) {
        const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let seed = 12345;
        for (let i = 0; i < image.data.length; i += 4) {
          seed = (1664525 * seed + 1013904223) >>> 0;
          const shade = 215 + (seed % 40);
          image.data[i] = image.data[i + 1] = image.data[i + 2] = shade;
        }
        ctx.putImageData(image, 0, 0);
      }
      ctx.strokeStyle = "#284f42";
      ctx.lineWidth = 5;
      ctx.strokeRect(30, 30, 3140, 1940);
      ctx.fillStyle = "#284f42";
      ctx.font = "48px sans-serif";
      ctx.fillText("SYNTHETIC SCAN — NOT A TRAVEL DOCUMENT", 100, 140);
      ctx.fillStyle = "#252525";
      ctx.font = "28px monospace";
      for (let line = 0; line < (noisy ? 30 : 8); line++)
        ctx.fillText(
          `TEST BIODATA LINE ${line + 1}: ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789`,
          100,
          260 + line * 50,
        );
      return canvas.toDataURL("image/png").split(",")[1];
    }, noisy);
    await page.getByLabel("Choose passport file").setInputFiles({
      name: "synthetic-large-scan.png",
      mimeType: "image/png",
      buffer: Buffer.from(base64, "base64"),
    });
    const event = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download PDF" }).click();
    const bytes = await readFile((await (await event).path())!);
    expect(bytes.length).toBeGreaterThanOrEqual(10240);
    expect(bytes.length).toBeLessThanOrEqual(300_000);
    const pdf = await PDFDocument.load(bytes);
    const width = Math.round(pdf.getPage(0).getWidth() / 0.36);
    if (noisy) {
      expect(width).toBeLessThan(3200);
      expect(width).toBeGreaterThanOrEqual(1400);
    } else {
      expect(width).toBe(3200);
      expect(Math.round(pdf.getPage(0).getHeight() / 0.36)).toBe(2000);
      const filters = pdf.context
        .enumerateIndirectObjects()
        .filter(
          ([, object]) =>
            object instanceof PDFRawStream &&
            object.dict.get(PDFName.of("Subtype"))?.toString() === "/Image",
        )
        .map(([, object]) =>
          (object as PDFRawStream).dict.get(PDFName.of("Filter"))?.toString(),
        );
      expect(filters).toContain("/FlateDecode");
      expect(filters).not.toContain("/DCTDecode");
    }
    expect(requests).toEqual([]);
  });

for (const width of [1400, 1000])
  test(`detailed ${width}px scan resizes below the old cutoff to fit the PDF`, async ({
    page,
  }) => {
    await page.goto("/tools/passport-pdf/");
    await page.waitForLoadState("networkidle");
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));
    await page.route("**/*", (route) => route.abort());
    const source = await page.evaluate(async (width) => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = Math.round(width * 0.8);
      const ctx = canvas.getContext("2d")!;
      const pixels = ctx.createImageData(canvas.width, canvas.height);
      let seed = 54321;
      for (let i = 0; i < pixels.data.length; i++) {
        seed = (1664525 * seed + 1013904223) >>> 0;
        pixels.data[i] = i % 4 === 3 ? 255 : seed >>> 24;
      }
      ctx.putImageData(pixels, 0, 0);
      ctx.fillStyle = "white";
      ctx.fillRect(50, 80, width - 100, 100);
      ctx.fillStyle = "black";
      ctx.font = "24px monospace";
      ctx.fillText("SYNTHETIC RESIZING TEST — NOT VALID", 70, 130);
      const jpeg = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.85),
      );
      return {
        base64: canvas.toDataURL("image/png").split(",")[1],
        jpegSize: jpeg.size,
      };
    }, width);
    // At the previous quality/dimension cutoff, even the JPEG alone was oversized.
    expect(source.jpegSize).toBeGreaterThan(300_000);
    const input = Buffer.from(source.base64, "base64");
    await writeFile(`test-results/synthetic-detailed-${width}.png`, input);
    await page.getByLabel("Choose passport file").setInputFiles({
      name: "synthetic-detailed.png",
      mimeType: "image/png",
      buffer: input,
    });
    const event = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download PDF" }).click();
    const download = await event;
    await download.saveAs(`test-results/resized-detailed-${width}.pdf`);
    const bytes = await readFile((await download.path())!);
    expect(bytes.length).toBeGreaterThanOrEqual(10240);
    expect(bytes.length).toBeLessThanOrEqual(300_000);
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBe(1);
    const pageSize = pdf.getPage(0).getSize();
    expect(pageSize.width / 0.36).toBeLessThan(width);
    expect(pageSize.height / pageSize.width).toBeCloseTo(0.8, 2);
    const embedded = pdf.context
      .enumerateIndirectObjects()
      .map(([, object]) => object)
      .find(
        (object) =>
          object instanceof PDFRawStream &&
          object.dict.get(PDFName.of("Subtype"))?.toString() === "/Image",
      ) as PDFRawStream;
    expect(
      Number(embedded.dict.get(PDFName.of("Width"))?.toString()),
    ).toBeCloseTo(pageSize.width / 0.36, 1);
    await expect(page.getByRole("main").getByRole("alert")).toHaveCount(0);
    expect(requests).toEqual([]);
  });

test("passport PDF accepts a smaller image without upscaling or a resolution floor", async ({
  page,
}) => {
  await page.goto("/tools/passport-pdf/");
  await page
    .getByLabel("Choose passport file")
    .setInputFiles(fixture("synthetic-passport-small.png"));
  const event = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PDF" }).click();
  const pdf = await PDFDocument.load(
    await readFile((await (await event).path())!),
  );
  expect(pdf.getPage(0).getWidth()).toBeCloseTo(800 * 0.36, 1);
  expect(pdf.getPage(0).getHeight()).toBeCloseTo(500 * 0.36, 1);
});

test("PDF downloads in one click using current edits and preserves existing PDFs", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/tools/passport-pdf/");
  await page.waitForLoadState("networkidle");
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.route("**/*", (route) => route.abort());
  await page
    .getByLabel("Choose passport file")
    .setInputFiles(fixture("synthetic-passport.png"));
  await expect(page.getByRole("checkbox")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Create PDF" })).toHaveCount(0);
  const button = page.getByRole("button", {
    name: "Download PDF",
    exact: true,
  });
  const downloadEvent = page.waitForEvent("download");
  await button.click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("evisa-passport.pdf");
  const bytes = await readFile((await download.path())!);
  expect(bytes.length).toBeGreaterThanOrEqual(10240);
  expect(bytes.length).toBeLessThanOrEqual(300000);
  const original = await PDFDocument.load(bytes);
  expect(original.getPageCount()).toBe(1);
  await expect(button).toBeEnabled();
  await expect(page.locator(".output-panel")).toHaveCount(0);
  await expect(page.locator(".output-preview")).toHaveCount(0);
  // A second click generates the current edits, rather than downloading stale bytes.
  await rotateImage(page);
  const rotatedEvent = page.waitForEvent("download");
  await button.click();
  const rotated = await PDFDocument.load(
    await readFile((await (await rotatedEvent).path())!),
  );
  expect(rotated.getPage(0).getWidth()).toBeCloseTo(
    original.getPage(0).getHeight(),
    1,
  );
  expect(rotated.getPage(0).getHeight()).toBeCloseTo(
    original.getPage(0).getWidth(),
    1,
  );
  await rotateImage(page);
  await rotateImage(page);
  await rotateImage(page);
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.setViewportSize({ width: 1100, height: 920 });
  await page.locator(".tool-toolbar").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/passport-direct-download.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".tool-toolbar").scrollIntoViewIfNeeded();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/passport-direct-download-mobile.png",
  });
  await page.getByRole("button", { name: "Clear file" }).click();
  await page.getByLabel("Choose passport file").setInputFiles({
    name: "synthetic-existing.pdf",
    mimeType: "application/pdf",
    buffer: bytes,
  });
  const existingDownloadEvent = page.waitForEvent("download");
  await button.click();
  expect(await readFile((await (await existingDownloadEvent).path())!)).toEqual(
    bytes,
  );
  await page.getByRole("button", { name: "Clear file" }).click();
  await expect(button).toHaveCount(0);
  expect(context.pages()).toHaveLength(1);
  expect(requests).toEqual([]);
  expect(errors).toEqual([]);
});

test("failed PDF conversion reports an error without downloading", async ({
  page,
}) => {
  await page.goto("/tools/passport-pdf/");
  const downloads: string[] = [];
  page.on("download", (download) =>
    downloads.push(download.suggestedFilename()),
  );
  await page
    .getByLabel("Choose passport file")
    .setInputFiles(fixture("tiny.png"));
  await page.getByRole("button", { name: "Download PDF" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "PDF smaller than 10 KB",
  );
  await expect(
    page.getByRole("button", { name: "Download PDF" }),
  ).toBeEnabled();
  await expect(page.locator(".output-panel")).toHaveCount(0);
  expect(downloads).toEqual([]);
});

test("corrupt HEIC, undersized files and invalid PDFs fail visibly", async ({
  page,
}) => {
  const downloads: string[] = [];
  page.on("download", (download) =>
    downloads.push(download.suggestedFilename()),
  );
  await page.goto("/tools/photo-jpeg/");
  await page.getByLabel("Choose photo file").setInputFiles({
    name: "synthetic.heic",
    mimeType: "image/heic",
    buffer: Buffer.from("not a valid HEIC"),
  });
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "HEIC/HEIF file could not be decoded on your device",
  );
  await page.getByLabel("Choose photo file").setInputFiles(fixture("tiny.png"));
  await page.getByRole("button", { name: "Download JPEG" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "350 × 350",
  );
  await expect(
    page.getByRole("button", { name: "Download JPEG" }),
  ).toBeEnabled();
  expect(downloads).toEqual([]);
  await page.goto("/tools/passport-pdf/");
  await page.getByLabel("Choose passport file").setInputFiles({
    name: "invalid.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("invalid"),
  });
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "10–300 KB",
  );
});

test("guide search, direct article and airport evidence work without a draft", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Search fields and common problems").fill("employer");
  await page
    .getByRole("link", {
      name: "Troubleshooting The form clears after an employer name",
    })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "The form clears after an employer name",
    }),
  ).toBeVisible();
  await expect(page.getByText("Reported issue", { exact: true })).toBeVisible();
  await page.goto("/reference/airports/");
  await page.getByLabel("Search airport or city").fill("TRV");
  await expect(
    page.getByText("TRIVANDRUM AIRPORT", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Check authorized entry" }),
  ).toBeVisible();
  await page.getByLabel("Search airport or city").fill("Gurgaon");
  await expect(
    page.getByRole("heading", {
      name: "No match in the mapped arrival choices.",
    }),
  ).toBeVisible();
});

test("mobile layout, accessibility and production CSP", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.goto("/");
  expect(response?.headers()["content-security-policy"]).toContain(
    "connect-src 'none'",
  );
  await expect(
    page.getByRole("heading", { name: /Your e-Visa/ }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
  for (const route of [
    "/",
    "/before-you-start/",
    "/#nationalId",
    "/#religion",
    "/#passportType",
    "/worksheet/",
    "/tools/photo-jpeg/",
    "/tools/passport-pdf/",
    "/reference/airports/",
  ]) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    if (route === "/tools/passport-pdf/") {
      const requirements = page.locator(".passport-requirements");
      const toggle = requirements.locator("summary");
      await expect(page.locator(".passport-intro .lede")).toContainText(
        "as a PDF, 10–300 KB",
      );
      await expect(requirements.locator("ul")).toBeHidden();
      await expect(toggle).toBeInViewport();
      const toggleBounds = await toggle.boundingBox();
      const pickerBounds = await page.locator(".dropzone").boundingBox();
      expect(toggleBounds!.y + toggleBounds!.height).toBeLessThan(
        pickerBounds!.y,
      );
      await page.screenshot({
        path: "test-results/passport-mobile.png",
        fullPage: true,
      });
      await toggle.focus();
      await page.keyboard.press("Space");
      await expect(requirements.locator("ul")).toBeVisible();
      await expect(requirements.locator("li")).toHaveCount(6);
      await expect(requirements).toContainText(
        "at least 10 KB, no more than 300 KB",
      );
      await expect(requirements).toContainText(
        "name, date of birth, nationality and expiry date",
      );
      await expect(requirements).toContainText("same passport");
      await expect(requirements).toContainText(
        "All documents must be in English",
      );
      await expect(requirements).toContainText("rejection of the application");
      await expect(
        requirements.getByRole("link", { name: "View source" }),
      ).toHaveAttribute(
        "href",
        "https://indianvisaonline.gov.in/evisa/images/SampleForm.pdf",
      );
      await page.screenshot({
        path: "test-results/passport-requirements-mobile.png",
        fullPage: true,
      });
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/tools/passport-pdf/");
  await page.screenshot({
    path: "test-results/passport-desktop.png",
    fullPage: true,
  });
  await page.goto("/");
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
  await page.goto("/");
  await page.screenshot({
    path: "test-results/guide-desktop.png",
    fullPage: true,
  });
});

test("preparation checklist is optional, accessible and stays local", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Checklist", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Before you start", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Find a field", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("checkbox", { name: /Previous Indian visa/ }),
  ).toBeHidden();
  await page.waitForLoadState("networkidle");
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  const mother = page.getByRole("checkbox", { name: /Mother’s details/ });
  await mother.focus();
  await page.keyboard.press("Space");
  await expect(mother).toBeChecked();
  await page
    .getByRole("checkbox", { name: /Hotel or place you’ll stay/ })
    .check();
  await page
    .getByRole("checkbox", { name: /A contact in your home country/ })
    .check();
  await page.getByText("Also gather, if applicable", { exact: true }).click();
  await page.getByRole("checkbox", { name: /Previous Indian visa/ }).check();
  await page.getByText("Also gather, if applicable", { exact: true }).click();
  await expect(mother).toBeChecked();
  expect(requests).toEqual([]);
  expect(
    await page.evaluate(() => ({
      local: { ...localStorage },
      session: { ...sessionStorage },
      cookie: document.cookie,
    })),
  ).toEqual({ local: {}, session: {}, cookie: "" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/checklist-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/checklist-mobile.png",
    fullPage: true,
  });
  await page.getByRole("link", { name: "Find a field", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your e-Visa, a little clearer." }),
  ).toBeVisible();
});

test("airport finder shares aliases without merging different port identities", async ({
  page,
}) => {
  await page.goto("/reference/airports/");
  const search = page.getByLabel("Search airport or city");
  for (const query of [
    "TRV",
    "Trivandrum",
    "Thiruvananthapuram International Airport",
  ]) {
    await search.fill(query);
    await expect(page.locator(".location-card")).toHaveCount(1);
    await expect(
      page.getByText("TRIVANDRUM AIRPORT", { exact: true }),
    ).toBeVisible();
  }
  await search.fill("Goa");
  await expect(page.locator(".location-card")).toHaveCount(3);
  await search.fill("Cochin");
  await expect(page.locator(".location-card")).toHaveCount(2);
  await search.fill("COK");
  await expect(page.locator(".location-card")).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: "Name / code source 1" }),
  ).toHaveAttribute("href", "https://www.cial.aero/About-Us");
});
