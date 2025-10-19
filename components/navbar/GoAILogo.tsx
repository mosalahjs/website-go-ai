"use client";

import * as React from "react";
import NextImage from "next/image";
import { useTheme } from "next-themes";
import clsx from "clsx";

/* =================== Types =================== */

type TrimSides = {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
};

type GoAILogoProps = {
  src?: string;
  width?: number;
  alt?: string;
  className?: string;
  priority?: boolean;
  trimTransparent?: boolean;
  trimSides?: TrimSides;
  darkRecolorWordmark?: boolean;
};

type HSL = { h: number; s: number; l: number };

type BoundingBox = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

/* =================== Constants =================== */

const DEFAULT_ALPHA_THRESHOLD = 1;
const MAX_LIGHTNESS = 0.22;
const MIN_SATURATION_FOR_TEXT = 0.15;
const BLUE_HUE_MIN = 190;
const BLUE_HUE_MAX = 230;
const MIN_SATURATION_BLUE = 0.35;
const MIN_LIGHTNESS_BLUE = 0.25;

const DEFAULT_PROPS = {
  src: "/logo/logo.png",
  width: 120,
  alt: "Go AI 247 logo", // ← نص بديل مختصر ووصفي
  trimTransparent: true,
  trimSides: { bottom: true } as TrimSides,
  darkRecolorWordmark: true,
} as const;

/* =================== Image Processing Utilities =================== */

const hasAlphaAtPosition = (
  data: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
  threshold: number
): boolean => data[(y * width + x) * 4 + 3] > threshold;

const findBoundingBox = (
  imgData: ImageData,
  sides: TrimSides,
  alphaThreshold: number
): BoundingBox => {
  const { width, height, data } = imgData;
  const hasAlphaAt = (x: number, y: number) =>
    hasAlphaAtPosition(data, width, x, y, alphaThreshold);

  let top = 0,
    bottom = height - 1,
    left = 0,
    right = width - 1;

  if (sides.top) {
    scanTop: for (; top < height; top++) {
      for (let x = 0; x < width; x++) if (hasAlphaAt(x, top)) break scanTop;
    }
    if (top === height) top = 0;
  }
  if (sides.bottom) {
    scanBottom: for (; bottom >= 0; bottom--) {
      for (let x = 0; x < width; x++)
        if (hasAlphaAt(x, bottom)) break scanBottom;
    }
    if (bottom < 0) bottom = height - 1;
  }
  if (sides.left) {
    scanLeft: for (; left < width; left++) {
      for (let y = 0; y < height; y++) if (hasAlphaAt(left, y)) break scanLeft;
    }
    if (left === width) left = 0;
  }
  if (sides.right) {
    scanRight: for (; right >= 0; right--) {
      for (let y = 0; y < height; y++)
        if (hasAlphaAt(right, y)) break scanRight;
    }
    if (right < 0) right = width - 1;
  }

  return { top, bottom, left, right };
};

const cropImageData = (
  imgData: ImageData,
  box: BoundingBox,
  sides: TrimSides
): HTMLCanvasElement => {
  const { width, height } = imgData;
  const cropLeft = sides.left ? box.left : 0;
  const cropTop = sides.top ? box.top : 0;
  const cropRight = sides.right ? box.right : width - 1;
  const cropBottom = sides.bottom ? box.bottom : height - 1;

  const newWidth = Math.max(1, cropRight - cropLeft + 1);
  const newHeight = Math.max(1, cropBottom - cropTop + 1);

  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = width;
  tmpCanvas.height = height;
  const tmpCtx = tmpCanvas.getContext("2d", { willReadFrequently: true })!;
  tmpCtx.putImageData(imgData, 0, 0);

  const outCanvas = document.createElement("canvas");
  outCanvas.width = newWidth;
  outCanvas.height = newHeight;
  const outCtx = outCanvas.getContext("2d", { willReadFrequently: true })!;

  outCtx.drawImage(
    tmpCanvas,
    cropLeft,
    cropTop,
    newWidth,
    newHeight,
    0,
    0,
    newWidth,
    newHeight
  );
  return outCanvas;
};

const trimTransparentBorders = (
  imgData: ImageData,
  sides: TrimSides,
  alphaThreshold = DEFAULT_ALPHA_THRESHOLD
): HTMLCanvasElement => {
  const boundingBox = findBoundingBox(imgData, sides, alphaThreshold);
  return cropImageData(imgData, boundingBox, sides);
};

/* =================== Color Utilities =================== */

const rgbToHsl = (r: number, g: number, b: number): HSL => {
  const rN = r / 255,
    gN = g / 255,
    bN = b / 255;
  const max = Math.max(rN, gN, bN),
    min = Math.min(rN, gN, bN);
  const delta = max - min;
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    if (max === rN) h = 60 * (((gN - bN) / delta) % 6);
    else if (max === gN) h = 60 * ((bN - rN) / delta + 2);
    else h = 60 * ((rN - gN) / delta + 4);
    if (h < 0) h += 360;
  }
  return { h, s, l };
};

