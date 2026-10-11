// The element (`<luh-notes>`, from NAME): the one controller. It owns the picker, the note window and
// the screenshot, and hands every note to the site's one hook.
import { captureScreen, cropTo, outline } from "./capture";
import { describe, elementName, hostDialog, pageContext } from "./context";
import { h, hideFromTop, showOnTop } from "./dom";
import { NAME } from "./name";
import { Picker, typing } from "./picker";
import { STRINGS, resolveStrings, type Strings } from "./strings";
import { CSS, PAGE_CSS } from "./styles";
import type {
  CommentModeEventMap,
  CommentModeOptions,
  CommentModeState,
  Note,
  NoteContext,
  OpenOptions,
} from "./types";
import { NoteWindow } from "./window";

/** Marks the library's own elements: never picked, never in a screenshot. */
export const OWN = `[data-${NAME}]`;

export class CommentModeElement extends HTMLElement {
  static observedAttributes = ["submit-url", "key", "app-version", "ignore"];

  private settings: CommentModeOptions = {};
  private strings: Strings = STRINGS;
  private picker!: Picker;
  private window!: NoteWindow;
  private windowHost = h("div", { [`data-${NAME}`]: "window" });
  private announcer = h("p", { class: "cm-sr", role: "status" });
  private toast = h("p", { class: "cm-toast", popover: "manual", role: "status", hidden: true });
  private ready = false;
  private capturing = false;
  private captureSequence = 0;
  private returnFocus: HTMLElement | null = null;
  // The picked element and the elements that hold it, for Wider and Narrower,
  // each with where it last sat: a pick that leaves the page keeps that.
  private lineage: { element: Element; bounds: DOMRect }[] = [];
  // The last screenshot as taken, so Wider and Narrower re-mark it.
  private shot: { raw: Blob; viewport: { width: number; height: number } } | null = null;
  // Options changed while a note was open wait until it closes.
  private stale = false;
  private step = 0;
  private context: NoteContext | null = null;
  private via: "write" | "pick" = "write";
  private watcher: MutationObserver | null = null;
  private toastTimer = 0;

