// Picking, as Vercel's toolbar and Figma do it: the thing under the pointer
// (or keyboard focus) is outlined and named, ↑ and ↓ widen or narrow the
// pick, a click opens the note window at it, and selecting words comments on
// those words. The page underneath does nothing while picking: presses and
// clicks stop here, though a drag still selects text.
import { elementName, selectedWords as words } from "./context";
import { NAME } from "./name";
import { finePointer, h, hideFromTop, showOnTop } from "./dom";
import type { Strings } from "./strings";

const INTERACTIVE =
  'button, a, input, textarea, select, label, summary, [role="button"], [role="tab"], [role="checkbox"], [role="radio"], [role="switch"], [role="menuitem"], [role="option"], [role="link"]';

export interface PickerHost {
  strings: Strings;
  ignore: string;
  /** Picking pauses while this is true (the window is open, a screenshot is being taken). */
  paused(): boolean;
  pick(element: Element, selectedText: string): void;
}

export class Picker {
  private hovered: Element | null = null;
  // Elements stepped up from with ↑, so ↓ comes back down the same way.
  private narrower: Element[] = [];
  private pinned: Element | null = null;
  private on = false;
  private readonly outline = h("div", {
    class: "cm-outline",
    popover: "manual",
    hidden: true,
    "aria-hidden": "true",
  });
  private readonly name = h("span", { class: "cm-outline-name" });
  private cleanups: (() => void)[] = [];

  constructor(
    root: ShadowRoot,
    private readonly host: PickerHost,
  ) {
    this.outline.append(this.name);
    root.append(this.outline);
  }

  get active() {
    return this.on;
  }

  set active(value: boolean) {
    if (value === this.on) return;
    this.on = value;
    if (value) this.listen();
    else {
      this.cleanups.forEach((cleanup) => cleanup());
      this.cleanups = [];
      this.hover(null);
    }
    this.draw();
  }

  private get picking() {
    return this.on && !this.host.paused();
  }

  /** Keeps a picked element outlined while its note is written. */
  pin(element: Element | null) {
    this.pinned = element;
    this.draw();
  }

  /** The element to pick for a target under the pointer, or null for none. */
  target(from: EventTarget | null): Element | null {
    if (!(from instanceof Element) || from.closest(this.host.ignore)) return null;
    return (
      from.closest(INTERACTIVE) ??
      (from instanceof SVGElement ? (from.closest("svg")?.parentElement ?? from) : from)
    );
  }

  private hover(element: Element | null) {
    if (
      element === this.hovered ||
      (element && this.hovered?.contains(element) && this.narrower.length)
    )
      return;
    this.hovered = element;
    this.narrower = [];
    this.draw();
  }

  private choose(element: Element, selected = "") {
    this.host.pick(element, selected);
  }

  /** Redraws the outline over the pinned or hovered element. */
  draw() {
    document.documentElement.classList.toggle(`${NAME}-picking`, this.picking);
    const shown = this.pinned ?? (this.picking ? this.hovered : null);
    const box = shown?.isConnected ? shown.getBoundingClientRect() : null;
    if (!shown || !box) {
      this.outline.hidden = true;
      hideFromTop(this.outline);
      return;
    }
    Object.assign(this.outline.style, {
      left: `${box.left}px`,
      top: `${box.top}px`,
      width: `${box.width}px`,
      height: `${box.height}px`,
    });
    this.outline.classList.toggle("cm-pinned", !!this.pinned);
    const label = this.pinned ? "" : elementName(shown, this.host.strings);
    this.name.textContent =
      label && finePointer() ? `${label} · ${this.host.strings.pickHint}` : label;
    this.name.hidden = !label;
    this.name.classList.toggle("cm-below", box.top < 28);
    this.outline.hidden = false;
    showOnTop(this.outline);
  }

  private listen() {
    const on = <K extends keyof DocumentEventMap>(
      type: K,
      listener: (event: DocumentEventMap[K]) => void,
      capture = true,
    ) => {
      document.addEventListener(type, listener, { capture });
      this.cleanups.push(() => document.removeEventListener(type, listener, { capture }));
    };
    on("pointermove", (event) => {
      if (this.picking) this.hover(this.target(event.target));
    });
    // Focus moves the outline only from the keyboard: a press on words can
    // focus a container (a page's main area), which is not what was pointed at.
    let pressing = false;
    on("focusin", (event) => {
      if (this.picking && !pressing) this.hover(this.target(event.target));
    });
    on("pointerup", () => setTimeout(() => (pressing = false)));
    // Presses never reach the page, so menus and drags stay still; on text a
    // press keeps its default, so a drag can select words to comment on.
    // Words selected before the press (left over from earlier) never count
    // as the words this press picked.
    let before = "";
    const hold = (event: Event) => {
      if (!this.picking) return;
      const target = this.target(event.target);
      if (!target) return;
      if (event.type === "pointerdown") {
        before = words();
        pressing = true;
      }
      event.stopImmediatePropagation();
      if (target.matches(INTERACTIVE) || target.closest('[draggable="true"]'))
        event.preventDefault();
    };
    on("pointerdown", hold);
    on("mousedown", hold);
    on("touchstart", hold);
    on("click", (event) => {
      if (!this.picking) return;
      const under = this.target(event.target);
      if (!under) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const selection = document.getSelection();
      const picked = words();
      if (picked && picked !== before && selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        const common = range.commonAncestorContainer;
        const element = common instanceof Element ? common : common.parentElement;
        if (element && range.intersectsNode(under) && !element.closest(this.host.ignore))
          return this.choose(element, picked);
      }
      // A pick widened with ↑ holds while the pointer stays inside it.
      this.choose(this.narrower.length && this.hovered?.contains(under) ? this.hovered : under);
    });
    // Also stop the page acting on the press's other events.
    for (const type of ["pointerup", "mouseup", "dblclick", "auxclick", "contextmenu"] as const)
      on(type, (event) => {
        if (this.picking && this.target(event.target)) event.stopImmediatePropagation();
      });
    const measure = () => this.draw();
    window.addEventListener("scroll", measure, { capture: true, passive: true });
    window.addEventListener("resize", measure, { passive: true });
    this.cleanups.push(() => {
      window.removeEventListener("scroll", measure, { capture: true });
      window.removeEventListener("resize", measure);
    });
  }

  /** The picker's keys, while comment mode is on: ↑ ↓ to widen, Enter to pick. */
  key(event: KeyboardEvent): boolean {
    if (!this.picking) return false;
    const hovered = this.hovered;
    if (
      event.key === "ArrowUp" &&
      hovered?.parentElement &&
      hovered.parentElement !== document.body
    ) {
      this.narrower = [...this.narrower, hovered];
      this.hovered = hovered.parentElement;
      this.draw();
      return true;
    }
    if (event.key === "ArrowDown" && this.narrower.length) {
      this.hovered = this.narrower.at(-1)!;
      this.narrower = this.narrower.slice(0, -1);
      this.draw();
      return true;
    }
    if (
      (event.key === "Enter" || event.key === " ") &&
      hovered &&
      !typing(event.composedPath()[0] ?? event.target)
    ) {
      this.choose(hovered);
      return true;
    }
    return false;
  }
}

export function typing(element: EventTarget | null) {
  return (
    element instanceof HTMLElement &&
    (element.isContentEditable || element.matches("input, textarea, select"))
  );
}
