// Keeping private words out of what is sent. Hosts mark areas with an
// attribute (`data-luh="blur"` or `"hide"`), list selectors, and name pages
// where Luh is off or every screenshot is blurred; typed fields are hidden
// unless the host says otherwise. Redaction is painted into the picture's
// own pixels before it reaches the window, so the preview is what is sent.
import type { CommentModeOptions, PageRule } from "./types";

export type Treatment = "blur" | "hide";

/** The settled privacy settings, every default filled in. */
export interface Privacy {
  attribute: string;
  blur: string[];
  hide: string[];
  maskInputs: boolean;
  blurStrength: number;
  hideColor: string;
  pages: PageRule[];
}

/** A screen area to paint over, in CSS pixels from the viewport's corner. */
export interface Region {
  treatment: Treatment;
  left: number;
  top: number;
  width: number;
  height: number;
}

export const DEFAULT_ATTRIBUTE = "data-luh";
export const DEFAULT_BLUR_STRENGTH = 12;
/** Below this, pixelated words can still be guessed at. */
export const MIN_BLUR_STRENGTH = 6;
export const DEFAULT_HIDE_COLOR = "#d4d4d8";

/** Fields that hold what a person typed or chose. Buttons, ticks and sliders show no words. */
const TYPED = [
  'input:not([type="button"], [type="submit"], [type="reset"], [type="image"], [type="hidden"], [type="checkbox"], [type="radio"], [type="range"], [type="color"])',
  "textarea",
  "select",
  '[contenteditable]:not([contenteditable="false"])',
].join(", ");

const list = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value : value ? [value] : []).map((each) => each.trim()).filter(Boolean);

export function privacyFrom(options: CommentModeOptions): Privacy {
  const strength = Number(options.blurStrength ?? DEFAULT_BLUR_STRENGTH);
  return {
    attribute: options.privacyAttribute?.trim() || DEFAULT_ATTRIBUTE,
    blur: list(options.redact?.blur),
    hide: list(options.redact?.hide),
    maskInputs: options.maskInputs !== false,
    blurStrength: Number.isFinite(strength)
      ? Math.max(MIN_BLUR_STRENGTH, strength)
      : DEFAULT_BLUR_STRENGTH,
    hideColor: options.hideColor || DEFAULT_HIDE_COLOR,
    pages: options.pages ?? [],
  };
}

/** Turns a page pattern into a test: `*` matches any run of characters. */
function globTest(pattern: string): (url: URL) => boolean {
  const full = pattern.includes("://");
  const source = pattern
    .split("*")
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  const expression = new RegExp(`^${source}$`);
  return (url) => expression.test(full ? url.href : url.pathname);
}

/** The first rule matching this address decides: Luh off, or every screenshot blurred. */
export function pageMode(pages: PageRule[], href = location.href): PageRule["mode"] | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  for (const rule of pages) {
    try {
      const { match } = rule;
      const hit =
        typeof match === "function"
          ? match(url)
          : match instanceof RegExp
            ? new RegExp(match.source, match.flags.replace("g", "")).test(url.href)
            : globTest(match)(url);
      if (hit) return rule.mode;
    } catch {
      // A rule that cannot be read is taken as the strictest answer.
      return "off";
    }
  }
  return null;
}

/** Selectors that cannot be parsed are dropped one by one, never the whole list. */
function usable(selectors: string[]): string[] {
  return selectors.filter((selector) => {
    try {
      document.createDocumentFragment().querySelector(selector);
      return true;
    } catch {
      return false;
    }
  });
}

function selectorsFor(privacy: Privacy, treatment: Treatment): string[] {
  return [
    `[${privacy.attribute}="${treatment}"]`,
    ...usable(treatment === "blur" ? privacy.blur : privacy.hide),
    ...(treatment === "hide" && privacy.maskInputs ? [TYPED] : []),
  ];
}

/** How an element is treated: by itself or by anything that holds it. Hide wins over blur. */
export function treatment(element: Element, privacy: Privacy): Treatment | null {
  if (selectorsFor(privacy, "hide").some((selector) => element.closest(selector))) return "hide";
  if (selectorsFor(privacy, "blur").some((selector) => element.closest(selector))) return "blur";
  return null;
}

/** True when the element or its words should never travel as text. */
export function isPrivate(element: Element, privacy: Privacy): boolean {
  if (pageMode(privacy.pages)) return true;
  return treatment(element, privacy) !== null || element.querySelector(privateSelector(privacy)) !== null;
}

function privateSelector(privacy: Privacy) {
  return [...selectorsFor(privacy, "hide"), ...selectorsFor(privacy, "blur")].join(", ");
}

/** True when selected words touch a private area. */
export function selectionIsPrivate(privacy: Privacy, selection = document.getSelection()): boolean {
  if (!selection || selection.isCollapsed) return false;
  if (pageMode(privacy.pages)) return true;
  for (let index = 0; index < selection.rangeCount; index++) {
    const range = selection.getRangeAt(index);
    const start = range.startContainer;
    const holder = start instanceof Element ? start : start.parentElement;
    if (holder && treatment(holder, privacy)) return true;
    const end = range.endContainer;
    const endHolder = end instanceof Element ? end : end.parentElement;
    if (endHolder && treatment(endHolder, privacy)) return true;
    const common = range.commonAncestorContainer;
    const root = common instanceof Element ? common : common.parentElement;
    if (!root) continue;
    for (const element of root.querySelectorAll(privateSelector(privacy)))
      if (range.intersectsNode(element)) return true;
  }
  return false;
}

