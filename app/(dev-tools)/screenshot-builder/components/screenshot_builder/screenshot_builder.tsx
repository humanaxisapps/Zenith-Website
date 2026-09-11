"use client";

import { ClientRuntimeThemeContext } from "@/contexts/client_runtime_theme_context";
import { useBezelImageRenderer } from "@/hooks/useBezelImageRenderer";
import { DEVICE_BEZEL_CONFIGURATION_MAP } from "@/lib/device_bezel_configuration_map";
import type { Bezel, BezelCropConfiguration } from "@/types/shared";
import { useMemo, useRef, useState } from "react";
import styles from "./screenshot_builder.module.css";

export const SCREENSHOT_BUILDER_THEME_ROOT_CONTAINER_CLASSNAME =
  "screenshotBuilderThemeRootContainer";

const DEVICE_OPTIONS = Object.keys(DEVICE_BEZEL_CONFIGURATION_MAP) as Bezel[];

const SIZE_PRESETS: { label: string; width: number; height: number }[] = [
  { label: "Square 1200x1200", width: 1200, height: 1200 },
  { label: "Wide 1600x900", width: 1600, height: 900 },
  { label: "Portrait 1080x1350", width: 1080, height: 1350 },
];

type CropPreset = "full" | "75" | "50";

const CROP_PRESET_OPTIONS: { value: CropPreset; label: string }[] = [
  { value: "full", label: "Full device" },
  { value: "75", label: "75% from the bottom" },
  { value: "50", label: "50% from the bottom" },
];

const CROP_PRESET_CONFIGURATION_MAP: Record<
  CropPreset,
  BezelCropConfiguration | undefined
> = {
  full: undefined,
  "75": { edge: "bottom", croppedRatio: 0.25 },
  "50": { edge: "bottom", croppedRatio: 0.5 },
};

const EXPORT_SCALE_OPTIONS = [1, 2, 3];

const MAX_PREVIEW_DIMENSION = 460;

/**
 * How much of the frame's width/height is reserved as padding around the
 * device. Kept as a single source of truth so the live preview (CSS padding)
 * and the downloaded PNG (canvas draw math) can never drift out of sync.
 */
const FRAME_PADDING_RATIO = 0.14;

interface ScreenshotBuilderProps {
  availableScreenshots: string[];
}

interface FramePadding {
  paddingX: number;
  paddingTop: number;
  paddingBottom: number;
}

function computeFramePadding({
  width,
  height,
  isCropped,
}: {
  width: number;
  height: number;
  isCropped: boolean;
}): FramePadding {
  const paddingX = width * FRAME_PADDING_RATIO;
  const paddingTop = height * FRAME_PADDING_RATIO;

  return {
    paddingX,
    paddingTop,
    // Cropped presets sit flush against the bottom edge.
    paddingBottom: isCropped ? 0 : paddingTop,
  };
}

/**
 * Downscaling a large canvas to a much smaller size in a single drawImage
 * call produces soft results and can fringe soft/anti-aliased edges (e.g.
 * the seam between the mask and the bezel) with the background color
 * showing through. Halving repeatedly until close to the target size, then
 * doing one small final draw, keeps every individual step gentle and crisp.
 */
function drawScaledDown(
  source: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  let current = source;
  let currentWidth = source.width;
  let currentHeight = source.height;

  while (
    currentWidth > targetWidth * 2 ||
    currentHeight > targetHeight * 2
  ) {
    const nextWidth = Math.max(targetWidth, Math.round(currentWidth / 2));
    const nextHeight = Math.max(targetHeight, Math.round(currentHeight / 2));

    const step = document.createElement("canvas");
    step.width = nextWidth;
    step.height = nextHeight;

    const stepCtx = step.getContext("2d");
    if (!stepCtx) {
      return current;
    }

    stepCtx.imageSmoothingEnabled = true;
    stepCtx.imageSmoothingQuality = "high";
    stepCtx.drawImage(
      current,
      0,
      0,
      currentWidth,
      currentHeight,
      0,
      0,
      nextWidth,
      nextHeight
    );

    current = step;
    currentWidth = nextWidth;
    currentHeight = nextHeight;
  }

  return current;
}

