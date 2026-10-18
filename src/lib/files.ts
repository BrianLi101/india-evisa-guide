import { PDFDocument } from "pdf-lib";
import { FULL_CROP, type CropRect } from "./crop";
export const LIMITS = {
  photoMin: 10_240,
  photoMax: 1_000_000,
  pdfMin: 10_240,
  pdfMax: 300_000,
};
export type ImageAdjustments = {
  rotation: number;
  brightness: number;
  contrast: number;
  crop: CropRect;
};
export const initialAdjustments: ImageAdjustments = {
  rotation: 0,
  brightness: 100,
  contrast: 100,
  crop: FULL_CROP,
};
export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
export type LocalImage = HTMLImageElement | ImageBitmap;

export function releaseLocalImage(image: LocalImage) {
  if ("close" in image) image.close();
  else image.src = "";
}

export function imageSize(image: LocalImage) {
  return "naturalWidth" in image
    ? { width: image.naturalWidth, height: image.naturalHeight }
    : { width: image.width, height: image.height };
}

async function decodeNative(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  const image = new Image();
  try {
    image.src = url;
    await image.decode();
    return image;
  } catch (error) {
    image.src = "";
    throw error;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function loadLocalImage(file: File): Promise<LocalImage> {
  if (file.size > 30_000_000)
    throw new Error(
      "This file exceeds the 30 MB local processing limit. Export a smaller image on your device first.",
    );
  if (
    !/\.(jpe?g|png|webp|heic|heif)$/i.test(file.name) &&
    ![
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
    ].includes(file.type)
  )
    throw new Error("Choose a JPEG, PNG, WebP, HEIC or HEIF image.");
  let image: LocalImage;
  try {
    image = await decodeNative(file);
  } catch {
    if (!/\.hei[cf]$/i.test(file.name) && !/^image\/hei[cf]$/i.test(file.type))
      throw new Error(
        "This image could not be decoded. Export a fresh JPEG or PNG on your device and try again.",
      );
    // Only static decoder code is downloaded; the file stays in browser memory.
    const { heicTo } = await import("heic-to/csp").catch(() => {
      throw new Error(
        "The local HEIC decoder could not load. Reconnect and try again, or choose a JPEG or PNG. Your file was not uploaded.",
      );
    });
    try {
      image = await heicTo({ blob: file, type: "bitmap" });
    } catch {
      throw new Error(
        "This HEIC/HEIF file could not be decoded on your device. It may be damaged or use an unsupported format. Export it as JPEG or PNG and try again. Nothing was uploaded.",
      );
    }
  }
  const { width, height } = imageSize(image);
  if (width * height > 40_000_000) {
    releaseLocalImage(image);
    throw new Error(
      "This image is too large for reliable local processing. Export it below 40 megapixels.",
    );
  }
  return image;
}
export function drawAdjusted(
  image: LocalImage,
  a: ImageAdjustments,
  maxDimension: number,
): HTMLCanvasElement {
  const rotated = document.createElement("canvas");
  const quarter = a.rotation % 180 !== 0;
  const { width, height } = imageSize(image);
  rotated.width = quarter ? height : width;
  rotated.height = quarter ? width : height;
  const rc = rotated.getContext("2d");
  if (!rc) throw new Error("Canvas processing is unavailable in this browser.");
  rc.fillStyle = "white";
  rc.fillRect(0, 0, rotated.width, rotated.height);
  rc.translate(rotated.width / 2, rotated.height / 2);
  rc.rotate((a.rotation * Math.PI) / 180);
  if (a.brightness !== 100 || a.contrast !== 100)
    rc.filter = `brightness(${a.brightness}%) contrast(${a.contrast}%)`;
  rc.drawImage(image, -width / 2, -height / 2);
  const cw = rotated.width * a.crop.width;
  const ch = rotated.height * a.crop.height;
  const scale = Math.min(1, maxDimension / Math.max(cw, ch));
  const output = document.createElement("canvas");
  output.width = Math.max(1, Math.round(cw * scale));
  output.height = Math.max(1, Math.round(ch * scale));
  const ctx = output.getContext("2d");
  if (!ctx) throw new Error("Canvas processing is unavailable.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    rotated,
    rotated.width * a.crop.x,
    rotated.height * a.crop.y,
    cw,
    ch,
    0,
    0,
    output.width,
    output.height,
  );
  rotated.width = rotated.height = 0;
  return output;
}
function encodeImage(
  canvas: HTMLCanvasElement,
  type: "image/jpeg" | "image/png",
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) =>
        b
          ? resolve(b)
          : reject(new Error("Image conversion failed in this browser.")),
      type,
      quality,
    ),
  );
}
export async function createPhoto(
  image: LocalImage,
  a: ImageAdjustments,
): Promise<{ blob: Blob; width: number; height: number }> {
  const canvas = drawAdjusted(image, a, 1200);
  try {
    if (canvas.width < 350)
      throw new Error(
        "The cropped image is below the 350 × 350 pixel minimum. Choose a larger source or enlarge the crop.",
      );
    for (const quality of [0.95, 0.9, 0.85, 0.8, 0.75, 0.7]) {
      const blob = await encodeImage(canvas, "image/jpeg", quality);
      if (blob.size >= LIMITS.photoMin && blob.size <= LIMITS.photoMax)
        return { blob, width: canvas.width, height: canvas.height };
    }
    throw new Error(
      "A JPEG within 10 KB–1 MB could not be produced at the quality floor. Use a sharper source or a different crop; we will not pad a tiny file or keep degrading it.",
    );
  } finally {
    canvas.width = canvas.height = 0;
  }
}
export async function createPassport(
  image: LocalImage,
  a: ImageAdjustments,
): Promise<{ blob: Blob; width: number; height: number }> {
  const size = imageSize(image);
  const quarter = a.rotation % 180 !== 0;
  const longestEdge = Math.max(
    (quarter ? size.height : size.width) * a.crop.width,
    (quarter ? size.width : size.height) * a.crop.height,
  );
  const dimensions = [longestEdge];
  // Preserve the original pixels first; reduce resolution only when a
  // high-quality JPEG at that size cannot fit the complete PDF budget.
  // There is no passport pixel-dimension floor. Detailed images may need
  // further resizing, including sources already smaller than 1400 pixels.
  while (dimensions.at(-1)! > 1) {
    dimensions.push(Math.max(1, Math.floor(dimensions.at(-1)! * 0.85)));
  }
  for (const dimension of dimensions) {
    const canvas = drawAdjusted(image, a, dimension);
    try {
      async function pdf(scan: Blob) {
        const doc = await PDFDocument.create();
        doc.setProducer("India e-Visa Companion · local conversion");
        doc.setCreator("India e-Visa Companion");
        const data = await scan.arrayBuffer();
        const embedded =
          scan.type === "image/png"
            ? await doc.embedPng(data)
            : await doc.embedJpg(data);
        const page = doc.addPage([canvas.width * 0.36, canvas.height * 0.36]);
        page.drawImage(embedded, {
          x: 0,
          y: 0,
          width: page.getWidth(),
          height: page.getHeight(),
        });
        return new Blob([new Uint8Array(await doc.save())], {
          type: "application/pdf",
        });
      }
      const fits = (blob: Blob) =>
        blob.size >= LIMITS.pdfMin && blob.size <= LIMITS.pdfMax;
      const result = (blob: Blob) => ({
        blob,
        width: canvas.width,
        height: canvas.height,
      });
      // Clean scans can fit losslessly. Avoid an unnecessary JPEG conversion.
      if (dimension === longestEdge) {
        const png = await encodeImage(canvas, "image/png");
        const lossless = await pdf(png);
        if (fits(lossless)) return result(lossless);
      }
      const highest = await pdf(await encodeImage(canvas, "image/jpeg", 1));
      if (fits(highest)) return result(highest);
      if (highest.size < LIMITS.pdfMin)
        throw new Error(
          "This image produces a PDF smaller than 10 KB, even at maximum quality. Choose a larger or more detailed scan.",
        );
      let low = 0.85;
      let high = 1;
      let best = await pdf(await encodeImage(canvas, "image/jpeg", low));
      if (best.size > LIMITS.pdfMax) continue;
      // Measure the complete PDF, including its wrapper, instead of estimating
      // from the JPEG. Keep only an actually fitting candidate as the result.
      for (let step = 0; step < 7; step++) {
        const quality = (low + high) / 2;
        const candidate = await pdf(
          await encodeImage(canvas, "image/jpeg", quality),
        );
        if (candidate.size <= LIMITS.pdfMax) {
          low = quality;
          best = candidate;
        } else high = quality;
      }
      if (fits(best)) return result(best);
    } finally {
      canvas.width = canvas.height = 0;
    }
  }
  throw new Error(
    "Could not create a PDF within 10–300 KB. Try a different image or crop.",
  );
}