/** Every marked element on screen, each with the area it covers, words that spill out included. */
export function regions(privacy: Privacy, skip: (element: Element) => boolean): Region[] {
  const viewport = { width: window.innerWidth, height: window.innerHeight };
  const found: Region[] = [];
  for (const kind of ["blur", "hide"] as const) {
    for (const element of document.querySelectorAll(selectorsFor(privacy, kind).join(", "))) {
      if (skip(element)) continue;
      // A blurred area inside a hidden one is already covered.
      if (kind === "blur" && treatment(element, privacy) === "hide") continue;
      const box = covered(element);
      if (!box) continue;
      const left = Math.max(0, Math.floor(box.left));
      const top = Math.max(0, Math.floor(box.top));
      const right = Math.min(viewport.width, Math.ceil(box.right));
      const bottom = Math.min(viewport.height, Math.ceil(box.bottom));
      if (right > left && bottom > top)
        found.push({ treatment: kind, left, top, width: right - left, height: bottom - top });
    }
  }
  return found;
}

function covered(element: Element) {
  if (element.getClientRects().length === 0) return null;
  const boxes = [element.getBoundingClientRect()];
  try {
    const range = document.createRange();
    range.selectNodeContents(element);
    boxes.push(range.getBoundingClientRect());
  } catch {
    // An element with no contents covers only its own box.
  }
  const real = boxes.filter((box) => box.width > 0 || box.height > 0);
  if (real.length === 0) return null;
  return {
    left: Math.min(...real.map((box) => box.left)),
    top: Math.min(...real.map((box) => box.top)),
    right: Math.max(...real.map((box) => box.right)),
    bottom: Math.max(...real.map((box) => box.bottom)),
  };
}

/** Every letter and digit becomes "x": the shape of the words, none of the words. */
export function scramble(text: string) {
  return text.replace(/\S/g, "x");
}

/**
 * Scrubs a cloned subtree so the words are gone before any pixel is drawn:
 * text scrambled, typed values emptied, pictures dropped for hidden areas.
 * The pixel pass still paints over the area; this is the second lock.
 */
export function scrub(clone: Element, kind: Treatment) {
  const walker = clone.ownerDocument.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode())
    node.nodeValue = scramble(node.nodeValue ?? "");
  const fields = [clone, ...clone.querySelectorAll("input, textarea, select, option, img, picture, video, canvas, svg")];
  for (const field of fields) {
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      field.value = scramble(field.value);
      field.setAttribute("value", field.value);
      field.removeAttribute("placeholder");
    } else if (field instanceof HTMLOptionElement) {
      field.label = scramble(field.label);
    } else if (kind === "hide" && field !== clone) {
      field.remove();
    }
  }
  for (const attribute of ["title", "aria-label", "alt", "placeholder"]) clone.removeAttribute(attribute);
}

/** Coarse squares: unlike a soft blur, they cannot be sharpened back. */
export function pixelate(
  context: CanvasRenderingContext2D,
  area: { x: number; y: number; width: number; height: number },
  block: number,
) {
  const x = Math.max(0, Math.floor(area.x));
  const y = Math.max(0, Math.floor(area.y));
  const width = Math.min(context.canvas.width - x, Math.ceil(area.width));
  const height = Math.min(context.canvas.height - y, Math.ceil(area.height));
  if (width <= 0 || height <= 0) return;
  const size = Math.max(2, Math.round(block));
  const small = document.createElement("canvas");
  small.width = Math.max(1, Math.ceil(width / size));
  small.height = Math.max(1, Math.ceil(height / size));
  const shrink = small.getContext("2d");
  if (!shrink) throw new Error("No canvas");
  shrink.imageSmoothingEnabled = true;
  shrink.imageSmoothingQuality = "high";
  shrink.drawImage(context.canvas, x, y, width, height, 0, 0, small.width, small.height);
  context.save();
  context.imageSmoothingEnabled = false;
  context.clearRect(x, y, width, height);
  context.drawImage(small, 0, 0, small.width, small.height, x, y, small.width * size, small.height * size);
  context.restore();
}

/**
 * Paints the regions into the screenshot: hidden areas filled, blurred ones
 * pixelated, the whole picture pixelated on a blurred page. Any failure
 * returns null, so an unredacted picture is never handed on.
 */
export async function redactImage(
  blob: Blob,
  areas: Region[],
  privacy: Privacy,
  viewport: { width: number; height: number },
  wholePage: boolean,
): Promise<Blob | null> {
  if (areas.length === 0 && !wholePage) return blob;
  try {
    const image = await createImageBitmap(blob);
    const scale = image.width / viewport.width;
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.drawImage(image, 0, 0);
    image.close();
    const block = privacy.blurStrength * scale;
    // A little margin catches anti-aliased edges and descenders.
    const pad = 2 * scale;
    const box = (area: Region) => ({
      x: area.left * scale - pad,
      y: area.top * scale - pad,
      width: area.width * scale + pad * 2,
      height: area.height * scale + pad * 2,
    });
    if (wholePage) pixelate(context, { x: 0, y: 0, width: canvas.width, height: canvas.height }, block);
    else for (const area of areas) if (area.treatment === "blur") pixelate(context, box(area), block);
    context.fillStyle = privacy.hideColor;
    for (const area of areas) {
      if (area.treatment !== "hide") continue;
      const { x, y, width, height } = box(area);
      context.fillRect(x, y, width, height);
    }
    return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  } catch {
    return null;
  }
}

/** An element's words with every private part left out, as a note may carry them. */
export function publicText(element: Element, privacy: Privacy): string {
  if (pageMode(privacy.pages) || treatment(element, privacy)) return "";
  const parts: string[] = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const holder = node.parentElement;
    if (holder && holder !== element && treatment(holder, privacy)) continue;
    parts.push(node.nodeValue ?? "");
  }
  return parts.join("").replace(/\s+/g, " ").trim();
}
