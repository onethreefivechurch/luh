import { NAME } from "./name";
import { pageMode, redactImage, regions, scrub, treatment, type Privacy } from "./privacy";

// The page screenshot, drawn in the browser by modern-screenshot from the
// page as it is, with the library's own windows and the site's `ignore`
// elements left out. Taken only when the person asks for it.

/** The mark drawn on pictures: an annotation red, haloed so it shows on any page. */
export const MARK_COLOR = "#e5484d";

type Box = { left: number; top: number; width: number; height: number };
type Size = { width: number; height: number };

// Font rules are immutable assets within this document; keep their embedded
// bytes between captures, without caching any page pixels or private words.
const embeddedFonts = new Map<string, string>();

/** A screenshot with its private areas already painted over, and how many there were. */
export interface Capture {
  blob: Blob;
  redacted: number;
  wholePage: boolean;
}

export async function captureScreen(
  ignore: string,
  privacy: Privacy,
  progress: (percent: number) => void = () => {},
): Promise<Capture | null> {
  const root = document.documentElement;
  try {
    const mode = pageMode(privacy.pages);
    if (mode === "off") return null;
    const wholePage = mode === "blur";
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    // Measured from the page itself, at the moment of capture.
    const areas = regions(privacy, (element) => Boolean(element.closest(ignore)));
    const { createContext, destroyContext, domToBlob } = await import("modern-screenshot");
    // Font embedding must use the same metrics as the measured page.
    await document.fonts?.ready;
    // Each clone is paired with the live element it came from: the filter
    // records an element just before it is cloned, and cloning finishes
    // children before their parent, so a stack holds the pairs in step.
    const originals: Element[] = [root];
    // The library reports a frame's clone twice; the second report is no new element.
    const reported = new WeakSet<Node>();
    let placeholderIndex = 0;
    const context = await createContext(root, {
      filter: (node) => {
        // Nothing inside a frame is drawn: a same-origin frame is captured
        // blank, as a cross-origin one is. Its words are measured nowhere,
        // so drawing them could leak private ones.
        if (node.ownerDocument !== document) return false;
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          // Hidden subtrees have no layout or pixels to capture. The library's
          // temporary style sandbox must not be cloned into its own picture.
          if (element === context.sandbox || getComputedStyle(element).display === "none") return false;
          originals.push(element);
        }
        return true;
      },
      width: window.innerWidth,
      height: window.innerHeight,
      scale: Math.min(window.devicePixelRatio || 1, 2),
      backgroundColor: getComputedStyle(document.body).backgroundColor,
      type: "image/png",
      progress: (current, total) => progress(total === 0 ? 90 : Math.round((current / total) * 90)),
      features: { restoreScrollPosition: true },
      onCloneNode: () => progress(0),
      onEmbedNode: () => progress(95),
      onCloneEachNode: (node) => {
        // Element checks go by node type: a frame's clone belongs to the
        // frame's own window, where this window's classes do not match.
        if (node.nodeType !== Node.ELEMENT_NODE || reported.has(node)) return;
        reported.add(node);
        const original = originals.pop();
        const clone = node as Element;
        const frame = original instanceof HTMLIFrameElement;
        // A clone that is not its original's kind means the pairs slipped;
        // no picture is sent rather than one scrubbed in the wrong places.
        if (!original || (!frame && original.localName !== clone.localName)) throw new Error(OUT_OF_STEP);
        if (!(original instanceof HTMLElement) || !("style" in clone)) return;
        const html = clone as HTMLElement;
        if (frame) blankFrame(html, original);
        // Left out, but keeping its box so nothing around it moves.
        if (original.matches(ignore)) html.style.opacity = "0";
        if (frame || !(node instanceof HTMLElement)) return;
        if (node instanceof HTMLInputElement && node.type === "password") {
          node.value = "";
          node.setAttribute("value", "");
        }
        // Private words never reach the picture, even before the paint over them.
        const kind = wholePage && original === root ? "blur" : treatment(original, privacy);
        const parent = original.parentElement;
        if (kind && (!parent || treatment(parent, privacy) !== kind)) scrub(node, kind);
        if (node instanceof HTMLImageElement && original instanceof HTMLImageElement) {
          inlineLoadedImage(original, node);
        }
        const style = getComputedStyle(original);
        if (node.matches("input, textarea")) {
          const placeholder = getComputedStyle(original, "::placeholder");
          const name = `${NAME}-placeholder-${placeholderIndex++}`;
          node.classList.add(name);
          context.svgStyleElement?.appendChild(
            document.createTextNode(
              `.${name}::placeholder { color: ${placeholder.color}; -webkit-text-fill-color: ${placeholder.webkitTextFillColor}; opacity: ${placeholder.opacity}; }`,
            ),
          );
        }
        const verticalGutter =
          original.offsetWidth -
          original.clientWidth -
          parseFloat(style.borderLeftWidth) -
          parseFloat(style.borderRightWidth);
        const horizontalGutter =
          original.offsetHeight -
          original.clientHeight -
          parseFloat(style.borderTopWidth) -
          parseFloat(style.borderBottomWidth);
        // Hide only phantom SVG scrollbars. Removing a real scrollbar also
        // removes its layout space and shifts centred or wrapping content.
        if (["auto", "scroll", "overlay"].includes(node.style.overflowX) && horizontalGutter < 1)
          node.style.overflowX = "hidden";
        if (["auto", "scroll", "overlay"].includes(node.style.overflowY) && verticalGutter < 1)
          node.style.overflowY = "hidden";
      },
    });
    context.fontCssTexts = new Map(embeddedFonts);
    try {
      const shot = await domToBlob(context);
      if (originals.length > 0) throw new Error(OUT_OF_STEP);
      const blob = await redactImage(shot, areas, privacy, viewport, wholePage);
      if (!blob) return null;
      progress(100);
      return { blob, redacted: areas.length, wholePage };
    } finally {
      context.fontCssTexts.forEach((css, rule) => embeddedFonts.set(rule, css));
      destroyContext(context);
    }
  } catch {
    return null;
  }
}

