import { finder } from "@medv/finder";
import { format, type Strings } from "./strings";
import type { NoteContext, PickedElement } from "./types";

const KINDS: Record<string, keyof Strings> = {
  a: "link",
  button: "button",
  input: "field",
  textarea: "field",
  select: "choice",
  label: "label",
  img: "image",
  svg: "icon",
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  p: "textKind",
  span: "textKind",
  li: "row",
  tr: "row",
  td: "cell",
  th: "cell",
  table: "table",
  ul: "list",
  ol: "list",
  nav: "menu",
  form: "form",
};

const ROLES: Record<string, keyof Strings> = {
  button: "button",
  link: "link",
  textbox: "field",
  searchbox: "field",
  combobox: "choice",
  listbox: "choice",
  checkbox: "choice",
  radio: "choice",
  switch: "choice",
  slider: "field",
  spinbutton: "field",
  heading: "heading",
  img: "image",
  row: "row",
  cell: "cell",
  gridcell: "cell",
  columnheader: "cell",
  rowheader: "cell",
  table: "table",
  grid: "table",
  list: "list",
  listitem: "row",
  menu: "menu",
  menubar: "menu",
  menuitem: "button",
  tab: "button",
  tablist: "menu",
  form: "form",
  navigation: "menu",
};

const typed = (element: Element) => element.matches("input, textarea, select");
const squash = (text: string | null | undefined) => (text ?? "").replace(/\s+/g, " ").trim();

/** A short name for an element, as the picker and the window show it: Button “Save”. */
export function elementName(element: Element, strings: Strings): string {
  const label =
    element.getAttribute("aria-label") ?? (typed(element) ? "" : squash(element.textContent));
  const role = element.getAttribute("role");
  const kind = role
    ? strings[ROLES[role.toLowerCase()] ?? "area"]
    : strings[KINDS[element.tagName.toLowerCase()] ?? "area"];
  const short = label.length > 32 ? `${label.slice(0, 31)}…` : label;
  return short ? format(strings.named, { kind, label: short }) : kind;
}

/** The element as a note records it: a selector that finds it again, and its words. */
export function describe(element: Element, strings: Strings): PickedElement {
  let selector = "";
  try {
    // Stable names first: test ids, roles, labels and hand-written ids. Ids
    // with digits are usually generated per render and never match twice.
    selector = finder(element, {
      timeoutMs: 100,
      attr: (name, value) =>
        ["data-testid", "role", "aria-label"].includes(name) ||
        (name === "id" && !/\d/.test(value)),
      className: () => false,
    });
  } catch {
    selector = element.id ? `#${CSS.escape(element.id)}` : element.tagName.toLowerCase();
  }
  return {
    selector: selector.slice(0, 1000),
    id: element.id.slice(0, 300),
    // Typed words stay out: a field may hold someone's details.
    text: typed(element)
      ? (element.getAttribute("aria-label") ?? "").slice(0, 300)
      : squash(element.textContent).slice(0, 300),
    role: element.getAttribute("role") ?? element.tagName.toLowerCase(),
    name: elementName(element, strings),
  };
}

/** The dialog's title, from aria-labelledby or aria-label, or undefined. */
export function dialogTitle(dialog: Element | null | undefined): string | undefined {
  if (!dialog) return undefined;
  const labelledBy = dialog.getAttribute("aria-labelledby");
  const title = labelledBy
    ? dialog.ownerDocument.getElementById(labelledBy)?.textContent
    : dialog.getAttribute("aria-label");
  return squash(title).slice(0, 100) || undefined;
}

/** The open modal dialog an element sits in, or the topmost open one. */
export function hostDialog(from: Element | null | undefined, ignore: string): HTMLElement | null {
  const DIALOG =
    'dialog[open], [role="dialog"][aria-modal="true"], [role="dialog"][data-state="open"]';
  let origin = from;
  let own: Element | null = null;
  while (origin && !own) {
    own = origin.closest(DIALOG);
    const root = origin.getRootNode();
    origin = root instanceof ShadowRoot ? root.host : null;
  }
  if (own instanceof HTMLElement && !own.closest(ignore)) return own;
  const open = [...document.querySelectorAll<HTMLElement>(DIALOG)].filter(
    (dialog) => !dialog.closest(ignore) && dialog.getClientRects().length > 0,
  );
  return open.at(-1) ?? null;
}

export function pageContext(options: {
  appVersion?: string;
  extra: Record<string, string>;
  dialog?: Element | null;
}): NoteContext {
  const root = document.documentElement;
  const dark =
    root.classList.contains("dark") ||
    root.dataset.theme === "dark" ||
    getComputedStyle(root).colorScheme === "dark";
  return {
    url: location.href,
    path: location.pathname,
    title: document.title,
    language: root.lang || navigator.language,
    screen: {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1,
    },
    colorScheme: dark ? "dark" : "light",
    ...(options.appVersion ? { appVersion: options.appVersion } : {}),
    capturedAt: new Date().toISOString(),
    ...(dialogTitle(options.dialog) ? { dialog: dialogTitle(options.dialog) } : {}),
    extra: options.extra,
  };
}

/** The words selected on the page, up to 1000 characters. */
export function selectedWords(): string {
  const selection = document.getSelection();
  return selection && !selection.isCollapsed ? squash(selection.toString()).slice(0, 1000) : "";
}