/**
 * useBezelImageRenderer reads the theme via context, so the component that
 * calls it must be a CHILD of the provider, not the one rendering it.
 */
export function ScreenshotBuilder(props: ScreenshotBuilderProps) {
  return (
    <ClientRuntimeThemeContext.Provider value="light">
      <ScreenshotBuilderContent {...props} />
    </ClientRuntimeThemeContext.Provider>
  );
}

function ScreenshotBuilderContent({
  availableScreenshots,
}: ScreenshotBuilderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(1200);
  const [backgroundColor, setBackgroundColor] = useState("#f2f2f7");
  const [bezel, setBezel] = useState<Bezel>(DEVICE_OPTIONS[0]);
  const [cropPreset, setCropPreset] = useState<CropPreset>("full");
  const [exportScale, setExportScale] = useState(2);
  const [screenshotSrc, setScreenshotSrc] = useState(
    availableScreenshots[0] ?? "/app_view/screenshot_placeholder.png"
  );

  const isCropped = cropPreset !== "full";
  const bezelCrop = CROP_PRESET_CONFIGURATION_MAP[cropPreset];

  useBezelImageRenderer({
    canvasRef,
    src: screenshotSrc,
    bezel,
    crop: bezelCrop,
  });

  const previewScale = useMemo(
    () =>
      Math.min(
        1,
        MAX_PREVIEW_DIMENSION / width,
        MAX_PREVIEW_DIMENSION / height
      ),
    [width, height]
  );

  // The preview frame is rendered directly at its final on-screen pixel
  // size (rather than full-size and then CSS-transform-scaled down) so the
  // canvas bitmap only ever goes through one scaling step, same as
  // production usage elsewhere in the app.
  const previewWidth = width * previewScale;
  const previewHeight = height * previewScale;
  const previewFramePadding = computeFramePadding({
    width: previewWidth,
    height: previewHeight,
    isCropped,
  });

  function handleDownload() {
    const sourceCanvas = canvasRef.current;

    if (!sourceCanvas || sourceCanvas.width === 0) {
      return;
    }

    // Render at a higher physical pixel density than the requested logical
    // size (like a @2x/@3x asset export), otherwise the device — which only
    // occupies a fraction of the padded frame — ends up with too few actual
    // pixels to look crisp once viewed at real size or zoomed in.
    const outputWidth = width * exportScale;
    const outputHeight = height * exportScale;

    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = outputWidth;
    outputCanvas.height = outputHeight;

    const ctx = outputCanvas.getContext("2d");

    if (!ctx) {
      return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, outputWidth, outputHeight);

    const { paddingX, paddingTop, paddingBottom } = computeFramePadding({
      width: outputWidth,
      height: outputHeight,
      isCropped,
    });
    const contentWidth = outputWidth - paddingX * 2;
    const contentHeight = outputHeight - paddingTop - paddingBottom;

    const scale = Math.min(
      contentWidth / sourceCanvas.width,
      contentHeight / sourceCanvas.height
    );

    const drawWidth = sourceCanvas.width * scale;
    const drawHeight = sourceCanvas.height * scale;
    const drawX = paddingX + (contentWidth - drawWidth) / 2;
    const drawY = isCropped
      ? outputHeight - paddingBottom - drawHeight
      : paddingTop + (contentHeight - drawHeight) / 2;

    const scaledDeviceCanvas = drawScaledDown(
      sourceCanvas,
      Math.round(drawWidth),
      Math.round(drawHeight)
    );

    ctx.drawImage(scaledDeviceCanvas, drawX, drawY, drawWidth, drawHeight);

    const link = document.createElement("a");
    link.href = outputCanvas.toDataURL("image/png");
    link.download = buildFileName({
      screenshotSrc,
      bezel,
      cropPreset,
      width,
      height,
      exportScale,
    });
    link.click();
  }

  return (
    <div
      className={`${SCREENSHOT_BUILDER_THEME_ROOT_CONTAINER_CLASSNAME} ${styles.builder}`}
    >
      <div className={styles.previewColumn}>
        <div
          className={styles.previewFrame}
          style={{
            width: previewWidth,
            height: previewHeight,
            backgroundColor,
          }}
        >
          <canvas
            ref={canvasRef}
            className={`${styles.previewCanvas} ${
              isCropped ? styles.bottomAligned : styles.centered
            }`}
            style={{
              padding: `${previewFramePadding.paddingTop}px ${previewFramePadding.paddingX}px ${previewFramePadding.paddingBottom}px`,
            }}
          />
        </div>
        <span className={styles.dimensionsLabel}>
          {width} x {height}px
        </span>
      </div>

      <div className={styles.controlsColumn}>
        <h1 className={styles.title}>Screenshot Builder</h1>
        <p className={styles.subtitle}>
          Compose a device screenshot on a solid background, then download it
          as a PNG at the exact size you need.
        </p>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Screenshot</span>
          <input
            className={styles.textInput}
            type="text"
            list="screenshot-options"
            value={screenshotSrc}
            onChange={(event) => setScreenshotSrc(event.target.value)}
          />
          <datalist id="screenshot-options">
            {availableScreenshots.map((src) => (
              <option key={src} value={src} />
            ))}
          </datalist>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Device</span>
          <select
            className={styles.select}
            value={bezel}
            onChange={(event) => setBezel(event.target.value as Bezel)}
          >
            {DEVICE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Crop</span>
          <div className={styles.radioGroup}>
            {CROP_PRESET_OPTIONS.map((option) => (
              <label key={option.value} className={styles.radioOption}>
                <input
                  type="radio"
                  name="cropPreset"
                  value={option.value}
                  checked={cropPreset === option.value}
                  onChange={() => setCropPreset(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Background color</span>
          <div className={styles.colorRow}>
            <input
              className={styles.colorInput}
              type="color"
              value={backgroundColor}
              onChange={(event) => setBackgroundColor(event.target.value)}
            />
            <input
              className={styles.textInput}
              type="text"
              value={backgroundColor}
              onChange={(event) => setBackgroundColor(event.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Image size</span>
          <div className={styles.sizeRow}>
            <input
              className={styles.numberInput}
              type="number"
              min={1}
              value={width}
              onChange={(event) =>
                setWidth(Math.max(1, Number(event.target.value) || 1))
              }
            />
            <span className={styles.sizeSeparator}>x</span>
            <input
              className={styles.numberInput}
              type="number"
              min={1}
              value={height}
              onChange={(event) =>
                setHeight(Math.max(1, Number(event.target.value) || 1))
              }
            />
          </div>
          <div className={styles.presetRow}>
            {SIZE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className={styles.presetButton}
                onClick={() => {
                  setWidth(preset.width);
                  setHeight(preset.height);
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Export quality</span>
          <div className={styles.presetRow}>
            {EXPORT_SCALE_OPTIONS.map((scale) => (
              <button
                key={scale}
                type="button"
                className={`${styles.presetButton} ${
                  exportScale === scale ? styles.presetButtonActive : ""
                }`}
                onClick={() => setExportScale(scale)}
              >
                {scale}x ({width * scale}x{height * scale})
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={styles.downloadButton}
          onClick={handleDownload}
        >
          Download PNG
        </button>
      </div>
    </div>
  );
}

function buildFileName({
  screenshotSrc,
  bezel,
  cropPreset,
  width,
  height,
  exportScale,
}: {
  screenshotSrc: string;
  bezel: Bezel;
  cropPreset: CropPreset;
  width: number;
  height: number;
  exportScale: number;
}): string {
  const screenshotName =
    screenshotSrc.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "screenshot";

  const parts = [
    screenshotName,
    bezel,
    `crop-${cropPreset}`,
    `${width}x${height}`,
    `${exportScale}x`,
  ];

  return `${parts.map(slugify).join("-")}.png`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}