const isBlueColor = (hsl: HSL) =>
  hsl.h >= BLUE_HUE_MIN &&
  hsl.h <= BLUE_HUE_MAX &&
  hsl.s >= MIN_SATURATION_BLUE &&
  hsl.l >= MIN_LIGHTNESS_BLUE;

const isDarkText = (hsl: HSL) =>
  hsl.l <= MAX_LIGHTNESS && hsl.s <= MIN_SATURATION_FOR_TEXT;

const recolorDarkWordmarkToWhite = (imgData: ImageData): ImageData => {
  const p = imgData.data;
  for (let i = 0; i < p.length; i += 4) {
    const a = p[i + 3];
    if (a === 0) continue;
    const hsl = rgbToHsl(p[i], p[i + 1], p[i + 2]);
    if (!isBlueColor(hsl) && isDarkText(hsl)) {
      p[i] = 255;
      p[i + 1] = 255;
      p[i + 2] = 255;
    }
  }
  return imgData;
};

/* =================== Cache Utilities =================== */

const imageCache = new Map<string, string>();

const generateCacheKey = (
  src: string,
  theme: string | undefined,
  trimTransparent: boolean,
  trimSides: TrimSides,
  darkRecolorWordmark: boolean
): string => {
  const sidesKey = [
    trimSides.top ? "t" : "",
    trimSides.right ? "r" : "",
    trimSides.bottom ? "b" : "",
    trimSides.left ? "l" : "",
  ].join("");
  return [
    src,
    `theme:${theme}`,
    `trim:${trimTransparent}`,
    `sides:${sidesKey}`,
    `recolor:${darkRecolorWordmark}`,
  ].join("|");
};

/* =================== Image Loading =================== */

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load logo"));
  });

const createBaseCanvas = (img: HTMLImageElement): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  return canvas;
};

const processImage = async (
  src: string,
  theme: string | undefined,
  trimTransparent: boolean,
  trimSides: TrimSides,
  darkRecolorWordmark: boolean
): Promise<string> => {
  const cacheKey = generateCacheKey(
    src,
    theme,
    trimTransparent,
    trimSides,
    darkRecolorWordmark
  );
  const cached = imageCache.get(cacheKey);
  if (cached) return cached;

  const img = await loadImage(src);
  const baseCanvas = createBaseCanvas(img);
  const ctx = baseCanvas.getContext("2d", { willReadFrequently: true })!;
  let imgData = ctx.getImageData(0, 0, baseCanvas.width, baseCanvas.height);

  if (theme === "dark" && darkRecolorWordmark) {
    imgData = recolorDarkWordmarkToWhite(imgData);
  }

  let finalCanvas: HTMLCanvasElement;
  if (trimTransparent) finalCanvas = trimTransparentBorders(imgData, trimSides);
  else {
    ctx.putImageData(imgData, 0, 0);
    finalCanvas = baseCanvas;
  }

  const dataURL = finalCanvas.toDataURL("image/png");
  imageCache.set(cacheKey, dataURL);
  return dataURL;
};

/* =================== Component =================== */

const GoAILogo = React.memo<GoAILogoProps>(function GoAILogo({
  src = DEFAULT_PROPS.src,
  width = DEFAULT_PROPS.width,
  alt = DEFAULT_PROPS.alt,
  className,
  priority,
  trimTransparent = DEFAULT_PROPS.trimTransparent,
  trimSides = DEFAULT_PROPS.trimSides,
  darkRecolorWordmark = DEFAULT_PROPS.darkRecolorWordmark,
}) {
  const { resolvedTheme } = useTheme();
  const [processedURL, setProcessedURL] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const url = await processImage(
          src,
          resolvedTheme,
          trimTransparent,
          trimSides,
          darkRecolorWordmark
        );
        if (mounted) setProcessedURL(url);
      } catch (e) {
        console.error("Failed to process logo:", e);
      }
    };
    if (typeof window !== "undefined") run();
    return () => {
      mounted = false;
    };
  }, [src, resolvedTheme, trimTransparent, trimSides, darkRecolorWordmark]);

  const fallbackHeight = Math.round(width * 0.6);

  return (
    <div
      className={clsx(
        "inline-flex items-center justify-center overflow-hidden leading-none",
        "[&>*]:m-0 [&>*]:p-0 select-none",
        className
      )}
      style={{ width, lineHeight: 0 }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: fallbackHeight,
        }}
      >
        <NextImage
          src={processedURL ?? src}
          alt={alt}
          fill
          priority={priority}
          className="object-contain pointer-events-none"
          sizes={`${width}px`}
        />
      </div>
    </div>
  );
});

GoAILogo.displayName = "GoAILogo";

export default GoAILogo;
