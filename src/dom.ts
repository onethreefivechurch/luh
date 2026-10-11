// A small element builder: the library has no framework, and its few screens
// are built once and updated in place.
type Child = Node | string | null | undefined | false;
type Attributes = Record<string, string | number | boolean | null | undefined | EventListener>;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: Attributes = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  apply(element, attributes);
  append(element, children);
  return element;
}

const SVG = "http://www.w3.org/2000/svg";
export function s<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attributes: Attributes = {},
  ...children: Child[]
): SVGElementTagNameMap[K] {
  const element = document.createElementNS(SVG, tag);
  apply(element, attributes);
  append(element, children);
  return element;
}

function apply(element: Element, attributes: Attributes) {
  for (const [name, value] of Object.entries(attributes)) {
    if (typeof value === "function") element.addEventListener(name.slice(2), value);
    else if (value === true) element.setAttribute(name, "");
    else if (value !== false && value !== null && value !== undefined)
      element.setAttribute(name, String(value));
  }
}

function append(element: Element, children: Child[]) {
  for (const child of children) if (child || child === "") element.append(child);
}

// Icons from Lucide (ISC licence), drawn at 24 and shown at 16 or 18.
const ICONS = {
  close: "M18 6 6 18M6 6l12 12",
  camera:
    "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  image:
    "M21 15l-5-5L5 21M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  pen: "M12 20h9M16.4 3.6a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
  send: "M14.5 21.7a.5.5 0 0 0 .9 0l6.5-19a.5.5 0 0 0-.6-.6l-19 6.5a.5.5 0 0 0 0 .9l7.9 3.2a2 2 0 0 1 1.1 1.1zM21.9 2.1 10.9 13.1",
  up: "M18 15l-6-6-6 6",
  down: "M6 9l6 6 6-6",
  arrow: "M5 19 19 5M9 5h10v10",
  box: "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  text: "M4 7V4h16v3M9 20h6M12 4v16",
  blur: "M3 3h4v4H3zM10 3h4v4h-4zM17 3h4v4h-4zM3 10h4v4H3zM17 10h4v4h-4zM3 17h4v4H3zM10 17h4v4h-4zM17 17h4v4h-4zM10 10h4v4h-4z",
  crop: "M6 2v14a2 2 0 0 0 2 2h14M18 22V8a2 2 0 0 0-2-2H2",
  undo: "M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11",
  redo: "M15 14l5-5-5-5M20 9H9.5a5.5 5.5 0 0 0 0 11H13",
  trash: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  grip: "M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01",
};
export type IconName = keyof typeof ICONS;

export function icon(name: IconName): SVGSVGElement {
  return s(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      class: "cm-icon",
    },
    s("path", { d: ICONS[name] }),
  );
}

/** Shows an element in the top layer, above any page z-index, where the browser can. */
export function showOnTop(element: HTMLElement) {
  if (typeof element.showPopover === "function" && !element.matches(":popover-open"))
    try {
      element.showPopover();
    } catch {
      // Not connected yet, or no popover support: it stays in the page's layers.
    }
}

export function hideFromTop(element: HTMLElement) {
  if (typeof element.hidePopover === "function")
    try {
      if (element.matches(":popover-open")) element.hidePopover();
    } catch {
      // Nothing to hide.
    }
}

export const apple = () => /Mac|iPhone|iPad/.test(navigator.platform);
export const finePointer = () => window.matchMedia?.("(pointer: fine)").matches ?? true;
