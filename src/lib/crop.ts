// Fractions of the full, rotated image; the preview and export share these bounds.
export type CropRect = { x: number; y: number; width: number; height: number };
export type CropCorner = "nw" | "ne" | "sw" | "se";
export type CropHandle = "move" | "n" | "s" | "e" | "w" | CropCorner;
export const FULL_CROP: CropRect = { x: 0, y: 0, width: 1, height: 1 };
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export function centeredSquareCrop(width: number, height: number): CropRect {
  const side = Math.min(width, height);
  return {
    x: (1 - side / width) / 2,
    y: (1 - side / height) / 2,
    width: side / width,
    height: side / height,
  };
}

export function isCropCorner(handle: CropHandle): handle is CropCorner {
  return (
    handle === "nw" || handle === "ne" || handle === "sw" || handle === "se"
  );
}

export function resizeSquareCrop(
  start: CropRect,
  corner: CropCorner,
  dx: number,
  dy: number,
  imageAspect: number,
  minWidth: number,
  minHeight: number,
): CropRect {
  const west = corner.includes("w");
  const north = corner.includes("n");
  const anchorX = west ? start.x + start.width : start.x;
  const anchorY = north ? start.y + start.height : start.y;
  // Convert vertical movement to image-width units before locking the aspect.
  const delta =
    Math.abs(dx) >= Math.abs(dy / imageAspect)
      ? dx * (west ? -1 : 1)
      : (dy / imageAspect) * (north ? -1 : 1);
  const maxWidth = Math.min(
    west ? anchorX : 1 - anchorX,
    (north ? anchorY : 1 - anchorY) / imageAspect,
  );
  const minimum = Math.min(
    maxWidth,
    Math.max(minWidth, minHeight / imageAspect),
  );
  const width = clamp(start.width + delta, minimum, maxWidth);
  const height = width * imageAspect;
  return {
    x: west ? anchorX - width : anchorX,
    y: north ? anchorY - height : anchorY,
    width,
    height,
  };
}

export function moveCrop(
  start: CropRect,
  handle: CropHandle,
  dx: number,
  dy: number,
  minWidth: number,
  minHeight: number,
): CropRect {
  if (handle === "move")
    return {
      ...start,
      x: clamp(start.x + dx, 0, 1 - start.width),
      y: clamp(start.y + dy, 0, 1 - start.height),
    };
  let left = start.x,
    top = start.y;
  let right = left + start.width,
    bottom = top + start.height;
  if (handle.includes("w"))
    left = clamp(left + dx, 0, Math.max(0, right - minWidth));
  if (handle.includes("e"))
    right = clamp(right + dx, Math.min(1, left + minWidth), 1);
  if (handle.includes("n"))
    top = clamp(top + dy, 0, Math.max(0, bottom - minHeight));
  if (handle.includes("s"))
    bottom = clamp(bottom + dy, Math.min(1, top + minHeight), 1);
  return { x: left, y: top, width: right - left, height: bottom - top };
}

export function rotateCrop(crop: CropRect): CropRect {
  return {
    x: clamp(1 - crop.y - crop.height, 0, 1 - crop.height),
    y: crop.x,
    width: crop.height,
    height: crop.width,
  };
}
