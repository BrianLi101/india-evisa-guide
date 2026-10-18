import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadLocalImage, releaseLocalImage } from "../../src/lib/files";

const { convert } = vi.hoisted(() => ({ convert: vi.fn() }));
vi.mock("heic-to/csp", () => ({ heicTo: convert }));
let nativeFails = false;
let nativeWidth = 1600;
class NativeImage {
  src = "";
  naturalWidth = nativeWidth;
  naturalHeight = 1000;
  async decode() {
    if (nativeFails) throw new Error("Unsupported image");
  }
}
const revoked = vi.fn();
beforeEach(() => {
  nativeFails = false;
  nativeWidth = 1600;
  convert.mockReset();
  revoked.mockReset();
  vi.stubGlobal("Image", NativeImage);
  vi.stubGlobal("URL", {
    createObjectURL: () => "blob:synthetic",
    revokeObjectURL: revoked,
  });
});
afterEach(() => vi.unstubAllGlobals());
const file = () =>
  new File(["synthetic bytes"], "test.HEIC", { type: "image/heic" });

describe("local image decoding", () => {
  it("uses native HEIC decoding when available and releases its URL", async () => {
    const image = await loadLocalImage(file());
    expect(image).toBeInstanceOf(NativeImage);
    expect(convert).not.toHaveBeenCalled();
    expect(revoked).toHaveBeenCalledWith("blob:synthetic");
    releaseLocalImage(image);
    expect((image as HTMLImageElement).src).toBe("");
  });

  it("falls back to local bitmap decoding without an intermediate JPEG", async () => {
    nativeFails = true;
    const bitmap = { width: 1600, height: 1000, close: vi.fn() };
    convert.mockResolvedValue(bitmap);
    const input = file();
    const image = await loadLocalImage(input);
    expect(convert).toHaveBeenCalledWith({ blob: input, type: "bitmap" });
    expect(image).toBe(bitmap);
    expect(bitmap.close).not.toHaveBeenCalled();
    releaseLocalImage(image);
    expect(bitmap.close).toHaveBeenCalledOnce();
  });

  it("does not expose decoder diagnostics containing private input", async () => {
    nativeFails = true;
    convert.mockRejectedValue(new Error("SYNTHETIC-PRIVATE-DIAGNOSTIC"));
    await expect(loadLocalImage(file())).rejects.toThrow(
      "This HEIC/HEIF file could not be decoded on your device.",
    );
  });

  it("rejects large decoded bitmaps and closes them", async () => {
    nativeFails = true;
    const bitmap = { width: 10_000, height: 5_000, close: vi.fn() };
    convert.mockResolvedValue(bitmap);
    await expect(loadLocalImage(file())).rejects.toThrow("40 megapixels");
    expect(bitmap.close).toHaveBeenCalledOnce();
  });

  it("keeps native size errors distinct from format errors", async () => {
    nativeWidth = 50_000;
    await expect(loadLocalImage(file())).rejects.toThrow("40 megapixels");
    expect(convert).not.toHaveBeenCalled();
  });

  it("rejects oversized input before attempting any decoder", async () => {
    const input = file();
    Object.defineProperty(input, "size", { value: 30_000_001 });
    await expect(loadLocalImage(input)).rejects.toThrow("30 MB");
    expect(convert).not.toHaveBeenCalled();
    expect(revoked).not.toHaveBeenCalled();
  });
});
