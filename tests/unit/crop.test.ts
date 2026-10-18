import { describe, expect, it } from "vitest";
import {
  FULL_CROP,
  centeredSquareCrop,
  moveCrop,
  resizeSquareCrop,
  rotateCrop,
  type CropCorner,
  type CropHandle,
} from "../../src/lib/crop";

describe("passport crop bounds", () => {
  it("moves the selected area without resizing or escaping the image", () => {
    const crop = { x: 0.2, y: 0.3, width: 0.5, height: 0.4 };
    expect(moveCrop(crop, "move", 5, -5, 0.1, 0.1)).toEqual({
      x: 0.5,
      y: 0,
      width: 0.5,
      height: 0.4,
    });
  });
  it("resizes width and height independently from the selected corner", () => {
    expect(moveCrop(FULL_CROP, "nw", 0.2, 0.1, 0.1, 0.1)).toEqual({
      x: 0.2,
      y: 0.1,
      width: 0.8,
      height: 0.9,
    });
    expect(moveCrop(FULL_CROP, "e", -0.3, 0.8, 0.1, 0.1)).toEqual({
      x: 0,
      y: 0,
      width: 0.7,
      height: 1,
    });
  });
  it("clamps every resize direction, including after the viewport shrinks", () => {
    const handles: CropHandle[] = ["nw", "ne", "sw", "se", "n", "s", "e", "w"];
    for (const crop of [
      FULL_CROP,
      { x: 0.93, y: 0.92, width: 0.07, height: 0.08 },
    ]) {
      for (const handle of handles) {
        for (const delta of [-5, 0, 5]) {
          const result = moveCrop(crop, handle, delta, delta, 0.2, 0.2);
          expect(result.x).toBeGreaterThanOrEqual(0);
          expect(result.y).toBeGreaterThanOrEqual(0);
          expect(result.width).toBeGreaterThan(0);
          expect(result.height).toBeGreaterThan(0);
          expect(result.x + result.width).toBeLessThanOrEqual(1.000001);
          expect(result.y + result.height).toBeLessThanOrEqual(1.000001);
        }
      }
    }
  });
  it("rotates the same selected pixels and returns after four turns", () => {
    const crop = { x: 0.1, y: 0.2, width: 0.6, height: 0.5 };
    const turned = rotateCrop(crop);
    expect(turned.x).toBeCloseTo(0.3);
    expect(turned.y).toBe(0.1);
    expect(turned.width).toBe(0.5);
    expect(turned.height).toBe(0.6);
    const restored = rotateCrop(rotateCrop(rotateCrop(turned)));
    for (const key of ["x", "y", "width", "height"] as const)
      expect(restored[key]).toBeCloseTo(crop[key]);
  });
});

describe("square photo crop", () => {
  it("centers the largest square in portrait and landscape images", () => {
    expect(centeredSquareCrop(1200, 1500)).toEqual({
      x: 0,
      y: (1 - 0.8) / 2,
      width: 1,
      height: 0.8,
    });
    expect(centeredSquareCrop(1500, 1200)).toEqual({
      x: (1 - 0.8) / 2,
      y: 0,
      width: 0.8,
      height: 1,
    });
    expect(centeredSquareCrop(500, 500)).toEqual(FULL_CROP);
  });
  it("keeps the opposite corner fixed while resizing on either axis", () => {
    const start = { x: 0.2, y: 0.2, width: 0.5, height: 0.4 };
    const horizontal = resizeSquareCrop(start, "se", -0.1, 0, 0.8, 0.05, 0.05);
    expect(horizontal.x).toBe(start.x);
    expect(horizontal.y).toBe(start.y);
    expect(horizontal.width).toBeCloseTo(0.4);
    expect(horizontal.height).toBeCloseTo(0.32);
    const vertical = resizeSquareCrop(start, "nw", 0, 0.08, 0.8, 0.05, 0.05);
    expect(vertical.x + vertical.width).toBeCloseTo(start.x + start.width);
    expect(vertical.y + vertical.height).toBeCloseTo(start.y + start.height);
    expect(vertical.width).toBeCloseTo(0.4);
    expect(vertical.height).toBeCloseTo(0.32);
  });
  it("stays square and in bounds at every corner and after rotation or a viewport shrink", () => {
    for (const aspect of [0.5, 1, 2]) {
      const start = centeredSquareCrop(1000 * aspect, 1000);
      for (const corner of ["nw", "ne", "sw", "se"] as CropCorner[]) {
        for (const dx of [-5, -0.15, 0, 0.15, 5]) {
          for (const dy of [-5, 0, 5]) {
            const crop = resizeSquareCrop(
              start,
              corner,
              dx,
              dy,
              aspect,
              0.2,
              0.2,
            );
            expect(crop.height).toBeCloseTo(crop.width * aspect);
            expect(crop.width).toBeGreaterThan(0);
            expect(crop.x).toBeGreaterThanOrEqual(-1e-10);
            expect(crop.y).toBeGreaterThanOrEqual(-1e-10);
            expect(crop.x + crop.width).toBeLessThanOrEqual(1.000001);
            expect(crop.y + crop.height).toBeLessThanOrEqual(1.000001);
            const turned = rotateCrop(crop);
            expect(turned.height).toBeCloseTo(turned.width / aspect);
            const enlargedMinimum = resizeSquareCrop(
              crop,
              corner,
              -1,
              -1,
              aspect,
              0.4,
              0.4,
            );
            expect(enlargedMinimum.height).toBeCloseTo(
              enlargedMinimum.width * aspect,
            );
            expect(
              enlargedMinimum.x + enlargedMinimum.width,
            ).toBeLessThanOrEqual(1.000001);
            expect(
              enlargedMinimum.y + enlargedMinimum.height,
            ).toBeLessThanOrEqual(1.000001);
          }
        }
      }
    }
  });
});