const OUT_OF_STEP = "Screenshot clones out of step with the page";

/** The frame's own box, so the blank stand-in takes exactly its place. */
const FRAME_BOX = [
  "box-sizing",
  "width",
  "height",
  "vertical-align",
  ...["top", "right", "bottom", "left"].flatMap((side) => [
    `padding-${side}`,
    `border-${side}-width`,
    `border-${side}-style`,
    `border-${side}-color`,
  ]),
];

/** Empties a frame's clone and gives it the frame's box: nothing inside is drawn, nothing around it moves. */
function blankFrame(clone: HTMLElement, frame: HTMLIFrameElement) {
  clone.replaceChildren();
  const style = getComputedStyle(frame);
  for (const name of FRAME_BOX) clone.style.setProperty(name, style.getPropertyValue(name));
  clone.style.display = style.display === "inline" ? "inline-block" : style.display;
  clone.style.overflow = "hidden";
}

/** Reuses decoded pixels instead of downloading each photo again to inline it. */
function inlineLoadedImage(original: HTMLImageElement, clone: HTMLImageElement) {
  if (!original.complete || !original.naturalWidth || !original.naturalHeight) return;
  try {
    const canvas = document.createElement("canvas");
    // Keep the source's aspect ratio and enough pixels for its displayed size.
    const scale = Math.min(
      2,
      Math.max(original.width / original.naturalWidth, original.height / original.naturalHeight) *
        Math.min(window.devicePixelRatio || 1, 2),
    );
    canvas.width = Math.max(1, Math.ceil(original.naturalWidth * scale));
    canvas.height = Math.max(1, Math.ceil(original.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(original, 0, 0, canvas.width, canvas.height);
    const source = canvas.toDataURL("image/png");
    clone.srcset = "";
    clone.src = source;
  } catch {
    // Cross-origin pixels may be protected; the library's normal CORS fetch remains.
  }
}

/** Bounds clipped to the screen, in CSS pixels, or null when off screen. */
export function visible(bounds: DOMRect | Box, size: Size): Box | null {
  const left = Math.max(0, bounds.left);
  const top = Math.max(0, bounds.top);
  const width = Math.min(size.width, bounds.left + bounds.width) - left;
  const height = Math.min(size.height, bounds.top + bounds.height) - top;
  return width > 0 && height > 0 ? { left, top, width, height } : null;
}

async function draw(
  blob: Blob,
  viewport: Size,
  paint: (image: ImageBitmap, scale: number) => HTMLCanvasElement | null,
): Promise<Blob | null> {
  try {
    const image = await createImageBitmap(blob);
    const canvas = paint(image, image.width / viewport.width);
    image.close();
    return canvas
      ? await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"))
      : null;
  } catch {
    return null;
  }
}

/** Just the picked part, cut from the screenshot. */
export function cropTo(blob: Blob, bounds: DOMRect, viewport: Size) {
  return draw(blob, viewport, (image, scale) => {
    const box = visible(bounds, viewport);
    if (!box) return null;
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(box.width * scale);
    canvas.height = Math.ceil(box.height * scale);
    canvas
      .getContext("2d")
      ?.drawImage(
        image,
        box.left * scale,
        box.top * scale,
        box.width * scale,
        box.height * scale,
        0,
        0,
        canvas.width,
        canvas.height,
      );
    return canvas;
  });
}

/** The whole screen with the picked part outlined, as Marker.io and Jam send it. */
export function outline(blob: Blob, bounds: DOMRect, viewport: Size) {
  return draw(blob, viewport, (image, scale) => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.drawImage(image, 0, 0);
    const box = visible(bounds, viewport);
    if (!box) return canvas;
    const gap = 3 * scale;
    const rect = [
      box.left * scale - gap,
      box.top * scale - gap,
      box.width * scale + gap * 2,
      box.height * scale + gap * 2,
    ] as const;
    context.lineJoin = "round";
    context.strokeStyle = "rgba(255, 255, 255, 0.9)";
    context.lineWidth = 6 * scale;
    context.strokeRect(...rect);
    context.strokeStyle = MARK_COLOR;
    context.lineWidth = 3 * scale;
    context.strokeRect(...rect);
    return canvas;
  });
}
