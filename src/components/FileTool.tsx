"use client";
import { useState, useRef, useEffect } from "react";
import {
  Upload,
  RotateCw,
  Trash2,
  ShieldCheck,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import {
  createPassport,
  createPhoto,
  imageSize,
  initialAdjustments,
  LIMITS,
  loadLocalImage,
  releaseLocalImage,
  downloadBlob,
  type LocalImage,
} from "@/lib/files";
import { SourceNote } from "./ui";
import PassportRequirements from "./PassportRequirements";
import ImageCrop from "./ImageCrop";
import { centeredSquareCrop, rotateCrop, type CropRect } from "@/lib/crop";
import ImageAdjustments from "./ImageAdjustments";
export default function FileTool({
  mode,
  showPassportRequirements = true,
}: {
  mode: "photo" | "passport";
  showPassportRequirements?: boolean;
}) {
  const [source, setSource] = useState<LocalImage | null>(null);
  const [a, setA] = useState(initialAdjustments);
  const [existingPdf, setExistingPdf] = useState<Blob | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const generation = useRef(0);
  const photo = mode === "photo";
  useEffect(
    () => () => {
      generation.current++;
    },
    [],
  );
  useEffect(
    () => () => {
      if (source) releaseLocalImage(source);
    },
    [source],
  );
  function clear() {
    generation.current++;
    setSource(null);
    setExistingPdf(null);
    setA(initialAdjustments);
    setError("");
    if (input.current) input.current.value = "";
  }
  async function choose(file?: File) {
    if (!file) return;
    clear();
    const job = generation.current;
    setBusy(true);
    try {
      if (/\.pdf$/i.test(file.name) || file.type === "application/pdf") {
        if (photo)
          throw new Error(
            "A photo must come from an image. Choose JPEG, PNG, WebP, HEIC or HEIF.",
          );
        if (file.size < LIMITS.pdfMin || file.size > LIMITS.pdfMax)
          throw new Error(
            "Existing PDFs must already be within 10–300 KB. This tool does not recompress PDFs. Export a clear image locally and use that for conversion.",
          );
        const pdf = await PDFDocument.load(await file.arrayBuffer(), {
          updateMetadata: false,
        });
        if (pdf.getPageCount() !== 1)
          throw new Error(
            "Use a single biodata page. Export the correct page locally and try again.",
          );
        if (generation.current === job) setExistingPdf(file);
      } else {
        const img = await loadLocalImage(file);
        if (generation.current === job) {
          const { width, height } = imageSize(img);
          setA({
            ...initialAdjustments,
            crop: photo
              ? centeredSquareCrop(width, height)
              : initialAdjustments.crop,
          });
          setSource(img);
        } else releaseLocalImage(img);
      }
    } catch (e) {
      if (generation.current === job)
        setError(
          e instanceof Error
            ? e.message
            : "This file cannot be processed locally.",
        );
    } finally {
      if (generation.current === job) setBusy(false);
    }
  }
  function adjust(key: "brightness" | "contrast", value: number) {
    setA((prev) => ({ ...prev, [key]: value }));
    setExistingPdf(null);
    setError("");
  }
  function changeCrop(crop: CropRect) {
    setA((prev) => ({ ...prev, crop }));
    setExistingPdf(null);
    setError("");
  }
  function rotate() {
    setA((prev) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
      crop: rotateCrop(prev.crop),
    }));
    setExistingPdf(null);
    setError("");
  }
  async function convert() {
    if (busy) return;
    if (!source) {
      if (!photo && existingPdf)
        downloadBlob(existingPdf, "evisa-passport.pdf");
      return;
    }
    setBusy(true);
    setError("");
    setExistingPdf(null);
    const job = generation.current;
    try {
      const result = photo
        ? await createPhoto(source, a)
        : await createPassport(source, a);
      if (generation.current === job) {
        downloadBlob(
          result.blob,
          photo ? "evisa-photo.jpg" : "evisa-passport.pdf",
        );
      }
    } catch (e) {
      if (generation.current === job)
        setError(e instanceof Error ? e.message : "Conversion failed locally.");
    } finally {
      if (generation.current === job) setBusy(false);
    }
  }
  return (
    <div className="file-tool">
      {!photo && showPassportRequirements && <PassportRequirements />}
      <div className="tool-layout">
        <div className="tool-workspace">
          <input
            className="sr-only"
            ref={input}
            type="file"
            disabled={busy}
            id={`file-${mode}`}
            aria-label={`Choose ${photo ? "photo" : "passport"} file`}
            accept={`image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif${photo ? "" : ",application/pdf"}`}
            onChange={(e) => void choose(e.target.files?.[0])}
          />
          {error && (
            <div role="alert" className="notice error">
              {error}
            </div>
          )}
          {!source && !existingPdf ? (
            <div
              className={`dropzone ${dragging ? "dragging" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                if (!busy) void choose(e.dataTransfer.files[0]);
              }}
            >
              <span className="upload-icon">
                {photo ? (
                  <ImageIcon size={35} strokeWidth={1.3} />
                ) : (
                  <FileText size={35} strokeWidth={1.3} />
                )}
              </span>
              <button
                className="button primary"
                disabled={busy}
                onClick={() => input.current?.click()}
              >
                <Upload size={17} />
                Choose {photo ? "photo" : "passport scan"}
              </button>
              <small>JPEG, PNG, WebP or HEIC · up to 30 MB</small>
            </div>
          ) : (
            <>
              <div className="tool-toolbar">
                <div className="tool-toolbar-actions">
                  {source && !photo && (
                    <ImageAdjustments
                      brightness={a.brightness}
                      contrast={a.contrast}
                      disabled={busy}
                      onAdjust={adjust}
                    />
                  )}
                  {source && (
                    <button
                      type="button"
                      className="button small-button"
                      aria-label="Rotate 90°"
                      title="Rotate 90°"
                      onClick={rotate}
                      disabled={busy}
                    >
                      <RotateCw size={16} />
                      <span>Rotate</span>
                    </button>
                  )}
                  <button
                    className="button small-button"
                    onClick={clear}
                    disabled={busy}
                    aria-label="Clear file"
                    title="Clear file"
                  >
                    <Trash2 size={15} />
                    <span className="clear-file-label">Clear file</span>
                  </button>
                </div>
                {(source || (!photo && existingPdf)) && (
                  <button
                    className="button primary create-file-button"
                    onClick={() => void convert()}
                    disabled={busy}
                  >
                    {busy
                      ? "Preparing…"
                      : photo
                        ? "Download JPEG"
                        : "Download PDF"}
                  </button>
                )}
              </div>
              {source && (
                <>
                  <ImageCrop
                    mode={mode}
                    image={source}
                    crop={a.crop}
                    rotation={a.rotation}
                    brightness={a.brightness}
                    contrast={a.contrast}
                    disabled={busy}
                    onChange={changeCrop}
                  />
                </>
              )}
            </>
          )}
          {busy && (
            <p role="status" className="status-line">
              Processing on your device…
            </p>
          )}
        </div>
        <details className="tool-help quiet-disclosure">
          <summary>
            {photo ? "File requirements & help" : "Conversion help"}
          </summary>
          {photo ? (
            <>
              <div className="spec-row">
                <span>Output format</span>
                <strong>JPEG</strong>
              </div>
              <div className="spec-row">
                <span>Published file size</span>
                <strong>10 KB–1 MB</strong>
              </div>
              <div className="spec-row">
                <span>Shape</span>
                <strong>Square</strong>
              </div>
              <SourceNote />
              <p>
                Use a recent, front-facing photo. Show your whole head, from
                hair to chin, with eyes open and no spectacles. Choose a plain
                light or white background.
              </p>
            </>
          ) : (
            <p>
              Choose a JPEG, PNG, WebP, HEIC or HEIF image up to 30 MB. This
              tool also checks existing single-page PDFs within 10–300 KB,
              without changing their content or metadata.
            </p>
          )}
          <p>
            {photo
              ? "Use a photo of at least 350 × 350 pixels. This tool exports up to 1200 × 1200 without upscaling."
              : "The image is resized only as needed to fit the PDF limit, without upscaling. Check that all passport details are readable in your downloaded PDF."}
          </p>
          <div className="notice soft">
            <ShieldCheck size={19} />
            <p>
              Your files stay in memory. Clear the file or close this tab to
              release it. Images are re-encoded without their original EXIF
              metadata.
            </p>
          </div>
          <p className="small">
            HEIC and HEIF are decoded on your device. If a file cannot be read,
            export it as JPEG or PNG using your device’s photo app.
          </p>
        </details>
      </div>
    </div>
  );
}
