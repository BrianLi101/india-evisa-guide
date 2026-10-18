"use client";
import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { Move } from "lucide-react";
import {
  drawAdjusted,
  imageSize,
  initialAdjustments,
  type LocalImage,
} from "@/lib/files";
import {
  FULL_CROP,
  isCropCorner,
  moveCrop,
  resizeSquareCrop,
  type CropHandle,
  type CropRect,
} from "@/lib/crop";

const handles: { id: CropHandle; label: string; x: number; y: number }[] = [
  { id: "nw", label: "top left corner", x: 0, y: 0 },
  { id: "n", label: "top edge", x: 50, y: 0 },
  { id: "ne", label: "top right corner", x: 100, y: 0 },
  { id: "e", label: "right edge", x: 100, y: 50 },
  { id: "se", label: "bottom right corner", x: 100, y: 100 },
  { id: "s", label: "bottom edge", x: 50, y: 100 },
  { id: "sw", label: "bottom left corner", x: 0, y: 100 },
  { id: "w", label: "left edge", x: 0, y: 50 },
];

export default function ImageCrop({
  mode,
  image,
  crop,
  rotation,
  brightness,
  contrast,
  disabled,
  onChange,
}: {
  mode: "photo" | "passport";
  image: LocalImage;
  crop: CropRect;
  rotation: number;
  brightness: number;
  contrast: number;
  disabled: boolean;
  onChange: (crop: CropRect) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const helpId = useId();
  const square = mode === "photo";
  const size = imageSize(image);
  const width = rotation % 180 === 0 ? size.width : size.height;
  const height = rotation % 180 === 0 ? size.height : size.width;
  const drag = useRef<{
    pointer: number;
    x: number;
    y: number;
    width: number;
    height: number;
    crop: CropRect;
    handle: CropHandle;
  } | null>(null);
  useEffect(() => {
    if (!canvas.current) return;
    const preview = drawAdjusted(
      image,
      {
        ...initialAdjustments,
        rotation,
        brightness,
        contrast,
        crop: FULL_CROP,
      },
      2400,
    );
    canvas.current.width = preview.width;
    canvas.current.height = preview.height;
    canvas.current.getContext("2d")?.drawImage(preview, 0, 0);
    preview.width = preview.height = 0;
  }, [image, rotation, brightness, contrast]);

  function update(start: CropRect, handle: CropHandle, dx: number, dy: number) {
    // Keep handles usable on a tiny selection; this is not an output-resolution rule.
    const bounds = viewport.current?.getBoundingClientRect();
    if (!bounds) return;
    if (square && isCropCorner(handle)) {
      onChange(
        resizeSquareCrop(
          start,
          handle,
          dx,
          dy,
          width / height,
          48 / bounds.width,
          48 / bounds.height,
        ),
      );
      return;
    }
    onChange(
      moveCrop(
        start,
        handle,
        dx,
        dy,
        Math.min(1, 48 / bounds.width),
        Math.min(1, 48 / bounds.height),
      ),
    );
  }
  function begin(event: PointerEvent<HTMLButtonElement>, handle: CropHandle) {
    if (disabled || event.button !== 0 || drag.current) return;
    const bounds = viewport.current?.getBoundingClientRect();
    if (!bounds) return;
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      pointer: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      width: bounds.width,
      height: bounds.height,
      crop: { ...crop },
      handle,
    };
  }
  function move(event: PointerEvent<HTMLButtonElement>) {
    const start = drag.current;
    if (disabled || !start || start.pointer !== event.pointerId) return;
    update(
      start.crop,
      start.handle,
      (event.clientX - start.x) / start.width,
      (event.clientY - start.y) / start.height,
    );
  }
  function end(event: PointerEvent<HTMLButtonElement>) {
    if (drag.current?.pointer !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }
  function keyboard(
    event: KeyboardEvent<HTMLButtonElement>,
    handle: CropHandle,
  ) {
    const direction = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    }[event.key];
    if (!direction || disabled) return;
    event.preventDefault();
    const step = event.shiftKey ? 0.05 : 0.005;
    update(crop, handle, direction[0] * step, direction[1] * step);
  }
  return (
    <>
      <div className="canvas-stage image-crop-stage">
        <div
          className="image-crop-view"
          ref={viewport}
          style={{
            width: Math.min(width, (480 * width) / height),
            aspectRatio: `${width} / ${height}`,
          }}
        >
          <canvas
            ref={canvas}
            aria-label={square ? "Photo crop preview" : "Passport crop preview"}
          />
          <div
            className="image-crop-shade"
            aria-hidden="true"
            style={{
              clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${crop.x * 100}% ${crop.y * 100}%, ${crop.x * 100}% ${(crop.y + crop.height) * 100}%, ${(crop.x + crop.width) * 100}% ${(crop.y + crop.height) * 100}%, ${(crop.x + crop.width) * 100}% ${crop.y * 100}%, ${crop.x * 100}% ${crop.y * 100}%, 0 0)`,
            }}
          />
          <div
            className="image-crop-selection"
            style={{
              left: `${crop.x * 100}%`,
              top: `${crop.y * 100}%`,
              width: `${crop.width * 100}%`,
              height: `${crop.height * 100}%`,
            }}
          >
            {square && <div className="composition-guide" aria-hidden="true" />}
            <button
              type="button"
              className="image-crop-move"
              aria-label="Move crop area"
              aria-describedby={helpId}
              disabled={disabled}
              onPointerDown={(event) => begin(event, "move")}
              onPointerMove={move}
              onPointerUp={end}
              onPointerCancel={end}
              onLostPointerCapture={() => {
                drag.current = null;
              }}
              onKeyDown={(event) => keyboard(event, "move")}
            >
              <Move size={22} aria-hidden="true" />
            </button>
            {handles
              .filter((handle) => !square || isCropCorner(handle.id))
              .map((handle) => (
                <button
                  key={handle.id}
                  type="button"
                  className={`image-crop-handle handle-${handle.id}`}
                  style={{ left: `${handle.x}%`, top: `${handle.y}%` }}
                  aria-label={`Resize crop ${handle.label}`}
                  aria-describedby={helpId}
                  disabled={disabled}
                  onPointerDown={(event) => begin(event, handle.id)}
                  onPointerMove={move}
                  onPointerUp={end}
                  onPointerCancel={end}
                  onLostPointerCapture={() => {
                    drag.current = null;
                  }}
                  onKeyDown={(event) => keyboard(event, handle.id)}
                />
              ))}
          </div>
        </div>
      </div>
      <p id={helpId} className="sr-only">
        {square
          ? "Keep your full face inside the square."
          : "Keep the full passport details page inside the box."}{" "}
        Use arrow keys to move the selected crop control; hold Shift for larger
        steps.
      </p>
    </>
  );
}