  addEventListener<K extends keyof CommentModeEventMap>(
    type: K,
    listener: (this: CommentModeElement, event: CommentModeEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ) {
    if (listener) super.addEventListener(type, listener, options);
  }

  /** Current host permission. Callback failures fail closed. */
  get allowed(): boolean {
    try {
      return typeof this.settings.allowed === "function"
        ? this.settings.allowed()
        : this.settings.allowed !== false;
    } catch {
      return false;
    }
  }

  /** Sets options; may be called again to change them (words, kinds, hooks). */
  configure(options: CommentModeOptions) {
    this.settings = { ...this.settings, ...options };
    this.strings = resolveStrings(
      this.settings.language ?? document.documentElement.lang ?? "en",
      this.settings.languages,
      this.settings.strings,
    );
    // Rebuilding would drop the note being written; it waits for the close.
    if (this.ready && this.isOpen) this.stale = true;
    else if (this.ready) this.build();
    return this;
  }

  get options(): Readonly<CommentModeOptions> {
    return this.settings;
  }

  /** Elements never picked and never in a screenshot: the site's and the library's own. */
  get ignore() {
    return [OWN, this.settings.ignore ?? this.getAttribute("ignore")].filter(Boolean).join(", ");
  }

  connectedCallback() {
    if (this.ready) return;
    this.ready = true;
    this.setAttribute(`data-${NAME}`, "");
    if (!document.getElementById(`${NAME}-page-style`)) {
      const style = h("style", { id: `${NAME}-page-style` });
      style.textContent = PAGE_CSS;
      document.head.append(style);
    }
    this.build();
    document.addEventListener("keydown", this.onKey, { capture: true });
  }

  disconnectedCallback() {
    // Moving the element keeps it working; only leaving the page tears it down.
    queueMicrotask(() => {
      if (this.isConnected) return;
      this.active = false;
      this.window?.close();
      window.clearTimeout(this.toastTimer);
      hideFromTop(this.toast);
      this.windowHost.remove();
      document.removeEventListener("keydown", this.onKey, { capture: true });
      this.ready = false;
    });
  }

  attributeChangedCallback() {
    if (this.ready && this.isOpen) this.stale = true;
    else if (this.ready) this.build();
  }

  private shadow() {
    const root = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    root.replaceChildren(h("style", {}, CSS), this.announcer, this.toast);
    const windowRoot = this.windowHost.shadowRoot ?? this.windowHost.attachShadow({ mode: "open" });
    windowRoot.replaceChildren(h("style", {}, CSS));
    return { root, windowRoot };
  }

  // (Re)builds the picker and window with the current words and options.
  private build() {
    this.stale = false;
    const wasActive = this.picker?.active ?? false;
    if (this.picker) this.picker.active = false;
    const { root, windowRoot } = this.shadow();
    this.picker = new Picker(root, {
      strings: this.strings,
      ignore: this.ignore,
      paused: () => this.isOpen || this.capturing,
      pick: (element, words) => this.open({ element, selectedText: words }),
    });
    const language = this.settings.language ?? document.documentElement.lang ?? "en";
    windowRoot.host.setAttribute("lang", language);
    this.setAttribute("lang", language);
    this.window = new NoteWindow(windowRoot, {
      strings: this.strings,
      name: this.settings.name ?? "off",
      screenshot: this.settings.screenshot !== false,
      drawing: this.settings.drawing !== false,
      kinds: this.settings.kinds ?? [],
      finePrint: this.settings.finePrint,
      remark: () => this.remark(),
      maxImages: this.settings.maxImages ?? 8,
      maxImageBytes: this.settings.maxImageBytes ?? 10 * 1024 * 1024,
      capture: () => this.capture(),
      screenshotNote: () => this.settings.screenshotNote?.() ?? null,
      widen: (delta) => this.widen(delta),
      widenState: () => ({ wider: this.step < this.lineage.length - 1, narrower: this.step > 0 }),
      pickedText: () => this.context?.element?.text ?? "",
      send: (parts) => this.send(parts),
      closed: () => this.closed(),
      opener: () =>
        this.returnFocus?.isConnected ? this.returnFocus.getBoundingClientRect() : null,
      anchor: () => this.where(this.lineage[this.step]) ?? null,
    });
    this.picker.active = wasActive && this.allowed && this.settings.elementPicking !== false;
    if (!this.windowHost.isConnected) document.body.append(this.windowHost);
  }

  /** Comment mode is on: the next click picks. */
  get active() {
    return this.picker?.active ?? false;
  }

  set active(value: boolean) {
    if (value && (!this.allowed || this.settings.elementPicking === false)) value = false;
    if (!this.picker || value === this.picker.active) return;
    this.picker.active = value;
    this.announce(value ? this.strings.modeOn : this.strings.modeOff);
    this.changed();
  }

  toggle(force?: boolean) {
    this.active = force ?? !this.active;
  }

  get isOpen() {
    return this.window?.isOpen ?? false;
  }

  get state(): CommentModeState {
    return { active: this.active, open: this.isOpen, capturing: this.capturing };
  }

  /**
   * Opens the note window: on its own (Send feedback), or as a comment on an
   * element. A dialog the opener sits in hosts the window, so the dialog's
   * focus trap and outside-click rules leave it working.
   */
  open(options: OpenOptions = {}) {
    if (!this.ready || !this.allowed || (options.element && this.settings.elementPicking === false))
      return;
    if (this.isOpen) {
      if (this.windowHost.isConnected) return this.window.panel.querySelector("textarea")?.focus();
      this.window.close();
    }
    const from = options.from;
    const origin =
      from instanceof Event
        ? from.currentTarget instanceof Element
          ? from.currentTarget
          : null
        : (from ?? null);
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.returnFocus = origin instanceof HTMLElement ? origin : active;
    const element = options.element ?? null;
    const dialog = hostDialog(element ?? origin, this.ignore);
    (dialog ?? document.body).append(this.windowHost);
    this.lineage = [];
    for (let node = element; node && node !== document.body; node = node.parentElement)
      this.lineage.push({ element: node, bounds: node.getBoundingClientRect() });
    this.step = 0;
    this.shot = null;
    this.via = element ? "pick" : "write";
    // Only words the person picked travel, shown as a quote; words left
    // selected on the page when Send feedback opens are never sent unseen.
    const selectedText = options.selectedText ?? "";
    this.context = {
      ...pageContext({
        appVersion: this.settings.appVersion ?? this.getAttribute("app-version") ?? undefined,
        extra: this.settings.context?.() ?? {},
        dialog,
      }),
      ...(element ? { element: describe(element, this.strings) } : {}),
      ...(selectedText ? { selectedText } : {}),
    };
    this.window.open({
      via: this.via,
      name: element ? elementName(element, this.strings) : undefined,
      selectedText: options.selectedText,
      pickedText: this.context.element?.text,
    });
    this.picker.pin(element);
    // A dialog that closes takes the window with it.
    this.watcher = new MutationObserver(() => {
      if (!this.windowHost.isConnected) this.window.close();
    });
    this.watcher.observe(document.body, { childList: true, subtree: true });
    this.changed();
    this.dispatchEvent(new CustomEvent<NoteContext>("open", { detail: this.context }));
  }

  /** Closes the window, dropping the note. */
  close() {
    this.window?.close();
  }

  private closed() {
    this.watcher?.disconnect();
    this.watcher = null;
    this.picker.pin(null);
    this.lineage = [];
    this.shot = null;
    this.context = null;
    document.body.append(this.windowHost);
    const target = this.returnFocus;
    this.returnFocus = null;
    requestAnimationFrame(() => {
      if (target?.isConnected) target.focus({ preventScroll: true });
    });
    if (this.stale) this.build();
    this.changed();
    this.dispatchEvent(new CustomEvent<CommentModeState>("close", { detail: this.state }));
  }

  private widen(delta: number) {
    this.step = Math.max(0, Math.min(this.lineage.length - 1, this.step + delta));
    const element = this.lineage[this.step]?.element;
    if (!element || !this.context) return null;
    this.context = { ...this.context, element: describe(element, this.strings) };
    this.picker.pin(element);
    return elementName(element, this.strings);
  }

  /** Where a lineage entry sits now, or where it last sat if it has left the page. */
  private where(entry: { element: Element; bounds: DOMRect } | undefined) {
    if (!entry) return undefined;
    const now = entry.element.isConnected ? entry.element.getBoundingClientRect() : null;
    if (now && now.width && now.height) entry.bounds = now;
    return entry.bounds;
  }

  /** Takes the page as it is now, with the pick outlined, and the pick on its own. */
  private async capture(): Promise<{ page: File | null; element: File | null }> {
    const sequence = ++this.captureSequence;
    const context = this.context;
    this.capturing = true;
    this.changed();
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    // Measured as the picture is taken, since the page may have scrolled.
    this.lineage.forEach((entry) => this.where(entry));
    try {
      const raw = await captureScreen(this.ignore, (percent) =>
        this.window.captureProgress(percent),
      );
      if (!raw || this.context !== context || sequence !== this.captureSequence)
        return { page: null, element: null };
      this.shot = { raw, viewport };
      return await this.marked();
    } finally {
      if (sequence === this.captureSequence) {
        this.capturing = false;
        this.changed();
      }
    }
  }

  /** The last screenshot marked for the pick as it is now (after Wider or Narrower). */
  private remark() {
    return this.shot ? this.marked() : Promise.resolve(null);
  }

  private async marked() {
    const { raw, viewport } = this.shot!;
    const bounds = this.lineage[this.step]?.bounds;
    const [page, part] = bounds
      ? await Promise.all([outline(raw, bounds, viewport), cropTo(raw, bounds, viewport)])
      : [raw, null];
    const file = (blob: Blob | null, name: string) =>
      blob ? new File([blob], name, { type: "image/png" }) : null;
    return { page: file(page ?? raw, "page.png"), element: file(part, "element.png") };
  }

  private async send(parts: {
    body: string;
    name: string | null;
    kind: string | null;
    screenshot: File | null;
    images: File[];
  }) {
    if (!this.allowed) return this.strings.notAllowed;
    if (!this.context) return this.strings.failed;
    const note: Note = { via: this.via, ...parts, context: this.context };
    const result = this.settings.onSubmit
      ? await this.settings.onSubmit(note)
      : await post(this.settings.submitUrl ?? this.getAttribute("submit-url"), note, this.strings);
    if (result && typeof result === "object" && "error" in result)
      return result.error || this.strings.failed;
    if (this.context === note.context && this.settings.thanks !== false)
      this.say(this.strings.sent);
    this.dispatchEvent(new CustomEvent<Note>("sent", { detail: note }));
    return null;
  }

  private onKey = (event: KeyboardEvent) => {
    if (!this.allowed) {
      this.active = false;
      return;
    }
    if (this.window?.editing) return;
    if (this.isOpen) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.window.escape();
      }
      return;
    }
    if (this.capturing) return;
    const key = this.settings.key ?? this.getAttribute("key") ?? "c";
    const plain = !event.metaKey && !event.ctrlKey && !event.altKey;
    if (
      key &&
      plain &&
      typeof key === "string" &&
      event.key.toLowerCase() === key.toLowerCase() &&
      !typing(event.composedPath()[0] ?? event.target)
    ) {
      event.preventDefault();
      this.toggle();
      return;
    }
    if (!this.active) return;
    if (event.key === "Escape") {
      // A popover the site keeps open in comment mode (pins on earlier
      // notes, say) closes first.
      if (document.querySelector(`:is(${this.ignore}) [aria-expanded="true"]`)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      this.active = false;
      return;
    }
    if (this.picker.key(event)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  private changed() {
    this.picker.draw();
    this.dispatchEvent(new CustomEvent<CommentModeState>("change", { detail: this.state }));
  }

  private announce(words: string) {
    this.announcer.textContent = "";
    requestAnimationFrame(() => (this.announcer.textContent = words));
  }

  private say(words: string) {
    window.clearTimeout(this.toastTimer);
    this.toast.textContent = words;
    this.toast.hidden = false;
    showOnTop(this.toast);
    this.toastTimer = window.setTimeout(() => {
      this.toast.hidden = true;
      hideFromTop(this.toast);
    }, 3000);
  }
}

/** Posts the note as multipart form data; see the README for the fields. */
async function post(url: string | null | undefined, note: Note, strings: Strings) {
  if (!url) return { error: strings.failed };
  const data = new FormData();
  data.append("body", note.body);
  if (note.name) data.append("name", note.name);
  if (note.kind) data.append("kind", note.kind);
  data.append("via", note.via);
  data.append("context", JSON.stringify(note.context));
  if (note.screenshot) data.append("screenshot", note.screenshot);
  note.images.forEach((image) => data.append("images[]", image));
  try {
    const response = await fetch(url, { method: "POST", body: data, credentials: "same-origin" });
    if (response.ok) return undefined;
    const answer = await response.json().catch(() => null);
    return {
      error: (answer && typeof answer.error === "string" && answer.error) || strings.failed,
    };
  } catch {
    return { error: strings.failed };
  }
}
